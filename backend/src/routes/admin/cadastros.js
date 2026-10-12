// Cadastros auxiliares do catálogo: categorias, marcas e modelos de veículo.

const { Router } = require('express');
const { z } = require('zod');
const prisma = require('../../lib/prisma');
const { slugUnico } = require('../../lib/slug');

const router = Router();
const id = (req) => z.coerce.number().int().positive().parse(req.params.id);
const nome = z.string().trim().min(2).max(80);

/**
 * Monta GET/POST/PUT/DELETE para um modelo simples com slug gerado a partir
 * de `textoSlug(dados)`. O slug só é gerado na criação.
 */
function crud(caminho, delegate, schema, textoSlug, orderBy) {
  router.get(caminho, async (req, res, next) => {
    try {
      res.json(await delegate.findMany({ orderBy }));
    } catch (err) {
      next(err);
    }
  });
  router.post(caminho, async (req, res, next) => {
    try {
      const d = schema.parse(req.body);
      const criado = await delegate.create({
        data: { ...d, slug: await slugUnico(delegate, textoSlug(d)) },
      });
      res.status(201).json(criado);
    } catch (err) {
      next(err);
    }
  });
  router.put(`${caminho}/:id`, async (req, res, next) => {
    try {
      res.json(await delegate.update({ where: { id: id(req) }, data: schema.parse(req.body) }));
    } catch (err) {
      next(err);
    }
  });
  router.delete(`${caminho}/:id`, async (req, res, next) => {
    try {
      await delegate.delete({ where: { id: id(req) } });
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  });
}

crud(
  '/categorias',
  prisma.categoria,
  z.object({ nome, tipo: z.enum(['PECA', 'ACESSORIO']) }),
  (d) => d.nome,
  [{ tipo: 'asc' }, { nome: 'asc' }],
);

crud('/marcas', prisma.marca, z.object({ nome }), (d) => d.nome, { nome: 'asc' });

const ano = z.number().int().min(1900).max(2100).nullish();
crud(
  '/modelos',
  prisma.modeloVeiculo,
  z
    .object({ marca: nome, modelo: nome, anoInicio: ano, anoFim: ano })
    .refine((m) => !m.anoInicio || !m.anoFim || m.anoInicio <= m.anoFim, {
      message: 'Ano inicial maior que o final.',
      path: ['anoFim'],
    }),
  (d) => `${d.marca} ${d.modelo}`,
  [{ marca: 'asc' }, { modelo: 'asc' }],
);

module.exports = router;
