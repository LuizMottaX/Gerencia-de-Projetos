import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';

const CHAVE = 'carrinho';
const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

function carregar() {
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE));
    return Array.isArray(salvo) ? salvo : [];
  } catch {
    return [];
  }
}

// Carrinho de peças e acessórios. Guarda uma "foto" do produto para exibir sem
// nova requisição; o preço que vale é sempre o do servidor no checkout.
export const useCarrinhoStore = defineStore('carrinho', () => {
  const itens = ref(carregar());

  watch(
    itens,
    (valor) => {
      try {
        localStorage.setItem(CHAVE, JSON.stringify(valor));
      } catch {
        // localStorage indisponível — o carrinho fica só em memória.
      }
    },
    { deep: true },
  );

  const quantidadeTotal = computed(() => itens.value.reduce((s, i) => s + i.quantidade, 0));
  const subtotal = computed(
    () => itens.value.reduce((s, i) => s + Math.round(i.preco * 100) * i.quantidade, 0) / 100,
  );
  const subtotalFormatado = computed(() => brl.format(subtotal.value));

  const limitar = (item, quantidade) => Math.max(1, Math.min(quantidade, item.estoque));

  /** Adiciona (ou soma) ao carrinho, respeitando o estoque. Retorna false se já estava no limite. */
  function adicionar(produto, quantidade = 1) {
    if (!produto.disponivel) return false;
    const existente = itens.value.find((i) => i.id === produto.id);
    if (existente) {
      const antes = existente.quantidade;
      existente.estoque = produto.estoque;
      existente.quantidade = limitar(existente, antes + quantidade);
      return existente.quantidade > antes;
    }
    const item = {
      id: produto.id,
      nome: produto.nome,
      tipo: produto.tipo,
      preco: produto.preco,
      imagemUrl: produto.imagemUrl,
      estoque: produto.estoque,
      quantidade: 0,
    };
    item.quantidade = limitar(item, quantidade);
    itens.value.push(item);
    return true;
  }

  function alterarQuantidade(id, quantidade) {
    const item = itens.value.find((i) => i.id === id);
    if (!item) return;
    if (quantidade <= 0) remover(id);
    else item.quantidade = limitar(item, quantidade);
  }

  function remover(id) {
    itens.value = itens.value.filter((i) => i.id !== id);
  }

  function limpar() {
    itens.value = [];
  }

  return {
    itens,
    quantidadeTotal,
    subtotal,
    subtotalFormatado,
    adicionar,
    alterarQuantidade,
    remover,
    limpar,
  };
});
