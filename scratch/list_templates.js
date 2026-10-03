const fs = require('fs');
const content = fs.readFileSync('js/vanvi-templates-data.js', 'utf8');
const idMatches = [...content.matchAll(/id:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
console.log('Total template IDs found:', idMatches.length);
idMatches.forEach((id, idx) => console.log(`${idx + 1}. ${id}`));
