const fs = require('fs');
const assert = require('assert');

const html = fs.readFileSync('index.html', 'utf8');

console.log('--- Checking Birthday Shortcut Button ---');
assert.ok(html.includes('Create Birthday →'), 'Birthday CTA exists');
const bdayIdx = html.indexOf('Create Birthday →');
const bdaySnippet = html.slice(bdayIdx - 700, bdayIdx + 200);
assert.ok(bdaySnippet.includes('justify-content: space-between') || bdaySnippet.includes('justify-content:space-between'), 'Birthday container has space-between');
console.log('✅ Birthday shortcut button aligned on right side.');

console.log('--- Checking Physical Gift Section Button ---');
assert.ok(html.includes('Explore Gift Store →'), 'Physical gift button exists');
const giftIdx = html.indexOf('Explore Gift Store →');
const giftSnippet = html.slice(giftIdx - 800, giftIdx + 150);
assert.ok(giftSnippet.includes('justify-content: space-between') || giftSnippet.includes('justify-content:space-between'), 'Physical gift container has space-between');
console.log('✅ Physical gift section button aligned on right side.');

console.log('--- Checking AI Matcher Button ---');
assert.ok(html.includes('Try Panda AI Matcher 🐾'), 'Panda AI button exists');
const aiIdx = html.indexOf('Try Panda AI Matcher 🐾');
const aiSnippet = html.slice(aiIdx - 400, aiIdx + 200);
assert.ok(aiSnippet.includes('margin-left: auto') || aiSnippet.includes('justify-content: space-between'), 'AI matcher button right aligned');
console.log('✅ AI matcher button aligned on right side.');

console.log('--- Checking Drawer Wallet Removal ---');
assert.ok(!html.includes('<div class="drawer-wallet-card"'), 'drawer-wallet-card element removed');
assert.ok(!html.includes('✨ Vanvi Wallet</span>'), 'Vanvi Wallet text removed from drawer');
console.log('✅ Vanvi Wallet removed from hamburger drawer.');

console.log('--- Checking Drawer Duplication ---');
const drawerMatch = html.match(/<nav class="drawer-nav"[\s\S]*?<\/nav>/);
assert.ok(drawerMatch, 'drawer-nav found');
const drawerContent = drawerMatch[0];
const templateCount = (drawerContent.match(/href="templates\.html"/g) || []).length;
const matcherCount = (drawerContent.match(/href="ai-matcher\.html"/g) || []).length;
const dashCount = (drawerContent.match(/href="dashboard\.html"/g) || []).length;
assert.strictEqual(templateCount, 1, 'Only 1 templates.html in drawer');
assert.strictEqual(matcherCount, 1, 'Only 1 ai-matcher.html in drawer');
assert.strictEqual(dashCount, 1, 'Only 1 dashboard.html in drawer');
console.log('✅ Drawer navigation deduplicated.');

console.log('--- Checking Button Sizing & Colors ---');
assert.ok(html.includes('padding: 9.5px 20px !important'), '.primary padding reduced');
assert.ok(html.includes('padding: 8.5px 18px !important'), '.secondary padding reduced');
assert.ok(html.includes('linear-gradient(135deg, #fff0f6 0%'), '.secondary has colorful pastel gradient');
console.log('✅ Button sizing made compact and secondary buttons made colorful.');

console.log('--- Checking Reviews Section ---');
assert.ok(html.includes('Community Reviews'), 'Reviews header updated');
assert.ok(html.includes('★★★★★'), '5-star rating present');
assert.ok(html.includes('✓ Verified'), 'Verified reviewer badges present');
assert.ok(html.includes('rgba(255, 240, 246, 0.96)'), 'Pastel card 1 present');
assert.ok(html.includes('rgba(245, 240, 255, 0.96)'), 'Pastel card 2 present');
console.log('✅ Reviews section upgraded to colorful luxury pastel cards.');

console.log('--- Checking Footer Link Deduplication ---');
const footerMatch = html.match(/<footer[\s\S]*?<\/footer>/);
assert.ok(footerMatch, 'Footer found');
const footerContent = footerMatch[0];
const refundMatches = footerContent.match(/href="refund\.html"/g) || [];
assert.strictEqual(refundMatches.length, 1, 'refund.html only appears once in footer');
console.log('✅ Footer duplicate refund links resolved.');

console.log('\n🌟 ALL USER REQUIREMENTS VERIFIED 100% SUCCEEDED!');
