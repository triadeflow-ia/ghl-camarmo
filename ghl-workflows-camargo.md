# Grupo Camargo — GHL Workflows: Guia de Implementação

**Projeto:** CRM Grupo Camargo — GoHighLevel
**Versão:** 1.1
**Data:** 2026-02-25
**Ambiente:** GoHighLevel Workflow Builder

---

## Índice

1. [Workflow 1 — Entrada de Lead + Controle de Oportunidade](#workflow-1)
2. [Workflow 2 — SLA Primeiro Contato (15 min)](#workflow-2)
3. [Workflow 3 — Follow-up Proposta Enviada (D+2)](#workflow-3)
4. [Workflow 4 — Follow-up Negociação (D+7)](#workflow-4)
5. [Workflow 5 — Transição Comercial → Pós-Venda](#workflow-5)
6. [Workflow 6 — Lost/Abandoned → Nutrição | Reativação](#workflow-6)
7. [Referências: Tags e Custom Fields](#referencias)
8. [Configuração de Horário Comercial](#horario-comercial)

---

## Pré-requisitos Globais

Antes de construir os workflows, garantir que os seguintes itens existam no GHL:

### Pipelines Necessários (6 pipelines — todos criados)
- `Comercial | Recrutamento` — 5 etapas (Lead Recebido → Qualificação → Diagnóstico → Proposta Enviada → Negociação)
- `Comercial | C-Partner` — 7 etapas (Lead Recebido → Pré-qualificação → Videochamada → Proposta Enviada → Coleta de Dados → Contrato Enviado → Pagamento Enviado)
- `Comercial | Comunidades` — 6 etapas (Lead Recebido → Enquadramento → Videochamada → Material Enviado → Follow-up Agendado → Aguardando Pagamento)
- `Comercial | Link` — 5 etapas (Lead Recebido → Qualificação → Proposta Enviada → Negociação → Aguardando Assinatura)
- `Nutrição | Reativação` — 4 etapas (Classificação → Sequência Ativa → Engajou → Requalificado)
- `Pós-Venda` — a criar quando onboarding for definido com cliente
- `Marketing Pipeline` — 6 etapas (pré-existente no GHL)

> **Nota:** Os statuses Won, Lost e Abandoned são NATIVOS do GHL e NÃO são etapas de pipeline. Eles existem como status da oportunidade, ocultos no pipeline view.

### Custom Fields Necessários
- `SLA Primeiro Contato` — tipo: texto ou dropdown (valores: `Cumprido`, `Estourado`)
- `Pipeline de Origem` — tipo: texto (para nota de transição no Workflow 5)

### Tags Necessárias
- `op_aberta`
- `PROPOSTA_ENVIADA`
- `VENDA_GANHA`

### Usuários/Times
- Round Robin configurado no time Comercial
- Usuário ou time `Operações` configurado para Pós-Venda

---

## Workflow 1 — Entrada de Lead + Controle de Oportunidade {#workflow-1}

**Nome no GHL:** `[CAMARGO] Entrada de Lead — Controle op_aberta`
**Objetivo:** Garantir que cada contato que interage gere exatamente uma oportunidade aberta, sem duplicatas.

---

### Trigger

| Campo | Valor |
|-------|-------|
| **Tipo de Trigger** | `Customer Replied` |
| **Canal** | Any (Email, SMS, WhatsApp, Chat — deixar sem filtro de canal para capturar todos) |
| **Filtros adicionais** | Nenhum |

**Como configurar no builder:**
1. Abrir Automation → Workflows → `+ New Workflow`
2. Clicar em `+ Add New Trigger`
3. Selecionar **"Customer Replied"**
4. Em "Filters", deixar sem filtro de canal específico para cobrir todos os canais
5. Salvar o trigger

---

### Condição Principal: Verificar Tag `op_aberta`

**Step 1 — If/Else: Contato já tem op_aberta?**

| Campo | Valor |
|-------|-------|
| **Action Type** | `If/Else` |
| **Condição** | `Contact Tag` → `Contains` → `op_aberta` |

**Como configurar:**
1. Adicionar action `If/Else`
2. Branch **"Yes"** (tag existe): configurar ação de encerramento
3. Branch **"No"** (tag não existe): continuar com criação da oportunidade

---

### Branch YES (Tag op_aberta existe — fluxo encerrado)

**Step 2-YES — End Flow**

| Campo | Valor |
|-------|-------|
| **Action Type** | (nenhuma ação necessária — fim do branch) |

> **Nota:** No GHL, o branch "Yes" simplesmente não terá ações encadeadas. O workflow termina naturalmente neste caminho. Opcionalmente adicionar um passo de `Internal Note` para log: `"Lead ignorado — op_aberta já existente"`.

---

### Branch NO (Tag op_aberta não existe — criar oportunidade)

**Step 2-NO — Criar Oportunidade**

| Campo | Valor |
|-------|-------|
| **Action Type** | `Create Opportunity` |
| **Pipeline** | Selecionar pipeline comercial adequado (ex: `Comercial Recrutamento`) |
| **Stage** | `Lead Recebido` |
| **Status** | `Open` |
| **Nome da Oportunidade** | `{{contact.full_name}} — {{now \| date: "%d/%m/%Y"}}` |
| **Valor** | (deixar em branco ou conforme padrão do negócio) |

**Como configurar:**
1. No branch "No", adicionar action `Create/Update Opportunity`
2. Selecionar o pipeline correto
3. Definir stage inicial como `Lead Recebido`
4. Usar merge field para o nome da oportunidade

> **Nota sobre múltiplos pipelines:** Se o Grupo Camargo tem mais de um pipeline comercial e o roteamento depende da origem do lead (ex: fonte UTM, tipo de produto), adicionar um segundo `If/Else` antes deste step para definir em qual pipeline criar. Exemplo: `If Contact Tag contains "recrutamento" → Pipeline Recrutamento` / `Else → Pipeline Link`.

---

**Step 3-NO — Adicionar Tag op_aberta**

| Campo | Valor |
|-------|-------|
| **Action Type** | `Add Tag` |
| **Tag** | `op_aberta` |

---

**Step 4-NO — Atribuir ao Round Robin**

| Campo | Valor |
|-------|-------|
| **Action Type** | `Assign to User` |
| **Método** | `Round Robin` |
| **Time** | Selecionar time Comercial configurado |

**Como configurar:**
1. Adicionar action `Assign User`
2. Selecionar `Round Robin` como método de atribuição
3. Selecionar o grupo/time de vendedores

---

**Step 5-NO — Criar Tarefa: Primeiro Contato**

| Campo | Valor |
|-------|-------|
| **Action Type** | `Create Task` |
| **Título da Tarefa** | `Primeiro Contato — {{contact.full_name}}` |
| **Descrição** | `Realizar primeiro contato com o lead. Oportunidade criada automaticamente via workflow.` |
| **Prazo** | `+0 days` (mesmo dia) ou `+1 business day` conforme política |
| **Atribuir a** | `Assigned User` (o vendedor atribuído no step anterior) |

---

### Workflow Complementar: Remoção da Tag op_aberta

**Nome no GHL:** `[CAMARGO] Controle op_aberta — Remover ao Fechar`
**Objetivo:** Remover a tag `op_aberta` quando a oportunidade for fechada (Ganha ou Perdida), liberando o contato para gerar nova oportunidade no futuro.

**Trigger:**

| Campo | Valor |
|-------|-------|
| **Tipo de Trigger** | `Opportunity Status Changed` |
| **Filtro de Status** | `Won` OR `Lost` |

**Como configurar:**
1. Criar novo workflow
2. Trigger: `Opportunity Status Changed`
3. Em Filters: `Status` → `Is` → `Won` (adicionar segundo filtro com OR para `Lost`)

**Action:**

| Campo | Valor |
|-------|-------|
| **Action Type** | `Remove Tag` |
| **Tag** | `op_aberta` |

> **Nota:** Este workflow complementar é essencial para o funcionamento correto do Workflow 1. Sem ele, um contato que perdeu ou ganhou uma oportunidade nunca mais gerará uma nova.

---

## Workflow 2 — SLA Primeiro Contato (15 min) {#workflow-2}

**Nome no GHL:** `[CAMARGO] SLA — Primeiro Contato 15min`
**Objetivo:** Monitorar se o lead recebido foi contatado dentro de 15 minutos (horário comercial). Alertar gestor e registrar violação de SLA caso não seja.

---

### Trigger

| Campo | Valor |
|-------|-------|
| **Tipo de Trigger** | `Opportunity Stage Changed` |
| **Pipeline** | Todos os pipelines comerciais (criar um workflow por pipeline, ou usar filtro genérico se disponível) |
| **Stage** | `Lead Recebido` |

**Como configurar:**
1. Trigger: `Opportunity Stage Changed`
2. Filtro: `Pipeline` → selecionar o pipeline comercial
3. Filtro: `New Stage` → `Lead Recebido`

> **Nota sobre múltiplos pipelines:** Se houver mais de um pipeline comercial, criar uma cópia deste workflow para cada pipeline, ou verificar se o GHL permite filtro "any pipeline" no trigger de stage changed. A prática recomendada é um workflow por pipeline para maior clareza.

---

### Step 1 — Wait: 15 Minutos (Horário Comercial)

| Campo | Valor |
|-------|-------|
| **Action Type** | `Wait` |
| **Duração** | `15 minutes` |
| **Tipo de Espera** | `Business Hours` (horário comercial) |
| **Business Hours Schedule** | Selecionar o schedule configurado (ver seção [Configuração de Horário Comercial](#horario-comercial)) |

**Como configurar:**
1. Adicionar action `Wait`
2. Definir duração: 15 minutos
3. Marcar a opção `Business Hours` para que a espera respeite o horário comercial
4. Selecionar o schedule de horário comercial previamente configurado

> **Importante:** "Business Hours" no wait step significa que o timer só conta durante o horário comercial. Se o lead entrar às 17h55 (5 min antes do fim do expediente), o workflow aguardará os 10 minutos restantes para o dia seguinte, no início do expediente.

---

### Step 2 — If/Else: Oportunidade ainda em "Lead Recebido"?

| Campo | Valor |
|-------|-------|
| **Action Type** | `If/Else` |
| **Condição** | `Opportunity Stage` → `Is` → `Lead Recebido` |

> **Como verificar o stage da oportunidade:** No GHL, o If/Else pode checar o stage atual da oportunidade que disparou o workflow usando a condição de oportunidade associada ao contato.

---

### Branch YES (Ainda em Lead Recebido — SLA Estourado)

**Step 3-YES — Atualizar Custom Field: SLA Estourado**

| Campo | Valor |
|-------|-------|
| **Action Type** | `Update Contact Field` (ou `Update Opportunity Field`) |
| **Campo** | `SLA Primeiro Contato` |
| **Valor** | `Estourado` |

**Como configurar:**
1. Adicionar action `Update Contact` ou `Update Opportunity` (dependendo de onde o campo está definido)
2. Selecionar o campo `SLA Primeiro Contato`
3. Definir valor como `Estourado`

---

**Step 4-YES — Criar Tarefa: SLA Estourado**

| Campo | Valor |
|-------|-------|
| **Action Type** | `Create Task` |
| **Título** | `⚠ SLA Estourado — Contatar {{contact.full_name}} URGENTE` |
| **Descrição** | `Lead em "Lead Recebido" há mais de 15 minutos sem contato. Primeiro contato não realizado dentro do SLA. Data/Hora entrada: {{opportunity.created_at}}` |
| **Prazo** | `+0 days` (urgente — mesmo dia) |
| **Prioridade** | Alta (se o GHL suportar campo de prioridade) |
| **Atribuir a** | `Assigned User` (vendedor responsável pela oportunidade) |

---

**Step 5-YES — Notificar Gestor**

| Campo | Valor |
|-------|-------|
| **Action Type** | `Send Internal Notification` (ou `Send Email` / `Send SMS` para o gestor) |
| **Para** | E-mail ou número do gestor comercial (hardcoded ou via usuário específico) |
| **Assunto** | `⚠ SLA Estourado — {{contact.full_name}}` |
| **Mensagem** | `O lead {{contact.full_name}} está em "Lead Recebido" há mais de 15 minutos sem contato. Responsável: {{opportunity.assigned_user}}. Acesse: {{opportunity.url}}` |

**Como configurar notificação interna:**
1. Adicionar action `Send Notification`
2. Tipo: `Internal Notification` para notificar usuário interno, ou `Email` com e-mail do gestor
3. Personalizar a mensagem com merge fields da oportunidade e do contato

---

### Branch NO (Saiu de Lead Recebido — SLA Cumprido)

**Step 3-NO — Atualizar Custom Field: SLA Cumprido**

| Campo | Valor |
|-------|-------|
| **Action Type** | `Update Contact Field` (ou `Update Opportunity Field`) |
| **Campo** | `SLA Primeiro Contato` |
| **Valor** | `Cumprido` |

> **Nota:** Este registro é importante para relatórios e métricas de performance da equipe.

---

## Workflow 3 — Follow-up Proposta Enviada (D+2) {#workflow-3}

**Nome no GHL:** `[CAMARGO] Follow-up — Proposta Enviada D+2`
**Objetivo:** Lembrar o vendedor de fazer follow-up 2 dias após mover uma oportunidade para o stage "Proposta Enviada", caso o lead ainda não tenha respondido ou avançado.

---

### Trigger

| Campo | Valor |
|-------|-------|
| **Tipo de Trigger** | `Opportunity Stage Changed` |
| **Pipeline** | Pipelines comerciais (Recrutamento e/ou Link) |
| **New Stage** | `Proposta Enviada` |

**Como configurar:**
1. Trigger: `Opportunity Stage Changed`
2. Filtro: `New Stage` → `Proposta Enviada`
3. Adicionar filtro de pipeline se necessário

---

### Step 1 — Adicionar Tag: PROPOSTA_ENVIADA

| Campo | Valor |
|-------|-------|
| **Action Type** | `Add Tag` |
| **Tag** | `PROPOSTA_ENVIADA` |

> **Nota:** Esta tag serve para rastreamento e pode ser usada em filtros de lista, relatórios e outros workflows.

---

### Step 2 — Wait: 2 Dias (Horário Comercial)

| Campo | Valor |
|-------|-------|
| **Action Type** | `Wait` |
| **Duração** | `2 days` |
| **Tipo de Espera** | `Business Hours` (horário comercial) |
| **Business Hours Schedule** | Schedule comercial configurado |

> **Nota:** 2 dias úteis significa que o follow-up será agendado para 2 dias de trabalho completos após o stage change. Fins de semana e feriados configurados no schedule serão ignorados.

---

### Step 3 — If/Else: Oportunidade ainda em "Proposta Enviada"?

| Campo | Valor |
|-------|-------|
| **Action Type** | `If/Else` |
| **Condição** | `Opportunity Stage` → `Is` → `Proposta Enviada` |

---

### Branch YES (Ainda em Proposta Enviada — criar tarefa de follow-up)

**Step 4-YES — Criar Tarefa: Follow-up Proposta**

| Campo | Valor |
|-------|-------|
| **Action Type** | `Create Task` |
| **Título** | `Follow-up \| Proposta Enviada (D+2) — {{contact.full_name}}` |
| **Descrição** | `Realizar follow-up da proposta enviada. O lead está há 2 dias úteis sem avanço na negociação. Verificar: proposta recebida? Há dúvidas? Qual o prazo de decisão?` |
| **Prazo** | `+0 days` (hoje — a tarefa já está vencida conceitualmente) |
| **Atribuir a** | `Opportunity Owner` (usuário responsável pela oportunidade) |

**Como atribuir ao dono da oportunidade:**
1. No campo "Assign To", selecionar `Opportunity Owner` ou `Assigned User`
2. Isso garante que a tarefa vai para o vendedor específico responsável, independente do round robin

---

### Branch NO (Saiu de Proposta Enviada — fluxo encerrado)

Nenhuma ação necessária. O lead avançou no pipeline (positivo) ou foi perdido (tratado por outro workflow). O workflow encerra naturalmente.

> **Boa prática:** Adicionar action `Remove Tag` para `PROPOSTA_ENVIADA` no branch NO, mantendo as tags limpas no contato.

---

## Workflow 4 — Follow-up Negociação (D+7) {#workflow-4}

**Nome no GHL:** `[CAMARGO] Follow-up — Negociação Parada D+7`
**Objetivo:** Alertar o vendedor quando uma oportunidade fica 7 dias sem movimento no stage "Negociação", indicando negociação estagnada.

---

### Trigger

| Campo | Valor |
|-------|-------|
| **Tipo de Trigger** | `Opportunity Stage Changed` |
| **Pipeline** | `Comercial Recrutamento` E/OU `Comercial Link` (criar workflow separado para cada, ou usar filtro "any of") |
| **New Stage** | `Negociação` |

**Como configurar:**
1. Trigger: `Opportunity Stage Changed`
2. Filtro: `New Stage` → `Negociação`
3. Filtro adicional: `Pipeline` → `Is` → `Comercial Recrutamento` (repetir para Link)

> **Nota:** O GHL pode não suportar filtro "OR" em pipelines no mesmo trigger. Se necessário, criar dois workflows idênticos — um para o pipeline Recrutamento e outro para o pipeline Link — ambos com o mesmo corpo de ações.

---

### Step 1 — Wait: 7 Dias (Horário Comercial)

| Campo | Valor |
|-------|-------|
| **Action Type** | `Wait` |
| **Duração** | `7 days` |
| **Tipo de Espera** | `Business Hours` (horário comercial) |
| **Business Hours Schedule** | Schedule comercial configurado |

> **7 dias úteis** = aproximadamente 1,5 semanas de calendário. Ajustar para `7 calendar days` se a preferência for dias corridos.

---

### Step 2 — If/Else: Oportunidade ainda em "Negociação"?

| Campo | Valor |
|-------|-------|
| **Action Type** | `If/Else` |
| **Condição** | `Opportunity Stage` → `Is` → `Negociação` |

---

### Branch YES (Ainda em Negociação — criar tarefa de alerta)

**Step 3-YES — Criar Tarefa: Negociação Parada**

| Campo | Valor |
|-------|-------|
| **Action Type** | `Create Task` |
| **Título** | `Follow-up \| Negociação parada (7 dias) — {{contact.full_name}}` |
| **Descrição** | `Esta oportunidade está em "Negociação" há 7 dias úteis sem avanço. Ações sugeridas: 1) Verificar objeções pendentes. 2) Reforçar proposta de valor. 3) Definir prazo de decisão. 4) Considerar escalonamento ou encerramento da negociação.` |
| **Prazo** | `+0 days` (urgente) |
| **Atribuir a** | `Opportunity Owner` |

---

### Branch NO (Saiu de Negociação — fluxo encerrado)

Nenhuma ação necessária. O lead avançou ou foi encerrado.

---

## Workflow 5 — Transição Comercial → Pós-Venda (Won) {#workflow-5}

**Nome no GHL:** `[CAMARGO] Transição — Venda Ganha para Pós-Venda`
**Objetivo:** Quando uma venda é fechada (Won), garantir automaticamente a criação da oportunidade no pipeline de Pós-Venda para iniciar o onboarding, sem duplicatas.

---

### Trigger

| Campo | Valor |
|-------|-------|
| **Tipo de Trigger** | `Opportunity Status Changed` |
| **Filtro de Status** | `Won` |
| **Pipeline** | Pipelines comerciais (Recrutamento e/ou Link) — adicionar filtro de pipeline para não disparar do próprio pipeline Pós-Venda |

**Como configurar:**
1. Trigger: `Opportunity Status Changed`
2. Filtro: `Status` → `Is` → `Won`
3. Filtro adicional: `Pipeline` → `Is Not` → `Pós-Venda` (para evitar loop)

---

### Step 1 — Adicionar Tag: VENDA_GANHA

| Campo | Valor |
|-------|-------|
| **Action Type** | `Add Tag` |
| **Tag** | `VENDA_GANHA` |

---

### Step 2 — If/Else: Já existe oportunidade aberta no Pós-Venda?

| Campo | Valor |
|-------|-------|
| **Action Type** | `If/Else` |
| **Condição** | `Opportunity Exists in Pipeline` → `Pós-Venda` → `Status` → `Open` |

**Como configurar esta condição:**
- No If/Else, selecionar condição relacionada a oportunidades
- Verificar se o contato já possui uma oportunidade com status `Open` no pipeline `Pós-Venda`

> **Nota técnica:** Dependendo da versão do GHL, esta condição pode ser verificada via `Contact has opportunity in pipeline [Pós-Venda] with status [Open]`. Se esta condição não estiver disponível diretamente, usar tag como proxy: adicionar uma tag `POS_VENDA_ABERTA` ao criar a oportunidade de Pós-Venda e verificar a existência dessa tag no If/Else.

---

### Branch YES (Já existe Pós-Venda aberto — fluxo encerrado)

Nenhuma ação necessária. Evitar duplicata.

> **Boa prática:** Adicionar `Internal Note` no contato: `"Transição Pós-Venda ignorada — oportunidade Pós-Venda já existe em aberto."` para rastreabilidade.

---

### Branch NO (Não existe Pós-Venda aberto — criar)

**Step 3-NO — Criar Oportunidade no Pós-Venda**

| Campo | Valor |
|-------|-------|
| **Action Type** | `Create Opportunity` |
| **Pipeline** | `Pós-Venda` |
| **Stage** | `Contrato Assinado` |
| **Status** | `Open` |
| **Nome da Oportunidade** | `[PV] {{contact.full_name}} — {{now \| date: "%d/%m/%Y"}}` |
| **Valor** | (herdar valor da oportunidade comercial, se disponível via merge field) |

---

**Step 4-NO — Atribuir ao Time de Operações**

| Campo | Valor |
|-------|-------|
| **Action Type** | `Assign to User` |
| **Método** | `Specific User` ou `Round Robin` do time Operações |
| **Usuário/Time** | Time `Operações` (configurado previamente) |

---

**Step 5-NO — Adicionar Nota com Detalhes da Transição**

| Campo | Valor |
|-------|-------|
| **Action Type** | `Add Note` (ou `Add Opportunity Note`) |
| **Nota** | `Transição automática do pipeline comercial para Pós-Venda. Data da venda: {{now \| date: "%d/%m/%Y %H:%M"}}. Pipeline de origem: {{opportunity.pipeline_name}}. Vendedor responsável: {{opportunity.assigned_user}}. Valor da venda: {{opportunity.monetary_value}}. Iniciar processo de onboarding conforme contrato assinado.` |

---

**Step 6-NO — Criar Tarefa: Iniciar Onboarding**

| Campo | Valor |
|-------|-------|
| **Action Type** | `Create Task` |
| **Título** | `Iniciar Onboarding — {{contact.full_name}}` |
| **Descrição** | `Cliente aprovado e contrato assinado. Iniciar processo de onboarding: 1) Enviar e-mail de boas-vindas. 2) Agendar reunião de kick-off. 3) Compartilhar acesso à plataforma/serviço. 4) Registrar dados contratuais no sistema.` |
| **Prazo** | `+1 day` (próximo dia útil) |
| **Atribuir a** | `Assigned User` (usuário de Operações atribuído no step anterior) |

> **Nota sobre prazo:** "+1 day" no GHL significa 1 dia a partir do momento da criação da tarefa. Verificar se o builder permite "+1 business day" para respeitar fins de semana.

---

## Workflow 6 — Lost/Abandoned → Nutrição | Reativação {#workflow-6}

**Nome no GHL:** `[CAMARGO] Transição — Perdido/Abandonado para Nutrição`
**Objetivo:** Quando uma oportunidade comercial é marcada como Lost ou Abandoned, mover automaticamente o contato para o pipeline de Nutrição | Reativação para reciclagem e futura requalificação.

---

### Trigger

| Campo | Valor |
|-------|-------|
| **Tipo de Trigger** | `Opportunity Status Changed` |
| **Filtro de Status** | `Lost` OR `Abandoned` |
| **Pipeline** | Pipelines comerciais (Recrutamento, C-Partner, Comunidades, Link) — NÃO incluir Nutrição nem Pós-Venda |

**Como configurar:**
1. Trigger: `Opportunity Status Changed`
2. Filtro: `Status` → `Is` → `Lost` (adicionar segundo filtro OR para `Abandoned`)
3. Filtro adicional: `Pipeline` → `Is Not` → `Nutrição | Reativação` (evitar loop)
4. Filtro adicional: `Pipeline` → `Is Not` → `Pós-Venda` (se existir)

---

### Step 1 — Adicionar Tags de Rastreamento

| Campo | Valor |
|-------|-------|
| **Action Type** | `Add Tag` |
| **Tags** | `NUTRICAO_ATIVA`, `origem_{pipeline}` |

> **Nota sobre tag dinâmica:** O GHL não suporta tags dinâmicas diretamente. Use um If/Else antes deste step para adicionar a tag de origem correta:
> - Se pipeline = Recrutamento → tag `origem_recrutamento`
> - Se pipeline = C-Partner → tag `origem_cpartner`
> - Se pipeline = Comunidades → tag `origem_comunidades`
> - Se pipeline = Link → tag `origem_link`

---

### Step 2 — If/Else: Classificar Motivo (Lost vs Abandoned)

| Campo | Valor |
|-------|-------|
| **Action Type** | `If/Else` |
| **Condição** | `Opportunity Status` → `Is` → `Lost` |

---

### Branch YES (Lost — Lead que rejeitou/foi rejeitado)

**Step 3-YES — Criar Oportunidade no Pipeline Nutrição**

| Campo | Valor |
|-------|-------|
| **Action Type** | `Create Opportunity` |
| **Pipeline** | `Nutrição \| Reativação` |
| **Stage** | `Classificação` |
| **Status** | `Open` |
| **Nome** | `[NUT] {{contact.full_name}} — Lost {{now \| date: "%d/%m"}}` |

---

### Branch NO (Abandoned — Lead que sumiu/não respondeu)

**Step 3-NO — Criar Oportunidade no Pipeline Nutrição**

| Campo | Valor |
|-------|-------|
| **Action Type** | `Create Opportunity` |
| **Pipeline** | `Nutrição \| Reativação` |
| **Stage** | `Classificação` |
| **Status** | `Open` |
| **Nome** | `[NUT] {{contact.full_name}} — Abandoned {{now \| date: "%d/%m"}}` |

> **Nota:** A diferenciação Lost vs Abandoned no nome ajuda a priorizar a abordagem de nutrição. Leads Abandoned (não responderam) têm maior potencial de reativação que Leads Lost (rejeitaram ativamente).

---

### Step 4 (ambos branches) — Adicionar Nota com Contexto

| Campo | Valor |
|-------|-------|
| **Action Type** | `Add Note` |
| **Nota** | `Contato movido para Nutrição automaticamente. Status anterior: {{opportunity.status}}. Pipeline de origem: {{opportunity.pipeline_name}}. Motivo: verificar histórico de conversas. Data: {{now \| date: "%d/%m/%Y %H:%M"}}. Vendedor original: {{opportunity.assigned_user}}.` |

---

### Step 5 — Remover Tag op_aberta

| Campo | Valor |
|-------|-------|
| **Action Type** | `Remove Tag` |
| **Tag** | `op_aberta` |

> **Nota:** Este step é redundante se o Workflow 1 Complementar já remove `op_aberta` em Lost. Porém, Abandoned NÃO é coberto pelo Workflow 1 Complementar (que só trata Won e Lost). Portanto, este step garante a remoção para o status Abandoned.

---

### Workflow Complementar: Requalificação → Pipeline Comercial

**Nome no GHL:** `[CAMARGO] Nutrição — Requalificado volta ao Comercial`
**Objetivo:** Quando um lead no pipeline Nutrição atinge o stage "Requalificado", mover de volta para o pipeline comercial adequado.

**Trigger:**

| Campo | Valor |
|-------|-------|
| **Tipo de Trigger** | `Opportunity Stage Changed` |
| **Pipeline** | `Nutrição \| Reativação` |
| **New Stage** | `Requalificado` |

**Steps:**

1. **If/Else: Qual pipeline de origem?**
   - Verificar tag `origem_recrutamento` → Criar opp em Comercial | Recrutamento, stage "Lead Recebido"
   - Verificar tag `origem_cpartner` → Criar opp em Comercial | C-Partner, stage "Lead Recebido"
   - Verificar tag `origem_comunidades` → Criar opp em Comercial | Comunidades, stage "Lead Recebido"
   - Verificar tag `origem_link` → Criar opp em Comercial | Link, stage "Lead Recebido"
   - Default (sem tag de origem) → Criar opp em Comercial | Recrutamento

2. **Adicionar Tag:** `REQUALIFICADO`, `op_aberta`

3. **Remover Tags:** `NUTRICAO_ATIVA`, `origem_*` (remover a tag de origem usada)

4. **Marcar oportunidade de Nutrição como Won** (o lead foi reativado com sucesso)

5. **Criar Tarefa:** `Lead Requalificado — {{contact.full_name}} — Prioridade Alta`

---

### Etapas do Pipeline Nutrição | Reativação

| Etapa | Objetivo | Ação Principal |
|-------|----------|----------------|
| **Classificação** | Avaliar motivo da perda e potencial de reativação | Análise manual ou automática do histórico |
| **Sequência Ativa** | Executar sequência de nutrição (emails, conteúdo, touchpoints) | Sequências de email/WhatsApp segmentadas por produto e momento |
| **Engajou** | Lead respondeu ou interagiu com conteúdo de nutrição | Vendedor avalia e decide próximo passo |
| **Requalificado** | Lead pronto para retornar ao pipeline comercial | Trigger do workflow complementar acima |

---

## Referências: Tags e Custom Fields {#referencias}

### Tags Utilizadas nos Workflows

| Tag | Criada em | Removida em | Propósito |
|-----|-----------|-------------|-----------|
| `op_aberta` | Workflow 1 (branch NO) | WF1 Complementar (Won/Lost) + WF6 (Abandoned) | Controle de oportunidade única por contato |
| `PROPOSTA_ENVIADA` | Workflow 3 (step 1) | Workflow 3 (branch NO, opcional) | Rastreamento de propostas enviadas |
| `VENDA_GANHA` | Workflow 5 (step 1) | Nunca (histórico permanente) | Identificação de clientes com venda fechada |
| `POS_VENDA_ABERTA` | Workflow 5 (opcional, como proxy) | Quando Pós-Venda for fechado | Controle de duplicata no Pós-Venda |
| `NUTRICAO_ATIVA` | Workflow 6 (step 1) | WF6 Complementar (Requalificado) | Identifica leads em nutrição |
| `origem_recrutamento` | Workflow 6 (step 1) | WF6 Complementar (Requalificado) | Rastreia pipeline de origem para retorno |
| `origem_cpartner` | Workflow 6 (step 1) | WF6 Complementar (Requalificado) | Rastreia pipeline de origem para retorno |
| `origem_comunidades` | Workflow 6 (step 1) | WF6 Complementar (Requalificado) | Rastreia pipeline de origem para retorno |
| `origem_link` | Workflow 6 (step 1) | WF6 Complementar (Requalificado) | Rastreia pipeline de origem para retorno |
| `REQUALIFICADO` | WF6 Complementar | Nunca (histórico permanente) | Identifica leads reciclados com sucesso |

### Custom Fields Utilizados

| Campo | Tipo | Valores | Usado em | Localização |
|-------|------|---------|----------|-------------|
| `SLA Primeiro Contato` | Texto / Dropdown | `Cumprido`, `Estourado` | Workflow 2 | Contato ou Oportunidade |
| `Pipeline de Origem` | Texto | Nome do pipeline | Workflow 5 (nota) | Oportunidade |

### Como Criar Custom Fields no GHL

1. Acessar **Settings → Custom Fields**
2. Clicar em `+ Add Field`
3. Selecionar o tipo (Text ou Dropdown)
4. Para `SLA Primeiro Contato` como Dropdown: adicionar opções `Cumprido` e `Estourado`
5. Definir se o campo pertence a **Contact** ou **Opportunity** (recomendado: Opportunity, pois é por negociação)
6. Salvar e verificar que o campo aparece no builder de workflows

---

## Configuração de Horário Comercial {#horario-comercial}

Os Workflows 2, 3 e 4 utilizam wait steps com `Business Hours`. Para que funcionem corretamente, é necessário configurar o schedule de horário comercial no GHL.

### Como Configurar Business Hours no GHL

1. Acessar **Settings → Business Info** (ou **Settings → Calendars → Business Hours**)
2. Configurar os dias e horários:

| Dia | Status | Horário |
|-----|--------|---------|
| Segunda-feira | Ativo | 08:00 — 18:00 |
| Terça-feira | Ativo | 08:00 — 18:00 |
| Quarta-feira | Ativo | 08:00 — 18:00 |
| Quinta-feira | Ativo | 08:00 — 18:00 |
| Sexta-feira | Ativo | 08:00 — 17:00 |
| Sábado | Inativo | — |
| Domingo | Inativo | — |

> **Ajustar conforme política real do Grupo Camargo.** Os horários acima são sugestão padrão comercial Brasil.

3. Configurar feriados nacionais e locais (se o GHL suportar blackout dates)
4. Salvar o schedule com um nome identificável: ex. `Horário Comercial Camargo`

### Como Referenciar o Schedule nos Wait Steps

Ao adicionar um `Wait` action em qualquer workflow:
1. Selecionar a duração desejada (15 min, 2 dias, 7 dias)
2. Marcar a checkbox `Only during business hours` (ou opção equivalente)
3. Selecionar o schedule `Horário Comercial Camargo` no dropdown

---

## Checklist de Implementação

Use este checklist para acompanhar o progresso da construção dos workflows no GHL:

### Pré-requisitos
- [x] Pipelines criados: 4 comerciais + Nutrição | Reativação (via Playwright)
- [x] Stages criados em cada pipeline conforme especificado
- [x] Custom Fields criados: 44/44 via API + 5 monetários via fix
- [x] Tags criadas: 26/26 via API
- [ ] Custom Field `SLA Primeiro Contato` criar como Dropdown (Cumprido / Estourado)
- [ ] Business Hours configurado com horário comercial correto
- [ ] Round Robin do time Comercial configurado
- [ ] Usuário/Time `Operações` configurado para Pós-Venda
- [ ] E-mail do gestor comercial mapeado para notificações do Workflow 2
- [ ] Pipeline Pós-Venda criado (após definição com cliente)

### Workflows
- [ ] Workflow 1 — `[CAMARGO] Entrada de Lead — Controle op_aberta` criado e ativo
- [ ] Workflow 1 Complementar — `[CAMARGO] Controle op_aberta — Remover ao Fechar` criado e ativo
- [ ] Workflow 2 — `[CAMARGO] SLA — Primeiro Contato 15min` criado e ativo
- [ ] Workflow 3 — `[CAMARGO] Follow-up — Proposta Enviada D+2` criado e ativo
- [ ] Workflow 4 — `[CAMARGO] Follow-up — Negociação Parada D+7` criado e ativo (um por pipeline)
- [ ] Workflow 5 — `[CAMARGO] Transição — Venda Ganha para Pós-Venda` criado e ativo
- [ ] Workflow 6 — `[CAMARGO] Transição — Perdido/Abandonado para Nutrição` criado e ativo
- [ ] Workflow 6 Complementar — `[CAMARGO] Nutrição — Requalificado volta ao Comercial` criado e ativo

### Testes
- [ ] Workflow 1: Criar contato teste → enviar mensagem → verificar oportunidade + tag + tarefa criados
- [ ] Workflow 1: Enviar segunda mensagem no mesmo contato → verificar que NÃO cria segunda oportunidade
- [ ] Workflow 1 Complementar: Marcar oportunidade como Won/Lost → verificar remoção da tag `op_aberta`
- [ ] Workflow 2: Criar oportunidade em Lead Recebido → aguardar 15 min → verificar campo SLA + tarefa
- [ ] Workflow 3: Mover oportunidade para Proposta Enviada → aguardar 2 dias → verificar tarefa de follow-up
- [ ] Workflow 4: Mover oportunidade para Negociação → aguardar 7 dias → verificar tarefa de alerta
- [ ] Workflow 5: Marcar oportunidade comercial como Won → verificar opp criada no Pós-Venda + nota + tarefa
- [ ] Workflow 6: Marcar oportunidade como Lost → verificar opp criada em Nutrição + tags + nota
- [ ] Workflow 6: Marcar oportunidade como Abandoned → verificar opp criada em Nutrição + remoção op_aberta
- [ ] Workflow 6 Complementar: Mover opp Nutrição para Requalificado → verificar retorno ao pipeline de origem

---

## Notas Adicionais e Boas Práticas

### Nomenclatura de Workflows
Todos os workflows seguem o padrão `[CAMARGO] Categoria — Descrição` para fácil identificação e filtro na lista de automações do GHL.

### Evitar Loops de Automação
- O Workflow 5 usa filtro `Pipeline Is Not Pós-Venda` no trigger para evitar que oportunidades do Pós-Venda que sejam marcadas como Won disparem o workflow novamente
- O Workflow 1 usa a tag `op_aberta` como guard condition — sempre verificar antes de criar oportunidade

### Monitoramento e Ajustes
- Verificar semanalmente o relatório de tarefas criadas pelos workflows para validar que o volume está dentro do esperado
- Monitorar o campo `SLA Primeiro Contato` para medir performance da equipe comercial
- Ajustar os timers (15 min, 2 dias, 7 dias) conforme os dados reais de performance aparecerem

### Extensões Futuras Sugeridas
- Workflow de re-engajamento para leads que ficam mais de 30 dias sem atividade
- Workflow de pesquisa NPS após conclusão do onboarding (Pós-Venda stage = Ativo)
- Dashboard de métricas de SLA integrado com os custom fields criados
