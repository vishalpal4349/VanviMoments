const fs = require('fs');
const html = fs.readFileSync('ai-matcher.html', 'utf8');

const scripts = html.match(/<script[\s\S]*?>([\s\S]*?)<\/script>/gi) || [];
console.log('ai-matcher.html scripts count:', scripts.length);
scripts.forEach((s, i) => {
  const code = s.replace(/<script[\s\S]*?>/i, '').replace(/<\/script>/i, '');
  try {
    new Function(code);
    console.log(`Script ${i+1}: Valid JS syntax`);
  } catch (err) {
    console.error(`Script ${i+1} Syntax Error:`, err.message);
  }
});

const idMatches = [...html.matchAll(/id=["']([^"']+)["']/g)].map(m => m[1]);
const dupes = idMatches.filter((item, index) => idMatches.indexOf(item) !== index);
console.log('Total IDs found in ai-matcher.html:', idMatches.length);
console.log('Duplicate IDs in ai-matcher.html:', dupes.length ? dupes : 'None (All Unique)');
