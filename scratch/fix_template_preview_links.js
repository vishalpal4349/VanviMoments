const fs = require('fs');
const path = require('path');

const tDir = 'templates';
const dirs = fs.readdirSync(tDir);
let fixedCount = 0;

dirs.forEach(d => {
  const full = path.join(tDir, d);
  if (fs.statSync(full).isDirectory()) {
    const prevFile = path.join(full, 'preview.html');
    const hasLocalBuilder = fs.existsSync(path.join(full, 'builder.html'));

    if (fs.existsSync(prevFile) && !hasLocalBuilder) {
      let content = fs.readFileSync(prevFile, 'utf8');
      if (content.includes('href="builder.html"')) {
        const replacement = `href="../../builder.html?template=${d}&occasion=celebration"`;
        content = content.replace(/href=["']builder\.html["']/g, replacement);
        fs.writeFileSync(prevFile, content, 'utf8');
        fixedCount++;
        console.log(`Fixed preview link in ${d} -> ${replacement}`);
      }
    }
  }
});

console.log('Total preview links fixed:', fixedCount);
