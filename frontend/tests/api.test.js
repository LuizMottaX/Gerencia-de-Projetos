import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { api, definirAoNaoAutorizado } from '../src/api';

function respostaFetch(status, corpo) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    text: () => Promise.resolve(corpo ? JSON.stringify(corpo) : ''),
  });
}

beforeEach(() => localStorage.clear());
afterEach(() => vi.unstubAllGlobals());

describe('cliente da API', () => {
  it('envia o token só nas rotas do painel', async () => {
    localStorage.setItem('admin_token', 'abc');
    const fetch = respostaFetch(200, []);
    vi.stubGlobal('fetch', fetch);

    await api.listarCarros();
    await api.admin.listar('pedidos', { status: 'RECEBIDO' });

    expect(fetch.mock.calls[0][1].headers.Authorization).toBeUndefined();
    expect(fetch.mock.calls[1][0]).toBe('/api/admin/pedidos?status=RECEBIDO');
    expect(fetch.mock.calls[1][1].headers.Authorization).toBe('Bearer abc');
  });

  it('401 no painel aciona o logout; 401 no login não', async () => {
    const sair = vi.fn();
    definirAoNaoAutorizado(sair);
    vi.stubGlobal('fetch', respostaFetch(401, { erro: 'Token expirado.' }));

    await expect(api.admin.resumo()).rejects.toMatchObject({
      status: 401,
      message: 'Token expirado.',
    });
    expect(sair).toHaveBeenCalledTimes(1);

    await expect(api.post('/admin/auth/login', {})).rejects.toMatchObject({ status: 401 });
    expect(sair).toHaveBeenCalledTimes(1);
  });

  it('upload manda FormData sem Content-Type (o navegador define o boundary)', async () => {
    const fetch = respostaFetch(201, { url: '/uploads/x.png' });
    vi.stubGlobal('fetch', fetch);

    const resp = await api.admin.enviarImagem(new File(['x'], 'foto.png', { type: 'image/png' }));
    const [, opcoes] = fetch.mock.calls[0];
    expect(resp.url).toBe('/uploads/x.png');
    expect(opcoes.body).toBeInstanceOf(FormData);
    expect(opcoes.headers['Content-Type']).toBeUndefined();
  });

  it('erros de validação expõem status e detalhes', async () => {
    vi.stubGlobal(
      'fetch',
      respostaFetch(400, {
        erro: 'Dados inválidos.',
        detalhes: [{ campo: 'nome', mensagem: 'Curto.' }],
      }),
    );
    await expect(api.admin.criar('marcas', { nome: 'x' })).rejects.toMatchObject({
      status: 400,
      detalhes: [{ campo: 'nome', mensagem: 'Curto.' }],
    });
  });
});
