<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ExternalLink, PackageSearch } from 'lucide-vue-next';
import { api } from '@/api';
import ImagensUpload from '@/components/admin/ImagensUpload.vue';
import { useErrosApi } from '@/composables/useErrosApi';

const route = useRoute();
const router = useRouter();
const id = computed(() => route.params.id);
const editando = computed(() => Boolean(id.value));

const form = reactive({
  nome: '',
  descricao: '',
  preco: 0,
  estoque: 0,
  sku: '',
  tipo: 'PECA',
  categoriaId: null,
  compativelCom: [],
});
const imagens = ref([]);
const slug = ref('');
const categorias = ref([]);
const modelos = ref([]);
const carregando = ref(true);
const salvando = ref(false);
const {
  geral: erroGeral,
  campos: erros,
  limpar: limparErros,
  aplicar: aplicarErros,
} = useErrosApi();

const categoriasDoTipo = computed(() => categorias.value.filter((c) => c.tipo === form.tipo));
const linkPublico = computed(() =>
  slug.value ? `/${form.tipo === 'PECA' ? 'pecas' : 'acessorios'}/${slug.value}` : null,
);

// Trocar o tipo invalida a categoria escolhida (categorias são tipadas).
watch(
  () => form.tipo,
  () => {
    if (!categoriasDoTipo.value.some((c) => c.id === form.categoriaId)) form.categoriaId = null;
  },
);

onMounted(async () => {
  try {
    [categorias.value, modelos.value] = await Promise.all([
      api.admin.listar('categorias'),
      api.admin.listar('modelos'),
    ]);
    if (editando.value) {
      const p = await api.admin.buscar('produtos', id.value);
      Object.assign(form, {
        nome: p.nome,
        descricao: p.descricao,
        preco: p.preco,
        estoque: p.estoque,
        sku: p.sku ?? '',
        tipo: p.tipo,
        categoriaId: p.categoriaId,
        compativelCom: p.compativelCom,
      });
      imagens.value = p.imagemUrl ? [p.imagemUrl] : [];
      slug.value = p.slug;
    }
  } catch (e) {
    aplicarErros(e);
  } finally {
    carregando.value = false;
  }
});

async function salvar() {
  salvando.value = true;
  limparErros();
  const dados = { ...form, sku: form.sku || null, imagemUrl: imagens.value[0] ?? null };
  try {
    if (editando.value) await api.admin.atualizar('produtos', id.value, dados);
    else await api.admin.criar('produtos', dados);
    router.push('/admin/produtos');
  } catch (e) {
    aplicarErros(e);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } finally {
    salvando.value = false;
  }
}
</script>

<template>
  <header class="painel-cabecalho">
    <h1><PackageSearch :size="24" /> {{ editando ? 'Editar produto' : 'Novo produto' }}</h1>
    <a v-if="linkPublico" :href="linkPublico" target="_blank" class="btn btn-sm btn-fantasma">
      <ExternalLink :size="15" /> Ver no site
    </a>
  </header>

  <div class="painel-corpo">
    <p v-if="carregando" class="vazio">Carregando…</p>

    <form v-else class="painel-card" novalidate @submit.prevent="salvar">
      <p v-if="erroGeral" class="aviso aviso--erro">{{ erroGeral }}</p>

      <div class="form-grid">
        <div class="campo--largo">
          <label for="nome">Nome</label>
          <input id="nome" v-model.trim="form.nome" required />
          <span v-if="erros.nome" class="campo-erro">{{ erros.nome }}</span>
        </div>

        <div>
          <label for="tipo">Tipo</label>
          <select id="tipo" v-model="form.tipo">
            <option value="PECA">Peça</option>
            <option value="ACESSORIO">Acessório</option>
          </select>
        </div>
        <div>
          <label for="categoria">Categoria</label>
          <select id="categoria" v-model="form.categoriaId">
            <option :value="null" disabled>Escolha…</option>
            <option v-for="c in categoriasDoTipo" :key="c.id" :value="c.id">{{ c.nome }}</option>
          </select>
          <span v-if="erros.categoriaId" class="campo-erro">{{ erros.categoriaId }}</span>
        </div>
        <div>
          <label for="preco">Preço (R$)</label>
          <input id="preco" v-model.number="form.preco" type="number" min="0" step="0.01" />
          <span v-if="erros.preco" class="campo-erro">{{ erros.preco }}</span>
        </div>
        <div>
          <label for="estoque">Estoque</label>
          <input id="estoque" v-model.number="form.estoque" type="number" min="0" step="1" />
          <span v-if="erros.estoque" class="campo-erro">{{ erros.estoque }}</span>
        </div>
        <div>
          <label for="sku">Código (SKU)</label>
          <input id="sku" v-model.trim="form.sku" placeholder="Opcional" />
        </div>

        <div class="campo--largo">
          <label for="descricao">Descrição</label>
          <textarea id="descricao" v-model.trim="form.descricao"></textarea>
          <span v-if="erros.descricao" class="campo-erro">{{ erros.descricao }}</span>
        </div>

        <div class="campo--largo">
          <label>Imagem</label>
          <ImagensUpload v-model="imagens" :max="1" />
        </div>

        <fieldset class="campo--largo compat">
          <legend>Compatível com</legend>
          <div class="checkboxes">
            <label v-for="m in modelos" :key="m.id" class="checkbox">
              <input v-model="form.compativelCom" type="checkbox" :value="m.id" />
              {{ m.marca }} {{ m.modelo }}
            </label>
          </div>
        </fieldset>
      </div>

      <div class="form-acoes">
        <button type="submit" class="btn btn-red" :disabled="salvando">
          {{ salvando ? 'Salvando…' : 'Salvar' }}
        </button>
        <RouterLink to="/admin/produtos" class="btn btn-fantasma">Cancelar</RouterLink>
      </div>
    </form>
  </div>
</template>

<style scoped>
.compat {
  border: 1px solid var(--color-surface);
  border-radius: var(--radius-sm);
  padding: 0.75rem 1rem 1rem;
  margin: 0;
}

.compat legend {
  padding: 0 0.4rem;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-silver);
}

.form-acoes {
  margin-top: 1.5rem;
}
</style>
