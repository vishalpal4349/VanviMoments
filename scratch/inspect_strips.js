const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const classes = new Set();
const classMatches = html.matchAll(/class=["']([^"']+)["']/g);
for (const m of classMatches) {
  m[1].split(/\s+/).forEach(c => {
    if (c.toLowerCase().includes('strip') || c.toLowerCase().includes('line')) {
      classes.add(c);
    }
  });
}

const idMatches = html.matchAll(/id=["']([^"']+)["']/g);
const ids = new Set();
for (const m of idMatches) {
  if (m[1].toLowerCase().includes('strip') || m[1].toLowerCase().includes('line')) {
    ids.add(m[1]);
  }
}

console.log('Classes with strip or line:', Array.from(classes));
console.log('IDs with strip or line:', Array.from(ids));

