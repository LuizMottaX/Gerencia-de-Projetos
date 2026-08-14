import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: 'Chiquinho Motors®' },
  },
  {
    path: '/carros',
    name: 'carros',
    component: () => import('../views/CarrosView.vue'),
    meta: { title: 'Carros Disponíveis — Chiquinho Motors®' },
  },
  {
    path: '/carros/:id',
    name: 'carro-detalhe',
    component: () => import('../views/CarroDetalheView.vue'),
    meta: { title: 'Detalhe do Veículo — Chiquinho Motors®' },
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
    meta: { title: 'Contato — Chiquinho Motors®' },
  },
  {
    path: '/sobre',
    name: 'sobre',
    component: () => import('../views/SobreNosView.vue'),
    meta: { title: 'Quem Somos — Chiquinho Motors®' },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    // Sempre volta ao topo ao mudar de página
    return { top: 0 };
  },
});

// Atualiza o <title> da página com base na rota
router.afterEach((to) => {
  document.title = to.meta.title || 'Chiquinho Motors®';
});

export default router;
