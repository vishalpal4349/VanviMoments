const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const m = content.match(/<div class=["'](?:header-actions|header-nav-actions)[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);
  if (m) {
    const tags = [...m[1].matchAll(/<([a-z0-9]+)\b([^>]*)>([\s\S]*?)<\/\1>/gi)].map(x => ({
      tag: x[1],
      class: (x[2].match(/class=["']([^"']*)["']/) || [])[1] || '',
      text: x[3].replace(/<[^>]+>/g, '').trim(),
      href: (x[2].match(/href=["']([^"']*)["']/) || [])[1] || ''
    }));
    console.log(f, tags);
  }
});
