<template>
  <section class="detalhe-page">
    <p v-if="carregando" class="loading">Carregando veículo…</p>
    <p v-else-if="erro" class="error-msg">{{ erro }}</p>

    <template v-else-if="carro">
      <!-- Banner do veículo -->
      <div class="veiculo-banner">
        <RouterLink to="/carros" class="voltar-link">← Voltar</RouterLink>
        <h1>{{ carro.nome }}</h1>
        <p class="veiculo-preco">{{ carro.precoFormatado }}</p>
      </div>

      <div class="detalhe-inner">
        <!-- Galeria -->
        <div class="galeria">
          <img
            v-for="(img, i) in carro.imagens"
            :key="i"
            :src="img"
            :alt="`${carro.nome} — foto ${i + 1}`"
            :class="{ 'img-principal': i === 0 }"
          />
        </div>

        <!-- Painel de informações -->
        <aside class="painel">

          <!-- Ficha técnica -->
          <div class="ficha">
            <h2>Ficha Técnica</h2>
            <ul class="ficha-lista">
              <li><span class="ficha-label">Modelo</span><span>{{ carro.modelo }}</span></li>
              <li><span class="ficha-label">Carroceria</span><span>{{ carro.carroceria }}</span></li>
              <li><span class="ficha-label">Ano</span><span>{{ carro.ano }}</span></li>
              <li><span class="ficha-label">Km</span><span>{{ carro.quilometragem }}</span></li>
              <li><span class="ficha-label">Cor</span><span>{{ carro.cor }}</span></li>
              <li><span class="ficha-label">Combustível</span><span>{{ carro.combustivel }}</span></li>
              <li><span class="ficha-label">Câmbio</span><span>{{ carro.cambio }}</span></li>
              <li><span class="ficha-label">Portas</span><span>{{ carro.portas }}</span></li>
              <li><span class="ficha-label">Final placa</span><span>{{ carro.finalPlaca }}</span></li>
              <li><span class="ficha-label">Localização</span><span>{{ carro.localizacao }}</span></li>
            </ul>
          </div>

          <!-- Pagamento -->
          <div class="ficha">
            <h2>Formas de Pagamento</h2>
            <ul class="pagamento-lista">
              <li v-for="forma in carro.formasPagamento" :key="forma">
                <span class="check">✓</span> {{ forma }}
              </li>
            </ul>
          </div>

          <!-- CTA -->
          <div class="cta-box">
            <p class="cta-titulo">Ficou interessado?</p>
            <a
              href="https://wa.me/5566999896813?text=Chiquinho%20Motors/"
              class="btn btn-red zoom-shadow cta-wa"
              target="_blank"
              rel="noopener noreferrer"
            >
              💬 Falar no WhatsApp
            </a>
            <RouterLink to="/contato" class="btn zoom-shadow cta-email">
              Formulário de Contato
            </RouterLink>
          </div>

        </aside>
      </div>
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
  display: flex;
  flex-direction: column;
}

/* ── Banner do veículo ── */
.veiculo-banner {
  background: #1c1e22;
  padding: 1.5rem 2rem;
  text-align: center;
  position: relative;
  border-bottom: 3px solid #c0392b;
}

.voltar-link {
  display: inline-block;
  color: #c0392b;
  font-size: 0.85em;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
  transition: color 0.2s;
}

.voltar-link:hover { color: #e74c3c; }

.veiculo-banner h1 {
  color: #fff;
  font-size: 1.6em;
  margin-bottom: 0.3rem;
}

.veiculo-preco {
  color: #c0392b;
  font-size: 1.5em;
  font-weight: 900;
  letter-spacing: -0.01em;
}

/* ── Layout de 2 colunas ── */
.detalhe-inner {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 2rem;
  padding: 2rem;
  max-width: 1100px;
  margin: 0 auto;
  width: 100%;
  align-items: start;
}

/* ── Galeria ── */
.galeria {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.galeria img {
  width: 100%;
  border-radius: 10px;
  display: block;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.galeria img:hover { transform: scale(1.015); }

/* ── Painel lateral ── */
.painel {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  position: sticky;
  top: 90px;
}

.ficha {
  background: #fff;
  border-radius: 10px;
  padding: 1.2rem 1.4rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  border-top: 3px solid #c0392b;
}

.ficha h2 {
  font-size: 0.8em;
  text-align: left;
  margin-bottom: 0.75rem;
  color: #888;
  margin-top: 0;
}

.ficha-lista {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.ficha-lista li {
  display: flex;
  justify-content: space-between;
  padding: 0.45rem 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 0.92em;
  color: #333;
}

.ficha-lista li:last-child { border-bottom: none; }

.ficha-label {
  color: #888;
  font-weight: 500;
}

.pagamento-lista {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.pagamento-lista li {
  font-size: 0.92em;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.check {
  color: #27ae60;
  font-weight: 900;
  font-size: 1em;
}

/* ── CTA Box ── */
.cta-box {
  background: #1c1e22;
  border-radius: 10px;
  padding: 1.4rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: stretch;
  text-align: center;
  border-top: 3px solid #c0392b;
}

.cta-titulo {
  color: #fff;
  font-weight: 700;
  font-size: 1em;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.cta-wa, .cta-email {
  text-align: center;
  font-size: 0.92em;
}

/* ── Responsivo ── */
@media (max-width: 800px) {
  .detalhe-inner {
    grid-template-columns: 1fr;
    padding: 1rem;
    gap: 1.2rem;
  }

  .painel { position: static; }

  .veiculo-banner { padding: 1.2rem 1rem; }
  .veiculo-banner h1 { font-size: 1.2em; }
  .veiculo-preco { font-size: 1.2em; }
}
</style>
