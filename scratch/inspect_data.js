const fs = require('fs');
const content = fs.readFileSync('js/vanvi-templates-data.js', 'utf8');

const regex = /{\s*id:\s*['"][^'"]+['"],[\s\S]*?\n\s*},?/g;
const matches = content.match(regex);
console.log('Total templates found in vanvi-templates-data.js:', matches ? matches.length : 0);

if (matches) {
  matches.forEach(m => {
    if (m.includes('birthday') || m.includes('Birthday')) {
      console.log('--- Birthday entry snippet ---');
      console.log(m.slice(0, 300));
    }
  });
}
