// Cria (ou reativa e troca a senha de) um administrador do painel.
//
//   ADMIN_SENHA='uma-senha-forte' npm run admin:criar -- admin@loja.com.br "Nome do Admin"
//
// A senha vem da variável de ambiente para não ficar no histórico do shell
// como argumento.

require('dotenv').config();
const bcrypt = require('bcryptjs');
const prisma = require('../src/lib/prisma');

async function main() {
  const [email, nome = 'Administrador'] = process.argv.slice(2);
  const senha = process.env.ADMIN_SENHA;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Uso: ADMIN_SENHA=... npm run admin:criar -- <email> [nome]');
  }
  if (!senha || senha.length < 8) {
    throw new Error('Defina ADMIN_SENHA com pelo menos 8 caracteres.');
  }

  const senhaHash = await bcrypt.hash(senha, 10);
  const admin = await prisma.administrador.upsert({
    where: { email },
    update: { nome, senha: senhaHash, ativo: true },
    create: { nome, email, senha: senhaHash },
  });
  console.log(`✔ Administrador ${admin.email} pronto.`);
}

main()
  .catch((err) => {
    console.error(`❌  ${err.message}`);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
