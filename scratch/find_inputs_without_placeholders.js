const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const matches = [...content.matchAll(/<input\b([^>]*)>/gi)];
  matches.forEach(m => {
    const attrs = m[1];
    if (/type=["'](hidden|checkbox|radio|submit|button|file|color|range)["']/i.test(attrs)) return;
    if (!/placeholder\s*=/i.test(attrs)) {
      console.log(`[${f}] ${m[0]}`);
    }
  });
});
