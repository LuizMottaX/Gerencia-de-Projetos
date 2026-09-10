# Plano de Implementação — o que falta

Documento vivo. Complementa o roadmap de 7 fases; aqui ficam **apenas as
entregas pendentes**, com critérios de aceitação e dependências.

Última atualização: 28/08/2026

---

## Situação atual

| Fase | Status |
|------|--------|
| **F0** Fundação técnica | 🟡 parcial (falta lint, testes e CI) |
| **F1** Persistência — PostgreSQL + Prisma | ✅ concluída |
| **F2** Catálogo de peças e acessórios | ✅ concluída |
| **F3** Carrinho e checkout | ⬜ não iniciada |
| **F4** Serviços e agendamento | ⬜ não iniciada |
| **F5** Área administrativa | ⬜ não iniciada |
| **F6** Qualidade e publicação | ⬜ não iniciada |

Já implementado da F0: estrutura em `backend/src/`, `.env.example`,
`helmet` + `express-rate-limit`, validação com `zod`, rota 404 (JSON no
backend e `/:pathMatch(.*)*` no Vue Router), formulário de contato agora
posta em `POST /api/contato`, imagens servidas localmente de
`frontend/public/`.

---

## Contexto para uma nova sessão

Leia isto antes de mexer no código — as convenções abaixo já estão
espalhadas pelo projeto e código novo deve segui-las.

### Stack

- **Frontend** `frontend/` — Vue 3 (`<script setup>`), Vite, Vue Router,
  Pinia, `lucide-vue-next` (ícones). CSS vanilla, tema "Carbon & Racing
  Red" em `src/assets/style.css`.
- **Backend** `backend/` — Node + Express (CommonJS, `require`), Prisma
  ORM, `zod`, `helmet`, `express-rate-limit`, `dotenv`.
- **Banco** — PostgreSQL 18 hospedado no **Coolify** (Hetzner).

### Como rodar

```bash
# backend  (porta 3001)
cd backend && npm install && npm run dev
# frontend (porta 5173) — em outro terminal
cd frontend && npm install && npm run dev
```

- A `DATABASE_URL` fica em **`backend/.env`** (git-ignorado). Já está
  configurada apontando para o Coolify. `backend/.env.example` tem o
  formato.
- Scripts de banco: `npm run db:migrate` (= `prisma migrate dev`),
  `db:seed`, `db:reset`, `db:studio`.
- O frontend usa o **proxy do Vite** (`/api` → `localhost:3001`), então
  não há config de CORS em dev.

### ⚠️ Gotchas (coisas que já morderam)

- **Banco no Coolify: porta `5433`.** A porta `5432` do mesmo host é um
  **MariaDB** não relacionado — apontar o Prisma pra lá dá o erro
  `invalid response to SSL negotiation: Z`. O servidor não tem TLS
  (responde `N`); se algum cliente exigir SSL, use `?sslmode=disable`.
- **Imagens externas não podem ser hotlink.** A OLX (e provavelmente
  outros) devolve **403** quando o navegador manda o header `Referer`.
  Por isso as fotos dos carros e as imagens de categoria dos produtos
  foram **baixadas para `frontend/public/`** (`carros/<slug>-N.jpg`,
  `produtos/<categoria-slug>.jpg`). Novas imagens: baixar, não linkar.
- `prisma migrate dev` precisa criar um shadow database — funciona porque
  o usuário `postgres` do Coolify é superuser. Se trocar de usuário,
  configure `shadowDatabaseUrl`.
- Aviso `The configuration property package.json#prisma is deprecated` —
  esperado, some no Prisma 7 (ver dívidas técnicas).
- `npm audit` no backend acusa 3 "high" em `deepmerge-ts` — é
  dependência **só da CLI do Prisma** (devDependency), não afeta runtime.

### Convenções — Backend

- **Rotas** em `backend/src/routes/*.js`, montadas no `server.js`. Cada
  arquivo exporta um `Router` (ou uma fábrica, como
  `produtoRotas.js → criarRotasProduto(tipo)`).
- **Serializers** em `backend/src/lib/*View.js` (`carroView`,
  `produtoView`). **Regra de ouro:** eles convertem a linha do Prisma
  para o JSON que o frontend já espera. Se mudar o shape de resposta,
  atualize a view do frontend junto — hoje o front depende de:
  - `carro.id` = **slug** (não o id numérico), `precoFormatado`,
    `quilometragem` como string ("114.000 km"), `imagemCapa`, `imagens[]`,
    `formasPagamento[]`, `modeloSlug`.
  - `produto.id` = slug, `precoFormatado`, `disponivel`, `tipo`
    ("peca"|"acessorio"), `categoria {nome,slug}`, `compativelCom[]`.
- **Dinheiro em centavos**: colunas `*Centavos Int`. A formatação
  (`Intl.NumberFormat 'pt-BR'`) fica no serializer.
- **Cliente Prisma**: `require('../lib/prisma')` — singleton, não
  instanciar `new PrismaClient()` de novo.
- **Validação**: `zod` no handler; o middleware `src/middleware/errors.js`
  converte `ZodError` em 400 com `{ erro, detalhes: [{campo, mensagem}] }`.
- **Erros**: `next(err)` nos `catch`; nunca `res.status(500)` manual.
- **Novos domínios** seguem o padrão REST `/api/<entidade>` e reusam:
  rota fina → consulta Prisma → serializer → `res.json`.

### Convenções — Frontend

- **Chamadas de API** só via `src/api/index.js` (objeto `api`). Ele já
  trata erro de rede, parse e status; lança `Error` com `.status` e
  `.detalhes`. Não usar `fetch` solto nas views (exceção histórica:
  `CarroDetalheView` ainda tem um `fetch` direto para o carro — pode
  migrar).
- **Estado compartilhado** → store Pinia em `src/stores/`. Hoje só
  `catalogo` (cache de categorias e modelos). Carrinho e auth entram como
  novas stores.
- **Lógica reutilizável de tela** → composable em `src/composables/`
  (ex.: `useProdutos(fetcher, filtros)` faz fetch + debounce + corrida de
  requisições).
- **Ícones**: `lucide-vue-next`, **nunca emoji**. `import { Nome } from
  'lucide-vue-next'` e `<Nome :size="N" />`. Em texto/botão, o alinhamento
  já vem do `.btn` e `.section-banner h1` (viraram `inline-flex` no CSS
  global) e da regra global `.lucide`.
- **Banner de página**: use a estrutura
  `<div class="section-banner"><h1><Icone :size="26" /> Título</h1>
  <p class="banner-sub">…</p></div>` (classes globais).
- **Rotas**: novas telas em `src/router/index.js` com
  `meta: { title }`. Detalhe de produto usa `meta: { tipo: 'peca' |
  'acessorio' }` (a `ProdutoDetalheView` é compartilhada).
- **Cards de produto**: `CardProduto` (grid) e `CatalogoProdutos`
  (barra de filtros + grid + estados) já existem e são reutilizáveis.
- **404**: catch-all `/:pathMatch(.*)*` → `NaoEncontradoView`.

### Modelo de dados atual (resumo)

`Marca` 1─N `Carro` 1─N `CarroImagem`; `Carro` N─1 `ModeloVeiculo`
(opcional). `Categoria` (tipada por `TipoProduto`) 1─N `Produto`.
`Produto` N─N `ModeloVeiculo` via `ProdutoCompatibilidade`. `Produto` é
**unificado**: peça e acessório na mesma tabela, distinguidos pelo enum
`TipoProduto` (`PECA` | `ACESSORIO`). `MensagemContato` isolada.
Schema completo em `backend/prisma/schema.prisma`. Duas migrações
aplicadas (`..._init`, `..._pecas_acessorios`).

### Mapa de arquivos-chave

```
backend/
  server.js                     wiring: middlewares + rotas + erros
  prisma/schema.prisma          modelo de dados
  prisma/seed.js + seed/*.js    dados iniciais (idempotente, upsert por slug)
  src/lib/prisma.js             cliente singleton
  src/lib/carroView.js          serializer de Carro
  src/lib/produtoView.js        serializer de Produto
  src/lib/listarProdutos.js     query de listagem com filtros (peças/acessórios)
  src/routes/carros.js          /api/carros, /:id, /:id/pecas
  src/routes/produtoRotas.js    fábrica p/ /api/pecas e /api/acessorios
  src/routes/catalogo.js        /api/categorias, /api/modelos
  src/routes/contato.js         POST /api/contato
  src/middleware/errors.js      naoEncontrado + tratarErro
frontend/src/
  api/index.js                  cliente HTTP (objeto `api`)
  stores/catalogo.js            Pinia: cache de categorias/modelos
  composables/useProdutos.js    fetch + filtros + debounce
  components/CardProduto.vue    card de peça/acessório
  components/CatalogoProdutos.vue  filtros + grid + estados (usado por Pecas/Acessorios View)
  views/PecasView / AcessoriosView / ProdutoDetalheView / NaoEncontradoView
  router/index.js               rotas
public/carros/  public/produtos/   imagens locais
```

### Estado do Git

- Branch `main`, sincronizada com `origin/main`
  (`github.com/LuizMottaX/Gerencia-de-Projetos`).
- Últimos commits: `69f8e5a` (imagens) → `cb14f25` (backend F1+F2) →
  `72f8ffd` (frontend F2 + ícones + vídeos) → `5d7b885` (README).
- O dono do repo é o Luiz; o Alex é revisor. Push direto pode exigir
  acesso de collaborator.

---

## F0 — Fechar a fundação técnica

**Objetivo:** ter rede de segurança (lint + testes + CI) antes de crescer.
**Depende de:** nada. **Estimativa:** ~1 semana.

### Entregas

- [ ] ESLint + Prettier + `.editorconfig` nos dois pacotes; script
      `npm run lint` (e `lint:fix`).
- [ ] Backend: Vitest + Supertest. Testes mínimos:
  - `GET /api/carros` retorna 200 e uma lista.
  - `GET /api/carros/:id` retorna 404 para slug inexistente.
  - `GET /api/pecas?modelo=<slug>` filtra por compatibilidade.
  - `POST /api/contato` com corpo inválido retorna 400 com `detalhes`.
- [ ] Frontend: Vitest + `@vue/test-utils`. Testes mínimos:
  - `CardProduto` renderiza nome, preço e a rota correta por `tipo`.
  - `useProdutos` chama o fetcher e popula `itens`.
- [ ] Banco de teste isolado para o backend (outra `DATABASE_URL` ou
      schema `test`); script `db:test:reset`.
- [ ] GitHub Actions: workflow que roda `lint`, `test` e `build` em cada
      push e PR. Serviço `postgres` no runner para os testes de integração.
- [ ] `LICENSE` (MIT) e `CHANGELOG.md`.

### Pronto quando

- `npm run lint` e `npm test` passam localmente e no CI nos dois pacotes.
- Abrir um PR dispara o workflow e ele bloqueia merge se algo falhar.

---

## F3 — Carrinho e checkout

**Objetivo:** transformar o catálogo de peças/acessórios em algo
transacionável. **Sem gateway de pagamento** — o checkout gera um pedido e
um resumo para contato. **Depende de:** F2. **Estimativa:** ~1–2 semanas.

### Modelagem (novos modelos no `schema.prisma`)

```
Pedido
  id            Int      @id @default(autoincrement())
  codigo        String   @unique   // curto, para o cliente acompanhar
  status        StatusPedido @default(RECEBIDO)
  totalCentavos Int
  cliente       Cliente  @relation(...)
  clienteId     Int
  itens         PedidoItem[]
  criadoEm      DateTime @default(now())

PedidoItem
  id           Int     @id @default(autoincrement())
  pedido       Pedido  @relation(..., onDelete: Cascade)
  pedidoId     Int
  produto      Produto @relation(...)
  produtoId    Int
  quantidade   Int
  precoUnitCentavos Int   // congelado no momento do pedido

Cliente
  id       Int    @id @default(autoincrement())
  nome     String
  email    String @unique
  telefone String
  pedidos  Pedido[]
  // agendamentos Agendamento[]  (F4)

enum StatusPedido { RECEBIDO EM_SEPARACAO PRONTO ENTREGUE CANCELADO }
```

### Backend

- [ ] `POST /api/pedidos` — corpo: `{ cliente: {...}, itens: [{ produtoId, quantidade }] }`.
  - Valida com `zod`.
  - `upsert` do `Cliente` por e-mail.
  - Em **uma transação** (`prisma.$transaction`): confere estoque de cada
    item, recalcula `precoUnitCentavos` e `totalCentavos` **no servidor**
    (nunca confia no preço enviado), cria `Pedido` + `PedidoItem`,
    decrementa `Produto.estoque`.
  - Retorna `{ codigo }`.
- [ ] `GET /api/pedidos/:codigo` — pedido + itens (para a tela de
      acompanhamento).
- [ ] Estoque insuficiente → 409 com mensagem clara (qual item, quanto há).

### Frontend

- [ ] Store Pinia `carrinho`: `adicionar`, `remover`, `alterarQuantidade`,
      getters `subtotal` e `quantidadeTotal`. Persistência em
      `localStorage` (try/catch).
- [ ] Botão "Adicionar ao carrinho" em `CardProduto` e `ProdutoDetalheView`
      (desabilitado quando `!disponivel`).
- [ ] Mini-carrinho no `AppHeader` (ícone `ShoppingCart` do lucide +
      contador).
- [ ] `CarrinhoView` (`/carrinho`): lista, ajuste de quantidade, subtotal,
      botão "Finalizar".
- [ ] `CheckoutView` (`/checkout`): formulário de cliente (nome, e-mail,
      telefone) + revisão; ao enviar chama `POST /api/pedidos`.
- [ ] `PedidoView` (`/pedido/:codigo`): confirmação + status + itens +
      botão WhatsApp com o resumo.
- [ ] Limpar o carrinho após pedido criado.

### Pronto quando

- Fluxo completo: adicionar peça → carrinho → checkout → pedido criado →
  tela de acompanhamento com o código.
- Comprar além do estoque é bloqueado com mensagem específica.
- Recarregar a página no meio da compra não perde o carrinho.
- Dois pedidos simultâneos do mesmo item não deixam o estoque negativo
  (teste de concorrência).

---

## F4 — Serviços e agendamento

**Objetivo:** catálogo de serviços de manutenção + reserva de horário.
**Depende de:** F1 (F2 recomendada — reusa o padrão de rotas/serializer).
**Estimativa:** ~2 semanas.

### Modelagem

```
Servico
  id            Int    @id @default(autoincrement())
  slug          String @unique
  nome          String
  descricao     String
  precoBaseCentavos Int
  duracaoMin    Int          // usado para calcular os horários livres
  ativo         Boolean @default(true)
  agendamentos  Agendamento[]

Agendamento
  id                Int      @id @default(autoincrement())
  codigo            String   @unique
  servico           Servico  @relation(...)
  servicoId         Int
  cliente           Cliente  @relation(...)
  clienteId         Int
  veiculoDescricao  String   // texto livre: "Gol 2020, placa ABC-1234"
  dataHora          DateTime
  status            StatusAgendamento @default(SOLICITADO)
  criadoEm          DateTime @default(now())

  @@unique([servicoId, dataHora])   // trava de horário

enum StatusAgendamento { SOLICITADO CONFIRMADO CONCLUIDO CANCELADO }
```

Config da agenda (constante ou tabela simples): dias e horário de
funcionamento (ex.: seg–sex 08:00–18:00), granularidade de 30 min.

### Backend

- [ ] `GET /api/servicos` e `GET /api/servicos/:slug`.
- [ ] `GET /api/agendamentos/disponibilidade?servico=<slug>&data=<YYYY-MM-DD>`
      — gera os slots do dia a partir do horário de funcionamento e da
      `duracaoMin`, remove os já ocupados, retorna os livres.
- [ ] `POST /api/agendamentos` — `zod` + `upsert` do cliente + criação
      dentro de transação; a constraint `@@unique([servicoId, dataHora])`
      garante que dois não peguem o mesmo horário (capturar o erro P2002 →
      409 "horário indisponível").
- [ ] `GET /api/agendamentos/:codigo`.
- [ ] (Opcional) e-mail de confirmação com `nodemailer` — se não der,
      deixar só o registro para o painel da F5.

### Frontend

- [ ] `ServicosView` (`/servicos`) — cards de serviço com preço e duração.
- [ ] `AgendamentoView` (`/agendar/:servicoSlug`): escolher data →
      carregar slots → escolher horário → dados do cliente + veículo →
      confirmar.
- [ ] `AgendamentoConfirmadoView` (`/agendamento/:codigo`).
- [ ] Links no `AppHeader` e na Home.
- [ ] Seed com ~5 serviços (troca de óleo, alinhamento, revisão dos
      freios, ar-condicionado, revisão completa).

### Pronto quando

- Um visitante escolhe um serviço, vê **horários realmente livres** e
  reserva um.
- Dois agendamentos não conseguem ocupar o mesmo horário (teste).
- A tela de confirmação mostra o código do agendamento.

---

## F5 — Área administrativa

**Objetivo:** a loja gerencia catálogo, pedidos e agendamentos sem editar
código ou `seed`. **Depende de:** F2–F4. **Estimativa:** ~2 semanas.

### Modelagem

```
Usuario
  id        Int    @id @default(autoincrement())
  email     String @unique
  senhaHash String
  nome      String
  papel     PapelUsuario @default(ADMIN)
  criadoEm  DateTime @default(now())

enum PapelUsuario { ADMIN }
```

### Backend

- [ ] Auth: `POST /api/auth/login` (bcrypt + JWT), middleware
      `requireAdmin` que valida o `Authorization: Bearer`.
- [ ] Script `create-admin` (cria o primeiro usuário via CLI/prompt).
- [ ] CRUD **protegido** (POST/PUT/DELETE) para: `carros` (+ imagens),
      `marcas`, `modelos`, `produtos` (peças/acessórios), `categorias`,
      `servicos`.
- [ ] `PATCH /api/pedidos/:codigo/status` e
      `PATCH /api/agendamentos/:codigo/status`.
- [ ] `GET /api/admin/mensagens` (lista `MensagemContato`, marcar como lida).
- [ ] Upload de imagem: `multer` gravando em `frontend/public/uploads/`
      (ou storage externo depois); endpoint devolve a URL.

### Frontend

- [ ] Layout `/admin` com guard de rota (checa token no `localStorage`).
- [ ] `AdminLoginView`.
- [ ] Telas de lista + formulário para cada entidade.
- [ ] Fila de pedidos (com troca de status) e agenda de serviços.
- [ ] Caixa de entrada de mensagens de contato.
- [ ] `AdminDashboard`: nº de veículos disponíveis, pedidos do mês,
      próximos agendamentos, itens com estoque baixo.
- [ ] Store Pinia `auth` (token, usuário, `login`, `logout`); interceptor
      no cliente `src/api` que injeta o `Bearer` e trata 401 → redireciona
      para o login.

### Pronto quando

- Um admin logado cadastra um veículo novo (com foto) e ele aparece no
  site público.
- Rotas de escrita retornam 401 sem token válido (teste).
- É possível mudar o status de um pedido e de um agendamento pelo painel.

---

## F6 — Qualidade e publicação

**Objetivo:** fechar o produto e ter um ambiente público para a
apresentação. **Depende de:** tudo. **Estimativa:** ~1 semana.

### Entregas

- [ ] Testes E2E com Playwright cobrindo os fluxos principais:
  - catálogo → carrinho → checkout → pedido criado;
  - escolher serviço → agendar → confirmação;
  - login admin → editar um produto.
- [ ] Auditoria Lighthouse: acessibilidade e performance ≥ 90. Corrigir
      `alt` de imagens, foco visível, contraste, `lang`, ordem de headings.
- [ ] `loading="lazy"` nas imagens de card; dimensões explícitas para
      evitar layout shift.
- [ ] Meta tags / Open Graph por rota; `sitemap.xml` e `robots.txt`.
- [ ] `GET /health` já existe — adicionar logs estruturados e um
      `GET /api/version`.
- [ ] Deploy:
  - Frontend → Vercel ou Netlify (build do Vite, variável de API se
    separar domínios).
  - Backend → Railway ou Render; rodar `prisma migrate deploy` no deploy.
  - Banco → o PostgreSQL do Coolify já existe (porta 5433).
  - Configurar CORS do backend para o domínio real do frontend.
- [ ] README reescrito refletindo o sistema final; instruções de deploy.

### Pronto quando

- Existe uma URL pública que qualquer avaliador abre e usa sem instalar
  nada.
- O CI roda unit + E2E e bloqueia merge com falha.
- Um dev novo sobe o projeto seguindo só o README.

---

## Dívidas técnicas (encaixar entre as fases)

- [ ] `CarrosView` e `NoticiasView` ainda repetem o CSS de card — extrair
      para `CardProduto`/um card genérico.
- [ ] Produtos compartilham a imagem da categoria (todo "Elétrica" mostra
      a mesma bateria). Dar `imagemUrl` própria por item no
      `catalogo.js` quando houver foto real, ou no CRUD da F5.
- [ ] Swagger/OpenAPI em `/api/docs` (`swagger-ui-express`) — ficou de
      fora da F2.
- [ ] Migrar de `package.json#prisma` para `prisma.config.ts` antes do
      Prisma 7 (hoje só emite aviso).
- [ ] `npm audit`: 3 "high" em `deepmerge-ts`, dependência apenas da CLI
      do Prisma (devDependency) — reavaliar quando o Prisma corrigir.
- [ ] Footer com "© 2023" — usar o ano corrente.
- [ ] WhatsApp e Instagram no código são de conta pessoal — trocar por
      dados oficiais da concessionária (ou deixar claro que é fictício).
- [ ] `combustivel` e `cambio` do `Carro` são `String` — podem virar
      `enum` como o `status`.

---

## Entregável da disciplina (docs/gerenciamento/)

Hoje as 5 pastas têm só a **descrição genérica** de cada grupo de
processos do PMBOK. Falta o conteúdo real do projeto:

| Grupo | Artefato a produzir | Fonte |
|-------|--------------------|-------|
| Iniciação | Termo de Abertura; registro de partes interessadas | escopo deste plano + papéis do README |
| Planejamento | Declaração de escopo, EAP, cronograma, plano de riscos, estimativa de horas | EAP = fases F0–F6 decompostas; riscos na tabela do roadmap |
| Execução | Registro de trabalho, atas, controle de versão | 1 PR por entrega; checklist "Entregas" de cada fase |
| Monitoramento e Controle | Critérios de aceitação, controle de mudanças, progresso | blocos "Pronto quando"; % de entregas concluídas por fase |
| Encerramento | Termo de encerramento, lições aprendidas | F6 (deploy + README) é a entrega formal |

Recomendação: substituir cada `docs/gerenciamento/*/README.md` pelo
artefato correspondente, preenchido com os dados deste plano.

---

## Ordem sugerida

1. **Fechar a F0** — lint + testes + CI. Rápido e destrava o resto.
2. **F3 (carrinho)** — completa a tese do "ecossistema" e é demonstrável.
3. **Preencher os docs de gerência de projeto** (em paralelo, pelos
   revisores).
4. **F4 → F5 → F6** conforme o tempo do semestre. Se o prazo apertar:
   entregar F4 como protótipo de tela e manter a gestão via Prisma Studio
   no lugar da F5 completa.
