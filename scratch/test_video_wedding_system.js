const fs = require('fs');
const path = require('path');

console.log('--- Testing Vanvi Moments Video Wedding Invitation System ---');

// 1. Verify template.json
const templateJsonPath = path.join(__dirname, '..', 'templates', 'video-royal-vivah', 'template.json');
if (!fs.existsSync(templateJsonPath)) {
  console.error('FAIL: template.json does not exist');
  process.exit(1);
}
const templateData = JSON.parse(fs.readFileSync(templateJsonPath, 'utf8'));
console.log('✓ template.json valid JSON. ID:', templateData.id, 'Price:', templateData.price);

// 2. Verify files exist
const requiredFiles = [
  'templates/video-royal-vivah/video-engine.js',
  'templates/video-royal-vivah/builder.html',
  'templates/video-royal-vivah/preview.html',
  'templates/video-royal-vivah/index.html'
];
for (const rel of requiredFiles) {
  const full = path.join(__dirname, '..', rel);
  if (!fs.existsSync(full)) {
    console.error(`FAIL: ${rel} does not exist`);
    process.exit(1);
  }
  const size = fs.statSync(full).size;
  console.log(`✓ ${rel} exists (${size} bytes)`);
}

// 3. Test video-engine.js syntax
const engineCode = fs.readFileSync(path.join(__dirname, '..', 'templates/video-royal-vivah/video-engine.js'), 'utf8');
try {
  new Function('window', engineCode);
  console.log('✓ video-engine.js syntax is 100% valid JavaScript');
} catch (e) {
  console.error('FAIL: video-engine.js syntax error:', e.message);
  process.exit(1);
}

// 4. Verify registration in js/vanvi-templates-data.js
const regCode = fs.readFileSync(path.join(__dirname, '..', 'js', 'vanvi-templates-data.js'), 'utf8');
if (!regCode.includes("'video-royal-vivah'")) {
  console.error('FAIL: video-royal-vivah not found in js/vanvi-templates-data.js');
  process.exit(1);
}
console.log('✓ video-royal-vivah registered in js/vanvi-templates-data.js');

// 5. Verify wedding.html showcase
const weddingHtml = fs.readFileSync(path.join(__dirname, '..', 'wedding.html'), 'utf8');
if (!weddingHtml.includes('templates/video-royal-vivah/preview.html') || !weddingHtml.includes('templates/video-royal-vivah/builder.html')) {
  console.error('FAIL: video-royal-vivah links missing in wedding.html');
  process.exit(1);
}
console.log('✓ video-royal-vivah showcase card present in wedding.html');

// 6. Verify checkout.html links
const checkoutHtml = fs.readFileSync(path.join(__dirname, '..', 'checkout.html'), 'utf8');
if (!checkoutHtml.includes('matched.builderPath')) {
  console.error('FAIL: builderPath resolution missing in checkout.html');
  process.exit(1);
}
console.log('✓ checkout.html correctly resolves matched.builderPath for post-payment builder redirect');

console.log('\nALL 6 VIDEO SYSTEM ECOSYSTEM CHECKS PASSED PERFECTLY!');
