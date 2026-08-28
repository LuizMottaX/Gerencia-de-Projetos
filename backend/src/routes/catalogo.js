// Rotas auxiliares do catálogo: categorias e modelos de veículo
// (usadas para montar os filtros no frontend).

const { Router } = require('express');
const prisma = require('../lib/prisma');

const router = Router();

/** GET /api/categorias — todas as categorias, opcionalmente filtradas por ?tipo=peca|acessorio */
router.get('/categorias', async (req, res, next) => {
  try {
    const where = {};
    if (req.query.tipo) where.tipo = String(req.query.tipo).toUpperCase();

    const categorias = await prisma.categoria.findMany({
      where,
      orderBy: { nome: 'asc' },
    });

    res.json(
      categorias.map((c) => ({ slug: c.slug, nome: c.nome, tipo: c.tipo.toLowerCase() })),
    );
  } catch (err) {
    next(err);
  }
});

/** GET /api/modelos — modelos de veículo para o filtro de compatibilidade. */
router.get('/modelos', async (req, res, next) => {
  try {
    const modelos = await prisma.modeloVeiculo.findMany({
      orderBy: [{ marca: 'asc' }, { modelo: 'asc' }],
    });
    res.json(
      modelos.map((m) => ({ slug: m.slug, nome: `${m.marca} ${m.modelo}` })),
    );
  } catch (err) {
    next(err);
  }
});

module.exports = router;
