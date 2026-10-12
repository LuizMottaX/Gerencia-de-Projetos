import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../app.js';
import prisma from '../src/lib/prisma.js';

afterAll(() => prisma.$disconnect());

describe('GET /api/carros', () => {
  it('retorna 200 e uma lista', async () => {
    const res = await request(app).get('/api/carros');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('retorna 404 para slug inexistente', async () => {
    const res = await request(app).get('/api/carros/nao-existe');
    expect(res.status).toBe(404);
    expect(res.body.erro).toBeDefined();
  });
});

describe('GET /api/pecas?modelo=', () => {
  it('retorna só peças compatíveis com o modelo', async () => {
    const res = await request(app).get('/api/pecas').query({ modelo: 'toyota-corolla' });
    expect(res.status).toBe(200);
    expect(res.body.itens.length).toBeGreaterThan(0);
    for (const peca of res.body.itens) {
      expect(peca.tipo).toBe('peca');
      expect(peca.compativelCom.map((m) => m.slug)).toContain('toyota-corolla');
    }
  });
});

describe('POST /api/contato', () => {
  it('retorna 400 com detalhes para corpo inválido', async () => {
    const res = await request(app).post('/api/contato').send({ nome: 'A', email: 'x' });
    expect(res.status).toBe(400);
    expect(res.body.detalhes.map((d) => d.campo)).toEqual(
      expect.arrayContaining(['nome', 'email', 'telefone', 'mensagem']),
    );
  });
});

describe('Autenticação admin', () => {
  const email = 'teste-admin@chiquinhomotors.com.br';
  const senha = 'senha-de-teste';

  beforeAll(async () => {
    const hash = await bcrypt.hash(senha, 4);
    await prisma.administrador.upsert({
      where: { email },
      update: { senha: hash, ativo: true },
      create: { nome: 'Admin de Teste', email, senha: hash },
    });
  });

  it('rota protegida retorna 401 sem token', async () => {
    const res = await request(app).get('/api/admin/auth/me');
    expect(res.status).toBe(401);
  });

  it('rota protegida retorna 401 com token inválido', async () => {
    const res = await request(app).get('/api/admin/auth/me').set('Authorization', 'Bearer abc');
    expect(res.status).toBe(401);
  });

  it('login com senha errada retorna 401', async () => {
    const res = await request(app).post('/api/admin/auth/login').send({ email, senha: 'errada' });
    expect(res.status).toBe(401);
  });

  it('login válido gera token que acessa a rota protegida', async () => {
    const login = await request(app).post('/api/admin/auth/login').send({ email, senha });
    expect(login.status).toBe(200);

    const me = await request(app)
      .get('/api/admin/auth/me')
      .set('Authorization', `Bearer ${login.body.token}`);
    expect(me.status).toBe(200);
    expect(me.body.admin.email).toBe(email);
  });
});
