const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const results = [];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  // Look for placeholders or values containing names like Aarav, Sneha, Rishu, Karan, or example numbers
  const regex = /placeholder=["']([^"']*(?:aarav|rishu|sneha|karan|rahul|priya|example\.com|\+91\s*98765|john)[^"']*)["']/gi;
  let match;
  while ((match = regex.exec(content)) !== null) {
    results.push({ file: f, match: match[0], placeholder: match[1] });
  }
});

console.log(JSON.stringify(results, null, 2));
