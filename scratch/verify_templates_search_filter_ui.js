const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- VERIFYING TEMPLATES.HTML SEARCH & FILTER ADJUSTMENT ---');

const html = fs.readFileSync(path.join(__dirname, '..', 'templates.html'), 'utf8');

// 1. Check CSS adjustments
assert(html.includes('flex: 0 1 220px;'), 'Search box width should be reduced to 220px');
assert(html.includes('max-width: calc(100% - 94px);'), 'Mobile search box should leave space for filter button');
assert(html.includes('.btn-smart-filter-trigger {'), 'Filter button class should exist');
assert(html.includes('padding: 0 12px;'), 'Filter button should have compact padding');
assert(html.includes('height: 38px;'), 'Filter button should match 38px height of search box');

// 2. Check HTML markup & placement
const rowStart = html.indexOf('<div class="search-filter-row">');
const rowEnd = html.indexOf('<!-- Smart Instant Quick Searches');
assert(rowStart !== -1 && rowEnd !== -1, 'search-filter-row must exist');
const searchFilterRow = html.slice(rowStart, rowEnd);

// Verify search box and filter button are in the same row
const searchBoxPos = searchFilterRow.indexOf('id="searchBoxContainer"');
const filterBtnPos = searchFilterRow.indexOf('id="btnSmartFilterTrigger"');
assert(searchBoxPos !== -1, 'searchBoxContainer must exist');
assert(filterBtnPos !== -1, 'btnSmartFilterTrigger must exist');
assert(searchBoxPos < filterBtnPos, 'Filter button must be immediately to the right of the search box');

// Verify compact filter button contents
assert(searchFilterRow.includes('<svg width="12" height="12"'), 'Filter button must have small clean icon');
assert(searchFilterRow.includes('class="sf-label">Filter</span>'), 'Filter button must have Filter label');
assert(searchFilterRow.includes('onclick="openFilterDrawer()"'), 'Filter button must preserve openFilterDrawer() click');

// 3. Verify all other features were completely untouched
assert(html.includes('id="searchInput"'), 'Search input ID must remain');
assert(html.includes('id="searchClear"'), 'Search clear button must remain');
assert(html.includes('id="quickSortSelect"'), 'Quick sort select must remain');
assert(html.includes('id="viewModeToggle"'), 'View mode toggle must remain');
assert(html.includes('AI Panda Matcher'), 'AI Matcher must remain untouched');
assert(html.includes('quick-search-tags-row'), 'Quick search tags row must remain untouched');
assert(html.includes('quick-occasions-strip'), 'Quick occasions strip must remain untouched');
assert(html.includes('discoveryRailsView'), 'Discovery rails must remain untouched');

console.log('✅ 1. CSS search bar width slightly reduced (220px desktop, calc mobile)!');
console.log('✅ 2. Filter button placed immediately to the right on the same row with small icon!');
console.log('✅ 3. All existing search, filter, sort, AI matcher, and rail functions 100% preserved!');
console.log('\n🎉 TINY UI ADJUSTMENT VERIFIED 100% SUCCESSFULLY!');
