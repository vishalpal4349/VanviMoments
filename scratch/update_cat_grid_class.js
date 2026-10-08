const fs = require('fs');

const catPages = [
  'category-birthday.html',
  'category-anniversary.html',
  'category-love.html',
  'category-apology.html',
  'category-friendship.html',
  'category-celebration.html',
  'category-family.html',
  'category-memories.html',
  'category-free.html'
];

catPages.forEach(p => {
  let c = fs.readFileSync(p, 'utf8');
  if (c.includes('class="grid-luxury-catalog"')) {
    c = c.replace('class="grid-luxury-catalog"', 'class="grid-luxury-catalog vanvi-cards-grid"');
    fs.writeFileSync(p, c, 'utf8');
    console.log('Updated grid class in', p);
  }
});
