import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from '../api';

// Guarda as opções de filtro do catálogo (categorias e modelos).
// São carregadas uma vez e reaproveitadas entre as telas de peças e acessórios.
export const useCatalogoStore = defineStore('catalogo', () => {
  const categoriasPorTipo = ref({}); // { peca: [...], acessorio: [...] }
  const modelos = ref([]);

  async function carregarCategorias(tipo) {
    if (categoriasPorTipo.value[tipo]) return categoriasPorTipo.value[tipo];
    const lista = await api.listarCategorias(tipo);
    categoriasPorTipo.value = { ...categoriasPorTipo.value, [tipo]: lista };
    return lista;
  }

  async function carregarModelos() {
    if (modelos.value.length) return modelos.value;
    modelos.value = await api.listarModelos();
    return modelos.value;
  }

  return { categoriasPorTipo, modelos, carregarCategorias, carregarModelos };
});
