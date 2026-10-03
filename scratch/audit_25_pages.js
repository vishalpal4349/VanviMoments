const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const batches = {
  batchA: ['index.html', 'templates.html', 'builder.html', 'share.html', 'plans.html'],
  batchB: ['category-premium.html', 'category-birthday.html', 'category-love.html', 'category-anniversary.html', 'category-free.html'],
  batchC: ['games.html', 'hidden-hearts.html', 'heart-rain.html', 'love-puzzle.html', 'quick-tap.html'],
  batchD: ['login.html', 'signup.html', 'forgot-password.html', 'profile.html', 'dashboard.html'],
  batchE: ['rewards.html', 'products.html', 'coming-soon.html', 'contact.html', 'faq.html']
};

console.log('=== VANVI MOMENTS 25-PAGE AUDIT & POLISH CHECK ===\n');

Object.keys(batches).forEach(batchName => {
  console.log(`--- Checking ${batchName.toUpperCase()} ---`);
  batches[batchName].forEach(file => {
    const fullPath = path.join(root, file);
    if (!fs.existsSync(fullPath)) {
      console.error(`❌ Missing file: ${file}`);
      return;
    }
    const html = fs.readFileSync(fullPath, 'utf8');
    const hasNavCss = html.includes('vanvi-navigation.css');
    const hasNavJs = html.includes('vanvi-navigation.js');
    const hasViewport = html.includes('viewport');
    const hasTitle = html.includes('<title>');
    
    console.log(`✓ ${file}: Viewport: ${hasViewport} | Title: ${hasTitle} | NavCSS: ${hasNavCss} | NavJS: ${hasNavJs}`);
  });
  console.log('');
});
