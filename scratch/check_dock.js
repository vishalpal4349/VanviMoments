const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');
lines.forEach((l, i) => {
  if (l.includes('bottom-dock') || l.includes('dock-bar') || l.includes('dock-item') || l.includes('nav-bottom')) {
    console.log('Line ' + (i+1) + ': ' + l.trim());
  }
});

