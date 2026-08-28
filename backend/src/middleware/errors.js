// 404 para rotas não mapeadas + tratamento centralizado de erros.

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

  console.error(err);
  res.status(500).json({ erro: 'Erro interno do servidor.' });
}

module.exports = { naoEncontrado, tratarErro };
