/**
 * TEST SUITE: Full-Screen Preview & Single [Create] CTA Verification
 */
const fs = require('fs');
const path = require('path');
const http = require('http');

async function testAll() {
  console.log('==================================================');
  console.log('🧪 VERIFYING FULL-SCREEN PREVIEWS & CTA CLEANUP');
  console.log('==================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  const templateIds = [
    'birthday-3d-candle',
    'birthday-3d-candle-surprise',
    'birthday-white-bloom',
    'birthday-wish-01',
    'birthday-wish-02',
    'botanical-blush-wedding',
    'constellation-love',
    'golden-anniversary',
    'retro-polaroid-wall',
    'sincere-letter',
    'temple-royal-wedding'
  ];

  // 1. Verify all 11 templates have preview.html
  for (const id of templateIds) {
    const p = path.join(__dirname, `../templates/${id}/preview.html`);
    assert(fs.existsSync(p), `templates/${id}/preview.html exists`);

    const content = fs.readFileSync(p, 'utf8');
    assert(!content.includes('phone-simulator-chassis'), `templates/${id}/preview.html has NO phone simulator chassis`);
    assert(!content.includes('dynamic-island'), `templates/${id}/preview.html has NO fake dynamic island`);
    assert(!content.includes('laptop-mockup'), `templates/${id}/preview.html has NO laptop mockup`);
    assert(!content.includes('device-switcher'), `templates/${id}/preview.html has NO device switcher`);
    assert(content.includes('template-fullscreen-viewport'), `templates/${id}/preview.html has full-screen viewport`);
    assert(content.includes('vanvi-preview-top-dock'), `templates/${id}/preview.html has minimal floating dock`);
    assert(content.includes('Create'), `templates/${id}/preview.html has Create action`);
  }

  // 2. Verify root preview.html
  const rootPreview = fs.readFileSync(path.join(__dirname, '../preview.html'), 'utf8');
  assert(!rootPreview.includes('phone-simulator-chassis'), 'root preview.html has NO phone simulator chassis');
  assert(!rootPreview.includes('dynamic-island'), 'root preview.html has NO fake dynamic island');
  assert(rootPreview.includes('template-fullscreen-viewport'), 'root preview.html uses full-screen viewport');
  assert(rootPreview.includes('vanvi-preview-top-dock'), 'root preview.html has minimal top dock');

  // 3. Verify card buttons in js/vanvi-templates-data.js and templates.html
  const catalogJs = fs.readFileSync(path.join(__dirname, '../js/vanvi-templates-data.js'), 'utf8');
  assert(catalogJs.includes('<span>Preview</span>'), 'vanvi-templates-data.js has Preview button');
  assert(catalogJs.includes('<span>Create</span>'), 'vanvi-templates-data.js has single Create button');
  assert(!catalogJs.includes('Create Moment ✦'), 'vanvi-templates-data.js removed Create Moment ✦');
  assert(!catalogJs.includes('btn-text-short'), 'vanvi-templates-data.js removed dual short/full text');

  const templatesHtml = fs.readFileSync(path.join(__dirname, '../templates.html'), 'utf8');
  assert(templatesHtml.includes('<span>Preview</span>'), 'templates.html has Preview button');
  assert(templatesHtml.includes('<span>Create</span>'), 'templates.html has single Create button');
  assert(!templatesHtml.includes('Create Moment ✦'), 'templates.html removed Create Moment ✦');

  const categoryPremiumHtml = fs.readFileSync(path.join(__dirname, '../category-premium.html'), 'utf8');
  assert(categoryPremiumHtml.includes('<span>Preview</span>'), 'category-premium.html has Preview button');
  assert(categoryPremiumHtml.includes('<span>Create</span>'), 'category-premium.html has single Create button');
  assert(!categoryPremiumHtml.includes('Make Yours ✨'), 'category-premium.html removed Make Yours ✨');

  // 4. Test HTTP 200 for all preview routes
  for (const id of templateIds) {
    const ep = `/templates/${id}/preview.html`;
    await new Promise((resolve) => {
      http.get(`http://localhost:3000${ep}`, (res) => {
        assert(res.statusCode === 200, `HTTP GET ${ep} returned ${res.statusCode}`);
        resolve();
      }).on('error', (err) => {
        assert(false, `HTTP GET ${ep} failed with ${err.message}`);
        resolve();
      });
    });
  }

  // 5. Test root preview with template parameter
  const rootEps = [
    '/preview.html',
    '/preview.html?template=temple-royal-wedding',
    '/preview.html?template=botanical-blush-wedding',
    '/preview.html?template=birthday-3d-candle'
  ];
  for (const ep of rootEps) {
    await new Promise((resolve) => {
      http.get(`http://localhost:3000${ep}`, (res) => {
        assert(res.statusCode === 200, `HTTP GET ${ep} returned ${res.statusCode}`);
        resolve();
      }).on('error', (err) => {
        assert(false, `HTTP GET ${ep} failed with ${err.message}`);
        resolve();
      });
    });
  }

  console.log(`\n==================================================`);
  console.log(`📊 SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log(`==================================================`);

  if (failed > 0) process.exit(1);
}

testAll().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
