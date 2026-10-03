const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const scriptSrcs = [...html.matchAll(/<script[^>]+src=["']([^"']+)["']/gi)].map(m => m[1]);
console.log('Script sources in index.html:', scriptSrcs);

