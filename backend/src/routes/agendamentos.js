const { Router } = require('express');
const { z } = require('zod');
const rateLimit = require('express-rate-limit');
const prisma = require('../lib/prisma');
const { gerarCodigo } = require('../lib/codigo');
const { schemaCliente } = require('../lib/schemas');
const { agendamentoView } = require('../lib/agendamentoView');
const { ErroHttp } = require('../middleware/errors');
const {
  dataValida,
  gradeDoDia,
  dentroDaJanela,
  pertenceAGrade,
  horaLocal,
} = require('../lib/agenda');

const router = Router();

const limitador = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === 'test', // os testes disparam vários agendamentos em sequência
  message: { erro: 'Muitos agendamentos em pouco tempo. Tente novamente em alguns minutos.' },
});

const schemaAgendamento = z.object({
  servico: z.string().trim().min(1), // slug do serviço
  dataHora: z.string().datetime({ offset: true, message: 'Data/hora inválida.' }),
  veiculoDescricao: z.string().trim().min(3, 'Descreva o veículo (modelo, ano, placa).').max(120),
  cliente: schemaCliente,
});

const agendamentoInclude = { servico: true, cliente: true };

async function buscarServicoAtivo(slug) {
  const servico = await prisma.servico.findFirst({ where: { slug, ativo: true } });
  if (!servico) throw new ErroHttp(404, 'Serviço não encontrado.');
  return servico;
}

/**
 * GET /api/agendamentos/disponibilidade?servico=<slug>&data=<YYYY-MM-DD>
 * Horários livres do serviço no dia, já sem os passados e os ocupados.
 */
router.get('/disponibilidade', async (req, res, next) => {
  try {
    const { servico: slug, data } = req.query;
    if (typeof data !== 'string' || !dataValida(data)) {
      throw new ErroHttp(400, 'Data inválida. Use o formato AAAA-MM-DD.');
    }
    const servico = await buscarServicoAtivo(String(slug ?? ''));

    const grade = gradeDoDia(data, servico.duracaoMin);
    const naJanela = grade.filter((h) => dentroDaJanela(h.dataHora));

    // Só agendamentos ativos ocupam a agenda — cancelados têm horarioAtivo NULL.
    const ocupados = await prisma.agendamento.findMany({
      where: { servicoId: servico.id, horarioAtivo: { in: naJanela.map((h) => h.dataHora) } },
      select: { dataHora: true },
    });
    const ocupadosMs = new Set(ocupados.map((a) => a.dataHora.getTime()));

    res.json({
      servico: servico.slug,
      data,
      fechado: grade.length === 0,
      horarios: naJanela
        .filter((h) => !ocupadosMs.has(h.dataHora.getTime()))
        .map((h) => ({ hora: h.hora, dataHora: h.dataHora.toISOString() })),
    });
  } catch (err) {
    next(err);
  }
});

/** POST /api/agendamentos — reserva um horário livre. */
router.post('/', limitador, async (req, res, next) => {
  try {
    const dados = schemaAgendamento.parse(req.body);
    const servico = await buscarServicoAtivo(dados.servico);
    const dataHora = new Date(dados.dataHora);

    if (!pertenceAGrade(dataHora, servico.duracaoMin)) {
      throw new ErroHttp(400, 'Horário fora da grade de atendimento deste serviço.');
    }
    if (!dentroDaJanela(dataHora)) {
      throw new ErroHttp(400, 'Horário indisponível para agendamento (passado ou muito distante).');
    }

    const { id: clienteId } = await prisma.cliente.upsert({
      where: { email: dados.cliente.email },
      update: { nome: dados.cliente.nome, telefone: dados.cliente.telefone },
      create: dados.cliente,
    });

    try {
      const agendamento = await prisma.agendamento.create({
        data: {
          codigo: gerarCodigo('AG'),
          servicoId: servico.id,
          clienteId,
          veiculoDescricao: dados.veiculoDescricao,
          dataHora,
          horarioAtivo: dataHora,
        },
        include: agendamentoInclude,
      });
      res.status(201).json(agendamentoView(agendamento));
    } catch (err) {
      // A constraint @@unique([servicoId, horarioAtivo]) resolve a corrida entre
      // dois clientes escolhendo o mesmo horário ao mesmo tempo.
      if (err.code === 'P2002' && String(err.meta?.target).includes('horarioAtivo')) {
        throw new ErroHttp(
          409,
          `Horário indisponível: ${horaLocal(dataHora)} acabou de ser reservado.`,
        );
      }
      throw err;
    }
  } catch (err) {
    next(err);
  }
});

/** GET /api/agendamentos/:codigo — consulta pelo código. */
router.get('/:codigo', async (req, res, next) => {
  try {
    const agendamento = await prisma.agendamento.findUnique({
      where: { codigo: req.params.codigo.toUpperCase() },
      include: agendamentoInclude,
    });
    if (!agendamento) return res.status(404).json({ erro: 'Agendamento não encontrado.' });
    res.json(agendamentoView(agendamento));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
