const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.startsWith('category-') && f.endsWith('.html'));
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const matchGrid = content.match(/<main class=["']grid["'] id=["']([^"']+)["']>/);
  const matchCat = content.match(/getByCategory\(['"]([^'"]+)['"]\)/);
  console.log(f, 'Grid ID:', matchGrid ? matchGrid[1] : 'none', '| Category:', matchCat ? matchCat[1] : 'none');
});
