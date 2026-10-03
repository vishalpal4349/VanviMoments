const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '..', 'builder.html'), 'utf8');
const urls = [...content.matchAll(/(?:src|href)="([^"]+)"/g)].map(m => m[1]);

urls.filter(u => !u.startsWith('http') && !u.startsWith('#') && !u.startsWith('data:') && !u.startsWith('javascript:')).forEach(u => {
  const clean = u.split('?')[0];
  const exists = fs.existsSync(path.join(__dirname, '..', clean));
  if (!exists) {
    console.log('NOT FOUND in builder.html:', clean);
  }
});
