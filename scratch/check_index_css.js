const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const regex = /<link[^>]+href=["']([^"']+)["'][^>]*rel=["']stylesheet["']/gi;
let match;
const cssHrefs = [];
while ((match = regex.exec(html)) !== null) {
  cssHrefs.push(match[1]);
}
console.log('CSS hrefs count:', cssHrefs.length);
const missing = [];
for (const href of cssHrefs) {
  if (href.startsWith('http://') || href.startsWith('https://')) continue;
  const clean = href.split('?')[0].replace(/^\//, '');
  if (!fs.existsSync(clean)) {
    missing.push(clean);
  }
}
console.log('Missing local css:', missing);
