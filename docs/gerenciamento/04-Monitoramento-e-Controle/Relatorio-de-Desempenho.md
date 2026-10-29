# Relatar o Desempenho

> **Processo PMBOK:** 10.5 Relatar o desempenho
> **Área:** Gerenciamento das Comunicações · **Grupo:** Monitoramento e Controle
> **Relatório de desempenho nº 3** · data de corte: 29/10/2026

Coleta e **distribui** as informações de desempenho — situação, progresso
e previsões — para as partes interessadas, conforme a comunicação C06 do
[Plano de Gerenciamento das Comunicações](../02-Planejamento/Plano-de-Gerenciamento-das-Comunicacoes.md).
O relatório anterior (nº 2, 12/10/2026) está em
[Monitorar e Controlar o Trabalho](Monitorar-e-Controlar-o-Trabalho.md) (4.5).

---

## 1. Como o desempenho é relatado

| Item | Definição |
|------|-----------|
| **Público** | Professor(a) (patrocinador) e equipe |
| **Frequência** | A cada fase e antes de cada apresentação |
| **Fontes** | EAP, log de execução, histórico do Git/GitHub Actions, relatórios de qualidade, logs de mudanças e de questões |
| **Conteúdo** | Situação (onde estamos) · progresso (o que foi feito no período) · previsão (onde vamos chegar) · riscos e questões |
| **Distribuição** | Este arquivo na `main` + resumo na apresentação |

## 2. Situação — painel resumido

| Dimensão | Indicador | Linha de base | Atual | Status |
|----------|-----------|---------------|-------|:------:|
| Escopo | Pacotes de produto da EAP concluídos | 29 | 28 (97%) — falta o deploy | 🟡 |
| Cronograma | Fases concluídas × planejado para 29/10 | F0–F2 concluídas, F3 em andamento | F0–F5 concluídas (F3–F5 adiantadas) | ✅ |
| Custo | Gasto financeiro | R$ 0,00 | R$ 0,00 | ✅ |
| Qualidade | Testes passando (M01) | 100% | 94 / 94 | ✅ |
| Qualidade | CI com sucesso na `main` (M07) | 100% | 100% das execuções | ✅ |
| Qualidade | Cobertura do frontend (M04) | ≥ 50% | 9,1% | ❌ |
| Processo | PRs com revisão de outro integrante (M08) | 100% | 0 de 10 | ❌ |
| Equipe | Integrantes com acesso ao repositório | 3 | 2 | ❌ |
| Gerenciamento | Áreas PMBOK documentadas | Todas as da disciplina | Integração, Escopo, Qualidade, RH, Comunicações | 🟡 |

## 3. Progresso no período (12/10 – 29/10)

| Entrega | Data | Evidência |
|---------|------|-----------|
| F0–F6 consolidadas na `main` | 15/10 | PR #7 |
| Slides da 2ª apresentação | 15/10 | PR #8 |
| Qualidade (PMBOK 8.1–8.3): plano, auditoria nº 1, relatório nº 1; correção de vulnerabilidade crítica | 22/10 | PR #9 |
| README com Docker e WSL | 22/10 | `5b06e21` |
| Recursos humanos (PMBOK 9.1–9.4) | 29/10 | PR #10 |
| Comunicações (PMBOK 10.1–10.5) | 29/10 | este PR |

Nenhuma entrega de produto nova no período — o esforço foi para
qualidade e gerenciamento, como previsto depois de F3–F5 terem sido
adiantadas.

## 4. Análise de variação

| Variação | Causa | Efeito |
|----------|-------|--------|
| F3, F4 e F5 entregues ~4 a 8 semanas antes da linha de base | Concentração de esforço do GP em outubro | Folga no cronograma; risco R1 (prazo) praticamente eliminado |
| Deploy (1.7.3) parado desde 12/10 | CR-10 sem decisão; depende de contas da equipe | Critério de sucesso "URL pública" em aberto (EX-01) |
| Revisão por pares e atas não acontecem | Proteção da `main` desativada (AM-06); sem rotina de ata | Controles do plano da qualidade e das comunicações sem efeito |
| Cobertura do frontend 9,1% | Testes de componentes só nos fluxos críticos | Métrica M04 fora da meta |

## 5. Previsão

| Item | Previsão | Condição |
|------|----------|----------|
| Publicação (1.7.3) | Até 22/11 | Decidir CR-10 e designar responsável na reunião de 30/10 |
| Artefatos PMBOK restantes (cronograma, custos, riscos, aquisições) | Até 22/11 | Divididos entre os três (Mobilização §4) |
| Encerramento e lições aprendidas (1.8.5) | 13/12 | Deploy concluído |
| **Término do projeto** | **Dentro do prazo** (dez/2026) | Sem novas mudanças de alto impacto |

## 6. Riscos e questões em destaque

| ID | Descrição | Tendência |
|----|-----------|:---------:|
| R7 | Trabalho concentrado no GP | → estável (ações RH-01 abertas) |
| R8 | Semana de provas reduz capacidade (23/11 – 06/12) | ↑ se aproximando |
| EX-01 | Sistema sem URL pública | → estável |
| EX-03 / RH-03 | Francisco sem acesso ao repositório | → estável |
| AM-06 | Proteção da `main` desativada | → estável |

## 7. Pedidos ao patrocinador

Nenhuma decisão de alto impacto pendente. A equipe informa que a
distribuição do trabalho está sendo corrigida (RH-01) e que o deploy é a
última entrega de produto.

Próximo relatório: nº 4, antes da apresentação final.
