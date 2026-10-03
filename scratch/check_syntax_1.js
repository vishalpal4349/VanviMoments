const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Check unclosed tags or stray characters
// Let's look for any tag or attribute or text node where '1' is alone
let lines = html.split('\n');
lines.forEach((l, i) => {
  // Check if line contains a standalone 1 or '1' outside tags
  const strippedTags = l.replace(/<[^>]+>/g, '');
  if (strippedTags.trim() === '1') {
    console.log(`Line ${i+1} has standalone 1:`, l);
  }
});

// Check if any tag attribute is malformed e.g. <div 1> or >1
lines.forEach((l, i) => {
  if (/<[a-zA-Z0-9-]+\s+1\b/.test(l) || />1</.test(l) || />\s*1\s*</.test(l)) {
    console.log(`Suspicious 1 at line ${i+1}:`, l);
  }
});

