const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const darkFiles = [];
files.forEach(f => {
  const c = fs.readFileSync(f, 'utf8');
  if (c.includes('#0a020c') || c.includes('--bg-black') || c.includes('0a020c')) {
    darkFiles.push(f);
  }
});
console.log('HTML files with 0a020c or --bg-black:');
console.log(darkFiles);

