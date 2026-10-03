const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf8');

// 1. Find all buttons in index.html
const btnMatches = indexHtml.match(/<button[^>]*>[\s\S]*?<\/button>/gi) || [];
console.log('Total button tags in index.html:', btnMatches.length);

btnMatches.forEach((btn, idx) => {
  const opening = btn.match(/<button[^>]*>/i)[0];
  const text = btn.replace(/<[^>]*>/g, '').trim().replace(/\s+/g, ' ').slice(0, 40);
  const hasId = /id=["']([^"']+)["']/i.test(opening);
  const hasOnclick = /onclick=["']([^"']+)["']/i.test(opening);
  const hasClass = /class=["']([^"']+)["']/i.test(opening);
  const cls = hasClass ? opening.match(/class=["']([^"']+)["']/i)[1] : '';
  const id = hasId ? opening.match(/id=["']([^"']+)["']/i)[1] : '';
  
  // Check if handled in script
  let isHandledInScript = false;
  if (id && indexHtml.includes(id)) isHandledInScript = true;
  if (cls && (indexHtml.includes(`.${cls}`) || indexHtml.includes(cls))) isHandledInScript = true;
  
  if (!hasId && !hasOnclick && !isHandledInScript) {
    console.log(`[UNHANDLED BUTTON] #${idx}: "${text}" -> ${opening}`);
  }
});

// 2. Check cards in index.html that look clickable but are div
const cards = [
  'make-card',
  'grid3 .quick',
  'quick-row .quick'
];
console.log('\nChecking interactive divs in index.html:');
const makeCards = indexHtml.match(/<div class="make-card[^>]*>[\s\S]*?<\/div>/gi) || [];
console.log('Found make-cards:', makeCards.length);
const playCards = indexHtml.match(/<div class="quick">[\s\S]*?<\/div>/gi) || [];
console.log('Found quick play cards:', playCards.length);

