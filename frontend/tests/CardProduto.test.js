import { describe, it, expect } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import CardProduto from '../src/components/CardProduto.vue';

const produtoBase = {
  id: 'pastilha-freio-dianteira',
  nome: 'Pastilha de Freio Dianteira',
  tipo: 'peca',
  precoFormatado: 'R$ 129,90',
  disponivel: true,
  imagemUrl: null,
  categoria: { nome: 'Freios', slug: 'freios' },
  compativelCom: [{ slug: 'fiat-palio', nome: 'Fiat Palio' }],
};

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
});
