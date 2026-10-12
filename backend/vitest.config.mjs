import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['./tests/setup.js'],
    // Os testes compartilham um banco real — rodar arquivos em série evita interferência.
    fileParallelism: false,
  },
});
