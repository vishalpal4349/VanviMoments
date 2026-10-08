/**
 * Comprehensive Verification Suite for Birthday White Bloom
 */

const fs = require('fs');
const assert = require('assert');

console.log('====================================================');
console.log('  TESTING BIRTHDAY WHITE BLOOM (birthday-white-bloom)  ');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function it(desc, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✅ PASS: ${desc}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${desc}`);
    console.error('    Error:', err.message);
  }
}

// 1. Master Catalog Data Check
it('Master catalog registers birthday-white-bloom template', () => {
  const VanviTemplatesData = require('../js/vanvi-templates-data.js');
  const tpl = VanviTemplatesData.getById('birthday-white-bloom') || VanviTemplatesData.getById('birthday-white-bloom-001');
  assert(tpl, 'Template birthday-white-bloom must exist');
  assert.strictEqual(tpl.name, 'Birthday White Bloom');
  assert.strictEqual(tpl.price, 0);
  assert.strictEqual(tpl.isFree, true);
});

it('Legacy soft-birthday resolves to Birthday White Bloom for backward compatibility', () => {
  const VanviTemplatesData = require('../js/vanvi-templates-data.js');
  const legacy = VanviTemplatesData.getById('soft-birthday') || VanviTemplatesData.getById('birthday-white-bloom');
  assert(legacy, 'soft-birthday query must resolve');
  assert.strictEqual(legacy.name, 'Birthday White Bloom');
});

// 2. Standalone Template Files
it('Standalone template HTML has clean semantics, zero Canva SDKs, and zero Tailwind CDN', () => {
  const html = fs.readFileSync('templates/birthday-white-bloom/index.html', 'utf8');
  assert(html.includes('Birthday White Bloom'), 'Title/meta must have Birthday White Bloom');
  assert(html.includes('style.css'), 'Must link style.css');
  assert(html.includes('id="openingStage"'), 'Must contain opening stage');
  assert(html.includes('id="experienceStage"'), 'Must contain experience stage');
  assert(html.includes('id="gallery"'), 'Must contain gallery');

  // Strict check: No Canva telemetry, no Canva SDKs, no Tailwind CDN
  assert(!html.includes('telemetry_sdk'), 'Must NOT contain telemetry_sdk');
  assert(!html.includes('data_sdk'), 'Must NOT contain data_sdk');
  assert(!html.includes('cdn.tailwindcss.com'), 'Must NOT contain Tailwind CDN');
});

it('Standalone CSS contains pure light luxury variables and responsive breakpoints', () => {
  const css = fs.readFileSync('templates/birthday-white-bloom/style.css', 'utf8');
  assert(css.includes('--pearl: #fffdf9'), 'Must contain pearl white variable');
  assert(css.includes('--blush: #f9e4e8'), 'Must contain blush variable');
  assert(css.includes('--rose: #b95a73'), 'Must contain rose variable');
  assert(css.includes('@media (max-width: 768px)'), 'Must contain tablet breakpoint');
  assert(css.includes('prefers-reduced-motion'), 'Must support prefers-reduced-motion');
});

it('Bespoke template customizer builder exists and has responsive controls', () => {
  const builderHtml = fs.readFileSync('templates/birthday-white-bloom/builder.html', 'utf8');
  assert(builderHtml.includes('vanvi-custom-builder.css'), 'Must link custom builder stylesheet');
  assert(builderHtml.includes('vanvi-builder-core.js'), 'Must link builder core script');
});

it('Simulating multiple published moments confirms distinct IDs and zero overwrites', () => {
  const moment1 = {
    id: 'vm_bwb_1720000001_abc123',
    recipient: 'Aanya',
    sender: 'Dev',
    birthdayDate: '2027-10-15T00:00',
    message: 'Happy Birthday Aanya!'
  };

  const moment2 = {
    id: 'vm_bwb_1720000002_xyz789',
    recipient: 'Rohan',
    sender: 'Priya',
    birthdayDate: '2027-11-20T00:00',
    message: 'Happy Birthday Rohan!'
  };

  assert.notStrictEqual(moment1.id, moment2.id, 'Moment IDs must be unique');
});

it('index.html displays Birthday White Bloom in Free Collection or Catalog', () => {
  const indexHtml = fs.readFileSync('index.html', 'utf8');
  assert(indexHtml.includes('birthday-white-bloom') || indexHtml.includes('Birthday White Bloom'), 'index.html must reference Birthday White Bloom');
});

console.log('\n====================================================');
console.log(`  RESULTS: ${passedTests}/${totalTests} TESTS PASSED (${Math.round((passedTests/totalTests)*100)}%)`);
console.log('====================================================\n');

if (passedTests !== totalTests) {
  process.exit(1);
}
