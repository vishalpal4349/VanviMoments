const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- Testing Temple Blossom Luxe Integration ---');

// 1. Files existence check
const files = [
  'templates/temple-blossom-luxe/index.html',
  'templates/temple-blossom-luxe/builder.html',
  'templates/temple-blossom-luxe/preview.html',
  'templates/temple-blossom-luxe/template.json',
  'assets/templates/vanvi-temple-blossom-luxe.jpg',
  'templates/temple-blossom-luxe/assets/hero-arjun-meera.jpg'
];

files.forEach(f => {
  const p = path.join(__dirname, '..', f);
  assert(fs.existsSync(p), `Expected file missing: ${f}`);
  console.log(`✓ File exists: ${f}`);
});

// 2. Registry Check
const registryCode = fs.readFileSync(path.join(__dirname, '..', 'js/vanvi-templates-data.js'), 'utf8');
assert(registryCode.includes('temple-blossom-luxe'), 'Registry should contain temple-blossom-luxe');
assert(registryCode.includes('price: 799'), 'Registry should have price 799');
assert(registryCode.includes('originalPrice: 2499'), 'Registry should have originalPrice 2499');
assert(registryCode.includes('assets/templates/vanvi-temple-blossom-luxe.jpg'), 'Registry should reference vanvi-temple-blossom-luxe.jpg thumbnail');
console.log('✓ Master registry (vanvi-templates-data.js) properly configured');

// 3. Template.json Check
const tplJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'templates/temple-blossom-luxe/template.json'), 'utf8'));
assert.strictEqual(tplJson.price, 799, 'template.json price should be 799');
assert.strictEqual(tplJson.originalPrice, 2499, 'template.json originalPrice should be 2499');
assert.strictEqual(tplJson.id, 'temple-blossom-luxe');
console.log('✓ template.json valid with ₹799 launch price');

// 4. Wedding Marketplace Showcase Card Check
const weddingHtml = fs.readFileSync(path.join(__dirname, '..', 'wedding.html'), 'utf8');
assert(weddingHtml.includes('Temple Blossom Luxe'), 'wedding.html should contain Temple Blossom Luxe title');
assert(weddingHtml.includes('templates/temple-blossom-luxe/preview.html'), 'wedding.html should link to preview');
assert(weddingHtml.includes('templates/temple-blossom-luxe/builder.html'), 'wedding.html should link to builder');
assert(weddingHtml.includes('₹799'), 'wedding.html should display ₹799');
console.log('✓ wedding.html showcase card verified');

// 5. Templates catalog thumbnail map check
const templatesHtml = fs.readFileSync(path.join(__dirname, '..', 'templates.html'), 'utf8');
assert(templatesHtml.includes("'temple-blossom-luxe': 'assets/templates/vanvi-temple-blossom-luxe.jpg'"), 'templates.html should map thumbnail');
console.log('✓ templates.html thumbnail mapping verified');

// 6. Order Success Routing Check
const orderSuccessHtml = fs.readFileSync(path.join(__dirname, '..', 'order-success.html'), 'utf8');
assert(orderSuccessHtml.includes('templates/temple-blossom-luxe/index.html'), 'order-success.html should handle temple-blossom-luxe routing');
console.log('✓ order-success.html dynamic URL routing verified');

// 7. Builder Features & Mobile Polish Check
const builderHtml = fs.readFileSync(path.join(__dirname, '..', 'templates/temple-blossom-luxe/builder.html'), 'utf8');
assert(builderHtml.includes('vanvi-moments-logo-header.png') || builderHtml.includes('vanvi-moments-logo.png'), 'builder.html should use official Vanvi logo');
assert(builderHtml.includes('Publish ₹799'), 'builder.html should display Publish ₹799');
assert(builderHtml.includes('checkout.html?template=temple-blossom-luxe&amount=799'), 'builder.html should link to checkout at ₹799');
assert(builderHtml.includes('@media (max-width: 600px)'), 'builder.html should have mobile media query for 600px');
assert(builderHtml.includes('@media (max-width: 360px)'), 'builder.html should have mobile media query for 360px');
console.log('✓ builder.html branding, pricing, checkout link, and mobile queries verified');

// 8. Template Index Experience & Watermark Check
const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'templates/temple-blossom-luxe/index.html'), 'utf8');
assert(indexHtml.includes('vanvi-global-experience.css'), 'index.html should load vanvi-global-experience.css');
assert(indexHtml.includes('vanvi-template-lock.css'), 'index.html should load vanvi-template-lock.css');
assert(indexHtml.includes('vanvi-api.js'), 'index.html should load vanvi-api.js');
assert(indexHtml.includes('template-adapter.js'), 'index.html should load template-adapter.js');
assert(indexHtml.includes('vanvi-template-lock.js'), 'index.html should load vanvi-template-lock.js');
assert(indexHtml.includes('vanviWatermark'), 'index.html should contain vanviWatermark');
assert(indexHtml.includes('VANVI_LIVE_PREVIEW_SYNC'), 'index.html should support VANVI_LIVE_PREVIEW_SYNC');
console.log('✓ index.html scripts, watermarking, and preview listeners verified');

console.log('\n🌟 ALL TEMPLE BLOSSOM LUXE INTEGRATION CHECKS PASSED 100%! 🌟');
