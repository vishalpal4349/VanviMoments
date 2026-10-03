const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');
lines.forEach((line, i) => {
  if (line.includes('class="template') || line.includes('class="cutie-card') || line.includes('class="vanvi-card')) {
    console.log((i+1) + ': ' + line.trim().slice(0, 100));
  }
});
