const fs = require('fs');

const files = [
  'about.html',
  'ai-matcher.html',
  'ai.html',
  'builder.html',
  'category-anniversary.html',
  'category-apology.html',
  'category-birthday.html',
  'category-celebration.html',
  'category-family.html',
  'category-free.html',
  'category-friendship.html',
  'category-love.html',
  'category-memories.html',
  'category-premium.html',
  'checkout.html',
  'coming-soon.html',
  'contact.html',
  'custom-experience.html',
  'dashboard.html',
  'faq.html',
  'forgot-password.html',
  'games.html',
  'index.html',
  'order-success.html',
  'plans.html',
  'privacy.html',
  'products.html',
  'profile.html',
  'refund.html',
  'rewards.html',
  'templates.html',
  'terms.html',
  'admin.html'
];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  console.log(`=== ${f} ===`);
  const regex = /<a[^>]*?(?:brand|logo)[^>]*?>[\s\S]*?<\/a>/gi;
  let match;
  while ((match = regex.exec(content)) !== null) {
    console.log(match[0].slice(0, 120).replace(/\r?\n\s*/g, ' ') + '...');
  }
});
