const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('Testing Birthday Wish 01 (100% Free Gift) & Mobile Builder Integration...');

// 1. Check template.json
const tplJsonPath = path.join(__dirname, '..', 'templates', 'birthday-wish-01', 'template.json');
const tplJson = JSON.parse(fs.readFileSync(tplJsonPath, 'utf8'));
assert.strictEqual(tplJson.price, 0, 'Price must be 0');
assert.strictEqual(tplJson.isFree, true, 'isFree must be true');
assert(tplJson.badge.includes('Free'), 'Badge must mention Free');
console.log('✔ templates/birthday-wish-01/template.json verified');

// 2. Check vanvi-templates-data.js
const dataJsPath = path.join(__dirname, '..', 'js', 'vanvi-templates-data.js');
const dataJs = fs.readFileSync(dataJsPath, 'utf8');
assert(dataJs.includes("'birthday-wish-1'"), 'birthday-wish-1 must exist in data');
assert(dataJs.includes("aliases: ['bday-wish-1', 'birthday-wish-01']"), 'aliases must include birthday-wish-01');
assert(dataJs.includes('3 Secret Celestial Birthday Wishes'), 'New features must be registered');
console.log('✔ js/vanvi-templates-data.js verified');

// 3. Check templates/birthday-wish-01/index.html
const indexPath = path.join(__dirname, '..', 'templates', 'birthday-wish-01', 'index.html');
const indexHtml = fs.readFileSync(indexPath, 'utf8');
assert(indexHtml.includes('id="scene1"'), 'Scene 1 missing');
assert(indexHtml.includes('id="scene2"'), 'Scene 2 missing');
assert(indexHtml.includes('id="scene3"'), 'Scene 3 missing');
assert(indexHtml.includes('id="scene4"'), 'Scene 4 (Secret Wishes) missing');
assert(indexHtml.includes('id="scene5"'), 'Scene 5 (Timeline) missing');
assert(indexHtml.includes('id="scene6"'), 'Scene 6 (VIP Award) missing');
assert(indexHtml.includes('id="scene7"'), 'Scene 7 (Letter) missing');
assert(indexHtml.includes('revealWishStar'), 'revealWishStar missing');
assert(indexHtml.includes('stampWaxSeal'), 'stampWaxSeal missing');
assert(indexHtml.includes('updateStepDots'), 'updateStepDots missing');
assert(indexHtml.includes('playSynthBirthdayChime'), 'Web Audio synth fallback missing');
assert(indexHtml.includes('shareOnWhatsApp'), 'shareOnWhatsApp missing');
assert(indexHtml.includes('updatePolaroidPhotos'), 'updatePolaroidPhotos missing');
assert(indexHtml.includes('VANVI_LIVE_PREVIEW_SYNC'), 'VANVI_LIVE_PREVIEW_SYNC listener missing');
assert(indexHtml.includes('blowSingleCandle'), 'blowSingleCandle missing');
console.log('✔ templates/birthday-wish-01/index.html (7 Scenes) verified');

// 4. Check templates/birthday-wish-01/builder.html
const builderPath = path.join(__dirname, '..', 'templates', 'birthday-wish-01', 'builder.html');
const builderHtml = fs.readFileSync(builderPath, 'utf8');
assert(!builderHtml.includes('← Template World'), 'Old bulky Template World button must be removed');
assert(builderHtml.includes('btn-builder-compact-back'), 'Compact back button missing');
assert(builderHtml.includes('builder-mobile-tabs'), 'Mobile view tabs missing');
assert(builderHtml.includes('floating-preview-fab'), 'Floating preview fab missing');
assert(builderHtml.includes('switchMobileView'), 'switchMobileView missing');
assert(builderHtml.includes('inpWish1'), 'inpWish1 missing');
assert(builderHtml.includes('inpTimelineTitle1'), 'inpTimelineTitle1 missing');
assert(builderHtml.includes('inpCertHeadline'), 'inpCertHeadline missing');
assert(builderHtml.includes('btnSaveMomentTop'), 'btnSaveMomentTop missing');
assert(builderHtml.includes('btnSaveMomentBottom'), 'btnSaveMomentBottom missing');
assert(builderHtml.includes('Publish Free Gift (₹0)'), 'Publish Free Gift (₹0) button missing');
console.log('✔ templates/birthday-wish-01/builder.html mobile & customizer verified');

// 5. Check custom builder CSS
const cssPath = path.join(__dirname, '..', 'css', 'vanvi-custom-builder.css');
const cssContent = fs.readFileSync(cssPath, 'utf8');
assert(cssContent.includes('.builder-mobile-tabs'), '.builder-mobile-tabs CSS missing');
assert(cssContent.includes('.btn-builder-compact-back'), '.btn-builder-compact-back CSS missing');
assert(cssContent.includes('.floating-preview-fab'), '.floating-preview-fab CSS missing');
console.log('✔ css/vanvi-custom-builder.css mobile phone preview styles verified');

console.log('\n🎉 ALL BIRTHDAY WISH 01 & BUILDER VERIFICATIONS PASSED 100%!');
