const fs = require('fs');
const path = require('path');

// 1. Process refund.html
let refund = fs.readFileSync('refund.html', 'utf8');
refund = refund.replace(/<div class="brand-link" title="Vanvi Moments">([\s\S]*?)<\/div>(\s*<div class="header-actions">)/, '<a href="index.html" class="brand-link" title="Vanvi Moments">$1</a>$2');
refund = refund.replace('<a class="btn-header-link" href="terms.html">', '<a class="btn-header-link mobile-hide" href="terms.html">');
refund = refund.replace('<a class="btn-header-link" href="faq.html">', '<a class="btn-header-link mobile-hide" href="faq.html">');
refund = refund.replace('<a class="btn-header-link" href="contact.html">', '<a class="btn-header-link mobile-hide" href="contact.html">');
fs.writeFileSync('refund.html', refund, 'utf8');
console.log('Updated refund.html');

// 2. Process faq.html
let faq = fs.readFileSync('faq.html', 'utf8');
faq = faq.replace(/cursor:\s*default\s*!important;\s*pointer-events:\s*none\s*!important;\s*user-select:\s*none\s*!important;/, 'cursor: pointer !important;\n  pointer-events: auto !important;');
faq = faq.replace(/<div class="brand-link" title="Vanvi Moments">([\s\S]*?)<\/div>(\s*<div class="header-actions">)/, '<a href="index.html" class="brand-link" title="Vanvi Moments">$1</a>$2');
faq = faq.replace('<a class="btn-header-link" href="contact.html">', '<a class="btn-header-link mobile-hide" href="contact.html">');
faq = faq.replace('<a class="btn-header-link" href="templates.html">', '<a class="btn-header-link mobile-hide" href="templates.html">');
fs.writeFileSync('faq.html', faq, 'utf8');
console.log('Updated faq.html');

// 3. Process share.html
let share = fs.readFileSync('share.html', 'utf8');
share = share.replace(/cursor:\s*default\s*!important;\s*pointer-events:\s*none\s*!important;\s*user-select:\s*none\s*!important;/, 'cursor: pointer !important;\n  pointer-events: auto !important;');
share = share.replace(/<div class="brand-link" title="Vanvi Moments">([\s\S]*?)<\/div>(\s*<div class="header-actions">)/, '<a href="index.html" class="brand-link" title="Vanvi Moments">$1</a>$2');
share = share.replace('<a href="templates.html" class="btn-header-link">', '<a href="templates.html" class="btn-header-link mobile-hide">');
share = share.replace('<a href="dashboard.html" class="btn-header-link">', '<a href="dashboard.html" class="btn-header-link mobile-hide">');
fs.writeFileSync('share.html', share, 'utf8');
console.log('Updated share.html');

// 4. Process checkout.html
let checkout = fs.readFileSync('checkout.html', 'utf8');
checkout = checkout.replace(/pointer-events:\s*none\s*!important;\s*cursor:\s*default\s*!important;/, 'cursor: pointer !important;\n  pointer-events: auto !important;');
checkout = checkout.replace(/<div class="brand-link" title="Vanvi Moments">([\s\S]*?)<\/div>(\s*<div style="display:flex;)/, '<a href="index.html" class="brand-link" title="Vanvi Moments">$1</a>$2');
checkout = checkout.replace('class="btn-header-back btn-header-secondary"', 'class="btn-header-back btn-header-secondary mobile-hide"');
fs.writeFileSync('checkout.html', checkout, 'utf8');
console.log('Updated checkout.html');

// 5. Process ai.html
let ai = fs.readFileSync('ai.html', 'utf8');
ai = ai.replace(/pointer-events:\s*none\s*!important;\s*cursor:\s*default\s*!important;/, 'cursor: pointer !important;\n      pointer-events: auto !important;');
ai = ai.replace(/<div class="header-brand" style="pointer-events:\s*none\s*!important;\s*cursor:\s*default\s*!important;" title="Vanvi Moments">([\s\S]*?)<\/div>(\s*<div class="header-actions">)/, '<a href="index.html" class="header-brand" title="Vanvi Moments">$1</a>$2');
ai = ai.replace('class="btn-header-link btn-moments-link"', 'class="btn-header-link btn-moments-link mobile-hide"');
fs.writeFileSync('ai.html', ai, 'utf8');
console.log('Updated ai.html');

// 6. Process custom-experience.html
let customExp = fs.readFileSync('custom-experience.html', 'utf8');
customExp = customExp.replace('<div class="brand">VANVI <span style="color:var(--rose);">♡</span> MOMENTS</div>', '<a href="index.html" class="brand">VANVI <span style="color:var(--rose);">♡</span> MOMENTS</a>');
fs.writeFileSync('custom-experience.html', customExp, 'utf8');
console.log('Updated custom-experience.html');

// 7. Process products.html
let products = fs.readFileSync('products.html', 'utf8');
products = products.replace(/<div class="brand-link" title="Vanvi Moments">([\s\S]*?)<\/div>(\s*<div class="header-actions">)/, '<a href="index.html" class="brand-link" title="Vanvi Moments">$1</a>$2');
products = products.replace('<a href="templates.html" class="btn-header-link"', '<a href="templates.html" class="btn-header-link mobile-hide"');
products = products.replace('<a href="dashboard.html" class="btn-header-link"', '<a href="dashboard.html" class="btn-header-link mobile-hide"');
fs.writeFileSync('products.html', products, 'utf8');
console.log('Updated products.html');

// 8. Process index.html - only make brand logo smoothly scroll to top on tap, do not alter layout
let idx = fs.readFileSync('index.html', 'utf8');
idx = idx.replace('style="text-decoration:none; color:inherit; cursor:default; user-select:none; pointer-events:none;"', 'style="text-decoration:none; color:inherit; cursor:pointer; user-select:none; pointer-events:auto;"');
fs.writeFileSync('index.html', idx, 'utf8');
console.log('Updated index.html brand cursor');

// 9. Process category-*.html files (10 files)
const catFiles = fs.readdirSync('.').filter(f => f.startsWith('category-') && f.endsWith('.html'));
catFiles.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/<div class="brand-link">([\s\S]*?)<\/div>(\s*<div class="header-actions">)/, '<a href="index.html" class="brand-link" title="Vanvi Moments">$1</a>$2');
  content = content.replace('<a href="templates.html" class="btn-header-link"', '<a href="templates.html" class="btn-header-link mobile-hide"');
  content = content.replace('<a href="dashboard.html" class="btn-header-link"', '<a href="dashboard.html" class="btn-header-link mobile-hide"');
  fs.writeFileSync(f, content, 'utf8');
  console.log('Updated ' + f);
});

// 10. Process info pages: about.html, privacy.html, terms.html, contact.html, coming-soon.html, 404.html, profile.html
const infoPages = ['about.html', 'privacy.html', 'terms.html', 'contact.html', 'coming-soon.html', '404.html', 'profile.html'];
infoPages.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/<div class="header-brand" title="Vanvi Moments" style="cursor:\s*default;">([\s\S]*?)<\/div>(\s*(?:<div class="header-actions">|<\/header>))/i, '<a href="index.html" class="header-brand" title="Vanvi Moments">$1</a>$2');
  content = content.replace(/<div class="header-brand" title="Vanvi Moments">([\s\S]*?)<\/div>(\s*(?:<div class="header-actions">|<\/header>))/i, '<a href="index.html" class="header-brand" title="Vanvi Moments">$1</a>$2');
  fs.writeFileSync(f, content, 'utf8');
  console.log('Updated ' + f);
});

// 11. Process games: games.html, gem-catch.html, love-puzzle.html, memory-rush.html, quick-tap.html, unlock-gift.html
const gamePages = ['games.html', 'gem-catch.html', 'love-puzzle.html', 'memory-rush.html', 'quick-tap.html', 'unlock-gift.html'];
gamePages.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/<div class="brand-link">([\s\S]*?)<\/div>/, '<a href="index.html" class="brand-link" title="Vanvi Moments">$1</a>');
  content = content.replace(/<div class="brand-link" title="Vanvi Moments">([\s\S]*?)<\/div>/, '<a href="index.html" class="brand-link" title="Vanvi Moments">$1</a>');
  fs.writeFileSync(f, content, 'utf8');
  console.log('Updated ' + f);
});

// 12. Process legacy games: hidden-hearts.html, memory-sequence.html, risk-run.html
const legacyGames = ['hidden-hearts.html', 'memory-sequence.html', 'risk-run.html'];
legacyGames.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  // Update viewport
  content = content.replace(
    /<meta name="viewport" content="[^"]*user-scalable=no[^"]*">/i,
    '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">'
  );
  // Add vanvi-navigation.css if not present
  if (!content.includes('vanvi-navigation.css')) {
    content = content.replace('</head>', '  <link rel="stylesheet" href="vanvi-navigation.css">\n</head>');
  }
  // Add data-vanvi-no-dock="true" to body
  content = content.replace(/<body([^>]*)>/i, (match, p1) => {
    if (p1.includes('data-vanvi-no-dock')) return match;
    return `<body${p1} data-vanvi-no-dock="true">`;
  });
  // Add vanvi-api.js and vanvi-navigation.js if not present
  if (!content.includes('vanvi-navigation.js')) {
    content = content.replace('</body>', '  <script src="js/vanvi-api.js"></script>\n  <script src="js/vanvi-navigation.js"></script>\n</body>');
  }
  fs.writeFileSync(f, content, 'utf8');
  console.log('Updated ' + f);
});

// 13. Process remaining pages: plans.html, templates.html, builder.html, ai-matcher.html, order-success.html
const remaining = ['plans.html', 'templates.html', 'builder.html', 'ai-matcher.html', 'order-success.html'];
remaining.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/<div class="brand-link" title="Vanvi Moments">([\s\S]*?)<\/div>(\s*<div class="header-actions">)/, '<a href="index.html" class="brand-link" title="Vanvi Moments">$1</a>$2');
  fs.writeFileSync(f, content, 'utf8');
  console.log('Updated ' + f);
});

console.log('\nAll pages updated successfully!');
