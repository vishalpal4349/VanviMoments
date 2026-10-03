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
  // Extract <header>...</header> or <nav>...</nav> or top bar
  const headerMatch = content.match(/<header[\s\S]*?<\/header>/i) || content.match(/<nav[\s\S]*?<\/nav>/i);
  if (headerMatch) {
    console.log(`=== ${file} (HEADER) ===`);
    // Find any anchor or brand in header
    const anchors = headerMatch[0].match(/<a[\s\S]*?<\/a>/gi) || [];
    anchors.forEach(a => {
      if (/vanvi|brand|logo|home/i.test(a)) {
        console.log('  ' + a.replace(/\s+/g, ' ').slice(0, 150));
      }
    });
  } else {
    // Check if there is a top bar or logo container
    const brandMatches = content.match(/<[^>]+class=["'][^"']*(?:brand|logo|topbar|navbar)[^"']*["'][\s\S]*?>[\s\S]{0,200}?<\/[^>]+>/gi) || [];
    if (brandMatches.length > 0) {
      console.log(`=== ${file} (NO HEADER TAG, BUT BRAND/LOGO ELEMENTS) ===`);
      brandMatches.forEach(b => console.log('  ' + b.replace(/\s+/g, ' ').slice(0, 150)));
    } else {
      console.log(`=== ${file} (NO HEADER OR BRAND MATCH) ===`);
    }
  }
});
