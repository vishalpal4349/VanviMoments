const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Find all occurrences of "1" in index.html where it might be rendered on screen or logged or in an element
const scriptMatches = [...html.matchAll(/<script[\s\S]*?>([\s\S]*?)<\/script>/gi)];
scriptMatches.forEach((sm, i) => {
  const code = sm[1];
  const lines = code.split('\n');
  lines.forEach((line, lineIdx) => {
    if (line.includes('1') && (line.includes('textContent') || line.includes('innerText') || line.includes('innerHTML') || line.includes('badge') || line.includes('count') || line.includes('append') || line.includes('write'))) {
      console.log(`Script ${i+1}, line ${lineIdx+1}: ${line.trim()}`);
    }
  });
});

