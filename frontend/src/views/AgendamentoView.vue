<template>
  <section class="agendar-page">
    <p v-if="carregando" class="loading">Carregando…</p>
    <p v-else-if="erroServico" class="error-msg">{{ erroServico }}</p>

    <template v-else-if="servico">
      <div class="section-banner">
        <h1><CalendarCheck :size="26" /> {{ servico.nome }}</h1>
        <p class="banner-sub">
          a partir de {{ servico.precoBaseFormatado }} · duração {{ servico.duracaoFormatada }}
        </p>
      </div>

      <div class="agendar-inner">
        <!-- 1. Data e horário -->
        <div class="passo">
          <h2><span class="num">1</span> Escolha o dia e o horário</h2>
          <label for="data">Dia</label>
          <input id="data" v-model="data" type="date" :min="dataMin" :max="dataMax" />
          <p class="dica">
            Atendimento de segunda a sexta, das 08:00 às 18:00 (horário de Sinop–MT).
          </p>

          <p v-if="!data" class="vazio">Selecione um dia para ver os horários livres.</p>
          <p v-else-if="carregandoHorarios" class="vazio">Buscando horários…</p>
          <p v-else-if="erroHorarios" class="form-erro">{{ erroHorarios }}</p>
          <p v-else-if="fechado" class="vazio">
            A oficina não abre neste dia. Escolha um dia útil.
          </p>
          <p v-else-if="!horarios.length" class="vazio">
            Nenhum horário livre em {{ formatarData(data) }}. Tente outro dia.
          </p>
          <div v-else class="horarios" role="radiogroup" aria-label="Horários livres">
            <button
              v-for="h in horarios"
              :key="h.dataHora"
              type="button"
              role="radio"
              class="horario"
              :class="{ selecionado: horario?.dataHora === h.dataHora }"
              :aria-checked="horario?.dataHora === h.dataHora"
              @click="horario = h"
            >
              {{ h.hora }}
            </button>
          </div>
        </div>

        <!-- 2. Dados -->
        <form class="passo" novalidate @submit.prevent="confirmar">
          <h2><span class="num">2</span> Seus dados e o veículo</h2>
          <p v-if="erroGeral" class="form-erro">{{ erroGeral }}</p>

          <label for="nome">Nome</label>
          <input id="nome" v-model.trim="form.nome" type="text" autocomplete="name" />
          <span v-if="erros.nome" class="campo-erro">{{ erros.nome }}</span>

          <label for="email">E-mail</label>
          <input id="email" v-model.trim="form.email" type="email" autocomplete="email" />
          <span v-if="erros.email" class="campo-erro">{{ erros.email }}</span>

          <label for="telefone">Telefone / WhatsApp</label>
          <input id="telefone" v-model.trim="form.telefone" type="tel" autocomplete="tel" />
          <span v-if="erros.telefone" class="campo-erro">{{ erros.telefone }}</span>

          <label for="veiculo">Veículo</label>
          <input
            id="veiculo"
            v-model.trim="form.veiculoDescricao"
            type="text"
            placeholder="Ex.: Gol 2020, placa ABC-1234"
          />
          <span v-if="erros.veiculoDescricao" class="campo-erro">{{ erros.veiculoDescricao }}</span>

          <p v-if="horario" class="resumo">
            <Clock :size="16" /> {{ formatarData(data) }}, às <strong>{{ horario.hora }}</strong>
          </p>

          <button type="submit" class="btn btn-red submit-btn" :disabled="!horario || enviando">
            {{ textoBotao }}
          </button>
        </form>
      </div>
    </template>
  </section>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { CalendarCheck, Clock } from 'lucide-vue-next';
import { api } from '../api';
import { diaNaOficina, formatarData, JANELA_DIAS } from '../utils/agenda';

const route = useRoute();
const router = useRouter();

const servico = ref(null);
const carregando = ref(true);
const erroServico = ref(null);

const dataMin = diaNaOficina();
const dataMax = diaNaOficina(JANELA_DIAS);
const data = ref('');
const horarios = ref([]);
const horario = ref(null);
const fechado = ref(false);
const carregandoHorarios = ref(false);
const erroHorarios = ref('');

const form = reactive({ nome: '', email: '', telefone: '', veiculoDescricao: '' });
const erros = reactive({ nome: '', email: '', telefone: '', veiculoDescricao: '' });
const erroGeral = ref('');
const enviando = ref(false);

const textoBotao = computed(() => {
  if (enviando.value) return 'Agendando…';
  return horario.value ? `Confirmar agendamento às ${horario.value.hora}` : 'Escolha um horário';
});

async function carregarServico(slug) {
  carregando.value = true;
  erroServico.value = null;
  try {
    servico.value = await api.buscarServico(slug);
  } catch (e) {
    erroServico.value = e.status === 404 ? 'Serviço não encontrado.' : e.message;
  } finally {
    carregando.value = false;
  }
}

let requisicaoAtual = 0;
async function carregarHorarios() {
  horario.value = null;
  horarios.value = [];
  erroHorarios.value = '';
  fechado.value = false;
  if (!data.value || !servico.value) return;

  const id = ++requisicaoAtual;
  carregandoHorarios.value = true;
  try {
    const resp = await api.disponibilidade(servico.value.id, data.value);
    if (id !== requisicaoAtual) return; // usuário já trocou de dia
    horarios.value = resp.horarios;
    fechado.value = resp.fechado;
  } catch (e) {
    if (id === requisicaoAtual) erroHorarios.value = e.message;
  } finally {
    if (id === requisicaoAtual) carregandoHorarios.value = false;
  }
}

function validar() {
  erros.nome = form.nome.length >= 2 ? '' : 'Informe seu nome.';
  erros.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? '' : 'E-mail inválido.';
  erros.telefone = form.telefone.length >= 8 ? '' : 'Telefone inválido.';
  erros.veiculoDescricao =
    form.veiculoDescricao.length >= 3 ? '' : 'Descreva o veículo (modelo, ano, placa).';
  return !erros.nome && !erros.email && !erros.telefone && !erros.veiculoDescricao;
}

async function confirmar() {
  erroGeral.value = '';
  if (!horario.value || !validar()) return;

  enviando.value = true;
  try {
    const { nome, email, telefone, veiculoDescricao } = form;
    const agendamento = await api.criarAgendamento({
      servico: servico.value.id,
      dataHora: horario.value.dataHora,
      veiculoDescricao,
      cliente: { nome, email, telefone },
    });
    router.push(`/agendamento/${agendamento.codigo}`);
  } catch (e) {
    erroGeral.value = e.message || 'Não foi possível agendar. Tente novamente.';
    if (e.status === 409) {
      await carregarHorarios(); // alguém pegou o horário: mostra a grade atualizada
    }
    for (const d of e.detalhes ?? []) {
      const campo = d.campo.replace('cliente.', '');
      if (campo in erros) erros[campo] = d.mensagem;
    }
  } finally {
    enviando.value = false;
  }
}

watch(data, carregarHorarios);
watch(
  () => route.params.servicoSlug,
  async (slug) => {
    await carregarServico(slug);
    await carregarHorarios();
  },
  { immediate: true },
);
</script>

<style scoped>
.banner-sub {
  color: #b0b4bc;
  font-size: 0.92em;
  margin-top: 0.25rem;
}

.agendar-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
  width: 100%;
  align-items: start;
}

.passo {
  background: #fff;
  border-radius: 12px;
  padding: 1.75rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border-top: 3px solid #c0392b;
  text-align: left;
}

.passo h2 {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1em;
  margin: 0 0 1.2rem;
  text-align: left;
  color: #1a1a1a;
}

.num {
  display: inline-grid;
  place-items: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #c0392b;
  color: #fff;
  font-size: 0.85em;
}

input[type='date'] {
  width: 100%;
  padding: 0.65em 0.9em;
  border: 1px solid #ddd;
  border-radius: 6px;
  font: inherit;
  margin-bottom: 0.5rem;
}

.dica {
  font-size: 0.8em;
  color: #888;
  margin-bottom: 1.25rem;
}

.vazio {
  color: #888;
  font-size: 0.9em;
  padding: 1rem 0;
}

.horarios {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(76px, 1fr));
  gap: 0.5rem;
}

.horario {
  padding: 0.6em 0;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background 0.2s ease;
}

.horario:hover {
  border-color: #c0392b;
}

.horario.selecionado {
  background: #c0392b;
  border-color: #c0392b;
  color: #fff;
}

.form-erro {
  background: #fdeceb;
  border: 1px solid #f3b7b1;
  color: #c0392b;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 0.9em;
  margin-bottom: 1rem;
}

.campo-erro {
  display: block;
  color: #c0392b;
  font-size: 0.8em;
  font-weight: 600;
  margin: -8px 0 12px;
}

.resumo {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: #f5f5f5;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 0.9em;
  margin-bottom: 1rem;
}

.submit-btn {
  width: 100%;
  font-size: 1em;
  padding: 0.8em 1em;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 800px) {
  .agendar-inner {
    grid-template-columns: 1fr;
    padding: 1rem;
  }
}
</style>
