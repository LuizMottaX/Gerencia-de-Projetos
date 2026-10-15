// Serviços de manutenção para o seed. Preço em reais (convertido para centavos).

const servicos = [
  {
    slug: 'troca-de-oleo',
    nome: 'Troca de Óleo e Filtro',
    descricao:
      'Troca do óleo do motor e do filtro de óleo, com verificação dos níveis de fluidos e checklist de 20 itens.',
    precoBase: 149.9,
    duracaoMin: 30,
  },
  {
    slug: 'alinhamento-balanceamento',
    nome: 'Alinhamento e Balanceamento',
    descricao:
      'Alinhamento computadorizado da direção e balanceamento das quatro rodas. Inclui rodízio dos pneus.',
    precoBase: 119.9,
    duracaoMin: 60,
  },
  {
    slug: 'revisao-freios',
    nome: 'Revisão dos Freios',
    descricao:
      'Inspeção de pastilhas, discos, lonas e fluido de freio. Troca de peças orçada à parte.',
    precoBase: 99.9,
    duracaoMin: 60,
  },
  {
    slug: 'higienizacao-ar-condicionado',
    nome: 'Higienização do Ar-Condicionado',
    descricao:
      'Limpeza do sistema com aplicação de bactericida, troca do filtro de cabine e teste de pressão do gás.',
    precoBase: 179.9,
    duracaoMin: 90,
  },
  {
    slug: 'revisao-completa',
    nome: 'Revisão Completa',
    descricao:
      'Revisão preventiva com troca de óleo e filtros, verificação de freios, suspensão, elétrica e arrefecimento.',
    precoBase: 449.9,
    duracaoMin: 180,
  },
];

module.exports = { servicos };
