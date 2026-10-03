const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// 1. Check for any standalone "1" text inside HTML tags
const matches = [];
const tagRegex = /<([a-zA-Z0-9_-]+)[^>]*>([\s\S]*?)<\/\1>/g;
let m;
while ((m = tagRegex.exec(html)) !== null) {
  const content = m[2].trim();
  if (content === '1' || content === '1.' || content === '①') {
    matches.push({ tag: m[1], match: m[0], index: m.index });
  }
}
console.log('Exact content "1" tags:', matches);

// 2. Check for any unclosed tags or weird text
const bodyStart = html.indexOf('<body');
const bodyEnd = html.indexOf('</body>');
const bodyContent = html.substring(bodyStart, bodyEnd);

// Look for any text node outside tags that has 1
const textNodes = bodyContent.split(/<[^>]+>/);
textNodes.forEach((node, i) => {
  const trimmed = node.trim();
  if (trimmed === '1' || trimmed.startsWith('1 ') || trimmed.endsWith(' 1') || trimmed === '1') {
    console.log('Suspicious text node ' + i + ':', JSON.stringify(trimmed));
  }
});
