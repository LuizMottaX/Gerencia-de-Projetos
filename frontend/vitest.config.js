import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.js';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      // `npm run test:coverage` — métrica M04 do plano de qualidade.
      coverage: {
        provider: 'v8',
        include: ['src/**/*.{js,vue}'],
        reporter: ['text-summary', 'html'],
      },
    },
  }),
);
