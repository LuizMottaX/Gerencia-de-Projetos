// Os testes de integração usam um banco PostgreSQL próprio, definido em
// backend/.env.test (local) ou nas variáveis de ambiente (CI). Nunca o .env de dev.
import { config } from 'dotenv';

config({ path: '.env.test', override: true, quiet: true });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL de teste não definida. Copie .env.test.example para .env.test.');
}
process.env.JWT_SECRET ||= 'segredo-de-teste';
