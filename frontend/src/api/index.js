// Cliente HTTP da API. Todas as chamadas passam por `/api` (proxy do Vite em dev).

const BASE = '/api';
const CHAVE_TOKEN = 'admin_token';

function tokenAdmin() {
  try {
    return localStorage.getItem(CHAVE_TOKEN);
  } catch {
    return null;
  }
}

// Chamado quando uma rota do painel responde 401 (token expirado/inválido).
// A store `auth` registra aqui o logout — evita importar router/store no cliente HTTP.
let aoNaoAutorizado = () => {};
export function definirAoNaoAutorizado(fn) {
  aoNaoAutorizado = fn;
}

async function pedir(caminho, opcoes = {}) {
  const ehUpload = opcoes.body instanceof FormData; // o navegador define o boundary
  const headers = {
    ...(!ehUpload && { 'Content-Type': 'application/json' }),
    ...opcoes.headers,
  };

  // Rotas do painel levam o token; /admin/auth/login não precisa, mas não atrapalha.
  const ehAdmin = caminho.startsWith('/admin/');
  const token = ehAdmin && tokenAdmin();
  if (token && !headers.Authorization) headers.Authorization = `Bearer ${token}`;

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

  if (res.status === 401 && ehAdmin && !caminho.startsWith('/admin/auth/login')) {
    aoNaoAutorizado();
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
  // Métodos genéricos
  get: (url, options) => pedir(url, { ...options, method: 'GET' }),
  post: (url, body, options) =>
    pedir(url, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: (url, body, options) =>
    pedir(url, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  delete: (url, options) => pedir(url, { ...options, method: 'DELETE' }),

  // Métodos de domínio
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

  listarServicos: () => pedir('/servicos'),
  buscarServico: (id) => pedir(`/servicos/${id}`),
  disponibilidade: (servico, data) =>
    pedir(`/agendamentos/disponibilidade${query({ servico, data })}`),
  criarAgendamento: (dados) =>
    pedir('/agendamentos', { method: 'POST', body: JSON.stringify(dados) }),
  buscarAgendamento: (codigo) => pedir(`/agendamentos/${encodeURIComponent(codigo)}`),

  admin: {
    resumo: () => pedir('/admin/resumo'),

    listar: (recurso, filtros = {}) => pedir(`/admin/${recurso}${query(filtros)}`),
    buscar: (recurso, id) => pedir(`/admin/${recurso}/${id}`),
    criar: (recurso, dados) =>
      pedir(`/admin/${recurso}`, { method: 'POST', body: JSON.stringify(dados) }),
    atualizar: (recurso, id, dados) =>
      pedir(`/admin/${recurso}/${id}`, { method: 'PUT', body: JSON.stringify(dados) }),
    excluir: (recurso, id) => pedir(`/admin/${recurso}/${id}`, { method: 'DELETE' }),

    mudarStatus: (recurso, codigo, status) =>
      pedir(`/admin/${recurso}/${codigo}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
    marcarMensagem: (id, lida) =>
      pedir(`/admin/mensagens/${id}`, { method: 'PATCH', body: JSON.stringify({ lida }) }),

    enviarImagem: (arquivo) => {
      const form = new FormData();
      form.append('imagem', arquivo);
      return pedir('/admin/uploads', { method: 'POST', body: form });
    },
  },
};
