const fs = require('fs');
const content = fs.readFileSync('js/vanvi-templates-data.js', 'utf8');
const idMatches = [];
const regex = /id:\s*['"]([^'"]+)['"]/g;
let match;
while ((match = regex.exec(content)) !== null) {
  idMatches.push(match[1]);
}
console.log('Template count:', idMatches.length);
idMatches.forEach((id, idx) => console.log(`${idx + 1}: ${id}`));
