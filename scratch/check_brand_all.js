const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory() && !full.includes('node_modules') && !full.includes('.git')) {
      results = results.concat(walk(full));
    } else if (file.endsWith('.html')) {
      results.push(full);
    }
  });
  return results;
}

const allHtml = walk('.');
const dupes = [];

allHtml.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const regex = /<(?:a|div|header)[^>]+class=["'][^"']*(?:brand|logo|nav|header)[^"']*["'][^>]*>([\s\S]*?)<\/(?:a|div|header)>/gi;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const block = match[1];
    if (/<img[^>]+(?:logo|header)[^>]*>/i.test(block)) {
      // check if text has Vanvi
      const stripped = block.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      if (/Vanvi/i.test(stripped)) {
        dupes.push({ file: f, text: stripped, html: block.trim().replace(/\s+/g, ' ').slice(0, 140) });
      }
    }
  }
});

console.log('Total brand containers with both img and vanvi text:', dupes.length);
dupes.forEach(d => console.log(`[${d.file}] text: "${d.text}"`));
