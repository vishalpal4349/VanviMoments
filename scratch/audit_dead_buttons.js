const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

console.log('=== AUDITING UNLINKED / DEAD ANCHORS ===\n');

let total = 0;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const anchorRegex = /<a\b([^>]*)href=["']([^"']*)["']([^>]*)>(.*?)<\/a>/gis;
  let match;
  while ((match = anchorRegex.exec(content)) !== null) {
    const fullTag = match[0];
    const href = match[2].trim();
    if (href === '#' || href === 'javascript:void(0)' || href === 'javascript:;') {
      if (!fullTag.includes('onclick') && !fullTag.includes('id=') && !fullTag.includes('data-')) {
        console.log(`[${file}] -> ${fullTag.replace(/\s+/g, ' ').substring(0, 90)}`);
        total++;
      }
    }
  }
});

console.log(`\nTotal dead anchors found: ${total}`);
