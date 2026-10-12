const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- Testing Hues & Whispers Luxe Full Integration ---');

const baseDir = path.join(__dirname, '..');

// 1. Files existence check
const filesToCheck = [
  'templates/hues-whispers-luxe/index.html',
  'templates/hues-whispers-luxe/builder.html',
  'templates/hues-whispers-luxe/preview.html',
  'templates/hues-whispers-luxe/config.json',
  'templates/hues-whispers-luxe/assets/thumbnail.jpg',
  'assets/templates/hues-whispers-luxe.jpg'
];

filesToCheck.forEach(f => {
  const p = path.join(baseDir, f);
  assert(fs.existsSync(p), `Missing file: ${f}`);
  const stat = fs.statSync(p);
  assert(stat.size > 0, `File is empty: ${f}`);
  console.log(`✓ ${f} exists (${stat.size} bytes)`);
});

// 2. Catalog check
const dataJs = fs.readFileSync(path.join(baseDir, 'js/vanvi-templates-data.js'), 'utf8');
assert(dataJs.includes("'hues-whispers-luxe'"), "Catalog missing hues-whispers-luxe ID");
assert(dataJs.includes("price: 1499"), "Catalog price not 1499");
assert(dataJs.includes("templates/hues-whispers-luxe/index.html"), "Catalog missing index.html templatePath");
assert(dataJs.includes("templates/hues-whispers-luxe/builder.html"), "Catalog missing builder.html builderPath");
console.log('✓ vanvi-templates-data.js has hues-whispers-luxe with correct price and paths');

// 3. Builder check
const builderHtml = fs.readFileSync(path.join(baseDir, 'templates/hues-whispers-luxe/builder.html'), 'utf8');
assert(builderHtml.includes("inBride"), "Builder missing inBride field");
assert(builderHtml.includes("inGroom"), "Builder missing inGroom field");
assert(builderHtml.includes("checkout.html?templateId=hues-whispers-luxe&amount=1499"), "Builder checkout link mismatch");
assert(builderHtml.includes("VANVI_LIVE_PREVIEW_SYNC"), "Builder missing VANVI_LIVE_PREVIEW_SYNC postMessage");
assert(builderHtml.includes("switchMobileTab"), "Builder missing mobile tab switch");
console.log('✓ builder.html has live sync, mobile tab switch, and real checkout integration');

// 4. Index HTML check
const indexHtml = fs.readFileSync(path.join(baseDir, 'templates/hues-whispers-luxe/index.html'), 'utf8');
assert(indexHtml.includes("applyLiveHuesData"), "index.html missing live sync receiver");
assert(indexHtml.includes("VANVI_LIVE_PREVIEW_SYNC"), "index.html missing VANVI_LIVE_PREVIEW_SYNC event listener");
assert(indexHtml.includes("template-adapter.js"), "index.html missing template-adapter.js");
assert(indexHtml.includes("vanvi-template-lock.js"), "index.html missing vanvi-template-lock.js");
assert(indexHtml.includes("demoWatermarkBadge"), "index.html missing demoWatermarkBadge element for dynamic removal");
console.log('✓ index.html has live preview receiver and adapter integration');

// 5. Listing pages check
const weddingHtml = fs.readFileSync(path.join(baseDir, 'wedding.html'), 'utf8');
assert(weddingHtml.includes("hues-whispers-luxe"), "wedding.html missing hues-whispers-luxe link");
console.log('✓ wedding.html has hues-whispers-luxe card');

const templatesHtml = fs.readFileSync(path.join(baseDir, 'templates.html'), 'utf8');
assert(templatesHtml.includes("'hues-whispers-luxe'"), "templates.html missing hues-whispers-luxe thumbnail mapping");
console.log('✓ templates.html has hues-whispers-luxe thumbnail mapping');

const masterBuilderHtml = fs.readFileSync(path.join(baseDir, 'builder.html'), 'utf8');
assert(masterBuilderHtml.includes("templates/hues-whispers-luxe/builder.html"), "builder.html missing studio card for hues-whispers-luxe");
console.log('✓ builder.html has studio launch card for hues-whispers-luxe');

console.log('\n🎉 ALL HUES & WHISPERS LUXE INTEGRATION CHECKS PASSED 100%!');
