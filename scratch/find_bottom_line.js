const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('.bottom{display:none}') || (l.includes('.bottom') && l.includes('display:none'))) {
    console.log(`Line ${idx+1}: ${l}`);
  }
  if (l.includes('.bottom{') || l.includes('.bottom {')) {
    console.log(`Line ${idx+1}: ${l}`);
  }
});
