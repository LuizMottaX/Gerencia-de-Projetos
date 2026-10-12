<script setup>
import { ref, watch } from 'vue';
import { Inbox, Mail, MailOpen } from 'lucide-vue-next';
import { api } from '@/api';
import { dataHoraCurta } from '@/utils/formatar';

const filtro = ref('false');
const mensagens = ref([]);
const carregando = ref(true);
const erro = ref('');

async function carregar() {
  carregando.value = true;
  erro.value = '';
  try {
    mensagens.value = await api.admin.listar('mensagens', { lida: filtro.value });
  } catch (e) {
    erro.value = e.message;
  } finally {
    carregando.value = false;
  }
}

async function alternar(msg) {
  try {
    Object.assign(msg, await api.admin.marcarMensagem(msg.id, !msg.lida));
  } catch (e) {
    erro.value = e.message;
  }
}

watch(filtro, carregar, { immediate: true });
</script>

<template>
  <header class="painel-cabecalho">
    <h1><Inbox :size="24" /> Mensagens de contato</h1>
    <div class="filtros">
      <select v-model="filtro" aria-label="Filtrar mensagens">
        <option value="false">Não lidas</option>
        <option value="true">Lidas</option>
        <option value="">Todas</option>
      </select>
    </div>
  </header>

  <div class="painel-corpo">
    <p v-if="erro" class="aviso aviso--erro">{{ erro }}</p>
    <p v-if="carregando" class="vazio">Carregando…</p>
    <p v-else-if="!mensagens.length" class="vazio">Nenhuma mensagem.</p>

    <article
      v-for="m in mensagens"
      :key="m.id"
      class="painel-card mensagem"
      :class="{ lida: m.lida }"
    >
      <div class="topo">
        <div>
          <strong>{{ m.nome }}</strong>
          <p class="secundario">
            <a :href="`mailto:${m.email}`">{{ m.email }}</a> · {{ m.telefone }} ·
            {{ dataHoraCurta(m.criadoEm) }}
          </p>
        </div>
        <button type="button" class="btn btn-sm btn-fantasma" @click="alternar(m)">
          <component :is="m.lida ? Mail : MailOpen" :size="16" />
          {{ m.lida ? 'Marcar como não lida' : 'Marcar como lida' }}
        </button>
      </div>
      <p class="texto">{{ m.mensagem }}</p>
    </article>
  </div>
</template>

<style scoped>
.mensagem {
  border-left: 3px solid var(--color-red);
}

.mensagem.lida {
  border-left-color: var(--color-mid);
  opacity: 0.75;
}

.topo {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
}

.topo a {
  color: var(--color-silver);
}

.texto {
  margin-top: 0.75rem;
  white-space: pre-line;
  line-height: 1.55;
}
</style>
