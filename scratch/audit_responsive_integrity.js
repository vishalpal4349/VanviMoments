const fs = require('fs');
const path = require('path');

const rootHtmls = fs.readdirSync('.').filter(f => f.endsWith('.html'));

const issues = [];

rootHtmls.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  // 1. Viewport tag
  if (!content.includes('viewport') || !content.includes('width=device-width')) {
    issues.push({ file, type: 'Missing viewport meta tag' });
  }

  // 2. Check for dangerous fixed width patterns on body or wrappers
  const fixedWidthMatch = content.match(/(width:\s*([4-9]\d{2,}|[1-9]\d{3,})px)/g);
  if (fixedWidthMatch) {
    // Check if it's inside a media query or max-width
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      if (/width:\s*[4-9]\d{2,}px/.test(line) && !line.includes('max-width') && !line.includes('@media') && !line.includes('aspect-ratio') && !line.includes('canvas')) {
        // Only flag if applied to body/html/container
        if (/(\.container|\.wrapper|body|html|\.page)\s*\{[^}]*width:\s*[4-9]\d{2,}px/.test(line)) {
          issues.push({ file, line: idx + 1, type: 'Fixed width on container: ' + line.trim() });
        }
      }
    });
  }

  // 3. Check for unhandled horizontal overflow
  if (content.includes('overflow-x: scroll') || content.includes('overflow-x: visible')) {
    issues.push({ file, type: 'Potential horizontal scroll trigger' });
  }
});

console.log(`Audited ${rootHtmls.length} root HTML files for responsive integrity.`);
console.log(`Issues found: ${issues.length}`);
if (issues.length > 0) {
  console.log(JSON.stringify(issues, null, 2));
} else {
  console.log('✅ 100% of root HTML files pass responsive viewport and overflow audits!');
}
