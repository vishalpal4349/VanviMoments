const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

const regex = /<(button|a)[^>]*?(class="[^"]*"|id="[^"]*")[^>]*?>/g;
let match;
let i = 0;
while ((match = regex.exec(content)) !== null) {
  const str = match[0];
  if (str.includes('btn') || str.includes('button') || str.includes('primary') || str.includes('secondary') || match[1] === 'button') {
    i++;
    console.log(`${i}. [${match[1]}] ${str}`);
  }
}
