const fs = require('fs');
const path = require('path');
const content = fs.readFileSync(path.join(__dirname, '..', 'dashboard.html'), 'utf8');

const lines = content.split('\n');
console.log('=== DASHBOARD.HTML SECTIONS ===');
lines.forEach((l, i) => {
  if (l.includes('class="tab') || l.includes('class="section') || l.includes('nav-tab') || l.includes('id="tab') || l.includes('id="sec') || l.includes('data-tab')) {
    if (l.trim().startsWith('<button') || l.trim().startsWith('<section') || l.trim().startsWith('<div class="tab') || l.trim().startsWith('<a')) {
      console.log(`${i+1}: ${l.trim().slice(0, 90)}`);
    }
  }
});
