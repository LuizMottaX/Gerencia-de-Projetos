import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      description:
        'Concessionária em Sinop–MT: veículos revisados, auto-peças, acessórios e agendamento de revisão online.',
      title: 'Chiquinho Motors®',
    },
  },
  {
    path: '/carros',
    name: 'carros',
    component: () => import('../views/CarrosView.vue'),
    meta: {
      description:
        'Carros seminovos à venda em Sinop–MT, com fotos, ficha técnica e formas de pagamento.',
      title: 'Carros Disponíveis — Chiquinho Motors®',
    },
  },
  {
    path: '/carros/:id',
    name: 'carro-detalhe',
    component: () => import('../views/CarroDetalheView.vue'),
    meta: { title: 'Detalhe do Veículo — Chiquinho Motors®' },
  },
  {
    path: '/pecas',
    name: 'pecas',
    component: () => import('../views/PecasView.vue'),
    meta: {
      description: 'Auto-peças com filtro por modelo do seu carro: compre só o que é compatível.',
      title: 'Auto-peças — Chiquinho Motors®',
    },
  },
  {
    path: '/pecas/:id',
    name: 'peca-detalhe',
    component: () => import('../views/ProdutoDetalheView.vue'),
    meta: { title: 'Peça — Chiquinho Motors®', tipo: 'peca' },
  },
  {
    path: '/acessorios',
    name: 'acessorios',
    component: () => import('../views/AcessoriosView.vue'),
    meta: {
      description: 'Acessórios automotivos: som, estética, conforto, rodas e pneus.',
      title: 'Acessórios — Chiquinho Motors®',
    },
  },
  {
    path: '/acessorios/:id',
    name: 'acessorio-detalhe',
    component: () => import('../views/ProdutoDetalheView.vue'),
    meta: { title: 'Acessório — Chiquinho Motors®', tipo: 'acessorio' },
  },
  {
    path: '/dicas',
    name: 'dicas',
    component: () => import('../views/DicasView.vue'),
    meta: { title: 'Dicas Automotivas — Chiquinho Motors®' },
  },
  {
    path: '/noticias',
    name: 'noticias',
    component: () => import('../views/NoticiasView.vue'),
    meta: { title: 'Notícias Automotivas — Chiquinho Motors®' },
  },
  {
    path: '/contato',
    name: 'contato',
    component: () => import('../views/ContatoView.vue'),
    meta: {
      description: 'Fale com a Chiquinho Motors pelo formulário, WhatsApp ou e-mail.',
      title: 'Contato — Chiquinho Motors®',
    },
  },
  {
    path: '/servicos',
    name: 'servicos',
    component: () => import('../views/ServicosView.vue'),
    meta: {
      description:
        'Troca de óleo, alinhamento, freios, ar-condicionado e revisão completa — agende online.',
      title: 'Serviços — Chiquinho Motors®',
    },
  },
  {
    path: '/agendar/:servicoSlug',
    name: 'agendar',
    component: () => import('../views/AgendamentoView.vue'),
    meta: { title: 'Agendar serviço — Chiquinho Motors®' },
  },
  {
    path: '/agendamento/:codigo',
    name: 'agendamento',
    component: () => import('../views/AgendamentoConfirmadoView.vue'),
    meta: { title: 'Agendamento — Chiquinho Motors®' },
  },
  {
    path: '/carrinho',
    name: 'carrinho',
    component: () => import('../views/CarrinhoView.vue'),
    meta: { title: 'Carrinho — Chiquinho Motors®' },
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: () => import('../views/CheckoutView.vue'),
    meta: { title: 'Finalizar pedido — Chiquinho Motors®' },
  },
  {
    path: '/pedido/:codigo',
    name: 'pedido',
    component: () => import('../views/PedidoView.vue'),
    meta: { title: 'Pedido — Chiquinho Motors®' },
  },
  {
    path: '/sobre',
    name: 'sobre',
    component: () => import('../views/SobreNosView.vue'),
    meta: { title: 'Quem Somos — Chiquinho Motors®' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'nao-encontrado',
    component: () => import('../views/NaoEncontradoView.vue'),
    meta: { title: 'Página não encontrada — Chiquinho Motors®' },
  },
  {
    path: '/admin/login',
    name: 'admin-login',
    component: () => import('../views/admin/LoginAdminView.vue'),
    meta: { title: 'Login Admin — Chiquinho Motors®' },
  },
  {
    path: '/admin',
    component: () => import('../views/admin/AdminLayout.vue'),
    meta: { requerAdmin: true },
    children: [
      {
        path: '',
        name: 'admin-dashboard',
        component: () => import('../views/admin/DashboardAdminView.vue'),
        meta: { title: 'Dashboard — Painel Chiquinho Motors®' },
      },
      {
        path: 'pedidos',
        name: 'admin-pedidos',
        component: () => import('../views/admin/PedidosAdminView.vue'),
        meta: { title: 'Pedidos — Painel Chiquinho Motors®' },
      },
      {
        path: 'agenda',
        name: 'admin-agenda',
        component: () => import('../views/admin/AgendaAdminView.vue'),
        meta: { title: 'Agenda — Painel Chiquinho Motors®' },
      },
      {
        path: 'produtos',
        name: 'admin-produtos',
        component: () => import('../views/admin/ProdutosAdminView.vue'),
        meta: { title: 'Peças e acessórios — Painel Chiquinho Motors®' },
      },
      {
        path: 'produtos/novo',
        name: 'admin-produto-novo',
        component: () => import('../views/admin/ProdutoFormView.vue'),
        meta: { title: 'Novo produto — Painel Chiquinho Motors®' },
      },
      {
        path: 'produtos/:id',
        name: 'admin-produto-editar',
        component: () => import('../views/admin/ProdutoFormView.vue'),
        meta: { title: 'Editar produto — Painel Chiquinho Motors®' },
      },
      {
        path: 'carros',
        name: 'admin-carros',
        component: () => import('../views/admin/CarrosAdminView.vue'),
        meta: { title: 'Veículos — Painel Chiquinho Motors®' },
      },
      {
        path: 'carros/novo',
        name: 'admin-carro-novo',
        component: () => import('../views/admin/CarroFormView.vue'),
        meta: { title: 'Novo veículo — Painel Chiquinho Motors®' },
      },
      {
        path: 'carros/:id',
        name: 'admin-carro-editar',
        component: () => import('../views/admin/CarroFormView.vue'),
        meta: { title: 'Editar veículo — Painel Chiquinho Motors®' },
      },
      {
        path: 'servicos',
        name: 'admin-servicos',
        component: () => import('../views/admin/ServicosAdminView.vue'),
        meta: { title: 'Serviços — Painel Chiquinho Motors®' },
      },
      {
        path: 'cadastros',
        name: 'admin-cadastros',
        component: () => import('../views/admin/CadastrosAdminView.vue'),
        meta: { title: 'Cadastros — Painel Chiquinho Motors®' },
      },
      {
        path: 'mensagens',
        name: 'admin-mensagens',
        component: () => import('../views/admin/MensagensAdminView.vue'),
        meta: { title: 'Mensagens — Painel Chiquinho Motors®' },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

// Sem token nem chega a carregar o painel; a validade do token é conferida
// pela própria tela (GET /api/admin/auth/me).
router.beforeEach((to) => {
  if (!to.matched.some((r) => r.meta.requerAdmin)) return true;
  let token = null;
  try {
    token = localStorage.getItem('admin_token');
  } catch {
    // localStorage indisponível
  }
  return token ? true : { name: 'admin-login' };
});

const DESCRICAO_PADRAO = document
  .querySelector('meta[name="description"]')
  ?.getAttribute('content');

router.afterEach((to) => {
  document.title = to.meta.title || 'Chiquinho Motors®';
  // A descrição acompanha a rota (usada por buscadores que executam JS).
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute('content', to.meta.description || DESCRICAO_PADRAO);
});

export default router;
