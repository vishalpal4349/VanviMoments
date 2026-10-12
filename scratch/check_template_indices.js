const fs = require('fs');
const path = require('path');

function getTemplateIndexFiles() {
  const tDir = 'templates';
  const dirs = fs.readdirSync(tDir);
  const report = [];
  dirs.forEach(d => {
    const full = path.join(tDir, d);
    if (fs.statSync(full).isDirectory()) {
      const idx = path.join(full, 'index.html');
      if (fs.existsSync(idx)) {
        const c = fs.readFileSync(idx, 'utf8');
        const hasLock = c.includes('vanvi-template-lock.js');
        const hasAdapter = c.includes('template-adapter.js');
        report.push({ folder: d, hasLock, hasAdapter });
      }
    }
  });
  return report;
}

const res = getTemplateIndexFiles();
const missingLock = res.filter(r => !r.hasLock);
console.log('Total template index.html:', res.length);
console.log('Missing vanvi-template-lock.js:', missingLock.length);
if (missingLock.length > 0) {
  console.log(missingLock);
}
