<script setup>
import { onMounted, reactive, ref } from 'vue';
import { Plus, Tags, Trash2 } from 'lucide-vue-next';
import { api } from '@/api';

// Três cadastros pequenos numa tela só: categorias, marcas e modelos de veículo.
const listas = reactive({ categorias: [], marcas: [], modelos: [] });
const novos = reactive({
  categorias: { nome: '', tipo: 'PECA' },
  marcas: { nome: '' },
  modelos: { marca: '', modelo: '', anoInicio: null, anoFim: null },
});
const erro = ref('');
const aviso = ref('');

const descricao = {
  categorias: (c) => `${c.nome} · ${c.tipo === 'PECA' ? 'Peça' : 'Acessório'}`,
  marcas: (m) => m.nome,
  modelos: (m) =>
    `${m.marca} ${m.modelo}${m.anoInicio ? ` (${m.anoInicio}–${m.anoFim ?? 'atual'})` : ''}`,
};

async function carregar(recurso) {
  listas[recurso] = await api.admin.listar(recurso);
}

async function adicionar(recurso) {
  erro.value = '';
  aviso.value = '';
  const dados = { ...novos[recurso] };
  for (const chave of ['anoInicio', 'anoFim']) if (dados[chave] === '') dados[chave] = null;
  try {
    const criado = await api.admin.criar(recurso, dados);
    aviso.value = `"${descricao[recurso](criado)}" adicionado.`;
    for (const chave of Object.keys(novos[recurso])) {
      if (chave !== 'tipo')
        novos[recurso][chave] = typeof novos[recurso][chave] === 'string' ? '' : null;
    }
    await carregar(recurso);
  } catch (e) {
    erro.value = e.detalhes?.[0]?.mensagem ? `${e.message} ${e.detalhes[0].mensagem}` : e.message;
  }
}

async function excluir(recurso, item) {
  if (!window.confirm(`Excluir "${descricao[recurso](item)}"?`)) return;
  erro.value = '';
  aviso.value = '';
  try {
    await api.admin.excluir(recurso, item.id);
    await carregar(recurso);
  } catch (e) {
    erro.value =
      e.status === 409
        ? `"${descricao[recurso](item)}" está em uso e não pode ser excluído.`
        : e.message;
  }
}

onMounted(async () => {
  try {
    await Promise.all(['categorias', 'marcas', 'modelos'].map(carregar));
  } catch (e) {
    erro.value = e.message;
  }
});
</script>

<template>
  <header class="painel-cabecalho">
    <h1><Tags :size="24" /> Cadastros</h1>
  </header>

  <div class="painel-corpo">
    <p v-if="erro" class="aviso aviso--erro">{{ erro }}</p>
    <p v-if="aviso" class="aviso aviso--ok">{{ aviso }}</p>

    <div class="colunas">
      <section class="painel-card">
        <h2>Categorias</h2>
        <form class="linha-nova" @submit.prevent="adicionar('categorias')">
          <input
            v-model.trim="novos.categorias.nome"
            placeholder="Nova categoria"
            aria-label="Nome da categoria"
          />
          <select v-model="novos.categorias.tipo" aria-label="Tipo">
            <option value="PECA">Peça</option>
            <option value="ACESSORIO">Acessório</option>
          </select>
          <button class="btn-icone" title="Adicionar" aria-label="Adicionar categoria">
            <Plus :size="16" />
          </button>
        </form>
        <ul class="lista">
          <li v-for="c in listas.categorias" :key="c.id">
            {{ descricao.categorias(c) }}
            <button
              type="button"
              class="btn-icone"
              :aria-label="`Excluir ${c.nome}`"
              @click="excluir('categorias', c)"
            >
              <Trash2 :size="14" />
            </button>
          </li>
        </ul>
      </section>

      <section class="painel-card">
        <h2>Marcas</h2>
        <form class="linha-nova" @submit.prevent="adicionar('marcas')">
          <input
            v-model.trim="novos.marcas.nome"
            placeholder="Nova marca"
            aria-label="Nome da marca"
          />
          <button class="btn-icone" title="Adicionar" aria-label="Adicionar marca">
            <Plus :size="16" />
          </button>
        </form>
        <ul class="lista">
          <li v-for="m in listas.marcas" :key="m.id">
            {{ m.nome }}
            <button
              type="button"
              class="btn-icone"
              :aria-label="`Excluir ${m.nome}`"
              @click="excluir('marcas', m)"
            >
              <Trash2 :size="14" />
            </button>
          </li>
        </ul>
      </section>

      <section class="painel-card">
        <h2>Modelos de veículo</h2>
        <p class="secundario">Usados na compatibilidade de peças e acessórios.</p>
        <form class="linha-nova" @submit.prevent="adicionar('modelos')">
          <input v-model.trim="novos.modelos.marca" placeholder="Marca" aria-label="Marca" />
          <input v-model.trim="novos.modelos.modelo" placeholder="Modelo" aria-label="Modelo" />
          <input
            v-model.number="novos.modelos.anoInicio"
            type="number"
            placeholder="De"
            aria-label="Ano inicial"
          />
          <input
            v-model.number="novos.modelos.anoFim"
            type="number"
            placeholder="Até"
            aria-label="Ano final"
          />
          <button class="btn-icone" title="Adicionar" aria-label="Adicionar modelo">
            <Plus :size="16" />
          </button>
        </form>
        <ul class="lista">
          <li v-for="m in listas.modelos" :key="m.id">
            {{ descricao.modelos(m) }}
            <button
              type="button"
              class="btn-icone"
              :aria-label="`Excluir ${m.modelo}`"
              @click="excluir('modelos', m)"
            >
              <Trash2 :size="14" />
            </button>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<style scoped>
.colunas {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.25rem;
  align-items: start;
}

.linha-nova {
  display: flex;
  gap: 0.5rem;
  margin: 0.75rem 0 1rem;
}

.linha-nova input[type='number'] {
  width: 80px;
  flex-shrink: 0;
}

.lista {
  list-style: none;
  padding: 0;
  margin: 0;
}

.lista li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  padding: 0.45rem 0;
  border-bottom: 1px solid var(--color-surface);
}
</style>
