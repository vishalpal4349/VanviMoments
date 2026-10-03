const fs = require('fs');

// Check line 3144 in index.html
const indexHtml = fs.readFileSync('index.html', 'utf8');
const lines = indexHtml.split('\n');

console.log('Around line 3140-3150:');
for (let i = 3138; i < 3152; i++) {
  console.log(`${i + 1}: ${lines[i]}`);
}
