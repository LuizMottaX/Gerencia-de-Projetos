// 404 para rotas não mapeadas + tratamento centralizado de erros.

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

  console.error(err);
  res.status(500).json({ erro: 'Erro interno do servidor.' });
}

module.exports = { ErroHttp, naoEncontrado, tratarErro };
