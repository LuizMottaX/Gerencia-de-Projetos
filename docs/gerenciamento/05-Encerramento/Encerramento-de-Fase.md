# Encerrar o Projeto ou Fase

> **Processo PMBOK:** 4.7 Encerrar o projeto ou fase
> **Área:** Gerenciamento da Integração · **Grupo:** Encerramento
> **Versão:** 1.0 · 12/10/2026

Este documento tem duas partes: o **Termo de Encerramento da Fase 1 do
projeto (F0–F2: Fundação e Catálogo)**, já concluída, e o **modelo de
encerramento do projeto**, a ser preenchido em dezembro/2026.

---

## Parte A — Termo de Encerramento da Fase "Fundação e Catálogo" (F0–F2)

| Campo | Valor |
|-------|-------|
| Fase | F1 + F2 (F0 parcial) |
| Período | 14/08/2026 – 14/09/2026 |
| Marco de encerramento | 1ª apresentação à banca (14/09/2026) |

### 1. Entregas concluídas e aceitas

- Banco PostgreSQL com 8 modelos relacionais e migrations versionadas.
- 10 endpoints REST (veículos, peças, acessórios, categorias, modelos, contato).
- Catálogo de peças/acessórios com **compatibilidade por modelo**.
- Telas públicas do catálogo com Pinia e ícones Lucide.
- Plano de implementação (F0, F3–F6) e 1ª apresentação.

### 2. Entregas não concluídas (transferidas)

| Pacote | Transferido para | Motivo |
|--------|------------------|--------|
| 1.1.5 Lint, testes e CI | Antes da F3 (ação A1) | Priorização das entregas funcionais |
| Swagger/OpenAPI | Dívida técnica (CR-04) | Redução de escopo aprovada |

### 3. Lições aprendidas

| # | O que aconteceu | Lição | Aplicar em |
|---|-----------------|-------|-----------|
| L1 | Prisma conectou na porta errada (MariaDB) e travou a F1 | Documentar **gotchas** de infraestrutura assim que aparecem | Todas as fases |
| L2 | Imagens externas quebraram por hotlink | Não depender de recursos de terceiros que não controlamos | F5 (upload de imagens) |
| L3 | Unificar peça e acessório reduziu muito o código | Modelar pelo **comportamento**, não pelo nome do negócio | F3/F4 |
| L4 | Deixar testes para depois gerou atraso acumulado em F0 | Qualidade precisa estar no início da fase, não no fim | F3 em diante |
| L5 | `plan.md` com "Pronto quando" facilitou a verificação | Critérios de aceitação escritos **antes** de codar | Todas as fases |
| L6 | Roteiro da 1ª apresentação citou a F3 como "em andamento" sem código | Status apresentado deve vir do relatório de desempenho | 2ª apresentação |

### 4. Recursos liberados / transições

- Ambiente de banco mantido (necessário para as próximas fases).
- Equipe realocada para: documentação PMBOK (Integração/Escopo) e F5 (auth).

### 5. Aceite do encerramento da fase

| Nome | Papel | Data |
|------|-------|------|
| Luiz Henrique Mota | Gerente do projeto | 14/09/2026 |
| Professor(a) | Patrocinador | |

---

## Parte B — Checklist de encerramento do projeto (a preencher em 12/2026)

- [ ] Todas as entregas E1–E7 aceitas (ver [Verificar o Escopo](../04-Monitoramento-e-Controle/Verificar-Escopo.md)).
- [ ] Sistema publicado em URL pública e entregue ao patrocinador.
- [ ] Senhas padrão trocadas e segredos fora do código.
- [ ] README final permite subir o projeto do zero.
- [ ] Todas as mudanças (CR) fechadas — aprovadas implementadas ou rejeitadas.
- [ ] Dívidas técnicas remanescentes documentadas.
- [ ] Lições aprendidas consolidadas de todas as fases.
- [ ] Repositório arquivado com a tag `v1.0.0`.
- [ ] Termo de encerramento assinado pela equipe e pelo patrocinador.
