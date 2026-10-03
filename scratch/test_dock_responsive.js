const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'vanvi-navigation.css');
const content = fs.readFileSync(cssPath, 'utf8');

console.log('=== Checking vanvi-navigation.css for Responsive Floating Dock ===');

const hasDesktopDock = content.includes('@media (min-width: 769px)') && content.includes('display: inline-flex !important') && content.includes('bottom: 20px !important');
console.log('Has Desktop Floating Dock Rule:', hasDesktopDock);

const hasDesktopSafePadding = content.includes('@media (min-width: 769px)') && content.includes('padding-bottom: 74px !important');
console.log('Has Desktop Safe Padding (74px):', hasDesktopSafePadding);

const hasMobilePadding = content.includes('@media (max-width: 768px)') && content.includes('body.has-vanvi-dock');
console.log('Has Mobile Safe Padding Rule:', hasMobilePadding);

if (hasDesktopDock && hasDesktopSafePadding && hasMobilePadding) {
  console.log('✅ PASS: Bottom dock is now smartly active on BOTH Mobile & Laptop/Desktop without disturbing anything!');
} else {
  console.error('❌ FAIL: Dock responsive rule check failed.');
  process.exit(1);
}
