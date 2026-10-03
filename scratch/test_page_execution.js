const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const files = fs.readdirSync(root).filter(f => f.endsWith('.html')).sort();

console.log('=== CHECKING NULL DEREFERENCES IN SCRIPTS (document.getElementById.addEventListener) ===\n');

let totalCrashes = 0;

files.forEach(f => {
  const content = fs.readFileSync(path.join(root, f), 'utf8');
  
  // Find patterns like document.getElementById('foo').addEventListener
  const matches = [...content.matchAll(/document\.getElementById\(['"]([^'"]+)['"]\)\.(?:addEventListener|onclick|innerHTML|textContent|value|classList|style)/gi)];
  
  const missing = [];
  matches.forEach(m => {
    const id = m[1];
    // check if id exists in HTML
    const idPattern = new RegExp(`id=["']${id}["']`, 'i');
    if (!idPattern.test(content)) {
      missing.push({ id, code: m[0] });
    }
  });

  if (missing.length > 0) {
    console.log(`❌ [${f}] Has ${missing.length} POTENTIAL NULL DEREFERENCES:`);
    missing.forEach(m => {
      console.log(`   - Missing ID: "${m.id}" called via: ${m.code}`);
    });
    totalCrashes += missing.length;
  }
});

if (totalCrashes === 0) {
  console.log('✅ ALL document.getElementById targets exist! Zero null dereferences.');
} else {
  console.log(`\nFound ${totalCrashes} potential runtime crashes.`);
}
