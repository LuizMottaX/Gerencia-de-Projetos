// Converte um Agendamento (com `servico` e `cliente` incluídos) para o JSON da API.
// Como no pedido, do cliente só sai o primeiro nome: o código basta para consultar.

const { servicoView } = require('./servicoView');
const { dataLocal, horaLocal } = require('./agenda');

function agendamentoView(agendamento) {
  return {
    codigo: agendamento.codigo,
    status: agendamento.status,
    servico: servicoView(agendamento.servico),
    dataHora: agendamento.dataHora,
    data: dataLocal(agendamento.dataHora),
    hora: horaLocal(agendamento.dataHora),
    veiculoDescricao: agendamento.veiculoDescricao,
    cliente: agendamento.cliente ? { nome: agendamento.cliente.nome.split(' ')[0] } : null,
  };
}

module.exports = { agendamentoView };
