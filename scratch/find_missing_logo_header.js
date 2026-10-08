const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const htmlFiles = fs.readdirSync(ROOT).filter(f => f.endsWith('.html') && f !== 'index.html' && f !== 'vanvi-assistant.html');

console.log('Pages without assets/vanvi-moments-logo-header.png in header:\n');

const missingLogoPages = [];

htmlFiles.forEach(f => {
  const c = fs.readFileSync(path.join(ROOT, f), 'utf8');
  
  // check if assets/vanvi-moments-logo-header.png exists in file
  if (!c.includes('assets/vanvi-moments-logo-header.png')) {
    missingLogoPages.push(f);
    // Find what brand link or header exists
    const m = c.match(/<a[^>]+(?:brand|logo|nav-brand)[^>]*>[\s\S]*?<\/a>/i);
    console.log(`❌ ${f}:`);
    if (m) console.log('   Current:', m[0].replace(/\s+/g, ' ').substring(0, 160));
    else console.log('   (No brand link match)');
  }
});

console.log(`\nTotal pages missing logo-header: ${missingLogoPages.length}`);
