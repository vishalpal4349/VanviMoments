const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const match = html.match(/<script id="vanvi-main-bundle">([\s\S]*?)<\/script>/i);
const code = match[1];
const lines = code.split('\n');

for (let l = 10; l < lines.length; l++) {
  const testCode = lines.slice(0, l).join('\n') + '\n})();';
  try {
    new Function(testCode);
    console.log('Code was validly closed at line', l + 5206);
  } catch(e) {}
}
