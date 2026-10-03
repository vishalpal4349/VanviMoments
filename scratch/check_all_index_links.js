const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(f => {
  const c = fs.readFileSync(f, 'utf8');
  const matches = c.match(/<a[^>]*href=["']index\.html["'][^>]*>[\s\S]*?<\/a>/gi) || [];
  matches.forEach(m => {
    const text = m.replace(/\s+/g, ' ');
    console.log(f + ': ' + text.slice(0, 140));
  });
});
