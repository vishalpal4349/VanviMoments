const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

const missingNav = [];
const missingInnerLight = [];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  if (!content.includes('vanvi-navigation.css')) missingNav.push(f);
  if (!content.includes('vanvi-inner-light.css')) missingInnerLight.push(f);
});

console.log('Total root HTML files:', files.length);
console.log('Files missing vanvi-navigation.css (' + missingNav.length + '):', missingNav);
console.log('Files missing vanvi-inner-light.css (' + missingInnerLight.length + '):', missingInnerLight);
