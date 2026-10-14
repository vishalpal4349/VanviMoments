const fs = require('fs');
const path = require('path');

const dir = 'templates/Rose Invitaion Wedding';
const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');

const regex = /(?:src|href)="([^"]+)"/g;
let m;
const missing = [];
const found = [];
while ((m = regex.exec(html)) !== null) {
  const link = m[1];
  if (link.startsWith('http') || link.startsWith('#') || link.startsWith('data:')) continue;
  const clean = link.split('?')[0];
  const p = path.join(dir, clean);
  if (!fs.existsSync(p)) {
    missing.push(link);
  } else {
    found.push(link);
  }
}
console.log('Total local references found:', found.length);
console.log('Missing assets in index.html:', missing);
