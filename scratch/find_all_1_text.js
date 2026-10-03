const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Strip styles and scripts
const noStyle = html.replace(/<style[\s\S]*?<\/style>/gi, '');
const noScript = noStyle.replace(/<script[\s\S]*?<\/script>/gi, '');

// Extract text nodes with line numbers
const lines = noScript.split('\n');
lines.forEach((line, num) => {
  const stripped = line.replace(/<[^>]+>/g, '').trim();
  if (stripped && /\b1\b/.test(stripped)) {
    console.log(`Line ${num + 1}: "${stripped}"`);
  }
});
