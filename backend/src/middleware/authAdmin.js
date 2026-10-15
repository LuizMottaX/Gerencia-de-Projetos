const { verificarToken } = require('../lib/jwt');

/** Exige `Authorization: Bearer <token>` válido; expõe `req.adminId`. */
function verificarAdmin(req, res, next) {
  const [esquema, token] = (req.headers.authorization || '').split(' ');
  if (esquema !== 'Bearer' || !token) {
    return res.status(401).json({ erro: 'Acesso negado. Token não fornecido.' });
  }

  try {
    const payload = verificarToken(token);
    if (!payload.adminId) {
      return res.status(401).json({ erro: 'Acesso negado. Token inválido.' });
    }
    req.adminId = payload.adminId;
    next();
  } catch {
    return res.status(401).json({ erro: 'Acesso negado. Token expirado ou inválido.' });
  }
}

module.exports = { verificarAdmin };
