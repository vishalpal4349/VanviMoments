const fs = require('fs');
const path = require('path');

function getAllHtml(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    if (file === 'node_modules' || file === '.git' || file === 'backup_templates_archive' || file === 'scratch') return;
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllHtml(full));
    } else if (file.endsWith('.html')) {
      results.push(full);
    }
  });
  return results;
}

const allPages = getAllHtml('.');
const brokenLinks = [];

allPages.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const dir = path.dirname(file);

  // Match local src and href attributes (excluding http, https, data:, javascript:, #, mailto:, tel:)
  const regex = /(?:src|href)=["']([^"']+)["']/gi;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const target = match[1].trim();
    if (!target || target.startsWith('http:') || target.startsWith('https:') || target.startsWith('data:') || target.startsWith('javascript:') || target.startsWith('#') || target.startsWith('mailto:') || target.startsWith('tel:') || target.startsWith('blob:')) {
      continue;
    }

    const cleanPath = target.split('?')[0].split('#')[0];
    if (!cleanPath) continue;

    const resolved = path.resolve(dir, cleanPath);
    if (!fs.existsSync(resolved)) {
      brokenLinks.push({ file: path.relative('.', file).replace(/\\/g, '/'), target, cleanPath });
    }
  }
});

console.log('Total pages checked for broken links:', allPages.length);
console.log('Broken local asset links found:', brokenLinks.length);
if (brokenLinks.length > 0) {
  console.log(JSON.stringify(brokenLinks.slice(0, 50), null, 2));
}
