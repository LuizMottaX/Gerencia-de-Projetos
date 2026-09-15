# 🏎 Chiquinho Motors® — Roteiro de Apresentação
### Disciplina: Gerência de Projetos · Sistemas de Informação
**Duração total: ~15 minutos · 3 apresentadores**

---

> [!IMPORTANT]
> **Divisão dos apresentadores:**
> - 🔴 **P1 — Francisco** → Abertura, Problema & Solução (Slides 1–3) — ~4 min
> - 🟡 **P2 — Luiz** → Arquitetura, Roadmap & Diferenciais (Slides 4–6) — ~5 min
> - 🟢 **P3 — Alex** → Proposta de Valor, PMBOK, Demo & Encerramento (Slides 7–11) — ~6 min

---

## 🔴 P1 — Francisco · Slides 1, 2 e 3 · (~4 min)

### SLIDE 1 — CAPA
*[Projetar o slide. Aguardar a atenção da sala antes de começar.]*

> "Boa tarde a todos. Hoje apresentamos o **Chiquinho Motors** — um sistema integrado de gestão para concessionárias automotivas, desenvolvido como projeto da disciplina de Gerência de Projetos do curso de Sistemas de Informação.
>
> Meu nome é Francisco, esse é o Luiz e o Alex. Ao longo dos próximos 15 minutos, vamos mostrar o que construímos, por que ele é relevante e onde ele pode chegar."

---

### SLIDE 2 — O PROBLEMA
*[Avançar para slide 2. Apontar para cada card conforme menciona.]*

> "Antes de falar da solução, precisamos entender o problema que nos motivou.
>
> Concessionárias tradicionais vivem um cenário fragmentado: veículos, peças e serviços são gerenciados em **planilhas separadas** — sem integração, sem automação. O resultado disso é **zero visibilidade**: o gestor não sabe o que tem em estoque, quais peças servem em qual modelo, quais horários de serviço estão livres.
>
> E o cliente? Ele não tem **nenhum canal digital** para consultar peças, comprar acessórios ou agendar uma revisão. Tudo ainda é feito por telefone.
>
> Dados do setor apontam que concessionárias sem sistema integrado perdem **até 30% das oportunidades de venda** de peças e serviços. É exatamente esse gap que o Chiquinho Motors resolve."

---

### SLIDE 3 — A SOLUÇÃO
*[Avançar para slide 3. Apresentar os 4 módulos.]*

> "Nossa solução é um **ecossistema digital completo** com quatro módulos integrados:
>
> — O catálogo de **Veículos**, com fotos, especificações e histórico;
>
> — O catálogo de **Auto-Peças**, com filtro de compatibilidade por modelo de veículo — o cliente seleciona o carro dele e vê apenas as peças que servem;
>
> — O catálogo de **Acessórios**, com busca avançada e detalhes técnicos;
>
> — E o módulo de **Serviços**, com agendamento online de manutenção — o cliente escolhe o serviço, vê os horários livres e reserva em segundos.
>
> Passo a palavra para o Luiz, que vai nos mostrar como isso foi construído."

---

## 🟡 P2 — Luiz · Slides 4, 5 e 6 · (~5 min)

### SLIDE 4 — ARQUITETURA TÉCNICA
*[Avançar para slide 4. Apontar para as 3 camadas.]*

> "Obrigado, Francisco. Vou falar agora sobre a base técnica do projeto.
>
> A arquitetura segue uma separação clara em **três camadas**:
>
> No **Frontend**, usamos Vue 3 com Vite — uma das stacks mais modernas do mercado para SPAs. O estado global é gerenciado pelo Pinia e o roteamento pelo Vue Router. O design é 100% CSS vanilla com a identidade 'Carbon & Racing Red' do projeto — sem dependências externas.
>
> No **Backend**, Node.js com Express expõe uma API REST com mais de 10 endpoints. Toda entrada de dados é validada pelo Zod, e segurança básica é garantida pelo Helmet e pelo Rate Limiter.
>
> E no **Banco de dados**: PostgreSQL 18 hospedado em cloud — Coolify no servidor Hetzner. O acesso é feito via **Prisma ORM**, que nos garante tipagem forte, migrations versionadas e queries seguras contra SQL injection.
>
> A comunicação entre frontend e backend usa o **proxy do Vite** em desenvolvimento — chamadas `/api/*` são redirecionadas automaticamente para a porta 3001, eliminando a necessidade de configurar CORS."

---

### SLIDE 5 — ROADMAP
*[Avançar para slide 5.]*

> "O projeto foi estruturado em **7 fases**, seguindo a metodologia PMBOK com critérios de aceitação claros para cada entrega.
>
> As fases **F1 e F2** já foram concluídas: a base técnica com PostgreSQL e o catálogo completo de peças e acessórios já estão funcionando em produção.
>
> A **F3**, o carrinho de compras e checkout, está em andamento — já temos o modelo de dados definido e os endpoints projetados.
>
> As fases F4 a F6 — agendamento, painel administrativo e deploy público — estão planejadas e documentadas com critérios de aceitação, estimativas de tempo e análise de riscos.
>
> Esse roadmap não é só um quadro bonito: é um **plano gerenciável**, com cada entrega rastreável via Pull Request no GitHub."

---

### SLIDE 6 — DIFERENCIAIS DE MERCADO
*[Avançar para slide 6. Destacar os pontos.]*

> "O que diferencia o Chiquinho Motors de um simples catálogo online?
>
> Primeiro: **compatibilidade inteligente**. Peças e acessórios são vinculados aos modelos de veículo no banco de dados. O cliente nunca compra a peça errada.
>
> Segundo: **arquitetura escalável e de baixo custo**. Vue 3, Node.js e PostgreSQL são tecnologias open-source com enorme comunidade. O custo de infra é mínimo.
>
> Terceiro: a **API é extensível**. Com 10+ endpoints REST documentados, o sistema está pronto para integrar com ERPs, marketplaces e aplicativos mobile.
>
> Quarto: **UX exclusiva e dark mode nativo** — sem frameworks CSS de terceiros, sem dependências frágeis.
>
> Quinto: **cloud-ready desde o primeiro dia**. O banco já está na Hetzner, o deploy do frontend está configurado para Vercel e o backend para Railway.
>
> E sexto, fundamental para esta disciplina: o projeto segue o **ciclo completo do PMBOK** — do Termo de Abertura ao Encerramento. Passo a palavra para o Alex."

---

## 🟢 P3 — Alex · Slides 7, 8, 9, 10 e 11 · (~6 min)

### SLIDE 7 — PROPOSTA DE VALOR / MÉTRICAS
*[Avançar para slide 7.]*

> "Obrigado, Luiz. Vou trazer agora os números que resumem o que construímos e os benefícios concretos para o negócio.
>
> **10 endpoints REST** documentados e funcionando — veículos, peças, acessórios, categorias, modelos e contato.
>
> **4 módulos de negócio** integrados em um único sistema.
>
> **100% relacional** — nenhum dado fica em arquivo plano ou em memória. Tudo no PostgreSQL, com integridade referencial garantida.
>
> E **7 fases de entrega** planejadas conforme o PMBOK.
>
> Na prática, isso se traduz em três benefícios diretos: eliminação do retrabalho com estoque e catálogo; transações financeiras seguras com controle de concorrência via Prisma; e um sistema preparado para crescer — carrinho, painel admin e agendamento já estão no roadmap com especificações completas."

---

### SLIDE 8 — GESTÃO PMBOK
*[Avançar para slide 8.]*

> "Falar em Gerência de Projetos sem mostrar a gestão seria incompleto.
>
> Aplicamos os **5 grupos de processos do PMBOK** ao projeto:
>
> Na **Iniciação**: o Termo de Abertura e o Registro de Partes Interessadas definem o escopo, os responsáveis e os stakeholders.
>
> No **Planejamento**: temos a EAP — Estrutura Analítica de Projeto — derivada das fases F0 a F6, com cronograma, estimativas de horas e plano de riscos.
>
> Na **Execução**: cada entrega é rastreada via Pull Request. Os checklists de cada fase no `plan.md` funcionam como controle de trabalho.
>
> No **Monitoramento e Controle**: os critérios 'Pronto quando' de cada fase são os nossos critérios de aceitação. Toda mudança de escopo é documentada.
>
> E no **Encerramento**: a fase F6 é a entrega formal — com deploy público, README atualizado e lições aprendidas.
>
> Todos esses artefatos vivem na pasta `docs/gerenciamento/` do repositório."

---

### SLIDE 9 — DEMONSTRAÇÃO
*[Avançar para slide 9. Se possível, abrir o sistema ao vivo.]*

> "Agora, uma rápida demonstração.
>
> [*Se ao vivo:*] Abrindo o sistema em `localhost:5173`... Aqui está a **Home** com o catálogo de veículos. Vou navegar para **Auto-Peças** — vejam o grid com filtros por categoria e modelo de veículo. Ao selecionar um modelo, apenas as peças compatíveis aparecem. Clicando em um produto, vemos os detalhes, a compatibilidade e o preço formatado em reais.
>
> [*Se estático:*] Esses placeholders representam as três telas principais do sistema: a Home com o catálogo de veículos, a tela de Peças com filtragem por modelo, e a tela de Detalhe de Produto com informações de compatibilidade.
>
> A experiência é limpa, rápida e responsiva — construída com Vue 3 e sem nenhuma dependência de CSS pesada."

---

### SLIDE 10 — PRÓXIMOS PASSOS
*[Avançar para slide 10.]*

> "O sistema já funciona. Mas ele tem ainda mais potencial a ser explorado.
>
> Com o **F3**, o carrinho de compras, o sistema se torna transacional: o cliente adiciona peças ao carrinho, finaliza o pedido e recebe um código de rastreio. O estoque é decrementado automaticamente em uma transação atômica — sem inconsistências.
>
> Com o **F4**, o agendamento online: o cliente escolhe o serviço, vê os horários realmente disponíveis e reserva. Dois clientes não conseguem ocupar o mesmo horário — garantia de consistência no banco.
>
> Com o **F5**, o painel administrativo: a concessionária gerencia tudo — catálogo, pedidos e agenda — sem tocar no código, com autenticação JWT e controle de permissões.
>
> E com o **F6**: CI/CD com GitHub Actions, deploy no Vercel e Railway, URL pública acessível por qualquer avaliador sem instalar nada."

---

### SLIDE 11 — ENCERRAMENTO
*[Avançar para slide 11. Tom mais calmo e conclusivo.]*

> "Para concluir: o Chiquinho Motors é um ecossistema digital completo para concessionárias modernas. Ele resolve um problema real, com uma arquitetura técnica sólida, um roadmap claro e uma gestão de projeto fundamentada no PMBOK.
>
> Estamos abertos a perguntas.
>
> O repositório completo está disponível em **github.com/LuizMottaX/Gerencia-de-Projetos**. Qualquer membro da banca pode explorar o código, o plano de projeto e os artefatos de gerenciamento.
>
> Obrigado pela atenção!"

---

## ⏱ Mapa de Tempo

| Slide | Tema                  | Apresentador | Tempo estimado |
|-------|-----------------------|:------------:|:--------------:|
| 1     | Capa                  | P1 – Francisco | 0:30 |
| 2     | O Problema            | P1 – Francisco | 1:30 |
| 3     | A Solução             | P1 – Francisco | 1:30 |
| 4     | Arquitetura           | P2 – Luiz    | 2:00 |
| 5     | Roadmap               | P2 – Luiz    | 1:30 |
| 6     | Diferenciais          | P2 – Luiz    | 1:30 |
| 7     | Proposta de Valor     | P3 – Alex    | 1:30 |
| 8     | PMBOK                 | P3 – Alex    | 1:30 |
| 9     | Demonstração          | P3 – Alex    | 1:30 |
| 10    | Próximos Passos       | P3 – Alex    | 1:00 |
| 11    | Encerramento          | P3 – Alex    | 0:30 |
| —     | **Q&A / Perguntas**   | Todos        | ~3:00 |
| **Total** | | | **~15 min + Q&A** |

---

> [!TIP]
> **Dicas de apresentação:**
> - Pratiquem a transição entre apresentadores com naturalidade — cada um deve já estar pronto quando o anterior terminar.
> - No slide de demonstração (9), se puderem mostrar o sistema ao vivo, muito melhor do que os placeholders.
> - Mantenham contato visual com a banca — os slides são suporte, não roteiro para leitura.
> - Se houver perguntas durante a apresentação, respondam brevemente e retomem o fluxo.
