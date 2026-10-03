const fs = require('fs');

['index.html', 'ai.html', 'ai-matcher.html'].forEach(filename => {
  const c = fs.readFileSync(filename, 'utf8');
  console.log(`\n=== ${filename} ===`);
  const lines = c.split('\n');
  lines.forEach((line, i) => {
    if (line.toLowerCase().includes('celebration')) {
      console.log(`Line ${i+1}: ${line.trim().substring(0, 120)}`);
    }
  });
});

