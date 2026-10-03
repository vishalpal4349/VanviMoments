const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const files = fs.readdirSync(root).filter(f => f.endsWith('.html')).sort();

console.log('=== HEADER & LOGO AUDIT FOR MOBILE SCREENS (320px - 414px) ===\n');

files.forEach(f => {
  const content = fs.readFileSync(path.join(root, f), 'utf8');
  const headerMatch = content.match(/<header\b[^>]*>([\s\S]*?)<\/header>/i);
  if (!headerMatch) return;

  const headerHtml = headerMatch[1];
  
  // Find logo/brand
  const brandTagMatch = headerHtml.match(/<([a-z0-9]+)[^>]*class=["'][^"']*(?:brand|logo)[^"']*["'][^>]*>/i);
  const brandTag = brandTagMatch ? brandTagMatch[1] : 'none';
  const isBrandAnchor = brandTag === 'a';
  
  // Find all buttons or links in header
  const btns = [...headerHtml.matchAll(/<(?:a|button)\b[^>]*>([\s\S]*?)<\/(?:a|button)>/gi)];
  const actionBtns = btns.filter(b => !b[0].includes('brand') && !b[0].includes('logo'));

  // Count buttons without mobile-hide
  const visibleOnMobile = actionBtns.filter(b => !b[0].includes('mobile-hide') && !b[0].includes('desktop-only'));

  if (visibleOnMobile.length > 2 || !isBrandAnchor) {
    console.log(`[${f}]:`);
    console.log(`   - Logo tag: <${brandTag}> (Clickable link: ${isBrandAnchor ? 'YES' : 'NO'})`);
    console.log(`   - Total header actions: ${actionBtns.length}`);
    console.log(`   - Actions visible on mobile: ${visibleOnMobile.length}`);
    visibleOnMobile.forEach(b => {
      const text = b[1].replace(/<[^>]+>/g, '').trim().slice(0, 25);
      console.log(`       * [${text}] ${b[0].slice(0, 50)}...`);
    });
  }
});
