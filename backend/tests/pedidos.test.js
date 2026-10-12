import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import prisma from '../src/lib/prisma.js';

// Produtos próprios dos testes — não mexem no estoque do catálogo do seed.
const SLUG_A = 'teste-pedido-a';
const SLUG_B = 'teste-pedido-b';
const cliente = { nome: 'Maria Teste', email: 'maria.teste@exemplo.com', telefone: '66999990000' };

async function limpar() {
  const produtos = await prisma.produto.findMany({ where: { slug: { in: [SLUG_A, SLUG_B] } } });
  const ids = produtos.map((p) => p.id);
  await prisma.pedido.deleteMany({ where: { itens: { some: { produtoId: { in: ids } } } } });
  await prisma.produto.deleteMany({ where: { id: { in: ids } } });
}

async function criarProduto(slug, { estoque, precoCentavos }) {
  const categoria = await prisma.categoria.findUniqueOrThrow({ where: { slug: 'freios' } });
  return prisma.produto.create({
    data: {
      slug,
      nome: `Produto ${slug}`,
      descricao: 'Produto criado pelos testes.',
      precoCentavos,
      estoque,
      tipo: 'PECA',
      categoriaId: categoria.id,
    },
  });
}

const estoqueDe = async (slug) =>
  (await prisma.produto.findUnique({ where: { slug }, select: { estoque: true } })).estoque;

const pedir = (itens) => request(app).post('/api/pedidos').send({ cliente, itens });

beforeEach(async () => {
  await limpar();
  await criarProduto(SLUG_A, { estoque: 5, precoCentavos: 12990 });
  await criarProduto(SLUG_B, { estoque: 1, precoCentavos: 5000 });
});

afterAll(async () => {
  await limpar();
  await prisma.cliente.deleteMany({ where: { email: cliente.email } });
  await prisma.$disconnect();
});

describe('POST /api/pedidos', () => {
  it('cria o pedido, calcula o total no servidor e baixa o estoque', async () => {
    const res = await pedir([
      { produto: SLUG_A, quantidade: 2 },
      { produto: SLUG_B, quantidade: 1 },
    ]);

    expect(res.status).toBe(201);
    expect(res.body.codigo).toMatch(/^CM-[2-9A-Z]{6}$/);
    expect(res.body.status).toBe('RECEBIDO');
    expect(res.body.total).toBe(309.8); // 2 × 129,90 + 1 × 50,00
    expect(res.body.itens).toHaveLength(2);
    expect(await estoqueDe(SLUG_A)).toBe(3);
    expect(await estoqueDe(SLUG_B)).toBe(0);
  });

  it('soma itens repetidos do mesmo produto', async () => {
    const res = await pedir([
      { produto: SLUG_A, quantidade: 1 },
      { produto: SLUG_A, quantidade: 2 },
    ]);
    expect(res.status).toBe(201);
    expect(res.body.itens[0].quantidade).toBe(3);
    expect(await estoqueDe(SLUG_A)).toBe(2);
  });

  it('retorna 409 com o item e o disponível quando falta estoque, sem baixar nada', async () => {
    const res = await pedir([
      { produto: SLUG_A, quantidade: 1 },
      { produto: SLUG_B, quantidade: 2 },
    ]);

    expect(res.status).toBe(409);
    expect(res.body.detalhes[0].campo).toBe(SLUG_B);
    expect(res.body.detalhes[0].mensagem).toContain('disponível 1');
    // A transação inteira volta: o item A também não pode ter sido baixado.
    expect(await estoqueDe(SLUG_A)).toBe(5);
    expect(await estoqueDe(SLUG_B)).toBe(1);
  });

  it('retorna 404 para produto inexistente', async () => {
    const res = await pedir([{ produto: 'nao-existe', quantidade: 1 }]);
    expect(res.status).toBe(404);
  });

  it('retorna 400 para carrinho vazio ou dados inválidos', async () => {
    const res = await request(app)
      .post('/api/pedidos')
      .send({ cliente: { ...cliente, email: 'x' }, itens: [] });
    expect(res.status).toBe(400);
    expect(res.body.detalhes.map((d) => d.campo)).toEqual(
      expect.arrayContaining(['cliente.email', 'itens']),
    );
  });

  it('pedidos simultâneos do último item: só um passa e o estoque não fica negativo', async () => {
    const respostas = await Promise.all(
      Array.from({ length: 5 }, () => pedir([{ produto: SLUG_B, quantidade: 1 }])),
    );
    const status = respostas.map((r) => r.status).sort();

    expect(status).toEqual([201, 409, 409, 409, 409]);
    expect(await estoqueDe(SLUG_B)).toBe(0);
  });
});

describe('GET /api/pedidos/:codigo', () => {
  it('retorna o pedido pelo código (sem diferenciar maiúsculas)', async () => {
    const { body: criado } = await pedir([{ produto: SLUG_A, quantidade: 1 }]);

    const res = await request(app).get(`/api/pedidos/${criado.codigo.toLowerCase()}`);
    expect(res.status).toBe(200);
    expect(res.body.codigo).toBe(criado.codigo);
    expect(res.body.cliente).toEqual({ nome: 'Maria' });
    expect(res.body.itens[0].produto.id).toBe(SLUG_A);
  });

  it('retorna 404 para código inexistente', async () => {
    const res = await request(app).get('/api/pedidos/CM-ZZZZZZ');
    expect(res.status).toBe(404);
  });
});
