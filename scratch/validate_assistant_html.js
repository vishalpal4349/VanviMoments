const fs = require('fs');
const html = fs.readFileSync('vanvi-assistant.html', 'utf8');

console.log('DOCTYPE present:', html.startsWith('<!DOCTYPE html>'));
console.log('Viewport meta includes interactive-widget:', html.includes('interactive-widget=resizes-content'));

const openDivs = (html.match(/<div/g) || []).length;
const closeDivs = (html.match(/<\/div>/g) || []).length;
console.log('Div tags count match:', openDivs === closeDivs, `(${openDivs} / ${closeDivs})`);

const hasBrandLink = html.includes('class="brand-display"') && !html.includes('<a href="index.html" class="brand');
console.log('Brand is pure non-clickable display:', hasBrandLink);

