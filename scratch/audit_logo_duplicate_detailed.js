const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

const duplicates = [];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');

  // Find all anchors with images
  const anchorImgs = [...content.matchAll(/<a[^>]*>([\s\S]*?)<\/a>/gi)];
  anchorImgs.forEach(match => {
    const inner = match[1];
    if (inner.includes('vanvi-moments-logo') || inner.includes('logo-header') || inner.includes('official-logo') || inner.includes('favicon.svg')) {
      // Check if inner also contains literal "Vanvi Moments" text outside the alt attribute
      const withoutAlts = inner.replace(/alt=["'][^"']*["']/gi, '');
      if (/Vanvi\s*Moments/i.test(withoutAlts)) {
        duplicates.push({ file: f, snippet: match[0].replace(/\s+/g, ' ').slice(0, 200) });
      }
    }
  });

  // Also check divs with class brand, logo, header-brand
  const divBrands = [...content.matchAll(/<(?:div|header|nav)[^>]*class=["'][^"']*(?:brand|logo|header)[^"']*["'][^>]*>([\s\S]*?)<\/(?:div|header|nav)>/gi)];
  divBrands.forEach(match => {
    const inner = match[1];
    if (inner.includes('vanvi-moments-logo') || inner.includes('logo-header') || inner.includes('official-logo')) {
      const withoutAlts = inner.replace(/alt=["'][^"']*["']/gi, '');
      // Look for duplicate Vanvi Moments text
      const matches = withoutAlts.match(/Vanvi\s*Moments/gi) || [];
      if (matches.length > 0) {
        duplicates.push({ file: f, snippet: match[0].replace(/\s+/g, ' ').slice(0, 200) });
      }
    }
  });
});

console.log(`Found ${duplicates.length} instances:`);
duplicates.forEach((d, i) => {
  console.log(`\n[${i+1}] File: ${d.file}`);
  console.log(`Snippet: ${d.snippet}`);
});
