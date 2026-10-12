// Converte um Pedido (com `itens.produto` incluídos) para o JSON da API.
// Não expõe dados do cliente além do primeiro nome: o código do pedido é
// tudo o que se precisa para consultá-lo.

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const formatar = (centavos) => brl.format(centavos / 100);

function pedidoView(pedido) {
  return {
    codigo: pedido.codigo,
    status: pedido.status,
    total: pedido.totalCentavos / 100,
    totalFormatado: formatar(pedido.totalCentavos),
    cliente: pedido.cliente ? { nome: pedido.cliente.nome.split(' ')[0] } : null,
    itens: pedido.itens.map((item) => ({
      produto: {
        id: item.produto.slug,
        nome: item.produto.nome,
        tipo: item.produto.tipo.toLowerCase(),
      },
      quantidade: item.quantidade,
      precoUnitFormatado: formatar(item.precoUnitCentavos),
      subtotalFormatado: formatar(item.precoUnitCentavos * item.quantidade),
    })),
    criadoEm: pedido.criadoEm,
  };
}

module.exports = { pedidoView };
