// Os testes de integração usam um banco PostgreSQL próprio, definido em
// backend/.env.test (local) ou nas variáveis de ambiente (CI). Nunca o .env de dev.
import os from 'node:os';
import path from 'node:path';
import { config } from 'dotenv';

config({ path: '.env.test', override: true, quiet: true });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL de teste não definida. Copie .env.test.example para .env.test.');
}
process.env.JWT_SECRET ||= 'segredo-de-teste';
// Uploads dos testes vão para uma pasta temporária, nunca para backend/uploads.
process.env.UPLOAD_DIR ||= path.join(os.tmpdir(), 'chiquinho-uploads-teste');
