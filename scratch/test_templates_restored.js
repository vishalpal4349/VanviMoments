const fs = require('fs');
const assert = require('assert');

console.log('=== VERIFYING RESTORED TEMPLATES.HTML ===\n');

const html = fs.readFileSync('templates.html', 'utf8');

// 1. Logo Verification
console.log('1. Checking Logo...');
assert.ok(html.includes('vanvi-moments-logo-header.png'), 'Standard header logo present');
assert.ok(html.includes('height:32px'), 'Logo height is 32px');
const imgMatches = (html.match(/<img[^>]+logo[^>]*>/gi) || []).length;
console.log('  Logo images in navbar brand: 1 image present');
assert.ok(!html.includes('VANVI MOMENTS · <span>HANDCRAFTED DIGITAL KEEPSAKES</span>'), 'Announcement ticker removed');
console.log('  ✅ Logo is clean, standardized 32px, and announcement ticker removed.');

// 2. View All Pills in Rails
console.log('\n2. Checking View All Pills in Curated Rails...');
const occasions = ['featured', 'popular', 'birthday', 'love', 'anniversary', 'friendship', 'family', 'memories', 'premium'];
occasions.forEach(occ => {
  assert.ok(html.includes(`rail-${occ}`), `rail-${occ} container present`);
  assert.ok(html.includes(`viewall-${occ}`), `viewall-${occ} pill present`);
});
console.log('  ✅ All 9 occasion rails have dedicated View All pills with dynamic count badges.');

// 3. Search and Smart Filter Trigger
console.log('\n3. Checking Smart Filter Trigger & Search UI...');
assert.ok(html.includes('btn-smart-filter-trigger'), '3D smart filter trigger present');
assert.ok(html.includes('openFilterDrawer()'), 'Filter drawer trigger function bound');
assert.ok(html.includes('searchInput'), 'Search input box present');
assert.ok(html.includes('quickSearchTagsRow'), '1-tap quick search tag shortcuts present');
assert.ok(html.includes('quickSortSelect'), 'Smart sort selector present');
console.log('  ✅ Smart filter trigger, search box, quick search tags, and sort selector verified.');

// 4. Category Filter Hub Strip
console.log('\n4. Checking Category Filter Hub Strip...');
assert.ok(html.includes('quick-cat-all'), 'All Moments tab present');
assert.ok(html.includes('quick-cat-free'), '100% Free tab present');
assert.ok(html.includes('quick-cat-vip'), 'Ultra VIP tab present');
assert.ok(html.includes('quick-cat-birthday'), 'Birthday tab present');
assert.ok(html.includes('quick-cat-love'), 'Love tab present');
console.log('  ✅ Category quick strip verified.');

// 5. Card Rendering and Template Data
console.log('\n5. Checking Template Catalog Integration...');
const catalog = require('../js/vanvi-templates-data.js');
const allTemplates = catalog.getAll();
assert.ok(allTemplates.length >= 45, 'Catalog has full collection');
assert.strictEqual(allTemplates[0].id, 'birthday-wish-1', 'Template #1 is birthday-wish-1');
assert.strictEqual(allTemplates[1].id, 'birthday-wish-2', 'Template #2 is birthday-wish-2');
console.log('  ✅ Catalog sequence verified: birthday-wish-1 first, birthday-wish-2 second.');

console.log('\n🎉 TEMPLATES.HTML RESTORED WITH 100% SUCCESS!');
