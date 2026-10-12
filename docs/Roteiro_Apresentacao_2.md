# 🏎 Chiquinho Motors® — Roteiro da 2ª Apresentação
### Gerenciamento da Integração e do Escopo (PMBOK)
**Duração total: ~15 minutos · 3 apresentadores**

---

> [!IMPORTANT]
> **Divisão dos apresentadores:**
> - 🔴 **P1 — Francisco** → Recapitulação, TAP e Plano de Gerenciamento (Slides 1–4) — ~4 min
> - 🟡 **P2 — Luiz** → Requisitos, Escopo e EAP (Slides 5–8) — ~5 min
> - 🟢 **P3 — Alex** → Execução, Monitoramento, Mudanças, Verificação e Encerramento (Slides 9–14) — ~6 min
>
> Todos os artefatos citados estão em `docs/gerenciamento/`.

---

## 🔴 P1 — Francisco · Slides 1–4 · (~4 min)

### SLIDE 1 — CAPA
> "Boa tarde. Na primeira apresentação mostramos **o que** é o Chiquinho Motors. Hoje mostramos **como o projeto é gerenciado**: as áreas de **Integração** e **Escopo** do PMBOK, com os artefatos reais do nosso projeto."

### SLIDE 2 — ONDE ESTAMOS
*[Mostrar o quadro de fases F0–F6.]*
> "Recapitulando: F0 a F4 concluídas e aceitas — inclusive carrinho e agendamento —, e a F5 — painel administrativo — já tem a autenticação pronta. Isso vai aparecer mais adiante no controle de mudanças."

### SLIDE 3 — TERMO DE ABERTURA
*[Fonte: `01-Iniciacao/Termo-de-Abertura.md`]*
> "O Termo de Abertura formaliza o projeto: a **justificativa** — concessionárias com dados em planilhas perdem até 30% das vendas de peças e serviços —, os **objetivos SMART**, as **restrições** — prazo até dezembro e custo zero —, os **marcos** e quem tem autoridade. O professor é o patrocinador; o Luiz é o gerente do projeto."

### SLIDE 4 — PLANO DE GERENCIAMENTO
*[Fonte: `02-Planejamento/Plano-de-Gerenciamento-do-Projeto.md`]*
> "O Plano de Gerenciamento integra tudo: ciclo de vida **iterativo** em 7 fases, gerenciamento de configuração com Git e Pull Requests, cronograma, qualidade, comunicação e uma matriz de **riscos** com resposta definida. Ele também define as **linhas de base** — e qualquer mudança nelas precisa passar pelo controle de mudanças. Passo para o Luiz."

---

## 🟡 P2 — Luiz · Slides 5–8 · (~5 min)

### SLIDE 5 — COLETAR REQUISITOS
*[Fonte: `02-Planejamento/Documentacao-de-Requisitos.md`]*
> "Coletamos requisitos com análise de documentos, brainstorming, benchmarking com marketplaces de autopeças e prototipação. Chegamos a **17 requisitos funcionais**, escritos como histórias de usuário e priorizados com **MoSCoW**, e **12 não funcionais** — por exemplo, estoque nunca negativo e dois agendamentos nunca no mesmo horário."

### SLIDE 6 — MATRIZ DE RASTREABILIDADE
> "Cada requisito está ligado a um **objetivo do TAP**, a um **pacote da EAP** e a uma **evidência** — um endpoint, uma tela ou um teste. Assim sabemos exatamente o que já foi atendido e o que falta."

### SLIDE 7 — DECLARAÇÃO DE ESCOPO
*[Fonte: `02-Planejamento/Declaracao-de-Escopo.md`]*
> "A Declaração de Escopo lista **9 entregas** com critérios de aceitação objetivos. E, tão importante quanto: o que **não** faremos — pagamento online, nota fiscal, app mobile, financiamento, frete. Isso protege o projeto do *scope creep*."

### SLIDE 8 — EAP
*[Fonte: `02-Planejamento/EAP.md` — mostrar o diagrama.]*
> "A EAP é orientada a **entregas**: 7 fases de produto mais o gerenciamento, decompostas em **29 pacotes de produto**. A regra é: um pacote cabe em **um Pull Request**. O Dicionário da EAP traz, para cada pacote, descrição, critério de aceitação, responsável e esforço. Passo para o Alex."

---

## 🟢 P3 — Alex · Slides 9–14 · (~6 min)

### SLIDE 9 — ORIENTAR E GERENCIAR A EXECUÇÃO
*[Fonte: `03-Execucao/Orientar-e-Gerenciar-Execucao.md`]*
> "Na execução, todo trabalho sai de um pacote da EAP, vira uma branch e um PR revisado. Mantemos um **log de entregas** ligado aos commits e um **log de problemas** — como o banco apontando para a porta errada e as imagens bloqueadas por hotlink."

### SLIDE 10 — MONITORAR E CONTROLAR
*[Fonte: `04-Monitoramento-e-Controle/Monitorar-e-Controlar-o-Trabalho.md`]*
> "Nosso relatório de desempenho mostra **76% dos pacotes de produto concluídos**. Identificamos um desvio: lint, testes e CI da F0 atrasaram cerca de 7 semanas. A ação corretiva foi fechá-los **antes** de começar o carrinho — hoje são 47 testes automatizados rodando no GitHub Actions a cada Pull Request. E a correção do desvio teve efeito: carrinho e agendamento ficaram prontos semanas antes do planejado."

### SLIDE 11 — CONTROLE INTEGRADO DE MUDANÇAS
*[Fonte: `Controle-Integrado-de-Mudancas.md` — mostrar o fluxograma e o log.]*
> "Toda mudança passa por um fluxo: solicitação, análise de impacto e decisão do comitê. Registramos **8 mudanças**. Exemplos: unificar peça e acessório num só modelo, tirar o Swagger da F2, e **antecipar a autenticação do painel** — aprovada com condições, como corrigir o segredo do JWT antes do deploy. Outra boa: mudamos a grade da agenda para seguir a duração de cada serviço, porque a solução do plano deixava dois agendamentos se sobreporem. E uma adiada: a contingência de prazo, que com o adiantamento provavelmente não será necessária."

### SLIDE 12 — VERIFICAR O ESCOPO
*[Fonte: `Verificar-Escopo.md`]*
> "Verificar o escopo é obter o **aceite formal**. F1 e F2 foram aceitas com todos os critérios atendidos. A F0 primeiro recebeu **aceite parcial** — faltavam testes e CI — e só foi aceita depois da ação corretiva. A autenticação do painel foi verificada com testes automatizados."

### SLIDE 13 — CONTROLAR O ESCOPO
*[Fonte: `Controlar-Escopo.md`]*
> "Controlar o escopo é comparar o realizado com a linha de base. Na análise de variação, toda diferença está coberta por uma mudança aprovada ou por uma ação corretiva — **zero mudanças sem registro**."

### SLIDE 14 — ENCERRAR FASE + PRÓXIMOS PASSOS
*[Fonte: `05-Encerramento/Encerramento-de-Fase.md`]*
> "Encerramos formalmente a fase Fundação e Catálogo com **lições aprendidas** — a principal: qualidade no começo da fase, não no fim. Próximos passos: completar o painel administrativo, testes ponta a ponta e o deploy público em dezembro. Obrigado — estamos abertos a perguntas."

---

## ⏱ Mapa de Tempo

| Slide | Tema | Apresentador | Tempo |
|-------|------|:------------:|:-----:|
| 1–2 | Capa e situação | P1 | 1:00 |
| 3 | Termo de Abertura | P1 | 1:30 |
| 4 | Plano de Gerenciamento | P1 | 1:30 |
| 5–6 | Requisitos e rastreabilidade | P2 | 2:00 |
| 7 | Declaração de Escopo | P2 | 1:30 |
| 8 | EAP | P2 | 1:30 |
| 9–10 | Execução e Monitoramento | P3 | 2:00 |
| 11 | Controle de Mudanças | P3 | 1:30 |
| 12–13 | Verificar e Controlar o Escopo | P3 | 1:30 |
| 14 | Encerramento e próximos passos | P3 | 1:00 |
| — | **Perguntas** | Todos | ~3:00 |
