const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Check script tags
const scripts = html.match(/<script[\s\S]*?>([\s\S]*?)<\/script>/gi) || [];
console.log('Total scripts:', scripts.length);
scripts.forEach((s, i) => {
  const code = s.replace(/<script[\s\S]*?>/i, '').replace(/<\/script>/i, '');
  try {
    new Function(code);
    console.log(`Script ${i+1}: Valid JS syntax`);
  } catch (err) {
    console.error(`Script ${i+1} Syntax Error:`, err.message);
  }
});

// Check duplicate IDs
const idMatches = [...html.matchAll(/id=["']([^"']+)["']/g)].map(m => m[1]);
const dupes = idMatches.filter((item, index) => idMatches.indexOf(item) !== index);
console.log('Total IDs found:', idMatches.length);
console.log('Duplicate IDs:', dupes.length ? dupes : 'None (All Unique)');
