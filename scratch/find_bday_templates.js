const fs = require('fs');
const content = fs.readFileSync('js/vanvi-templates-data.js', 'utf8');

const regex = /id:\s*['"]([^'"]+)['"]/g;
let m;
const ids = [];
while ((m = regex.exec(content)) !== null) {
  ids.push(m[1]);
}
console.log('Total templates in vanvi-templates-data.js:', ids.length);
console.log('Birthday ids:', ids.filter(id => id.includes('birth')));
