const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((l, idx) => {
    if (l.includes('rewards.html') && /wheel|spin/i.test(l)) {
      console.log(`[${file}:${idx+1}] ${l.trim()}`);
    }
  });
});
