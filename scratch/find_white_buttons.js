const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

const matches = [];
const btnRegex = /<(?:button|a)[^>]+(?:class|style)=[^>]*>[\s\S]*?<\/(?:button|a)>/g;
let m;
while ((m = btnRegex.exec(content)) !== null) {
  const text = m[0];
  if (text.includes('secondary') || text.includes('#fff') || text.includes('white') || text.includes('btn-categories') || text.includes('flow-btn')) {
    matches.push(text.replace(/\s+/g, ' ').slice(0, 160));
  }
}
console.log('Found buttons:', matches.length);
matches.slice(0, 25).forEach(b => console.log(' - ' + b));
