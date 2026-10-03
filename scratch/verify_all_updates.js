const fs = require('fs');
const assert = require('assert');

console.log('🧪 Verifying all UI & Templates Page updates...\n');

// 1. Templates Page
const tpl = fs.readFileSync('templates.html', 'utf8');
assert(!tpl.includes('class="top-announcement-bar"'), 'Top announcement bar must be removed');
assert(tpl.includes('AI Panda Matcher'), 'Must contain AI Panda Matcher');
assert(tpl.includes('assets/vanvi-moments-official-logo.png'), 'Must contain official logo');
const searchRow = tpl.slice(tpl.indexOf('class="search-filter-row"'), tpl.indexOf('class="sort-select-box"'));
assert(searchRow.indexOf('btnSmartFilterTrigger') < searchRow.indexOf('searchInput'), 'Filter button must appear on left of search in search-filter-row');
assert(tpl.includes('viewall-featured'), 'Must have merged view all pill for featured');
assert(tpl.includes('viewall-birthday'), 'Must have merged view all pill for birthday');
assert(tpl.includes('section-view-all-pill'), 'Must contain section-view-all-pill class');
console.log('✅ 1. templates.html checks passed cleanly!');

// 2. Index Page
const idx = fs.readFileSync('index.html', 'utf8');
assert(idx.includes('data-index="5"'), 'Showcase slider must have 6 slides (index 0 to 5)');
assert(idx.includes('data-slide="5"'), 'Showcase slider must have 6 dots');
assert(idx.includes('Celebration Mini-Games &amp; Coin Rewards'), 'Must contain colorful Games section');
assert(idx.includes('Bespoke Commission'), 'Must contain polished 24K Atelier Ultra section');
assert(idx.includes('Zero Sliding / Drifting'), 'Hero buttons must have zero-sliding lock');
console.log('✅ 2. index.html checks passed cleanly!');

// 3. Navigation CSS
const nav = fs.readFileSync('vanvi-navigation.css', 'utf8');
assert(nav.includes('backdrop-filter: blur(28px) saturate(200%)'), 'Bottom dock must have enhanced blur');
assert(nav.includes('border-radius: 24px'), 'Bottom dock must have 24px rounded corners');
console.log('✅ 3. vanvi-navigation.css checks passed cleanly!');

console.log('\n🎉 ALL CHECKS PASSED PERFECTLY!');
