# Distribuir Informações

> **Processo PMBOK:** 10.3 Distribuir informações
> **Área:** Gerenciamento das Comunicações · **Grupo:** Execução
> **Versão:** 1.0 · data de corte: 29/10/2026

Coloca a informação à disposição das partes interessadas **como previsto**
no [Plano de Gerenciamento das Comunicações](../02-Planejamento/Plano-de-Gerenciamento-das-Comunicacoes.md)
e registra o que foi efetivamente distribuído.

---

## 1. Métodos e ferramentas

| Método | Ferramenta | Comunicações |
|--------|-----------|--------------|
| Reuniões | Presencial / vídeo | C01, C08 |
| Repositório (pull) | GitHub: README, `docs/`, `CHANGELOG.md` | C06, C07, C09, C10 |
| Notificações (push) | E-mails do GitHub (PRs, CI) | C02, C03 |
| Mensagens | Grupo da equipe | C04 |
| Apresentações | Slides `.pptx` + demonstração | C08 |

## 2. Registro das informações distribuídas

Levantado do histórico do repositório.

| Data | Comunicação | O quê | Público | Evidência |
|------|-------------|-------|---------|-----------|
| 20/08/2026 | C10 | Ciclo de vida e plano de implementação | Equipe | `e862de6` |
| 27/08/2026 | C10 | `AGENTS.md` (regras do projeto) e README com PostgreSQL | Equipe | `66ee733`, `5d7b885` |
| 10/09/2026 | C10 | Plano de implementação das entregas pendentes | Equipe | `7509a96` |
| 14/09/2026 | C08 | **1ª apresentação** (visão, arquitetura, roadmap) | Professor(a), banca | `05ec8f0` |
| 12/10/2026 | C06 | Artefatos de Integração e Escopo + relatório de desempenho nº 2 | Patrocinador, equipe | `07be25c` |
| 12/10/2026 | C09 | `CHANGELOG.md` criado | Todos | `d8cc979` |
| 12/10/2026 | C03 | CI no GitHub Actions passa a avisar o autor a cada push | Equipe | `d8cc979` |
| 15/10/2026 | C02 | PR #7 (F0–F6 consolidado) e PR #8 (slides) | Equipe | PRs #7, #8 |
| 15/10/2026 | C08 | Slides e roteiro da **2ª apresentação** (Integração e Escopo) | Professor(a), banca | `a970835`, `a27bee3` |
| 22/10/2026 | C07 | Plano, auditoria nº 1 e relatório nº 1 da qualidade | Patrocinador, equipe | PR #9 |
| 22/10/2026 | C10 | README com setup via Docker e WSL | Equipe | `5b06e21` |
| 29/10/2026 | C06 | Artefatos de Recursos Humanos e avaliação da equipe nº 1 | Patrocinador, equipe | PR #10 |
| 29/10/2026 | C06 | Artefatos de Comunicações + relatório de desempenho nº 3 | Patrocinador, equipe | este PR |

## 3. Aderência ao plano

| Comunicação | Previsto | Realizado | Situação |
|-------------|----------|-----------|:--------:|
| C01 Reunião semanal com ata | 1 ata por semana | **0 atas** no GitHub | ❌ |
| C02 PR revisado | Todo pacote via PR revisado | 10 PRs, **0** com revisão; 12 commits diretos na `main` | ❌ |
| C03 Aviso do CI | A cada push/PR | Ativo desde 12/10; todas as execuções na `main` com sucesso | ✅ |
| C05 Mudança por issue | Issue com rótulo `mudança` | 12 mudanças registradas só no log; **0 issues** abertas | ⚠️ |
| C06 Relatório de desempenho | Por fase / apresentação | Nº 2 (12/10) e nº 3 (29/10) | ✅ |
| C07 Qualidade | Por fase | Relatório e auditoria nº 1 | ✅ |
| C08 Apresentações | 3 no semestre | 2 preparadas (14/09 e outubro); final em dezembro | ✅ |
| C09 `CHANGELOG.md` | A cada entrega | Atualizado em todos os PRs desde 12/10 | ✅ |
| C10 README / DEPLOY | A cada PR | Atualizados | ✅ |
| Acesso aos canais do GitHub | Os 3 integrantes colaboradores | Colaboradores: Luiz e Alex. **Francisco não é colaborador** | ❌ |

**Leitura:** a comunicação **escrita e para fora** (relatórios, changelog,
apresentações) funciona bem. A comunicação **dentro da equipe** é a lacuna:
não há registro das reuniões, as revisões não acontecem e um integrante não
tem acesso ao repositório — por isso não recebe PRs, avisos do CI nem
pedidos de revisão. Ações em [Gerenciamento das Expectativas](Gerenciamento-das-Expectativas.md)
(EX-03) e no log de questões de RH (RH-02 a RH-04).

## 4. Lições aprendidas

- Quem não está no repositório fica de fora de quase todos os canais do
  plano — acesso é pré-requisito de comunicação, não detalhe técnico.
- O que só foi combinado em conversa não pode ser mostrado ao patrocinador;
  uma ata de 3 linhas resolve.
