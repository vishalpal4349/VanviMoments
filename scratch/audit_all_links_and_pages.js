const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const brokenHrefs = [];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const matches = [...content.matchAll(/href=["']([^"'#?]+)["']/gi)];
  matches.forEach(m => {
    let target = m[1].trim();
    if (!target || target.startsWith('http:') || target.startsWith('https:') || target.startsWith('//') ||
        target.startsWith('javascript:') || target.startsWith('mailto:') || target.startsWith('tel:') || target.startsWith('data:')) {
      return;
    }
    target = target.replace(/^\.\//, '');
    if (!fs.existsSync(target)) {
      brokenHrefs.push({ source: f, target });
    }
  });
});

console.log('Total broken hrefs found: ' + brokenHrefs.length);
brokenHrefs.forEach(b => {
  console.log(`[${b.source}] -> ${b.target}`);
});
