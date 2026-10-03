const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const match = html.match(/<script id="vanvi-main-bundle">([\s\S]*?)<\/script>/i);
const code = match[1];
try {
  new Function(code);
  console.log('SUCCESS: Script parsed with no errors!');
} catch (e) {
  console.error('PARSE ERROR:', e.message);
}
