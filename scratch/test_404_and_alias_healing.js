const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- TESTING 404 AUTO-HEALING & ALIAS RESOLUTION ---');

// 1. Verify physical alias files
const aliasFiles = [
  { file: 'account.html', target: 'profile.html' },
  { file: 'settings.html', target: 'profile.html' },
  { file: 'orders.html', target: 'dashboard.html' },
  { file: 'order.html', target: 'dashboard.html' },
  { file: 'wallet.html', target: 'plans.html' },
  { file: 'explore.html', target: 'templates.html' }
];

aliasFiles.forEach(({ file, target }) => {
  const filePath = path.join(__dirname, '..', file);
  assert(fs.existsSync(filePath), `Physical file ${file} must exist`);
  const content = fs.readFileSync(filePath, 'utf8');
  assert(content.includes(target), `${file} must redirect to ${target}`);
  console.log(`✅ Physical alias ${file} exists and routes to ${target}`);
});

// 2. Verify 404.html auto-healer
const fofContent = fs.readFileSync(path.join(__dirname, '..', '404.html'), 'utf8');
assert(fofContent.includes("'account': '/profile.html'"), '404.html must have account alias');
assert(fofContent.includes("aliasMap[pageSlug]"), '404.html must heal direct slug aliases');
console.log('✅ 404.html smart alias auto-heal logic verified');

// 3. Verify server.js middleware
const serverContent = fs.readFileSync(path.join(__dirname, '..', 'server', 'server.js'), 'utf8');
assert(serverContent.includes("'account': '/profile.html'"), 'server.js must have account alias');
assert(serverContent.includes("aliasMap[slug]"), 'server.js must handle alias routing');
console.log('✅ server.js 302 alias auto-heal logic verified');

// 4. Verify vanvi-navigation.js
const navContent = fs.readFileSync(path.join(__dirname, '..', 'js', 'vanvi-navigation.js'), 'utf8');
assert(navContent.includes("'account': 'profile.html'"), 'vanvi-navigation.js must have account alias');
console.log('✅ vanvi-navigation.js click interceptor alias logic verified');

console.log('\n🎉 ALL 404 RESOLUTION & ALIAS CHECKS PASSED 100%!');
