// Monta e executa a consulta de listagem de produtos (peças ou acessórios)
// a partir dos filtros de query string. Compartilhado por /api/pecas e /api/acessorios.

const prisma = require('./prisma');
const { produtoView } = require('./produtoView');

const ORDENACOES = {
  'preco-asc': { precoCentavos: 'asc' },
  'preco-desc': { precoCentavos: 'desc' },
  nome: { nome: 'asc' },
  recentes: { criadoEm: 'desc' },
};

async function listarProdutos(tipo, query = {}) {
  const { categoria, modelo, busca, precoMin, precoMax, ordenar } = query;

  const where = { tipo };

  if (categoria) {
    where.categoria = { slug: String(categoria) };
  }

  if (modelo) {
    where.compatibilidades = {
      some: { modeloVeiculo: { slug: String(modelo) } },
    };
  }

  if (busca) {
    const termo = String(busca).trim();
    where.OR = [
      { nome: { contains: termo, mode: 'insensitive' } },
      { descricao: { contains: termo, mode: 'insensitive' } },
    ];
  }

  const min = Number.parseFloat(precoMin);
  const max = Number.parseFloat(precoMax);
  if (Number.isFinite(min) || Number.isFinite(max)) {
    where.precoCentavos = {};
    if (Number.isFinite(min)) where.precoCentavos.gte = Math.round(min * 100);
    if (Number.isFinite(max)) where.precoCentavos.lte = Math.round(max * 100);
  }

  const orderBy = ORDENACOES[ordenar] ?? { nome: 'asc' };

  const produtos = await prisma.produto.findMany({
    where,
    orderBy,
    include: {
      categoria: true,
      compatibilidades: { include: { modeloVeiculo: true } },
    },
  });

  return { total: produtos.length, itens: produtos.map(produtoView) };
}

module.exports = { listarProdutos };
