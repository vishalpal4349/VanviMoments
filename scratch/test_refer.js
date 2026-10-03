const fs = require('fs');

console.log('=== TESTING REFER.HTML ===\n');

const html = fs.readFileSync('refer.html', 'utf8');

// 1. Script syntax
const scripts = html.match(/<script[\s\S]*?>([\s\S]*?)<\/script>/gi) || [];
console.log('Scripts found:', scripts.length);
scripts.forEach((s, i) => {
  const code = s.replace(/<script[\s\S]*?>/i, '').replace(/<\/script>/i, '');
  try {
    new Function(code);
    console.log(`✅ Script ${i+1}: Valid JS syntax`);
  } catch(e) {
    console.error(`❌ Script ${i+1} Syntax Error:`, e.message);
  }
});

// 2. Duplicate IDs
const idMatches = [...html.matchAll(/id=["']([^"']+)["']/g)].map(m => m[1]);
const counts = {};
idMatches.forEach(id => { counts[id] = (counts[id] || 0) + 1; });
const dupes = Object.entries(counts).filter(([k, v]) => v > 1);
console.log('Total IDs:', idMatches.length);
console.log('Duplicate IDs:', dupes.length ? dupes : 'None (All Unique) ✅');

// 3. Check appearance property
console.log('Standard appearance property present:', html.includes('appearance: none;') ? 'YES ✅' : 'NO ❌');

// 4. Check zero Ananya
console.log('Zero Ananya branding:', !html.toLowerCase().includes('ananya') ? 'YES ✅' : 'NO ❌');
