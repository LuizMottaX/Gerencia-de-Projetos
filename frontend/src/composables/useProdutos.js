import { ref, watch, toValue } from 'vue';

// Lista produtos (peças ou acessórios) reagindo a um objeto de filtros.
// `fetcher` é api.listarPecas ou api.listarAcessorios.
export function useProdutos(fetcher, filtros) {
  const itens = ref([]);
  const total = ref(0);
  const carregando = ref(true);
  const erro = ref(null);

  let requisicaoAtual = 0;
  let timer = null;

  async function carregar() {
    const id = ++requisicaoAtual;
    carregando.value = true;
    erro.value = null;
    try {
      const dados = await fetcher({ ...toValue(filtros) });
      if (id !== requisicaoAtual) return; // resposta obsoleta
      itens.value = dados.itens;
      total.value = dados.total;
    } catch (e) {
      if (id !== requisicaoAtual) return;
      erro.value = e.message;
      itens.value = [];
      total.value = 0;
    } finally {
      if (id === requisicaoAtual) carregando.value = false;
    }
  }

  watch(
    () => ({ ...toValue(filtros) }),
    () => {
      clearTimeout(timer);
      timer = setTimeout(carregar, 250);
    },
    { deep: true },
  );

  carregar();

  return { itens, total, carregando, erro, recarregar: carregar };
}
