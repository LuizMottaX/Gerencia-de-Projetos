const jwt = require('jsonwebtoken');

// Sem fallback: um segredo padrão no código permitiria forjar tokens de admin.
function segredo() {
  const valor = process.env.JWT_SECRET;
  if (!valor) throw new Error('JWT_SECRET não definido no .env.');
  return valor;
}

const assinarToken = (payload) => jwt.sign(payload, segredo(), { expiresIn: '1d' });
const verificarToken = (token) => jwt.verify(token, segredo());

module.exports = { assinarToken, verificarToken };
