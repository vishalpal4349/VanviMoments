const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
let brokenCount = 0;

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');

  // Check CSS links
  const cssMatches = [...content.matchAll(/<link[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["']/gi)];
  cssMatches.forEach(m => {
    const href = m[1].split('?')[0].split('#')[0];
    if (!href.startsWith('http') && !href.startsWith('//') && !fs.existsSync(href)) {
      console.log(`[${f}] Broken CSS: "${href}"`);
      brokenCount++;
    }
  });

  // Check Script links
  const scriptMatches = [...content.matchAll(/<script[^>]*src=["']([^"']+)["']/gi)];
  scriptMatches.forEach(m => {
    const src = m[1].split('?')[0].split('#')[0];
    if (!src.startsWith('http') && !src.startsWith('//') && !fs.existsSync(src)) {
      console.log(`[${f}] Broken JS: "${src}"`);
      brokenCount++;
    }
  });

  // Check viewport meta tag
  if (!content.includes('name="viewport"') && !content.includes("name='viewport'")) {
    console.log(`[${f}] MISSING VIEWPORT META!`);
  }
});

console.log(`Done! Total broken assets found: ${brokenCount}`);
