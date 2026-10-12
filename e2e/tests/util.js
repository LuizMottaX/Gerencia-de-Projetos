/** Um dia útil (seg–sex) entre 3 e 9 dias à frente, no fuso da oficina — "AAAA-MM-DD". */
export function proximoDiaUtil() {
  const d = new Date(Date.now() + 3 * 864e5);
  for (;;) {
    const dia = d.toLocaleDateString('en-CA', { timeZone: 'America/Cuiaba' });
    const semana = new Date(`${dia}T12:00:00-04:00`).getUTCDay();
    if (semana >= 1 && semana <= 5) return dia;
    d.setTime(d.getTime() + 864e5);
  }
}

/** E-mail único por execução, para não depender de dados anteriores. */
export const emailUnico = (prefixo) => `${prefixo}.${Date.now()}@exemplo.com`;
