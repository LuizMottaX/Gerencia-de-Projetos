# Changelog

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/).

## [Não lançado]

### Adicionado
- **F3** — Carrinho e checkout: modelos `Cliente`, `Pedido`, `PedidoItem`; `POST /api/pedidos` (transação com baixa condicional de estoque, preço recalculado no servidor, 409 se faltar estoque) e `GET /api/pedidos/:codigo`; store `carrinho` persistida; botão "Adicionar ao carrinho", mini-carrinho no header e telas Carrinho, Checkout e Pedido (com resumo para WhatsApp).
- **F0** — ESLint + Prettier + `.editorconfig` no backend e no frontend (`npm run lint`, `lint:fix`, `format`).
- **F0** — Testes: Vitest + Supertest no backend (API, com banco PostgreSQL isolado) e Vitest + `@vue/test-utils` no frontend.
- **F0** — Workflow de CI no GitHub Actions: lint, formatação, testes e build em cada push e PR.
- **F0** — `LICENSE` (MIT) e este `CHANGELOG.md`.
- **F5** — Autenticação do painel admin: modelo `Administrador`, login com bcrypt + JWT, rotas protegidas, telas de login e dashboard.
- Artefatos PMBOK de Integração e Escopo em `docs/gerenciamento/`.

### Alterado
- Backend: `app.js` (aplicação) separado de `server.js` (porta) para permitir testes.
- `JWT_SECRET` agora é obrigatório; o admin do seed vem de `ADMIN_EMAIL`/`ADMIN_SENHA`.

## [0.2.0] — 2026-08-27

### Adicionado
- **F1** — Persistência em PostgreSQL com Prisma (veículos, marcas, imagens).
- **F2** — Catálogo de peças e acessórios com compatibilidade por modelo de veículo.
- Telas de peças e acessórios com Pinia e ícones Lucide; imagens servidas localmente.

## [0.1.0] — 2026-08-14

### Adicionado
- Refatoração para Vue 3 + Vite e Node.js + Express.
- Tema "Carbon & Racing Red" e layout responsivo.
