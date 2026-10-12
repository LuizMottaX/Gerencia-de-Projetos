<script setup>
import { ref, watch } from 'vue';
import { ShoppingBag } from 'lucide-vue-next';
import { api } from '@/api';
import { brl, dataHoraCurta, FINAIS, STATUS_PEDIDO } from '@/utils/formatar';

const filtro = ref('');
const pedidos = ref([]);
const carregando = ref(true);
const erro = ref('');
const aviso = ref('');
const aberto = ref(null);

async function carregar() {
  carregando.value = true;
  erro.value = '';
  try {
    pedidos.value = await api.admin.listar('pedidos', { status: filtro.value });
  } catch (e) {
    erro.value = e.message;
  } finally {
    carregando.value = false;
  }
}

async function mudarStatus(pedido, evento) {
  const status = evento.target.value;
  if (
    status === 'CANCELADO' &&
    !window.confirm(`Cancelar ${pedido.codigo}? Os itens voltam ao estoque.`)
  ) {
    evento.target.value = pedido.status; // desistiu: o select volta ao status atual
    return;
  }
  erro.value = '';
  aviso.value = '';
  try {
    const atualizado = await api.admin.mudarStatus('pedidos', pedido.codigo, status);
    Object.assign(pedido, atualizado);
    aviso.value = `${pedido.codigo}: ${STATUS_PEDIDO[status].texto}.`;
  } catch (e) {
    erro.value = e.message;
    await carregar();
  }
}

watch(filtro, carregar, { immediate: true });
</script>

<template>
  <header class="painel-cabecalho">
    <h1><ShoppingBag :size="24" /> Pedidos</h1>
    <div class="filtros">
      <select v-model="filtro" aria-label="Filtrar por status">
        <option value="">Todos os status</option>
        <option v-for="(s, chave) in STATUS_PEDIDO" :key="chave" :value="chave">
          {{ s.texto }}
        </option>
      </select>
    </div>
  </header>

  <div class="painel-corpo">
    <p v-if="erro" class="aviso aviso--erro">{{ erro }}</p>
    <p v-if="aviso" class="aviso aviso--ok">{{ aviso }}</p>

    <div class="painel-card tabela-wrapper">
      <p v-if="carregando" class="vazio">Carregando…</p>
      <p v-else-if="!pedidos.length" class="vazio">Nenhum pedido.</p>
      <table v-else class="tabela">
        <thead>
          <tr>
            <th>Código</th>
            <th>Cliente</th>
            <th>Data</th>
            <th class="num">Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="p in pedidos" :key="p.codigo">
            <tr>
              <td>
                <button
                  type="button"
                  class="link-codigo"
                  @click="aberto = aberto === p.codigo ? null : p.codigo"
                >
                  {{ p.codigo }}
                </button>
                <p class="secundario">
                  {{ p.itens.length }} {{ p.itens.length === 1 ? 'item' : 'itens' }}
                </p>
              </td>
              <td>
                {{ p.cliente.nome }}
                <p class="secundario">{{ p.cliente.telefone }} · {{ p.cliente.email }}</p>
              </td>
              <td class="secundario">{{ dataHoraCurta(p.criadoEm) }}</td>
              <td class="num">{{ brl(p.total) }}</td>
              <td>
                <span
                  v-if="FINAIS.includes(p.status)"
                  class="selo"
                  :class="`selo--${STATUS_PEDIDO[p.status].selo}`"
                >
                  {{ STATUS_PEDIDO[p.status].texto }}
                </span>
                <select
                  v-else
                  :value="p.status"
                  :aria-label="`Status do pedido ${p.codigo}`"
                  @change="mudarStatus(p, $event)"
                >
                  <option v-for="(s, chave) in STATUS_PEDIDO" :key="chave" :value="chave">
                    {{ s.texto }}
                  </option>
                </select>
              </td>
            </tr>
            <tr v-if="aberto === p.codigo" class="detalhe">
              <td colspan="5">
                <ul>
                  <li v-for="i in p.itens" :key="i.produtoId">
                    {{ i.quantidade }}× {{ i.nome }} — {{ brl(i.precoUnit) }} cada
                  </li>
                </ul>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.link-codigo {
  background: none;
  border: none;
  padding: 0;
  color: var(--color-red-light);
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.tabela select {
  min-width: 170px;
}

.detalhe td {
  background: var(--color-carbon);
}

.detalhe ul {
  margin: 0;
  padding-left: 1.25rem;
  color: var(--color-silver);
}
</style>
