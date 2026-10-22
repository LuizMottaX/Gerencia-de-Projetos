import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['./tests/setup.js'],
    // Os testes compartilham um banco real — rodar arquivos em série evita interferência.
    fileParallelism: false,
    // `npm run test:coverage` — métrica M04 do plano de qualidade.
    coverage: {
      provider: 'v8',
      include: ['app.js', 'src/**/*.js'],
      reporter: ['text-summary', 'html'],
    },
  },
});
