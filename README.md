# 🚗 Chiquinho Motors®

Sistema da concessionária **Chiquinho Motors®** (Sinop–MT): site público com
catálogo, carrinho e agendamento online, e painel administrativo para a loja
gerenciar tudo sem mexer em código.

| Módulo | O cliente… | A loja (painel `/admin`)… |
|--------|-----------|---------------------------|
| 🚗 **Veículos** | vê fotos, ficha técnica e preço | cadastra veículos com fotos e status |
| ⚙️ **Auto-peças** | filtra pelo **modelo do próprio carro** e compra | controla preço, estoque e compatibilidade |
| 🏎️ **Acessórios** | busca, filtra e compra | idem |
| 🔧 **Serviços** | escolhe o serviço e **agenda um horário livre** | vê a agenda, confirma, conclui ou cancela |

Também: pedidos com código de acompanhamento (sem pagamento online — a loja
entra em contato), mensagens de contato e dashboard com indicadores.

> 📚 Projeto da disciplina de Gerência de Projetos — artefatos PMBOK em
> [`docs/gerenciamento/`](docs/gerenciamento/README.md); plano de entregas em
> [`plan.md`](plan.md); histórico em [`CHANGELOG.md`](CHANGELOG.md).

---

## 🧱 Arquitetura

```
frontend/  Vue 3 + Vite + Pinia (SPA)  ──/api──►  backend/  Node.js + Express  ──►  PostgreSQL (Prisma)
```

| Camada | Tecnologias |
|--------|-------------|
| Frontend | Vue 3 (`<script setup>`), Vite, Vue Router, Pinia, ícones Lucide, CSS vanilla (tema *Carbon & Racing Red*) |
| Backend | Node.js 22, Express, Prisma ORM, Zod, Helmet, rate limit, JWT + bcrypt, Multer |
| Banco | PostgreSQL 16+ (produção: Coolify/Hetzner) |
| Qualidade | ESLint, Prettier, Vitest, Supertest, Playwright, GitHub Actions |

```
backend/
  app.js · server.js         app Express (sem listen) · inicialização
  prisma/                    schema, migrations e seed
  src/routes/                rotas públicas  ·  src/routes/admin/  rotas do painel (JWT)
  src/lib/                   serializers, regras da agenda, Prisma
  scripts/criar-admin.js     cria/reativa um administrador
  tests/                     Vitest + Supertest (banco de teste isolado)
frontend/
  src/views/ · src/views/admin/   páginas do site e do painel
  src/stores/                     Pinia: carrinho, auth, catálogo
  src/api/index.js                cliente HTTP (injeta o token nas rotas /admin)
  tests/                          Vitest + @vue/test-utils
e2e/                         Playwright: fluxos completos em desktop e celular
docs/                        gerência do projeto (PMBOK) e guia de deploy
```

---

## 🚀 Rodando localmente

**Pré-requisitos:** Node.js 22+, npm 10+ e um PostgreSQL (local ou o do Coolify).

```bash
# 1. Backend — API na porta 3001
cd backend
npm install
cp .env.example .env            # preencha DATABASE_URL e JWT_SECRET
npx prisma migrate dev          # cria as tabelas
npm run db:seed                 # catálogo inicial (veículos, peças, acessórios, serviços)
ADMIN_SENHA='uma-senha-forte' npm run admin:criar -- voce@exemplo.com "Seu Nome"
npm run dev

# 2. Frontend — site na porta 5173 (outro terminal)
cd frontend
npm install
npm run dev
```

Abra `http://localhost:5173` (site) e `http://localhost:5173/admin` (painel).
O proxy do Vite repassa `/api` e `/uploads` para a porta 3001 — não há CORS em dev.

> ⚠️ No Coolify o PostgreSQL está na **porta 5433** (a 5432 do mesmo host é um MariaDB).

### Testes

Os testes de backend e E2E usam um **banco separado** — nunca o do `.env`.
O jeito mais simples é um container:

```bash
podman run -d --name chiquinho-test-db -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=chiquinho_test -p 55432:5432 postgres:16-alpine   # ou docker

cd backend  && cp .env.test.example .env.test && npm run db:test:setup
npm run lint && npm test                       # 64 testes de API
cd ../frontend && npm run lint && npm test     # 20 testes de componentes/stores
cd ../e2e && npm install && npx playwright install chromium
npm test                                       # 10 testes E2E (5 fluxos × desktop/celular)
```

O CI (`.github/workflows/ci.yml`) roda lint, formatação, testes, build e E2E em
cada push e Pull Request.

---

## 🌐 API

**Pública**

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/carros` · `/api/carros/:id` | Veículos (`:id` = slug) |
| GET | `/api/carros/:id/pecas` | Peças compatíveis com o veículo |
| GET | `/api/pecas` · `/api/acessorios` (+ `/:id`) | Catálogo. Filtros: `categoria`, `modelo`, `busca`, `precoMin`, `precoMax`, `ordenar` |
| GET | `/api/categorias` · `/api/modelos` | Dados para os filtros |
| POST | `/api/pedidos` | `{ cliente, itens: [{ produto, quantidade }] }` → código `CM-…`; 409 se faltar estoque |
| GET | `/api/pedidos/:codigo` | Acompanhamento do pedido |
| GET | `/api/servicos` (+ `/:id`) | Serviços de manutenção |
| GET | `/api/agendamentos/disponibilidade?servico=&data=AAAA-MM-DD` | Horários livres do dia |
| POST | `/api/agendamentos` | Reserva → código `AG-…`; 409 se o horário foi tomado |
| GET | `/api/agendamentos/:codigo` | Consulta do agendamento |
| POST | `/api/contato` | Mensagem do formulário de contato |
| POST | `/api/admin/auth/login` | Login do painel (devolve o JWT) |
| GET | `/api/version` · `/health` | Versão publicada · saúde (confere o banco) |

**Painel** — `/api/admin/*`, exige `Authorization: Bearer <token>`

| Método | Rota | Descrição |
|--------|------|-----------|
| GET/POST/PUT/DELETE | `carros`, `produtos`, `servicos`, `categorias`, `marcas`, `modelos` | Cadastros (`PUT`/`DELETE` em `/:id`) |
| POST | `uploads` | Imagem (campo `imagem`, JPG/PNG/WebP até 5 MB) → `{ url }` |
| GET · PATCH | `pedidos` · `pedidos/:codigo/status` | Fila de pedidos; cancelar devolve o estoque |
| GET · PATCH | `agendamentos` · `agendamentos/:codigo/status` | Agenda; cancelar libera o horário |
| GET · PATCH | `mensagens` · `mensagens/:id` | Caixa de entrada (`?lida=false`) |
| GET | `resumo` | Indicadores do dashboard |

Erros seguem `{ erro, detalhes?: [{ campo, mensagem }] }` (400 validação · 401
sem token · 404 · 409 conflito).

---

## ☁️ Publicação

Dockerfiles prontos para a API e o site (nginx), e `vercel.json` como
alternativa. Passo a passo, variáveis de ambiente e checklist em
**[`docs/DEPLOY.md`](docs/DEPLOY.md)**.

---

## 📝 Observações

- **🤖 Agentes de IA:** leiam o [`AGENTS.md`](AGENTS.md) antes de qualquer mudança.
- Dinheiro é guardado em **centavos** (`*Centavos Int`); a formatação em R$ fica nos serializers.
- Imagens novas do catálogo vão para `frontend/public/` (não fazer hotlink); fotos enviadas pelo painel ficam em `backend/uploads/` (volume persistente em produção).
- A Chiquinho Motors é uma concessionária fictícia; os dados do catálogo são ilustrativos. Foto da Home: Renato Araújo/Agência Brasil. Fonte Roboto sob licença OFL (`frontend/public/fonts/OFL.txt`).

---

Desenvolvido por **Francisco de Julio Faria** ·
Revisado por **Luiz Henrique Mota** e **Alex Pablo de Oliveira Moraes** — licença [MIT](LICENSE)
