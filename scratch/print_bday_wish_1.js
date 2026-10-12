const fs = require('fs');
const content = fs.readFileSync('js/vanvi-templates-data.js', 'utf8');

const start = content.indexOf("id: 'birthday-wish-1'");
if (start !== -1) {
  console.log(content.slice(start - 20, start + 1200));
} else {
  console.log('Not found');
}
