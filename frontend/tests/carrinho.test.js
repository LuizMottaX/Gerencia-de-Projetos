import { describe, it, expect, beforeEach } from 'vitest';
import { nextTick } from 'vue';
import { createPinia, setActivePinia } from 'pinia';
import { useCarrinhoStore } from '../src/stores/carrinho';

const pastilha = {
  id: 'pastilha',
  nome: 'Pastilha',
  tipo: 'peca',
  preco: 129.9,
  estoque: 3,
  disponivel: true,
};
const tapete = {
  id: 'tapete',
  nome: 'Tapete',
  tipo: 'acessorio',
  preco: 0.1,
  estoque: 10,
  disponivel: true,
};

beforeEach(() => {
  localStorage.clear();
  setActivePinia(createPinia());
});

describe('store carrinho', () => {
  it('adiciona, soma o mesmo produto e calcula totais sem erro de ponto flutuante', () => {
    const c = useCarrinhoStore();
    c.adicionar(pastilha);
    c.adicionar(pastilha);
    c.adicionar(tapete, 3);

    expect(c.itens).toHaveLength(2);
    expect(c.quantidadeTotal).toBe(5);
    expect(c.subtotal).toBe(260.1); // 2 × 129,90 + 3 × 0,10
    expect(c.subtotalFormatado).toMatch(/260,10/);
  });

  it('não passa do estoque', () => {
    const c = useCarrinhoStore();
    c.adicionar(pastilha, 2);
    expect(c.adicionar(pastilha, 5)).toBe(true);
    expect(c.itens[0].quantidade).toBe(3);
    expect(c.adicionar(pastilha)).toBe(false);

    c.alterarQuantidade('pastilha', 99);
    expect(c.itens[0].quantidade).toBe(3);
  });

  it('não adiciona produto indisponível', () => {
    const c = useCarrinhoStore();
    expect(c.adicionar({ ...pastilha, disponivel: false })).toBe(false);
    expect(c.itens).toHaveLength(0);
  });

  it('remove ao zerar a quantidade, e com remover/limpar', () => {
    const c = useCarrinhoStore();
    c.adicionar(pastilha);
    c.adicionar(tapete);
    c.alterarQuantidade('pastilha', 0);
    expect(c.itens.map((i) => i.id)).toEqual(['tapete']);
    c.remover('tapete');
    expect(c.itens).toHaveLength(0);
    c.adicionar(pastilha);
    c.limpar();
    expect(c.quantidadeTotal).toBe(0);
  });

  it('persiste no localStorage e restaura ao recarregar', async () => {
    useCarrinhoStore().adicionar(pastilha, 2);
    await nextTick();

    setActivePinia(createPinia()); // simula recarregar a página
    const restaurado = useCarrinhoStore();
    expect(restaurado.itens[0]).toMatchObject({ id: 'pastilha', quantidade: 2 });
  });
});
