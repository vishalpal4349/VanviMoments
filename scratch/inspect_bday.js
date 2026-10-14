const fs = require('fs');

const bdayCode = fs.readFileSync('scratch/amadowish/BirthdayReceiver.js', 'utf8');
const mainCode = fs.readFileSync('scratch/amadowish/main-C5u69XSz.js', 'utf8');
const schemaCode = fs.readFileSync('scratch/amadowish/schema-05PXoB4p.js', 'utf8');

console.log('--- Birthday Receiver code (first 1000 chars) ---');
console.log(bdayCode.slice(0, 1000));

// Find imports
const importMatches = bdayCode.match(/import[\s\S]*?from\s*['"][^'"]+['"]/g) || [];
console.log('--- Imports in BirthdayReceiver ---');
importMatches.forEach(m => console.log(m));

// Find string literals matching media
const strMatches = bdayCode.match(/['"][^'"]*?\.(mp3|webp|jpg|png|svg)['"]/gi) || [];
console.log('--- Media in BirthdayReceiver ---');
console.log(Array.from(new Set(strMatches)));

// Find default birthday fields in schema or main
const pMatch = mainCode.match(/demoFields:\s*\{[\s\S]*?\}\s*,\s*demoPhotos/);
console.log('--- Demo fields in main ---');
if (pMatch) console.log(pMatch[0]);

// Find what 'p' is
const pDef = mainCode.indexOf('p={');
if (pDef !== -1) {
  console.log('p def:', mainCode.slice(pDef, pDef + 500));
}
