const fs = require('fs');

const content = fs.readFileSync('ai.html', 'utf8');
const links = [];
const scripts = [];
const linkRe = /<link[^>]+href=["']([^"']+)["']/gi;
const scriptRe = /<script[^>]+src=["']([^"']+)["']/gi;

let m;
while ((m = linkRe.exec(content)) !== null) links.push(m[1]);
while ((m = scriptRe.exec(content)) !== null) scripts.push(m[1]);

console.log('Links in ai.html:', links);
console.log('Scripts in ai.html:', scripts);
