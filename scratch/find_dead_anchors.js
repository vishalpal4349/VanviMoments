const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const htmls = fs.readdirSync(root).filter(f => f.endsWith('.html'));

const dead = {};
htmls.forEach(f => {
  const c = fs.readFileSync(path.join(root, f), 'utf8');
  const matches = [...c.matchAll(/<a\b[^>]*\bhref=["'](#|javascript:void\(0\);?)["'][^>]*>(.*?)<\/a>/gi)];
  if (matches.length) {
    dead[f] = matches.map(m => ({
      tag: m[0].slice(0, 90),
      text: m[2].replace(/<[^>]+>/g, '').trim()
    }));
  }
});

console.log('Pages with dead anchors:');
Object.entries(dead).forEach(([p, list]) => {
  console.log(`${p}: ${list.length} dead links`);
  list.forEach(item => console.log(`   - [${item.text}] ${item.tag}`));
});
