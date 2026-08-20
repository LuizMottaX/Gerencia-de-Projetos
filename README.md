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

## 📋 Plano de Implementação

O projeto passou por um processo de refatoração para modernizar a arquitetura e a interface:

1. **Estruturação:** O site HTML legado foi convertido para uma Single Page Application (SPA) para navegação sem recarregamento de página. O código foi separado de forma clara em duas camadas: `frontend` e `backend`.
2. **Backend (Node.js/Express):** Implementada uma API REST com dados dos veículos armazenados temporariamente em memória, substituindo os dados soltos nos antigos arquivos HTML. Foram criados os endpoints `/api/carros` e `/api/carros/:id`.
3. **Frontend (Vue 3/Vite):** 
   - Criação da SPA configurada com Vue Router (rotas dinâmicas para detalhes de carros).
   - Componentização para evitar código duplicado (como em `AppHeader.vue` e `AppFooter.vue`).
   - Redesign visual automotivo completo: adoção do tema *Carbon & Racing Red*, cartões modernos, micro-interações de hover e aprimoramento da responsividade, mantendo a essência da marca original.
4. **Remoção de Legado:** O diretório antigo com as páginas HTML estáticas foi completamente descartado.

---

## 🔄 Ciclo de Vida e Organização do Projeto

### Ciclo de Vida do Projeto e Relação com o Produto
O ciclo de vida do **projeto** diz respeito apenas a esta iniciativa de refatoração e modernização do sistema. Ele tem um início e fim determinados, desde o planejamento da nova arquitetura até o lançamento (deploy).
Por outro lado, o ciclo de vida do **produto** compreende toda a existência da plataforma digital da Chiquinho Motors. O produto iniciou em sua versão HTML básica, evoluiu com este projeto de modernização tecnológica e visual, e passará por fases contínuas de operação, suporte e aprimoramento (como a integração futura de um banco de dados real) até o fim de sua vida útil.

### Fases do Projeto e Suas Relações
O projeto percorreu as seguintes fases de forma sequencial e iterativa:
1. **Iniciação e Planejamento:** Análise das limitações da arquitetura legada, levantamento dos requisitos e definição das stacks tecnológicas (Vue.js no frontend e Node.js no backend).
2. **Execução:** 
   - Desenvolvimento da API para fornecimento de dados.
   - Construção dos componentes Vue.
   - Aplicação de novo Design System automotivo.
   - Implementação da responsividade.
3. **Monitoramento e Controle:** Fases de testes validaram as rotas da SPA, retorno da API REST, adaptabilidade mobile do layout e responsividade de iframes.
4. **Encerramento:** Exclusão do código legado, consolidação da documentação (este README) e deploy do código fonte no GitHub sob versionamento Git.

### Estrutura Organizacional e Gerenciamento
A estrutura organizacional voltada a este projeto seguiu um modelo ágil e enxuto. O desenvolvimento prioriza:
- **Separação de Preocupações (SoC):** Equipes ou desenvolvedores podem trabalhar de forma independente no frontend e no backend.
- **Flexibilidade e Adaptação:** A ausência de uma hierarquia rígida permitiu que decisões arquiteturais e de design (como o redesenho dinâmico para mobile) fossem tomadas e executadas de forma rápida.
- **Preparação para Escala:** Embora os dados estejam atualmente em memória, o gerenciamento do projeto levou em conta o crescimento organizacional, estruturando a API de tal forma que a migração para um banco de dados relacional ou NoSQL possa ser feita sem impactar as visões do cliente no frontend.

---

## 📝 Observações

- O frontend usa o **proxy do Vite** para redirecionar chamadas `/api/*` ao backend em desenvolvimento — não é necessário configurar CORS manualmente.
- Os dados dos veículos estão em `backend/data/carros.js`. Para integrar um banco de dados futuramente, basta substituir esse arquivo por chamadas ao banco, sem alterar o frontend.

---

Desenvolvido por **Francisco de Julio Faria**
Revisado por **Luiz Henrique Mota**