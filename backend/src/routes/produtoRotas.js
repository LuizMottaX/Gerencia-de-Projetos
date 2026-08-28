// Fábrica de rotas para um tipo de produto (PECA ou ACESSORIO).
// Usada por /api/pecas e /api/acessorios — a lógica é idêntica, só muda o tipo.

const { Router } = require('express');
const prisma = require('../lib/prisma');
const { produtoView } = require('../lib/produtoView');
const { listarProdutos } = require('../lib/listarProdutos');

function criarRotasProduto(tipo) {
  const router = Router();
  const rotulo = tipo === 'PECA' ? 'Peça' : 'Acessório';

  /** GET / — lista com filtros: ?categoria= &modelo= &busca= &precoMin= &precoMax= &ordenar= */
  router.get('/', async (req, res, next) => {
    try {
      res.json(await listarProdutos(tipo, req.query));
    } catch (err) {
      next(err);
    }
  });

  /** GET /:id — detalhe pelo slug. */
  router.get('/:id', async (req, res, next) => {
    try {
      const produto = await prisma.produto.findFirst({
        where: { slug: req.params.id, tipo },
        include: {
          categoria: true,
          compatibilidades: { include: { modeloVeiculo: true } },
        },
      });
      if (!produto) return res.status(404).json({ erro: `${rotulo} não encontrado(a).` });
      res.json(produtoView(produto));
    } catch (err) {
      next(err);
    }
  });

  return router;
}

module.exports = { criarRotasProduto };
