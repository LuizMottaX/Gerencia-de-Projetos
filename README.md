# 🚗 Chiquinho Motors®

Site da concessionária **Chiquinho Motors®**, desenvolvido com **Vue 3 + Vite** no frontend e **Node.js + Express** no backend, utilizando banco de dados **PostgreSQL**.

O sistema atua como um ecossistema completo abrangendo:
- 🚗 **Veículos**
- ⚙️ **Auto-peças**
- 🏎️ **Acessórios**
- 🔧 **Serviços de Manutenção**

---

## 📁 Estrutura do Projeto

```
INVENTARIO-CONCESSIONARIA/
├── backend/                  # API REST Node.js
│   ├── prisma/               # Schema do banco (schema.prisma), migrations e seed
│   ├── src/lib/              # Cliente Prisma e serializadores
│   ├── server.js             # Servidor Express
│   ├── .env                  # DATABASE_URL (não versionado)
│   └── package.json
└── frontend/                 # SPA Vue 3
    ├── src/
│   │   ├── api/              # Cliente HTTP da API
│   │   ├── assets/           # CSS global
│   │   ├── components/       # Componentes reutilizáveis
│   │   ├── composables/      # Lógica reutilizável (useProdutos…)
│   │   ├── router/           # Vue Router
│   │   ├── stores/           # Estado global (Pinia)
│   │   └── views/            # Páginas da aplicação
    ├── vite.config.js
    └── package.json
```

---

## ✅ Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- npm v9 ou superior
- [PostgreSQL](https://www.postgresql.org/) v14 ou superior

---

## 🚀 Como iniciar

O projeto possui **dois servidores** que devem rodar simultaneamente: o backend (API) e o frontend (Vue).

### 1. Backend — API REST (porta 3001)

```bash
cd backend
npm install

# Configure o banco: copie o exemplo e ajuste a DATABASE_URL
cp .env.example .env

# Cria as tabelas e popula o catálogo inicial de veículos
npx prisma migrate dev
npx prisma db seed          # (migrate dev já roda o seed na 1ª vez)

npm start
```

> A API estará disponível em: `http://localhost:3001`
> Para inspecionar o banco visualmente: `npm run db:studio`

### 2. Frontend — Vue 3 (porta 5173)

Abra um **novo terminal** e execute:

```bash
cd frontend
npm install
npm run dev
```

> O site estará disponível em: `http://localhost:5173`

---

## 🌐 Endpoints da API

| Método | Rota                     | Descrição                                              |
|--------|--------------------------|-------------------------------------------------------|
| GET    | `/api/carros`            | Lista todos os veículos                               |
| GET    | `/api/carros/:id`        | Detalhes de um veículo (por slug)                     |
| GET    | `/api/carros/:id/pecas`  | Peças compatíveis com o modelo do veículo             |
| GET    | `/api/pecas`             | Catálogo de peças. Filtros: `categoria`, `modelo`, `busca`, `precoMin`, `precoMax`, `ordenar` |
| GET    | `/api/pecas/:id`         | Detalhes de uma peça (por slug)                       |
| GET    | `/api/acessorios`        | Catálogo de acessórios (mesmos filtros de `/api/pecas`) |
| GET    | `/api/acessorios/:id`    | Detalhes de um acessório (por slug)                   |
| GET    | `/api/categorias`        | Categorias do catálogo (`?tipo=peca` \| `acessorio`) |
| GET    | `/api/modelos`           | Modelos de veículo (para o filtro de compatibilidade) |
| POST   | `/api/contato`           | Registra uma mensagem do formulário de contato        |
| GET    | `/api/servicos`          | Serviços de manutenção (planejado — F4)               |

---

## 🛠️ Tecnologias Recomendadas e Utilizadas

| Camada    | Tecnologia               |
|-----------|--------------------------|
| Frontend  | Vue 3, Vite, Vue Router, Pinia |
| Backend   | Node.js, Express, Zod, Helmet |
| Banco     | PostgreSQL + Prisma ORM   |
| Estilo    | CSS Vanilla, Google Fonts|

---

## 📋 Plano de Implementação e Evolução

O projeto está expandindo de um simples inventário para uma solução robusta de gestão automotiva:

1. **Estruturação Base (Concluída):** SPA isolada em camadas claras (`frontend` e `backend`).
2. **Expansão de Domínio (Em Andamento):** Inclusão de novas entidades de negócios. O sistema não listará apenas veículos, mas também auto-peças, acessórios e a possibilidade de visualizar e agendar serviços de manutenção.
3. **Migração para PostgreSQL (Em Andamento):**
   - Feito: veículos, marcas e imagens agora vivem no PostgreSQL via **Prisma ORM** (`backend/prisma/schema.prisma`). O mock em memória (`backend/data/`) foi removido.
   - A seguir: modelar peças, acessórios e serviços, com as relações de compatibilidade (quais peças servem em quais modelos).
4. **Refinamento da Interface (Planejado):** Construção de novas views no Vue 3 focadas em carrinho de compras para peças e painel de agendamento de serviços.

---

## 📝 Observações

- **🤖 Para Agentes de IA:** Leia obrigatoriamente o arquivo `AGENTS.md` na raiz do repositório antes de propor ou realizar qualquer modificação no código.
- O frontend usa o **proxy do Vite** para redirecionar chamadas `/api/*` ao backend em desenvolvimento, evitando a necessidade de configuração manual de CORS.
- O catálogo de veículos é servido do PostgreSQL. A `DATABASE_URL` fica em `backend/.env` (veja `backend/.env.example`) e o catálogo inicial é carregado por `npx prisma db seed`.

---

Desenvolvido por **Francisco de Julio Faria**
Revisado por **Luiz Henrique Mota**
Revisado por **Alex Pablo de Oliveira Moraes**
