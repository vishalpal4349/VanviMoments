const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const htmlFiles = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));

console.log(`Found ${htmlFiles.length} HTML files in root.`);

const results = [];

htmlFiles.forEach(file => {
  const content = fs.readFileSync(path.join(ROOT, file), 'utf8');
  
  // Find navbar / header logo blocks
  const imgMatches = content.match(/<img[^>]+(?:logo|vanvi)[^>]*>/gi) || [];
  const brandMatches = content.match(/<a[^>]+(?:brand|logo)[^>]*>[\s\S]*?<\/a>/gi) || [];
  
  // Check for duplicate images inside brand link or navbar
  let hasDoubleLogo = false;
  let doubleDetails = [];
  
  brandMatches.forEach(bm => {
    const imgsInBrand = bm.match(/<img[^>]*>/gi) || [];
    if (imgsInBrand.length > 1) {
      hasDoubleLogo = true;
      doubleDetails.push(`Brand anchor has ${imgsInBrand.length} <img> tags`);
    }
  });

  // Check if multiple brand anchors exist in navbar
  const navBrandMatches = content.match(/class=["'][^"']*(?:nav-brand|brand-link|navbar-brand)[^"']*["']/gi) || [];
  if (navBrandMatches.length > 1) {
    // Only flag if in header/nav, not footer
    const headerBlock = content.match(/<header[\s\S]*?<\/header>|<nav[\s\S]*?<\/nav>/gi) || [];
    let countInNav = 0;
    headerBlock.forEach(h => {
      const b = h.match(/class=["'][^"']*(?:nav-brand|brand-link|navbar-brand)[^"']*["']/gi) || [];
      countInNav += b.length;
    });
    if (countInNav > 1) {
      hasDoubleLogo = true;
      doubleDetails.push(`Multiple brand anchors in header/nav: ${countInNav}`);
    }
  }

  results.push({
    file,
    imgCount: imgMatches.length,
    imgMatches: imgMatches.slice(0, 3),
    brandMatches: brandMatches.slice(0, 2),
    hasDoubleLogo,
    doubleDetails
  });
});

console.log('\n--- PAGES WITH POTENTIAL DOUBLE LOGO ---');
results.filter(r => r.hasDoubleLogo).forEach(r => {
  console.log(`❌ ${r.file}: ${r.doubleDetails.join(', ')}`);
  r.brandMatches.forEach(bm => console.log('   Snippet:', bm.replace(/\n\s*/g, ' ')));
});

console.log('\n--- LOGO DETAILS FOR EACH PAGE ---');
results.forEach(r => {
  console.log(`\n📄 ${r.file}:`);
  if (r.brandMatches.length > 0) {
    r.brandMatches.forEach(b => console.log('  Brand link:', b.replace(/\n\s*/g, ' ').substring(0, 160)));
  } else if (r.imgMatches.length > 0) {
    r.imgMatches.forEach(im => console.log('  Img:', im.substring(0, 120)));
  } else {
    console.log('  (No brand/logo img found)');
  }
});
