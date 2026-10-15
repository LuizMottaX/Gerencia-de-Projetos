<template>
  <section class="confirmado-page">
    <p v-if="carregando" class="loading">Carregando…</p>
    <p v-else-if="erro" class="error-msg">{{ erro }}</p>

    <template v-else-if="agendamento">
      <div class="section-banner">
        <h1><CircleCheck :size="26" /> Agendamento solicitado</h1>
        <p class="banner-sub">
          Obrigado, {{ agendamento.cliente?.nome }}! A oficina vai confirmar pelo telefone
          informado.
        </p>
      </div>

      <div class="confirmado-inner">
        <div class="card-confirmado">
          <div class="topo">
            <div>
              <span class="rotulo">Código do agendamento</span>
              <p class="codigo">{{ agendamento.codigo }}</p>
            </div>
            <span class="status" :class="`status--${agendamento.status.toLowerCase()}`">
              {{ STATUS[agendamento.status] ?? agendamento.status }}
            </span>
          </div>

          <ul class="detalhes">
            <li>
              <Wrench :size="18" />
              <span
                >{{ agendamento.servico.nome }} ({{ agendamento.servico.duracaoFormatada }})</span
              >
            </li>
            <li>
              <CalendarDays :size="18" />
              <span>{{ formatarData(agendamento.data) }}, às {{ agendamento.hora }}</span>
            </li>
            <li>
              <Car :size="18" />
              <span>{{ agendamento.veiculoDescricao }}</span>
            </li>
            <li>
              <Tag :size="18" />
              <span>a partir de {{ agendamento.servico.precoBaseFormatado }}</span>
            </li>
          </ul>

          <div class="acoes">
            <a
              :href="linkWhatsApp"
              class="btn btn-red zoom-shadow"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle :size="16" /> Confirmar pelo WhatsApp
            </a>
            <RouterLink to="/servicos" class="btn">Ver outros serviços</RouterLink>
          </div>
        </div>
      </div>
    </template>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { CalendarDays, Car, CircleCheck, MessageCircle, Tag, Wrench } from 'lucide-vue-next';
import { api } from '../api';
import { formatarData } from '../utils/agenda';

const STATUS = {
  SOLICITADO: 'Aguardando confirmação',
  CONFIRMADO: 'Confirmado',
  CONCLUIDO: 'Concluído',
  CANCELADO: 'Cancelado',
};

const route = useRoute();
const agendamento = ref(null);
const carregando = ref(true);
const erro = ref(null);

const linkWhatsApp = computed(() => {
  const a = agendamento.value;
  if (!a) return '#';
  const texto =
    `Olá! Agendei *${a.servico.nome}* para ${formatarData(a.data)}, às ${a.hora} ` +
    `(código ${a.codigo}). Veículo: ${a.veiculoDescricao}.`;
  return `https://wa.me/5566999896813?text=${encodeURIComponent(texto)}`;
});

watch(
  () => route.params.codigo,
  async (codigo) => {
    carregando.value = true;
    erro.value = null;
    try {
      agendamento.value = await api.buscarAgendamento(codigo);
    } catch (e) {
      erro.value = e.status === 404 ? 'Agendamento não encontrado.' : e.message;
    } finally {
      carregando.value = false;
    }
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

.confirmado-inner {
  padding: 2rem;
  max-width: 720px;
  margin: 0 auto;
  width: 100%;
}

.card-confirmado {
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border-top: 3px solid #c0392b;
  text-align: left;
}

.topo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.rotulo {
  font-size: 0.75em;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #666;
}

.codigo {
  font-size: 1.8em;
  font-weight: 900;
  letter-spacing: 0.08em;
  color: #1a1a1a;
}

.status {
  padding: 0.35em 0.9em;
  border-radius: 50px;
  font-size: 0.85em;
  font-weight: 700;
  background: #fff4e5;
  color: #b36b00;
}

.status--confirmado,
.status--concluido {
  background: #eafaf0;
  color: #1e7e45;
}

.status--cancelado {
  background: #fdeceb;
  color: #c0392b;
}

.detalhes {
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detalhes li {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: #333;
}

.detalhes .lucide {
  color: #c0392b;
  flex-shrink: 0;
}

.acoes {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

@media (max-width: 600px) {
  .confirmado-inner {
    padding: 1rem;
  }

  .card-confirmado {
    padding: 1.25rem;
  }
}
</style>
