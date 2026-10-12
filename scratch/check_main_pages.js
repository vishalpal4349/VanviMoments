const fs = require('fs');
const path = require('path');

const pages = ['index.html', 'products.html', 'checkout.html', 'order-success.html', 'login.html', 'signup.html'];
let issues = [];

pages.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  // Check scripts
  const scriptRegex = /<script[^>]+src=["']([^"']+)["']/gi;
  let match;
  while ((match = scriptRegex.exec(content)) !== null) {
    const src = match[1];
    if (!src.startsWith('http') && !src.startsWith('//') && !src.startsWith('data:')) {
      const cleanPath = src.split('?')[0].split('#')[0];
      if (!fs.existsSync(cleanPath)) {
        issues.push({ file, type: 'missing_script', asset: src });
      }
    }
  }

  // Check stylesheets
  const linkRegex = /<link[^>]+href=["']([^"']+\.css)(\?[^"']*)?["']/gi;
  while ((match = linkRegex.exec(content)) !== null) {
    const href = match[1];
    if (!href.startsWith('http') && !href.startsWith('//')) {
      const cleanPath = href.split('?')[0].split('#')[0];
      if (!fs.existsSync(cleanPath)) {
        issues.push({ file, type: 'missing_stylesheet', asset: href });
      }
    }
  }

  // Check viewport
  if (!content.includes('viewport')) {
    issues.push({ file, type: 'missing_viewport' });
  }

  // Check overflow-x protection in inline or linked styles
  const hasOverflowProtection = content.includes('overflow-x') || content.includes('vanvi-navigation.css') || content.includes('style.css');
  if (!hasOverflowProtection) {
    issues.push({ file, type: 'potential_overflow_risk' });
  }
});

console.log('Total issues found:', issues.length);
if (issues.length > 0) {
  console.log(JSON.stringify(issues, null, 2));
} else {
  console.log('✅ ALL SCRIPTS & STYLESHEETS VERIFIED FOR ALL 6 MAIN PAGES.');
}
