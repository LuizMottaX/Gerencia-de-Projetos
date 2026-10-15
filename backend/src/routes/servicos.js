const { Router } = require('express');
const prisma = require('../lib/prisma');
const { servicoView } = require('../lib/servicoView');

const router = Router();

/** GET /api/servicos — serviços ativos, do mais barato ao mais caro. */
router.get('/', async (req, res, next) => {
  try {
    const servicos = await prisma.servico.findMany({
      where: { ativo: true },
      orderBy: { precoBaseCentavos: 'asc' },
    });
    res.json(servicos.map(servicoView));
  } catch (err) {
    next(err);
  }
});

/** GET /api/servicos/:id — detalhe de um serviço pelo slug. */
router.get('/:id', async (req, res, next) => {
  try {
    const servico = await prisma.servico.findFirst({ where: { slug: req.params.id, ativo: true } });
    if (!servico) return res.status(404).json({ erro: 'Serviço não encontrado.' });
    res.json(servicoView(servico));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
