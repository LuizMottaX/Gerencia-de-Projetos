<template>
  <div class="card produto-card">
    <RouterLink :to="rota" class="card-link">
      <div class="card-img-wrapper">
        <img v-if="produto.imagemUrl" :src="produto.imagemUrl" :alt="produto.nome" />
        <div v-else class="card-img-placeholder" aria-hidden="true">
          <component :is="tipoIcone" :size="52" :stroke-width="1.5" />
        </div>
        <span v-if="!produto.disponivel" class="card-esgotado">Esgotado</span>
        <span class="card-badge">Ver detalhes <ArrowRight :size="14" /></span>
      </div>
      <div class="card-body text-item">
        <span class="produto-categoria">{{ produto.categoria?.nome }}</span>
        <p class="card-nome">{{ produto.nome }}</p>
        <p class="card-preco">{{ produto.precoFormatado }}</p>
        <p v-if="produto.compativelCom?.length" class="produto-compat">
          Compatível com {{ produto.compativelCom.map((m) => m.nome).join(', ') }}
        </p>
      </div>
    </RouterLink>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { ArrowRight, Headphones, Wrench } from 'lucide-vue-next';

const props = defineProps({
  produto: { type: Object, required: true },
});

const rota = computed(() => {
  const base = props.produto.tipo === 'acessorio' ? '/acessorios' : '/pecas';
  return `${base}/${props.produto.id}`;
});

const tipoIcone = computed(() => (props.produto.tipo === 'acessorio' ? Headphones : Wrench));
</script>

<style scoped>
.card-link {
  display: block;
  color: inherit;
  text-decoration: none;
}

.card-img-wrapper {
  position: relative;
  overflow: hidden;
  height: 180px;
}

.card-img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
}

.produto-card:hover .card-img-wrapper img {
  transform: scale(1.08);
}

.card-img-placeholder {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  color: #a3a3a3;
  background: repeating-linear-gradient(
    45deg,
    #f0f0f0,
    #f0f0f0 12px,
    #e9e9e9 12px,
    #e9e9e9 24px
  );
}

.card-esgotado {
  position: absolute;
  top: 10px;
  left: 10px;
  background: #1c1e22;
  color: #fff;
  font-size: 0.7em;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.25em 0.6em;
  border-radius: 4px;
}

.card-badge {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  background: linear-gradient(0deg, rgba(192, 57, 43, 0.92) 0%, transparent 100%);
  color: #fff;
  font-size: 0.82em;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  padding: 1rem 0.9rem 0.5rem;
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.produto-card:hover .card-badge {
  opacity: 1;
  transform: translateY(0);
}

.card-body {
  padding: 12px 16px 16px;
  text-align: left;
}

.produto-categoria {
  display: block;
  font-size: 0.7em;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #c0392b;
  margin-bottom: 0.35rem;
}

.card-nome {
  font-weight: 700;
  font-size: 0.96em;
  color: #1a1a1a;
  margin-bottom: 0.3rem;
  line-height: 1.3;
}

.card-preco {
  font-size: 1.12em;
  font-weight: 900;
  color: #c0392b;
  margin-bottom: 0.4rem;
}

.produto-compat {
  font-size: 0.76em;
  color: #777;
  line-height: 1.45;
}
</style>
