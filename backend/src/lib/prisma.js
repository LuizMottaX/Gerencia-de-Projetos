const { PrismaClient } = require('@prisma/client');

// Cliente único para toda a aplicação. Reaproveitado entre requisições e,
// em desenvolvimento com `node --watch`, entre reinícios do processo.
const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

module.exports = prisma;
