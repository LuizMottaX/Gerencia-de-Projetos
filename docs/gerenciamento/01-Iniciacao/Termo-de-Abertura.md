# Termo de Abertura do Projeto (TAP)

> **Processo PMBOK:** 4.1 Desenvolver o termo de abertura do projeto
> **Área:** Gerenciamento da Integração · **Grupo:** Iniciação

| Campo | Valor |
|-------|-------|
| **Projeto** | Chiquinho Motors® — Sistema Integrado de Concessionária |
| **Disciplina** | Gerência de Projetos · Sistemas de Informação |
| **Data de abertura** | 14/08/2026 |
| **Versão do documento** | 1.0 (12/10/2026) |
| **Repositório** | github.com/LuizMottaX/Gerencia-de-Projetos |

---

## 1. Justificativa (por que o projeto existe)

Concessionárias tradicionais gerenciam veículos, peças e serviços em
**planilhas separadas**, sem integração e sem canal digital para o cliente.
O gestor não sabe o que tem em estoque nem quais peças servem em quais
modelos, e o cliente precisa ligar para consultar peças ou agendar uma
revisão. Concessionárias sem sistema integrado perdem até **30% das
oportunidades** de venda de peças e serviços.

## 2. Objetivo do projeto

Desenvolver um **ecossistema web** que integre, em um único sistema e
banco de dados relacional, os quatro negócios da concessionária:

1. **Veículos** — catálogo com fotos, especificações e status de estoque;
2. **Auto-peças** — catálogo com filtro de **compatibilidade por modelo**;
3. **Acessórios** — catálogo com busca e filtros;
4. **Serviços de manutenção** — catálogo e **agendamento online**.

### Objetivos SMART

| # | Objetivo | Métrica de sucesso | Prazo |
|---|----------|--------------------|-------|
| O1 | Catálogo de veículos, peças e acessórios servido de banco relacional | 100% dos dados no PostgreSQL, 0 dados em arquivo/memória | F2 — 27/08/2026 ✅ |
| O2 | Cliente compra peças/acessórios pelo site | Fluxo carrinho → pedido funcionando, estoque nunca negativo | F3 |
| O3 | Cliente agenda serviço em horário realmente livre | 0 conflitos de horário (garantido por constraint no banco) | F4 |
| O4 | Loja gerencia o sistema sem editar código | Admin autenticado cadastra/edita itens pelo painel | F5 |
| O5 | Sistema público para a banca | URL pública + CI verde | F6 — fim do semestre |

## 3. Descrição de alto nível do produto

SPA em **Vue 3 + Vite** (frontend) consumindo uma **API REST em Node.js +
Express** (backend), com persistência em **PostgreSQL** via **Prisma ORM**.
Identidade visual "Carbon & Racing Red", CSS vanilla.

## 4. Requisitos de alto nível

- Peças e acessórios **relacionados aos modelos de veículo compatíveis**.
- API seguindo o padrão REST `/api/<entidade>`.
- Separação estrita entre frontend e backend.
- Validação de toda entrada de dados (Zod) e segurança básica (Helmet,
  rate limit).
- Valores monetários em centavos (sem erro de ponto flutuante).

Detalhamento em [`02-Planejamento/Documentacao-de-Requisitos.md`](../02-Planejamento/Documentacao-de-Requisitos.md).

## 5. Premissas

- A equipe tem 3 integrantes com dedicação parcial (projeto acadêmico).
- O banco PostgreSQL hospedado no Coolify (Hetzner) permanece disponível.
- Serviços de hospedagem gratuitos (Vercel/Railway/Render) atendem ao deploy.
- A Chiquinho Motors é uma concessionária **fictícia**; os dados do
  catálogo são ilustrativos.

## 6. Restrições

- **Prazo:** término até o fim do semestre letivo (dezembro/2026).
- **Custo:** zero — apenas ferramentas open-source e planos gratuitos.
- **Tecnologia:** Vue 3, Node.js/Express, PostgreSQL/Prisma (definidas em
  `AGENTS.md`).
- **Sem gateway de pagamento** — o checkout gera pedido para contato.

## 7. Riscos de alto nível

| Risco | Impacto | Resposta inicial |
|-------|---------|------------------|
| Prazo do semestre insuficiente para F3–F6 | Alto | Priorizar F3; F4 como protótipo se necessário |
| Indisponibilidade do banco hospedado | Alto | Ambiente local via Docker como contingência |
| Dedicação parcial / outras disciplinas | Médio | Entregas pequenas, 1 PR por entrega |
| Falhas de segurança no painel admin | Médio | JWT + bcrypt + testes de rotas protegidas |

## 8. Marcos (milestones)

| Marco | Data | Status |
|-------|------|--------|
| Abertura do projeto (refatoração Vue 3 + Node) | 14/08/2026 | ✅ |
| F1 + F2 — PostgreSQL e catálogo de peças/acessórios | 27/08/2026 | ✅ |
| 1ª apresentação (visão, arquitetura, roadmap) | 14/09/2026 | ✅ |
| 2ª apresentação (Integração e Escopo — PMBOK) | 10/2026 | ⏳ |
| F3 + F4 — carrinho e agendamento | 11/2026 | ⬜ |
| F5 + F6 — painel admin e publicação | 12/2026 | ⬜ |
| Encerramento do projeto | 12/2026 | ⬜ |

## 9. Orçamento resumido

Projeto acadêmico, **custo financeiro zero**. Esforço estimado:
~9 semanas de trabalho em dedicação parcial (estimativas por fase no
[`plan.md`](../../../plan.md)).

## 10. Partes interessadas (resumo)

| Parte interessada | Papel | Interesse / Influência |
|-------------------|-------|------------------------|
| Professor(a) da disciplina | **Patrocinador** / avaliador | Alto / Alto |
| Banca / turma | Avaliadores das apresentações | Médio / Médio |
| Chiquinho Motors (cliente fictício) | Cliente / usuário de negócio | Alto / Médio |
| Clientes finais da concessionária | Usuários do site | Alto / Baixo |
| Equipe de desenvolvimento | Executores | Alto / Alto |

## 11. Equipe e gerente do projeto

| Integrante | Papel |
|------------|-------|
| **Luiz Henrique Mota** | Gerente do projeto · dono do repositório · revisor |
| **Francisco de Julio Faria** | Desenvolvedor (frontend/backend) |
| **Alex Pablo de Oliveira Moraes** | Desenvolvedor · revisor de código |

**Autoridade do gerente do projeto:** priorizar o backlog, aprovar merges
na `main`, aprovar/rejeitar solicitações de mudança de baixo impacto e
levar ao patrocinador as de alto impacto (ver
[Controle Integrado de Mudanças](../04-Monitoramento-e-Controle/Controle-Integrado-de-Mudancas.md)).

## 12. Critérios de sucesso / aceitação do projeto

- Os quatro módulos (veículos, peças, acessórios, serviços) acessíveis pelo site.
- Critérios "Pronto quando" de todas as fases atendidos.
- Sistema publicado em URL pública e apresentado à banca.
- Documentação PMBOK completa em `docs/gerenciamento/`.

## 13. Aprovação

| Nome | Papel | Assinatura | Data |
|------|-------|-----------|------|
| | Patrocinador (Professor/a) | | |
| Luiz Henrique Mota | Gerente do projeto | | |
| Francisco de Julio Faria | Equipe | | |
| Alex Pablo de Oliveira Moraes | Equipe | | |
