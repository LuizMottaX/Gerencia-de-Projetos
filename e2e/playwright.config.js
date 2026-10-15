import { defineConfig, devices } from '@playwright/test';

// Sobe um backend e um frontend só para os testes, em portas próprias, contra
// o banco de TESTE (nunca o do .env de desenvolvimento).
const DATABASE_URL =
  process.env.E2E_DATABASE_URL || 'postgresql://postgres:postgres@localhost:55432/chiquinho_test';
const API_PORT = 3101;
const WEB_PORT = 5174;

export const ADMIN = {
  email: 'e2e-admin@chiquinhomotors.com.br',
  senha: process.env.E2E_ADMIN_SENHA || 'senha-e2e-2026',
};

export default defineConfig({
  testDir: './tests',
  fullyParallel: false, // os fluxos mexem no mesmo banco (estoque, agenda)
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  globalSetup: './global-setup.js',
  use: {
    baseURL: `http://localhost:${WEB_PORT}`,
    locale: 'pt-BR',
    timezoneId: 'America/Cuiaba',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'celular', use: { ...devices['Pixel 7'] } },
  ],
  webServer: [
    {
      command: 'node server.js',
      cwd: '../backend',
      port: API_PORT,
      reuseExistingServer: false,
      env: {
        DATABASE_URL,
        PORT: String(API_PORT),
        JWT_SECRET: 'segredo-e2e',
        NODE_ENV: 'test', // desliga o rate limit dos pedidos/agendamentos
        UPLOAD_DIR: '/tmp/chiquinho-e2e-uploads',
      },
    },
    {
      command: `npm run build && npx vite preview --port ${WEB_PORT} --strictPort`,
      cwd: '../frontend',
      port: WEB_PORT,
      reuseExistingServer: false,
      timeout: 120_000,
      env: { API_PROXY_TARGET: `http://localhost:${API_PORT}` },
    },
  ],
});
