// Converte um registro de Carro (com `marca` e `imagens` incluídos) para o
// formato JSON que o frontend já consome. Mantém a API estável enquanto a
// origem dos dados muda de arquivo em memória para PostgreSQL.

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const numero = new Intl.NumberFormat('pt-BR');

function carroView(carro) {
  const imagens = [...carro.imagens].sort((a, b) => {
    if (a.capa !== b.capa) return a.capa ? -1 : 1;
    return a.ordem - b.ordem;
  });
  const urls = imagens.map((img) => img.url);
  const preco = carro.precoCentavos / 100;

  return {
    id: carro.slug,
    nome: carro.nome,
    marca: carro.marca?.nome ?? null,
    modelo: carro.modelo,
    ano: carro.ano,
    preco,
    precoFormatado: brl.format(preco),
    quilometragem: `${numero.format(carro.quilometragem)} km`,
    cor: carro.cor,
    combustivel: carro.combustivel,
    portas: carro.portas,
    cambio: carro.cambio,
    carroceria: carro.carroceria,
    finalPlaca: carro.finalPlaca,
    localizacao: carro.localizacao,
    status: carro.status,
    modeloSlug: carro.modeloVeiculo?.slug ?? null,
    imagemCapa: urls[0] ?? null,
    imagens: urls,
    formasPagamento: carro.formasPagamento,
  };
}

module.exports = { carroView };
