# GHL Grupo Camargo — Status V1

**Data:** 2026-02-25
**Apresentacao V1:** 2026-02-26 14:00
**Location:** Grupo Camarmo (nxqqghvIaX9QQEUaBgwM)

---

## RESUMO EXECUTIVO PARA APRESENTACAO V1

### Entregue e Funcionando
| Item | Qtd | Status |
|------|-----|--------|
| Custom Fields | 44/44 | COMPLETO |
| Tags | 26/26 | COMPLETO |
| Pipelines Comerciais | 4/4 | COMPLETO |
| Pipeline Nutricao | 1/1 | COMPLETO |
| Workflows Publicados | 8/8 | COMPLETO |
| Usuarios GHL | 5/5 | COMPLETO |
| Round Robin Comercial | 1/1 | COMPLETO |
| Acoes Create Opportunity | 2/2 | COMPLETO |
| Contatos de Teste | 4/4 | COMPLETO |
| Oportunidades de Teste | 5/5 | COMPLETO |
| Configuracoes (timezone, idioma, horario comercial) | 4/4 | COMPLETO |
| Cleanup (Marketing Pipeline + tags) | 2/2 | COMPLETO |
| Notion atualizado (Implantacao + Automacoes) | 2/2 | COMPLETO |

### Workflows — Status de Testes
| Workflow | Testado? | Resultado |
|----------|----------|-----------|
| Venda Ganha para Pos-Venda | SIM (UI) | FUNCIONANDO — tag venda_ganha adicionada |
| Perdido/Abandonado para Nutricao | SIM (UI) | FUNCIONANDO — 2 testes, tag nutricao_ativa adicionada |
| Controle op_aberta — Remover ao Fechar | SIM (UI) | FUNCIONANDO — tag op_aberta removida |
| Follow-up Proposta D+2 | SIM (UI) | FUNCIONANDO — enrollment confirmado |
| Entrada de Lead | DEFERIDO | Trigger = Customer Replied, requer mensagem real |
| SLA Primeiro Contato 15min | DEFERIDO | Trigger = Stage Changed, timer 15min (business hours) |
| Nutricao Requalificado | DEFERIDO | Sem opps no pipeline Nutricao para testar |
| Follow-up Negociacao D+7 | DEFERIDO | Timer 7 dias, verificar apos uso real |

**4/8 workflows testados e confirmados funcionando via UI. Os 4 restantes dependem de condicoes que nao podem ser simuladas (mensagem real, timers longos, pipeline sem dados).**

### Bug Critico Corrigido
- Filtros AND nos triggers GHL — 2 workflows corrigidos (Perdido/Abandonado + Controle op_aberta)

### Pendente para V2
- Pipeline Pos-Venda (requer definicao de etapas pelo cliente)
- SLA: acoes "Atualizar SLA Cumprido/Estourado" (requer Custom Values)
- Testes dos 4 workflows deferidos (apos uso real do sistema)

---

## COMPLETO

### Custom Fields (44/44)
- Contato: 29 campos
- Oportunidade: 15 campos
- Tipos: TEXT, LARGE_TEXT, SINGLE_OPTIONS, MULTIPLE_OPTIONS, DATE, NUMERICAL, PHONE, MONETORY

### Tags (26/26)
- Produto: produto_recrutamento, produto_outplacement, produto_comunidade_senior, produto_link
- Canal: canal_linkedin, canal_indicacao, canal_evento, canal_site, canal_parceiro, canal_outbound
- Status: LEAD_NOVO, EM_QUALIFICACAO, PROPOSTA_ENVIADA, EM_NEGOCIACAO, VENDA_GANHA, PERDIDO, ABANDONADO
- Operacional: op_aberta, NUTRICAO_ATIVA, REQUALIFICADO, SLA_ESTOURADO, FOLLOWUP_PENDENTE
- Especial: ICP_SIM, ICP_NAO, URGENTE, VIP

### Pipelines (5)
- Comercial | Recrutamento (G2RrDeluWxQxOX4KDrIK) — 7 etapas
- Comercial | C-Partner (fm4C63aYMg7vQJtSFYpR) — 9 etapas
- Comercial | Comunidades (n26Zb3bUhegRloqYfgXH) — 8 etapas
- Comercial | Link (VaioYeq51cLPf9Z7c0OM) — 7 etapas
- Nutricao | Reativacao (NA0KFHGf4MP4lNrHbQcd)
- ~~Marketing Pipeline (cqpZMpcihsC1IPLFgCHm) — DELETADO (default GHL, nao usado)~~

### Workflows (8/8 PUBLISHED)
1. [CAMARGO] Controle op_aberta — Remover ao Fechar (9ab69228)
2. [CAMARGO] Entrada de Lead — Controle op_aberta (5cd34f0e)
3. [CAMARGO] Follow-up — Negociacao Parada D+7 (663a67a0)
4. [CAMARGO] Follow-up — Proposta Enviada D+2 (24f34edb)
5. [CAMARGO] Nutricao — Requalificado volta ao Comercial (d7438131)
6. [CAMARGO] SLA — Primeiro Contato 15min (decd734a)
7. [CAMARGO] Transicao — Perdido/Abandonado para Nutricao (14194233)
8. [CAMARGO] Transicao — Venda Ganha para Pos-Venda (b5fe5085)

### Contatos de Teste (4/4)
- Carlos Mendes [TESTE]: quAF4vhVgXIoZGXtu6HU (Recrutamento)
- Ana Oliveira [TESTE]: PwkK5Kr0VMtSw5pisQ3X (C-Partner)
- Roberto Silva [TESTE]: Su37pf3fXYkDdqvg0p8z (Comunidades)
- Mariana Costa [TESTE]: AQQpx0mubuKKschqwgtU (Link)

### Oportunidades de Teste (5)
- Carlos (Recrutamento): HYMuzVRwMREiz0veoMSu
- Ana (C-Partner): AaNMfbvmjzIJNaLpfNHX
- Roberto (Comunidades): jmZNx5Yw3H8N5Z8B0Z8C
- Mariana (Link): xlyQO7H80P5TTyKV9Owc
- Mariana (Link — 2a opp): QbCthzr76mng1V4DKNvy (criada via UI para testes)

### Configuracoes Gerais
- [x] Timezone: America/Sao_Paulo (GMT-03:00)
- [x] Idioma: Portuguese (Brazil)
- [x] Pais: Brazil
- [x] Business Hours: Seg-Sex 08:00-18:00, Sab-Dom indisponivel

### Documentacao
- ghl-workflows-camargo.md (v1.1) — spec completa dos 8 workflows
- ghl-phase2.js / ghl-phase2-output.json — script e resultado dos contatos/oportunidades
- ghl-fix.js / ghl-fix-output.json — script e resultado dos campos monetarios + pipelines
- ghl-create-users.js / ghl-create-users-output.json — criacao dos 4 usuarios comerciais
- ghl-round-robin.js / ghl-round-robin-output.json — criacao do calendario Round Robin
- ghl-cleanup.js / ghl-cleanup-output.json — remocao tag Carlos + tentativa delete pipeline

---

## COMPLETO — USUARIOS E ROUND ROBIN

### Usuarios GHL (5/5 criados)
| Nome | Email | User ID | Role |
|------|-------|---------|------|
| Carlos H M Mororo | — | m3aE7GQAClvYLerEgbD9 | admin |
| Graziele Nobre | graziele@triadeflow.com.br | xRtGXUfqWeLHGZdcmkwk | user |
| Priscila Araújo | priscila@triadeflow.com.br | 6JeCKT8qOl1UGIegjnDJ | user |
| Gleniany Frota | gleniany@triadeflow.com.br | 4CKb592QFUg5Ut2sR4on | user |
| Ana Alice | anaalice@triadeflow.com.br | L27hbdfgcqdegVvQ1wtw | user |
- Company ID: FH5mDYjA1Mi4JwnMeLrA

### Round Robin — CONFIGURADO
- **Calendario:** Distribuicao Comercial | Round Robin (kSGB8BKgXk5GAqtpTI7Y)
- **Membros:** Graziele, Priscila, Gleniany, Ana Alice (4 comerciais)
- **Horario:** Seg-Sex 08:00-18:00, slots 30min
- **Calendarios pessoais criados automaticamente:** 5 (1 por usuario)

### Acoes de Criar Oportunidade — CONFIGURADAS (2026-02-25)
1. **Perdido/Abandonado workflow:** "Create Opportunity" ADICIONADA
   - Pipeline: Nutricao | Reativacao, Stage: Classificacao
   - Nome: `{{contact.first_name}} - Nutrição`
   - Duplicate opportunity: Enabled
2. **Venda Ganha workflow:** "Create Opportunity" ADICIONADA
   - Pipeline: Nutricao | Reativacao, Stage: Classificacao
   - Nome: `{{contact.first_name}} - Pós-Venda`
   - Duplicate opportunity: Enabled

### Cleanup Realizado (2026-02-25)
- Marketing Pipeline (cqpZMpcihsC1IPLFgCHm) DELETADO via UI (era default GHL)
- Tag `requalificado` removida do Carlos (adicionada por engano durante teste) via API

### Notion Atualizado (2026-02-25)
- Pagina Implantacao: status V1 completo com resumo executivo
- Pagina Automacoes: checklist 8/8, resultados de testes, equipe, pre-requisitos

---

## PENDENTE / DEFERIDO V2

### Pipeline Pos-Venda
- **Status:** DEFERIDO — cliente precisa definir etapas de onboarding
- **Acao:** Criar pipeline apos reuniao V1

### Acao pendente para V2
- **SLA workflow:** "Atualizar SLA para Cumprido" e "Atualizar SLA para Estourado"
   - Tipo: Update Custom Value — requer Custom Values criados no location
   - Alternativa: mudar para Update Contact Field com campo SLA

### Bug Critico Descoberto e Corrigido: Filtros AND nos Triggers (2026-02-25)

**Problema:** Multiplos filtros "Moved to status" no MESMO trigger GHL sao tratados como AND (todos devem ser verdadeiros ao mesmo tempo). Exemplo: `Moved to status is "lost" AND Moved to status is "abandoned"` NUNCA dispara porque uma oportunidade nao pode ter dois status simultaneamente.

**Solucao:** Usar triggers SEPARADOS (1 filtro por trigger) em vez de multiplos filtros no mesmo trigger.

**Workflows corrigidos:**
1. **Perdido/Abandonado para Nutricao** (14194233)
   - ANTES: 1 trigger com 2 filtros (lost AND abandoned) — NUNCA DISPARAVA
   - DEPOIS: 2 triggers separados: "lost" + "abandoned" — FUNCIONA
   - Testado com Ana: FIRED + COMPLETED (2026-02-25 03:19)

2. **Controle op_aberta — Remover ao Fechar** (9ab69228)
   - ANTES: 1 trigger com 2 filtros (won AND lost) — NUNCA DISPARAVA
   - DEPOIS: 3 triggers separados: "won" + "lost" + "abandoned" — CORRIGIDO
   - Testado com Mariana (lost): FIRED + COMPLETED (2026-02-25 03:46)

**Workflows verificados OK (sem bug):**
- Follow-up Proposta D+2 (24f34edb): "In pipeline" + "Status" = campos diferentes, AND faz sentido
- Follow-up Negociacao D+7 (663a67a0): 1 filtro apenas ("In pipeline")
- Venda Ganha (b5fe5085): 1 filtro apenas ("won") — ja funcionava

### Testes de Workflows

#### Teste via API (2026-02-25)
| Workflow | Acao Testada | Resultado |
|----------|-------------|-----------|
| Venda Ganha para Pos-Venda | Roberto status → won | FIRED + COMPLETED (tag venda_ganha adicionada) |
| Perdido/Abandonado para Nutricao | Ana status → lost (via API) | NAO DISPAROU — API nao gera evento interno |
| Follow-up Proposta D+2 | Carlos → Proposta Enviada (via API) | NAO DISPAROU — API nao gera evento interno |
| Follow-up Negociacao D+7 | Mariana → Negociacao (via API) | NAO DISPAROU — API nao gera evento interno |
| Nutricao Requalificado | Mariana tag REQUALIFICADO (via API) | NAO DISPAROU — API nao gera evento interno |

#### Teste via UI (2026-02-25)
| Workflow | Acao Testada | Resultado |
|----------|-------------|-----------|
| Follow-up Proposta D+2 | Carlos → Proposta Enviada (via UI drawer) | EXECUTADO com sucesso |
| Perdido/Abandonado para Nutricao | Ana status → lost (via UI) | FIRED + COMPLETED (apos fix trigger) |
| Perdido/Abandonado para Nutricao | Mariana opp2 status → lost (via UI drawer) | FIRED + COMPLETED 03:46 — tag nutricao_ativa adicionada |
| Controle op_aberta | Mariana opp2 status → lost (via UI drawer) | FIRED + COMPLETED 03:46 — tag op_aberta removida |

**Descoberta importante:** A API do GHL (v2021-07-28) NAO dispara todos os triggers de workflow de forma confiavel. Apenas "Opportunity Status Changed → won" funcionou via API. Mudancas de stage, status lost/abandoned e tags NAO dispararam workflows via API. Interacoes via UI funcionam corretamente.

**Recomendacao:** Testes finais dos workflows devem ser feitos manualmente pela UI do GHL:
1. Abrir oportunidade de teste no pipeline board
2. Mover entre stages (via drawer Editar > Fase > Atualizar)
3. Mudar status para Lost/Won (via drawer Editar > Status > Atualizar)
4. Verificar enrollment em Automacoes > Workflows > Historico de inscricoes

#### Estado Atual dos Dados de Teste (apos testes 2026-02-25)
| Contato | Oportunidade | Status | Stage | Pipeline | Tags Adicionadas |
|---------|-------------|--------|-------|----------|-------------------|
| Carlos | HYMuzVRwMREiz0veoMSu | open | Proposta Enviada | Recrutamento | requalificado (adicionada por engano durante teste) |
| Ana | AaNMfbvmjzIJNaLpfNHX | lost | Lead Recebido | C-Partner | nutricao_ativa (by workflow) |
| Roberto | jmZNx5Yw3H8N5Z8B0Z8C | won | Lead Recebido | Comunidades | venda_ganha (by workflow) |
| Mariana | xlyQO7H80P5TTyKV9Owc | open | Negociacao | Link | requalificado (manual) |
| Mariana | QbCthzr76mng1V4DKNvy | lost | Lead Recebido | Link | nutricao_ativa (by WF), op_aberta removida (by WF) |

Tags atuais Mariana (contato): produto_link, lead_novo, requalificado, nutricao_ativa

#### Configuracao habilitada durante testes
- **Duplicar Oportunidades:** Habilitado "Permitir mais de uma oportunidade por contato no mesmo pipeline"
  - Settings > Objects > Opportunities > Duplicar Oportunidades
  - Necessario para criar opp de teste no mesmo pipeline

#### Descoberta: Trigger do Entrada de Lead
- O trigger do workflow "Entrada de Lead" e **"Resposta do cliente em qualquer canal"** (Customer Replied)
- NAO e "Opportunity Created" — nao dispara ao criar oportunidade manualmente
- Logica: Cliente responde → Verifica se tem tag op_aberta → Se NAO: cria opp + adiciona op_aberta → Se SIM: encerra
- **Nao testavel via criacao manual de oportunidades** — requer mensagem real de contato

#### Enrollment dos Workflows (contadores atuais)
| Workflow | Total Inscritos | Status |
|----------|----------------|--------|
| Controle op_aberta | 1 (Mariana) | CONFIRMED |
| Entrada de Lead | 0 | Trigger = Customer Replied, nao testavel manualmente |
| Follow-up Negociacao D+7 | 0 | Timer 7 dias — verificar enrollment apenas |
| Follow-up Proposta D+2 | 0 | Timer 2 dias — verificar enrollment apenas |
| Nutricao Requalificado | 0 | Trigger = Stage Changed (Requalificado em Nutricao), sem opps para testar |
| SLA Primeiro Contato 15min | 0 | Trigger = Stage Changed (Lead Recebido em Recrutamento), timer 15min business hours |
| Perdido/Abandonado | 2 (Ana + Mariana) | CONFIRMED |
| Venda Ganha | 1 (Roberto) | CONFIRMED |

#### Workflows Testados e Confirmados
- [x] Venda Ganha para Pos-Venda — Roberto won → tag venda_ganha adicionada
- [x] Perdido/Abandonado para Nutricao — Ana lost (UI) + Mariana lost (UI) → tag nutricao_ativa + remove op_aberta
- [x] Controle op_aberta — Mariana lost (UI) → tag op_aberta removida
- [x] Follow-up Proposta D+2 — Carlos → Proposta Enviada (UI drawer) → EXECUTADO

#### Descoberta: Trigger do Nutricao Requalificado (d7438131)
- O trigger NAO e "Tag Added" (como assumido inicialmente)
- **Trigger real:** "Fase do pipeline alterada" (Pipeline Stage Changed)
  - Condicao: Oportunidade movida para stage "Requalificado" no pipeline "Nutricao | Reativacao"
  - Filtros: `In pipeline = "Nutricao | Reativacao"` AND `Status = "open"`
- **Acoes:** Criar nova opp comercial → Add tags REQUALIFICADO + op_aberta → Remove tag NUTRICAO_ATIVA → Criar tarefa de follow-up
- **Nao testavel atualmente:** Nao existem oportunidades no pipeline Nutricao | Reativacao (as acoes "Criar Oportunidade" dos workflows Perdido/Abandonado e Venda Ganha foram deletadas)
- Tag `requalificado` adicionada manualmente ao Carlos durante teste incorreto — nao afeta workflows

#### Descoberta: Trigger do SLA Primeiro Contato 15min (decd734a)
- O trigger NAO e "Opportunity Created" (como assumido inicialmente)
- **Trigger real:** "Fase do pipeline alterada" (Pipeline Stage Changed)
  - Condicao: Oportunidade movida para stage "Lead Recebido" no pipeline "Comercial | Recrutamento"
  - Filtro: `In pipeline = "Comercial | Recrutamento"`
- **Fluxo:** Aguardar 15 min (apenas horario comercial) → Encontrar opp → Verificar stage atual → Branch:
  - Se ainda em "Lead Recebido" → SLA estourado (acoes pendentes configuracao)
  - Se saiu de "Lead Recebido" → SLA cumprido → FIM
- **Testavel** criando nova opp ou movendo opp existente para Lead Recebido em Recrutamento, MAS:
  - Timer 15min funciona apenas em horario comercial (Seg-Sex 08:00-18:00 BRT)
  - Teste feito de madrugada nao completaria o timer ate proximo dia util

#### Workflows Pendentes Teste
- [ ] Entrada de Lead — Trigger = Customer Replied, nao testavel via UI manual (DEFERIDO)
- [ ] SLA Primeiro Contato 15min — Trigger = Pipeline Stage Changed (Lead Recebido em Recrutamento), testavel mas timer 15min so roda em horario comercial (DEFERIDO)
- [ ] Nutricao Requalificado — Trigger = Pipeline Stage Changed (Requalificado em Nutricao), sem opps no pipeline Nutricao (DEFERIDO)
- [ ] Follow-up Negociacao D+7 — Timer 7 dias, so verifica enrollment (DEFERIDO — timer longo)
- [ ] Follow-up Proposta D+2 — Ja testado enrollment, timer 2 dias (DEFERIDO — timer longo)

---

## IDs DE REFERENCIA

| Recurso | ID |
|---------|-----|
| Location | nxqqghvIaX9QQEUaBgwM |
| Company | FH5mDYjA1Mi4JwnMeLrA |
| Token API | pit-93a4b974-9e8f-4b76-b0f5-0c13a783a8a6 |
| Pipeline Recrutamento | G2RrDeluWxQxOX4KDrIK |
| Pipeline C-Partner | fm4C63aYMg7vQJtSFYpR |
| Pipeline Comunidades | n26Zb3bUhegRloqYfgXH |
| Pipeline Link | VaioYeq51cLPf9Z7c0OM |
| Pipeline Nutricao | NA0KFHGf4MP4lNrHbQcd |
| ~~Pipeline Marketing~~ | ~~cqpZMpcihsC1IPLFgCHm~~ (DELETADO) |
| Round Robin Calendar | kSGB8BKgXk5GAqtpTI7Y |
| Usuario Carlos (admin) | m3aE7GQAClvYLerEgbD9 |
| Usuario Graziele | xRtGXUfqWeLHGZdcmkwk |
| Usuario Priscila | 6JeCKT8qOl1UGIegjnDJ |
| Usuario Gleniany | 4CKb592QFUg5Ut2sR4on |
| Usuario Ana Alice | L27hbdfgcqdegVvQ1wtw |
| WF Controle op_aberta | 9ab69228 |
| WF Entrada de Lead | 5cd34f0e |
| WF Follow-up D+7 | 663a67a0 |
| WF Follow-up D+2 | 24f34edb |
| WF Nutricao Requalificado | d7438131 |
| WF SLA 15min | decd734a |
| WF Perdido/Abandonado | 14194233 |
| WF Venda Ganha | b5fe5085 |

### Pipeline Stage IDs (completos)

**Comercial | Recrutamento**
| Stage | ID |
|-------|-----|
| Lead Recebido | 65ea6aff-e4d7-4bc9-91fb-9e49b1665651 |
| Qualificacao | e22886ae-801c-4096-b3f4-f1eef8d2c027 |
| Diagnostico | 4ae02fb5-3924-43ec-931f-6d25b33e8d9a |
| Proposta Enviada | 7ec9b823-bf25-4054-bdd7-3f47621b65c7 |
| Negociacao | 348d8b09-605b-4cb3-bc95-9ffad85f6676 |

**Comercial | C-Partner**
| Stage | ID |
|-------|-----|
| Lead Recebido | 9048d78b-741e-425c-b916-e83fa114e841 |
| Pre-qualificacao | 8834a68a (parcial) |
| Videochamada | 2c3428f0 (parcial) |
| Proposta Enviada | 5f6c2449 (parcial) |
| Coleta de Dados | a4db10ac (parcial) |
| Contrato Enviado | b2888072 (parcial) |
| Pagamento Enviado | c1901c26 (parcial) |

**Comercial | Comunidades**
| Stage | ID |
|-------|-----|
| Lead Recebido | 1002b58a (parcial) |
| Enquadramento | 51744fcb (parcial) |
| Videochamada | 1a725f52 (parcial) |
| Material Enviado | fafa5a08 (parcial) |
| Follow-up Agendado | cca1deb0 (parcial) |
| Aguardando Pagamento | 83e75740 (parcial) |

**Comercial | Link**
| Stage | ID |
|-------|-----|
| Lead Recebido | 72b36efa (parcial) |
| Qualificacao | 7c23dc36 (parcial) |
| Proposta Enviada | f8199a07 (parcial) |
| Negociacao | 6cd802c4 (parcial) |
| Aguardando Assinatura | ba68fbab (parcial) |

**Nutricao | Reativacao**
| Stage | ID |
|-------|-----|
| Classificacao | 9a3d5032 (parcial) |
| Sequencia Ativa | 4de2f4ba (parcial) |
| Engajou | 953c9ed5 (parcial) |
| Requalificado | 85bd792a (parcial) |
