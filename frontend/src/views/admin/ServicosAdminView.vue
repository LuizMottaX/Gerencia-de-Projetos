<script setup>
import { onMounted, reactive, ref } from 'vue';
import { Pencil, Plus, Trash2, Wrench } from 'lucide-vue-next';
import { api } from '@/api';
import { useErrosApi } from '@/composables/useErrosApi';
import { brl } from '@/utils/formatar';

const VAZIO = { nome: '', descricao: '', precoBase: 0, duracaoMin: 60, ativo: true };

const servicos = ref([]);
const carregando = ref(true);
const aviso = ref('');
const editandoId = ref(null); // null = fechado, 'novo' = criando
const form = reactive({ ...VAZIO });
const {
  geral: erroGeral,
  campos: erros,
  limpar: limparErros,
  aplicar: aplicarErros,
} = useErrosApi();

async function carregar() {
  try {
    servicos.value = await api.admin.listar('servicos');
  } catch (e) {
    aplicarErros(e);
  } finally {
    carregando.value = false;
  }
}

function abrir(servico) {
  limparErros();
  aviso.value = '';
  editandoId.value = servico?.id ?? 'novo';
  Object.assign(form, servico ? { ...servico } : VAZIO);
}

async function salvar() {
  limparErros();
  const { nome, descricao, precoBase, duracaoMin, ativo } = form;
  const dados = { nome, descricao, precoBase, duracaoMin, ativo };
  try {
    if (editandoId.value === 'novo') await api.admin.criar('servicos', dados);
    else await api.admin.atualizar('servicos', editandoId.value, dados);
    aviso.value = `"${nome}" salvo.`;
    editandoId.value = null;
    await carregar();
  } catch (e) {
    aplicarErros(e);
  }
}

async function excluir(servico) {
  if (!window.confirm(`Excluir "${servico.nome}"?`)) return;
  limparErros();
  try {
    await api.admin.excluir('servicos', servico.id);
    await carregar();
  } catch (e) {
    aplicarErros(e);
    if (e.status === 409) {
      erroGeral.value = `"${servico.nome}" já tem agendamentos. Desmarque "ativo" para tirá-lo do site.`;
    }
  }
}

onMounted(carregar);
</script>

<template>
  <header class="painel-cabecalho">
    <h1><Wrench :size="24" /> Serviços</h1>
    <button type="button" class="btn btn-red btn-sm" @click="abrir()">
      <Plus :size="16" /> Novo serviço
    </button>
  </header>

  <div class="painel-corpo">
    <p v-if="erroGeral" class="aviso aviso--erro">{{ erroGeral }}</p>
    <p v-if="aviso" class="aviso aviso--ok">{{ aviso }}</p>

    <form v-if="editandoId" class="painel-card" novalidate @submit.prevent="salvar">
      <h2>{{ editandoId === 'novo' ? 'Novo serviço' : 'Editar serviço' }}</h2>
      <div class="form-grid">
        <div class="campo--largo">
          <label for="nome">Nome</label>
          <input id="nome" v-model.trim="form.nome" />
          <span v-if="erros.nome" class="campo-erro">{{ erros.nome }}</span>
        </div>
        <div>
          <label for="preco">Preço a partir de (R$)</label>
          <input id="preco" v-model.number="form.precoBase" type="number" min="0" step="0.01" />
        </div>
        <div>
          <label for="duracao">Duração (min)</label>
          <input id="duracao" v-model.number="form.duracaoMin" type="number" min="15" step="15" />
          <span v-if="erros.duracaoMin" class="campo-erro">{{ erros.duracaoMin }}</span>
        </div>
        <div>
          <label>&nbsp;</label>
          <label class="checkbox"
            ><input v-model="form.ativo" type="checkbox" /> Ativo (aparece no site)</label
          >
        </div>
        <div class="campo--largo">
          <label for="descricao">Descrição</label>
          <textarea id="descricao" v-model.trim="form.descricao"></textarea>
          <span v-if="erros.descricao" class="campo-erro">{{ erros.descricao }}</span>
        </div>
      </div>
      <div class="form-acoes">
        <button type="submit" class="btn btn-red">Salvar</button>
        <button type="button" class="btn btn-fantasma" @click="editandoId = null">Cancelar</button>
      </div>
    </form>

    <div class="painel-card tabela-wrapper">
      <p v-if="carregando" class="vazio">Carregando…</p>
      <table v-else class="tabela">
        <thead>
          <tr>
            <th>Serviço</th>
            <th class="num">A partir de</th>
            <th class="num">Duração</th>
            <th>Situação</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in servicos" :key="s.id">
            <td>{{ s.nome }}</td>
            <td class="num">{{ brl(s.precoBase) }}</td>
            <td class="num">{{ s.duracaoMin }} min</td>
            <td>
              <span class="selo" :class="s.ativo ? 'selo--ok' : ''">{{
                s.ativo ? 'Ativo' : 'Inativo'
              }}</span>
            </td>
            <td>
              <div class="acoes">
                <button
                  type="button"
                  class="btn-icone"
                  title="Editar"
                  :aria-label="`Editar ${s.nome}`"
                  @click="abrir(s)"
                >
                  <Pencil :size="15" />
                </button>
                <button
                  type="button"
                  class="btn-icone"
                  title="Excluir"
                  :aria-label="`Excluir ${s.nome}`"
                  @click="excluir(s)"
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

<style scoped>
.form-acoes {
  margin-top: 1.25rem;
}
</style>
