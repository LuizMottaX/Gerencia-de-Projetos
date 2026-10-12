# API Chiquinho Motors® — imagem para Coolify, Railway ou Render.
FROM node:22-bookworm-slim

# O Prisma precisa do OpenSSL no runtime.
RUN apt-get update && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app
ENV NODE_ENV=production \
    PORT=3001 \
    UPLOAD_DIR=/app/uploads

# Dependências primeiro (cache de camadas). Instala também as devDependencies
# porque o `prisma migrate deploy` roda na inicialização.
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci && npm cache clean --force

COPY . .

# Fotos enviadas pelo painel: monte um volume persistente aqui.
VOLUME ["/app/uploads"]
EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s \
  CMD node -e "fetch('http://localhost:'+process.env.PORT+'/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

# Aplica migrations pendentes e sobe a API.
CMD ["npm", "run", "start:prod"]
