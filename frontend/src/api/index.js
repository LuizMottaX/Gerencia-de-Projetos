// Cliente HTTP da API. Todas as chamadas passam por `/api` (proxy do Vite em dev).

const BASE = '/api';

async function pedir(caminho, opcoes = {}) {
  let res;
  try {
    res = await fetch(BASE + caminho, {
      headers: { 'Content-Type': 'application/json' },
      ...opcoes,
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
  listarCarros: () => pedir('/carros'),
  buscarCarro: (id) => pedir(`/carros/${id}`),
  pecasCompativeis: (idCarro) => pedir(`/carros/${idCarro}/pecas`),

  listarPecas: (filtros = {}) => pedir(`/pecas${query(filtros)}`),
  buscarPeca: (id) => pedir(`/pecas/${id}`),

  listarAcessorios: (filtros = {}) => pedir(`/acessorios${query(filtros)}`),
  buscarAcessorio: (id) => pedir(`/acessorios/${id}`),

  listarCategorias: (tipo) => pedir(`/categorias${tipo ? `?tipo=${tipo}` : ''}`),
  listarModelos: () => pedir('/modelos'),

  enviarContato: (dados) =>
    pedir('/contato', { method: 'POST', body: JSON.stringify(dados) }),
};
