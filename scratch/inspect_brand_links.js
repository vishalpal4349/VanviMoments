const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const htmlFiles = fs.readdirSync(ROOT).filter(f => f.endsWith('.html') && f !== 'index.html');

console.log('--- INSPECTING BRAND LINK CONTENTS ---');

htmlFiles.forEach(f => {
  const c = fs.readFileSync(path.join(ROOT, f), 'utf8');
  
  // Find brand link in header
  const m = c.match(/<a[^>]+(?:class=["'][^"']*(?:brand|logo|nav-brand|header-brand)[^"']*["'])[^>]*>([\s\S]*?)<\/a>/i);
  if (m) {
    const inner = m[1].replace(/\s+/g, ' ').trim();
    console.log(`\n📄 ${f}:`);
    console.log(`   Full: ${m[0].replace(/\s+/g, ' ').substring(0, 220)}`);
    console.log(`   Inner: ${inner.substring(0, 160)}`);
  }
});
