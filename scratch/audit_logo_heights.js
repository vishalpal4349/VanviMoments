const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html') && f !== 'index.html' && f !== 'vanvi-assistant.html' && f !== 'moment.html' && f !== 'preview.html' && f !== 'experience.html');

console.log('Auditing logo sizes across', files.length, 'pages:');

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  // Match logo images
  const matches = content.match(/<img[^>]+assets\/vanvi-moments-logo-header\.png[^>]*>/g) || [];
  if (matches.length === 0) {
    console.log(`⚠️ ${f}: No logo found`);
    return;
  }
  matches.forEach(m => {
    // Check if style attribute has height
    const styleMatch = m.match(/style=["']([^"']*)["']/);
    const classMatch = m.match(/class=["']([^"']*)["']/);
    let height = 'unset';
    if (styleMatch) {
      const h = styleMatch[1].match(/height:\s*([^;]+)/);
      if (h) height = h[1].trim();
    }
    // If not in inline style, check in CSS for class
    if (height === 'unset' && classMatch) {
      const cls = classMatch[1].trim().split(/\s+/)[0];
      const cssRegex = new RegExp(`\\.${cls}\\s*\\{[^}]*height:\\s*([^;}]+)`, 'i');
      const cssMatch = content.match(cssRegex);
      if (cssMatch) height = cssMatch[1].trim() + ' (from .' + cls + ')';
    }
    console.log(`${f}: height = ${height}`);
  });
});
