const fs = require('fs');
const html = fs.readFileSync('templates.html', 'utf8');

const requiredIds = [
  'searchInput',
  'searchClear',
  'searchResultPill',
  'btnSmartFilterTrigger',
  'activeFilterBadge',
  'quickOccasionsStrip',
  'quickSortSelect',
  'viewModeToggle',
  'btnViewGrid',
  'btnViewMag',
  'discoveryRailsView',
  'filterResultsView',
  'filterGrid',
  'filterDrawer'
];

console.log('--- Checking Required DOM IDs in templates.html ---');
let allPassed = true;
requiredIds.forEach(id => {
  const hasId = html.includes(`id="${id}"`) || html.includes(`id='${id}'`);
  console.log(`${id}: ${hasId ? '✅ FOUND' : '❌ MISSING'}`);
  if (!hasId) allPassed = false;
});

const requiredFns = [
  'openFilterDrawer',
  'closeFilterDrawer',
  'selectFilter',
  'selectQuickCategory',
  'switchCardViewMode',
  'resetAllFilters'
];

console.log('\n--- Checking Required JavaScript Functions ---');
requiredFns.forEach(fn => {
  const hasFn = html.includes(`window.${fn} =`);
  console.log(`${fn}: ${hasFn ? '✅ DEFINED' : '❌ MISSING'}`);
  if (!hasFn) allPassed = false;
});

console.log(`\nOverall Sanity Check: ${allPassed ? 'ALL PASSED ✅' : 'FAILURES DETECTED ❌'}`);
