const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
let updated = 0;

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  if (!content.includes('vanvi-global-experience.css') && content.includes('vanvi-navigation.css')) {
    content = content.replace(/(<link[^>]+href=["']vanvi-navigation\.css["'][^>]*>)/i, '$1\n  <link rel="stylesheet" href="css/vanvi-global-experience.css" />');
    fs.writeFileSync(f, content, 'utf8');
    updated++;
    console.log('Updated:', f);
  }
});

console.log('Total files updated:', updated);
