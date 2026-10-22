## O que muda

<!-- Resumo em 1–3 linhas. -->

**Pacote da EAP / mudança:** <!-- ex.: 1.4.2 ou CR-11 -->

## Como testar

<!-- Passos para o revisor ver a mudança funcionando. -->

## Definição de pronto

Plano da qualidade, §5.1 (`docs/gerenciamento/02-Planejamento/Plano-de-Gerenciamento-da-Qualidade.md`).

- [ ] `npm run lint` e `npm run format:check` sem erros
- [ ] Testes novos/atualizados para o comportamento alterado; `npm test` verde
- [ ] Mudança de banco somente por migration do Prisma
- [ ] Sem segredos no código (só em `.env`)
- [ ] README / `plan.md` / `CHANGELOG.md` atualizados quando aplicável

## Para o revisor (§5.2)

- [ ] Rota fina → Prisma → serializer; erros via `next(err)`; entrada validada com Zod
- [ ] Escrita do painel sob `/api/admin/*` (JWT)
- [ ] Frontend chama a API só pelo `src/api`; ícones Lucide; CSS vanilla do tema
- [ ] Dinheiro em centavos; estoque/agenda em transação
