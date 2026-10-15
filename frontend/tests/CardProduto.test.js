import { describe, it, expect, beforeEach } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import CardProduto from '../src/components/CardProduto.vue';
import { useCarrinhoStore } from '../src/stores/carrinho';

const produtoBase = {
  id: 'pastilha-freio-dianteira',
  nome: 'Pastilha de Freio Dianteira',
  tipo: 'peca',
  preco: 129.9,
  precoFormatado: 'R$ 129,90',
  estoque: 3,
  disponivel: true,
  imagemUrl: null,
  categoria: { nome: 'Freios', slug: 'freios' },
  compativelCom: [{ slug: 'fiat-palio', nome: 'Fiat Palio' }],
};

beforeEach(() => {
  localStorage.clear();
  setActivePinia(createPinia());
});

const montar = (produto) =>
  mount(CardProduto, {
    props: { produto },
    global: { stubs: { RouterLink: RouterLinkStub } },
  });

describe('CardProduto', () => {
  it('renderiza nome, preço e compatibilidade', () => {
    const texto = montar(produtoBase).text();
    expect(texto).toContain('Pastilha de Freio Dianteira');
    expect(texto).toContain('R$ 129,90');
    expect(texto).toContain('Compatível com Fiat Palio');
  });

  it('aponta para /pecas/:id quando é peça', () => {
    const link = montar(produtoBase).findComponent(RouterLinkStub);
    expect(link.props('to')).toBe('/pecas/pastilha-freio-dianteira');
  });

  it('aponta para /acessorios/:id quando é acessório', () => {
    const link = montar({ ...produtoBase, id: 'tapete', tipo: 'acessorio' }).findComponent(
      RouterLinkStub,
    );
    expect(link.props('to')).toBe('/acessorios/tapete');
  });

  it('mostra "Esgotado" quando indisponível', () => {
    expect(montar({ ...produtoBase, disponivel: false }).text()).toContain('Esgotado');
  });

  it('adiciona ao carrinho pelo botão', async () => {
    await montar(produtoBase).find('button').trigger('click');
    expect(useCarrinhoStore().quantidadeTotal).toBe(1);
  });

  it('desabilita o botão quando esgotado', () => {
    const botao = montar({ ...produtoBase, disponivel: false }).find('button');
    expect(botao.attributes('disabled')).toBeDefined();
  });
});
