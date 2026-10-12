const fs = require('fs');
const path = require('path');
const tDir = path.join(__dirname, '../templates');
const dirs = fs.readdirSync(tDir).filter(f => fs.statSync(path.join(tDir, f)).isDirectory());

dirs.forEach(d => {
  const p = path.join(tDir, d, 'index.html');
  if (fs.existsSync(p)) {
    const html = fs.readFileSync(p, 'utf8');
    const regex = /<([a-z0-9]+)[^>]*(id|class)=["'][^"']*(modal|popup|badge|pill|corner)[^"']*["'][^>]*>/gi;
    let m;
    const items = [];
    while ((m = regex.exec(html)) !== null) {
      items.push(m[0].slice(0, 120));
    }
    if (items.length > 0) {
      console.log('=== ' + d + ' ===');
      items.forEach(it => console.log('  ' + it));
    }
  }
});
