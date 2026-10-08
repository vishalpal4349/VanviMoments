const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const htmlFiles = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));

console.log('Checking all HTML files for double logos or mismatched logos...\n');

htmlFiles.forEach(f => {
  const c = fs.readFileSync(path.join(ROOT, f), 'utf8');
  
  // Look at header/nav
  const headerMatch = c.match(/<header[\s\S]*?<\/header>|<nav[\s\S]*?<\/nav>|<div class=["'](?:nav-wrapper|nav-pill-box|navbar|header)[\s\S]*?<\/div>/i);
  
  // Also check top 150 lines of body
  const bodyStart = c.indexOf('<body');
  const topBlock = bodyStart !== -1 ? c.substring(bodyStart, bodyStart + 4000) : c.substring(0, 4000);
  
  // Find all brand img occurrences
  const logoImgs = (topBlock.match(/<img[^>]+(?:assets\/vanvi-moments|header-brand|brand-logo|official-logo)[^>]*>/gi) || []);
  
  // Also check if text brand is duplicated alongside img brand
  const brandLinks = (topBlock.match(/<a[^>]+(?:brand-link|nav-brand|header-brand|brand\s)[^>]*>[\s\S]*?<\/a>/gi) || []);
  
  if (logoImgs.length > 1) {
    console.log(`⚠️  ${f} has ${logoImgs.length} logo images in top section:`);
    logoImgs.forEach(im => console.log('   ', im));
  }
  
  if (brandLinks.length > 1) {
    console.log(`⚠️  ${f} has ${brandLinks.length} brand links in top section:`);
    brandLinks.forEach(bl => console.log('   ', bl.replace(/\s+/g, ' ').substring(0, 100)));
  }
});
