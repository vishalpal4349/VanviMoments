const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const existingFiles = new Set(files);
existingFiles.add('index.html');
existingFiles.add('');

const brokenLinks = [];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const hrefMatches = content.matchAll(/href=["']([^"']+)["']/g);
  for (const match of hrefMatches) {
    let href = match[1].trim();
    if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#') || href.startsWith('javascript:')) {
      continue;
    }
    // Remove query string and hash
    const cleanHref = href.split('?')[0].split('#')[0];
    if (!cleanHref) continue;

    if (!existingFiles.has(cleanHref) && !fs.existsSync(cleanHref)) {
      brokenLinks.push({
        sourceFile: file,
        brokenHref: href
      });
    }
  }
});

console.log('Total broken links found:', brokenLinks.length);
brokenLinks.forEach(b => console.log(`  In ${b.sourceFile}: -> ${b.brokenHref}`));
