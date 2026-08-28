// Popula o banco com o catálogo inicial: veículos, marcas, modelos,
// categorias, peças e acessórios (com compatibilidade por modelo).
// Idempotente: usa upsert por slug, pode rodar quantas vezes quiser.

const prisma = require('../src/lib/prisma');
const { modelos, carros } = require('./seed/veiculos');
const { categorias, pecas, acessorios } = require('./seed/catalogo');

const FORMAS_PADRAO = [
  'À vista',
  'Financiamento',
  'Cartão de crédito',
  'Troca em veículo de menor valor',
];

function slugify(texto) {
  return texto
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// "114.000 km" -> 114000
function kmParaNumero(texto) {
  return Number.parseInt(String(texto).replace(/\D/g, ''), 10) || 0;
}

const reais = (v) => Math.round(v * 100);

async function seedMarcas() {
  const nomes = [...new Set(carros.map((c) => c.marca))];
  for (const nome of nomes) {
    await prisma.marca.upsert({
      where: { slug: slugify(nome) },
      update: { nome },
      create: { nome, slug: slugify(nome) },
    });
  }
  return nomes.length;
}

async function seedModelos() {
  for (const m of modelos) {
    await prisma.modeloVeiculo.upsert({
      where: { slug: m.slug },
      update: { marca: m.marca, modelo: m.modelo, anoInicio: m.anoInicio ?? null, anoFim: m.anoFim ?? null },
      create: { slug: m.slug, marca: m.marca, modelo: m.modelo, anoInicio: m.anoInicio ?? null, anoFim: m.anoFim ?? null },
    });
  }
  return modelos.length;
}

async function seedCarros() {
  for (const c of carros) {
    const marca = await prisma.marca.findUnique({ where: { slug: slugify(c.marca) } });
    const modelo = c.modeloRef
      ? await prisma.modeloVeiculo.findUnique({ where: { slug: c.modeloRef } })
      : null;

    const dados = {
      nome: c.nome,
      modelo: c.modelo,
      ano: c.ano,
      precoCentavos: reais(c.preco),
      quilometragem: kmParaNumero(c.quilometragem),
      cor: c.cor,
      combustivel: c.combustivel,
      portas: c.portas,
      cambio: c.cambio,
      carroceria: c.carroceria,
      finalPlaca: c.finalPlaca,
      localizacao: c.localizacao,
      formasPagamento: FORMAS_PADRAO,
      marcaId: marca.id,
      modeloVeiculoId: modelo?.id ?? null,
    };

    const carro = await prisma.carro.upsert({
      where: { slug: c.slug },
      update: dados,
      create: { slug: c.slug, ...dados },
    });

    await prisma.carroImagem.deleteMany({ where: { carroId: carro.id } });
    await prisma.carroImagem.createMany({
      data: c.imagens.map((url, i) => ({ url, ordem: i, capa: i === 0, carroId: carro.id })),
    });
  }
  return carros.length;
}

async function seedCategorias() {
  for (const cat of categorias) {
    await prisma.categoria.upsert({
      where: { slug: cat.slug },
      update: { nome: cat.nome, tipo: cat.tipo },
      create: cat,
    });
  }
  return categorias.length;
}

async function seedProdutos(itens, tipo) {
  for (const p of itens) {
    const categoria = await prisma.categoria.findUnique({ where: { slug: p.categoriaRef } });

    const dados = {
      nome: p.nome,
      descricao: p.descricao,
      precoCentavos: reais(p.preco),
      estoque: p.estoque,
      sku: p.sku ?? null,
      tipo,
      // Sem foto própria: usa a imagem da categoria (frontend/public/produtos/).
      imagemUrl: p.imagemUrl ?? `/produtos/${p.categoriaRef}.jpg`,
      categoriaId: categoria.id,
    };

    const produto = await prisma.produto.upsert({
      where: { slug: p.slug },
      update: dados,
      create: { slug: p.slug, ...dados },
    });

    // Recria as compatibilidades do produto.
    await prisma.produtoCompatibilidade.deleteMany({ where: { produtoId: produto.id } });
    for (const modeloSlug of p.compat ?? []) {
      const modelo = await prisma.modeloVeiculo.findUnique({ where: { slug: modeloSlug } });
      if (modelo) {
        await prisma.produtoCompatibilidade.create({
          data: { produtoId: produto.id, modeloVeiculoId: modelo.id },
        });
      }
    }
  }
  return itens.length;
}

async function main() {
  console.log(`✔ ${await seedMarcas()} marcas`);
  console.log(`✔ ${await seedModelos()} modelos de veículo`);
  console.log(`✔ ${await seedCarros()} veículos com imagens`);
  console.log(`✔ ${await seedCategorias()} categorias`);
  console.log(`✔ ${await seedProdutos(pecas, 'PECA')} peças`);
  console.log(`✔ ${await seedProdutos(acessorios, 'ACESSORIO')} acessórios`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('Seed concluído.');
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
