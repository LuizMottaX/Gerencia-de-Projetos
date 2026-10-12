# Verificar (Validar) o Escopo

> **Processo PMBOK:** 5.5 Verificar / Validar o escopo
> **Área:** Gerenciamento do Escopo · **Grupo:** Monitoramento e Controle
> **Versão:** 1.0 · 12/10/2026

Verificar o escopo é obter a **aceitação formal** das entregas concluídas.
Uma entrega só é aceita quando seus critérios ("Pronto quando") são
demonstrados — não basta o código existir.

---

## 1. Procedimento de verificação

1. O responsável abre o PR e marca o pacote como "pronto para verificação".
2. Outro integrante **inspeciona** o código e **demonstra** a entrega rodando
   o sistema (backend 3001 + frontend 5173).
3. Cada critério de aceitação é marcado como atendido ou não.
4. Se todos forem atendidos → **entrega aceita**, registrada abaixo.
   Se não → volta para execução com a lista do que falta.
5. Entregas de fase são apresentadas ao patrocinador (Professor/a) nas
   apresentações.

## 2. Registro de aceitação

### E2 — Banco PostgreSQL + catálogo de veículos (F1) — ✅ ACEITA

| Critério | Verificação | Resultado |
|----------|-------------|:---------:|
| Nenhum dado de veículo em memória/arquivo | `backend/data/` removido; rotas consultam Prisma | ✅ |
| Migrations aplicadas | `20260828010219_init` | ✅ |
| Seed idempotente | `upsert` por slug em `prisma/seed.js` | ✅ |
| `GET /api/carros` e `/api/carros/:id` funcionando | Demonstração na tela de carros | ✅ |

**Aceite:** Equipe · 27/08/2026 · demonstrado ao patrocinador na 1ª apresentação (14/09/2026).

### E3 — Catálogo de peças e acessórios (F2) — ✅ ACEITA

| Critério | Verificação | Resultado |
|----------|-------------|:---------:|
| Selecionar um modelo mostra só itens compatíveis | Filtro `?modelo=` em `/api/pecas` e na tela | ✅ |
| Peças e acessórios com filtros de categoria, preço e busca | `PecasView`, `AcessoriosView` | ✅ |
| Página do veículo lista peças compatíveis | `GET /api/carros/:id/pecas` | ✅ |
| Relação N:N no banco | `ProdutoCompatibilidade` com FKs | ✅ |

**Aceite:** Equipe · 27/08/2026 · demonstrado na 1ª apresentação (14/09/2026).

### E1 — Fundação técnica (F0) — ✅ ACEITA

| Critério | Verificação | Resultado |
|----------|-------------|:---------:|
| Estrutura separada front/back | Pastas `frontend/` e `backend/` | ✅ |
| Segurança e validação | Helmet, rate limit, Zod, `tratarErro` | ✅ |
| `npm run lint` passa | ESLint nos dois pacotes, 0 erros e 0 avisos | ✅ |
| `npm test` passa | 8 testes de API + 6 de frontend | ✅ |
| CI roda em cada PR | `.github/workflows/ci.yml` | ✅ ¹ |

**Aceite:** Equipe · 12/10/2026 (aceite parcial anterior resolvido pela ação A1).

¹ Para o CI **bloquear o merge**, falta ativar a proteção da branch `main`
no GitHub (Settings → Branches → exigir os checks `backend` e `frontend`).

### E4 — Carrinho, checkout e pedido (F3) — ✅ ACEITA

| Critério | Verificação | Resultado |
|----------|-------------|:---------:|
| Fluxo carrinho → checkout → pedido com código | Teste de API + execução manual pelo proxy do Vite | ✅ |
| Comprar além do estoque é bloqueado com mensagem específica | 409 com item e quantidade disponível (teste) | ✅ |
| Recarregar a página não perde o carrinho | Persistência em `localStorage` (teste da store) | ✅ |
| Pedidos simultâneos não deixam estoque negativo | 5 pedidos paralelos do último item → 1 aceito, 4 recusados (teste) | ✅ |

**Aceite:** Equipe · 12/10/2026.

### E5 — Serviços e agendamento (F4) — ✅ ACEITA

| Critério | Verificação | Resultado |
|----------|-------------|:---------:|
| Visitante escolhe serviço, vê horários **realmente livres** e reserva | Teste de API + execução manual pelo proxy do Vite | ✅ |
| Dois agendamentos não ocupam o mesmo horário | 5 reservas simultâneas do mesmo horário → 1 aceita, 4 recusadas (teste) | ✅ |
| Tela de confirmação mostra o código | `GET /api/agendamentos/:codigo` + `/agendamento/:codigo` | ✅ |
| Horários no fuso da oficina, independente do servidor | Testes rodados com TZ=UTC, Asia/Tokyo e America/Sao_Paulo | ✅ |

**Aceite:** Equipe · 12/10/2026. E-mail de confirmação (opcional) não implementado.

### E6 — Painel administrativo (F5) — ✅ ACEITA

| Critério | Verificação | Resultado |
|----------|-------------|:---------:|
| Login com credenciais válidas gera token | Teste automatizado `tests/api.test.js` | ✅ |
| Credenciais inválidas → 401 | Teste automatizado | ✅ |
| Rotas protegidas → 401 sem token / token inválido | Teste automatizado | ✅ |
| Admin cadastra veículo **com foto** e ele aparece no site | Teste automatizado + execução manual pelo proxy do Vite | ✅ |
| Rotas de escrita retornam 401 sem token válido | Teste em todas as 16 rotas do painel | ✅ |
| Mudar status de pedido e de agendamento pelo painel | Testes: cancelar pedido devolve o estoque; cancelar agendamento libera o horário | ✅ |

**Aceite:** Equipe · 12/10/2026.

### E8 — Documentação PMBOK — ✅ ACEITA (Integração e Escopo)

| Critério | Resultado |
|----------|:---------:|
| TAP, plano de gerenciamento, execução, monitoramento, controle de mudanças, encerramento | ✅ |
| Requisitos, escopo, EAP, verificação e controle do escopo | ✅ |

**Aceite:** a ser formalizado pelo patrocinador na 2ª apresentação.

## 3. Resumo

| Entrega | Situação |
|---------|:--------:|
| E1 Fundação | ✅ aceita |
| E2 Persistência | ✅ aceita |
| E3 Peças e acessórios | ✅ aceita |
| E4 Carrinho | ✅ aceita |
| E5 Agendamento | ✅ aceita |
| E6 Admin | ✅ aceita |
| E7 Publicação | ⬜ |
| E8 Documentação | ✅ (Integração + Escopo) |
