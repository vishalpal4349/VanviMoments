const fs = require('fs');

const content = fs.readFileSync('templates/temple-royal-wedding/index.html', 'utf8');
const lines = content.split('\n');

console.log('Total lines in temple index.html:', lines.length);
lines.forEach((l, idx) => {
  if (/<section|<header|<footer|class="scene|id="sec|id="act/i.test(l)) {
    console.log((idx + 1) + ': ' + l.trim());
  }
});
