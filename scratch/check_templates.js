const fs = require('fs');
const indexHtml = fs.readFileSync('index.html', 'utf8');
const lines = indexHtml.split('\n');

console.log('--- Apology in index.html ---');
lines.forEach((l, i) => {
  if (l.toLowerCase().includes('apology') && (l.includes('<section') || l.includes('<h3>') || l.includes('template-slider') || l.includes('class="template"'))) {
    console.log(`Line ${i+1}: ${l.trim().slice(0, 120)}`);
  }
});

console.log('\n--- Sliders / Grids in index.html ---');
lines.forEach((l, i) => {
  if (l.includes('template-slider') || l.includes('id="apology') || l.includes('id="trending')) {
    console.log(`Line ${i+1}: ${l.trim().slice(0, 120)}`);
  }
});
