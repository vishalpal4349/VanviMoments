const fs = require('fs');
const path = require('path');

const targetPages = [
  'index.html',
  'products.html',
  'templates.html',
  'wedding.html',
  'builder.html',
  'checkout.html',
  'order-success.html',
  'login.html',
  'signup.html',
  'profile.html',
  'dashboard.html',
  'rewards.html',
  'refer.html',
  'admin.html'
];

const results = {
  missingLocalAssets: [],
  overflowCheck: [],
  consoleLogs: {}
};

targetPages.forEach(file => {
  if (!fs.existsSync(file)) return;
  const content = fs.readFileSync(file, 'utf8');

  // Find src and href to local assets
  const assetRegex = /(?:src|href)=['"]([^'"]+)['"]/g;
  let match;
  while ((match = assetRegex.exec(content)) !== null) {
    let asset = match[1];
    if (asset.startsWith('http://') || asset.startsWith('https://') || asset.startsWith('#') || asset.startsWith('javascript:') || asset.startsWith('data:') || asset.startsWith('tel:') || asset.startsWith('mailto:')) {
      continue;
    }
    // Clean query/hash
    asset = asset.split('?')[0].split('#')[0];
    if (!asset) continue;

    const fullPath = path.resolve(asset);
    if (!fs.existsSync(fullPath)) {
      results.missingLocalAssets.push({ file, asset });
    }
  }

  // Check if page has overflow-x hidden in inline or body style
  const hasOverflow = content.includes('overflow-x: hidden') || content.includes('overflow-x:hidden');
  if (!hasOverflow) {
    results.overflowCheck.push(file);
  }

  // Check console.log count
  const cMatches = content.match(/console\.log\(/g) || [];
  if (cMatches.length > 0) {
    results.consoleLogs[file] = cMatches.length;
  }
});

console.log('--- MISSING LOCAL ASSETS ---');
console.log(JSON.stringify(results.missingLocalAssets, null, 2));
console.log('--- PAGES MISSING INLINE OVERFLOW-X: HIDDEN ---');
console.log(results.overflowCheck);
console.log('--- INLINE CONSOLE.LOGS ---');
console.log(results.consoleLogs);
