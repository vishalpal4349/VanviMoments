const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const lines = html.split('\n');
lines.forEach((l, i) => {
  if (l.includes('top-info') || l.includes('infoBtn')) {
    console.log(`Line ${i+1}: ${l.trim()}`);
  }
});

