<script setup>
import { onMounted, ref } from 'vue';
import { Car, Pencil, Plus, Trash2 } from 'lucide-vue-next';
import { api } from '@/api';
import { brl, STATUS_CARRO } from '@/utils/formatar';

const carros = ref([]);
const carregando = ref(true);
const erro = ref('');
const aviso = ref('');

onMounted(async () => {
  try {
    carros.value = await api.admin.listar('carros');
  } catch (e) {
    erro.value = e.message;
  } finally {
    carregando.value = false;
  }
});

async function excluir(carro) {
  if (!window.confirm(`Excluir "${carro.nome}" e suas fotos do catálogo?`)) return;
  erro.value = '';
  aviso.value = '';
  try {
    await api.admin.excluir('carros', carro.id);
    carros.value = carros.value.filter((c) => c.id !== carro.id);
    aviso.value = `"${carro.nome}" excluído.`;
  } catch (e) {
    erro.value = e.message;
  }
}
</script>

<template>
  <header class="painel-cabecalho">
    <h1><Car :size="24" /> Veículos</h1>
    <RouterLink to="/admin/carros/novo" class="btn btn-red btn-sm"
      ><Plus :size="16" /> Novo veículo</RouterLink
    >
  </header>

  <div class="painel-corpo">
    <p v-if="erro" class="aviso aviso--erro">{{ erro }}</p>
    <p v-if="aviso" class="aviso aviso--ok">{{ aviso }}</p>

    <div class="painel-card tabela-wrapper">
      <p v-if="carregando" class="vazio">Carregando…</p>
      <p v-else-if="!carros.length" class="vazio">Nenhum veículo cadastrado.</p>
      <table v-else class="tabela">
        <thead>
          <tr>
            <th></th>
            <th>Veículo</th>
            <th>Ano</th>
            <th class="num">Preço</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in carros" :key="c.id">
            <td>
              <img v-if="c.imagens[0]" :src="c.imagens[0]" alt="" class="miniatura" />
              <span v-else class="miniatura"></span>
            </td>
            <td>
              {{ c.nome }}
              <p class="secundario">
                {{ c.marca }} · {{ c.modelo }} · {{ c.imagens.length }} fotos
              </p>
            </td>
            <td>{{ c.ano }}</td>
            <td class="num">{{ brl(c.preco) }}</td>
            <td>
              <span class="selo" :class="`selo--${STATUS_CARRO[c.status].selo}`">{{
                STATUS_CARRO[c.status].texto
              }}</span>
            </td>
            <td>
              <div class="acoes">
                <RouterLink
                  :to="`/admin/carros/${c.id}`"
                  class="btn-icone"
                  title="Editar"
                  :aria-label="`Editar ${c.nome}`"
                >
                  <Pencil :size="15" />
                </RouterLink>
                <button
                  type="button"
                  class="btn-icone"
                  title="Excluir"
                  :aria-label="`Excluir ${c.nome}`"
                  @click="excluir(c)"
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
