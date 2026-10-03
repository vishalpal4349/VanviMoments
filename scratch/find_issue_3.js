const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const regex = /(?:\.innerHTML|\.textContent|\.innerText|\.append|\.prepend|\.after|\.before)\s*=\s*['"`]?1['"`]?/g;
let m;
while ((m = regex.exec(html)) !== null) {
  console.log('DOM setter matching 1:', m[0]);
}

// Also check for any console.log or alert or error
const scripts = html.match(/<script[\s\S]*?<\/script>/gi) || [];
console.log('Total script tags:', scripts.length);
scripts.forEach((s, idx) => {
  if (s.includes("'1'") || s.includes('"1"') || s.includes('>1<')) {
    // find lines
    s.split('\n').forEach(line => {
      if (line.includes("'1'") || line.includes('"1"')) {
        console.log(`Script ${idx} line:`, line.trim());
      }
    });
  }
});
