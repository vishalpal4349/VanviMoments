const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf8');
console.log('Does index.html contain bottom-nav?', indexHtml.includes('bottom-nav'));
console.log('Does index.html contain class="bottom"?', indexHtml.includes('class="bottom"'));
console.log('Does index.html contain bottomNav?', indexHtml.includes('bottomNav'));
console.log('Does index.html contain vanvi-navigation?', indexHtml.includes('vanvi-navigation'));

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
for (const f of files) {
  const c = fs.readFileSync(f, 'utf8');
  if (c.includes('bottomNavHome')) {
    console.log('File with bottomNavHome:', f);
  }
}
