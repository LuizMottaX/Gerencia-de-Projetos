import { describe, it, expect, vi } from 'vitest';
import { flushPromises } from '@vue/test-utils';
import { reactive } from 'vue';
import { useProdutos } from '../src/composables/useProdutos.js';

describe('useProdutos', () => {
  it('chama o fetcher com os filtros e popula itens e total', async () => {
    const itens = [{ id: 'filtro-oleo' }, { id: 'bateria-60ah' }];
    const fetcher = vi.fn().mockResolvedValue({ itens, total: 2 });

    const r = useProdutos(fetcher, reactive({ categoria: 'filtros' }));
    expect(r.carregando.value).toBe(true);

    await flushPromises();
    expect(fetcher).toHaveBeenCalledWith({ categoria: 'filtros' });
    expect(r.itens.value).toEqual(itens);
    expect(r.total.value).toBe(2);
    expect(r.carregando.value).toBe(false);
    expect(r.erro.value).toBeNull();
  });

  it('expõe a mensagem de erro e limpa os itens quando o fetcher falha', async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error('Falha de rede'));

    const r = useProdutos(fetcher, {});
    await flushPromises();
    expect(r.erro.value).toBe('Falha de rede');
    expect(r.itens.value).toEqual([]);
    expect(r.carregando.value).toBe(false);
  });
});
