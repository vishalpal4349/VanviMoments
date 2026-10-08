const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const htmlFiles = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));

console.log('--- DETAILED LOGO AUDIT ACROSS ALL HTML PAGES ---\n');

htmlFiles.forEach(f => {
  if (f === 'index.html') return; // User said: "home page ko chhod k"
  const c = fs.readFileSync(path.join(ROOT, f), 'utf8');

  // Match brand links or header logos
  const brandLinks = c.match(/<a[^>]+(?:class=["'][^"']*(?:brand|logo|nav-brand)[^"']*["'])[^>]*>[\s\S]*?<\/a>/gi) || [];
  const headerImgs = c.match(/<header[\s\S]*?<\/header>|<nav[\s\S]*?<\/nav>/gi) || [];
  
  let headerImgsList = [];
  headerImgs.forEach(h => {
    const imgs = h.match(/<img[^>]*>/gi) || [];
    headerImgsList.push(...imgs);
  });

  console.log(`📄 ${f}:`);
  if (brandLinks.length > 0) {
    brandLinks.forEach((bl, idx) => {
      console.log(`   Brand Link #${idx + 1}: ${bl.replace(/\s+/g, ' ').substring(0, 180)}`);
    });
  } else if (headerImgsList.length > 0) {
    headerImgsList.forEach((img, idx) => {
      console.log(`   Header Img #${idx + 1}: ${img.replace(/\s+/g, ' ')}`);
    });
  } else {
    // Check if there is an a tag around index.html
    const homeLinks = c.match(/<a[^>]+href=["']index\.html["'][^>]*>[\s\S]*?<\/a>/gi) || [];
    if (homeLinks.length > 0) {
      console.log(`   Home Link (no brand class): ${homeLinks[0].replace(/\s+/g, ' ').substring(0, 180)}`);
    } else {
      console.log(`   ⚠️ NO LOGO / BRAND FOUND`);
    }
  }
});
