const fs = require('fs');
const path = require('path');
const assert = require('assert');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
console.log('--- STARTING VERIFICATION FOR CUTE PASTEL BIRTHDAY BUILDER & 3D ASSETS ---');

// 1. Check builder.html
const builderPath = path.join(ROOT, 'templates', 'cute-pastel-birthday', 'builder.html');
assert.ok(fs.existsSync(builderPath), 'builder.html must exist');
const builderContent = fs.readFileSync(builderPath, 'utf8');

const requiredIds = [
  'inpRecipient',
  'inpSender',
  'inpDate',
  'inpHeroSubtitle',
  'themePicker',
  'photosDeck',
  'hiddenPhotoInput',
  'inpLetter',
  'inpSurpriseTitle',
  'inpSurpriseMessage',
  'inpFinal',
  'btnSaveDraft',
  'btnPublishTop',
  'btnPublishBottom',
  'btnTestExperienceTop',
  'celebrationModal',
  'shareUrlInput',
  'btnCopyShareUrl',
  'btnModalOpenExp',
  'btnModalWhatsApp',
  'btnModalCheckout',
  'btnCloseModal',
  'tabBtnForm',
  'tabBtnPreview',
  'btnMobileTogglePreview',
  'previewFrame'
];

requiredIds.forEach(id => {
  assert.ok(builderContent.includes(`id="${id}"`), `builder.html must contain id="${id}"`);
});

console.log('✔ builder.html contains all 26 required interactive elements & publish links');

// Check that script in builder.html is syntactically valid
const builderScriptMatch = builderContent.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(builderScriptMatch, 'builder.html must contain inline script');
new vm.Script(builderScriptMatch[1]);
console.log('✔ builder.html inline JavaScript parses with 0 errors');

// 2. Check index.html 3D elements
const indexPath = path.join(ROOT, 'templates', 'cute-pastel-birthday', 'index.html');
const indexContent = fs.readFileSync(indexPath, 'utf8');

const required3dIdsAndClasses = [
  'giftBoxWrap',
  'gift-box-3d-scene',
  'gift-light-burst',
  'gift-floating-sparks',
  'gift-surprise-token',
  'gift-lid-assembly',
  'gift-ribbon-bow',
  'giftTagRecipient',
  'btnOpenGift',
  'btnRewrapGift',
  'cakeStage',
  'cake-pedestal-glow',
  'cakeCandlesArray',
  'cake-candle',
  'candle-flame',
  'candle-glow-aura',
  'candle-smoke',
  'cakeWishBadge',
  'cake-3d-wrapper',
  'btnMakeWish',
  'btnRelightCake'
];

required3dIdsAndClasses.forEach(token => {
  assert.ok(indexContent.includes(token), `index.html must contain 3D token: "${token}"`);
});
console.log('✔ index.html contains all 3D Gift Box and 3D Cake elements');

// 3. Check style.css
const stylePath = path.join(ROOT, 'templates', 'cute-pastel-birthday', 'style.css');
const styleContent = fs.readFileSync(stylePath, 'utf8');

const styleTokens = [
  '.gift-box-3d-scene',
  '.gift-lid-assembly',
  '.gift-light-burst',
  '.gift-surprise-token',
  '.cake-3d-wrapper',
  '.cake-candles-array',
  '.candle-flame',
  '.candle-glow-aura',
  '.candle-smoke',
  '.cake-wish-badge',
  '@keyframes realisticFlameFlicker',
  '@keyframes smokePuff',
  '@keyframes cakeFloat3D',
  '@keyframes bowGlowPulse'
];

styleTokens.forEach(tok => {
  assert.ok(styleContent.includes(tok), `style.css must define "${tok}"`);
});
console.log('✔ style.css includes all 3D animations and keyframes');

// 4. Check script.js syntax
const scriptPath = path.join(ROOT, 'templates', 'cute-pastel-birthday', 'script.js');
const scriptContent = fs.readFileSync(scriptPath, 'utf8');
new vm.Script(scriptContent);
console.log('✔ script.js parses with 0 syntax errors');

assert.ok(scriptContent.includes('btnRewrapGift'), 'script.js must wire up btnRewrapGift');
assert.ok(scriptContent.includes('btnRelightCake'), 'script.js must wire up btnRelightCake');
assert.ok(scriptContent.includes('giftTagRecipient'), 'script.js must update giftTagRecipient');

// 5. Check preview.html route
const previewPath = path.join(ROOT, 'preview.html');
const previewContent = fs.readFileSync(previewPath, 'utf8');
assert.ok(previewContent.includes("'cute-pastel-birthday':"), 'preview.html must register cute-pastel-birthday');
assert.ok(previewContent.includes("builderPath: 'templates/cute-pastel-birthday/builder.html'"), 'preview.html must link to builder.html');

console.log('--- ALL VERIFICATION CHECKS PASSED PERFECTLY (100%) ---');
