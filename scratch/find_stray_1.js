const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const noStyle = html.replace(/<style[\s\S]*?<\/style>/gi, (m) => ' '.repeat(m.length));
const noScript = noStyle.replace(/<script[\s\S]*?<\/script>/gi, (m) => ' '.repeat(m.length));

const regex = />([^<]+)</g;
let m;
while ((m = regex.exec(noScript)) !== null) {
  const text = m[1].trim();
  if (text.includes('1')) {
    const line = html.substring(0, m.index).split('\n').length;
    console.log(`Line ${line}: "${text}"`);
  }
}

