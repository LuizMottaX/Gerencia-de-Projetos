const crypto = require('node:crypto');
const { Router } = require('express');
const { z } = require('zod');
const rateLimit = require('express-rate-limit');
const prisma = require('../lib/prisma');
const { pedidoView } = require('../lib/pedidoView');
const { ErroHttp } = require('../middleware/errors');

const router = Router();

// No máximo 10 pedidos a cada 10 minutos por IP — evita spam de pedidos falsos.
const limitador = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === 'test', // os testes disparam vários pedidos em sequência
  message: { erro: 'Muitos pedidos em pouco tempo. Tente novamente em alguns minutos.' },
});

const schemaPedido = z.object({
  cliente: z.object({
    nome: z.string().trim().min(2, 'Informe seu nome.').max(120),
    email: z.string().trim().toLowerCase().email('E-mail inválido.').max(160),
    telefone: z.string().trim().min(8, 'Telefone inválido.').max(30),
  }),
  itens: z
    .array(
      z.object({
        produto: z.string().trim().min(1), // slug do produto (= `produto.id` na API)
        quantidade: z.number().int().min(1).max(99),
      }),
    )
    .min(1, 'O carrinho está vazio.')
    .max(50),
});

const pedidoInclude = { cliente: true, itens: { include: { produto: true } } };

// Sem 0/O/1/I para o código ser fácil de ditar por telefone.
const ALFABETO = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
function gerarCodigo() {
  const bytes = crypto.randomBytes(6);
  return 'CM-' + Array.from(bytes, (b) => ALFABETO[b % ALFABETO.length]).join('');
}

/** Soma quantidades de itens repetidos: [{produto:'a',quantidade:1},{produto:'a',quantidade:2}] → a: 3. */
function agruparItens(itens) {
  const mapa = new Map();
  for (const { produto, quantidade } of itens) {
    mapa.set(produto, (mapa.get(produto) ?? 0) + quantidade);
  }
  return mapa;
}

/**
 * POST /api/pedidos — cria o pedido numa transação: confere e baixa o estoque,
 * recalcula preços no servidor e grava Pedido + PedidoItem.
 */
router.post('/', limitador, async (req, res, next) => {
  try {
    const { cliente, itens } = schemaPedido.parse(req.body);
    const quantidades = agruparItens(itens);
    const slugs = [...quantidades.keys()];

    const pedido = await prisma.$transaction(async (tx) => {
      const produtos = await tx.produto.findMany({ where: { slug: { in: slugs } } });
      const faltando = slugs.filter((slug) => !produtos.some((p) => p.slug === slug));
      if (faltando.length) {
        throw new ErroHttp(
          404,
          'Produto não encontrado.',
          faltando.map((slug) => ({ campo: 'itens', mensagem: `Produto "${slug}" não existe.` })),
        );
      }

      // Baixa condicional: só decrementa se ainda houver estoque. O UPDATE trava a
      // linha, então dois pedidos simultâneos nunca deixam o estoque negativo.
      for (const produto of produtos) {
        const quantidade = quantidades.get(produto.slug);
        const { count } = await tx.produto.updateMany({
          where: { id: produto.id, estoque: { gte: quantidade } },
          data: { estoque: { decrement: quantidade } },
        });
        if (count === 0) {
          const atual = await tx.produto.findUnique({
            where: { id: produto.id },
            select: { estoque: true },
          });
          throw new ErroHttp(409, 'Estoque insuficiente.', [
            {
              campo: produto.slug,
              mensagem: `"${produto.nome}": pedido de ${quantidade}, disponível ${atual.estoque}.`,
            },
          ]);
        }
      }

      const { id: clienteId } = await tx.cliente.upsert({
        where: { email: cliente.email },
        update: { nome: cliente.nome, telefone: cliente.telefone },
        create: cliente,
      });

      const linhas = produtos.map((p) => ({
        produtoId: p.id,
        quantidade: quantidades.get(p.slug),
        precoUnitCentavos: p.precoCentavos,
      }));
      const totalCentavos = linhas.reduce((s, l) => s + l.precoUnitCentavos * l.quantidade, 0);

      return tx.pedido.create({
        data: { codigo: gerarCodigo(), totalCentavos, clienteId, itens: { create: linhas } },
        include: pedidoInclude,
      });
    });

    res.status(201).json(pedidoView(pedido));
  } catch (err) {
    next(err);
  }
});

/** GET /api/pedidos/:codigo — acompanhamento do pedido pelo código. */
router.get('/:codigo', async (req, res, next) => {
  try {
    const pedido = await prisma.pedido.findUnique({
      where: { codigo: req.params.codigo.toUpperCase() },
      include: pedidoInclude,
    });
    if (!pedido) return res.status(404).json({ erro: 'Pedido não encontrado.' });
    res.json(pedidoView(pedido));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
