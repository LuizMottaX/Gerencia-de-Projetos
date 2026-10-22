# Plano de Gerenciamento da Qualidade

> **Processo PMBOK:** 8.1 Planejar a qualidade
> **Área:** Gerenciamento da Qualidade · **Grupo:** Planejamento
> **Versão:** 1.0 · 22/10/2026

Define **quais padrões de qualidade** o projeto e o produto devem atender,
**como** isso é medido e **quem** é responsável. Detalha a §7 do
[Plano de Gerenciamento do Projeto](Plano-de-Gerenciamento-do-Projeto.md).
A execução deste plano está em [Garantia da Qualidade](../03-Execucao/Garantia-da-Qualidade.md)
(processos) e [Controle da Qualidade](../04-Monitoramento-e-Controle/Controle-da-Qualidade.md)
(medições do produto).

---

## 1. Política da qualidade

> A Chiquinho Motors® só recebe na `main` código **revisado, testado e
> verificável automaticamente**. Qualidade é construída no processo
> (prevenção), não inspecionada no fim.

Princípios:

1. **Prevenção antes de inspeção** — lint, validação de entrada e testes
   rodam em cada PR, antes do merge.
2. **Medir para decidir** — cada padrão abaixo tem uma métrica com meta e
   fonte objetiva (ferramenta, não opinião).
3. **Melhoria contínua** — não conformidades viram ação registrada,
   com responsável e prazo.

## 2. Padrões e referências

| Referência | Uso no projeto |
|-----------|----------------|
| **ISO/IEC 25010** (qualidade de produto de software) | Características avaliadas — ver §3 |
| **WCAG 2.1 nível AA** | Acessibilidade, verificada pelo Lighthouse |
| **Conventional Commits** | Mensagens de commit (`feat:`, `fix:`, `docs:`…) |
| **REST** (`/api/<entidade>`, JSON, códigos HTTP) | Padrão de API (`AGENTS.md`, RNF03) |
| **Keep a Changelog** | Registro de versões em `CHANGELOG.md` |
| Convenções internas | `AGENTS.md` e seção "Convenções" do `plan.md` |

## 3. Requisitos de qualidade do produto

Mapeamento dos requisitos não funcionais para as características da
ISO/IEC 25010:

| Característica (ISO 25010) | Requisitos | Como é assegurada |
|---------------------------|-----------|-------------------|
| Adequação funcional | RF01–RF17 | Testes de API, de componentes e E2E; aceite em [Verificar o Escopo](../04-Monitoramento-e-Controle/Verificar-Escopo.md) |
| Confiabilidade | RNF07, RNF08, RNF09 | Centavos inteiros; transações; `@@unique`; testes de concorrência |
| Segurança | RNF04, RNF05, RNF06 | Zod, Helmet, rate limit, bcrypt, JWT; auditoria de dependências |
| Usabilidade / acessibilidade | RNF10, RNF11 | Lighthouse ≥ 90; testes E2E em desktop e celular |
| Eficiência de desempenho | RNF11 | Lighthouse performance ≥ 90; imagens otimizadas e *lazy* |
| Manutenibilidade | RNF01, RNF12 | Lint, formatação, cobertura, revisão de código |
| Portabilidade | RNF01 | Docker; setup reproduzível pelo README |

## 4. Métricas da qualidade

| ID | Métrica | Meta | Como medir | Quando |
|----|---------|------|-----------|--------|
| M01 | Testes automatizados passando | **100%** | `npm test` (backend, frontend, e2e) | Cada push/PR (CI) |
| M02 | Erros e avisos de lint | **0 / 0** | `npm run lint` | Cada push/PR (CI) |
| M03 | Arquivos fora do padrão de formatação | **0** | `npm run format:check` | Cada push/PR (CI) |
| M04 | Cobertura de linhas | Backend **≥ 80%** · Frontend **≥ 50%** | `npm run test:coverage` | Por relatório de qualidade |
| M05 | Lighthouse — acessibilidade e performance | **≥ 90** em todas as páginas auditadas | Lighthouse (celular e desktop) | Fim de fase / antes de publicar |
| M06 | Vulnerabilidades em dependências de **produção** | **0 críticas**; altas só com justificativa registrada | `npm audit --omit=dev` | Cada push/PR (CI) + relatório |
| M07 | Execuções do CI com sucesso na `main` | **100%** | Histórico do GitHub Actions | Por relatório |
| M08 | PRs com revisão aprovada antes do merge | **100%** | Aba *Pull requests* do GitHub | Por auditoria |
| M09 | Commits no padrão Conventional Commits | **≥ 95%** | `git log` | Por auditoria |
| M10 | Defeitos de severidade alta abertos | **0** | Registro de defeitos | Por relatório |
| M11 | Duração do CI | **≤ 10 min** | Histórico do GitHub Actions | Por relatório |

**Severidade de defeito** (usada em M10):

| Severidade | Critério | Exemplo |
|-----------|----------|---------|
| Alta | Perda/corrupção de dados, falha de segurança, fluxo principal bloqueado | Estoque negativo; rota do painel sem JWT |
| Média | Funcionalidade errada com contorno | Horário ocupado aparecendo como livre |
| Baixa | Visual, texto ou detalhe sem impacto funcional | Cor errada no painel; ano no rodapé |

## 5. Listas de verificação

### 5.1 Definição de pronto (*Definition of Done*) de um PR

Reproduzida no [template de PR](../../../.github/pull_request_template.md):

- [ ] Ligado a um pacote da EAP ou a uma mudança aprovada (CR-XX)
- [ ] `npm run lint` e `npm run format:check` sem erros
- [ ] Testes novos/atualizados para o comportamento alterado; `npm test` verde
- [ ] Mudança de banco **somente** por migration do Prisma
- [ ] Sem segredos no código (só em `.env`)
- [ ] README / `plan.md` / `CHANGELOG.md` atualizados quando aplicável
- [ ] CI verde e **revisão aprovada por outro integrante**

### 5.2 Revisão de código

- [ ] A rota segue o padrão rota fina → Prisma → serializer; erros via `next(err)`
- [ ] Toda entrada externa validada com Zod
- [ ] Rotas de escrita do painel sob `/api/admin/*` (JWT)
- [ ] Frontend chama a API só pelo `src/api`; ícones Lucide; CSS vanilla do tema
- [ ] Dinheiro em centavos; operações de estoque/agenda em transação
- [ ] Nomes claros, sem código morto ou `console.log` esquecido

### 5.3 Antes de publicar (release)

- [ ] CI da `main` verde, incluindo E2E
- [ ] Lighthouse ≥ 90 nas páginas principais
- [ ] `npm audit --omit=dev` sem críticas
- [ ] `JWT_SECRET` forte e senha do admin trocada (risco R4)
- [ ] `prisma migrate deploy` testado em banco limpo
- [ ] `CHANGELOG.md` com a versão

## 6. Papéis e responsabilidades

| Papel | Quem | Responsabilidade na qualidade |
|-------|------|-------------------------------|
| Gerente do projeto | Luiz Henrique Mota | Dono deste plano; conduz as auditorias de processo; aprova ações corretivas |
| Desenvolvedor(a) | Autor(a) de cada PR | Cumpre a definição de pronto; escreve os testes |
| Revisor(a) | Integrante que não é o autor | Aplica o checklist de revisão (§5.2); aprova ou pede ajustes |
| Equipe | Francisco, Alex, Luiz | Trata os defeitos; mantém métricas no relatório de controle |
| Patrocinador | Professor(a) | Aceite final das entregas |

## 7. Ferramentas

| Ferramenta | Finalidade | Métrica |
|-----------|-----------|---------|
| ESLint + Prettier | Padrão de código | M02, M03 |
| Vitest + Supertest | Testes de API com banco PostgreSQL isolado | M01, M04 |
| Vitest + `@vue/test-utils` | Testes de componentes e stores | M01, M04 |
| `@vitest/coverage-v8` | Cobertura de código | M04 |
| Playwright | Testes E2E em desktop e celular | M01 |
| Lighthouse | Acessibilidade, performance, SEO, boas práticas | M05 |
| `npm audit` | Vulnerabilidades em dependências | M06 |
| GitHub Actions | Executa tudo a cada push/PR | M01–M03, M06, M07, M11 |
| GitHub Pull Requests | Revisão por pares | M08 |

## 8. Custo da qualidade

O custo é medido em **horas da equipe** (o custo financeiro do projeto é
R$ 0,00 — §6 do plano de gerenciamento).

| Categoria | Atividades no projeto |
|-----------|----------------------|
| **Prevenção** | Configurar lint, CI, template de PR; escrever este plano; padrões do `AGENTS.md` |
| **Avaliação** | Escrever e rodar testes; revisões de PR; Lighthouse; auditorias |
| **Falha interna** | Corrigir o que o CI ou a revisão pegou antes do merge |
| **Falha externa** | Corrigir defeito encontrado depois do merge ou pela banca |

Meta: investir em prevenção e avaliação para que a falha externa — a mais
cara, porque aparece na apresentação — fique perto de zero.

## 9. Melhoria de processos

A cada auditoria ([Garantia da Qualidade](../03-Execucao/Garantia-da-Qualidade.md))
e relatório ([Controle da Qualidade](../04-Monitoramento-e-Controle/Controle-da-Qualidade.md)):

1. Comparar cada métrica com a meta.
2. Para cada não conformidade, registrar **causa** e **ação** (corretiva ou preventiva).
3. Ações que mudam escopo, prazo ou linha de base viram **solicitação de
   mudança** no [Controle Integrado de Mudanças](../04-Monitoramento-e-Controle/Controle-Integrado-de-Mudancas.md).
4. Revisar este plano quando uma meta se mostrar irreal ou fácil demais.
