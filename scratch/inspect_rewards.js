const fs = require('fs');
const content = fs.readFileSync('rewards.html', 'utf8');
const lines = content.split('\n');

lines.forEach((l, i) => {
  if (l.includes('<!--') && (l.includes('1.') || l.includes('2.') || l.includes('3.') || l.includes('4.') || l.includes('5.') || l.includes('6.') || l.includes('Section') || l.includes('Card'))) {
    console.log(i + 1, l.trim());
  }
});
