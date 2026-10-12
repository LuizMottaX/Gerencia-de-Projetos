// Datas da agenda sempre no fuso da oficina (Sinop–MT), não no do navegador —
// assim um cliente em outro fuso vê os mesmos dias e horários que a loja.

export const FUSO_OFICINA = 'America/Cuiaba';
export const JANELA_DIAS = 60;

/** "YYYY-MM-DD" de hoje na oficina (+ `dias`). */
export function diaNaOficina(dias = 0, agora = new Date()) {
  const instante = new Date(agora.getTime() + dias * 24 * 60 * 60 * 1000);
  return instante.toLocaleDateString('en-CA', { timeZone: FUSO_OFICINA });
}

/** "2026-10-12" → "segunda-feira, 12 de outubro". */
export function formatarData(data) {
  return new Date(`${data}T12:00:00-04:00`).toLocaleDateString('pt-BR', {
    timeZone: FUSO_OFICINA,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}
