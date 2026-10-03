const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const divBrands = [];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const matches = content.match(/<div[^>]*class=["'][^"']*(?:brand|header-brand)[^"']*["'][^>]*>/gi);
  if (matches) {
    divBrands.push({ file: f, matches });
  }
});

console.log('Files with <div ...brand...>: ' + divBrands.length);
divBrands.forEach(item => {
  console.log(item.file + ' -> ' + item.matches.join(' | '));
});
