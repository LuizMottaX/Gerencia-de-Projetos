const { Router } = require('express');
const { z } = require('zod');
const rateLimit = require('express-rate-limit');
const prisma = require('../lib/prisma');

const router = Router();

// No máximo 5 envios a cada 10 minutos por IP — evita spam no formulário.
const limitador = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { erro: 'Muitas mensagens em pouco tempo. Tente novamente em alguns minutos.' },
});

const schemaContato = z.object({
  nome: z.string().trim().min(2, 'Informe seu nome.').max(120),
  email: z.string().trim().email('E-mail inválido.').max(160),
  telefone: z.string().trim().min(8, 'Telefone inválido.').max(30),
  mensagem: z.string().trim().min(10, 'Escreva uma mensagem com pelo menos 10 caracteres.').max(2000),
});

/** POST /api/contato — registra uma mensagem do formulário de contato. */
router.post('/', limitador, async (req, res, next) => {
  try {
    const dados = schemaContato.parse(req.body);
    const msg = await prisma.mensagemContato.create({ data: dados });
    res.status(201).json({ ok: true, id: msg.id, mensagem: 'Mensagem enviada! Retornaremos em breve.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
