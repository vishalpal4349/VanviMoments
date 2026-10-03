const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const m = content.match(/class=["'](?:header-actions|header-nav-actions)[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);
  if (m) {
    const text = m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    console.log(f + ': ' + text);
  }
});
