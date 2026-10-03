const fs = require('fs');
const html = fs.readFileSync('scratch/vercel_raw.html', 'utf8');

// Find all elements with id
const ids = [...html.matchAll(/id=["']([^"']+)["']/g)].map(m => m[1]);
console.log('--- ALL ELEMENT IDS ---');
console.log([...new Set(ids)]);
