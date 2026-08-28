// Converte um registro de Produto (com `categoria` e, opcionalmente,
// `compatibilidades.modeloVeiculo` incluídos) para o JSON da API.

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

function produtoView(produto) {
  const preco = produto.precoCentavos / 100;
  const compat = (produto.compatibilidades ?? [])
    .map((c) => c.modeloVeiculo)
    .filter(Boolean)
    .map((m) => ({ slug: m.slug, nome: `${m.marca} ${m.modelo}` }));

  return {
    id: produto.slug,
    nome: produto.nome,
    descricao: produto.descricao,
    tipo: produto.tipo.toLowerCase(), // "peca" | "acessorio"
    sku: produto.sku,
    preco,
    precoFormatado: brl.format(preco),
    estoque: produto.estoque,
    disponivel: produto.estoque > 0,
    imagemUrl: produto.imagemUrl,
    categoria: produto.categoria
      ? { nome: produto.categoria.nome, slug: produto.categoria.slug }
      : null,
    compativelCom: compat,
  };
}

module.exports = { produtoView };
