<template>
  <section class="produto-detalhe">
    <p v-if="carregando" class="loading">Carregando…</p>
    <p v-else-if="erro" class="error-msg">{{ erro }}</p>

    <template v-else-if="produto">
      <div class="detalhe-banner">
        <RouterLink :to="voltarPara" class="voltar-link"><ArrowLeft :size="14" /> {{ voltarLabel }}</RouterLink>
        <span class="detalhe-categoria">{{ produto.categoria?.nome }}</span>
        <h1>{{ produto.nome }}</h1>
        <p class="detalhe-preco">{{ produto.precoFormatado }}</p>
      </div>

      <div class="detalhe-inner">
        <div class="detalhe-media">
          <img v-if="produto.imagemUrl" :src="produto.imagemUrl" :alt="produto.nome" />
          <div v-else class="media-placeholder" aria-hidden="true">
            <component :is="iconePlaceholder" :size="90" :stroke-width="1.25" />
          </div>
        </div>

        <aside class="detalhe-painel">
          <div class="ficha">
            <h2>Descrição</h2>
            <p class="descricao">{{ produto.descricao }}</p>
          </div>

          <div class="ficha">
            <h2>Informações</h2>
            <ul class="ficha-lista">
              <li><span>Categoria</span><span>{{ produto.categoria?.nome }}</span></li>
              <li v-if="produto.sku"><span>Código</span><span>{{ produto.sku }}</span></li>
              <li>
                <span>Disponibilidade</span>
                <span :class="produto.disponivel ? 'ok' : 'off'">
                  {{ produto.disponivel ? `${produto.estoque} em estoque` : 'Sem estoque' }}
                </span>
              </li>
            </ul>
          </div>

          <div v-if="produto.compativelCom?.length" class="ficha">
            <h2>Compatível com</h2>
            <ul class="compat-lista">
              <li v-for="m in produto.compativelCom" :key="m.slug">{{ m.nome }}</li>
            </ul>
          </div>

          <div class="cta-box">
            <p class="cta-titulo">Quer este item?</p>
            <a
              :href="linkWhatsApp"
              class="btn btn-red zoom-shadow"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle :size="16" /> Pedir no WhatsApp
            </a>
            <RouterLink to="/contato" class="btn zoom-shadow">Formulário de contato</RouterLink>
          </div>
        </aside>
      </div>
    </template>
  </section>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { ArrowLeft, MessageCircle, Headphones, Wrench } from 'lucide-vue-next';
import { api } from '../api';

const route = useRoute();
const produto = ref(null);
const carregando = ref(true);
const erro = ref(null);

const tipo = computed(() => route.meta.tipo ?? 'peca');
const voltarPara = computed(() => (tipo.value === 'acessorio' ? '/acessorios' : '/pecas'));
const voltarLabel = computed(() => (tipo.value === 'acessorio' ? 'Acessórios' : 'Auto-peças'));
const iconePlaceholder = computed(() => (tipo.value === 'acessorio' ? Headphones : Wrench));

const linkWhatsApp = computed(() => {
  const texto = `Olá! Tenho interesse na peça/acessório "${produto.value?.nome}" da Chiquinho Motors.`;
  return `https://wa.me/5566999896813?text=${encodeURIComponent(texto)}`;
});

async function carregar(id) {
  carregando.value = true;
  erro.value = null;
  produto.value = null;
  try {
    produto.value =
      tipo.value === 'acessorio' ? await api.buscarAcessorio(id) : await api.buscarPeca(id);
  } catch (e) {
    erro.value = e.status === 404 ? 'Item não encontrado.' : e.message;
  } finally {
    carregando.value = false;
  }
}

watch(() => route.params.id, (id) => carregar(id), { immediate: true });
</script>

<style scoped>
.produto-detalhe {
  display: flex;
  flex-direction: column;
}

.detalhe-banner {
  background: #1c1e22;
  padding: 1.5rem 2rem;
  text-align: center;
  border-bottom: 3px solid #c0392b;
}

.voltar-link {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  color: #c0392b;
  font-size: 0.82em;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.voltar-link:hover {
  color: #e74c3c;
}

.detalhe-categoria {
  display: block;
  font-size: 0.75em;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #b0b4bc;
  margin-bottom: 0.3rem;
}

.detalhe-banner h1 {
  color: #fff;
  font-size: 1.5em;
  margin-bottom: 0.3rem;
}

.detalhe-preco {
  color: #c0392b;
  font-size: 1.5em;
  font-weight: 900;
}

.detalhe-inner {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 2rem;
  padding: 2rem;
  max-width: 1100px;
  margin: 0 auto;
  width: 100%;
  align-items: start;
}

.detalhe-media img,
.media-placeholder {
  width: 100%;
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.media-placeholder {
  aspect-ratio: 4 / 3;
  display: grid;
  place-items: center;
  color: #a3a3a3;
  background: repeating-linear-gradient(45deg, #f0f0f0, #f0f0f0 14px, #e9e9e9 14px, #e9e9e9 28px);
}

.detalhe-painel {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.ficha {
  background: #fff;
  border-radius: 10px;
  padding: 1.2rem 1.4rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border-top: 3px solid #c0392b;
}

.ficha h2 {
  font-size: 0.8em;
  text-align: left;
  margin: 0 0 0.75rem;
  color: #888;
}

.descricao {
  font-size: 0.92em;
  color: #333;
  line-height: 1.7;
  text-align: left;
}

.ficha-lista {
  list-style: none;
  padding: 0;
  margin: 0;
}

.ficha-lista li {
  display: flex;
  justify-content: space-between;
  padding: 0.45rem 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 0.9em;
  color: #333;
}

.ficha-lista li:last-child {
  border-bottom: none;
}

.ficha-lista li span:first-child {
  color: #888;
}

.ok {
  color: #27ae60;
  font-weight: 700;
}

.off {
  color: #c0392b;
  font-weight: 700;
}

.compat-lista {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.compat-lista li {
  background: #f0f0f0;
  color: #555;
  font-size: 0.78em;
  font-weight: 600;
  padding: 0.25em 0.7em;
  border-radius: 4px;
}

.cta-box {
  background: #1c1e22;
  border-radius: 10px;
  padding: 1.4rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  text-align: center;
  border-top: 3px solid #c0392b;
}

.cta-titulo {
  color: #fff;
  font-weight: 700;
  font-size: 0.95em;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

@media (max-width: 800px) {
  .detalhe-inner {
    grid-template-columns: 1fr;
    padding: 1rem;
    gap: 1.2rem;
  }
}
</style>
