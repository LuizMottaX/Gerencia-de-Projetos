<template>
  <section class="detalhe-page">
    <p v-if="carregando" class="loading">Carregando veículo…</p>
    <p v-else-if="erro" class="error-msg">{{ erro }}</p>

    <template v-else-if="carro">
      <h1>{{ carro.nome }}</h1>

      <!-- Galeria de imagens -->
      <div class="galeria">
        <div v-for="(img, i) in carro.imagens" :key="i" class="zoom">
          <img :src="img" :alt="`${carro.nome} — foto ${i + 1}`" />
        </div>
      </div>

      <!-- Informações -->
      <div class="info-bloco">
        <h2>Informações do veículo</h2>
        <ul class="info-lista">
          <li><strong>Modelo:</strong> {{ carro.modelo }}</li>
          <li><strong>Tipo de carroceria:</strong> {{ carro.carroceria }}</li>
          <li><strong>Ano:</strong> {{ carro.ano }}</li>
          <li><strong>Quilometragem:</strong> {{ carro.quilometragem }}</li>
          <li><strong>Cor:</strong> {{ carro.cor }}</li>
          <li><strong>Combustível:</strong> {{ carro.combustivel }}</li>
          <li><strong>Câmbio:</strong> {{ carro.cambio }}</li>
          <li><strong>Portas:</strong> {{ carro.portas }}</li>
          <li><strong>Final da placa:</strong> {{ carro.finalPlaca }}</li>
          <li><strong>Localização:</strong> {{ carro.localizacao }}</li>
        </ul>
      </div>

      <!-- Formas de pagamento -->
      <div class="info-bloco">
        <h2>Formas de pagamento</h2>
        <ul class="info-lista">
          <li v-for="forma in carro.formasPagamento" :key="forma">{{ forma }}</li>
        </ul>
      </div>

      <!-- CTA -->
      <div class="cta-bloco">
        <h2>Ficou interessado?</h2>
        <h3>Entre em contato com a nossa equipe!</h3>
        <a
          href="https://wa.me/5566999896813?text=Chiquinho%20Motors/"
          class="btn zoom-shadow"
          title="WhatsApp"
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp
        </a>
      </div>

      <RouterLink to="/carros" class="btn zoom-shadow voltar-btn">
        ← Voltar aos Carros
      </RouterLink>
    </template>
  </section>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const carro = ref(null);
const carregando = ref(true);
const erro = ref(null);

async function buscarCarro(id) {
  carregando.value = true;
  erro.value = null;
  try {
    const res = await fetch(`/api/carros/${id}`);
    if (!res.ok) throw new Error('Veículo não encontrado.');
    carro.value = await res.json();
  } catch (e) {
    erro.value = e.message;
  } finally {
    carregando.value = false;
  }
}

onMounted(() => buscarCarro(route.params.id));
watch(() => route.params.id, (novoId) => buscarCarro(novoId));
</script>

<style scoped>
.detalhe-page {
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.galeria {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
  max-width: 700px;
}

.galeria img {
  width: 100%;
  border-radius: 6px;
}

.info-bloco {
  width: 100%;
  max-width: 600px;
}

.info-lista {
  list-style: none;
  padding: 0;
  margin-top: 0.5rem;
}

.info-lista li {
  padding: 0.35rem 0;
  border-bottom: 1px solid #ddd;
  font-size: 1em;
}

.cta-bloco {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.voltar-btn {
  margin-top: 0.5rem;
}

@media (max-width: 640px) {
  .detalhe-page {
    padding: 1rem 0.75rem;
    gap: 1rem;
  }

  .info-lista li {
    font-size: 0.95em;
    text-align: left;
  }

  .info-bloco h2,
  .cta-bloco h2,
  .cta-bloco h3 {
    font-size: 1em;
  }
}
</style>
