<script setup>
import { onMounted, ref } from 'vue';
import {
  CalendarDays,
  Car,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  PackageSearch,
  ShoppingBag,
  Tags,
  Wrench,
} from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';
import '@/assets/admin.css';

const auth = useAuthStore();
const pronto = ref(false);
const menuAberto = ref(false);

const itens = [
  { to: '/admin', icone: LayoutDashboard, texto: 'Dashboard', exato: true },
  { to: '/admin/pedidos', icone: ShoppingBag, texto: 'Pedidos' },
  { to: '/admin/agenda', icone: CalendarDays, texto: 'Agenda' },
  { to: '/admin/produtos', icone: PackageSearch, texto: 'Peças e acessórios' },
  { to: '/admin/carros', icone: Car, texto: 'Veículos' },
  { to: '/admin/servicos', icone: Wrench, texto: 'Serviços' },
  { to: '/admin/cadastros', icone: Tags, texto: 'Cadastros' },
  { to: '/admin/mensagens', icone: Inbox, texto: 'Mensagens' },
];

// O guard do router só confere se há token; aqui confirmamos com a API que ele
// ainda vale (checkAuth faz logout e volta ao login se não valer).
onMounted(async () => {
  pronto.value = await auth.checkAuth();
});
</script>

<template>
  <div v-if="pronto" class="admin-layout">
    <aside class="sidebar" :class="{ aberta: menuAberto }">
      <div class="sidebar-header">
        <h2>Painel Admin</h2>
        <p>Olá, {{ auth.user?.nome }}</p>
        <button
          type="button"
          class="btn-menu"
          :aria-expanded="menuAberto"
          aria-label="Abrir menu do painel"
          @click="menuAberto = !menuAberto"
        >
          <Menu :size="20" />
        </button>
      </div>

      <nav class="sidebar-nav" @click="menuAberto = false">
        <RouterLink
          v-for="item in itens"
          :key="item.to"
          :to="item.to"
          class="nav-item"
          :exact-active-class="item.exato ? 'ativo' : ''"
          :active-class="item.exato ? '' : 'ativo'"
        >
          <component :is="item.icone" :size="20" /> {{ item.texto }}
        </RouterLink>
      </nav>

      <div class="sidebar-footer">
        <button class="btn btn-sair" @click="auth.logout()">
          <LogOut :size="18" /> Sair do painel
        </button>
      </div>
    </aside>

    <main class="admin-content">
      <RouterView />
    </main>
  </div>
  <p v-else class="loading">Verificando acesso…</p>
</template>

<style scoped>
.admin-layout {
  display: flex;
  min-height: calc(100vh - 80px);
  background-color: var(--color-carbon);
  /* Encosta no rodapé: anula o margin-top global do footer (senão aparece o
     fundo claro do site entre o painel escuro e o rodapé). */
  margin-bottom: -3rem;
}

.sidebar {
  width: 250px;
  flex-shrink: 0;
  background-color: var(--color-dark);
  border-right: 1px solid var(--color-surface);
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  position: relative;
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-surface);
  text-align: left;
}

.sidebar-header h2 {
  font-size: 1.15rem;
  color: var(--color-light);
  margin: 0 0 0.4rem;
  text-align: left;
}

.sidebar-header p {
  color: var(--color-silver);
  font-size: 0.9rem;
  margin: 0;
}

.btn-menu {
  display: none;
  position: absolute;
  top: 1.25rem;
  right: 1rem;
  background: none;
  border: 1px solid var(--color-mid);
  border-radius: var(--radius-sm);
  color: var(--color-light);
  padding: 0.35rem;
  cursor: pointer;
}

.sidebar-nav {
  padding: 0.75rem 0;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1.5rem;
  color: var(--color-silver);
  text-decoration: none;
  transition: all 0.2s;
  border-left: 3px solid transparent;
}

.nav-item:hover,
.nav-item.ativo {
  background-color: var(--color-red-dim);
  color: var(--color-red-light);
  border-left-color: var(--color-red);
}

.sidebar-footer {
  padding: 1.25rem 1.5rem;
  border-top: 1px solid var(--color-surface);
}

.btn-sair {
  width: 100%;
}

.admin-content {
  flex-grow: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

@media (max-width: 800px) {
  .admin-layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--color-surface);
  }

  .btn-menu {
    display: inline-grid;
  }

  .sidebar-nav,
  .sidebar-footer {
    display: none;
  }

  .sidebar.aberta .sidebar-nav,
  .sidebar.aberta .sidebar-footer {
    display: flex;
  }
}
</style>
