const { Router } = require('express');
const { z } = require('zod');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const prisma = require('../lib/prisma');
const { assinarToken } = require('../lib/jwt');
const { verificarAdmin } = require('../middleware/authAdmin');

const rotas = Router();

// No máximo 10 tentativas de login a cada 15 minutos por IP — dificulta força bruta.
const limitadorLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { erro: 'Muitas tentativas de login. Tente novamente em alguns minutos.' },
});

// Schema de validação do login
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(1, 'Senha é obrigatória'),
});

// POST /api/admin/auth/login
rotas.post('/login', limitadorLogin, async (req, res, next) => {
  try {
    const { email, senha } = loginSchema.parse(req.body);

    const admin = await prisma.administrador.findUnique({
      where: { email },
    });

    if (!admin || !admin.ativo) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    const senhaValida = await bcrypt.compare(senha, admin.senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    const token = assinarToken({ adminId: admin.id, email: admin.email });

    res.json({
      token,
      admin: {
        id: admin.id,
        nome: admin.nome,
        email: admin.email,
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/auth/me (para revalidar sessão no frontend)
rotas.get('/me', verificarAdmin, async (req, res, next) => {
  try {
    const admin = await prisma.administrador.findUnique({
      where: { id: req.adminId },
      select: { id: true, nome: true, email: true, ativo: true },
    });

    if (!admin || !admin.ativo) {
      return res.status(401).json({ erro: 'Administrador não encontrado ou inativo.' });
    }

    res.json({ admin });
  } catch (error) {
    next(error);
  }
});

module.exports = rotas;
