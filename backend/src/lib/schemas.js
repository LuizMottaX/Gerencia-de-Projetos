const { z } = require('zod');

/** Dados de contato do cliente — usados no pedido (F3) e no agendamento (F4). */
const schemaCliente = z.object({
  nome: z.string().trim().min(2, 'Informe seu nome.').max(120),
  email: z.string().trim().toLowerCase().email('E-mail inválido.').max(160),
  telefone: z.string().trim().min(8, 'Telefone inválido.').max(30),
});

module.exports = { schemaCliente };
