# Frontend Chiquinho Motors® — build do Vite servido pelo nginx, que também
# repassa /api e /uploads para o backend (mesmo domínio: sem CORS).
FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# URL pública do site, usada no sitemap.xml (opcional).
ARG SITE_URL
ENV SITE_URL=$SITE_URL
RUN npm run build

FROM nginx:1.27-alpine
# BACKEND_URL é lido pelo template na inicialização (ex.: http://chiquinho-api:3001).
ENV BACKEND_URL=http://backend:3001
COPY deploy/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
