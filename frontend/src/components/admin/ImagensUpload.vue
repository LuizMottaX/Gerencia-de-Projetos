<script setup>
import { computed, ref } from 'vue';
import { ArrowLeft, ImagePlus, X } from 'lucide-vue-next';
import { api } from '@/api';

// Lista de URLs de imagem com upload. A primeira é a capa; `max` = 1 vira um
// campo de imagem única.
const props = defineProps({
  modelValue: { type: Array, required: true },
  max: { type: Number, default: 20 },
});
const emit = defineEmits(['update:modelValue']);

const enviando = ref(false);
const erro = ref('');
const cheio = computed(() => props.modelValue.length >= props.max);

async function enviar(evento) {
  const arquivos = [...evento.target.files].slice(0, props.max - props.modelValue.length);
  evento.target.value = '';
  if (!arquivos.length) return;

  enviando.value = true;
  erro.value = '';
  const urls = [...props.modelValue];
  try {
    for (const arquivo of arquivos) {
      urls.push((await api.admin.enviarImagem(arquivo)).url);
    }
  } catch (e) {
    erro.value = e.message;
  } finally {
    emit('update:modelValue', urls);
    enviando.value = false;
  }
}

function remover(i) {
  emit(
    'update:modelValue',
    props.modelValue.filter((_, j) => j !== i),
  );
}

function tornarCapa(i) {
  const urls = [...props.modelValue];
  urls.unshift(...urls.splice(i, 1));
  emit('update:modelValue', urls);
}
</script>

<template>
  <div class="imagens">
    <figure v-for="(url, i) in modelValue" :key="url" class="imagem">
      <img :src="url" alt="" />
      <figcaption v-if="max > 1 && i === 0">Capa</figcaption>
      <div class="imagem-acoes">
        <button
          v-if="max > 1 && i > 0"
          type="button"
          class="btn-icone"
          title="Usar como capa"
          aria-label="Usar como capa"
          @click="tornarCapa(i)"
        >
          <ArrowLeft :size="14" />
        </button>
        <button
          type="button"
          class="btn-icone"
          title="Remover"
          aria-label="Remover imagem"
          @click="remover(i)"
        >
          <X :size="14" />
        </button>
      </div>
    </figure>

    <label v-if="!cheio" class="adicionar" :class="{ ocupado: enviando }">
      <ImagePlus :size="22" />
      <span>{{ enviando ? 'Enviando…' : 'Adicionar' }}</span>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        :multiple="max > 1"
        :disabled="enviando"
        hidden
        @change="enviar"
      />
    </label>
  </div>
  <p v-if="erro" class="campo-erro">{{ erro }}</p>
  <p class="secundario">JPG, PNG ou WebP, até 5 MB.</p>
</template>

<style scoped>
.imagens {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 0.4rem;
}

.imagem {
  position: relative;
  width: 120px;
  height: 90px;
  margin: 0;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid var(--color-mid);
}

.imagem img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.imagem figcaption {
  position: absolute;
  left: 0;
  bottom: 0;
  padding: 0.1rem 0.45rem;
  font-size: 0.7rem;
  font-weight: 700;
  background: var(--color-red);
  color: var(--color-white);
}

.imagem-acoes {
  position: absolute;
  top: 4px;
  right: 4px;
  display: flex;
  gap: 4px;
}

.imagem-acoes .btn-icone {
  width: 26px;
  height: 26px;
  background: rgba(17, 18, 20, 0.8);
}

.adicionar {
  width: 120px;
  height: 90px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  margin: 0;
  border: 1px dashed var(--color-mid);
  border-radius: 6px;
  cursor: pointer;
  text-transform: none;
  letter-spacing: 0;
  color: var(--color-silver);
}

.adicionar:hover {
  border-color: var(--color-red);
  color: var(--color-red-light);
}

.adicionar.ocupado {
  cursor: progress;
  opacity: 0.6;
}
</style>
