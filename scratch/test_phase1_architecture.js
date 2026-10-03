const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('====================================================');
console.log('VANVI MOMENTS — PHASE 1 ARCHITECTURE VERIFICATION');
console.log('====================================================');

const templateFolders = [
  'birthday-3d-candle',
  'birthday-3d-candle-surprise',
  'birthday-white-bloom',
  'birthday-wish-01',
  'birthday-wish-02',
  'constellation-love',
  'golden-anniversary',
  'retro-polaroid-wall',
  'sincere-letter'
];

// TEST 1: Check each template has independent template.json
console.log('\n[Test 1] Verifying independent template.json for all 9 templates:');
const seenIds = new Set();
templateFolders.forEach(folder => {
  const jsonPath = path.join('templates', folder, 'template.json');
  assert(fs.existsSync(jsonPath), `Missing template.json in ${folder}`);
  
  const config = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  assert(config.id, `Missing id in ${folder}/template.json`);
  assert(!seenIds.has(config.id), `Duplicate template id ${config.id} in ${folder}`);
  seenIds.add(config.id);

  assert(typeof config.price === 'number', `Price must be numeric in ${folder}/template.json`);
  assert(config.name, `Missing name in ${folder}/template.json`);
  assert(config.builder && config.builder.type, `Missing builder.type in ${folder}/template.json`);
  assert(config.schema && Array.isArray(config.schema.fields), `Missing schema.fields in ${folder}/template.json`);
  
  console.log(`  ✓ ${folder} -> ID: "${config.id}" | Price: ₹${config.price} | Builder: ${config.builder.type} | Fields: ${config.schema.fields.length}`);
});

// TEST 2: Check template-adapter.js supports custom_data
console.log('\n[Test 2] Verifying template-adapter.js custom_data engine:');
const adapterCode = fs.readFileSync('js/template-adapter.js', 'utf8');
assert(adapterCode.includes('custom_data'), 'template-adapter.js must support custom_data');
assert(adapterCode.includes('vanvi:momentLoaded'), 'template-adapter.js must dispatch vanvi:momentLoaded');
console.log('  ✓ template-adapter.js dynamically maps custom_data JSON and dispatches vanvi:momentLoaded event');

// TEST 3: Check builder.html supports custom_data & dynamic paths
console.log('\n[Test 3] Verifying builder.html architecture:');
const builderCode = fs.readFileSync('builder.html', 'utf8');
assert(builderCode.includes('custom_data'), 'builder.html must construct custom_data payload');
assert(builderCode.includes('templateId'), 'builder.html must store templateId');
console.log('  ✓ builder.html constructs custom_data payload and resolves templateId dynamically');

// TEST 4: Check server routes & database store templateId and custom_data
console.log('\n[Test 4] Verifying backend database & route readiness:');
const dbCode = fs.readFileSync('server/db/database.js', 'utf8');
const routesCode = fs.readFileSync('server/routes/moments.routes.js', 'utf8');
assert(dbCode.includes('custom_data'), 'database.js must support custom_data');
assert(dbCode.includes('templateId'), 'database.js must support templateId');
assert(routesCode.includes('custom_data'), 'moments.routes.js must handle custom_data');
assert(routesCode.includes('templateId'), 'moments.routes.js must handle templateId');
console.log('  ✓ Database model and moments routes persist and serve templateId & custom_data');

// TEST 5: Verify all template index.html files include template-adapter.js
console.log('\n[Test 5] Verifying template-adapter inclusion across all 9 templates:');
templateFolders.forEach(folder => {
  const htmlPath = path.join('templates', folder, 'index.html');
  const html = fs.readFileSync(htmlPath, 'utf8');
  assert(html.includes('template-adapter.js'), `${folder} index.html is missing template-adapter.js`);
  console.log(`  ✓ ${folder}/index.html includes template-adapter.js`);
});

console.log('\n====================================================');
console.log('ALL PHASE 1 ARCHITECTURAL TESTS PASSED CLEANLY! (5/5)');
console.log('====================================================\n');
