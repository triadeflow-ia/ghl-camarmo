# GHL Grupo Camarmo — CRM V1

Implementação CRM GoHighLevel para Grupo Camarmo via metodologia TDI™ (Triadeflow Digital Implementation).

## Status: ✅ V1 Implementado e Publicado

**Apresentação:** 2026-02-26 14:00
**Location ID:** `nxqqghvIaX9QQEUaBgwM`

## O que foi entregue

| Item | Qtd | Status |
|------|-----|--------|
| Custom Fields | 44 | ✅ |
| Tags | 26 | ✅ |
| Pipelines Comerciais | 4 | ✅ |
| Pipeline Nutrição | 1 | ✅ |
| Workflows Publicados | 8 | ✅ |
| Usuários GHL | 5 | ✅ |
| Round Robin Comercial | 1 | ✅ |
| Ações Create Opportunity | 2 | ✅ |

## Estrutura

```
ghl-camarmo/
├── README.md                          # Este arquivo
├── ghl-camargo-status-v1.md           # Status file completo (master doc)
├── ghl-workflows-camargo.md           # Spec dos 8 workflows
├── scripts/
│   ├── ghl-phase2.js                  # Criação de contatos + oportunidades de teste
│   ├── ghl-fix.js                     # Fix campos monetários + pipelines
│   ├── ghl-create-users.js            # Criação dos 4 usuários comerciais
│   ├── ghl-round-robin.js             # Configuração Round Robin
│   └── ghl-cleanup.js                 # Cleanup (Marketing Pipeline + tags)
└── outputs/
    ├── ghl-phase2-output.json
    ├── ghl-fix-output.json
    ├── ghl-create-users-output.json
    ├── ghl-round-robin-output.json
    └── ghl-cleanup-output.json
```

## Pipelines

| Pipeline | ID |
|----------|-----|
| Comercial - Recrutamento | G2RrDeluWxQxOX4KDrIK |
| Comercial - C-Partner | fm4C63aYMg7vQJtSFYpR |
| Comercial - Comunidades | n26Zb3bUhegRloqYfgXH |
| Comercial - Link | VaioYeq51cLPf9Z7c0OM |
| Nutrição - Reativação | NA0KFHGf4MP4lNrHbQcd |

## Workflows (8/8 Published)

1. Entrada de Lead — Controle op_aberta (`5cd34f0e`)
2. Controle op_aberta — Remover ao Fechar (`9ab69228`)
3. SLA — Primeiro Contato 15min (`decd734a`)
4. Follow-up — Proposta Enviada D+2 (`24f34edb`)
5. Follow-up — Negociação Parada D+7 (`663a67a0`)
6. Transição — Venda Ganha para Pós-Venda (`b5fe5085`)
7. Transição — Perdido/Abandonado para Nutrição (`14194233`)
8. Nutrição — Requalificado volta ao Comercial (`d7438131`)

## Equipe

| Nome | Email | Role |
|------|-------|------|
| Carlos H M Mororo | — | Admin |
| Graziele Nobre | graziele@triadeflow.com.br | Comercial |
| Priscila Araújo | priscila@triadeflow.com.br | Comercial |
| Gleniany Frota | gleniany@triadeflow.com.br | Comercial |
| Ana Alice | anaalice@triadeflow.com.br | Comercial |

## Pendente V2

- Pipeline Pós-Venda (definir etapas com cliente)
- Ações SLA (Cumprido/Estourado)
- Testes dos 4 workflows deferidos

---

*Triadeflow — CRM Implementation V1*
