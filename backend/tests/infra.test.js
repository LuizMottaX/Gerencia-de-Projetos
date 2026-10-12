import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app.js';

describe('infraestrutura', () => {
  it('GET /health confere o banco', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true, banco: 'ok' });
  });

  it('GET /api/version informa versão e ambiente', async () => {
    const res = await request(app).get('/api/version');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      versao: expect.stringMatching(/^\d+\.\d+\.\d+$/),
      ambiente: 'test',
    });
  });

  it('rota inexistente da API responde 404 em JSON', async () => {
    const res = await request(app).get('/api/nao-existe');
    expect(res.status).toBe(404);
    expect(res.body.erro).toBeDefined();
  });
});
