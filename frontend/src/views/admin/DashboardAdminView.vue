<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { LogOut, LayoutDashboard, ShoppingBag, Wrench, PackageSearch } from 'lucide-vue-next';

const auth = useAuthStore();
const router = useRouter();

onMounted(async () => {
  const isValido = await auth.checkAuth();
  if (!isValido) {
    router.push('/admin/login');
  }
});

const sair = () => {
  auth.logout();
};
</script>

<template>
  <div v-if="auth.isAuthenticated" class="admin-layout">
    <aside class="sidebar">
      <div class="sidebar-header">
        <h2>Painel Admin</h2>
        <p>Olá, {{ auth.user?.nome }}</p>
      </div>

      <nav class="sidebar-nav">
        <router-link to="/admin" class="nav-item">
          <LayoutDashboard :size="20" /> Dashboard
        </router-link>
        <!-- Telas ainda não implementadas (F3, F4 e CRUD da F5) -->
        <span class="nav-item nav-item--em-breve" title="Em breve">
          <ShoppingBag :size="20" /> Pedidos (F3)
        </span>
        <span class="nav-item nav-item--em-breve" title="Em breve">
          <PackageSearch :size="20" /> Peças/Acessórios
        </span>
        <span class="nav-item nav-item--em-breve" title="Em breve">
          <Wrench :size="20" /> Serviços (F4)
        </span>
      </nav>

      <div class="sidebar-footer">
        <button class="btn btn-outline btn-sair" @click="sair">
          <LogOut :size="18" /> Sair do Painel
        </button>
      </div>
    </aside>

    <main class="admin-content">
      <header class="content-header">
        <h1>Dashboard Geral</h1>
      </header>

      <div class="content-body">
        <div class="welcome-card">
          <h3>Bem-vindo ao Painel Administrativo</h3>
          <p>O sistema de login e proteção de rotas foi implementado com sucesso.</p>
          <p>
            A partir daqui, você pode expandir a Fase 5 gerenciando o catálogo, e futuramente
            acompanhando pedidos (Fase 3) e serviços (Fase 4).
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  min-height: calc(
    100vh - 80px
  ); /* Ajuste dependendo do header global, ou pode ser full height se esconder o nav principal */
  background-color: var(--color-carbon);
}

.sidebar {
  width: 260px;
  background-color: var(--color-dark);
  border-right: 1px solid var(--color-surface);
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-surface);
}

.sidebar-header h2 {
  font-size: 1.25rem;
  color: var(--color-light);
  margin: 0 0 0.5rem 0;
}

.sidebar-header p {
  color: var(--color-silver);
  font-size: 0.9rem;
  margin: 0;
}

.sidebar-nav {
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  color: var(--color-silver);
  text-decoration: none;
  transition: all 0.2s;
  border-left: 3px solid transparent;
}

.nav-item:hover,
.nav-item.router-link-exact-active {
  background-color: var(--color-red-dim);
  color: var(--color-red-light);
  border-left-color: var(--color-red);
}

.nav-item--em-breve,
.nav-item--em-breve:hover {
  opacity: 0.45;
  cursor: not-allowed;
  background-color: transparent;
  color: var(--color-silver);
  border-left-color: transparent;
}

.sidebar-footer {
  padding: 1.5rem;
  border-top: 1px solid var(--color-surface);
}

.btn-sair {
  width: 100%;
  justify-content: center;
}

.admin-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.content-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--color-surface);
  background-color: var(--color-dark);
}

.content-header h1 {
  margin: 0;
  font-size: 1.5rem;
}

.content-body {
  padding: 2rem;
}

.welcome-card {
  background-color: var(--color-dark);
  border: 1px solid var(--color-surface);
  border-radius: 8px;
  padding: 2rem;
}

.welcome-card h3 {
  margin-top: 0;
  color: var(--color-red-light);
}

.welcome-card p {
  color: var(--color-silver);
  line-height: 1.6;
}
</style>
