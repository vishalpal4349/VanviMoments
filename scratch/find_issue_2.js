const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Let's search for "1" in any span, div, badge, small, em, sup, etc.
const lines = html.split('\n');
lines.forEach((line, num) => {
  // If line contains '>1<' or '> 1<' or 'badge' with 1 or similar
  if (/>\s*1\s*</.test(line) || /badge[^>]*>.*1.*<\/span>/i.test(line)) {
    console.log(`Line ${num + 1}: ${line.trim()}`);
  }
});
