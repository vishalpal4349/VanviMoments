const fs = require('fs');
const path = require('path');

const tDir = 'templates';
const dirs = fs.readdirSync(tDir);
const report = [];

dirs.forEach(d => {
  const full = path.join(tDir, d);
  if (fs.statSync(full).isDirectory()) {
    const bld = path.join(full, 'builder.html');
    if (fs.existsSync(bld)) {
      const c = fs.readFileSync(bld, 'utf8');
      const hasBack = /vanviGoBack|history\.back|btn-back|back-btn/i.test(c);
      const hasVp = c.includes('name="viewport"');
      const hasWatermark = /watermark/i.test(c);
      report.push({ folder: d, hasBack, hasVp, hasWatermark });
    }
  }
});

console.log('Total template builder.html:', report.length);
const missingBack = report.filter(r => !r.hasBack);
console.log('Missing Back Button in builder:', missingBack.length);
if (missingBack.length > 0) console.log(missingBack);

const hasWatermark = report.filter(r => r.hasWatermark);
console.log('Has watermark text in builder:', hasWatermark.length);
if (hasWatermark.length > 0) console.log(hasWatermark);
