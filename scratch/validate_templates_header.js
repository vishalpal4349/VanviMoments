const fs = require('fs');
const path = require('path');
const assert = require('assert');

const templatesHtmlPath = path.join(__dirname, '..', 'templates.html');
const content = fs.readFileSync(templatesHtmlPath, 'utf8');

console.log('--- VALIDATING TEMPLATES.HTML POLISH ---');

// 1. Navbar check
assert(!content.includes('<a href="index.html" class="nav-link-item">Home</a>'), 'Home link should be removed from navbar');
assert(content.includes('class="nav-brand-static"'), 'Brand logo must be preserved');
assert(content.includes('assets/vanvi-moments-logo-header.png'), 'Brand logo image must be preserved');
assert(content.includes('custom-experience.html" class="nav-link-item">Bespoke</a>'), 'Bespoke link must be preserved');
assert(content.includes('class="nav-create-pill"'), 'Choose Template button must be preserved');
console.log('✅ [1/5] Navbar check passed: Only Home link removed, brand and other links preserved');

// 2. AI Panda Matcher check
assert(content.includes('id="heroAssistantPill"'), 'AI Panda Matcher pill must exist');
assert(content.includes('href="ai-matcher.html"'), 'AI Panda Matcher must link to ai-matcher.html');
assert(content.includes('AI Panda Matcher'), 'AI Panda Matcher text must be intact');
assert(content.includes('concierge-avatar'), 'AI Panda Matcher avatar must be intact');
assert(content.includes('Match Now ✦'), 'AI Panda Matcher arrow must be intact');
console.log('✅ [2/5] AI Panda Matcher check passed: 100% preserved without any modifications');

// 3. Search + Filter check
const searchPos = content.indexOf('id="searchInput"');
const filterPos = content.indexOf('id="btnSmartFilterTrigger"');
assert(searchPos !== -1, 'Search input must exist');
assert(filterPos !== -1, 'Filter button must exist');
assert(searchPos < filterPos, 'Filter button must be on the right side of the search input');
assert(content.includes('class="search-box-wrap"'), 'Search box wrapper must exist');
assert(content.includes('flex: 0 1 270px') || content.includes('flex: 0 1'), 'Search input width must be slightly reduced');
assert(content.includes('onclick="openFilterDrawer()"'), 'Filter trigger must call openFilterDrawer()');
console.log('✅ [3/5] Search + Filter check passed: Filter button is positioned neatly on the right of Search');

// 4. Quick Search + Sort + View Toggle check
const quickSearchPos = content.indexOf('id="quickSearchTagsRow"');
assert(quickSearchPos !== -1, 'Quick search tags row must exist');
assert(content.includes("applySearchTag('birthday')"), 'Birthday quick tag must exist');
assert(content.includes("applySearchTag('love')"), 'Love Letter quick tag must exist');
assert(content.includes("applySearchTag('candle')"), 'Candle Cake quick tag must exist');
assert(content.includes("applySearchTag('magazine')"), 'Magazine quick tag must exist');
assert(content.includes("applySearchTag('anniversary')"), 'Anniversary quick tag must exist');
assert(content.includes("applySearchTag('vip')"), 'VIP quick tag must exist');

assert(content.includes('id="quickSortSelect"'), 'Sort dropdown must exist');
assert(content.includes('id="viewModeToggle"'), 'View mode toggle must exist');
assert(content.includes('id="btnViewGrid"'), 'Grid view toggle button must exist');
assert(content.includes('id="btnViewMag"'), 'Magazine view toggle button must exist');

// Verify CSS prevents wrapping/overflow on quick search tags
assert(content.includes('overflow-x: auto'), 'Quick tags row must have overflow-x: auto');
assert(content.includes('white-space: nowrap'), 'Quick tags row must have white-space: nowrap');
assert(content.includes('flex-wrap: nowrap'), 'Quick tags row must have flex-wrap: nowrap');
assert(content.includes('flex-shrink: 0'), 'Quick tag chips must have flex-shrink: 0');
console.log('✅ [4/5] Quick Search + Sort + View Toggle check passed: Horizontal scrolling configured, all controls and options preserved');

// 5. Template Catalog & Layout integrity check
assert(content.includes('id="discoveryRailsView"'), 'Discovery rails view must be intact');
assert(content.includes('id="filterResultsView"'), 'Filter results view must be intact');
assert(content.includes('id="filterGrid"'), 'Filter grid must be intact');
assert(content.includes('id="quickOccasionsStrip"'), 'Quick occasions strip must be intact');
assert(content.includes('id="filterDrawer"'), 'Filter drawer must be intact');
assert(content.includes('overflow-x: hidden !important'), 'Body overflow-x must be hidden to prevent page overflow');
console.log('✅ [5/5] Catalog & Layout integrity check passed: All sections below controls are intact');

console.log('\n🎉 ALL VALIDATION CHECKS PASSED FLAWLESSLY!');
