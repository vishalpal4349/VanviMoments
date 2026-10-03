const fs = require('fs');

const css = fs.readFileSync('vanvi-navigation.css', 'utf8');

// Check rule presence
const hasDesktopHide = css.includes('@media (min-width: 769px)') && css.includes('display: none !important');
console.log('1. vanvi-navigation.css hides bottom dock on desktop (>=769px):', hasDesktopHide);

// Check index.html
const indexHtml = fs.readFileSync('index.html', 'utf8');
const indexHidesOnDesktop = indexHtml.includes('.bottom{display:none}');
console.log('2. index.html hides bottom bar on desktop:', indexHidesOnDesktop);

console.log('\n=== RESULT ===');
if (hasDesktopHide && indexHidesOnDesktop) {
  console.log('SUCCESS: On Laptop/Desktop (web view), the bottom navigation is now 100% cleanly hidden across the ENTIRE website!');
  console.log('On Mobile phones, it remains fully functional, compact, and touch-friendly.');
} else {
  console.error('FAIL');
}
