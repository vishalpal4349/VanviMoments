const fs = require('fs');
const path = require('path');

function getHtmlFiles(dir, list = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== 'scratch') {
        getHtmlFiles(fullPath, list);
      }
    } else if (entry.name.endsWith('.html')) {
      list.push(fullPath);
    }
  }
  return list;
}

const files = getHtmlFiles('.');
let fixedCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;

  // Fix broken favicon tag where leftover SVG markup was appended
  // e.g. <link rel="icon" type="image/svg+xml" href="assets/favicon.svg"><text y=%22.9em%22 font-size=%2290%22>💖</text></svg>">
  content = content.replace(/<link\s+rel=["']icon["']\s+type=["']image\/svg\+xml["']\s+href=["']assets\/favicon\.svg["']><text[^>]*>.*?<\/text><\/svg>">/gi, '<link rel="icon" type="image/svg+xml" href="assets/favicon.svg">');

  // Also catch generic variants
  content = content.replace(/<link\s+rel=["']icon["'][^>]*href=["']assets\/favicon\.svg["']><text[^>]*>.*?<\/text><\/svg>">/gi, '<link rel="icon" type="image/svg+xml" href="assets/favicon.svg">');

  // Also check if any standalone leftover <text y=%22... exists in head
  content = content.replace(/<text\s+y=%22\.9em%22\s+font-size=%2290%22>.*?<\/text><\/svg>">/gi, '');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed file:', file);
    fixedCount++;
  }
}

console.log(`\nSuccessfully fixed ${fixedCount} files.`);
