const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');

  // Replace any existing favicon link
  if (/<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*>/i.test(content)) {
    content = content.replace(/<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*>/gi, '<link rel="icon" type="image/svg+xml" href="assets/favicon.svg">');
  } else {
    // Insert after <meta charset="..."> or <head>
    if (content.includes('<meta charset="UTF-8">')) {
      content = content.replace('<meta charset="UTF-8">', '<meta charset="UTF-8">\n  <link rel="icon" type="image/svg+xml" href="assets/favicon.svg">');
    } else if (content.includes('<meta charset="utf-8">')) {
      content = content.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n  <link rel="icon" type="image/svg+xml" href="assets/favicon.svg">');
    } else if (content.includes('<head>')) {
      content = content.replace('<head>', '<head>\n  <link rel="icon" type="image/svg+xml" href="assets/favicon.svg">');
    }
  }

  fs.writeFileSync(f, content, 'utf8');
});

console.log(`Applied luxury favicon to all ${files.length} HTML files!`);
