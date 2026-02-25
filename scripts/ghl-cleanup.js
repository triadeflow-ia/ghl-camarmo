// GHL — Cleanup: deletar Marketing Pipeline + remover tag requalificado do Carlos
const https = require('https');
const fs = require('fs');

const TOKEN = 'pit-93a4b974-9e8f-4b76-b0f5-0c13a783a8a6';
const LOCATION_ID = 'nxqqghvIaX9QQEUaBgwM';
const BASE = 'services.leadconnectorhq.com';

const MARKETING_PIPELINE_ID = 'cqpZMpcihsC1IPLFgCHm';
const CARLOS_CONTACT_ID = 'quAF4vhVgXIoZGXtu6HU';

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

async function main() {
  const log = (msg) => console.log(msg);
  const results = {};

  // 1. Deletar Marketing Pipeline
  log('========== 1. DELETAR MARKETING PIPELINE ==========\n');
  log(`Pipeline ID: ${MARKETING_PIPELINE_ID}`);
  const delRes = await apiCall('DELETE', `/opportunities/pipelines/${MARKETING_PIPELINE_ID}`);
  results.deletePipeline = { status: delRes.status, body: delRes.body };
  if (delRes.status === 200 || delRes.status === 204) {
    log('✓ Marketing Pipeline deletado!');
  } else {
    log(`✗ Status: ${delRes.status} | ${JSON.stringify(delRes.body)}`);
  }

  // 2. Remover tag requalificado do Carlos
  log('\n========== 2. REMOVER TAG REQUALIFICADO DO CARLOS ==========\n');
  log(`Contact ID: ${CARLOS_CONTACT_ID}`);

  // Primeiro buscar tags atuais do Carlos
  const carlosRes = await apiCall('GET', `/contacts/${CARLOS_CONTACT_ID}`);
  const currentTags = carlosRes.body?.contact?.tags || [];
  log(`Tags atuais: ${JSON.stringify(currentTags)}`);

  const newTags = currentTags.filter(t => t !== 'requalificado' && t !== 'REQUALIFICADO');
  log(`Tags novas (sem requalificado): ${JSON.stringify(newTags)}`);

  if (currentTags.length === newTags.length) {
    log('Tag requalificado nao encontrada, nada a fazer.');
    results.removeTag = { status: 'skip', message: 'tag not found' };
  } else {
    const updateRes = await apiCall('PUT', `/contacts/${CARLOS_CONTACT_ID}`, {
      tags: newTags
    });
    results.removeTag = { status: updateRes.status, body: updateRes.body };
    if (updateRes.status === 200) {
      log('✓ Tag requalificado removida do Carlos!');
    } else {
      log(`✗ Status: ${updateRes.status} | ${JSON.stringify(updateRes.body)}`);
    }
  }

  // 3. Confirmar pipelines restantes
  log('\n========== 3. PIPELINES RESTANTES ==========\n');
  const pipesRes = await apiCall('GET', `/opportunities/pipelines?locationId=${LOCATION_ID}`);
  const pipes = pipesRes.body?.pipelines || [];
  log(`${pipes.length} pipeline(s):`);
  pipes.forEach(p => log(`  - ${p.name} [${p.id}]`));
  results.remainingPipelines = pipes.map(p => ({ name: p.name, id: p.id }));

  // Resumo
  log('\n========================================');
  log('         RESUMO CLEANUP');
  log('========================================');
  fs.writeFileSync('C:/Users/Alex Campos/ghl-cleanup-output.json', JSON.stringify(results, null, 2), 'utf8');
  log('Resultado salvo em ghl-cleanup-output.json');
}

main().catch(e => {
  console.error('ERRO FATAL:', e.message);
  process.exit(1);
});
