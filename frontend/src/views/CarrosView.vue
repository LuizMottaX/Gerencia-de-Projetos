<template>
  <section class="carros-page">
    <h1>Carros Disponíveis</h1>

    <p v-if="carregando" class="loading">Carregando veículos…</p>
    <p v-else-if="erro" class="error-msg">{{ erro }}</p>

    <div v-else class="grid-container">
      <div v-for="carro in carros" :key="carro.id" class="zoom card">
        <RouterLink :to="`/carros/${carro.id}`">
          <img :src="carro.imagemCapa" :alt="carro.nome" />
        </RouterLink>
        <div class="text-item">
          <RouterLink :to="`/carros/${carro.id}`" class="card-nome">
            {{ carro.nome }}
          </RouterLink>
          <p class="card-preco">{{ carro.precoFormatado }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const carros = ref([]);
const carregando = ref(true);
const erro = ref(null);

onMounted(async () => {
  try {
    const res = await fetch('/api/carros');
    if (!res.ok) throw new Error('Erro ao buscar os veículos.');
    carros.value = await res.json();
  } catch (e) {
    erro.value = e.message;
  } finally {
    carregando.value = false;
  }
});
</script>

<style scoped>
.carros-page {
  padding: 1rem;
}

.card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 6px 6px 0 0;
}

.card-nome {
  display: block;
  font-size: 1em;
  color: #333;
  margin-bottom: 0.3rem;
}

.card-preco {
  font-weight: bold;
  font-size: 1.05em;
  color: #444;
}
</style>
