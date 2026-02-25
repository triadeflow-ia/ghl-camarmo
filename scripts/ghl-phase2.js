// GHL Phase 2 — Users + Test Contacts + Test Opportunities
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

  // ========== FASE 1: BUSCAR USERS ==========
  log('========== FASE 1: USERS DA CONTA ==========');
  results.users = await apiCall('GET', `/users/?locationId=${LOCATION_ID}`);
  const users = results.users.body?.users || [];
  log(`${users.length} usuario(s) encontrado(s):`);
  users.forEach(u => log(`  - ${u.name || u.firstName + ' ' + u.lastName} | ${u.email} | ID: ${u.id} | Role: ${u.role}`));

  // ========== FASE 2: BUSCAR PIPELINES (pra pegar IDs dos stages) ==========
  log('\n========== FASE 2: PIPELINES + STAGE IDS ==========');
  results.pipelines = await apiCall('GET', `/opportunities/pipelines?locationId=${LOCATION_ID}`);
  const pipes = results.pipelines.body?.pipelines || [];
  log(`${pipes.length} pipeline(s):`);
  pipes.forEach(p => {
    log(`\n  Pipeline: ${p.name} [${p.id}]`);
    (p.stages || []).forEach(s => log(`    Stage: ${s.name} [${s.id}]`));
  });

  // ========== FASE 3: BUSCAR CUSTOM FIELDS (pra pegar IDs) ==========
  log('\n========== FASE 3: CUSTOM FIELD IDS ==========');
  results.fields = await apiCall('GET', `/locations/${LOCATION_ID}/customFields`);
  const fields = results.fields.body?.customFields || [];
  log(`${fields.length} campo(s):`);
  const fieldMap = {};
  fields.forEach(f => {
    fieldMap[f.name] = f.id;
    log(`  ${f.name} [${f.id}] (${f.dataType}) model:${f.model}`);
  });

  // ========== FASE 4: CRIAR CONTATOS DE TESTE ==========
  log('\n========== FASE 4: CONTATOS DE TESTE ==========');

  const testContacts = [
    {
      firstName: 'Carlos',
      lastName: 'Mendes [TESTE]',
      email: 'carlos.teste@empresa.com.br',
      phone: '+5511999990001',
      companyName: 'TechStar Ltda',
      tags: ['produto_recrutamento', 'canal_linkedin', 'LEAD_NOVO'],
      customFields: {
        'Empresa (Nome Comercial)': 'TechStar Ltda',
        'CNPJ': '12.345.678/0001-90',
        'Decisor Principal': 'Carlos Mendes',
        'Cargo do Decisor': 'Diretor de RH',
        'Origem do Lead': 'LinkedIn',
        'Perfil dentro do ICP': 'Sim',
        'Porte da Empresa': 'M\u00e9dio',
        'Segmento': 'Tecnologia',
        'Tipo de Vaga': 'Hunting Individual',
        'Grau de Urg\u00eancia': 'Alta',
        'Produto': 'Recrutamento',
        'Status Base': 'Ativo'
      }
    },
    {
      firstName: 'Ana',
      lastName: 'Oliveira [TESTE]',
      email: 'ana.teste@email.com.br',
      phone: '+5511999990002',
      tags: ['produto_outplacement', 'canal_indicacao', 'LEAD_NOVO'],
      customFields: {
        'Decisor Principal': 'Ana Oliveira',
        'Origem do Lead': 'Indica\u00e7\u00e3o',
        'Senioridade': 'Ger\u00eancia',
        'Mobilidade': 'Sim',
        'LinkedIn URL': 'https://linkedin.com/in/ana-oliveira-teste',
        'Curr\u00edculo Recebido': 'Sim',
        'Produto': 'Outplacement',
        'Status Base': 'Ativo'
      }
    },
    {
      firstName: 'Roberto',
      lastName: 'Silva [TESTE]',
      email: 'roberto.teste@holding.com.br',
      phone: '+5511999990003',
      companyName: 'Holding Silva',
      tags: ['produto_comunidade_senior', 'canal_evento', 'LEAD_NOVO'],
      customFields: {
        'Empresa (Nome Comercial)': 'Holding Silva',
        'Decisor Principal': 'Roberto Silva',
        'Cargo do Decisor': 'CEO',
        'Origem do Lead': 'Evento',
        'Perfil Comunidade': 'Empres\u00e1rio',
        'N\u00famero de Colaboradores': 45,
        'Faturamento Anual (Faixa)': '5M - 10M',
        'Produto': 'Senior Club',
        'Status Base': 'Ativo'
      }
    },
    {
      firstName: 'Mariana',
      lastName: 'Costa [TESTE]',
      email: 'mariana.teste@somapay.com.br',
      phone: '+5511999990004',
      companyName: 'SomaPay',
      tags: ['produto_link', 'canal_indicacao', 'LEAD_NOVO'],
      customFields: {
        'Empresa (Nome Comercial)': 'SomaPay',
        'Decisor Principal': 'Mariana Costa',
        'Cargo do Decisor': 'Head de Parcerias',
        'Origem do Lead': 'Indica\u00e7\u00e3o',
        'Produto': 'Link',
        'Status Base': 'Ativo'
      }
    }
  ];

  results.contacts = [];
  for (let i = 0; i < testContacts.length; i++) {
    const c = testContacts[i];
    log(`${i+1}/4 Criando contato: ${c.firstName} ${c.lastName}...`);

    // Build custom field array from map
    const customFieldArr = [];
    if (c.customFields) {
      for (const [name, value] of Object.entries(c.customFields)) {
        if (fieldMap[name]) {
          customFieldArr.push({ id: fieldMap[name], field_value: value });
        }
      }
    }

    const payload = {
      locationId: LOCATION_ID,
      firstName: c.firstName,
      lastName: c.lastName,
      email: c.email,
      phone: c.phone,
      tags: c.tags,
      source: 'Triadeflow CRM Setup',
      customFields: customFieldArr
    };
    if (c.companyName) payload.companyName = c.companyName;

    const res = await apiCall('POST', '/contacts/', payload);
    const contactId = res.body?.contact?.id;
    results.contacts.push({
      name: `${c.firstName} ${c.lastName}`,
      status: res.status,
      id: contactId,
      pipeline: i === 0 ? 'Recrutamento' : i === 1 ? 'C-Partner' : i === 2 ? 'Comunidades' : 'Link'
    });
    log(`    Status: ${res.status} ${res.status === 200 || res.status === 201 ? '\u2713 ID: ' + contactId : '\u2717 ' + JSON.stringify(res.body?.message || res.body?.msg || '')}`);
    await sleep(500);
  }

  // ========== FASE 5: CRIAR OPORTUNIDADES DE TESTE ==========
  log('\n========== FASE 5: OPORTUNIDADES DE TESTE ==========');

  // Find pipeline and stage IDs
  const findPipeline = (name) => pipes.find(p => p.name.includes(name));
  const findStage = (pipeline, stageName) => (pipeline?.stages || []).find(s => s.name.includes(stageName));

  const pipeRecrutamento = findPipeline('Recrutamento');
  const pipeCPartner = findPipeline('C-Partner');
  const pipeComunidades = findPipeline('Comunidades');
  const pipeLink = findPipeline('Link');

  if (!pipeRecrutamento && !pipeCPartner && !pipeComunidades && !pipeLink) {
    log('AVISO: Nenhum pipeline encontrado. Crie os pipelines manualmente primeiro!');
    log('Pulando criacao de oportunidades...');
  } else {
    const oppDefs = [];

    if (pipeRecrutamento && results.contacts[0]?.id) {
      const stage = findStage(pipeRecrutamento, 'Qualifica');
      oppDefs.push({
        name: 'TechStar - Vaga Dev Senior [TESTE]',
        pipelineId: pipeRecrutamento.id,
        stageId: stage?.id || pipeRecrutamento.stages[0]?.id,
        contactId: results.contacts[0].id,
        monetaryValue: 15000,
        status: 'open'
      });
    }

    if (pipeCPartner && results.contacts[1]?.id) {
      const stage = findStage(pipeCPartner, 'Videochamada') || findStage(pipeCPartner, 'Pr\u00e9');
      oppDefs.push({
        name: 'Ana Oliveira - Outplacement Gerencia [TESTE]',
        pipelineId: pipeCPartner.id,
        stageId: stage?.id || pipeCPartner.stages[0]?.id,
        contactId: results.contacts[1].id,
        monetaryValue: 5800,
        status: 'open'
      });
    }

    if (pipeComunidades && results.contacts[2]?.id) {
      const stage = findStage(pipeComunidades, 'Material') || findStage(pipeComunidades, 'Videochamada');
      oppDefs.push({
        name: 'Roberto Silva - Senior Club [TESTE]',
        pipelineId: pipeComunidades.id,
        stageId: stage?.id || pipeComunidades.stages[0]?.id,
        contactId: results.contacts[2].id,
        monetaryValue: 8040,
        status: 'open'
      });
    }

    if (pipeLink && results.contacts[3]?.id) {
      const stage = findStage(pipeLink, 'Proposta') || findStage(pipeLink, 'Qualifica');
      oppDefs.push({
        name: 'SomaPay - Parceria Beneficios [TESTE]',
        pipelineId: pipeLink.id,
        stageId: stage?.id || pipeLink.stages[0]?.id,
        contactId: results.contacts[3].id,
        monetaryValue: 25000,
        status: 'open'
      });
    }

    results.opportunities = [];
    for (let i = 0; i < oppDefs.length; i++) {
      const o = oppDefs[i];
      log(`${i+1}/${oppDefs.length} Oportunidade: ${o.name}...`);
      const res = await apiCall('POST', '/opportunities/', {
        locationId: LOCATION_ID,
        pipelineId: o.pipelineId,
        pipelineStageId: o.stageId,
        contactId: o.contactId,
        name: o.name,
        monetaryValue: o.monetaryValue,
        status: o.status
      });
      const oppId = res.body?.opportunity?.id || res.body?.id;
      results.opportunities.push({ name: o.name, status: res.status, id: oppId });
      log(`    Status: ${res.status} ${res.status === 200 || res.status === 201 ? '\u2713 ID: ' + oppId : '\u2717 ' + JSON.stringify(res.body)}`);
      await sleep(500);
    }
  }

  // ========== RESUMO FINAL ==========
  log('\n========================================');
  log('         RESUMO FASE 2');
  log('========================================');
  log(`Users: ${users.length} encontrado(s)`);
  log(`Pipelines: ${pipes.length} encontrado(s)`);
  log(`Custom Fields: ${fields.length} mapeado(s)`);
  log(`Contatos teste: ${results.contacts?.filter(c => c.status === 200 || c.status === 201).length || 0}/4`);
  log(`Oportunidades teste: ${results.opportunities?.filter(o => o.status === 200 || o.status === 201).length || 0} criada(s)`);
  log('========================================');

  fs.writeFileSync('C:/Users/Alex Campos/ghl-phase2-output.json', JSON.stringify(results, null, 2), 'utf8');
  log('Resultado salvo em ghl-phase2-output.json');
}

main().catch(e => {
  console.error('ERRO FATAL:', e.message);
  process.exit(1);
});
