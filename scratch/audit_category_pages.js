const fs = require('fs');

const categories = [
  'category-anniversary.html',
  'category-apology.html',
  'category-birthday.html',
  'category-celebration.html',
  'category-family.html',
  'category-free.html',
  'category-friendship.html',
  'category-love.html',
  'category-memories.html',
  'category-premium.html'
];

let totalButtons = 0;

categories.forEach(cat => {
  const content = fs.readFileSync(cat, 'utf8');
  const btnMatches = (content.match(/<button/gi) || []).length + (content.match(/class="[^"]*btn[^"]*"/gi) || []).length;
  const hasInnerLight = content.includes('vanvi-inner-light.css');
  const hasCardsCss = content.includes('css/vanvi-template-cards.css');
  const hasNav = content.includes('vanvi-navigation.css');
  totalButtons += btnMatches;
  console.log(`${cat} - Buttons: ${btnMatches} | InnerLight: ${hasInnerLight} | CardsCss: ${hasCardsCss} | Nav: ${hasNav}`);
});

console.log(`\nTotal Category Buttons: ${totalButtons}`);
