const fs = require('fs');
const path = require('path');

const tDir = 'templates';
const dirs = fs.readdirSync(tDir);
let addedCount = 0;

dirs.forEach(d => {
  const full = path.join(tDir, d);
  if (fs.statSync(full).isDirectory()) {
    const bld = path.join(full, 'builder.html');
    if (fs.existsSync(bld)) {
      let content = fs.readFileSync(bld, 'utf8');
      if (!content.includes('vanvi-template-lock.js')) {
        // Add vanvi-template-lock.js before </body> or after vanvi-builder-smart.js
        if (content.includes('vanvi-builder-smart.js')) {
          content = content.replace(
            /(<script[^>]*vanvi-builder-smart\.js[^>]*><\/script>)/i,
            '$1\n  <script src="../../js/vanvi-template-lock.js" defer></script>'
          );
        } else if (content.includes('</body>')) {
          content = content.replace('</body>', '  <script src="../../js/vanvi-template-lock.js"></script>\n</body>');
        }
        fs.writeFileSync(bld, content, 'utf8');
        addedCount++;
        console.log(`Added vanvi-template-lock.js to ${bld}`);
      }
    }
  }
});

console.log('Total builders updated with template-lock:', addedCount);
