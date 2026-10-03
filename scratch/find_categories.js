const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');

console.log('Total lines:', lines.length);

lines.forEach((line, i) => {
  const lower = line.toLowerCase();
  if (lower.includes('explore') || lower.includes('categor') || lower.includes('occasion') || lower.includes('templatediscovery')) {
    console.log(`Line ${i + 1}: ${line.trim().slice(0, 120)}`);
  }
});

