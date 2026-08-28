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
│   ├── prisma/               # Schema do banco de dados (Planejado)
│   ├── data/                 # Dados legados em memória (fase de transição)
│   ├── server.js             # Servidor Express
│   └── package.json
└── frontend/                 # SPA Vue 3
    ├── src/
│   │   ├── assets/           # CSS global
│   │   ├── components/       # Componentes reutilizáveis
│   │   ├── router/           # Vue Router
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
# Futuramente com ORM: npx prisma migrate dev
npm start
```

> A API estará disponível em: `http://localhost:3001`

### 2. Frontend — Vue 3 (porta 5173)

Abra um **novo terminal** e execute:

```bash
cd frontend
npm install
npm run dev
```

> O site estará disponível em: `http://localhost:5173`

---

## 🌐 Endpoints da API (Atuais e Planejados)

| Método | Rota                  | Descrição                        |
|--------|-----------------------|----------------------------------|
| GET    | `/api/carros`         | Lista todos os veículos          |
| GET    | `/api/carros/:id`     | Retorna detalhes de um veículo   |
| GET    | `/api/pecas`          | Catálogo de auto-peças (Novo)    |
| GET    | `/api/acessorios`     | Catálogo de acessórios (Novo)    |
| GET    | `/api/servicos`       | Serviços de manutenção (Novo)    |

---

## 🛠️ Tecnologias Recomendadas e Utilizadas

| Camada    | Tecnologia               |
|-----------|--------------------------|
| Frontend  | Vue 3, Vite, Vue Router, Pinia (Recomendado para estado do catálogo) |
| Backend   | Node.js, Express         |
| Banco     | PostgreSQL, Prisma ORM (Recomendado) |
| Estilo    | CSS Vanilla, Google Fonts|

---

## 📋 Plano de Implementação e Evolução

O projeto está expandindo de um simples inventário para uma solução robusta de gestão automotiva:

1. **Estruturação Base (Concluída):** SPA isolada em camadas claras (`frontend` e `backend`).
2. **Expansão de Domínio (Em Andamento):** Inclusão de novas entidades de negócios. O sistema não listará apenas veículos, mas também auto-peças, acessórios e a possibilidade de visualizar e agendar serviços de manutenção.
3. **Migração para PostgreSQL (Planejado):**
   - Substituição total do armazenamento de dados temporário e em memória (`backend/data/`).
   - Adoção de um banco de dados relacional **PostgreSQL**, recomendada a utilização do **Prisma ORM** para garantir relacionamentos consistentes (por exemplo: validar quais peças são compatíveis com determinados modelos de carro).
4. **Refinamento da Interface (Planejado):** Construção de novas views no Vue 3 focadas em carrinho de compras para peças e painel de agendamento de serviços.

---

## 📝 Observações

- **🤖 Para Agentes de IA:** Leia obrigatoriamente o arquivo `AGENTS.md` na raiz do repositório antes de propor ou realizar qualquer modificação no código.
- O frontend usa o **proxy do Vite** para redirecionar chamadas `/api/*` ao backend em desenvolvimento, evitando a necessidade de configuração manual de CORS.
- Durante a fase atual de transição, os carros antigos ainda podem ser acessados em arquivos mocados, que serão descontinuados assim que o schema do PostgreSQL for consolidado.

---

Desenvolvido por **Francisco de Julio Faria**
Revisado por **Luiz Henrique Mota**
Revisado por **Alex Pablo de Oliveira Moraes**
