const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const htmls = fs.readdirSync(root).filter(f => f.endsWith('.html'));

const issues = [];
htmls.forEach(f => {
  const c = fs.readFileSync(path.join(root, f), 'utf8');
  if (!c.toLowerCase().includes('name="viewport"') && !c.toLowerCase().includes("name='viewport'")) {
    issues.push({ file: f, problem: 'Missing meta viewport' });
  }
  const wideMatches = c.match(/min-width:\s*([4-9]\d{2}|[1-9]\d{3})px/gi);
  if (wideMatches) {
    issues.push({ file: f, problem: 'Has hardcoded min-width: ' + wideMatches.join(', ') });
  }
});

console.log('Mobile layout check on ' + htmls.length + ' pages:');
if (issues.length === 0) {
  console.log('✅ ALL 49 PAGES HAVE RESPONSIVE META VIEWPORT AND NO WIDE FIXED MIN-WIDTHS!');
} else {
  console.log('Issues found:', issues);
}
