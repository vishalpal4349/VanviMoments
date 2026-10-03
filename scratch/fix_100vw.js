const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

let fixedCount = 0;
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Replace max-width: 100vw; with max-width: 100%;
  if (content.includes('max-width: 100vw;') || content.includes('max-width:100vw;')) {
    content = content.replace(/max-width:\s*100vw;/g, 'max-width: 100%;');
    changed = true;
  }

  // Replace modal width: 100vw; with width: 100%;
  if (content.includes('width: 100vw;') || content.includes('width:100vw;')) {
    content = content.replace(/width:\s*100vw;/g, 'width: 100%;');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    fixedCount++;
    console.log(`Updated 100vw in ${file}`);
  }
});

console.log(`Successfully fixed 100vw in ${fixedCount} files.`);
