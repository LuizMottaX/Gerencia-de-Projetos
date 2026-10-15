<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Car, ExternalLink } from 'lucide-vue-next';
import { api } from '@/api';
import ImagensUpload from '@/components/admin/ImagensUpload.vue';
import { useErrosApi } from '@/composables/useErrosApi';
import { STATUS_CARRO } from '@/utils/formatar';

const FORMAS = ['À vista', 'Financiamento', 'Consórcio', 'Troca', 'Cartão de crédito'];

const route = useRoute();
const router = useRouter();
const id = computed(() => route.params.id);
const editando = computed(() => Boolean(id.value));

const form = reactive({
  nome: '',
  modelo: '',
  ano: new Date().getFullYear(),
  preco: 0,
  quilometragem: 0,
  cor: '',
  combustivel: 'Flex',
  portas: 4,
  cambio: 'Manual',
  carroceria: '',
  finalPlaca: null,
  localizacao: 'Sinop - MT',
  status: 'DISPONIVEL',
  formasPagamento: ['À vista', 'Financiamento'],
  marcaId: null,
  modeloVeiculoId: null,
  imagens: [],
});
const slug = ref('');
const marcas = ref([]);
const modelos = ref([]);
const carregando = ref(true);
const salvando = ref(false);
const {
  geral: erroGeral,
  campos: erros,
  limpar: limparErros,
  aplicar: aplicarErros,
} = useErrosApi();

onMounted(async () => {
  try {
    [marcas.value, modelos.value] = await Promise.all([
      api.admin.listar('marcas'),
      api.admin.listar('modelos'),
    ]);
    if (editando.value) {
      const c = await api.admin.buscar('carros', id.value);
      for (const chave of Object.keys(form)) form[chave] = c[chave];
      slug.value = c.slug;
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
  const dados = { ...form, finalPlaca: form.finalPlaca === '' ? null : form.finalPlaca };
  try {
    if (editando.value) await api.admin.atualizar('carros', id.value, dados);
    else await api.admin.criar('carros', dados);
    router.push('/admin/carros');
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
    <h1><Car :size="24" /> {{ editando ? 'Editar veículo' : 'Novo veículo' }}</h1>
    <a v-if="slug" :href="`/carros/${slug}`" target="_blank" class="btn btn-sm btn-fantasma">
      <ExternalLink :size="15" /> Ver no site
    </a>
  </header>

  <div class="painel-corpo">
    <p v-if="carregando" class="vazio">Carregando…</p>

    <form v-else class="painel-card" novalidate @submit.prevent="salvar">
      <p v-if="erroGeral" class="aviso aviso--erro">{{ erroGeral }}</p>

      <div class="form-grid">
        <div class="campo--largo">
          <label for="nome">Título do anúncio</label>
          <input id="nome" v-model.trim="form.nome" placeholder="Ex.: Chevrolet Onix LT 1.0" />
          <span v-if="erros.nome" class="campo-erro">{{ erros.nome }}</span>
        </div>

        <div>
          <label for="marca">Marca</label>
          <select id="marca" v-model="form.marcaId">
            <option :value="null" disabled>Escolha…</option>
            <option v-for="m in marcas" :key="m.id" :value="m.id">{{ m.nome }}</option>
          </select>
          <span v-if="erros.marcaId" class="campo-erro">Escolha a marca.</span>
        </div>
        <div>
          <label for="modelo">Modelo / versão</label>
          <input id="modelo" v-model.trim="form.modelo" />
          <span v-if="erros.modelo" class="campo-erro">{{ erros.modelo }}</span>
        </div>
        <div>
          <label for="modeloVeiculo">Modelo do catálogo de peças</label>
          <select id="modeloVeiculo" v-model="form.modeloVeiculoId">
            <option :value="null">Nenhum</option>
            <option v-for="m in modelos" :key="m.id" :value="m.id">
              {{ m.marca }} {{ m.modelo }}
            </option>
          </select>
        </div>
        <div>
          <label for="ano">Ano</label>
          <input id="ano" v-model.number="form.ano" type="number" min="1900" max="2100" />
          <span v-if="erros.ano" class="campo-erro">{{ erros.ano }}</span>
        </div>
        <div>
          <label for="preco">Preço (R$)</label>
          <input id="preco" v-model.number="form.preco" type="number" min="0" step="0.01" />
          <span v-if="erros.preco" class="campo-erro">{{ erros.preco }}</span>
        </div>
        <div>
          <label for="km">Quilometragem</label>
          <input id="km" v-model.number="form.quilometragem" type="number" min="0" step="1" />
        </div>
        <div>
          <label for="cor">Cor</label>
          <input id="cor" v-model.trim="form.cor" />
          <span v-if="erros.cor" class="campo-erro">{{ erros.cor }}</span>
        </div>
        <div>
          <label for="combustivel">Combustível</label>
          <select id="combustivel" v-model="form.combustivel">
            <option
              v-for="o in ['Flex', 'Gasolina', 'Álcool', 'Diesel', 'Elétrico', 'Híbrido']"
              :key="o"
            >
              {{ o }}
            </option>
          </select>
        </div>
        <div>
          <label for="cambio">Câmbio</label>
          <select id="cambio" v-model="form.cambio">
            <option v-for="o in ['Manual', 'Automático', 'CVT', 'Automatizado']" :key="o">
              {{ o }}
            </option>
          </select>
        </div>
        <div>
          <label for="carroceria">Carroceria</label>
          <input id="carroceria" v-model.trim="form.carroceria" placeholder="Hatch, Sedã, SUV…" />
          <span v-if="erros.carroceria" class="campo-erro">{{ erros.carroceria }}</span>
        </div>
        <div>
          <label for="portas">Portas</label>
          <input id="portas" v-model.number="form.portas" type="number" min="1" max="6" />
        </div>
        <div>
          <label for="placa">Final da placa</label>
          <input id="placa" v-model.number="form.finalPlaca" type="number" min="0" max="9" />
        </div>
        <div>
          <label for="local">Localização</label>
          <input id="local" v-model.trim="form.localizacao" />
        </div>
        <div>
          <label for="status">Status</label>
          <select id="status" v-model="form.status">
            <option v-for="(s, chave) in STATUS_CARRO" :key="chave" :value="chave">
              {{ s.texto }}
            </option>
          </select>
        </div>

        <fieldset class="campo--largo grupo">
          <legend>Formas de pagamento</legend>
          <div class="checkboxes">
            <label v-for="f in FORMAS" :key="f" class="checkbox">
              <input v-model="form.formasPagamento" type="checkbox" :value="f" /> {{ f }}
            </label>
          </div>
        </fieldset>

        <div class="campo--largo">
          <label>Fotos (a primeira é a capa)</label>
          <ImagensUpload v-model="form.imagens" :max="20" />
        </div>
      </div>

      <div class="form-acoes">
        <button type="submit" class="btn btn-red" :disabled="salvando">
          {{ salvando ? 'Salvando…' : 'Salvar' }}
        </button>
        <RouterLink to="/admin/carros" class="btn btn-fantasma">Cancelar</RouterLink>
      </div>
    </form>
  </div>
</template>

<style scoped>
.grupo {
  border: 1px solid var(--color-surface);
  border-radius: var(--radius-sm);
  padding: 0.75rem 1rem 1rem;
  margin: 0;
}

.grupo legend {
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
