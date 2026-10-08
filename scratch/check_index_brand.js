const fs = require('fs');
const c = fs.readFileSync('index.html', 'utf8');
const lines = c.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('class="brand') || l.includes('class="nav-brand') || l.includes('class="header-brand')) {
    console.log(`Line ${idx + 1}: ${l}`);
    for (let j = idx; j < Math.min(idx + 15, lines.length); j++) {
      console.log(`  ${j + 1}: ${lines[j]}`);
    }
  }
});
