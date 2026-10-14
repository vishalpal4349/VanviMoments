const fs = require('fs');
const html = fs.readFileSync('wedding.html', 'utf8');

const previews = (html.match(/href="[^"]*preview[^"]*"/g) || []).length;
const builders = (html.match(/href="[^"]*builder[^"]*"/g) || []).length;

console.log('Preview links in wedding.html:', previews);
console.log('Builder links in wedding.html:', builders);
console.log('Is vanvi-vault-lock.js in wedding.html:', html.includes('vanvi-vault-lock.js'));
console.log('Is vanvi-vault-lock.css in wedding.html:', html.includes('vanvi-vault-lock.css'));
