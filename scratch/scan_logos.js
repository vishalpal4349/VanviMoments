const fs = require('fs');
const path = require('path');

function walk(dir) {
  let res = [];
  fs.readdirSync(dir).forEach(f => {
    if (['node_modules', '.git', 'scratch'].includes(f)) return;
    let full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) res = res.concat(walk(full));
    else if (f.endsWith('.html')) res.push(full);
  });
  return res;
}

const allFiles = walk('.');

allFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  // Check for any <a> or other tag representing brand/logo
  const lines = content.split('\n');
  const fileFindings = [];
  lines.forEach((line, idx) => {
    if (/<a[^>]*href=["'](?:index\.html|\/|#)?["'][^>]*>[\s\S]*?(?:VANVI|Vanvi|brand|logo)/i.test(line) ||
        /<a[^>]+(?:class|id)=["'][^"']*(?:brand|logo)[^"']*["'][^>]*>/i.test(line) ||
        (/class=["'][^"']*(?:brand|logo)[^"']*["']/i.test(line) && /href=/i.test(line))) {
      fileFindings.push(`Line ${idx+1}: ${line.trim()}`);
    }
  });
  if (fileFindings.length > 0) {
    console.log(`=== ${file} ===`);
    fileFindings.forEach(f => console.log('  ' + f));
  }
});
