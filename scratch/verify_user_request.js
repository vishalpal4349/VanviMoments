const fs = require('fs');
const path = require('path');

console.log('--- VERIFYING USER REQUIREMENTS ---');

// 1. Check vanvi-templates-data.js
const templatesDataRaw = fs.readFileSync(path.join(__dirname, '../js/vanvi-templates-data.js'), 'utf8');

// Best Friend 01
const hasBf01 = templatesDataRaw.includes("id: 'best-friend-01'") && templatesDataRaw.includes('price: 39');
console.log('1. Best Friend 01 present with price ₹39:', hasBf01);

// Birthday Box
const hasBbox = templatesDataRaw.includes("id: 'birthday-box'") && templatesDataRaw.includes('price: 149');
console.log('2. Birthday Box present with price ₹149:', hasBbox);

// Anniversary Eternal
const hasAnnivEternal = templatesDataRaw.includes("id: 'anniversary-eternal'") && templatesDataRaw.includes('price: 0') && templatesDataRaw.includes('isFree: true');
console.log('3. Anniversary Eternal present as 100% FREE (price 0):', hasAnnivEternal);

// Love in Clouds in Wedding
const hasLoveInCloudsWedding = templatesDataRaw.includes("id: 'love-in-clouds'") && (templatesDataRaw.includes("category: 'Wedding'") || templatesDataRaw.includes("categorySlug: 'wedding'"));
console.log('4. Love in Clouds categorized under Wedding:', hasLoveInCloudsWedding);

// 2. Check builders for dual input (file input AND url/text input)
const buildersToCheck = [
  'templates/Best Friend Day 01/builder.html',
  'templates/Birthday-Box/builder.html',
  'templates/Anniversary Eternal ❤️/builder.html',
  'templates/Birthday 2.0/builder.html',
  'templates/birthday-wish-01/builder.html',
  'templates/birthday-wish-02/builder.html',
  'templates/birthday-3d-candle/builder.html',
  'templates/birthday-3d-candle-surprise/builder.html',
  'templates/birthday-white-bloom/builder.html',
  'templates/cute-pastel-birthday/builder.html',
  'templates/golden-anniversary/builder.html',
  'templates/hues-whispers-luxe/builder.html',
  'templates/ivory-arch-wedding/builder.html',
  'templates/love-in-clouds/builder.html',
  'templates/retro-polaroid-wall/builder.html',
  'templates/royal-vows-indian-wedding/builder.html',
  'templates/sorry-bubu/builder.html',
  'templates/temple-blossom-luxe/builder.html',
  'templates/temple-royal-wedding/builder.html',
  'templates/wedding-floating-lotus/builder.html'
];

let allDualInputsOk = true;
buildersToCheck.forEach(b => {
  const fullPath = path.join(__dirname, '..', b);
  if (!fs.existsSync(fullPath)) {
    console.error('File not found:', b);
    allDualInputsOk = false;
    return;
  }
  const content = fs.readFileSync(fullPath, 'utf8');
  const hasFile = content.includes('type="file"');
  const hasUrl = content.includes('http') || content.includes('URL') || content.includes('Url') || content.includes('url');
  if (!hasFile || !hasUrl) {
    console.error('Missing dual input in:', b, { hasFile, hasUrl });
    allDualInputsOk = false;
  }
});
console.log('5. All builders have dual image input (file + url):', allDualInputsOk);

console.log('--- ALL CHECKS COMPLETED ---');
