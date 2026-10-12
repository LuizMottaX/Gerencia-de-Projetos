# Documentação de Requisitos

> **Processo PMBOK:** 5.2 Coletar os requisitos
> **Área:** Gerenciamento do Escopo · **Grupo:** Planejamento
> **Versão:** 1.0 · 12/10/2026

---

## 1. Como os requisitos foram coletados

| Técnica | Aplicação no projeto |
|---------|---------------------|
| **Análise de documentos** | Regras do `AGENTS.md`, README original e o problema de negócio (planilhas separadas, sem canal digital) |
| **Brainstorming** | Reuniões da equipe para definir os 4 módulos e o diferencial de compatibilidade |
| **Benchmarking** | Comparação com sites de concessionárias e marketplaces de autopeças (filtro "serve no meu carro") |
| **Prototipação** | Telas em Vue 3 validadas incrementalmente (catálogo de carros → peças → acessórios) |
| **Histórias de usuário** | Requisitos funcionais escritos como "Como \<papel\>, quero \<ação\> para \<benefício\>" |

## 2. Requisitos de negócio

| ID | Requisito |
|----|-----------|
| RN01 | Integrar veículos, peças, acessórios e serviços em um único sistema |
| RN02 | Oferecer canal digital de consulta, compra e agendamento ao cliente |
| RN03 | Reduzir a venda de peça incompatível com o veículo do cliente |
| RN04 | Permitir à loja gerenciar catálogo, pedidos e agenda sem programador |

## 3. Requisitos das partes interessadas

| Parte interessada | Necessidade |
|-------------------|-------------|
| Cliente final | Encontrar rápido o carro/peça que procura e agendar sem telefonar |
| Gestor da loja | Visibilidade de estoque, pedidos e agenda |
| Professor(a) / banca | Sistema funcional + aplicação dos processos do PMBOK |
| Equipe | Stack moderna, código organizado e documentado |

## 4. Requisitos funcionais

| ID | História de usuário | Fase | Prioridade (MoSCoW) |
|----|--------------------|:----:|:-------------------:|
| RF01 | Como cliente, quero **listar veículos** com foto, preço e status | F1 | Must |
| RF02 | Como cliente, quero ver os **detalhes de um veículo** (fotos, ficha técnica, pagamento) | F1 | Must |
| RF03 | Como cliente, quero **listar peças** filtrando por categoria, preço e busca | F2 | Must |
| RF04 | Como cliente, quero filtrar peças **pelo modelo do meu carro** (compatibilidade) | F2 | Must |
| RF05 | Como cliente, quero **listar acessórios** com os mesmos filtros | F2 | Must |
| RF06 | Como cliente, quero ver as **peças compatíveis com um veículo** na página dele | F2 | Should |
| RF07 | Como cliente, quero **enviar mensagem de contato** | F0 | Must |
| RF08 | Como cliente, quero **adicionar itens ao carrinho** e o carrinho deve persistir ao recarregar | F3 | Must |
| RF09 | Como cliente, quero **finalizar o pedido** e receber um código de acompanhamento | F3 | Must |
| RF10 | Como cliente, quero **acompanhar meu pedido** pelo código | F3 | Should |
| RF11 | Como cliente, quero **ver os serviços** de manutenção com preço e duração | F4 | Must |
| RF12 | Como cliente, quero **ver horários livres** e **agendar** um serviço | F4 | Must |
| RF13 | Como administrador, quero **fazer login** no painel | F5 | Must |
| RF14 | Como administrador, quero **cadastrar/editar/remover** veículos, peças, acessórios, categorias e serviços | F5 | Must |
| RF15 | Como administrador, quero **alterar o status** de pedidos e agendamentos | F5 | Should |
| RF16 | Como administrador, quero ler as **mensagens de contato** | F5 | Could |
| RF17 | Como administrador, quero um **dashboard** com indicadores (estoque baixo, pedidos do mês) | F5 | Could |

## 5. Requisitos não funcionais

| ID | Requisito | Categoria |
|----|-----------|-----------|
| RNF01 | Frontend Vue 3 + Vite e backend Node.js + Express, em pastas separadas | Arquitetura |
| RNF02 | Dados em PostgreSQL via Prisma, com integridade referencial | Dados |
| RNF03 | API REST no padrão `/api/<entidade>`, respostas JSON | Interoperabilidade |
| RNF04 | Toda entrada validada (Zod); erro 400 com `{ erro, detalhes }` | Segurança |
| RNF05 | Helmet + rate limit em todas as rotas | Segurança |
| RNF06 | Senhas com hash bcrypt; rotas de escrita protegidas por JWT | Segurança |
| RNF07 | Dinheiro armazenado em centavos (inteiro) | Confiabilidade |
| RNF08 | Estoque nunca negativo, mesmo com pedidos simultâneos (transação) | Confiabilidade |
| RNF09 | Dois agendamentos não ocupam o mesmo horário (constraint única) | Confiabilidade |
| RNF10 | Interface responsiva, identidade "Carbon & Racing Red", CSS vanilla, ícones Lucide | Usabilidade |
| RNF11 | Lighthouse acessibilidade e performance ≥ 90 | Usabilidade |
| RNF12 | Lint, testes e CI bloqueando merge com falha | Manutenibilidade |

## 6. Matriz de rastreabilidade de requisitos

Liga cada requisito ao **objetivo** do TAP, ao **pacote da EAP** que o
entrega e à **evidência** de verificação.

| Requisito | Objetivo (TAP) | Pacote EAP | Evidência / Teste | Status |
|-----------|:--------------:|-----------|-------------------|:------:|
| RF01, RF02 | O1 | 1.2.3, 1.2.4 | `GET /api/carros`, `/api/carros/:id`; telas `CarrosView`, `CarroDetalheView` | ✅ |
| RF03, RF05 | O1 | 1.3.2, 1.3.3 | `GET /api/pecas`, `/api/acessorios`; `PecasView`, `AcessoriosView` | ✅ |
| RF04 | O1 | 1.3.1, 1.3.2 | Tabela `ProdutoCompatibilidade`; filtro `?modelo=` | ✅ |
| RF06 | O1 | 1.3.2 | `GET /api/carros/:id/pecas` | ✅ |
| RF07 | O1 | 1.1.3 | `POST /api/contato` → `MensagemContato` | ✅ |
| RF08–RF10 | O2 | 1.4.1–1.4.4 | Fluxo carrinho → checkout → `/pedido/:codigo`; `tests/pedidos.test.js`, `tests/carrinho.test.js` | ✅ |
| RF11, RF12 | O3 | 1.5.1–1.5.4 | `/api/servicos`, `/api/agendamentos/disponibilidade` | ⬜ |
| RF13 | O4 | 1.6.1 | `POST /api/admin/auth/login`, `LoginAdminView` | ✅ |
| RF14–RF17 | O4 | 1.6.2–1.6.4 | CRUD protegido + telas do painel | ⬜ |
| RNF01–RNF03 | todos | 1.1.1, 1.2.1 | Estrutura do repositório; `AGENTS.md` | ✅ |
| RNF04, RNF05 | todos | 1.1.2 | `middleware/errors.js`, `server.js` | ✅ |
| RNF06 | O4 | 1.6.1 | `bcryptjs` + `jsonwebtoken` + `middleware/authAdmin.js` | ✅ |
| RNF07 | O1, O2 | 1.2.2 | Colunas `*Centavos Int` no schema | ✅ |
| RNF08 | O2 | 1.4.2 | Teste de concorrência (5 pedidos simultâneos do último item) | ✅ |
| RNF09 | O3 | 1.5.1 | `@@unique([servicoId, dataHora])` + teste | ⬜ |
| RNF10 | todos | 1.1.4 | `assets/style.css`; `lucide-vue-next` | ✅ |
| RNF11 | O5 | 1.7.2 | Relatório Lighthouse | ⬜ |
| RNF12 | O5 | 1.1.5, 1.7.1 | Workflow GitHub Actions | 🟡 (unit ✅, E2E na F6) |

Legenda: ✅ atendido e verificado · 🟡 em andamento · ⬜ não iniciado
