const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- Testing Love in Clouds Integration ---');

// 1. Files existence check
const files = [
  'templates/love-in-clouds/index.html',
  'templates/love-in-clouds/builder.html',
  'templates/love-in-clouds/preview.html',
  'templates/love-in-clouds/template.json',
  'assets/templates/vanvi-love-in-clouds.jpg',
  'templates/love-in-clouds/assets/cloud-hero.jpg'
];

files.forEach(f => {
  const p = path.join(__dirname, '..', f);
  assert(fs.existsSync(p), `Expected file missing: ${f}`);
  console.log(`✓ File exists: ${f}`);
});

// 2. Registry Check
const registryCode = fs.readFileSync(path.join(__dirname, '..', 'js/vanvi-templates-data.js'), 'utf8');
assert(registryCode.includes('love-in-clouds'), 'Registry should contain love-in-clouds');
assert(registryCode.includes('assets/templates/vanvi-love-in-clouds.jpg'), 'Registry should reference vanvi-love-in-clouds.jpg');
const VanviTemplatesData = require(path.join(__dirname, '..', 'js/vanvi-templates-data.js'));
const tpl = VanviTemplatesData.getById('love-in-clouds');
assert(tpl, 'VanviTemplatesData.getById should resolve love-in-clouds');
assert.strictEqual(tpl.price, 799, 'Price should be 799');
assert.strictEqual(tpl.originalPrice, 2499, 'Original price should be 2499');
assert.strictEqual(tpl.templatePath, 'templates/love-in-clouds/index.html');
assert.strictEqual(tpl.builderPath, 'templates/love-in-clouds/builder.html');
console.log('✓ Master registry (vanvi-templates-data.js) properly resolved with ₹799');

// 3. Template.json Check
const tplJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'templates/love-in-clouds/template.json'), 'utf8'));
assert.strictEqual(tplJson.price, 799, 'template.json price should be 799');
assert.strictEqual(tplJson.originalPrice, 2499, 'template.json originalPrice should be 2499');
assert.strictEqual(tplJson.id, 'love-in-clouds');
console.log('✓ template.json verified with ₹799 price');

// 4. Templates catalog thumbnail map check
const templatesHtml = fs.readFileSync(path.join(__dirname, '..', 'templates.html'), 'utf8');
assert(templatesHtml.includes("'love-in-clouds': 'assets/templates/vanvi-love-in-clouds.jpg'"), 'templates.html should map thumbnail');
console.log('✓ templates.html thumbnail mapping verified');

// 5. Wedding Showcase Card Check
const weddingHtml = fs.readFileSync(path.join(__dirname, '..', 'wedding.html'), 'utf8');
assert(weddingHtml.includes('Love in Clouds'), 'wedding.html should contain Love in Clouds title');
assert(weddingHtml.includes('templates/love-in-clouds/preview.html'), 'wedding.html should link to preview');
assert(weddingHtml.includes('templates/love-in-clouds/builder.html'), 'wedding.html should link to builder');
assert(weddingHtml.includes('₹799'), 'wedding.html should display ₹799');
console.log('✓ wedding.html showcase card verified');

// 6. Order Success Routing Check
const orderSuccessHtml = fs.readFileSync(path.join(__dirname, '..', 'order-success.html'), 'utf8');
assert(orderSuccessHtml.includes('templates/love-in-clouds/index.html'), 'order-success.html should route to love-in-clouds');
console.log('✓ order-success.html dynamic URL routing verified');

// 7. Builder Features & Mobile Polish Check
const builderHtml = fs.readFileSync(path.join(__dirname, '..', 'templates/love-in-clouds/builder.html'), 'utf8');
assert(builderHtml.includes('vanvi-moments-logo-header.png') || builderHtml.includes('vanvi-moments-logo.png'), 'builder.html should use official Vanvi logo');
assert(builderHtml.includes('Publish ₹799'), 'builder.html should display Publish ₹799');
assert(builderHtml.includes('checkout.html?template=love-in-clouds&amount=799'), 'builder.html should link to checkout at ₹799');
assert(builderHtml.includes('@media (max-width: 600px)'), 'builder.html should have mobile media query for 600px');
assert(builderHtml.includes('@media (max-width: 360px)'), 'builder.html should have mobile media query for 360px');
console.log('✓ builder.html branding, pricing, checkout link, and mobile queries verified');

// 8. Template Index Experience & Watermark Check
const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'templates/love-in-clouds/index.html'), 'utf8');
assert(indexHtml.includes('vanvi-global-experience.css'), 'index.html should load vanvi-global-experience.css');
assert(indexHtml.includes('vanvi-template-lock.css'), 'index.html should load vanvi-template-lock.css');
assert(indexHtml.includes('vanvi-api.js'), 'index.html should load vanvi-api.js');
assert(indexHtml.includes('template-adapter.js'), 'index.html should load template-adapter.js');
assert(indexHtml.includes('vanvi-template-lock.js'), 'index.html should load vanvi-template-lock.js');
assert(indexHtml.includes('vanviWatermark'), 'index.html should contain vanviWatermark');
assert(indexHtml.includes('VANVI_LIVE_PREVIEW_SYNC'), 'index.html should support VANVI_LIVE_PREVIEW_SYNC');
assert(indexHtml.includes('@media (max-width: 480px)'), 'index.html should have mobile button media query');
console.log('✓ index.html scripts, watermarking, responsive styles, and sync receiver verified');

console.log('\n🌟 ALL LOVE IN CLOUDS INTEGRATION CHECKS PASSED 100%! 🌟');
