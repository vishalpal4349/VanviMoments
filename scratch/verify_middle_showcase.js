const fs = require('fs');
const path = require('path');

console.log('=== VERIFYING INDEX.HTML MIDDLE LUXURY SHOWCASE SLIDER ===\n');
const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

let pass = 0;
let total = 0;

function test(name, cond) {
  total++;
  const result = typeof cond === 'function' ? cond() : cond;
  if (result) {
    console.log(`  ✅ [PASS] ${name}`);
    pass++;
  } else {
    console.error(`  ❌ [FAIL] ${name}`);
  }
}

test('Contains #luxuryShowcaseSection', indexHtml.includes('id="luxuryShowcaseSection"'));
test('Placed in middle of index.html (before #templateDiscovery)', () => {
  const showcasePos = indexHtml.indexOf('id="luxuryShowcaseSection"');
  const templatePos = indexHtml.indexOf('id="templateDiscovery"');
  return showcasePos > 0 && templatePos > showcasePos;
});
test('Contains exactly 6 showcase slides', (indexHtml.match(/class="showcase-slide-item/g) || []).length === 6);
test('Contains sleek feature pill tags (patla sa feature)', indexHtml.includes('class="slide-features-strip"') && indexHtml.includes('class="feature-tag-pill"'));
test('Slide 1 links to dashboard.html for Welcome Coins', indexHtml.includes('50 Welcome Coins') && indexHtml.includes('dashboard.html'));
test('Slide 2 links to plans.html#passesSection for Mini Pass', indexHtml.includes('Mini Celebration Pass') && indexHtml.includes('plans.html#passesSection'));
test('Slide 3 links to plans.html#passesSection for Creator Pass', indexHtml.includes('Creator Festival Pass') && indexHtml.includes('plans.html#passesSection'));
test('Slide 4 links to plans.html for Vanvi Club VIP', indexHtml.includes('Vanvi Club') && indexHtml.includes('plans.html') && indexHtml.includes('Join Vanvi Club (₹99)'));
test('Slide 5 links to dashboard.html for Daily Fortune Wheel', indexHtml.includes('Daily Fortune Wheel') && indexHtml.includes('Spin Free Wheel'));
test('Slide 6 links to products.html for Physical Keepsakes', indexHtml.includes('Physical Keepsake Store') && indexHtml.includes('products.html'));
test('Includes prev & next navigation controls', indexHtml.includes('id="showcasePrevBtn"') && indexHtml.includes('id="showcaseNextBtn"'));
test('Includes dot navigation bar with 6 dots', () => {
  const dotsMatch = indexHtml.match(/class="showcase-dot(?:\s|")/g);
  return dotsMatch && dotsMatch.length === 6;
});
test('Includes initLuxuryShowcaseSlider JavaScript function', indexHtml.includes('function initLuxuryShowcaseSlider()'));
test('Auto-rotation interval set to 4000ms', indexHtml.includes('ROTATE_INTERVAL = 4000'));
test('Includes touch swipe handling (touchstart/touchend)', indexHtml.includes('touchstart') && indexHtml.includes('touchend'));

console.log(`\nResults: ${pass}/${total} Passed (${Math.round((pass/total)*100)}%)`);

if (pass === total) {
  console.log('🎉 ALL MIDDLE SHOWCASE TESTS PASSED PERFECTLY!');
  process.exit(0);
} else {
  process.exit(1);
}
