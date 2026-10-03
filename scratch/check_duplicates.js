const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

console.log('Auditing duplicate IDs across ' + files.length + ' HTML files...');
let totalDupes = 0;

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const regex = /id=["']([^"']+)["']/gi;
  let m;
  const seen = new Set();
  const dupes = new Set();
  while ((m = regex.exec(content)) !== null) {
    const id = m[1];
    if (seen.has(id)) {
      dupes.add(id);
    }
    seen.add(id);
  }
  if (dupes.size > 0) {
    console.log(`❌ ${f} has ${dupes.size} duplicate ID(s):`, Array.from(dupes));
    totalDupes += dupes.size;
  } else {
    console.log(`✓ ${f}: 0 duplicate IDs`);
  }
});

console.log('Total duplicate IDs found:', totalDupes);

