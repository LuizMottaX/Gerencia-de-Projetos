const { Router } = require('express');
const prisma = require('../lib/prisma');
const { carroView } = require('../lib/carroView');
const { produtoView } = require('../lib/produtoView');

const router = Router();
const carroInclude = { marca: true, imagens: true, modeloVeiculo: true };

/** GET /api/carros — lista todos os veículos. */
router.get('/', async (req, res, next) => {
  try {
    const carros = await prisma.carro.findMany({
      include: carroInclude,
      orderBy: { criadoEm: 'asc' },
    });
    res.json(carros.map(carroView));
  } catch (err) {
    next(err);
  }
});

/** GET /api/carros/:id — detalhe de um veículo pelo slug. */
router.get('/:id', async (req, res, next) => {
  try {
    const carro = await prisma.carro.findUnique({
      where: { slug: req.params.id },
      include: carroInclude,
    });
    if (!carro) return res.status(404).json({ erro: 'Veículo não encontrado.' });
    res.json(carroView(carro));
  } catch (err) {
    next(err);
  }
});

/** GET /api/carros/:id/pecas — peças compatíveis com o modelo deste veículo. */
router.get('/:id/pecas', async (req, res, next) => {
  try {
    const carro = await prisma.carro.findUnique({
      where: { slug: req.params.id },
      select: { modeloVeiculoId: true },
    });
    if (!carro) return res.status(404).json({ erro: 'Veículo não encontrado.' });
    if (!carro.modeloVeiculoId) return res.json({ total: 0, itens: [] });

    const produtos = await prisma.produto.findMany({
      where: {
        tipo: 'PECA',
        compatibilidades: { some: { modeloVeiculoId: carro.modeloVeiculoId } },
      },
      orderBy: { nome: 'asc' },
      include: {
        categoria: true,
        compatibilidades: { include: { modeloVeiculo: true } },
      },
    });

    res.json({ total: produtos.length, itens: produtos.map(produtoView) });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
