const fs = require('fs');
const lines = fs.readFileSync('ai.html', 'utf8').split('\n');
lines.forEach((line, idx) => {
  if (line.includes('aiPromptInput')) {
    console.log(`Line ${idx + 1}: ${line}`);
  }
});
