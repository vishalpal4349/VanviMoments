const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const htmlFiles = fs.readdirSync(ROOT).filter(f => f.endsWith('.html') && f !== 'index.html' && f !== 'vanvi-assistant.html');

console.log('=== EXACT HEADER BRAND ELEMENT ON EVERY PAGE ===\n');

htmlFiles.forEach(f => {
  const c = fs.readFileSync(path.join(ROOT, f), 'utf8');
  
  // Find brand link or logo inside header/nav
  const m = c.match(/<a[^>]+(?:class=["'][^"']*(?:brand|logo|nav-brand|header-brand)[^"']*["'])[^>]*>[\s\S]*?<\/a>/i);
  if (m) {
    console.log(`📄 ${f}:`);
    console.log('   ' + m[0].replace(/\s+/g, ' ').substring(0, 160));
  } else {
    // Check if there is an img logo
    const imgM = c.match(/<img[^>]+(?:vanvi-moments-logo|official-logo)[^>]*>/i);
    if (imgM) {
      console.log(`📄 ${f} (Image only):`);
      console.log('   ' + imgM[0]);
    } else {
      console.log(`📄 ${f}: (NO HEADER BRAND FOUND)`);
    }
  }
});
