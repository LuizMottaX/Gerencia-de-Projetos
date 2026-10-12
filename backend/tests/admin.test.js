import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import request from 'supertest';
import app from '../app.js';
import prisma from '../src/lib/prisma.js';
import { assinarToken } from '../src/lib/jwt.js';
import { dataLocal } from '../src/lib/agenda.js';

// PNG 1×1 transparente.
const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
  'base64',
);
const SUFIXO = `t${Date.now()}`;

let token;
const criados = { carros: [], produtos: [], servicos: [], categorias: [], marcas: [], modelos: [] };
const auth = (req) => req.set('Authorization', `Bearer ${token}`);
const admin = {
  get: (url) => auth(request(app).get(url)),
  post: (url, body) => auth(request(app).post(url)).send(body),
  put: (url, body) => auth(request(app).put(url)).send(body),
  patch: (url, body) => auth(request(app).patch(url)).send(body),
  delete: (url) => auth(request(app).delete(url)),
};

beforeAll(async () => {
  const adm = await prisma.administrador.upsert({
    where: { email: 'painel-teste@chiquinhomotors.com.br' },
    update: { ativo: true },
    create: { nome: 'Painel Teste', email: 'painel-teste@chiquinhomotors.com.br', senha: 'x' },
  });
  token = assinarToken({ adminId: adm.id, email: adm.email });
});

afterAll(async () => {
  await prisma.carro.deleteMany({ where: { id: { in: criados.carros } } });
  await prisma.pedido.deleteMany({
    where: { itens: { some: { produtoId: { in: criados.produtos } } } },
  });
  await prisma.produto.deleteMany({ where: { id: { in: criados.produtos } } });
  await prisma.agendamento.deleteMany({ where: { servicoId: { in: criados.servicos } } });
  await prisma.servico.deleteMany({ where: { id: { in: criados.servicos } } });
  await prisma.categoria.deleteMany({ where: { id: { in: criados.categorias } } });
  await prisma.modeloVeiculo.deleteMany({ where: { id: { in: criados.modelos } } });
  await prisma.marca.deleteMany({ where: { id: { in: criados.marcas } } });
  await prisma.$disconnect();
});

describe('proteção do painel', () => {
  const rotas = [
    ['get', '/api/admin/resumo'],
    ['get', '/api/admin/produtos'],
    ['post', '/api/admin/produtos'],
    ['put', '/api/admin/produtos/1'],
    ['delete', '/api/admin/produtos/1'],
    ['post', '/api/admin/carros'],
    ['delete', '/api/admin/carros/1'],
    ['post', '/api/admin/servicos'],
    ['post', '/api/admin/categorias'],
    ['post', '/api/admin/marcas'],
    ['post', '/api/admin/modelos'],
    ['post', '/api/admin/uploads'],
    ['get', '/api/admin/pedidos'],
    ['patch', '/api/admin/pedidos/CM-XXXXXX/status'],
    ['patch', '/api/admin/agendamentos/AG-XXXXXX/status'],
    ['get', '/api/admin/mensagens'],
  ];

  it.each(rotas)('%s %s retorna 401 sem token', async (metodo, url) => {
    expect((await request(app)[metodo](url)).status).toBe(401);
  });

  it('retorna 401 com token de outro segredo', async () => {
    const res = await request(app)
      .get('/api/admin/resumo')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoxfQ.x');
    expect(res.status).toBe(401);
  });
});

describe('veículos', () => {
  it('admin cadastra um veículo com foto e ele aparece no site público', async () => {
    const upload = await auth(request(app).post('/api/admin/uploads')).attach('imagem', PNG, {
      filename: 'foto.png',
      contentType: 'image/png',
    });
    expect(upload.status).toBe(201);
    expect(upload.body.url).toMatch(/^\/uploads\/[0-9a-f]{24}\.png$/);

    const marca = await prisma.marca.findFirstOrThrow();
    const res = await admin.post('/api/admin/carros', {
      nome: `Onix Teste ${SUFIXO}`,
      modelo: 'Onix LT',
      ano: 2022,
      preco: 79990.5,
      quilometragem: 25000,
      cor: 'Prata',
      combustivel: 'Flex',
      portas: 4,
      cambio: 'Manual',
      carroceria: 'Hatch',
      finalPlaca: 7,
      localizacao: 'Sinop - MT',
      status: 'DISPONIVEL',
      formasPagamento: ['À vista'],
      marcaId: marca.id,
      imagens: [upload.body.url],
    });
    expect(res.status).toBe(201);
    criados.carros.push(res.body.id);

    const publico = await request(app).get(`/api/carros/${res.body.slug}`);
    expect(publico.status).toBe(200);
    expect(publico.body).toMatchObject({
      nome: `Onix Teste ${SUFIXO}`,
      precoFormatado: expect.stringMatching(/79\.990,50/),
      imagemCapa: upload.body.url,
    });

    const imagem = await request(app).get(upload.body.url);
    expect(imagem.status).toBe(200);
    expect(imagem.headers['content-type']).toBe('image/png');
  });

  it('upload recusa formato que não é imagem', async () => {
    const res = await auth(request(app).post('/api/admin/uploads')).attach(
      'imagem',
      Buffer.from('oi'),
      { filename: 'x.html', contentType: 'text/html' },
    );
    expect(res.status).toBe(400);
  });

  it('edita e exclui o veículo', async () => {
    const id = criados.carros[0];
    const atual = (await admin.get(`/api/admin/carros/${id}`)).body;
    const { id: _id, slug: _s, marca: _m, atualizadoEm: _a, ...dados } = atual;

    const editado = await admin.put(`/api/admin/carros/${id}`, { ...dados, status: 'VENDIDO' });
    expect(editado.status).toBe(200);
    expect(editado.body.status).toBe('VENDIDO');

    expect((await admin.delete(`/api/admin/carros/${id}`)).status).toBe(204);
    expect((await admin.get(`/api/admin/carros/${id}`)).status).toBe(404);
    criados.carros = [];
  });
});

describe('produtos', () => {
  let produtoId;
  let freios;

  beforeAll(async () => {
    freios = await prisma.categoria.findUniqueOrThrow({ where: { slug: 'freios' } });
  });

  const novoProduto = (extra = {}) => ({
    nome: `Pastilha Admin ${SUFIXO}`,
    descricao: 'Criada pelos testes do painel.',
    preco: 99.9,
    estoque: 2,
    tipo: 'PECA',
    categoriaId: freios.id,
    compativelCom: [],
    ...extra,
  });

  it('cria com slug gerado e aparece no catálogo público', async () => {
    const modelo = await prisma.modeloVeiculo.findFirstOrThrow();
    const res = await admin.post(
      '/api/admin/produtos',
      novoProduto({ compativelCom: [modelo.id] }),
    );
    expect(res.status).toBe(201);
    produtoId = res.body.id;
    criados.produtos.push(produtoId);
    expect(res.body.slug).toBe(`pastilha-admin-${SUFIXO}`);

    const publico = await request(app).get(`/api/pecas/${res.body.slug}`);
    expect(publico.body.compativelCom.map((m) => m.slug)).toEqual([modelo.slug]);
  });

  it('recusa categoria de outro tipo', async () => {
    const res = await admin.post('/api/admin/produtos', novoProduto({ tipo: 'ACESSORIO' }));
    expect(res.status).toBe(400);
    expect(res.body.detalhes[0].campo).toBe('categoriaId');
  });

  it('atualiza preço e estoque', async () => {
    const res = await admin.put(
      `/api/admin/produtos/${produtoId}`,
      novoProduto({ preco: 120, estoque: 9 }),
    );
    expect(res.body).toMatchObject({ preco: 120, estoque: 9 });
  });

  it('não exclui produto que já foi vendido (409), mas exclui um sem pedidos', async () => {
    const pedido = await request(app)
      .post('/api/pedidos')
      .send({
        cliente: {
          nome: 'Cliente Painel',
          email: 'cliente.painel@exemplo.com',
          telefone: '66999990000',
        },
        itens: [{ produto: `pastilha-admin-${SUFIXO}`, quantidade: 1 }],
      });
    expect(pedido.status).toBe(201);
    expect((await admin.delete(`/api/admin/produtos/${produtoId}`)).status).toBe(409);

    const avulso = await admin.post(
      '/api/admin/produtos',
      novoProduto({ nome: `Avulso ${SUFIXO}` }),
    );
    expect((await admin.delete(`/api/admin/produtos/${avulso.body.id}`)).status).toBe(204);
  });
});

describe('pedidos', () => {
  it('lista e muda status; cancelar devolve o estoque e é final', async () => {
    const [produtoId] = criados.produtos;
    const estoque = async () =>
      (await prisma.produto.findUnique({ where: { id: produtoId } })).estoque;

    const lista = await admin.get('/api/admin/pedidos?status=RECEBIDO');
    const pedido = lista.body.find((p) => p.itens.some((i) => i.produtoId === produtoId));
    expect(pedido.cliente.email).toBe('cliente.painel@exemplo.com'); // admin vê o contato

    const antes = await estoque();
    const separando = await admin.patch(`/api/admin/pedidos/${pedido.codigo}/status`, {
      status: 'EM_SEPARACAO',
    });
    expect(separando.body.status).toBe('EM_SEPARACAO');
    expect(await estoque()).toBe(antes);

    const [a, b] = await Promise.all(
      [1, 2].map(() =>
        admin.patch(`/api/admin/pedidos/${pedido.codigo}/status`, { status: 'CANCELADO' }),
      ),
    );
    expect([a.status, b.status].sort()).toEqual([200, 409]); // clique duplo não devolve 2×
    expect(await estoque()).toBe(antes + 1);

    const reabrir = await admin.patch(`/api/admin/pedidos/${pedido.codigo}/status`, {
      status: 'RECEBIDO',
    });
    expect(reabrir.status).toBe(409);
  });
});

describe('serviços e agenda', () => {
  let servico;

  it('valida a duração em múltiplos de 15 minutos', async () => {
    const base = { nome: `Polimento ${SUFIXO}`, descricao: 'Polimento técnico.', precoBase: 250 };
    expect((await admin.post('/api/admin/servicos', { ...base, duracaoMin: 50 })).status).toBe(400);
    const res = await admin.post('/api/admin/servicos', { ...base, duracaoMin: 60 });
    expect(res.status).toBe(201);
    servico = res.body;
    criados.servicos.push(servico.id);
  });

  it('cancelar um agendamento libera o horário; serviço com agenda não é excluído', async () => {
    const d = new Date(Date.now() + 7 * 864e5);
    while (new Date(`${dataLocal(d)}T12:00:00-04:00`).getUTCDay() !== 2)
      d.setTime(d.getTime() + 864e5);
    const dataHora = `${dataLocal(d)}T09:00:00-04:00`;
    const agendar = () =>
      request(app)
        .post('/api/agendamentos')
        .send({
          servico: servico.slug,
          dataHora,
          veiculoDescricao: 'Palio 2015',
          cliente: {
            nome: 'Rita Painel',
            email: 'rita.painel@exemplo.com',
            telefone: '66999992222',
          },
        });

    const primeiro = await agendar();
    expect(primeiro.status).toBe(201);
    expect((await agendar()).status).toBe(409);

    const agenda = await admin.get(
      `/api/admin/agendamentos?de=${dataLocal(d)}&ate=${dataLocal(d)}`,
    );
    expect(agenda.body.map((a) => a.codigo)).toContain(primeiro.body.codigo);

    const cancelado = await admin.patch(`/api/admin/agendamentos/${primeiro.body.codigo}/status`, {
      status: 'CANCELADO',
    });
    expect(cancelado.body.status).toBe('CANCELADO');

    const livres = await request(app)
      .get('/api/agendamentos/disponibilidade')
      .query({ servico: servico.slug, data: dataLocal(d) });
    expect(livres.body.horarios.map((h) => h.hora)).toContain('09:00');
    expect((await agendar()).status).toBe(201); // horário reaproveitado

    expect((await admin.delete(`/api/admin/servicos/${servico.id}`)).status).toBe(409);
    const desativado = await admin.put(`/api/admin/servicos/${servico.id}`, {
      nome: servico.nome,
      descricao: servico.descricao,
      precoBase: servico.precoBase,
      duracaoMin: servico.duracaoMin,
      ativo: false,
    });
    expect(desativado.body.ativo).toBe(false);
    expect((await request(app).get(`/api/servicos/${servico.slug}`)).status).toBe(404);
  });
});

describe('cadastros auxiliares', () => {
  it('cria marca, modelo e categoria com slug', async () => {
    const marca = await admin.post('/api/admin/marcas', { nome: `Marca ${SUFIXO}` });
    expect(marca.body.slug).toBe(`marca-${SUFIXO}`);
    criados.marcas.push(marca.body.id);

    const modelo = await admin.post('/api/admin/modelos', {
      marca: `Marca ${SUFIXO}`,
      modelo: 'Sedan',
      anoInicio: 2010,
      anoFim: 2020,
    });
    expect(modelo.status).toBe(201);
    criados.modelos.push(modelo.body.id);

    const invertido = await admin.post('/api/admin/modelos', {
      marca: `Marca ${SUFIXO}`,
      modelo: 'Hatch',
      anoInicio: 2020,
      anoFim: 2010,
    });
    expect(invertido.status).toBe(400);

    const categoria = await admin.post('/api/admin/categorias', {
      nome: `Cat ${SUFIXO}`,
      tipo: 'PECA',
    });
    expect(categoria.status).toBe(201);
    criados.categorias.push(categoria.body.id);
  });
});

describe('mensagens e resumo', () => {
  it('lista não lidas e marca como lida', async () => {
    const msg = await prisma.mensagemContato.create({
      data: {
        nome: 'Teste',
        email: 't@exemplo.com',
        telefone: '66999990000',
        mensagem: 'Mensagem de teste.',
      },
    });
    const naoLidas = await admin.get('/api/admin/mensagens?lida=false');
    expect(naoLidas.body.map((m) => m.id)).toContain(msg.id);

    const lida = await admin.patch(`/api/admin/mensagens/${msg.id}`, { lida: true });
    expect(lida.body.lida).toBe(true);
    await prisma.mensagemContato.delete({ where: { id: msg.id } });
  });

  it('resumo traz os indicadores do dashboard', async () => {
    const res = await admin.get('/api/admin/resumo');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      veiculosDisponiveis: expect.any(Number),
      pedidosMes: { quantidade: expect.any(Number), total: expect.any(Number) },
      pedidosPendentes: expect.any(Number),
      proximosAgendamentos: expect.any(Array),
      estoqueBaixo: expect.any(Array),
      mensagensNaoLidas: expect.any(Number),
    });
  });
});

afterAll(() => {
  fs.rmSync(path.resolve(process.env.UPLOAD_DIR), { recursive: true, force: true });
});
