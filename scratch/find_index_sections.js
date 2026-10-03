const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');

lines.forEach((l, idx) => {
  const lineNum = idx + 1;
  if (l.includes('<body') || l.includes('header') || l.includes('brand') || l.includes('ultraSection') || l.includes('aiFloatBtn') || l.includes('Ask Baby Panda') || l.includes('Vanvi AI') || l.includes('Atelier')) {
    if (l.length < 200) {
      console.log(lineNum, l.trim());
    } else {
      console.log(lineNum, l.trim().slice(0, 160) + '...');
    }
  }
});
