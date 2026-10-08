const fs = require('fs');
let html = fs.readFileSync('templates.html', 'utf8');
const target = '<div class="nav-pill-actions">';
const addition = `<div class="nav-pill-actions">
        <a href="javascript:void(0)" class="nav-link-item" onclick="return safeGoBack()">‹ Back</a>`;

if (html.includes(target) && !html.includes('safeGoBack')) {
  html = html.replace(target, addition);
  const scriptAddition = `\n<script>\nfunction safeGoBack() {\n  if (history.length > 1) { history.back(); return false; }\n  window.location.href = 'index.html';\n  return false;\n}\n</script>\n`;
  html = html.replace('</body>', scriptAddition + '</body>');
  fs.writeFileSync('templates.html', html, 'utf8');
  console.log('Successfully added safeGoBack to templates.html');
} else {
  console.log('Target not found or already has safeGoBack');
}
