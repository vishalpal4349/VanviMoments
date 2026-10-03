const fs = require('fs');
const path = require('path');

const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

console.log('=== TESTING VANVI LUXURY PERKS DISCOVERY BAR ===\n');

let pass = 0;
let total = 0;

function check(desc, cond) {
  total++;
  if (cond) {
    console.log(`  ✅ [PASS] ${desc}`);
    pass++;
  } else {
    console.error(`  ❌ [FAIL] ${desc}`);
  }
}

check('Contains luxury-perks-discovery-bar container', indexHtml.includes('class="luxury-perks-discovery-bar"'));
check('Contains id="luxuryPerksBar"', indexHtml.includes('id="luxuryPerksBar"'));
check('Contains 5 rotating perk slides', (indexHtml.match(/class="perks-slide/g) || []).length === 5);
check('Slide 1 offers 50 Welcome Coins', indexHtml.includes('Claim 50 Welcome Coins') && indexHtml.includes('dashboard.html'));
check('Slide 2 offers Mini Pass 320 Credits for ₹249', indexHtml.includes('Mini Pass: 320 Credits for ₹249') && indexHtml.includes('plans.html#passesSection'));
check('Slide 3 offers Creator Festival Pass 700 Credits for ₹499', indexHtml.includes('Creator Pass: 700 Credits for ₹499'));
check('Slide 4 offers Vanvi Club VIP with 40% Off', indexHtml.includes('Vanvi Club: All 37 Templates + 40% Off') && indexHtml.includes('plans.html'));
check('Slide 5 offers Daily Fortune Wheel', indexHtml.includes('Daily Fortune Wheel Ready'));
check('Includes prev and next navigation arrows', indexHtml.includes('id="perksPrevBtn"') && indexHtml.includes('id="perksNextBtn"'));
check('Includes indicator dots', indexHtml.includes('id="perksDots"'));
check('Includes auto-rotation function initPerksDiscoveryBar', indexHtml.includes('function initPerksDiscoveryBar()'));
check('Includes mobile swipe handling', indexHtml.includes('touchstart') && indexHtml.includes('touchend'));
check('Includes vanvi-api.js script import', indexHtml.includes('src="js/vanvi-api.js"'));

console.log(`\nResults: ${pass}/${total} Passed (${Math.round((pass/total)*100)}%)`);

if (pass === total) {
  console.log('🎉 ALL PERKS BAR CHECKS PASSED PERFECTLY!');
  process.exit(0);
} else {
  process.exit(1);
}
