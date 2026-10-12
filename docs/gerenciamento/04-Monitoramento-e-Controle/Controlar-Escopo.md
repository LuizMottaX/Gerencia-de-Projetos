# Controlar o Escopo

> **Processo PMBOK:** 5.6 Controlar o escopo
> **Área:** Gerenciamento do Escopo · **Grupo:** Monitoramento e Controle
> **Versão:** 1.0 · 12/10/2026

Controlar o escopo é **comparar o que está sendo feito com a linha de base**
(Declaração de Escopo + EAP + Dicionário) e impedir mudanças não
autorizadas (*scope creep*) ou trabalho extra não pedido (*gold plating*).

---

## 1. Mecanismos de controle

| Mecanismo | Como funciona no projeto |
|-----------|-------------------------|
| **Linha de base versionada** | Escopo e EAP ficam no Git; qualquer alteração aparece no histórico |
| **Todo PR referencia um pacote da EAP** | Trabalho sem pacote correspondente é sinal de *scope creep* |
| **Revisão de PR** | O revisor checa se o PR entrega só o que o pacote pede |
| **Lista de exclusões** | A Declaração de Escopo diz explicitamente o que **não** será feito |
| **Controle integrado de mudanças** | Qualquer alteração na linha de base vira um CR analisado |
| **Análise de variação semanal** | Planejado × realizado na reunião da equipe |

## 2. Análise de variação do escopo (até 12/10/2026)

| Item | Linha de base | Realizado | Variação | Tratamento |
|------|--------------|-----------|----------|-----------|
| Modelo de peças/acessórios | Duas entidades (peça e acessório) | `Produto` unificado | Mudança de solução, mesmo escopo | CR-02 ✅ |
| Imagens | Links externos | Imagens locais | Mudança de solução | CR-03 ✅ |
| Documentação da API | Swagger na F2 | Não feito | **Redução** de escopo | CR-04 ✅ (dívida técnica) |
| Lint/testes/CI | Na F0 | Feito em 12/10 | **Atraso** de ~7 semanas, escopo mantido | Ação corretiva A1 ✅ |
| Sequência das fases | F3 → F4 → F5 | F5 (auth) iniciada antes | Mudança de sequência | CR-05 ✅ |
| Usuário admin | `Usuario` + `PapelUsuario` | `Administrador` | Simplificação dentro do escopo | CR-06 ✅ |
| Grade de horários | Slots de 30 min + `@@unique` | Grade no passo da duração de cada serviço | Mudança de solução (evita sobreposição) | CR-08 ✅ |
| E-mail de confirmação do agendamento | Opcional na F4 | Não feito (WhatsApp na confirmação) | Item opcional não entregue | Sem CR — era opcional |
| Dashboard admin | Indicadores (estoque baixo, pedidos) | Tela de boas-vindas | Incompleto — pacote ainda em andamento | Acompanhar em 1.6.4 |
| Links "Pedidos (F3)" e "Serviços (F4)" no menu admin | — | Links para telas que não existem | Antecipação de UI sem pacote | ✅ Desabilitados ("em breve") até F3/F4 |

## 3. Pedidos de escopo recusados ou fora do escopo

Itens que surgiram em conversas e **não entram** sem um CR aprovado:

| Ideia | Motivo para ficar de fora |
|-------|--------------------------|
| Pagamento online (Pix/cartão) | Excluído na Declaração de Escopo — custo, segurança, prazo |
| App mobile | Excluído — o site é responsivo |
| Simulação de financiamento | Excluído — não está nos requisitos de negócio |
| Login de cliente | Excluído — cliente identificado por e-mail |

## 4. Indicadores de controle

| Indicador | Valor atual | Meta |
|-----------|:-----------:|:----:|
| PRs sem pacote da EAP | 0 | 0 |
| Mudanças implementadas sem CR | 0 | 0 |
| CRs registrados / aprovados / adiados | 8 / 7 / 1 | — |
| Pacotes de produto concluídos | 22 / 29 (76%) | 100% em 12/2026 |

## 5. Resultados do controle

- Linha de base do escopo **atualizada** com CR-02 a CR-06.
- **Ação corretiva A1** (lint/testes/CI) concluída antes de expandir o escopo com a F3.
- Links do menu admin para telas de F3/F4 desabilitados até essas fases serem entregues.
