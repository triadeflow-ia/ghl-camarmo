// GHL — Configurar Round Robin para equipe comercial Grupo Camargo
const https = require('https');
const fs = require('fs');

const TOKEN = 'pit-93a4b974-9e8f-4b76-b0f5-0c13a783a8a6';
const LOCATION_ID = 'nxqqghvIaX9QQEUaBgwM';
const BASE = 'services.leadconnectorhq.com';

// Equipe comercial (sem Carlos admin)
const TEAM = [
  { userId: 'xRtGXUfqWeLHGZdcmkwk', name: 'Graziele Nobre' },
  { userId: '6JeCKT8qOl1UGIegjnDJ', name: 'Priscila Araújo' },
  { userId: '4CKb592QFUg5Ut2sR4on', name: 'Gleniany Frota' },
  { userId: 'L27hbdfgcqdegVvQ1wtw', name: 'Ana Alice' },
];

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

  // Passo 1: Listar calendarios existentes
  log('========== CALENDARIOS EXISTENTES ==========\n');
  const calRes = await apiCall('GET', `/calendars/?locationId=${LOCATION_ID}`);
  results.existingCalendars = calRes.body;
  const calendars = calRes.body?.calendars || [];
  log(`${calendars.length} calendario(s) encontrado(s):`);
  calendars.forEach(c => {
    log(`  - ${c.name} [${c.id}] tipo: ${c.calendarType}`);
  });

  // Passo 2: Listar usuarios para confirmar IDs
  log('\n========== USUARIOS DISPONIVEIS ==========\n');
  const usersRes = await apiCall('GET', `/users/?locationId=${LOCATION_ID}`);
  const users = usersRes.body?.users || [];
  log(`${users.length} usuario(s):`);
  users.forEach(u => {
    log(`  - ${u.name || u.firstName + ' ' + u.lastName} | ID: ${u.id} | Role: ${u.role}`);
  });

  // Passo 3: Criar calendario Round Robin
  log('\n========== CRIANDO ROUND ROBIN ==========\n');

  const teamMembers = TEAM.map(t => ({
    userId: t.userId,
    priority: 0.5,
    meetingLocationType: 'custom',
    meetingLocation: '',
    isPrimary: false
  }));

  const rrPayload = {
    locationId: LOCATION_ID,
    name: 'Distribuicao Comercial | Round Robin',
    description: 'Distribuicao automatica de leads entre equipe comercial do Grupo Camargo',
    calendarType: 'round_robin',
    roundRobinConfig: {
      autoConfirm: true,
      acceptAnyAvailable: true
    },
    teamMembers: teamMembers,
    slotDuration: 30,
    slotInterval: 30,
    slotBuffer: 0,
    openHours: [
      { daysOfTheWeek: [1], hours: [{ openHour: 8, openMinute: 0, closeHour: 18, closeMinute: 0 }] },
      { daysOfTheWeek: [2], hours: [{ openHour: 8, openMinute: 0, closeHour: 18, closeMinute: 0 }] },
      { daysOfTheWeek: [3], hours: [{ openHour: 8, openMinute: 0, closeHour: 18, closeMinute: 0 }] },
      { daysOfTheWeek: [4], hours: [{ openHour: 8, openMinute: 0, closeHour: 18, closeMinute: 0 }] },
      { daysOfTheWeek: [5], hours: [{ openHour: 8, openMinute: 0, closeHour: 18, closeMinute: 0 }] },
    ],
    enableRecurring: false,
    notifications: [],
  };

  log('Payload:');
  log(`  Nome: ${rrPayload.name}`);
  log(`  Tipo: ${rrPayload.calendarType}`);
  log(`  Membros: ${TEAM.map(t => t.name).join(', ')}`);
  log(`  Horario: Seg-Sex 08:00-18:00`);
  log(`  Slot: ${rrPayload.slotDuration}min`);
  log('');

  const rrRes = await apiCall('POST', '/calendars/', rrPayload);
  results.roundRobin = rrRes;

  if (rrRes.status === 200 || rrRes.status === 201) {
    const calId = rrRes.body?.calendar?.id || rrRes.body?.id;
    log(`✓ Round Robin criado! ID: ${calId}`);
  } else {
    log(`✗ Status: ${rrRes.status}`);
    log(`  Erro: ${JSON.stringify(rrRes.body, null, 2)}`);

    // Se falhou, tentar formato alternativo sem roundRobinConfig
    log('\nTentando formato alternativo...');
    const rrPayload2 = {
      locationId: LOCATION_ID,
      name: 'Distribuicao Comercial | Round Robin',
      description: 'Distribuicao automatica de leads entre equipe comercial',
      calendarType: 'round_robin',
      teamMembers: TEAM.map(t => ({
        userId: t.userId,
        priority: 0.5,
        meetingLocationType: 'custom',
        meetingLocation: ''
      })),
      slotDuration: 30,
      slotInterval: 30,
      openHours: [
        { daysOfTheWeek: [1], hours: [{ openHour: 8, openMinute: 0, closeHour: 18, closeMinute: 0 }] },
        { daysOfTheWeek: [2], hours: [{ openHour: 8, openMinute: 0, closeHour: 18, closeMinute: 0 }] },
        { daysOfTheWeek: [3], hours: [{ openHour: 8, openMinute: 0, closeHour: 18, closeMinute: 0 }] },
        { daysOfTheWeek: [4], hours: [{ openHour: 8, openMinute: 0, closeHour: 18, closeMinute: 0 }] },
        { daysOfTheWeek: [5], hours: [{ openHour: 8, openMinute: 0, closeHour: 18, closeMinute: 0 }] },
      ]
    };

    const rrRes2 = await apiCall('POST', '/calendars/', rrPayload2);
    results.roundRobinAlt = rrRes2;
    if (rrRes2.status === 200 || rrRes2.status === 201) {
      const calId = rrRes2.body?.calendar?.id || rrRes2.body?.id;
      log(`✓ Round Robin criado (formato alt)! ID: ${calId}`);
    } else {
      log(`✗ Status: ${rrRes2.status}`);
      log(`  Erro: ${JSON.stringify(rrRes2.body, null, 2)}`);
    }
  }

  // Resumo
  log('\n========================================');
  log('         RESUMO');
  log('========================================');
  fs.writeFileSync('C:/Users/Alex Campos/ghl-round-robin-output.json', JSON.stringify(results, null, 2), 'utf8');
  log('Resultado salvo em ghl-round-robin-output.json');
}

main().catch(e => {
  console.error('ERRO FATAL:', e.message);
  process.exit(1);
});
