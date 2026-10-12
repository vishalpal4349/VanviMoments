const fs = require('fs');
const path = require('path');
const tDir = path.join(__dirname, '../templates');
const dirs = fs.readdirSync(tDir).filter(f => fs.statSync(path.join(tDir, f)).isDirectory());

dirs.forEach(d => {
  const p = path.join(tDir, d, 'index.html');
  if (fs.existsSync(p)) {
    const html = fs.readFileSync(p, 'utf8');
    const matches = html.match(/<[a-z0-9]+[^>]*style=["'][^"']*(position:\s*fixed|z-index:\s*999)[^"']*["'][^>]*>/gi);
    if (matches) {
      console.log('=== ' + d + ' ===');
      matches.forEach(m => console.log('  ' + m.slice(0, 120)));
    }
  }
});
