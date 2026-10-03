const fs = require('fs');
const vm = require('vm');
const html = fs.readFileSync('index.html', 'utf8');
const match = html.match(/<script id="vanvi-main-bundle">([\s\S]*?)<\/script>/i);
const code = match[1];

try {
  new vm.Script(code, { lineOffset: 5206 });
} catch (e) {
  console.log('Error message:', e.message);
  console.log('Line number in file:', e.stack.split('\n')[0]);
}
