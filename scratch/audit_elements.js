const fs = require('fs');
const html = fs.readFileSync('ai-matcher.html', 'utf8');

// Find all document.getElementById calls
const idCalls = [...html.matchAll(/document\.getElementById\(['"]([^'"]+)['"]\)/g)].map(m => m[1]);
console.log('--- Checking getElementById targets ---');
idCalls.forEach(id => {
  const found = html.includes('id="' + id + '"') || html.includes("id='" + id + "'");
  console.log(id + ':', found ? 'EXISTS' : '*** MISSING ***');
});

// Find all querySelector / querySelectorAll calls
const qCalls = [...html.matchAll(/document\.querySelectorAll\(['"]([^'"]+)['"]\)/g)].map(m => m[1]);
console.log('--- Checking querySelectorAll targets ---');
qCalls.forEach(q => {
  const cleanQ = q.replace(/^\./, '').replace(/^#/, '');
  const found = html.includes(cleanQ);
  console.log(q + ':', found ? 'EXISTS' : '*** MISSING ***');
});
