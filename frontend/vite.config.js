import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

// Em dev o backend roda na 3001; os testes E2E sobem outro na 3101 e apontam
// o proxy para ele com API_PROXY_TARGET.
const API = process.env.API_PROXY_TARGET || 'http://localhost:3001';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    proxy: {
      // Redireciona chamadas /api para o backend Node.js
      '/api': {
        target: API,
        changeOrigin: true,
      },
      // Imagens enviadas pelo painel admin (servidas pelo backend)
      '/uploads': {
        target: API,
        changeOrigin: true,
      },
    },
  },
});
