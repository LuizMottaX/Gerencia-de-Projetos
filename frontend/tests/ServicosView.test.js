import { describe, it, expect, vi } from 'vitest';
import { mount, flushPromises, RouterLinkStub } from '@vue/test-utils';
import ServicosView from '../src/views/ServicosView.vue';
import { api } from '../src/api';

describe('ServicosView', () => {
  it('lista os serviços com preço, duração e link para agendar', async () => {
    vi.spyOn(api, 'listarServicos').mockResolvedValue([
      {
        id: 'troca-de-oleo',
        nome: 'Troca de Óleo e Filtro',
        descricao: 'Troca do óleo.',
        precoBaseFormatado: 'R$ 149,90',
        duracaoFormatada: '30 min',
      },
    ]);

    const wrapper = mount(ServicosView, { global: { stubs: { RouterLink: RouterLinkStub } } });
    await flushPromises();

    expect(wrapper.text()).toContain('Troca de Óleo e Filtro');
    expect(wrapper.text()).toContain('a partir de R$ 149,90');
    expect(wrapper.text()).toContain('30 min');
    expect(wrapper.findComponent(RouterLinkStub).props('to')).toBe('/agendar/troca-de-oleo');
  });
});
