const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Find every line in index.html where '1' is NOT in hex color, px, rem, date, class, or attribute
const lines = html.split('\n');
const results = [];
lines.forEach((l, idx) => {
  // If line has '1', let's check its role
  if (l.includes('1')) {
    // remove tags
    const withoutTags = l.replace(/<[^>]+>/g, '').trim();
    if (withoutTags.length > 0 && withoutTags.includes('1')) {
      results.push({ line: idx + 1, text: withoutTags });
    }
  }
});

console.log('Results outside tags count:', results.length);
results.forEach(r => console.log(`Line ${r.line}: ${r.text}`));

