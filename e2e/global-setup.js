import { execFileSync } from 'node:child_process';
import { ADMIN } from './playwright.config.js';

// Garante o admin dos testes usando o próprio script do projeto.
export default function globalSetup() {
  execFileSync('node', ['scripts/criar-admin.js', ADMIN.email, 'Admin E2E'], {
    cwd: '../backend',
    stdio: 'inherit',
    env: {
      ...process.env,
      DATABASE_URL:
        process.env.E2E_DATABASE_URL ||
        'postgresql://postgres:postgres@localhost:55432/chiquinho_test',
      ADMIN_SENHA: ADMIN.senha,
    },
  });
}
