const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const links = [...html.matchAll(/<link[^>]+>/gi)].map(m => m[0]);
console.log('Links in index.html:', links);

