const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const scripts = html.match(/<script[^>]*>([\s\S]*?)<\/script>/g);
let content = scripts[1].replace(/<script[^>]*>|<\/script>/g, '').trim();

// Remove template literals first (they can contain nested braces)
let cleaned = content.replace(/\`[^\`]*\`/g, '`X`');
// Remove single-quoted strings
cleaned = cleaned.replace(/'[^']*'/g, "'X'");
// Remove double-quoted strings  
cleaned = cleaned.replace(/"[^"]*"/g, '"X"');
// Remove line comments
cleaned = cleaned.replace(/\/\/.*$/gm, '//X');
// Remove block comments
cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, '/*X*/');

let open = 0, close = 0;
for (let i = 0; i < cleaned.length; i++) {
  if (cleaned[i] === '{') open++;
  if (cleaned[i] === '}') close++;
}
console.log('Braces: open=' + open + ', close=' + close + ', diff=' + (open-close));

let popen = 0, pclose = 0;
for (let i = 0; i < cleaned.length; i++) {
  if (cleaned[i] === '(') popen++;
  if (cleaned[i] === ')') pclose++;
}
console.log('Parens: open=' + popen + ', close=' + pclose + ', diff=' + (popen-pclose));

// Now check with strings intact
open = 0; close = 0;
for (let i = 0; i < content.length; i++) {
  if (content[i] === '{') open++;
  if (content[i] === '}') close++;
}
console.log('Braces (raw): open=' + open + ', close=' + close + ', diff=' + (open-close));
