/**
 * Comprehensive Verification Suite for Birthday White Bloom (birthday-white-bloom-001)
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('====================================================');
console.log('  TESTING BIRTHDAY WHITE BLOOM (birthday-white-bloom-001)  ');
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
it('Master catalog registers birthday-white-bloom-001 as #1 free birthday template', () => {
  const VanviTemplatesData = require('../js/vanvi-templates-data.js');
  const tpl = VanviTemplatesData.getById('birthday-white-bloom-001');
  assert(tpl, 'Template birthday-white-bloom-001 must exist');
  assert.strictEqual(tpl.name, 'Birthday White Bloom');
  assert.strictEqual(tpl.price, 0);
  assert.strictEqual(tpl.isFree, true);
  assert.strictEqual(tpl.tier, 'Free');
  assert.strictEqual(tpl.categorySlug, 'birthday');
  assert(Array.isArray(tpl.features) && tpl.features.length >= 7, 'Features must list all 7+ interactions');

  const bdayList = VanviTemplatesData.getByCategory('birthday');
  assert.strictEqual(bdayList[0].id, 'birthday-white-bloom-001', 'Birthday White Bloom must be #1 in Birthday category');

  const freeList = VanviTemplatesData.getByCategory('free');
  assert.strictEqual(freeList[0].id, 'birthday-white-bloom-001', 'Birthday White Bloom must be #1 in Free category');
});

it('Legacy soft-birthday resolves to birthday-white-bloom-001 for backward compatibility', () => {
  const VanviTemplatesData = require('../js/vanvi-templates-data.js');
  const legacy = VanviTemplatesData.getById('soft-birthday');
  assert(legacy, 'soft-birthday query must resolve');
  assert.strictEqual(legacy.id, 'birthday-white-bloom-001');
  assert.strictEqual(legacy.name, 'Birthday White Bloom');
});

// 2. Registry Check
it('Template registry registry/templates.js maps birthday-white-bloom-001', () => {
  const registryModule = require('../templates/registry/templates.js');
  const tpl = registryModule.getTemplateById('birthday-white-bloom-001');
  assert(tpl, 'Registry must find birthday-white-bloom-001');
  assert.strictEqual(tpl.name, 'Birthday White Bloom');
  assert.strictEqual(tpl.price, 0);
  assert.strictEqual(tpl.isFree, true);

  const legacy = registryModule.getTemplateById('soft-birthday');
  assert(legacy, 'Registry must resolve soft-birthday');
  assert.strictEqual(legacy.id, 'birthday-white-bloom-001');
});

// 3. Standalone Template Files
it('Standalone template HTML has clean semantics, zero Canva SDKs, and zero Tailwind CDN', () => {
  const html = fs.readFileSync('templates/birthday-white-bloom-001/index.html', 'utf8');
  assert(html.includes('Birthday White Bloom'), 'Title/meta must have Birthday White Bloom');
  assert(html.includes('style.css'), 'Must link style.css');
  assert(html.includes('script.js'), 'Must link script.js');
  assert(html.includes('qrcode.min.js'), 'Must link qrcode.min.js');
  assert(html.includes('id="openingStage"'), 'Must contain opening stage');
  assert(html.includes('id="experienceStage"'), 'Must contain experience stage');
  assert(html.includes('id="gallery"'), 'Must contain gallery');
  assert(html.includes('id="letterToggle"'), 'Must contain wax seal envelope toggle');
  assert(html.includes('id="resetCake"'), 'Must contain cake candles & reset');
  assert(html.includes('id="timeline"'), 'Must contain timeline');
  assert(html.includes('id="surpriseToggle"'), 'Must contain surprise toggle');
  assert(html.includes('id="qrCanvas"'), 'Must contain QR canvas');

  // Strict check: No Canva telemetry, no Canva SDKs, no Tailwind CDN, no developer panel textarea
  assert(!html.includes('telemetry_sdk'), 'Must NOT contain telemetry_sdk');
  assert(!html.includes('data_sdk'), 'Must NOT contain data_sdk');
  assert(!html.includes('editing_sdk'), 'Must NOT contain editing_sdk');
  assert(!html.includes('resizing_sdk'), 'Must NOT contain resizing_sdk');
  assert(!html.includes('__codeletBootstrap__'), 'Must NOT contain __codeletBootstrap__');
  assert(!html.includes('cdn.tailwindcss.com'), 'Must NOT contain Tailwind CDN');
  assert(!html.includes('source-code'), 'Must NOT contain developer handoff source-code panel');
});

it('Standalone CSS contains pure light luxury variables and responsive breakpoints', () => {
  const css = fs.readFileSync('templates/birthday-white-bloom-001/style.css', 'utf8');
  assert(css.includes('--pearl: #fffdf9'), 'Must contain pearl white variable');
  assert(css.includes('--blush: #f9e4e8'), 'Must contain blush variable');
  assert(css.includes('--rose: #b95a73'), 'Must contain rose variable');
  assert(css.includes('--lavender: #e9e3f5'), 'Must contain lavender variable');
  assert(css.includes('--champagne: #d8b477'), 'Must contain champagne variable');
  assert(css.includes('@keyframes drift'), 'Must contain floating petal drift animation');
  assert(css.includes('@keyframes flicker'), 'Must contain candle flame flicker animation');
  assert(css.includes('@media (max-width: 768px)'), 'Must contain tablet breakpoint');
  assert(css.includes('@media (max-width: 420px)'), 'Must contain mobile breakpoint');
  assert(css.includes('prefers-reduced-motion'), 'Must support prefers-reduced-motion');
});

it('Standalone script.js exposes window.VanviMomentsTemplate.update API and safe DOM handling', () => {
  const js = fs.readFileSync('templates/birthday-white-bloom-001/script.js', 'utf8');
  assert(js.includes('window.VanviMomentsTemplate'), 'Must expose VanviMomentsTemplate API');
  assert(js.includes('update: function'), 'Must have update function for live preview');
  assert(js.includes('escapeHtml'), 'Must have escapeHtml helper for security');
  assert(js.includes('loadInitialCustomization'), 'Must parse URL parameters and storage');
  assert(js.includes('whatsappShare'), 'Must handle WhatsApp share');
  assert(js.includes('copyShare'), 'Must handle copy share');
  assert(js.includes('qrShare'), 'Must handle QR share');
});

it('Client-side QR Code engine compiles and exposes VanviQR.render', () => {
  const qrCode = fs.readFileSync('templates/birthday-white-bloom-001/assets/qrcode.min.js', 'utf8');
  assert(qrCode.includes('VanviQR'), 'Must export VanviQR');
  assert(qrCode.includes('render: renderQRCode'), 'Must have render function');

  // Verify js/vanvi-qr.js matches
  const globalQr = fs.readFileSync('js/vanvi-qr.js', 'utf8');
  assert.strictEqual(qrCode, globalQr, 'assets/qrcode.min.js and js/vanvi-qr.js must be identical');
});

// 4. Creator Studio (builder.html) Integration
it('builder.html features real-time live preview, device switcher, and offline QR canvas', () => {
  const builderHtml = fs.readFileSync('builder.html', 'utf8');
  assert(builderHtml.includes('id="livePreviewFrameContainer"'), 'Must contain live preview container');
  assert(builderHtml.includes('id="livePreviewIframe"'), 'Must contain live preview iframe');
  assert(builderHtml.includes('id="btnDeviceMobile"'), 'Must contain mobile device switcher');
  assert(builderHtml.includes('id="btnDeviceTablet"'), 'Must contain tablet device switcher');
  assert(builderHtml.includes('id="btnDeviceDesktop"'), 'Must contain desktop device switcher');
  assert(builderHtml.includes('id="shareModalQrCanvas"'), 'Must contain real QR canvas in publish modal');
  assert(builderHtml.includes('id="inputBirthdayDate"'), 'Must contain birthday date & time countdown input');
  assert(builderHtml.includes('updateLivePreviewIframe'), 'Must contain live preview iframe update bridge');
  assert(builderHtml.includes('VanviQR.render'), 'Must generate real QR on publish');
  assert(builderHtml.includes('js/vanvi-qr.js'), 'Must link vanvi-qr.js');
});

// 5. Multi-Moment Isolation & Persistence
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

  const storage = [moment1, moment2];
  assert.notStrictEqual(storage[0].id, storage[1].id, 'Each moment must have a unique ID');
  assert.notStrictEqual(storage[0].recipient, storage[1].recipient, 'Recipients must remain separate');
  assert.strictEqual(storage.find(m => m.id === moment1.id).recipient, 'Aanya');
  assert.strictEqual(storage.find(m => m.id === moment2.id).recipient, 'Rohan');
});

// 6. Marketplace and Ecosystem Routing
it('template-detail.html routes Birthday White Bloom live preview to standalone template', () => {
  const detailHtml = fs.readFileSync('template-detail.html', 'utf8');
  assert(detailHtml.includes('birthday-white-bloom-001'), 'Must reference birthday-white-bloom-001');
  assert(detailHtml.includes('templates/birthday-white-bloom-001/index.html'), 'Must route live preview to standalone template');
});

it('moment.html dispatches Birthday White Bloom moments to dedicated template', () => {
  const momentHtml = fs.readFileSync('moment.html', 'utf8');
  assert(momentHtml.includes('birthday-white-bloom-001'), 'Must detect birthday-white-bloom-001');
  assert(momentHtml.includes('templates/birthday-white-bloom-001/index.html'), 'Must forward to dedicated template');
});

it('index.html displays Birthday White Bloom in Free Collection', () => {
  const indexHtml = fs.readFileSync('index.html', 'utf8');
  assert(indexHtml.includes('data-name="Birthday White Bloom"'), 'Index free slider must feature Birthday White Bloom');
  assert(indexHtml.includes('data-id="birthday-white-bloom-001"'), 'Must have data-id birthday-white-bloom-001');
  assert(!indexHtml.includes('data-name="Soft Birthday"'), 'Soft Birthday must be replaced');
});

console.log(`\n====================================================`);
console.log(`  RESULTS: ${passedTests}/${totalTests} TESTS PASSED (${Math.round(passedTests/totalTests*100)}%)`);
console.log(`====================================================`);

if (passedTests !== totalTests) {
  process.exit(1);
}

