const fs = require('fs');
const lines = fs.readFileSync('js/vanvi-templates-data.js', 'utf8').split('\n');
lines.forEach((l, i) => {
  if (l.includes("id: 'birthday-wish-1'")) {
    console.log('Line:', i + 1);
  }
});
