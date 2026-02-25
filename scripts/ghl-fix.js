// GHL Fix — Campos monetarios + Pipelines
const https = require('https');
const fs = require('fs');

const TOKEN = 'pit-93a4b974-9e8f-4b76-b0f5-0c13a783a8a6';
const LOCATION_ID = 'nxqqghvIaX9QQEUaBgwM';
const BASE = 'services.leadconnectorhq.com';

function apiCall(method, path, body) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: BASE, path, method,
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Version': '2021-07-28',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let parsed;
        try { parsed = JSON.parse(data); } catch(e) { parsed = data; }
        resolve({ status: res.statusCode, body: parsed });
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  const log = (msg) => console.log(msg);
  const results = {};

  // ========== FIX 1: CAMPOS MONETARIOS (MONETORY) ==========
  log('========== FIX 1: CAMPOS MONETARIOS ==========');

  const monetaryFields = [
    { name: 'Faixa Salarial Estimada', dataType: 'MONETORY', model: 'contact' },
    { name: 'Pretens\u00e3o Salarial', dataType: 'MONETORY', model: 'contact' },
    { name: 'Valor Estimado do Contrato', dataType: 'MONETORY', model: 'opportunity' },
    { name: 'Valor Total do Contrato', dataType: 'MONETORY', model: 'opportunity' },
    { name: 'Receita Mensal Prevista', dataType: 'MONETORY', model: 'opportunity' },
  ];

  results.monetaryFix = [];
  for (let i = 0; i < monetaryFields.length; i++) {
    const f = monetaryFields[i];
    log(`${i+1}/5 Criando: ${f.name} (${f.model})...`);
    const res = await apiCall('POST', `/locations/${LOCATION_ID}/customFields`, {
      name: f.name, dataType: f.dataType, model: f.model
    });
    results.monetaryFix.push({ name: f.name, status: res.status });
    log(`    Status: ${res.status} ${res.status === 201 ? '\u2713' : '\u2717 ' + JSON.stringify(res.body?.message || res.body)}`);
    await sleep(300);
  }

  // ========== FIX 2: PIPELINES ==========
  log('\n========== FIX 2: PIPELINES ==========');

  const pipelines = [
    {
      name: 'Comercial | Recrutamento',
      stages: [
        { name: 'Lead Recebido', position: 0 },
        { name: 'Qualifica\u00e7\u00e3o', position: 1 },
        { name: 'Diagn\u00f3stico', position: 2 },
        { name: 'Proposta Enviada', position: 3 },
        { name: 'Negocia\u00e7\u00e3o', position: 4 },
        { name: 'Ganhou', position: 5 },
        { name: 'Perdido', position: 6 }
      ]
    },
    {
      name: 'Comercial | C-Partner',
      stages: [
        { name: 'Lead Recebido', position: 0 },
        { name: 'Pr\u00e9-qualifica\u00e7\u00e3o', position: 1 },
        { name: 'Videochamada', position: 2 },
        { name: 'Proposta Enviada', position: 3 },
        { name: 'Coleta de Dados', position: 4 },
        { name: 'Contrato Enviado', position: 5 },
        { name: 'Pagamento Enviado', position: 6 },
        { name: 'Ganhou', position: 7 },
        { name: 'Perdido', position: 8 }
      ]
    },
    {
      name: 'Comercial | Comunidades',
      stages: [
        { name: 'Lead Recebido', position: 0 },
        { name: 'Enquadramento', position: 1 },
        { name: 'Videochamada', position: 2 },
        { name: 'Material Enviado', position: 3 },
        { name: 'Follow-up Agendado', position: 4 },
        { name: 'Aguardando Pagamento', position: 5 },
        { name: 'Ganhou', position: 6 },
        { name: 'Perdido', position: 7 }
      ]
    },
    {
      name: 'Comercial | Link',
      stages: [
        { name: 'Lead Recebido', position: 0 },
        { name: 'Qualifica\u00e7\u00e3o', position: 1 },
        { name: 'Proposta Enviada', position: 2 },
        { name: 'Negocia\u00e7\u00e3o', position: 3 },
        { name: 'Aguardando Assinatura', position: 4 },
        { name: 'Ganhou', position: 5 },
        { name: 'Perdido', position: 6 }
      ]
    }
  ];

  results.pipelines = [];
  for (let i = 0; i < pipelines.length; i++) {
    const p = pipelines[i];
    log(`${i+1}/4 Pipeline: ${p.name} (${p.stages.length} etapas)...`);

    const res = await apiCall('POST', '/opportunities/pipelines', {
      locationId: LOCATION_ID,
      name: p.name,
      stages: p.stages,
      showInFunnel: true
    });
    results.pipelines.push({ name: p.name, status: res.status, id: res.body?.pipeline?.id });

    if (res.status === 200 || res.status === 201) {
      log(`    \u2713 Criado! ID: ${res.body?.pipeline?.id}`);
    } else {
      log(`    \u2717 Status: ${res.status} | Erro: ${JSON.stringify(res.body)}`);
    }
    await sleep(500);
  }

  // ========== RESUMO ==========
  log('\n========================================');
  log('         RESUMO DO FIX');
  log('========================================');
  const mOk = results.monetaryFix.filter(f => f.status === 201).length;
  const pOk = results.pipelines.filter(p => p.status === 200 || p.status === 201).length;
  log(`Campos monetarios: ${mOk}/5`);
  log(`Pipelines: ${pOk}/4`);

  if (pOk === 0) {
    log('');
    log('PIPELINES AINDA FALHANDO?');
    log('Opcao 1: Habilite scope "Opportunities > Pipelines > Write" e gere novo token');
    log('Opcao 2: Crie os 4 pipelines manualmente no GHL (leva 5 min):');
    log('  VA EM: Opportunities > Pipelines > + Add Pipeline');
    log('  Pipeline 1: Comercial | Recrutamento');
    log('    Etapas: Lead Recebido, Qualificacao, Diagnostico, Proposta Enviada, Negociacao, Ganhou, Perdido');
    log('  Pipeline 2: Comercial | C-Partner');
    log('    Etapas: Lead Recebido, Pre-qualificacao, Videochamada, Proposta Enviada, Coleta de Dados, Contrato Enviado, Pagamento Enviado, Ganhou, Perdido');
    log('  Pipeline 3: Comercial | Comunidades');
    log('    Etapas: Lead Recebido, Enquadramento, Videochamada, Material Enviado, Follow-up Agendado, Aguardando Pagamento, Ganhou, Perdido');
    log('  Pipeline 4: Comercial | Link');
    log('    Etapas: Lead Recebido, Qualificacao, Proposta Enviada, Negociacao, Aguardando Assinatura, Ganhou, Perdido');
  }
  log('========================================');

  fs.writeFileSync('C:/Users/Alex Campos/ghl-fix-output.json', JSON.stringify(results, null, 2), 'utf8');
  log('Resultado salvo em ghl-fix-output.json');
}

main().catch(e => {
  console.error('ERRO FATAL:', e.message);
  process.exit(1);
});
