# Declaração do Escopo do Projeto

> **Processo PMBOK:** 5.3 Definir o escopo
> **Área:** Gerenciamento do Escopo · **Grupo:** Planejamento
> **Versão:** 1.0 · 12/10/2026 · **Faz parte da linha de base do escopo**

---

## 1. Descrição do escopo do produto

O **Chiquinho Motors®** é um sistema web para concessionária composto por
um site público (catálogos, carrinho, agendamento) e um painel
administrativo, sustentados por uma API REST e um banco PostgreSQL.

| Módulo | O que o sistema faz |
|--------|---------------------|
| **Veículos** | Lista e detalha veículos (fotos, ficha técnica, preço, status `DISPONIVEL/RESERVADO/VENDIDO`) |
| **Auto-peças** | Catálogo filtrável por categoria, preço, busca e **modelo de veículo compatível** |
| **Acessórios** | Catálogo com os mesmos filtros das peças |
| **Serviços** | Catálogo de serviços de manutenção e **agendamento** em horário livre |
| **Carrinho/Pedidos** | Compra de peças e acessórios, com controle de estoque |
| **Administração** | Login, CRUD do catálogo, gestão de pedidos, agenda e mensagens |

## 2. Entregas do projeto

| # | Entrega | Fase |
|---|---------|:----:|
| E1 | Fundação técnica (estrutura, segurança, lint, testes, CI) | F0 |
| E2 | Banco PostgreSQL modelado com Prisma + catálogo de veículos | F1 |
| E3 | Catálogo de peças e acessórios com compatibilidade | F2 |
| E4 | Carrinho, checkout e acompanhamento de pedido | F3 |
| E5 | Catálogo de serviços e agendamento online | F4 |
| E6 | Painel administrativo com autenticação | F5 |
| E7 | Sistema publicado com testes E2E e auditoria Lighthouse | F6 |
| E8 | Documentação de gerenciamento PMBOK (`docs/gerenciamento/`) | contínua |
| E9 | Apresentações para a disciplina (1ª e 2ª) | marcos |

## 3. Critérios de aceitação

| Entrega | Aceita quando… |
|---------|----------------|
| E1 | `npm run lint` e `npm test` passam nos dois pacotes; CI bloqueia PR com falha |
| E2 | Nenhum dado de veículo em memória/arquivo; migrations aplicadas; seed idempotente |
| E3 | Selecionar um modelo mostra apenas peças/acessórios compatíveis |
| E4 | Fluxo completo carrinho → pedido com código; compra acima do estoque bloqueada; carrinho sobrevive a recarregar a página; estoque nunca negativo |
| E5 | Cliente vê só horários realmente livres; dois agendamentos não ocupam o mesmo horário |
| E6 | Admin logado cadastra veículo com foto e ele aparece no site; rotas de escrita retornam 401 sem token |
| E7 | URL pública acessível; CI roda unit + E2E; README permite subir o projeto do zero |
| E8 | Um artefato preenchido por processo PMBOK solicitado |

## 4. Exclusões do escopo (o que **não** será feito)

- ❌ **Gateway de pagamento** (cartão, Pix online) — o checkout gera pedido para contato.
- ❌ Emissão de **nota fiscal** e integração com ERP/contabilidade.
- ❌ **Aplicativo mobile** nativo (o site é responsivo).
- ❌ Financiamento/simulação de crédito de veículos.
- ❌ Cálculo de **frete** e logística de entrega.
- ❌ Área do cliente com cadastro e senha (o cliente é identificado por e-mail no pedido).
- ❌ Múltiplos papéis de usuário além de administrador.
- ❌ Swagger/OpenAPI (movido para dívida técnica — ver CR-04).

## 5. Restrições

- Prazo: fim do semestre letivo (dezembro/2026).
- Orçamento financeiro zero.
- Stack obrigatória: Vue 3 + Vite, Node.js + Express, PostgreSQL + Prisma.
- CSS vanilla com a identidade "Carbon & Racing Red".

## 6. Premissas

- Banco no Coolify (porta 5433) disponível durante todo o projeto.
- Hospedagem gratuita (Vercel/Netlify + Railway/Render) suficiente para a demonstração.
- Dados do catálogo são fictícios/ilustrativos.
