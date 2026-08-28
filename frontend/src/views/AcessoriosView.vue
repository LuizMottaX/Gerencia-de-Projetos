<template>
  <CatalogoProdutos
    :icone="Sparkles"
    tipo="acessorio"
    titulo="Acessórios"
    subtitulo="Som, estética, conforto e mais para deixar seu carro com a sua cara"
  />
</template>

<script setup>
import { Sparkles } from 'lucide-vue-next';
import CatalogoProdutos from '../components/CatalogoProdutos.vue';
</script>
