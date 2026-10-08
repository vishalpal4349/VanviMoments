const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const cssMap = {};
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const links = content.match(/href=["'][^"']+\.css["']/g) || [];
  links.forEach(l => {
    const css = l.replace(/href=["']/, '').replace(/["']$/, '');
    cssMap[css] = (cssMap[css] || 0) + 1;
  });
});
console.log('CSS stylesheet references across root HTML files:');
console.log(JSON.stringify(cssMap, null, 2));
