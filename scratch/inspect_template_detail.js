const fs = require('fs');
const path = require('path');
const content = fs.readFileSync(path.join(__dirname, '..', 'template-detail.html'), 'utf8');

const lines = content.split('\n');
console.log('=== TEMPLATE-DETAIL.HTML INSPECTION ===');
lines.forEach((l, i) => {
  if (l.includes('class="hero') || l.includes('class="preview') || l.includes('btn-customize') || l.includes('btn-preview') || l.includes('id="btnCustomize') || l.includes('price')) {
    if (l.trim().startsWith('<') || l.includes('id=')) {
      console.log(`${i+1}: ${l.trim().slice(0, 90)}`);
    }
  }
});
