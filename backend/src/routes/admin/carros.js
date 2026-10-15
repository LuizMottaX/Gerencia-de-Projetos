const { Router } = require('express');
const { z } = require('zod');
const prisma = require('../../lib/prisma');
const { slugUnico } = require('../../lib/slug');
const { carroAdminView } = require('../../lib/adminViews');

const router = Router();
const include = { marca: true, imagens: true };
const texto = (max = 60) => z.string().trim().min(1).max(max);

const schemaCarro = z.object({
  nome: texto(120),
  modelo: texto(),
  ano: z.number().int().min(1900).max(2100),
  preco: z.number().nonnegative().max(100_000_000),
  quilometragem: z.number().int().min(0).max(5_000_000),
  cor: texto(),
  combustivel: texto(),
  portas: z.number().int().min(1).max(6),
  cambio: texto(),
  carroceria: texto(),
  finalPlaca: z.number().int().min(0).max(9).nullish(),
  localizacao: texto(120),
  status: z.enum(['DISPONIVEL', 'RESERVADO', 'VENDIDO']),
  formasPagamento: z.array(texto()).max(10).default([]),
  marcaId: z.number().int().positive(),
  modeloVeiculoId: z.number().int().positive().nullish(),
  /** URLs na ordem de exibição; a primeira é a capa. */
  imagens: z.array(z.string().trim().min(1).max(300)).max(20).default([]),
});

const id = (req) => z.coerce.number().int().positive().parse(req.params.id);

function dadosCarro({ imagens: _imagens, preco, finalPlaca, modeloVeiculoId, ...resto }) {
  return {
    ...resto,
    precoCentavos: Math.round(preco * 100),
    finalPlaca: finalPlaca ?? null,
    modeloVeiculoId: modeloVeiculoId ?? null,
  };
}

const criarImagens = (urls) => ({
  create: urls.map((url, ordem) => ({ url, ordem, capa: ordem === 0 })),
});

router.get('/', async (req, res, next) => {
  try {
    const carros = await prisma.carro.findMany({ include, orderBy: { criadoEm: 'desc' } });
    res.json(carros.map(carroAdminView));
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const carro = await prisma.carro.findUniqueOrThrow({ where: { id: id(req) }, include });
    res.json(carroAdminView(carro));
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const d = schemaCarro.parse(req.body);
    const carro = await prisma.carro.create({
      data: {
        ...dadosCarro(d),
        slug: await slugUnico(prisma.carro, `${d.nome} ${d.ano}`),
        imagens: criarImagens(d.imagens),
      },
      include,
    });
    res.status(201).json(carroAdminView(carro));
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const carroId = id(req);
    const d = schemaCarro.parse(req.body);
    const carro = await prisma.$transaction(async (tx) => {
      await tx.carroImagem.deleteMany({ where: { carroId } });
      return tx.carro.update({
        where: { id: carroId },
        data: { ...dadosCarro(d), imagens: criarImagens(d.imagens) },
        include,
      });
    });
    res.json(carroAdminView(carro));
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.carro.delete({ where: { id: id(req) } });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
