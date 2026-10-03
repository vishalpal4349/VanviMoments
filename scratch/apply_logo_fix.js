const fs = require('fs');

const plan = [
  {
    file: 'about.html',
    from: /<a class="brand-link" href="index\.html" title="Vanvi Moments Home">([\s\S]*?)<\/a>/,
    to: '<div class="brand-link" title="Vanvi Moments">$1</div>'
  },
  {
    file: 'ai-matcher.html',
    from: /<a class="brand-link" href="index\.html" title="Vanvi Moments Home">([\s\S]*?)<\/a>/,
    to: '<div class="brand-link" title="Vanvi Moments">$1</div>'
  },
  {
    file: 'ai.html',
    from: /<a href="index\.html" class="ai-brand-logo" title="Vanvi Moments Home">([\s\S]*?)<\/a>/,
    to: '<div class="ai-brand-logo" title="Vanvi Moments">$1</div>'
  },
  {
    file: 'builder.html',
    from: /<a href="index\.html" class="brand-link" title="Vanvi Moments Home">([\s\S]*?)<\/a>/,
    to: '<div class="brand-link" title="Vanvi Moments">$1</div>'
  },
  {
    file: 'category-anniversary.html',
    from: /<a class="brand-link" href="index\.html">([\s\S]*?)<\/a>/,
    to: '<div class="brand-link">$1</div>'
  },
  {
    file: 'category-apology.html',
    from: /<a class="brand-link" href="index\.html">([\s\S]*?)<\/a>/,
    to: '<div class="brand-link">$1</div>'
  },
  {
    file: 'category-birthday.html',
    from: /<a class="brand-link" href="index\.html">([\s\S]*?)<\/a>/,
    to: '<div class="brand-link">$1</div>'
  },
  {
    file: 'category-celebration.html',
    from: /<a class="brand-link" href="index\.html">([\s\S]*?)<\/a>/,
    to: '<div class="brand-link">$1</div>'
  },
  {
    file: 'category-family.html',
    from: /<a class="brand-link" href="index\.html">([\s\S]*?)<\/a>/,
    to: '<div class="brand-link">$1</div>'
  },
  {
    file: 'category-free.html',
    from: /<a class="brand-link" href="index\.html">([\s\S]*?)<\/a>/,
    to: '<div class="brand-link">$1</div>'
  },
  {
    file: 'category-friendship.html',
    from: /<a class="brand-link" href="index\.html">([\s\S]*?)<\/a>/,
    to: '<div class="brand-link">$1</div>'
  },
  {
    file: 'category-love.html',
    from: /<a class="brand-link" href="index\.html">([\s\S]*?)<\/a>/,
    to: '<div class="brand-link">$1</div>'
  },
  {
    file: 'category-memories.html',
    from: /<a class="brand-link" href="index\.html">([\s\S]*?)<\/a>/,
    to: '<div class="brand-link">$1</div>'
  },
  {
    file: 'category-premium.html',
    from: /<a class="brand-link" href="index\.html">([\s\S]*?)<\/a>/,
    to: '<div class="brand-link">$1</div>'
  },
  {
    file: 'checkout.html',
    from: /<a href="index\.html" class="brand-link" title="Vanvi Moments Home">([\s\S]*?)<\/a>/,
    to: '<div class="brand-link" title="Vanvi Moments">$1</div>'
  },
  {
    file: 'coming-soon.html',
    from: /<a href="index\.html" class="brand-title">([\s\S]*?)<\/a>/,
    to: '<span class="brand-title">$1</span>'
  },
  {
    file: 'contact.html',
    from: /<a class="brand-link" href="index\.html" title="Vanvi Moments Home">([\s\S]*?)<\/a>/,
    to: '<div class="brand-link" title="Vanvi Moments">$1</div>'
  },
  {
    file: 'custom-experience.html',
    from: /<a class="brand" href="index\.html">([\s\S]*?)<\/a>/,
    to: '<div class="brand">$1</div>'
  },
  {
    file: 'dashboard.html',
    from: /<a href="index\.html" class="brand-link" title="Vanvi Moments Home">([\s\S]*?)<\/a>/,
    to: '<div class="brand-link" title="Vanvi Moments">$1</div>'
  },
  {
    file: 'faq.html',
    from: /<a class="brand-link" href="index\.html" title="Vanvi Moments Home">([\s\S]*?)<\/a>/,
    to: '<div class="brand-link" title="Vanvi Moments">$1</div>'
  },
  {
    file: 'forgot-password.html',
    from: /<a class="auth-brand" href="index\.html">([\s\S]*?)<\/a>/,
    to: '<div class="auth-brand">$1</div>'
  },
  {
    file: 'games.html',
    from: /<a href="index\.html" class="brand-link">([\s\S]*?)<\/a>/,
    to: '<div class="brand-link">$1</div>'
  },
  {
    file: 'index.html',
    from: /<a href="index\.html" class="brand" style="text-decoration:none; color:inherit;">([\s\S]*?)<\/a>/,
    to: '<div class="brand" style="text-decoration:none; color:inherit; cursor:default; user-select:none; pointer-events:none;">$1</div>'
  },
  {
    file: 'order-success.html',
    from: /<a class="brand-link" href="index\.html" title="Vanvi Moments Home">([\s\S]*?)<\/a>/,
    to: '<div class="brand-link" title="Vanvi Moments">$1</div>'
  },
  {
    file: 'plans.html',
    from: /<a class="brand-link" href="index\.html">([\s\S]*?)<\/a>/,
    to: '<div class="brand-link">$1</div>'
  },
  {
    file: 'privacy.html',
    from: /<a class="brand-link" href="index\.html" title="Vanvi Moments Home">([\s\S]*?)<\/a>/,
    to: '<div class="brand-link" title="Vanvi Moments">$1</div>'
  },
  {
    file: 'products.html',
    from: /<a class="brand-link" href="index\.html" title="Vanvi Moments Home">([\s\S]*?)<\/a>/,
    to: '<div class="brand-link" title="Vanvi Moments">$1</div>'
  },
  {
    file: 'profile.html',
    from: /<a href="index\.html" class="brand-link">([\s\S]*?)<\/a>/,
    to: '<div class="brand-link">$1</div>'
  },
  {
    file: 'refund.html',
    from: /<a class="brand-link" href="index\.html" title="Vanvi Moments Home">([\s\S]*?)<\/a>/,
    to: '<div class="brand-link" title="Vanvi Moments">$1</div>'
  },
  {
    file: 'rewards.html',
    from: /<a href="index\.html" class="brand-title">([\s\S]*?)<\/a>/,
    to: '<span class="brand-title">$1</span>'
  },
  {
    file: 'templates.html',
    from: /<a class="brand-link" href="index\.html" title="Vanvi Moments Home">([\s\S]*?)<\/a>/,
    to: '<div class="brand-link" title="Vanvi Moments">$1</div>'
  },
  {
    file: 'terms.html',
    from: /<a class="brand-link" href="index\.html" title="Vanvi Moments Home">([\s\S]*?)<\/a>/,
    to: '<div class="brand-link" title="Vanvi Moments">$1</div>'
  },
  {
    file: 'admin.html',
    from: /<a href="index\.html" style="text-decoration:none; color:inherit;">\s*<span class="brand-title">([\s\S]*?)<\/span>\s*<\/a>/,
    to: '<span class="brand-title">$1</span>'
  }
];

let successCount = 0;

plan.forEach(item => {
  const content = fs.readFileSync(item.file, 'utf8');
  if (!item.from.test(content)) {
    console.error(`FAIL: Pattern not found in ${item.file}`);
    return;
  }
  const updated = content.replace(item.from, item.to);
  fs.writeFileSync(item.file, updated, 'utf8');
  console.log(`UPDATED: ${item.file}`);
  successCount++;
});

console.log(`\nCompleted ${successCount} of ${plan.length} files.`);
