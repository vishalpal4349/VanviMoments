/**
 * VANVI MOMENTS — PHASE 5 VERIFICATION SUITE
 * Validates template-specific builders, Template World, checkout details handover,
 * and experience.html personalization architecture.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('====================================================');
console.log('VANVI MOMENTS — PHASE 5 TEMPLATE BUILDERS VERIFICATION');
console.log('====================================================\n');

let passed = 0;
let total = 0;

function check(desc, fn) {
  total++;
  try {
    fn();
    console.log(`  ✓ [PASS] ${desc}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ [FAIL] ${desc}: ${err.message}`);
  }
}

// 1. Verify all 9 templates have independent personal builders
console.log('[Test Group 1] Verifying 9 Template-Specific Personal Builders:');

const expectedTemplates = [
  { id: 'birthday-3d-candle', uniqueTerm: 'flame' },
  { id: 'birthday-3d-candle-surprise', uniqueTerm: 'scratch' },
  { id: 'birthday-white-bloom', uniqueTerm: 'flora' },
  { id: 'birthday-wish-01', uniqueTerm: 'flavor' },
  { id: 'birthday-wish-02', uniqueTerm: 'neon' },
  { id: 'constellation-love', uniqueTerm: 'nebula' },
  { id: 'golden-anniversary', uniqueTerm: 'milestone' },
  { id: 'retro-polaroid-wall', uniqueTerm: 'washi' },
  { id: 'sincere-letter', uniqueTerm: 'wax' }
];

expectedTemplates.forEach(t => {
  check(`Template "${t.id}" has dedicated builder.html`, () => {
    const builderPath = path.join('templates', t.id, 'builder.html');
    assert(fs.existsSync(builderPath), `Missing ${builderPath}`);
    const content = fs.readFileSync(builderPath, 'utf8');
    assert(content.length > 500, `${builderPath} is too short`);
    assert(content.toLowerCase().includes(t.uniqueTerm), `${builderPath} missing unique customization control: "${t.uniqueTerm}"`);
    assert(content.includes('VanviBuilderCore'), `${builderPath} must integrate VanviBuilderCore`);
  });

  check(`Template "${t.id}" template.json configures builder: custom`, () => {
    const jsonPath = path.join('templates', t.id, 'template.json');
    assert(fs.existsSync(jsonPath), `Missing ${jsonPath}`);
    const json = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    assert.strictEqual(json.builder?.type, 'custom', `${t.id} builder.type must be "custom"`);
    assert(json.builder?.builderPath?.includes('builder.html'), `${t.id} builderPath must point to its builder.html`);
  });
});

// 2. Verify VanviBuilderCore infrastructure
console.log('\n[Test Group 2] Verifying Reusable Builder Infrastructure (js/vanvi-builder-core.js):');

check('js/vanvi-builder-core.js exists and exports API', () => {
  const corePath = path.join('js', 'vanvi-builder-core.js');
  assert(fs.existsSync(corePath), 'Missing js/vanvi-builder-core.js');
  const code = fs.readFileSync(corePath, 'utf8');
  assert(code.includes('class VanviBuilderCore'), 'Missing VanviBuilderCore class definition');
  assert(code.includes('init('), 'Missing init() method');
  assert(code.includes('uploadMedia('), 'Missing uploadMedia() method');
  assert(code.includes('saveMoment('), 'Missing saveMoment() method');
  assert(code.includes('attachPreview('), 'Missing attachPreview() method');
  assert(code.includes('vanvi_user_moments'), 'Missing offline localStorage persistence fallback');
});

// 3. Verify builder.html master dispatcher & universal hub
console.log('\n[Test Group 3] Verifying builder.html Universal Dispatcher:');

check('builder.html dynamically routes to template personal builders', () => {
  const code = fs.readFileSync('builder.html', 'utf8');
  assert(code.includes('templates/birthday-3d-candle/builder.html'), 'Missing birthday-3d-candle route');
  assert(code.includes('templates/constellation-love/builder.html'), 'Missing constellation-love route');
  assert(code.includes('templates/retro-polaroid-wall/builder.html'), 'Missing retro-polaroid-wall route');
  assert(code.includes('window.location.replace'), 'builder.html must dispatch seamlessly to target builder');
  assert(code.includes('templateId'), 'builder.html must reference templateId');
  assert(code.includes('custom_data'), 'builder.html must reference custom_data');
});

// 4. Verify experience.html final personalized experience
console.log('\n[Test Group 4] Verifying experience.html Final Personalized Experience:');

check('experience.html exists and provides template-specific experience & floating controls', () => {
  assert(fs.existsSync('experience.html'), 'Missing experience.html');
  const code = fs.readFileSync('experience.html', 'utf8');
  assert(code.includes('js/vanvi-qr.js'), 'experience.html must load VanviQR');
  assert(code.includes('btnToggleSound'), 'Missing floating audio toggle control');
  assert(code.includes('btnShareTriggerTop'), 'Missing floating share/QR button');
  assert(code.includes('btnEditBuilder'), 'Missing edit in builder button');
  assert(code.includes('templates/'), 'experience.html must mount template-specific experience path');
  assert(code.includes('qrCanvas'), 'Missing QR Code canvas container');
});

// 5. Verify checkout.html template details & personal builder handover
console.log('\n[Test Group 5] Verifying checkout.html Handover:');

check('checkout.html hands off to personal template builder upon completion', () => {
  const code = fs.readFileSync('checkout.html', 'utf8');
  assert(code.includes('linkCustomizeInBuilder'), 'checkout.html must have link to customize in personal builder');
  assert(code.includes('Personalize in Template Studio'), 'checkout.html missing Personalize in Template Studio button');
  assert(code.includes('basePrice'), 'checkout.html must dynamically calculate basePrice per template');
});

// 6. Verify templates.html has direct builder links and index.html is protected
console.log('\n[Test Group 6] Verifying templates.html Template World & index.html protection:');

check('templates.html features direct builder links & index.html is protected', () => {
  const templatesCode = fs.readFileSync('templates.html', 'utf8');
  assert(templatesCode.includes('builder.html'), 'templates.html missing builder links');
  const indexCode = fs.readFileSync('index.html', 'utf8');
  assert(indexCode.length > 1000, 'index.html intact');
});

console.log('\n====================================================');
console.log(`PHASE 5 TEST RESULTS: ${passed} / ${total} checks passed (${total - passed} failed)`);
console.log('====================================================\n');

if (passed === total) {
  process.exit(0);
} else {
  process.exit(1);
}
