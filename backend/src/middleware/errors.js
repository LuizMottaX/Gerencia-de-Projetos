// 404 para rotas não mapeadas + tratamento centralizado de erros.

const { log } = require('./logs');

/** Erro de regra de negócio com status HTTP próprio (ex.: 409 estoque insuficiente). */
class ErroHttp extends Error {
  constructor(status, mensagem, detalhes) {
    super(mensagem);
    this.status = status;
    this.detalhes = detalhes;
  }
}

function naoEncontrado(req, res) {
  res.status(404).json({ erro: 'Recurso não encontrado.' });
}

// eslint-disable-next-line no-unused-vars
function tratarErro(err, req, res, next) {
  // Erro de validação (zod) — devolve 400 com os detalhes.
  if (err?.name === 'ZodError') {
    return res.status(400).json({
      erro: 'Dados inválidos.',
      detalhes: err.issues?.map((i) => ({ campo: i.path.join('.'), mensagem: i.message })),
    });
  }

  if (err instanceof ErroHttp) {
    return res.status(err.status).json({ erro: err.message, detalhes: err.detalhes });
  }

  // Erros conhecidos do Prisma que são culpa da requisição, não do servidor.
  if (err?.code === 'P2025') {
    return res.status(404).json({ erro: 'Registro não encontrado.' });
  }
  if (err?.code === 'P2003') {
    return res.status(409).json({
      erro: 'Não é possível concluir: o registro está ligado a outros (ex.: pedidos, veículos ou agendamentos).',
    });
  }
  if (err?.code === 'P2002') {
    return res.status(409).json({ erro: 'Já existe um registro com estes dados.' });
  }

  // Upload (multer): arquivo grande demais, campo errado etc.
  if (err?.name === 'MulterError') {
    const mensagem = err.code === 'LIMIT_FILE_SIZE' ? 'Imagem maior que 5 MB.' : 'Upload inválido.';
    return res.status(400).json({ erro: mensagem });
  }

  log('erro', {
    metodo: req.method,
    rota: req.originalUrl,
    erro: err?.message,
    pilha: err?.stack?.split('\n').slice(0, 5).join(' | '),
  });
  res.status(500).json({ erro: 'Erro interno do servidor.' });
}

module.exports = { ErroHttp, naoEncontrado, tratarErro };
