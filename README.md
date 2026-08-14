# 🚗 Chiquinho Motors®

Site da concessionária **Chiquinho Motors®**, desenvolvido com **Vue 3 + Vite** no frontend e **Node.js + Express** no backend.

---

## 📁 Estrutura do Projeto

```
INVENTARIO-CONCESSIONARIA/
├── backend/                  # API REST Node.js
│   ├── data/
│   │   └── carros.js         # Dados dos veículos (in-memory)
│   ├── server.js             # Servidor Express
│   └── package.json
└── frontend/                 # SPA Vue 3
    ├── src/
│   │   ├── assets/           # CSS global
│   │   ├── components/       # AppHeader, AppFooter
│   │   ├── router/           # Vue Router
│   │   └── views/            # Páginas da aplicação
    ├── vite.config.js
    └── package.json
```

---

## ✅ Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- npm v9 ou superior

---

## 🚀 Como iniciar

O projeto possui **dois servidores** que devem rodar simultaneamente: o backend (API) e o frontend (Vue).

### 1. Backend — API REST (porta 3001)

```bash
cd backend
npm install
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

## 🌐 Endpoints da API

| Método | Rota               | Descrição                        |
|--------|--------------------|----------------------------------|
| GET    | `/api/carros`      | Lista todos os veículos          |
| GET    | `/api/carros/:id`  | Retorna detalhes de um veículo   |

**IDs disponíveis:** `celta`, `palio`, `opala`, `fusca`, `corolla`, `gol`

### Exemplo

```bash
# Todos os carros
curl http://localhost:3001/api/carros

# Detalhe do Celta
curl http://localhost:3001/api/carros/celta
```

---

## 📄 Páginas do Site

| Rota            | Página                |
|-----------------|-----------------------|
| `/`             | Página inicial        |
| `/carros`       | Carros disponíveis    |
| `/carros/:id`   | Detalhe do veículo    |
| `/dicas`        | Dicas automotivas     |
| `/noticias`     | Notícias automotivas  |
| `/contato`      | Contato               |
| `/sobre`        | Quem somos            |

---

## 🛠️ Tecnologias

| Camada    | Tecnologia               |
|-----------|--------------------------|
| Frontend  | Vue 3, Vite, Vue Router 4 |
| Backend   | Node.js, Express         |
| Estilo    | CSS Vanilla, Google Fonts (Roboto) |
| Dados     | In-memory (sem banco de dados) |

---

## 📝 Observações

- O frontend usa o **proxy do Vite** para redirecionar chamadas `/api/*` ao backend em desenvolvimento — não é necessário configurar CORS manualmente.
- Os dados dos veículos estão em `backend/data/carros.js`. Para integrar um banco de dados futuramente, basta substituir esse arquivo por chamadas ao banco, sem alterar o frontend.

---

Desenvolvido por **Francisco de Julio Faria**
Revisa por **Luiz Henrique Mota**