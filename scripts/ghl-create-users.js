// GHL — Criar usuarios da equipe comercial Grupo Camargo
const https = require('https');

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

  const users = [
    { firstName: 'Graziele', lastName: 'Nobre', email: 'graziele@triadeflow.com.br' },
    { firstName: 'Priscila', lastName: 'Araújo', email: 'priscila@triadeflow.com.br' },
    { firstName: 'Gleniany', lastName: 'Frota', email: 'gleniany@triadeflow.com.br' },
    { firstName: 'Ana', lastName: 'Alice', email: 'anaalice@triadeflow.com.br' },
  ];

  // Passo 1: Buscar o companyId real a partir do usuario existente
  log('========== DESCOBRINDO COMPANY ID ==========\n');
  const usersRes = await apiCall('GET', `/users/?locationId=${LOCATION_ID}`);
  const existingUsers = usersRes.body?.users || [];
  log(`Usuarios existentes: ${existingUsers.length}`);

  let COMPANY_ID = null;
  if (existingUsers.length > 0) {
    // Buscar detalhes do primeiro usuario para pegar companyId
    const firstUser = existingUsers[0];
    log(`Buscando detalhes de: ${firstUser.name || firstUser.firstName} (${firstUser.id})`);
    const userDetail = await apiCall('GET', `/users/${firstUser.id}`);
    COMPANY_ID = userDetail.body?.companyId || userDetail.body?.user?.companyId;
    log(`Company ID encontrado: ${COMPANY_ID}`);
    log(`Response keys: ${JSON.stringify(Object.keys(userDetail.body || {}))}`);
    if (!COMPANY_ID) {
      log(`Full user response: ${JSON.stringify(userDetail.body, null, 2)}`);
    }
  }

  if (!COMPANY_ID) {
    // Tentar buscar via location
    log('Tentando buscar companyId via location...');
    const locRes = await apiCall('GET', `/locations/${LOCATION_ID}`);
    COMPANY_ID = locRes.body?.location?.companyId || locRes.body?.companyId;
    log(`Company ID via location: ${COMPANY_ID}`);
    if (!COMPANY_ID) {
      log(`Location response keys: ${JSON.stringify(Object.keys(locRes.body?.location || locRes.body || {}))}`);
      log(`Full location: ${JSON.stringify(locRes.body, null, 2).substring(0, 500)}`);
    }
  }

  if (!COMPANY_ID) {
    log('ERRO: Nao foi possivel descobrir o companyId. Abortando.');
    return;
  }

  log(`\n========== CRIAR USUARIOS — GRUPO CAMARGO ==========`);
  log(`Company ID: ${COMPANY_ID}\n`);

  const results = [];

  for (let i = 0; i < users.length; i++) {
    const u = users[i];
    const fullName = u.lastName ? `${u.firstName} ${u.lastName}` : u.firstName;
    log(`${i+1}/4 Criando: ${fullName} (${u.email})...`);

    const payload = {
      companyId: COMPANY_ID,
      firstName: u.firstName,
      lastName: u.lastName || ' ',
      email: u.email,
      type: 'account',
      role: 'user',
      locationIds: [LOCATION_ID],
      permissions: {
        campaignsEnabled: true,
        campaignsReadOnly: false,
        contactsEnabled: true,
        workflowsEnabled: true,
        workflowsReadOnly: true,
        triggersEnabled: true,
        funnelsEnabled: true,
        websitesEnabled: false,
        opportunitiesEnabled: true,
        dashboardStatsEnabled: true,
        bulkActionsEnabled: true,
        appointmentsEnabled: true,
        reviewsEnabled: true,
        onlineListingsEnabled: false,
        phoneCallEnabled: true,
        conversationsEnabled: true,
        assignedDataOnly: false,
        adwordsReportingEnabled: false,
        membershipEnabled: false,
        facebookAdsReportingEnabled: false,
        attributionsReportingEnabled: false,
        settingsEnabled: false,
        tagsEnabled: true,
        leadValueEnabled: true,
        marketingEnabled: true,
        agentReportingEnabled: true,
        botService: false,
        socialPlanner: false,
        bloggingEnabled: false,
        invoiceEnabled: false,
        affiliateManagerEnabled: false,
        contentAiEnabled: false,
        refundsEnabled: false,
        recordPaymentEnabled: false,
        cancelSubscriptionEnabled: false,
        paymentsEnabled: false,
        communitiesEnabled: false,
        exportPaymentsEnabled: false
      }
    };

    const res = await apiCall('POST', '/users/', payload);
    const userId = res.body?.id || res.body?.user?.id;
    results.push({ name: fullName, email: u.email, status: res.status, id: userId, error: res.body?.message || res.body?.msg });

    if (res.status === 200 || res.status === 201) {
      log(`    ✓ Criado! ID: ${userId}`);
    } else {
      log(`    ✗ Status: ${res.status} | Erro: ${JSON.stringify(res.body?.message || res.body?.msg || res.body)}`);
    }
    await sleep(500);
  }

  log('\n========================================');
  log('         RESUMO');
  log('========================================');
  const ok = results.filter(r => r.status === 200 || r.status === 201).length;
  log(`Usuarios criados: ${ok}/4`);
  results.forEach(r => {
    log(`  ${r.name} (${r.email}): ${r.id ? 'ID ' + r.id : 'ERRO - ' + (r.error || 'ver output')}`);
  });
  log('========================================');

  require('fs').writeFileSync('C:/Users/Alex Campos/ghl-create-users-output.json', JSON.stringify(results, null, 2), 'utf8');
  log('Resultado salvo em ghl-create-users-output.json');
}

main().catch(e => {
  console.error('ERRO FATAL:', e.message);
  process.exit(1);
});
