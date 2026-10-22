# Changelog

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/).

## [Não lançado]

### Adicionado
- **Qualidade (PMBOK 8.1–8.3)** — plano de gerenciamento da qualidade, auditoria de processos e relatório de controle em `docs/gerenciamento/`; cobertura de testes (`npm run test:coverage`) no backend e no frontend; `npm audit` de produção no CI; template de Pull Request com a definição de pronto.
- **F6** — Testes E2E (Playwright, desktop e celular) no CI; Lighthouse 100 em acessibilidade, SEO e boas práticas, performance 95–98 no celular; fonte Roboto local com preload e fonte reserva ajustada; imagens otimizadas (Home em WebP com `srcset`, `loading="lazy"`); favicon; Open Graph, descrição por rota, `robots.txt` e `sitemap.xml`; `GET /api/version`, `/health` com checagem do banco e logs estruturados em JSON; `TRUST_PROXY` e `CORS_ORIGIN`; Dockerfiles (API e site com nginx), `vercel.json` e `docs/DEPLOY.md`; README reescrito.
- **F5** — Painel administrativo completo: CRUD protegido em `/api/admin/*` (veículos com fotos, peças/acessórios com compatibilidade, serviços, categorias, marcas, modelos); upload de imagens (`multer`, JPG/PNG/WebP até 5 MB, servidas em `/uploads`); fila de pedidos com troca de status (cancelar devolve o estoque); agenda da oficina (cancelar libera o horário); caixa de mensagens; dashboard com indicadores; script `npm run admin:criar`; cliente HTTP injeta o token e trata 401 voltando ao login.
- **F4** — Serviços e agendamento: modelos `Servico` e `Agendamento` (trava `@@unique([servicoId, dataHora])`); `GET /api/servicos`, `GET /api/agendamentos/disponibilidade` (grade no passo da duração, fuso de Sinop–MT, 1h de antecedência, 60 dias à frente), `POST /api/agendamentos` (409 se o horário foi tomado) e `GET /api/agendamentos/:codigo`; seed com 5 serviços; telas Serviços, Agendar e Confirmação; link no header e na Home.
- **F3** — Carrinho e checkout: modelos `Cliente`, `Pedido`, `PedidoItem`; `POST /api/pedidos` (transação com baixa condicional de estoque, preço recalculado no servidor, 409 se faltar estoque) e `GET /api/pedidos/:codigo`; store `carrinho` persistida; botão "Adicionar ao carrinho", mini-carrinho no header e telas Carrinho, Checkout e Pedido (com resumo para WhatsApp).
- **F0** — ESLint + Prettier + `.editorconfig` no backend e no frontend (`npm run lint`, `lint:fix`, `format`).
- **F0** — Testes: Vitest + Supertest no backend (API, com banco PostgreSQL isolado) e Vitest + `@vue/test-utils` no frontend.
- **F0** — Workflow de CI no GitHub Actions: lint, formatação, testes e build em cada push e PR.
- **F0** — `LICENSE` (MIT) e este `CHANGELOG.md`.
- **F5** — Autenticação do painel admin: modelo `Administrador`, login com bcrypt + JWT, rotas protegidas, telas de login e dashboard.
- Artefatos PMBOK de Integração e Escopo em `docs/gerenciamento/`.

### Segurança
- Dependências atualizadas sem quebra de versão: `proxy-addr` (crítica — falsificação de IP), `qs`, `body-parser`, `express` e `vue`.

### Alterado
- Link do painel admin saiu do menu e virou ícone no topo, ao lado do carrinho.
- Contraste de textos cinza e ordem de títulos corrigidos (acessibilidade).
- Agenda: trava de horário passou para `@@unique([servicoId, horarioAtivo])` — agendamento cancelado libera o horário.
- Erros do Prisma mapeados para HTTP: registro inexistente → 404, em uso/duplicado → 409.
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
