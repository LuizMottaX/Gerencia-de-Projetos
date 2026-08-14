<template>
  <header>
    <div class="header-top">
      <h1>
        <RouterLink to="/">Chiquinho Motors®</RouterLink>
      </h1>
      <!-- Botão hambúrguer (apenas mobile) -->
      <button
        class="hamburger"
        :class="{ open: menuAberto }"
        @click="menuAberto = !menuAberto"
        aria-label="Abrir menu"
        aria-expanded="menuAberto"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>

    <hr />

    <nav :class="{ 'nav-aberto': menuAberto }">
      <RouterLink to="/" class="btn zoom-shadow" title="Página Inicial" @click="fecharMenu">Página Inicial</RouterLink>
      <RouterLink to="/carros" class="btn zoom-shadow" title="Carros Disponíveis" @click="fecharMenu">Carros Disponíveis</RouterLink>
      <RouterLink to="/dicas" class="btn zoom-shadow" title="Dicas Automotivas" @click="fecharMenu">Dicas Automotivas</RouterLink>
      <RouterLink to="/noticias" class="btn zoom-shadow" title="Notícias Automotivas" @click="fecharMenu">Notícias Automotivas</RouterLink>
      <RouterLink to="/contato" class="btn zoom-shadow" title="Contato" @click="fecharMenu">Contato</RouterLink>
      <RouterLink to="/sobre" class="btn zoom-shadow" title="Quem Somos?" @click="fecharMenu">Quem Somos?</RouterLink>
    </nav>
  </header>
</template>

<script setup>
import { ref } from 'vue';

const menuAberto = ref(false);

function fecharMenu() {
  menuAberto.value = false;
}
</script>

<style scoped>
.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.5rem;
}

nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.4rem 0;
}

/* Destaque para a rota ativa */
nav a.router-link-active {
  background: linear-gradient(90deg, #333 0%, #888 100%);
}

/* ── Botão hambúrguer ── */
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
  height: 3px;
  background-color: #333;
  border-radius: 3px;
  transition: all 0.3s ease;
}

/* Animação do X quando aberto */
.hamburger.open span:nth-child(1) {
  transform: translateY(8.5px) rotate(45deg);
}
.hamburger.open span:nth-child(2) {
  opacity: 0;
}
.hamburger.open span:nth-child(3) {
  transform: translateY(-8.5px) rotate(-45deg);
}

/* ── Mobile ── */
@media (max-width: 640px) {
  .hamburger {
    display: flex;
  }

  nav {
    display: none;
    flex-direction: column;
    align-items: stretch;
    gap: 0.4rem;
    padding: 0.5rem 0;
  }

  nav.nav-aberto {
    display: flex;
  }

  nav a.btn {
    text-align: center;
    font-size: 1em;
    padding: 0.65em 1em;
  }
}
</style>
