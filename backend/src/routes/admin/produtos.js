const { Router } = require('express');
const { z } = require('zod');
const prisma = require('../../lib/prisma');
const { slugUnico } = require('../../lib/slug');
const { produtoAdminView } = require('../../lib/adminViews');
const { ErroHttp } = require('../../middleware/errors');

const router = Router();
const include = { categoria: true, compatibilidades: true };
const centavos = (reais) => Math.round(reais * 100);

const schemaProduto = z.object({
  nome: z.string().trim().min(2).max(120),
  descricao: z.string().trim().min(5).max(2000),
  preco: z.number().nonnegative().max(1_000_000),
  estoque: z.number().int().min(0).max(100_000),
  sku: z.string().trim().max(40).nullish(),
  tipo: z.enum(['PECA', 'ACESSORIO']),
  categoriaId: z.number().int().positive(),
  imagemUrl: z.string().trim().max(300).nullish(),
  compativelCom: z.array(z.number().int().positive()).max(100).default([]),
});

const id = (req) => z.coerce.number().int().positive().parse(req.params.id);

/** Categoria precisa existir e ser do mesmo tipo do produto (peça/acessório). */
async function validarCategoria(categoriaId, tipo) {
  const categoria = await prisma.categoria.findUnique({ where: { id: categoriaId } });
  if (!categoria || categoria.tipo !== tipo) {
    throw new ErroHttp(400, 'Categoria inválida para este tipo de produto.', [
      { campo: 'categoriaId', mensagem: 'Escolha uma categoria do mesmo tipo.' },
    ]);
  }
}

function dadosProduto(d) {
  return {
    nome: d.nome,
    descricao: d.descricao,
    precoCentavos: centavos(d.preco),
    estoque: d.estoque,
    sku: d.sku || null,
    tipo: d.tipo,
    categoriaId: d.categoriaId,
    imagemUrl: d.imagemUrl || null,
  };
}

/** GET /api/admin/produtos?tipo=PECA&busca=filtro */
router.get('/', async (req, res, next) => {
  try {
    const where = {};
    if (req.query.tipo) where.tipo = String(req.query.tipo).toUpperCase();
    if (req.query.busca) where.nome = { contains: String(req.query.busca), mode: 'insensitive' };
    const produtos = await prisma.produto.findMany({ where, include, orderBy: { nome: 'asc' } });
    res.json(produtos.map(produtoAdminView));
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const produto = await prisma.produto.findUniqueOrThrow({ where: { id: id(req) }, include });
    res.json(produtoAdminView(produto));
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const d = schemaProduto.parse(req.body);
    await validarCategoria(d.categoriaId, d.tipo);
    const produto = await prisma.produto.create({
      data: {
        ...dadosProduto(d),
        slug: await slugUnico(prisma.produto, d.nome),
        compatibilidades: { create: d.compativelCom.map((m) => ({ modeloVeiculoId: m })) },
      },
      include,
    });
    res.status(201).json(produtoAdminView(produto));
  } catch (err) {
    next(err);
  }
});

/** PUT — o slug não muda, para não quebrar links já compartilhados. */
router.put('/:id', async (req, res, next) => {
  try {
    const produtoId = id(req);
    const d = schemaProduto.parse(req.body);
    await validarCategoria(d.categoriaId, d.tipo);
    const produto = await prisma.$transaction(async (tx) => {
      await tx.produtoCompatibilidade.deleteMany({ where: { produtoId } });
      return tx.produto.update({
        where: { id: produtoId },
        data: {
          ...dadosProduto(d),
          compatibilidades: { create: d.compativelCom.map((m) => ({ modeloVeiculoId: m })) },
        },
        include,
      });
    });
    res.json(produtoAdminView(produto));
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.produto.delete({ where: { id: id(req) } });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
