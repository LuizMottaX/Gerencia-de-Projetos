import { FUSO_OFICINA } from './agenda';

const brlFmt = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
export const brl = (valor) => brlFmt.format(valor ?? 0);

/** "12/10/2026 14:30" no fuso da oficina. */
export const dataHoraCurta = (iso) =>
  new Date(iso).toLocaleString('pt-BR', {
    timeZone: FUSO_OFICINA,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

/** Rótulo e cor (classe .selo--*) de cada status. */
export const STATUS_PEDIDO = {
  RECEBIDO: { texto: 'Recebido', selo: 'alerta' },
  EM_SEPARACAO: { texto: 'Em separação', selo: 'alerta' },
  PRONTO: { texto: 'Pronto p/ retirada', selo: 'ok' },
  ENTREGUE: { texto: 'Entregue', selo: 'ok' },
  CANCELADO: { texto: 'Cancelado', selo: 'erro' },
};

export const STATUS_AGENDAMENTO = {
  SOLICITADO: { texto: 'Solicitado', selo: 'alerta' },
  CONFIRMADO: { texto: 'Confirmado', selo: 'ok' },
  CONCLUIDO: { texto: 'Concluído', selo: 'ok' },
  CANCELADO: { texto: 'Cancelado', selo: 'erro' },
};

export const STATUS_CARRO = {
  DISPONIVEL: { texto: 'Disponível', selo: 'ok' },
  RESERVADO: { texto: 'Reservado', selo: 'alerta' },
  VENDIDO: { texto: 'Vendido', selo: 'erro' },
};

/** Status finais não podem mais mudar (a API responde 409). */
export const FINAIS = ['ENTREGUE', 'CANCELADO', 'CONCLUIDO'];
