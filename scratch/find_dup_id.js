const fs = require('fs');
const html = fs.readFileSync('ai.html', 'utf8');
const idMatches = [...html.matchAll(/id=["']([^"']+)["']/g)].map(m => m[1]);
console.log('All IDs:', idMatches);
const counts = {};
idMatches.forEach(id => { counts[id] = (counts[id] || 0) + 1; });
console.log('Duplicates:', Object.entries(counts).filter(([k, v]) => v > 1));
