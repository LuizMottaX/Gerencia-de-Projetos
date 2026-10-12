<template>
  <section class="servicos-page">
    <div class="section-banner">
      <h1><Wrench :size="26" /> Serviços de Manutenção</h1>
      <p class="banner-sub">Escolha o serviço e agende o melhor horário — sem precisar ligar</p>
    </div>

    <p v-if="carregando" class="loading">Carregando…</p>
    <p v-else-if="erro" class="error-msg">{{ erro }}</p>

    <div v-else class="grid-servicos">
      <article v-for="s in servicos" :key="s.id" class="servico-card">
        <h2>{{ s.nome }}</h2>
        <p class="descricao">{{ s.descricao }}</p>
        <div class="meta">
          <span class="preco">a partir de {{ s.precoBaseFormatado }}</span>
          <span class="duracao"><Clock :size="14" /> {{ s.duracaoFormatada }}</span>
        </div>
        <RouterLink :to="`/agendar/${s.id}`" class="btn btn-red zoom-shadow">
          <CalendarCheck :size="16" /> Agendar
        </RouterLink>
      </article>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { CalendarCheck, Clock, Wrench } from 'lucide-vue-next';
import { api } from '../api';

const servicos = ref([]);
const carregando = ref(true);
const erro = ref(null);

onMounted(async () => {
  try {
    servicos.value = await api.listarServicos();
  } catch (e) {
    erro.value = e.message;
  } finally {
    carregando.value = false;
  }
});
</script>

<style scoped>
.banner-sub {
  color: #b0b4bc;
  font-size: 0.92em;
  margin-top: 0.25rem;
}

.grid-servicos {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.servico-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border-top: 3px solid #c0392b;
  text-align: left;
}

.servico-card h2 {
  font-size: 1.1em;
  margin: 0;
  color: #1a1a1a;
  text-align: left;
}

.descricao {
  font-size: 0.9em;
  color: #666;
  line-height: 1.5;
  flex: 1;
}

.meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.preco {
  font-weight: 900;
  color: #c0392b;
}

.duracao {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.85em;
  color: #666;
}
</style>
