# 🏎 Chiquinho Motors® — Roteiro da 2ª Apresentação
### Gerenciamento da Integração e do Escopo (PMBOK)
**Duração total: ~15 minutos + perguntas · 3 apresentadores · 14 slides**

> [!IMPORTANT]
> **Divisão dos apresentadores**
> - 🔴 **P1 — Francisco** → Abertura, situação, Termo de Abertura e Plano de Gerenciamento (slides 1–4) · ~4 min
> - 🟡 **P2 — Luiz** → Requisitos, rastreabilidade, Declaração de Escopo e EAP (slides 5–8) · ~5 min
> - 🟢 **P3 — Alex** → Execução, monitoramento, mudanças, verificação, controle do escopo e encerramento (slides 9–14) · ~6 min
>
> As mesmas falas estão nas **notas do apresentador** de cada slide. Todos os artefatos citados estão em `docs/gerenciamento/`.

---

## 🔴 P1 — Francisco · slides 1–4 · ~4 min

### Slide 1 — Capa · 0:30
*[Aguardar a atenção da sala antes de começar.]*

> "Boa tarde. Na primeira apresentação mostramos **o que** é o Chiquinho Motors. Hoje mostramos **como** o projeto é gerenciado: as áreas de **Integração** e de **Escopo** do PMBOK, com os artefatos reais do nosso projeto — tudo está no repositório, na pasta `docs/gerenciamento`.
>
> Eu sou o Francisco, esse é o Luiz e o Alex."

### Slide 2 — Onde estamos · 0:30
*[Apontar a linha de fases e depois os números.]*

> "Recapitulando: as fases F0 a F5 estão concluídas e aceitas — catálogo, carrinho, agendamento e o painel administrativo completo. A F6, qualidade e publicação, está pronta: falta só colocar no ar.
>
> Isso dá **97% dos pacotes de produto**, com **94 testes automatizados**. E registramos **10 mudanças** ao longo do caminho — vamos mostrar como elas foram controladas."

### Slide 3 — Termo de abertura · 1:30

> "O Termo de Abertura formaliza o projeto. Ele traz a **justificativa**: concessionárias que gerenciam veículos, peças e serviços em planilhas separadas perdem até **30%** das vendas de peças e serviços.
>
> O **objetivo** é um sistema web que integra os quatro negócios num só banco relacional, desdobrado em cinco objetivos SMART — um por grande entrega.
>
> As **restrições**: prazo até dezembro, custo zero e a stack definida. E a **autoridade**: o professor é o patrocinador e o Luiz é o gerente do projeto — é ele quem aprova as mudanças de baixo impacto.
>
> O termo também traz os marcos e os riscos de alto nível."

### Slide 4 — Plano de gerenciamento · 1:30

> "O Plano de Gerenciamento integra tudo. O ciclo de vida é **iterativo**, em 7 fases — cada uma é uma entrega que funciona.
>
> Ele reúne os planos auxiliares: o escopo, com declaração e EAP; a configuração, em que cada pacote da EAP vira um Pull Request revisado; o cronograma das 7 fases; a qualidade, com validação, testes, CI e Lighthouse; a comunicação; e uma matriz de riscos com resposta definida.
>
> E ele fixa as **linhas de base**: escopo, cronograma e custo. Qualquer alteração nelas precisa passar pelo controle de mudanças — que o Alex vai mostrar.
>
> Passo a palavra para o Luiz."

---

## 🟡 P2 — Luiz · slides 5–8 · ~5 min

### Slide 5 — Coleta de requisitos · 1:00

> "Obrigado, Francisco. Para coletar os requisitos usamos análise de documentos, brainstorming, benchmarking com marketplaces de autopeças e prototipação das telas.
>
> Chegamos a **17 requisitos funcionais**, escritos como histórias de usuário — por exemplo: *'como cliente, quero filtrar peças pelo modelo do meu carro'* — e priorizados com **MoSCoW**: Must, Should, Could.
>
> E a **12 requisitos não funcionais**, como: o estoque nunca pode ficar negativo, mesmo com dois pedidos chegando ao mesmo tempo. Esse vira teste automatizado — mostramos daqui a pouco."

### Slide 6 — Matriz de rastreabilidade · 1:00

> "Para cada requisito, a matriz de rastreabilidade responde três perguntas: qual **objetivo** do termo de abertura ele atende, qual **pacote da EAP** o entrega e qual é a **evidência** de que ele foi cumprido — um endpoint, uma tela ou um teste.
>
> Por exemplo: o requisito de estoque nunca negativo está ligado ao objetivo O2, ao pacote 1.4.2, e a evidência é um teste que dispara cinco pedidos simultâneos do último item em estoque: só um passa.
>
> Assim sabemos exatamente o que já foi atendido e o que falta — sem achismo."

### Slide 7 — Declaração de escopo · 1:30

> "A Declaração de Escopo diz o que o sistema entrega: são **9 entregas** — o catálogo, o carrinho com pedido, o agendamento, o painel administrativo, a qualidade e a publicação, e a documentação. Cada uma tem um critério de aceitação objetivo, por exemplo: *'dois agendamentos nunca ocupam o mesmo horário'*.
>
> E, tão importante quanto: o que **não** faremos. Pagamento online, nota fiscal, aplicativo mobile, financiamento, frete e cadastro de cliente com senha ficaram de fora — por custo, prazo e segurança.
>
> Quando alguém sugere uma dessas ideias, a resposta é: só entra com uma solicitação de mudança aprovada. Isso protege o projeto do *scope creep*."

### Slide 8 — Estrutura analítica do projeto (EAP) · 1:30
*[Apontar o topo e depois percorrer as caixas.]*

> "A EAP é orientada a **entregas**, não a tarefas. No topo, o projeto; abaixo, as 7 fases de produto — da fundação técnica até a publicação — mais o pacote de gerência do projeto, que inclui estes documentos e as apresentações.
>
> As fases se decompõem em **29 pacotes de produto**. A regra do nível mais baixo é simples: um pacote tem que caber em **um Pull Request**. Assim cada pacote é verificável sozinho.
>
> E o Dicionário da EAP traz, para cada pacote, a descrição, o critério de aceitação, o responsável e o esforço estimado.
>
> Hoje só falta um pacote: publicar o sistema. Passo a palavra para o Alex."

---

## 🟢 P3 — Alex · slides 9–14 · ~6 min

### Slide 9 — Orientar e gerenciar a execução · 1:00

> "Obrigado, Luiz. Na execução, todo trabalho nasce de um pacote da EAP. Ele vira uma branch, depois um Pull Request; o CI roda lint, testes e build, outro integrante revisa, e só então entra no `main` — e a EAP é atualizada.
>
> Mantemos dois registros: o **log de entregas**, que liga cada entrega ao commit e ao pacote, e o **log de problemas**. Exemplos reais: o banco estava apontando para a porta de um MariaDB; as fotos externas eram bloqueadas por hotlink e passaram a ser servidas localmente; e o segredo do login do admin estava fixo no código — corrigimos tornando obrigatório."

### Slide 10 — Monitorar e controlar o trabalho · 1:30

> "No monitoramento, comparamos o planejado com o realizado. Nosso relatório de desempenho mostra **97% dos pacotes de produto** concluídos — falta só publicar.
>
> Mas o relatório também mostrou um **desvio**: o lint, os testes e a integração contínua da F0 atrasaram cerca de 7 semanas. A **ação corretiva** foi fechar isso *antes* de começar o carrinho.
>
> E a ação teve efeito: com 94 testes automatizados rodando a cada Pull Request — incluindo testes ponta a ponta no navegador —, o carrinho, o agendamento e o painel ficaram prontos semanas antes do início planejado. Qualidade no começo acelera, não atrasa."

### Slide 11 — Controle integrado de mudanças · 1:30
*[Mostrar o fluxo e depois a tabela.]*

> "Toda mudança passa por um fluxo: alguém registra a solicitação, a equipe analisa o impacto em escopo, prazo e qualidade, e o gerente decide — ou, se o impacto for alto, o comitê com consulta ao professor. Aprovada, ela atualiza as linhas de base.
>
> Registramos **10 mudanças**. Alguns exemplos: unificar peça e acessório num só modelo de dados; antecipar o login do painel — aprovada **com condições**, como tirar o segredo do código antes do deploy; e mudar a grade da agenda para seguir a duração de cada serviço, porque a solução do plano deixava dois agendamentos se sobreporem.
>
> Teve também uma que encerramos sem usar: a contingência de prazo — com o adiantamento, ela deixou de ser necessária. E uma ainda proposta: hospedar o sistema no Coolify, onde o banco já está."

### Slide 12 — Aceite formal das entregas · 1:00

> "Verificar o escopo é obter o **aceite formal** de cada entrega. Não basta o código existir: a entrega é demonstrada, o checklist *'Pronto quando'* é conferido item a item, e sempre que possível há um teste automatizado provando o critério.
>
> Seis entregas estão aceitas. A F0 é um bom exemplo: ela primeiro recebeu **aceite parcial** — faltavam testes e CI — e só foi aceita depois da ação corretiva.
>
> A publicação está com aceite parcial: tudo pronto e testado, falta a URL pública. E a documentação PMBOK — estes artefatos — é a entrega que pedimos o aceite formal de vocês hoje."

### Slide 13 — Análise de variação · 1:00

> "Controlar o escopo é comparar o que foi feito com a linha de base — a declaração de escopo e a EAP — e impedir mudanças que ninguém aprovou.
>
> Na análise de variação, cada diferença entre o planejado e o realizado está coberta: ou por uma mudança aprovada, ou por uma ação corretiva. O Swagger, por exemplo, saiu da F2 com o CR-04; o atraso dos testes virou a ação A1; a grade da agenda mudou com o CR-08.
>
> O indicador que mais importa: **zero mudanças implementadas sem registro**. Nenhum Pull Request entrou sem um pacote da EAP correspondente."

### Slide 14 — Lições e próximos passos · 1:00
*[Tom mais calmo e conclusivo.]*

> "Para fechar: encerramos formalmente a fase Fundação e Catálogo, e registramos as lições aprendidas do projeto. Três se destacam: qualidade no começo da fase acelera, não atrasa; regras críticas — como estoque e agenda — precisam de teste com acessos simultâneos; e é preciso medir com a mesma ferramenta do critério de aceite, não *'no olho'*.
>
> Os próximos passos são poucos: publicar o sistema seguindo o guia de deploy, que já está pronto e testado; obter o aceite da publicação e desta documentação; e fechar com a versão 1.0 e o termo de encerramento.
>
> O repositório completo está no GitHub. Obrigado — estamos abertos a perguntas."

---

## ⏱ Mapa de tempo

| Slide | Tema | Apresentador | Tempo |
|:-----:|------|:------------:|:-----:|
| 1 | Capa | Francisco | 0:30 |
| 2 | Onde estamos | Francisco | 0:30 |
| 3 | Termo de abertura | Francisco | 1:30 |
| 4 | Plano de gerenciamento | Francisco | 1:30 |
| 5 | Coleta de requisitos | Luiz | 1:00 |
| 6 | Matriz de rastreabilidade | Luiz | 1:00 |
| 7 | Declaração de escopo | Luiz | 1:30 |
| 8 | EAP | Luiz | 1:30 |
| 9 | Orientar e gerenciar a execução | Alex | 1:00 |
| 10 | Monitorar e controlar o trabalho | Alex | 1:30 |
| 11 | Controle integrado de mudanças | Alex | 1:30 |
| 12 | Aceite formal das entregas | Alex | 1:00 |
| 13 | Análise de variação | Alex | 1:00 |
| 14 | Lições e próximos passos | Alex | 1:00 |
| — | **Perguntas** | Todos | ~3:00 |
| | **Total** | | **~15 min + perguntas** |

---

## ❓ Perguntas prováveis da banca (e quem responde)

| Pergunta | Quem | Resposta curta |
|----------|:----:|----------------|
| Por que o login do painel foi antecipado? | Luiz | As telas de pedidos e agenda dependem de rotas protegidas; foi o CR-05, aprovado com condições, sem mudar o prazo final. |
| Como vocês garantem que o estoque não fica negativo? | Alex | A baixa é condicional dentro de uma transação; um teste dispara 5 pedidos simultâneos do último item e só um passa. |
| O que acontece se alguém pedir pagamento online agora? | Luiz | Está na lista de exclusões; só entra com solicitação de mudança e análise de impacto (custo, segurança, prazo). |
| Por que a F0 atrasou 7 semanas? | Alex | Priorizamos as entregas funcionais (F1/F2); o relatório de desempenho apontou o desvio e a ação corretiva A1 o fechou antes da F3. |
| O sistema está no ar? | Francisco | Ainda não: a configuração de deploy está pronta e testada; falta publicar com as contas da equipe (CR-10). |

---

> [!TIP]
> - Ensaiem as passagens de palavra ("Passo a palavra para…") — quem recebe já começa falando.
> - Os slides são apoio: olhem para a banca, não para a tela.
> - Se der tempo, abram o repositório no slide 14 e mostrem `docs/gerenciamento/`.
> - Se surgir uma pergunta no meio, respondam em uma frase e retomem.
