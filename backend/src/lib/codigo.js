const crypto = require('node:crypto');

// Sem 0/O/1/I para o código ser fácil de ditar por telefone.
const ALFABETO = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

/** Código curto de acompanhamento, ex.: gerarCodigo('CM') → "CM-7K2QXP". */
function gerarCodigo(prefixo) {
  const bytes = crypto.randomBytes(6);
  return `${prefixo}-` + Array.from(bytes, (b) => ALFABETO[b % ALFABETO.length]).join('');
}

module.exports = { gerarCodigo };
