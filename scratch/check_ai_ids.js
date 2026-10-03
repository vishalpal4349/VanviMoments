const fs = require('fs');

const aiHtml = fs.readFileSync('ai.html', 'utf8');

// Find all document.getElementById('...')
const idRegex = /document\.getElementById\(['"]([^'"]+)['"]\)/g;
let match;
const missing = [];
while ((match = idRegex.exec(aiHtml)) !== null) {
  const id = match[1];
  if (!aiHtml.includes(`id="${id}"`) && !aiHtml.includes(`id='${id}'`)) {
    missing.push(id);
  }
}
console.log('Missing IDs in ai.html:', missing);

// Check querySelector
const selRegex = /document\.querySelector\(['"]#([^'"]+)['"]\)/g;
while ((match = selRegex.exec(aiHtml)) !== null) {
  const id = match[1];
  if (!aiHtml.includes(`id="${id}"`) && !aiHtml.includes(`id='${id}'`)) {
    missing.push(id);
  }
}
console.log('Missing selector IDs in ai.html:', missing);

