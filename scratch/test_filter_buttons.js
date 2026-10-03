const fs = require('fs');

console.log('=== TESTING GLOBAL FILTER BUTTONS & SYSTEM ===\n');

const index = fs.readFileSync('index.html', 'utf8');
const tpl = fs.readFileSync('templates.html', 'utf8');
const navCss = fs.readFileSync('vanvi-navigation.css', 'utf8');

let pass = 0;
let total = 0;
function check(name, cond) {
  total++;
  if (cond) {
    console.log(`✅ PASS: ${name}`);
    pass++;
  } else {
    console.error(`❌ FAIL: ${name}`);
  }
}

// 1. Index.html Filter Chips
check('Index has data-filter attributes on chips', 
  index.includes('data-filter="All"') && 
  index.includes('data-filter="Free"') &&
  index.includes('data-filter="Premium"'));

check('Index filter chips have readable icons (✨, 🆓, 💎, 🎂, 💖, etc.)',
  index.includes('✨ All') &&
  index.includes('🆓 100% Free') &&
  index.includes('💎 VIP Luxury'));

check('Index has readable 12px filter-chip styles (not 8px)',
  index.includes('.filter-chip') &&
  index.includes('font-size: 12px !important;') &&
  index.includes('padding: 8px 16px !important;'));

check('Index has smart selectedFilter logic supporting data-filter',
  index.includes('selectedFilter = chip.dataset.filter ||'));

check('Index has smart budget presets (Free, 49, 99, 199, 499, All)',
  index.includes('🆓 ₹0 Free') &&
  index.includes('Under ₹49') &&
  index.includes('Under ₹199'));

// 2. Templates.html Filter Pills & Category Navigation
check('Templates has upgraded 12.5px cat-tab-btn styling',
  tpl.includes('.cat-tab-btn') &&
  tpl.includes('padding: 8px 18px;') &&
  tpl.includes('font-size: 12.5px;'));

check('Templates has upgraded 12px filter-pill styling',
  tpl.includes('.filter-pill') &&
  tpl.includes('padding: 7px 15px;') &&
  tpl.includes('font-size: 12px;'));

// 3. Vanvi Navigation Global Master Filter Tokens
check('vanvi-navigation.css has global master filter styles',
  navCss.includes('GLOBAL MASTER FILTER & CATEGORY BUTTON DESIGN SYSTEM') &&
  navCss.includes('.filter-chip,') &&
  navCss.includes('.filter-pill,') &&
  navCss.includes('.cat-tab-btn,'));

console.log(`\nResults: ${pass} / ${total} filter checks passed.`);
if (pass === total) {
  console.log('🎉 ALL GLOBAL FILTER BUTTON UPGRADES VERIFIED PERFECTLY!');
} else {
  process.exit(1);
}
