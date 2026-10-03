const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');
console.log('Searching for buttons...');
lines.forEach((line, i) => {
  if (line.includes('<button') || line.includes('class="btn') || line.includes('class="primary') || line.includes('class="flow-btn') || line.includes('id="btn') || line.includes('class="cta')) {
    console.log((i+1) + ': ' + line.trim().slice(0, 110));
  }
});
