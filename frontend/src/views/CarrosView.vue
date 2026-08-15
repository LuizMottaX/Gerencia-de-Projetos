<template>
  <section>
    <!-- Banner da seção -->
    <div class="section-banner">
      <h1>🚗 Carros Disponíveis</h1>
      <p class="banner-sub">Encontre o veículo ideal para você</p>
    </div>

    <p v-if="carregando" class="loading">Carregando veículos…</p>
    <p v-else-if="erro" class="error-msg">{{ erro }}</p>

    <div v-else class="grid-container">
      <div v-for="carro in carros" :key="carro.id" class="card">
        <RouterLink :to="`/carros/${carro.id}`" class="card-link">
          <div class="card-img-wrapper">
            <img :src="carro.imagemCapa" :alt="carro.nome" />
            <span class="card-badge">Ver Detalhes →</span>
          </div>
          <div class="card-body text-item">
            <p class="card-nome">{{ carro.nome }}</p>
            <p class="card-preco">{{ carro.precoFormatado }}</p>
            <div class="card-tags">
              <span class="tag">{{ carro.combustivel }}</span>
              <span class="tag">{{ carro.cambio }}</span>
              <span class="tag">{{ carro.carroceria }}</span>
            </div>
          </div>
        </RouterLink>
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
.banner-sub {
  color: #b0b4bc;
  font-size: 0.95em;
  margin-top: 0.25rem;
}

.card-link {
  display: block;
  color: inherit;
  text-decoration: none;
}

.card-img-wrapper {
  position: relative;
  overflow: hidden;
  height: 210px;
}

.card-img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
}

.card:hover .card-img-wrapper img {
  transform: scale(1.08);
}

/* Badge "Ver Detalhes" aparece no hover */
.card-badge {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(0deg, rgba(192, 57, 43, 0.92) 0%, transparent 100%);
  color: #fff;
  font-size: 0.85em;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  padding: 1rem 1rem 0.5rem;
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.card:hover .card-badge {
  opacity: 1;
  transform: translateY(0);
}

.card-body {
  padding: 14px 16px 16px;
}

.card-nome {
  font-weight: 700;
  font-size: 0.97em;
  color: #1a1a1a;
  margin-bottom: 0.3rem;
  line-height: 1.3;
}

.card-preco {
  font-size: 1.15em;
  font-weight: 900;
  color: #c0392b;
  margin-bottom: 0.7rem;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.tag {
  background: #f0f0f0;
  color: #555;
  font-size: 0.72em;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 0.2em 0.6em;
  border-radius: 4px;
}
</style>
