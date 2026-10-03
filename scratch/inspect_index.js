const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Find all elements with ID
const idMatches = [...html.matchAll(/id=["']([^"']+)["']/g)].map(m => m[1]);
console.log('Total IDs:', idMatches.length);
console.log('IDs list:', idMatches);

// Let's check sections in index.html
const sectionMatches = [...html.matchAll(/<section[^>]*id=["']([^"']+)["'][^>]*>/g)].map(m => m[1]);
console.log('Sections with ID:', sectionMatches);
