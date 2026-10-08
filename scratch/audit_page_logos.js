const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

console.log('Total HTML files:', files.length);

files.forEach(f => {
  if (f === 'index.html' || f === 'vanvi-assistant.html') {
    return; // explicitly skipped
  }
  const content = fs.readFileSync(f, 'utf8');
  const hasLogoImg = content.includes('assets/vanvi-moments-logo-header.png');
  const brandMatch = content.match(/<(?:a|div|span)[^>]+(?:brand|logo)[^>]*>[\s\S]*?<\/(?:a|div|span)>/i);
  
  if (!hasLogoImg) {
    console.log(`❌ MISSING LOGO IMAGE: ${f}`);
    if (brandMatch) {
      console.log('   Brand element snippet:', brandMatch[0].replace(/\s+/g, ' ').slice(0, 140));
    } else {
      console.log('   No brand class element found');
    }
  } else {
    // Check height style on the logo img
    const imgMatches = content.match(/<img[^>]+assets\/vanvi-moments-logo-header\.png[^>]*>/gi) || [];
    console.log(`✅ HAS LOGO (${imgMatches.length}): ${f}`);
    imgMatches.forEach(img => {
      console.log('   ' + img);
    });
  }
});
