const fs = require('fs');
const content = fs.readFileSync('dashboard.html', 'utf8');
const lines = content.split('\n');

console.log('Total lines:', lines.length);
lines.forEach((l, i) => {
  if (l.includes('<section') || l.includes('<header') || l.includes('class="dashboard') || l.includes('tab-btn') || l.includes('grid') || l.includes('stat-card')) {
    console.log(i + 1, l.trim().substring(0, 120));
  }
});
