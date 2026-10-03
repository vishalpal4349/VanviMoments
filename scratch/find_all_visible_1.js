const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

// Find all occurrences of the character '1' in index.html and its surrounding 30 chars
let pos = 0;
const results = [];
while ((pos = content.indexOf('1', pos)) !== -1) {
  // Check if this '1' is part of an HTML tag, a number, a CSS hex, or plain text
  const before = content.substring(Math.max(0, pos - 25), pos);
  const after = content.substring(pos + 1, Math.min(content.length, pos + 25));
  
  // Is it between > and < ?
  const lastOpen = before.lastIndexOf('>');
  const lastClose = before.lastIndexOf('<');
  const nextClose = after.indexOf('<');
  const nextOpen = after.indexOf('>');
  
  if (lastOpen > lastClose && (nextClose < nextOpen || nextOpen === -1)) {
    // This '1' is in a TEXT node (visible HTML)!
    results.push({
      index: pos,
      context: (before + '【1】' + after).replace(/\n/g, ' ')
    });
  }
  pos++;
}

console.log('Visible text nodes with 1: (' + results.length + ' found)');
results.forEach(r => console.log(r.context));
