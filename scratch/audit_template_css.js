const fs = require('fs');
const path = require('path');

const tDirs = fs.readdirSync('templates').filter(f => fs.statSync(path.join('templates', f)).isDirectory());

tDirs.forEach(dir => {
  ['builder.html', 'index.html', 'preview.html'].forEach(file => {
    const fPath = path.join('templates', dir, file);
    if (fs.existsSync(fPath)) {
      const content = fs.readFileSync(fPath, 'utf8');
      const hasGlobal = content.includes('vanvi-global-experience.css');
      const hasInner = content.includes('vanvi-inner-light.css');
      const hasNav = content.includes('vanvi-navigation.css');
      console.log(`${fPath.padEnd(55)} -> global:${hasGlobal ? '✅' : '❌'}, inner:${hasInner ? '✅' : '❌'}, nav:${hasNav ? '✅' : '❌'}`);
    }
  });
});
