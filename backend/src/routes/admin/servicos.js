const { Router } = require('express');
const { z } = require('zod');
const prisma = require('../../lib/prisma');
const { slugUnico } = require('../../lib/slug');
const { servicoAdminView } = require('../../lib/adminViews');

const router = Router();

const schemaServico = z.object({
  nome: z.string().trim().min(2).max(120),
  descricao: z.string().trim().min(5).max(2000),
  precoBase: z.number().nonnegative().max(1_000_000),
  // Múltiplo de 15: a grade da agenda avança pela duração (ver lib/agenda.js).
  duracaoMin: z.number().int().min(15).max(600).multipleOf(15, 'Use múltiplos de 15 minutos.'),
  ativo: z.boolean().default(true),
});

const id = (req) => z.coerce.number().int().positive().parse(req.params.id);
const dados = ({ precoBase, ...resto }) => ({
  ...resto,
  precoBaseCentavos: Math.round(precoBase * 100),
});

router.get('/', async (req, res, next) => {
  try {
    const servicos = await prisma.servico.findMany({ orderBy: { nome: 'asc' } });
    res.json(servicos.map(servicoAdminView));
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const d = schemaServico.parse(req.body);
    const servico = await prisma.servico.create({
      data: { ...dados(d), slug: await slugUnico(prisma.servico, d.nome) },
    });
    res.status(201).json(servicoAdminView(servico));
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const servico = await prisma.servico.update({
      where: { id: id(req) },
      data: dados(schemaServico.parse(req.body)),
    });
    res.json(servicoAdminView(servico));
  } catch (err) {
    next(err);
  }
});

/** Serviço com agendamentos não pode ser excluído (409) — desative-o. */
router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.servico.delete({ where: { id: id(req) } });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
