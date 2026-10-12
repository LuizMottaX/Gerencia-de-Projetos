<script setup>
import { computed, ref, watch } from 'vue';
import { CalendarDays } from 'lucide-vue-next';
import { api } from '@/api';
import { diaNaOficina, formatarData } from '@/utils/agenda';
import { FINAIS, STATUS_AGENDAMENTO } from '@/utils/formatar';

const de = ref(diaNaOficina());
const ate = ref(diaNaOficina(14));
const status = ref('');
const agendamentos = ref([]);
const carregando = ref(true);
const erro = ref('');
const aviso = ref('');

// Agrupa por dia para a agenda ficar legível.
const porDia = computed(() => {
  const grupos = new Map();
  for (const a of agendamentos.value) {
    if (!grupos.has(a.data)) grupos.set(a.data, []);
    grupos.get(a.data).push(a);
  }
  return [...grupos.entries()];
});

async function carregar() {
  carregando.value = true;
  erro.value = '';
  try {
    agendamentos.value = await api.admin.listar('agendamentos', {
      de: de.value,
      ate: ate.value,
      status: status.value,
    });
  } catch (e) {
    erro.value = e.message;
  } finally {
    carregando.value = false;
  }
}

async function mudarStatus(agendamento, evento) {
  const novo = evento.target.value;
  if (
    novo === 'CANCELADO' &&
    !window.confirm(`Cancelar ${agendamento.codigo}? O horário volta a ficar livre.`)
  ) {
    evento.target.value = agendamento.status; // desistiu: o select volta ao status atual
    return;
  }
  erro.value = '';
  aviso.value = '';
  try {
    Object.assign(
      agendamento,
      await api.admin.mudarStatus('agendamentos', agendamento.codigo, novo),
    );
    aviso.value = `${agendamento.codigo}: ${STATUS_AGENDAMENTO[novo].texto}.`;
  } catch (e) {
    erro.value = e.message;
    await carregar();
  }
}

watch([de, ate, status], carregar, { immediate: true });
</script>

<template>
  <header class="painel-cabecalho">
    <h1><CalendarDays :size="24" /> Agenda da oficina</h1>
    <div class="filtros">
      <input v-model="de" type="date" aria-label="De" />
      <input v-model="ate" type="date" aria-label="Até" />
      <select v-model="status" aria-label="Filtrar por status">
        <option value="">Todos os status</option>
        <option v-for="(s, chave) in STATUS_AGENDAMENTO" :key="chave" :value="chave">
          {{ s.texto }}
        </option>
      </select>
    </div>
  </header>

  <div class="painel-corpo">
    <p v-if="erro" class="aviso aviso--erro">{{ erro }}</p>
    <p v-if="aviso" class="aviso aviso--ok">{{ aviso }}</p>
    <p v-if="carregando" class="vazio">Carregando…</p>
    <p v-else-if="!agendamentos.length" class="vazio">Nenhum agendamento no período.</p>

    <section v-for="[dia, lista] in porDia" :key="dia" class="painel-card tabela-wrapper">
      <h2>{{ formatarData(dia) }}</h2>
      <table class="tabela">
        <tbody>
          <tr v-for="a in lista" :key="a.codigo">
            <td class="hora">{{ a.hora }}</td>
            <td>
              {{ a.servico.nome }}
              <p class="secundario">{{ a.servico.duracaoFormatada }} · {{ a.codigo }}</p>
            </td>
            <td>
              {{ a.cliente.nome }}
              <p class="secundario">{{ a.cliente.telefone }}</p>
            </td>
            <td class="secundario">{{ a.veiculoDescricao }}</td>
            <td>
              <span
                v-if="FINAIS.includes(a.status)"
                class="selo"
                :class="`selo--${STATUS_AGENDAMENTO[a.status].selo}`"
              >
                {{ STATUS_AGENDAMENTO[a.status].texto }}
              </span>
              <select
                v-else
                :value="a.status"
                :aria-label="`Status do agendamento ${a.codigo}`"
                @change="mudarStatus(a, $event)"
              >
                <option v-for="(s, chave) in STATUS_AGENDAMENTO" :key="chave" :value="chave">
                  {{ s.texto }}
                </option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<style scoped>
.painel-card h2::first-letter {
  text-transform: uppercase;
}

.hora {
  font-weight: 900;
  font-size: 1.05rem;
  color: var(--color-white);
  width: 70px;
}

.tabela select {
  min-width: 150px;
}
</style>
