const fs = require('fs');

console.log('=== 1. VERIFYING ASSETS IN templates/Hey Birthday/assets/ ===');
const assets = fs.readdirSync('templates/Hey Birthday/assets');
console.log('Asset files count:', assets.length);
assets.forEach(a => {
  const stat = fs.statSync('templates/Hey Birthday/assets/' + a);
  console.log(' -', a, ':', (stat.size / 1024).toFixed(1), 'KB');
});

console.log('\n=== 2. VERIFYING FILES IN templates/Hey Birthday/ ===');
const tplFiles = fs.readdirSync('templates/Hey Birthday');
console.log('Template root files:', tplFiles);

console.log('\n=== 3. VERIFYING HTML SCREENS IN index.html ===');
const indexHtml = fs.readFileSync('templates/Hey Birthday/index.html', 'utf8');
const screens = ['verification', 'no', 'intro', 'birthday', 'notes', 'balloons', 'laugh', 'album', 'cake', 'message'];
screens.forEach(s => {
  const marker = 'data-screen="' + s + '"';
  const has = indexHtml.includes(marker);
  console.log(' - Screen [' + s + ']:', has ? 'OK' : 'MISSING');
});

console.log('\n=== 4. VERIFYING BUILDER IN builder.html ===');
const builderHtml = fs.readFileSync('templates/Hey Birthday/builder.html', 'utf8');
const builderInputs = ['inputRecipient', 'inputSender', 'inputNote1', 'inputNote2', 'inputNote3', 'inputNote4', 'inputLetter', 'livePreviewIframe', 'shareModal'];
builderInputs.forEach(inp => {
  const has = builderHtml.includes(inp);
  console.log(' - Element [' + inp + ']:', has ? 'OK' : 'MISSING');
});

console.log('\n=== 5. VERIFYING vanvi-templates-data.js ===');
const catalog = fs.readFileSync('js/vanvi-templates-data.js', 'utf8');
console.log(' - Contains hey-birthday:', catalog.includes('"id": "hey-birthday"'));
console.log(' - Contains Hey Birthday in templates.html:', fs.readFileSync('templates.html', 'utf8').includes('hey-birthday'));
