const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const htmlFiles = fs.readdirSync(ROOT).filter(f => f.endsWith('.html') && f !== 'index.html');

console.log('--- FINDING DUPLICATE TEXT OR DUPLICATE LOGO IMAGES ---');

htmlFiles.forEach(f => {
  const c = fs.readFileSync(path.join(ROOT, f), 'utf8');

  // Check if logo link has both img and text "Vanvi"
  const brandMatches = c.match(/<a[^>]+(?:brand|logo|nav-brand)[^>]*>[\s\S]*?<\/a>/gi) || [];
  brandMatches.forEach(bm => {
    const hasImg = /<img[^>]+(?:vanvi-moments|header-brand|brand-logo|official-logo)/i.test(bm);
    // check if there is also text mentioning Vanvi
    const hasVanviText = /<span[^>]*>[^<]*Vanvi[^<]*<\/span>|<div[^>]*>[^<]*Vanvi[^<]*<\/div>|Vanvi\s*Moments/i.test(bm.replace(/<img[^>]*>/gi, ''));
    if (hasImg && hasVanviText) {
      console.log(`\n❌ DUPLICATE LOGO + TEXT in ${f}:`);
      console.log('  ', bm.replace(/\s+/g, ' '));
    }
  });

  // Check if multiple logo images exist anywhere on page
  const allLogoImgs = c.match(/<img[^>]+(?:assets\/vanvi-moments|header-brand-img|brand-logo-img|official-logo)[^>]*>/gi) || [];
  if (allLogoImgs.length > 1) {
    console.log(`\n🚨 MULTIPLE LOGO IMGS in ${f} (${allLogoImgs.length}):`);
    allLogoImgs.forEach(im => console.log('  ', im));
  }
});
