// Operação do dia a dia: fila de pedidos, agenda da oficina, mensagens de
// contato e os números do dashboard.

const { Router } = require('express');
const { z } = require('zod');
const prisma = require('../../lib/prisma');
const { pedidoAdminView, clienteAdminView } = require('../../lib/adminViews');
const { servicoView } = require('../../lib/servicoView');
const { dataValida, dataLocal, horaLocal } = require('../../lib/agenda');
const { ErroHttp } = require('../../middleware/errors');

const router = Router();

const ESTOQUE_BAIXO = 3;

// ───────────────────────────────  Pedidos  ───────────────────────────────

const STATUS_PEDIDO = ['RECEBIDO', 'EM_SEPARACAO', 'PRONTO', 'ENTREGUE', 'CANCELADO'];
const pedidoInclude = { cliente: true, itens: { include: { produto: true } } };

/** GET /api/admin/pedidos?status=RECEBIDO — mais recentes primeiro. */
router.get('/pedidos', async (req, res, next) => {
  try {
    const status = req.query.status ? z.enum(STATUS_PEDIDO).parse(req.query.status) : undefined;
    const pedidos = await prisma.pedido.findMany({
      where: { status },
      include: pedidoInclude,
      orderBy: { criadoEm: 'desc' },
      take: 200,
    });
    res.json(pedidos.map(pedidoAdminView));
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/admin/pedidos/:codigo/status — ENTREGUE e CANCELADO são finais.
 * Cancelar devolve os itens ao estoque, na mesma transação da troca de status.
 */
router.patch('/pedidos/:codigo/status', async (req, res, next) => {
  try {
    const { status } = z.object({ status: z.enum(STATUS_PEDIDO) }).parse(req.body);
    const codigo = req.params.codigo.toUpperCase();

    const pedido = await prisma.$transaction(async (tx) => {
      const atual = await tx.pedido.findUnique({ where: { codigo }, include: { itens: true } });
      if (!atual) throw new ErroHttp(404, 'Pedido não encontrado.');

      // Update condicional: dois cliques em "cancelar" não devolvem o estoque duas vezes.
      const { count } = await tx.pedido.updateMany({
        where: { id: atual.id, status: { notIn: ['ENTREGUE', 'CANCELADO'] } },
        data: { status },
      });
      if (count === 0) {
        throw new ErroHttp(409, `Pedido já está ${atual.status.toLowerCase()} e não pode mudar.`);
      }

      if (status === 'CANCELADO') {
        for (const item of atual.itens) {
          await tx.produto.update({
            where: { id: item.produtoId },
            data: { estoque: { increment: item.quantidade } },
          });
        }
      }
      return tx.pedido.findUnique({ where: { id: atual.id }, include: pedidoInclude });
    });

    res.json(pedidoAdminView(pedido));
  } catch (err) {
    next(err);
  }
});

// ───────────────────────────────  Agenda  ───────────────────────────────

const STATUS_AGENDAMENTO = ['SOLICITADO', 'CONFIRMADO', 'CONCLUIDO', 'CANCELADO'];
const agendamentoInclude = { servico: true, cliente: true };

const agendamentoAdminView = (a) => ({
  codigo: a.codigo,
  status: a.status,
  servico: servicoView(a.servico),
  data: dataLocal(a.dataHora),
  hora: horaLocal(a.dataHora),
  dataHora: a.dataHora,
  veiculoDescricao: a.veiculoDescricao,
  cliente: clienteAdminView(a.cliente),
});

/** GET /api/admin/agendamentos?de=AAAA-MM-DD&ate=AAAA-MM-DD&status= (padrão: de hoje em diante). */
router.get('/agendamentos', async (req, res, next) => {
  try {
    const { de, ate, status } = req.query;
    for (const d of [de, ate]) {
      if (d !== undefined && !dataValida(String(d))) throw new ErroHttp(400, 'Data inválida.');
    }
    const inicio = new Date(`${de ?? dataLocal(new Date())}T00:00:00-04:00`);
    const fim = ate ? new Date(`${ate}T23:59:59-04:00`) : undefined;

    const agendamentos = await prisma.agendamento.findMany({
      where: {
        dataHora: { gte: inicio, lte: fim },
        status: status ? z.enum(STATUS_AGENDAMENTO).parse(status) : undefined,
      },
      include: agendamentoInclude,
      orderBy: { dataHora: 'asc' },
      take: 300,
    });
    res.json(agendamentos.map(agendamentoAdminView));
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/admin/agendamentos/:codigo/status — CONCLUIDO e CANCELADO são finais.
 * Cancelar zera `horarioAtivo`, o que libera o horário na agenda pública.
 */
router.patch('/agendamentos/:codigo/status', async (req, res, next) => {
  try {
    const { status } = z.object({ status: z.enum(STATUS_AGENDAMENTO) }).parse(req.body);
    const codigo = req.params.codigo.toUpperCase();

    const atual = await prisma.agendamento.findUnique({ where: { codigo } });
    if (!atual) throw new ErroHttp(404, 'Agendamento não encontrado.');

    const { count } = await prisma.agendamento.updateMany({
      where: { id: atual.id, status: { notIn: ['CONCLUIDO', 'CANCELADO'] } },
      data: { status, ...(status === 'CANCELADO' && { horarioAtivo: null }) },
    });
    if (count === 0) {
      throw new ErroHttp(
        409,
        `Agendamento já está ${atual.status.toLowerCase()} e não pode mudar.`,
      );
    }

    const agendamento = await prisma.agendamento.findUnique({
      where: { id: atual.id },
      include: agendamentoInclude,
    });
    res.json(agendamentoAdminView(agendamento));
  } catch (err) {
    next(err);
  }
});

// ───────────────────────────────  Mensagens  ───────────────────────────────

/** GET /api/admin/mensagens?lida=false */
router.get('/mensagens', async (req, res, next) => {
  try {
    const { lida } = req.query;
    const mensagens = await prisma.mensagemContato.findMany({
      where: lida === undefined ? {} : { lida: lida === 'true' },
      orderBy: { criadoEm: 'desc' },
      take: 200,
    });
    res.json(mensagens);
  } catch (err) {
    next(err);
  }
});

router.patch('/mensagens/:id', async (req, res, next) => {
  try {
    const id = z.coerce.number().int().positive().parse(req.params.id);
    const { lida } = z.object({ lida: z.boolean() }).parse(req.body);
    res.json(await prisma.mensagemContato.update({ where: { id }, data: { lida } }));
  } catch (err) {
    next(err);
  }
});

// ───────────────────────────────  Dashboard  ───────────────────────────────

/** GET /api/admin/resumo — números do dashboard. */
router.get('/resumo', async (req, res, next) => {
  try {
    const hoje = dataLocal(new Date());
    const inicioMes = new Date(`${hoje.slice(0, 7)}-01T00:00:00-04:00`);

    const [
      veiculosDisponiveis,
      pedidosMes,
      pedidosPendentes,
      proximos,
      estoqueBaixo,
      mensagensNaoLidas,
    ] = await Promise.all([
      prisma.carro.count({ where: { status: 'DISPONIVEL' } }),
      prisma.pedido.aggregate({
        where: { criadoEm: { gte: inicioMes }, status: { not: 'CANCELADO' } },
        _count: true,
        _sum: { totalCentavos: true },
      }),
      prisma.pedido.count({ where: { status: { in: ['RECEBIDO', 'EM_SEPARACAO'] } } }),
      prisma.agendamento.findMany({
        where: { dataHora: { gte: new Date() }, status: { in: ['SOLICITADO', 'CONFIRMADO'] } },
        include: agendamentoInclude,
        orderBy: { dataHora: 'asc' },
        take: 5,
      }),
      prisma.produto.findMany({
        where: { estoque: { lte: ESTOQUE_BAIXO } },
        select: { id: true, nome: true, estoque: true },
        orderBy: { estoque: 'asc' },
        take: 10,
      }),
      prisma.mensagemContato.count({ where: { lida: false } }),
    ]);

    res.json({
      veiculosDisponiveis,
      pedidosMes: {
        quantidade: pedidosMes._count,
        total: (pedidosMes._sum.totalCentavos ?? 0) / 100,
      },
      pedidosPendentes,
      proximosAgendamentos: proximos.map(agendamentoAdminView),
      estoqueBaixo,
      mensagensNaoLidas,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
