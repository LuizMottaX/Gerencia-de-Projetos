import { describe, it, expect } from 'vitest';
import { diaNaOficina, formatarData } from '../src/utils/agenda';

describe('utils/agenda', () => {
  it('usa o dia de Sinop–MT, mesmo quando no navegador já virou o dia', () => {
    // 02:00 UTC do dia 13 = 22:00 do dia 12 em Cuiabá (UTC-4)
    const agora = new Date('2026-10-13T02:00:00Z');
    expect(diaNaOficina(0, agora)).toBe('2026-10-12');
    expect(diaNaOficina(60, agora)).toBe('2026-12-11');
  });

  it('formata a data por extenso em português', () => {
    expect(formatarData('2026-10-12')).toBe('segunda-feira, 12 de outubro');
  });
});
