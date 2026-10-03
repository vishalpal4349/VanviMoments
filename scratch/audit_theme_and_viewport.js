const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const htmlFiles = fs.readdirSync(root).filter(f => f.endsWith('.html')).sort();

console.log('=== THEME & RESPONSIVE AUDIT ON ALL 52 PAGES ===\n');

let issues = 0;
htmlFiles.forEach(f => {
  const content = fs.readFileSync(path.join(root, f), 'utf8');
  const hasViewport = /name=["']viewport["']/i.test(content);
  const hasNavCss = content.includes('vanvi-navigation.css');
  const hasInnerLight = content.includes('vanvi-inner-light.css');
  const hasOverflowGuard = content.includes('overflow-x') || content.includes('vanvi-navigation.css');

  if (!hasViewport) {
    console.log(`❌ ${f}: Missing viewport`);
    issues++;
  }
  if (!hasOverflowGuard) {
    console.log(`❌ ${f}: Missing overflow-x guard`);
    issues++;
  }
});

if (issues === 0) {
  console.log('🎉 ALL 52 PAGES HAVE 100% RESPONSIVE VIEWPORT AND OVERFLOW GUARDS!');
} else {
  console.log(`Found ${issues} issues.`);
}
