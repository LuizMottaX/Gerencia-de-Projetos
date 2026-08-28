<template>
  <section class="catalogo-page">
    <div class="section-banner">
      <h1><component :is="icone" v-if="icone" :size="30" /> {{ titulo }}</h1>
      <p class="banner-sub">{{ subtitulo }}</p>
    </div>

    <div class="catalogo-inner">
      <!-- Filtros -->
      <form class="filtros" @submit.prevent>
        <div class="filtro-campo filtro-busca">
          <label :for="`busca-${tipo}`">Buscar</label>
          <input
            :id="`busca-${tipo}`"
            v-model.trim="filtros.busca"
            type="search"
            placeholder="Nome ou descrição…"
          />
        </div>

        <div class="filtro-campo">
          <label :for="`cat-${tipo}`">Categoria</label>
          <select :id="`cat-${tipo}`" v-model="filtros.categoria">
            <option value="">Todas</option>
            <option v-for="c in categorias" :key="c.slug" :value="c.slug">{{ c.nome }}</option>
          </select>
        </div>

        <div v-if="tipo === 'peca'" class="filtro-campo">
          <label :for="`mod-${tipo}`">Compatível com</label>
          <select :id="`mod-${tipo}`" v-model="filtros.modelo">
            <option value="">Qualquer modelo</option>
            <option v-for="m in modelos" :key="m.slug" :value="m.slug">{{ m.nome }}</option>
          </select>
        </div>

        <div class="filtro-campo">
          <label :for="`ord-${tipo}`">Ordenar</label>
          <select :id="`ord-${tipo}`" v-model="filtros.ordenar">
            <option value="nome">Nome (A–Z)</option>
            <option value="preco-asc">Menor preço</option>
            <option value="preco-desc">Maior preço</option>
            <option value="recentes">Mais recentes</option>
          </select>
        </div>

        <button v-if="temFiltro" type="button" class="btn-limpar" @click="limpar">
          Limpar filtros
        </button>
      </form>

      <!-- Resultados -->
      <p v-if="erro" class="error-msg">{{ erro }}</p>
      <p v-else-if="carregando" class="loading">Carregando…</p>
      <template v-else>
        <p class="resultado-contagem">
          {{ total }} {{ total === 1 ? 'item encontrado' : 'itens encontrados' }}
        </p>
        <p v-if="!itens.length" class="vazio">
          Nenhum item corresponde aos filtros. <button type="button" @click="limpar">Limpar</button>
        </p>
        <div v-else class="grid-container">
          <CardProduto v-for="p in itens" :key="p.id" :produto="p" />
        </div>
      </template>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref, computed, watchEffect } from 'vue';
import { api } from '../api';
import { useCatalogoStore } from '../stores/catalogo';
import { useProdutos } from '../composables/useProdutos';
import CardProduto from './CardProduto.vue';

const props = defineProps({
  tipo: { type: String, required: true }, // 'peca' | 'acessorio'
  titulo: { type: String, required: true },
  subtitulo: { type: String, default: '' },
  icone: { type: [Object, Function], default: null },
});

const filtros = reactive({ busca: '', categoria: '', modelo: '', ordenar: 'nome' });

const store = useCatalogoStore();
const categorias = ref([]);
const modelos = ref([]);

watchEffect(async () => {
  categorias.value = await store.carregarCategorias(props.tipo);
  if (props.tipo === 'peca') modelos.value = await store.carregarModelos();
});

const fetcher = computed(() => (props.tipo === 'acessorio' ? api.listarAcessorios : api.listarPecas));
const { itens, total, carregando, erro } = useProdutos((f) => fetcher.value(f), filtros);

const temFiltro = computed(
  () => filtros.busca || filtros.categoria || filtros.modelo || filtros.ordenar !== 'nome',
);

function limpar() {
  filtros.busca = '';
  filtros.categoria = '';
  filtros.modelo = '';
  filtros.ordenar = 'nome';
}
</script>

<style scoped>
.catalogo-page {
  display: flex;
  flex-direction: column;
}

.banner-sub {
  color: #b0b4bc;
  font-size: 0.92em;
  margin-top: 0.25rem;
}

.catalogo-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem 1rem;
  width: 100%;
}

/* ── Filtros ── */
.filtros {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: flex-end;
  background: #fff;
  border-radius: 12px;
  border-top: 3px solid #c0392b;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 1.2rem 1.4rem;
  margin-bottom: 1.5rem;
}

.filtro-campo {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  min-width: 150px;
}

.filtro-busca {
  flex: 1 1 220px;
}

.filtro-campo label {
  font-size: 0.72em;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #666;
}

.filtro-campo input,
.filtro-campo select {
  padding: 0.55em 0.7em;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-family: inherit;
  font-size: 0.92em;
  background: #fff;
  color: #1a1a1a;
  outline: none;
  transition: border-color 0.2s;
}

.filtro-campo input:focus,
.filtro-campo select:focus {
  border-color: #c0392b;
}

.btn-limpar {
  background: none;
  border: none;
  color: #c0392b;
  font-weight: 700;
  font-size: 0.82em;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  padding: 0.6em 0;
}

.btn-limpar:hover {
  text-decoration: underline;
}

/* ── Resultados ── */
.resultado-contagem {
  font-size: 0.85em;
  color: #777;
  margin-bottom: 1rem;
  text-align: left;
}

.vazio {
  padding: 2.5rem 1rem;
  text-align: center;
  color: #666;
}

.vazio button {
  background: none;
  border: none;
  color: #c0392b;
  font-weight: 700;
  cursor: pointer;
}

.grid-container {
  padding: 0;
}
</style>
