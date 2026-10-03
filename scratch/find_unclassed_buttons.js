const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  // Match buttons without class
  const matches = content.match(/<button(?![^>]*class=)[^>]*>(.*?)<\/button>/gis);
  if (matches && matches.length) {
    console.log(`\n[${file}] has ${matches.length} button(s) without class:`);
    matches.slice(0, 5).forEach(m => {
      // print first 100 chars
      console.log('   ' + m.replace(/\s+/g, ' ').substring(0, 100));
    });
  }
});
