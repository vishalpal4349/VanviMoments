const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, '../templates');
const dirs = fs.readdirSync(templatesDir).filter(f => fs.statSync(path.join(templatesDir, f)).isDirectory());

const report = {};
dirs.forEach(d => {
  const p = path.join(templatesDir, d, 'index.html');
  if (fs.existsSync(p)) {
    const html = fs.readFileSync(p, 'utf8');
    // find main classes or IDs
    const classes = [];
    const classMatches = html.matchAll(/class=["']([^"']+)["']/g);
    for (const m of classMatches) {
      m[1].split(/\s+/).forEach(c => {
        if (c.includes('stage') || c.includes('container') || c.includes('device') || c.includes('wrapper') || c.includes('card') || c.includes('canvas')) {
          if (!classes.includes(c)) classes.push(c);
        }
      });
    }
    const idMatches = html.matchAll(/id=["']([^"']+)["']/g);
    const ids = [];
    for (const m of idMatches) {
      if (!ids.includes(m[1])) ids.push(m[1]);
    }
    report[d] = {
      hasLockCss: html.includes('vanvi-template-lock.css'),
      hasLockJs: html.includes('vanvi-template-lock.js'),
      classes: classes.slice(0, 5),
      ids: ids.slice(0, 5)
    };
  }
});

console.log(JSON.stringify(report, null, 2));
