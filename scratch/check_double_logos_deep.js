const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const htmlFiles = fs.readdirSync(ROOT).filter(f => f.endsWith('.html') && f !== 'index.html');

console.log('--- CHECKING LOGO COMBINATIONS & DUPLICATES ---');

htmlFiles.forEach(f => {
  const c = fs.readFileSync(path.join(ROOT, f), 'utf8');

  // Check 1: multiple logo imgs
  const logoImgs = c.match(/<img[^>]+(?:vanvi-moments-logo|official-logo|card-logo|brand-logo|header-brand)[^>]*>/gi) || [];
  if (logoImgs.length > 1) {
    console.log(`\n🚨 MULTIPLE LOGO IMAGES in ${f} (${logoImgs.length} images):`);
    logoImgs.forEach(img => console.log('   ', img));
  }

  // Check 2: brand link contains BOTH an <img> AND text "Vanvi Moments"
  const brandLinks = c.match(/<a[^>]+(?:brand|logo)[^>]*>[\s\S]*?<\/a>/gi) || [];
  brandLinks.forEach(bl => {
    const hasImg = /<img/i.test(bl);
    const hasText = /Vanvi\s*(?:Moments|♡)/i.test(bl);
    if (hasImg && hasText) {
      console.log(`\n⚠️  DOUBLE LOGO (Image + Text together) in ${f}:`);
      console.log('   ', bl.replace(/\s+/g, ' ').substring(0, 200));
    }
  });
});
