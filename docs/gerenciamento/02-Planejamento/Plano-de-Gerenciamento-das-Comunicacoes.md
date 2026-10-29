# Plano de Gerenciamento das Comunicações

> **Processo PMBOK:** 10.2 Planejar as comunicações
> **Área:** Gerenciamento das Comunicações · **Grupo:** Planejamento
> **Versão:** 1.0 · 29/10/2026

Define **quem precisa de qual informação, quando, em que formato, por qual
canal e quem envia** — e onde a informação fica guardada depois. Detalha a
§8 do [Plano de Gerenciamento do Projeto](Plano-de-Gerenciamento-do-Projeto.md)
a partir do [Registro das Partes Interessadas](../01-Iniciacao/Registro-das-Partes-Interessadas.md).

A execução deste plano está em:

- [Distribuição das Informações](../03-Execucao/Distribuicao-das-Informacoes.md) — *10.3*
- [Gerenciamento das Expectativas](../03-Execucao/Gerenciamento-das-Expectativas.md) — *10.4*
- [Relatório de Desempenho](../04-Monitoramento-e-Controle/Relatorio-de-Desempenho.md) — *10.5*

---

## 1. Princípios

1. **O repositório é a fonte da verdade.** Se não está no GitHub, não
   aconteceu (decisões, mudanças, atas, relatórios).
2. **Escrito vence falado.** Combinado em reunião ou no grupo vira
   registro curto em issue ou documento.
3. **Informação certa para cada público:** a equipe precisa de detalhe
   técnico; o patrocinador, de situação e riscos; a banca, de história e
   demonstração.

## 2. Requisitos de informação

| Parte interessada | Precisa saber | Para quê |
|-------------------|---------------|----------|
| PI-01 Professor(a) | Progresso, desvios, riscos, mudanças de alto impacto, artefatos PMBOK | Avaliar e aprovar |
| PI-02 Banca / turma | Problema, solução, arquitetura, como o PMBOK foi aplicado | Avaliar a apresentação |
| PI-03/04/05 Equipe | Pacotes designados, prazos, convenções, decisões técnicas, falhas do CI | Executar o trabalho |
| PI-06/07/08 Personas | Como usar o sistema | Validar o produto (representadas pela equipe) |

## 3. Matriz de comunicação

| # | Comunicação | Conteúdo | Emissor | Público | Frequência | Canal / formato | Tipo |
|---|-------------|----------|---------|---------|-----------|-----------------|:----:|
| C01 | Reunião semanal | Feito / a fazer / impedimentos; designação de pacotes | GP | Equipe | Semanal, 30 min | Presencial ou vídeo + **ata em issue** (`reuniao`) | Interativa |
| C02 | Pull Request | O que mudou, pacote da EAP, definição de pronto | Autor(a) | Revisor(a) + equipe | A cada pacote | GitHub PR (template) | Interativa |
| C03 | Resultado do CI | Lint, testes, build, E2E, auditoria | GitHub Actions | Autor(a) do commit | A cada push/PR | E-mail e aba *Checks* | Push |
| C04 | Avisos rápidos | Bloqueios, mudança de horário, pedido de revisão | Qualquer um | Equipe | Quando surgir | Grupo da equipe | Push |
| C05 | Solicitação de mudança | Formulário CR-XX | Qualquer um | GP / CCM | Quando surgir | Issue (`mudança`) + log de mudanças | Interativa |
| C06 | Relatório de desempenho | Situação, desvios, previsão, riscos | GP | Patrocinador + equipe | A cada fase e antes de cada apresentação | Markdown em `docs/gerenciamento/04-…` | Pull |
| C07 | Relatório de qualidade / auditoria | Métricas e não conformidades | GP | Equipe + patrocinador | Por fase | Markdown em `docs/gerenciamento/` | Pull |
| C08 | Apresentação | Slides + demonstração | Equipe (3 blocos) | Professor(a) + banca | 3 no semestre | `.pptx` + sistema rodando | Interativa |
| C09 | Notas de versão | O que entrou em cada versão | GP | Todos | A cada entrega | `CHANGELOG.md` | Pull |
| C10 | Documentação do produto | Como instalar, rodar, publicar e usar a API | Equipe | Equipe, avaliadores, futuros desenvolvedores | Mantida a cada PR | `README.md`, `docs/DEPLOY.md` | Pull |
| C11 | Escalonamento | Problema que a equipe não resolve | GP | Professor(a) | Quando surgir (§5) | Conversa em aula ou e-mail institucional | Interativa |

**Tipos (PMBOK):** *interativa* = troca em mão dupla; *push* = enviada a
quem precisa; *pull* = fica disponível para quem quiser consultar.

## 4. Canais de comunicação

Com 4 pessoas ativas (3 da equipe + patrocinador), há
n(n − 1)/2 = **6 canais** possíveis: 3 entre os integrantes (cobertos por
C01, C02 e C04) e 3 de cada integrante com o patrocinador. Para não
fragmentar a informação, o patrocinador recebe o status **pelo GP** (C06,
C11); os três falam diretamente com ele só nas apresentações (C08).

## 5. Escalonamento

| Nível | Situação | Prazo para resolver | Quem resolve |
|:-----:|----------|:-------------------:|--------------|
| 1 | Dúvida técnica ou pedido de revisão parado | 48 h | Entre os integrantes (C04) |
| 2 | Pacote atrasado, conflito, impedimento | Até a próxima reunião | GP (C01) |
| 3 | Mudança de alto impacto ou conflito não resolvido | 1 semana | Professor(a) (C11) |

## 6. Padrões de documento

- Markdown com o cabeçalho de processo PMBOK usado em `docs/gerenciamento/`.
- Datas em `dd/mm/aaaa`; IDs com prefixo (CR-, AQ-, RH-, PI-, EX-).
- Commits em Conventional Commits; PRs com o template da qualidade.
- **Modelo de ata (C01)**, uma issue por reunião:

```markdown
**Reunião de dd/mm** · presentes: Luiz, Alex, Francisco
**Feito desde a última:** …
**Próximos pacotes (quem / prazo):** …
**Impedimentos e decisões:** …
```

## 7. Armazenamento e destinação final

| Informação | Onde fica | Retenção / destino ao encerrar |
|-----------|-----------|-------------------------------|
| Código, documentação, artefatos PMBOK | Repositório GitHub | Mantido público; tag da versão final |
| Atas, mudanças, discussões | Issues e PRs do GitHub | Mantidos (histórico do repositório) |
| Slides e roteiros | `docs/` | Mantidos no repositório |
| Credenciais (`.env`, senhas de produção) | Fora do Git, só com os responsáveis | **Revogar/trocar** no encerramento |
| Mensagens do grupo da equipe | Aplicativo de mensagens | Não é registro oficial; o que importa vira issue |
| Dados do site publicado (pedidos, agendamentos de teste) | Banco PostgreSQL | Apagar ou desligar o ambiente ao fim da disciplina |

## 8. Restrições e premissas

- Dedicação parcial: comunicação **assíncrona** é a padrão; reunião só uma por semana.
- Custo zero: apenas ferramentas gratuitas (GitHub, grupo de mensagens, vídeo).
- Para participar dos canais C02, C03 e C05, o integrante precisa ser
  colaborador no repositório.

## 9. Revisão do plano

Revisado a cada fase ou quando uma parte interessada reclamar de falta (ou
excesso) de informação.
