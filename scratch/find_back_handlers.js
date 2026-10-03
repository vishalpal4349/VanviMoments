const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(f => {
  const c = fs.readFileSync(f, 'utf8');
  const matches = [...c.matchAll(/onclick=["']([^"']*(?:back|history)[^"']*)["']/gi)].map(m => m[1]);
  if (matches.length > 0) {
    console.log(`${f}: ${matches.join(' | ')}`);
  }
});

