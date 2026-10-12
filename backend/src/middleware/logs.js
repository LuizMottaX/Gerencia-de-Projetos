// Log estruturado (uma linha JSON por requisição) — fácil de filtrar no painel
// da hospedagem (Coolify/Railway/Render). Desligado nos testes.

function log(nivel, dados) {
  const linha = JSON.stringify({ ts: new Date().toISOString(), nivel, ...dados });
  (nivel === 'erro' ? console.error : console.log)(linha);
}

function logRequisicoes(req, res, next) {
  if (process.env.NODE_ENV === 'test' || req.path === '/health') return next();
  const inicio = process.hrtime.bigint();
  res.on('finish', () => {
    log(res.statusCode >= 500 ? 'erro' : 'info', {
      metodo: req.method,
      rota: req.originalUrl,
      status: res.statusCode,
      ms: Number((process.hrtime.bigint() - inicio) / 1_000_000n),
      ip: req.ip,
    });
  });
  next();
}

module.exports = { log, logRequisicoes };
