import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import prisma from '../src/lib/prisma.js';
import { dataLocal } from '../src/lib/agenda.js';

// Serviço próprio dos testes, para não depender nem sujar a agenda do seed.
const SLUG = 'teste-servico-agenda';
const cliente = {
  nome: 'Carlos Teste',
  email: 'carlos.teste@exemplo.com',
  telefone: '66999991111',
};

/** Uma segunda-feira entre 7 e 13 dias à frente — sempre dentro da janela de agendamento. */
function proximaSegunda() {
  const d = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  while (new Date(`${dataLocal(d)}T12:00:00-04:00`).getUTCDay() !== 1) {
    d.setTime(d.getTime() + 24 * 60 * 60 * 1000);
  }
  return dataLocal(d);
}

const DATA = proximaSegunda();
const as = (hora) => `${DATA}T${hora}:00-04:00`;

const agendar = (dataHora, extra = {}) =>
  request(app)
    .post('/api/agendamentos')
    .send({ servico: SLUG, dataHora, veiculoDescricao: 'Gol 2020, ABC-1234', cliente, ...extra });

const disponibilidade = (data = DATA) =>
  request(app).get('/api/agendamentos/disponibilidade').query({ servico: SLUG, data });

let servicoId;

beforeAll(async () => {
  const servico = await prisma.servico.upsert({
    where: { slug: SLUG },
    update: { ativo: true, duracaoMin: 60 },
    create: {
      slug: SLUG,
      nome: 'Serviço de Teste',
      descricao: 'Criado pelos testes.',
      precoBaseCentavos: 10000,
      duracaoMin: 60,
    },
  });
  servicoId = servico.id;
});

beforeEach(() => prisma.agendamento.deleteMany({ where: { servicoId } }));

afterAll(async () => {
  await prisma.agendamento.deleteMany({ where: { servicoId } });
  await prisma.servico.delete({ where: { id: servicoId } });
  await prisma.cliente.deleteMany({ where: { email: cliente.email } });
  await prisma.$disconnect();
});

describe('GET /api/servicos', () => {
  it('lista os serviços ativos com preço e duração formatados', async () => {
    const res = await request(app).get('/api/servicos');
    expect(res.status).toBe(200);
    const teste = res.body.find((s) => s.id === SLUG);
    expect(teste).toMatchObject({
      precoBaseFormatado: expect.stringMatching(/100,00/),
      duracaoFormatada: '1h',
    });
  });

  it('retorna 404 para serviço inexistente', async () => {
    expect((await request(app).get('/api/servicos/nao-existe')).status).toBe(404);
  });
});

describe('GET /api/agendamentos/disponibilidade', () => {
  it('lista a grade do dia e remove os horários já reservados', async () => {
    const antes = await disponibilidade();
    expect(antes.status).toBe(200);
    expect(antes.body.horarios.map((h) => h.hora)).toHaveLength(10);

    await agendar(as('09:00'));
    const depois = await disponibilidade();
    expect(depois.body.horarios.map((h) => h.hora)).not.toContain('09:00');
    expect(depois.body.horarios).toHaveLength(9);
  });

  it('informa dia fechado no fim de semana', async () => {
    const sabado = new Date(`${DATA}T12:00:00-04:00`);
    sabado.setUTCDate(sabado.getUTCDate() + 5);
    const res = await disponibilidade(dataLocal(sabado));
    expect(res.body).toMatchObject({ fechado: true, horarios: [] });
  });

  it('retorna 400 para data inválida e 404 para serviço inexistente', async () => {
    expect((await disponibilidade('2026-02-30')).status).toBe(400);
    const res = await request(app)
      .get('/api/agendamentos/disponibilidade')
      .query({ servico: 'nao-existe', data: DATA });
    expect(res.status).toBe(404);
  });
});

describe('POST /api/agendamentos', () => {
  it('reserva o horário e devolve código, data e hora locais', async () => {
    const res = await agendar(as('08:00'));
    expect(res.status).toBe(201);
    expect(res.body.codigo).toMatch(/^AG-[2-9A-Z]{6}$/);
    expect(res.body).toMatchObject({ status: 'SOLICITADO', data: DATA, hora: '08:00' });

    const consulta = await request(app).get(`/api/agendamentos/${res.body.codigo}`);
    expect(consulta.status).toBe(200);
    expect(consulta.body.cliente).toEqual({ nome: 'Carlos' });
  });

  it('retorna 409 para horário já ocupado', async () => {
    await agendar(as('10:00'));
    const res = await agendar(as('10:00'));
    expect(res.status).toBe(409);
    expect(res.body.erro).toMatch(/10:00/);
  });

  it('recusa horário fora da grade, no passado ou com dados inválidos', async () => {
    expect((await agendar(as('08:30'))).status).toBe(400);
    expect((await agendar('2020-01-06T08:00:00-04:00')).status).toBe(400);
    const invalido = await agendar('amanhã', { veiculoDescricao: '' });
    expect(invalido.status).toBe(400);
    expect(invalido.body.detalhes.map((d) => d.campo)).toEqual(
      expect.arrayContaining(['dataHora', 'veiculoDescricao']),
    );
  });

  it('agendamentos simultâneos no mesmo horário: só um é aceito', async () => {
    const respostas = await Promise.all(Array.from({ length: 5 }, () => agendar(as('11:00'))));
    expect(respostas.map((r) => r.status).sort()).toEqual([201, 409, 409, 409, 409]);
    expect(await prisma.agendamento.count({ where: { servicoId } })).toBe(1);
  });
});
