<template>
  <header>
    <div class="header-top">
      <div class="brand">
        <Car class="brand-icon" :size="24" :stroke-width="2.25" />
        <h1>
          <RouterLink to="/">Chiquinho <span class="brand-accent">Motors</span>®</RouterLink>
        </h1>
      </div>
      <!-- Botão hambúrguer (mobile) -->
      <button
        class="hamburger"
        :class="{ open: menuAberto }"
        @click="menuAberto = !menuAberto"
        aria-label="Abrir menu"
        :aria-expanded="menuAberto"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>

    <hr />

    <nav :class="{ 'nav-aberto': menuAberto }">
      <RouterLink to="/" class="nav-link" title="Página Inicial" @click="fecharMenu">
        Página Inicial
      </RouterLink>
      <RouterLink to="/carros" class="nav-link nav-link--destaque" title="Carros Disponíveis" @click="fecharMenu">
        <Car :size="15" :stroke-width="2.5" /> Carros Disponíveis
      </RouterLink>
      <RouterLink to="/pecas" class="nav-link" title="Auto-peças" @click="fecharMenu">
        Auto-peças
      </RouterLink>
      <RouterLink to="/acessorios" class="nav-link" title="Acessórios" @click="fecharMenu">
        Acessórios
      </RouterLink>
      <RouterLink to="/dicas" class="nav-link" title="Dicas Automotivas" @click="fecharMenu">
        Dicas Automotivas
      </RouterLink>
      <RouterLink to="/noticias" class="nav-link" title="Notícias Automotivas" @click="fecharMenu">
        Notícias
      </RouterLink>
      <RouterLink to="/contato" class="nav-link" title="Contato" @click="fecharMenu">
        Contato
      </RouterLink>
      <RouterLink to="/sobre" class="nav-link" title="Quem Somos?" @click="fecharMenu">
        Quem Somos?
      </RouterLink>
    </nav>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import { Car } from 'lucide-vue-next';

const menuAberto = ref(false);
function fecharMenu() { menuAberto.value = false; }
</script>

<style scoped>
/* ── Layout do header ── */
.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.25rem;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.brand-icon {
  color: #c0392b;
}

.brand-accent {
  color: #c0392b;
}

/* Sobreescrita do h1 global para o header */
header h1 {
  font-size: 1.25em;
  margin-bottom: 0;
}

/* ── Nav links ── */
nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.5rem 0 0.25rem;
}

.nav-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4em;
  padding: 0.45em 1em;
  color: #c0c4cc;
  font-size: 0.88em;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: 50px;
  border: 1px solid transparent;
  transition: color 0.25s, border-color 0.25s, background 0.25s;
}

.nav-link:hover {
  color: #fff;
  border-color: #c0392b;
}

/* Rota ativa */
.nav-link.router-link-active {
  color: #fff;
  background: rgba(192, 57, 43, 0.18);
  border-color: #c0392b;
}

/* Link de destaque (Carros) */
.nav-link--destaque {
  color: #fff;
  background: linear-gradient(135deg, #c0392b, #e74c3c);
  border-color: transparent;
  font-weight: 700;
}

.nav-link--destaque:hover {
  background: linear-gradient(135deg, #96281b, #c0392b);
  border-color: transparent;
  box-shadow: 0 4px 16px rgba(192, 57, 43, 0.4);
}

.nav-link--destaque.router-link-active {
  background: linear-gradient(135deg, #96281b, #c0392b);
}

/* ── Hambúrguer ── */
.hamburger {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 28px;
  height: 20px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.hamburger span {
  display: block;
  width: 100%;
  height: 2.5px;
  background-color: #c0c4cc;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.hamburger.open span:nth-child(1) { transform: translateY(8.75px) rotate(45deg); background: #c0392b; }
.hamburger.open span:nth-child(2) { opacity: 0; }
.hamburger.open span:nth-child(3) { transform: translateY(-8.75px) rotate(-45deg); background: #c0392b; }

/* ── Mobile ── */
@media (max-width: 640px) {
  .hamburger { display: flex; }

  nav {
    display: none;
    flex-direction: column;
    align-items: stretch;
    gap: 0.3rem;
    padding: 0.5rem 0;
  }

  nav.nav-aberto { display: flex; }

  .nav-link {
    text-align: center;
    font-size: 0.9em;
    padding: 0.65em 1em;
  }
}
</style>
