const fs = require('fs');
const content = fs.readFileSync('admin.html', 'utf8');
const lines = content.split(/\r?\n/);

console.log('--- Functions in admin.html ---');
lines.forEach((line, idx) => {
  const match = line.match(/^\s*(async\s+)?function\s+([a-zA-Z0-9_]+)\s*\(/);
  if (match) {
    console.log(`${idx + 1}: ${match[2]}`);
  }
});
