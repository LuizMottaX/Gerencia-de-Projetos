// Cliente HTTP da API. Todas as chamadas passam por `/api` (proxy do Vite em dev).

const BASE = '/api';

async function pedir(caminho, opcoes = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...opcoes.headers,
  };

  let res;
  try {
    res = await fetch(BASE + caminho, {
      ...opcoes,
      headers,
    });
  } catch {
    throw new Error('Não foi possível conectar ao servidor.');
  }

  let corpo = null;
  const texto = await res.text();
  if (texto) {
    try {
      corpo = JSON.parse(texto);
    } catch {
      corpo = null;
    }
  }

  if (!res.ok) {
    const erro = new Error(corpo?.erro || `Erro ${res.status}.`);
    erro.status = res.status;
    erro.detalhes = corpo?.detalhes;
    throw erro;
  }
  return corpo;
}

const query = (params) => {
  const q = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== '' && v != null),
  ).toString();
  return q ? `?${q}` : '';
};

export const api = {
  // Generic methods
  get: (url, options) => pedir(url, { ...options, method: 'GET' }),
  post: (url, body, options) =>
    pedir(url, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: (url, body, options) =>
    pedir(url, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  delete: (url, options) => pedir(url, { ...options, method: 'DELETE' }),

  // Domain methods
  listarCarros: () => pedir('/carros'),
  buscarCarro: (id) => pedir(`/carros/${id}`),
  pecasCompativeis: (idCarro) => pedir(`/carros/${idCarro}/pecas`),

  listarPecas: (filtros = {}) => pedir(`/pecas${query(filtros)}`),
  buscarPeca: (id) => pedir(`/pecas/${id}`),

  listarAcessorios: (filtros = {}) => pedir(`/acessorios${query(filtros)}`),
  buscarAcessorio: (id) => pedir(`/acessorios/${id}`),

  listarCategorias: (tipo) => pedir(`/categorias${tipo ? `?tipo=${tipo}` : ''}`),
  listarModelos: () => pedir('/modelos'),

  enviarContato: (dados) => pedir('/contato', { method: 'POST', body: JSON.stringify(dados) }),

  criarPedido: (dados) => pedir('/pedidos', { method: 'POST', body: JSON.stringify(dados) }),
  buscarPedido: (codigo) => pedir(`/pedidos/${encodeURIComponent(codigo)}`),
};
