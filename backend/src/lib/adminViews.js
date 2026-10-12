// Serializers do painel: expõem ids numéricos e valores crus (preço em reais
// como número) — o formato que os formulários de edição precisam.

const reais = (centavos) => centavos / 100;

const produtoAdminView = (p) => ({
  id: p.id,
  slug: p.slug,
  nome: p.nome,
  descricao: p.descricao,
  preco: reais(p.precoCentavos),
  estoque: p.estoque,
  sku: p.sku,
  tipo: p.tipo,
  imagemUrl: p.imagemUrl,
  categoriaId: p.categoriaId,
  categoria: p.categoria?.nome ?? null,
  compativelCom: (p.compatibilidades ?? []).map((c) => c.modeloVeiculoId),
  atualizadoEm: p.atualizadoEm,
});

const carroAdminView = (c) => ({
  id: c.id,
  slug: c.slug,
  nome: c.nome,
  modelo: c.modelo,
  ano: c.ano,
  preco: reais(c.precoCentavos),
  quilometragem: c.quilometragem,
  cor: c.cor,
  combustivel: c.combustivel,
  portas: c.portas,
  cambio: c.cambio,
  carroceria: c.carroceria,
  finalPlaca: c.finalPlaca,
  localizacao: c.localizacao,
  status: c.status,
  formasPagamento: c.formasPagamento,
  marcaId: c.marcaId,
  marca: c.marca?.nome ?? null,
  modeloVeiculoId: c.modeloVeiculoId,
  imagens: [...(c.imagens ?? [])].sort((a, b) => a.ordem - b.ordem).map((i) => i.url),
  atualizadoEm: c.atualizadoEm,
});

const servicoAdminView = (s) => ({
  id: s.id,
  slug: s.slug,
  nome: s.nome,
  descricao: s.descricao,
  precoBase: reais(s.precoBaseCentavos),
  duracaoMin: s.duracaoMin,
  ativo: s.ativo,
});

const clienteAdminView = (c) => ({ nome: c.nome, email: c.email, telefone: c.telefone });

const pedidoAdminView = (p) => ({
  codigo: p.codigo,
  status: p.status,
  total: reais(p.totalCentavos),
  cliente: clienteAdminView(p.cliente),
  itens: p.itens.map((i) => ({
    produtoId: i.produtoId,
    nome: i.produto.nome,
    quantidade: i.quantidade,
    precoUnit: reais(i.precoUnitCentavos),
  })),
  criadoEm: p.criadoEm,
});

module.exports = {
  produtoAdminView,
  carroAdminView,
  servicoAdminView,
  clienteAdminView,
  pedidoAdminView,
};
