const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const regex = /<script[^>]+src=["']([^"']+)["']/gi;
let match;
const scriptSrcs = [];
while ((match = regex.exec(html)) !== null) {
  scriptSrcs.push(match[1]);
}
console.log('Script sources count:', scriptSrcs.length);
const missing = [];
for (const src of scriptSrcs) {
  if (src.startsWith('http://') || src.startsWith('https://')) continue;
  const clean = src.split('?')[0].replace(/^\//, '');
  if (!fs.existsSync(clean)) {
    missing.push(clean);
  }
}
console.log('Missing local scripts:', missing);
