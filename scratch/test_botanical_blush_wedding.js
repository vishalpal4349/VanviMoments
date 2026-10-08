/**
 * VANVI MOMENTS — TEST SUITE FOR TEMPLATE 02: BOTANICAL BLUSH WEDDING
 */
const fs = require('fs');
const path = require('path');
const http = require('http');

async function runTests() {
  console.log('==================================================');
  console.log('🧪 TESTING TEMPLATE 02: BOTANICAL BLUSH WEDDING');
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

  // 1. Template JSON validation
  const tplJsonPath = path.join(__dirname, '../templates/botanical-blush-wedding/template.json');
  assert(fs.existsSync(tplJsonPath), 'template.json exists');
  const tplData = JSON.parse(fs.readFileSync(tplJsonPath, 'utf8'));
  assert(tplData.id === 'botanical-blush-wedding', 'template.json ID is botanical-blush-wedding');
  assert(tplData.price === 1999, 'template.json price is 1999');
  assert(tplData.category === 'Wedding', 'template.json category is Wedding');
  assert(tplData.custom_data_defaults.coupleNames === 'Vivan & Divya', 'Demo couple is Vivan & Divya');
  assert(tplData.custom_data_defaults.weddingDate === '30 November 2027', 'Demo date is 30 November 2027');
  assert(tplData.custom_data_defaults.scratchMessage.length > 20, 'Scratch card secret message is populated');

  // 2. Assets validation
  const assetsDir = path.join(__dirname, '../templates/botanical-blush-wedding/assets');
  assert(fs.existsSync(assetsDir), 'assets directory exists');
  const files = fs.readdirSync(assetsDir);
  assert(files.includes('botanical-hero-couple.jpg'), 'botanical-hero-couple.jpg exists');
  assert(files.includes('botanical-story-walk.jpg'), 'botanical-story-walk.jpg exists');
  assert(files.includes('botanical-venue-mandap.jpg'), 'botanical-venue-mandap.jpg exists');
  assert(files.includes('botanical-rings.jpg'), 'botanical-rings.jpg exists');
  assert(files.includes('botanical-blush-melody.mp3'), 'botanical-blush-melody.mp3 exists');

  // 3. HTML Files existence
  const indexPath = path.join(__dirname, '../templates/botanical-blush-wedding/index.html');
  const previewPath = path.join(__dirname, '../templates/botanical-blush-wedding/preview.html');
  const builderPath = path.join(__dirname, '../templates/botanical-blush-wedding/builder.html');

  assert(fs.existsSync(indexPath), 'index.html exists');
  assert(fs.existsSync(previewPath), 'preview.html exists');
  assert(fs.existsSync(builderPath), 'builder.html exists');

  const indexContent = fs.readFileSync(indexPath, 'utf8');
  assert(indexContent.includes('scratchCanvas'), 'index.html contains scratchCanvas');
  assert(indexContent.includes('petalCanvas'), 'index.html contains petalCanvas');
  assert(indexContent.includes('floatingAudioPill'), 'index.html contains floating audio control');
  assert(indexContent.includes('VANVI_LIVE_PREVIEW_SYNC'), 'index.html listens for VANVI_LIVE_PREVIEW_SYNC');
  assert(indexContent.includes('Vivan') && indexContent.includes('Divya'), 'index.html has Vivan & Divya');
  assert(indexContent.includes('30 November 2027'), 'index.html has 30 November 2027');

  const builderContent = fs.readFileSync(builderPath, 'utf8');
  assert(builderContent.includes('inpScratchMessage'), 'builder.html has scratch message input');
  assert(builderContent.includes('VANVI_LIVE_PREVIEW_SYNC'), 'builder.html emits VANVI_LIVE_PREVIEW_SYNC');

  // 4. Master Catalog validation
  const catalogPath = path.join(__dirname, '../js/vanvi-templates-data.js');
  const catalogContent = fs.readFileSync(catalogPath, 'utf8');
  assert(catalogContent.includes('botanical-blush-wedding'), 'vanvi-templates-data.js registers botanical-blush-wedding');

  // 5. Preview & Builder routers
  const rootPreview = fs.readFileSync(path.join(__dirname, '../preview.html'), 'utf8');
  assert(rootPreview.includes('botanical-blush-wedding'), 'preview.html contains botanical-blush-wedding');

  const rootBuilder = fs.readFileSync(path.join(__dirname, '../builder.html'), 'utf8');
  assert(rootBuilder.includes('botanical-blush-wedding'), 'builder.html routes botanical-blush-wedding');

  // 6. HTTP Endpoint status checks
  const endpoints = [
    '/templates/botanical-blush-wedding/index.html',
    '/templates/botanical-blush-wedding/preview.html',
    '/templates/botanical-blush-wedding/builder.html',
    '/templates/botanical-blush-wedding/assets/botanical-hero-couple.jpg',
    '/templates/botanical-blush-wedding/assets/botanical-blush-melody.mp3',
    '/preview.html?template=botanical-blush-wedding',
    '/builder.html?template=botanical-blush-wedding'
  ];

  for (const ep of endpoints) {
    await new Promise((resolve) => {
      http.get(`http://localhost:3000${ep}`, (res) => {
        assert(res.statusCode === 200 || res.statusCode === 302, `HTTP GET ${ep} returned ${res.statusCode}`);
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

runTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
