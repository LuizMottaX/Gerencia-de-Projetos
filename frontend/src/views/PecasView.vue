<template>
  <CatalogoProdutos
    :icone="Wrench"
    tipo="peca"
    titulo="Auto-peças"
    subtitulo="Peças de reposição com compatibilidade verificada por modelo"
  />
</template>

<script setup>
import { Wrench } from 'lucide-vue-next';
import CatalogoProdutos from '../components/CatalogoProdutos.vue';
</script>
