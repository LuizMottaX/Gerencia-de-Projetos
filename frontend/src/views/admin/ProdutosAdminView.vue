<script setup>
import { ref, watch } from 'vue';
import { PackageSearch, Pencil, Plus, Trash2 } from 'lucide-vue-next';
import { api } from '@/api';
import { brl } from '@/utils/formatar';

const tipo = ref('');
const busca = ref('');
const produtos = ref([]);
const carregando = ref(true);
const erro = ref('');
const aviso = ref('');

let timer;
async function carregar() {
  carregando.value = true;
  erro.value = '';
  try {
    produtos.value = await api.admin.listar('produtos', { tipo: tipo.value, busca: busca.value });
  } catch (e) {
    erro.value = e.message;
  } finally {
    carregando.value = false;
  }
}

async function excluir(produto) {
  if (!window.confirm(`Excluir "${produto.nome}"?`)) return;
  erro.value = '';
  aviso.value = '';
  try {
    await api.admin.excluir('produtos', produto.id);
    produtos.value = produtos.value.filter((p) => p.id !== produto.id);
    aviso.value = `"${produto.nome}" excluído.`;
  } catch (e) {
    erro.value =
      e.status === 409
        ? `"${produto.nome}" já aparece em pedidos e não pode ser excluído. Zere o estoque para tirá-lo de venda.`
        : e.message;
  }
}

watch(tipo, carregar, { immediate: true });
watch(busca, () => {
  clearTimeout(timer);
  timer = setTimeout(carregar, 300);
});
</script>

<template>
  <header class="painel-cabecalho">
    <h1><PackageSearch :size="24" /> Peças e acessórios</h1>
    <RouterLink to="/admin/produtos/novo" class="btn btn-red btn-sm"
      ><Plus :size="16" /> Novo produto</RouterLink
    >
  </header>

  <div class="painel-corpo">
    <div class="filtros">
      <input v-model.trim="busca" type="search" placeholder="Buscar por nome" aria-label="Buscar" />
      <select v-model="tipo" aria-label="Tipo">
        <option value="">Peças e acessórios</option>
        <option value="PECA">Só peças</option>
        <option value="ACESSORIO">Só acessórios</option>
      </select>
    </div>

    <p v-if="erro" class="aviso aviso--erro">{{ erro }}</p>
    <p v-if="aviso" class="aviso aviso--ok">{{ aviso }}</p>

    <div class="painel-card tabela-wrapper">
      <p v-if="carregando" class="vazio">Carregando…</p>
      <p v-else-if="!produtos.length" class="vazio">Nenhum produto encontrado.</p>
      <table v-else class="tabela">
        <thead>
          <tr>
            <th></th>
            <th>Produto</th>
            <th>Categoria</th>
            <th class="num">Preço</th>
            <th class="num">Estoque</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in produtos" :key="p.id">
            <td>
              <img v-if="p.imagemUrl" :src="p.imagemUrl" alt="" class="miniatura" />
              <span v-else class="miniatura"></span>
            </td>
            <td>
              {{ p.nome }}
              <p class="secundario">
                {{ p.tipo === 'PECA' ? 'Peça' : 'Acessório' }}{{ p.sku ? ` · ${p.sku}` : '' }}
              </p>
            </td>
            <td>{{ p.categoria }}</td>
            <td class="num">{{ brl(p.preco) }}</td>
            <td class="num">
              <span
                class="selo"
                :class="{ 'selo--erro': !p.estoque, 'selo--alerta': p.estoque && p.estoque <= 3 }"
              >
                {{ p.estoque }}
              </span>
            </td>
            <td>
              <div class="acoes">
                <RouterLink
                  :to="`/admin/produtos/${p.id}`"
                  class="btn-icone"
                  title="Editar"
                  :aria-label="`Editar ${p.nome}`"
                >
                  <Pencil :size="15" />
                </RouterLink>
                <button
                  type="button"
                  class="btn-icone"
                  title="Excluir"
                  :aria-label="`Excluir ${p.nome}`"
                  @click="excluir(p)"
                >
                  <Trash2 :size="15" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
