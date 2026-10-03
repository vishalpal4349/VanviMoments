const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const matches = [...html.matchAll(/content\s*:\s*['"]([^'"]*)['"]/gi)];
matches.forEach(m => {
  if (m[1].includes('1')) {
    console.log('CSS content with 1:', m[0]);
  }
});

