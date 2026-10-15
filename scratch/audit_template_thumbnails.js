const fs = require('fs');

const dataFile = fs.readFileSync('js/vanvi-templates-data.js', 'utf8');

// Extract VANVI_TEMPLATES array
const startIdx = dataFile.indexOf('const VANVI_TEMPLATES = [');
const endIdx = dataFile.indexOf('];', startIdx);
const arrayStr = dataFile.substring(startIdx + 'const VANVI_TEMPLATES = '.length, endIdx + 1);

let templates = [];
try {
  templates = eval(arrayStr);
} catch (e) {
  console.error('Error evaluating templates data:', e.message);
}

console.log(`Loaded ${templates.length} templates from vanvi-templates-data.js`);

const results = [];
templates.forEach(t => {
  const thumb = t.thumbnail || t.image || t.cover || '';
  const exists = thumb ? fs.existsSync(thumb.replace(/^\.\//, '')) : false;
  results.push({
    id: t.id,
    title: t.title,
    category: t.category,
    thumbnail: thumb,
    exists: exists
  });
});

console.log('=== TEMPLATE THUMBNAIL AUDIT ===');
const missing = results.filter(r => !r.exists);
console.log(`Total: ${results.length}, Existing: ${results.length - missing.length}, Missing: ${missing.length}`);

if (missing.length > 0) {
  console.log('\n--- MISSING THUMBNAILS ---');
  missing.forEach(m => console.log(`[${m.id}] (${m.category}) - ${m.title} -> ${m.thumbnail}`));
}

console.log('\n--- ALL THUMBNAILS LIST ---');
results.forEach(r => {
  console.log(`[${r.id}] ${r.title} | Path: ${r.thumbnail} | Exists: ${r.exists}`);
});
