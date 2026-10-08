const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html') && f !== 'index.html');
const cssUsage = {};

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const matches = content.match(/href=["']([^"']+\.css)["']/g) || [];
  matches.forEach(m => {
    const css = m.replace(/^href=["']/, '').replace(/["']$/, '');
    cssUsage[css] = (cssUsage[css] || 0) + 1;
  });
});

console.log('CSS Usage across ' + files.length + ' internal pages:');
console.log(JSON.stringify(cssUsage, null, 2));
