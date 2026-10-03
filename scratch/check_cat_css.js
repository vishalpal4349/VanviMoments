const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.startsWith('category-'));
files.forEach(f => {
  const c = fs.readFileSync(f, 'utf8');
  const links = [...c.matchAll(/<link\b[^>]*rel=["']stylesheet["'][^>]*>/gi)].map(m => m[0]);
  console.log(f, links);
});
