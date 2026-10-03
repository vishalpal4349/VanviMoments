const fs = require('fs');
const path = require('path');

const plansPath = path.join(__dirname, '..', 'plans.html');
const html = fs.readFileSync(plansPath, 'utf8');

console.log('=== VERIFYING PLANS.HTML REDESIGN ===\n');

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

// 1. Tabbed Architecture (Eliminates Endless Scrolling)
check('Contains tab-content-section classes', html.includes('tab-content-section'));
check('Memberships section starts as active tab', html.includes('tab-content-section active-tab" id="membershipsSection"'));
check('Passes section configured as tab content', html.includes('tab-content-section" id="passesSection"'));
check('Calculator section configured as tab content', html.includes('tab-content-section" id="calculatorSection"'));
check('switchSectionView function toggles active-tab classes', html.includes("s.classList.remove('active-tab')") && html.includes("classList.add('active-tab')"));

// 2. High-converting Decision Helper
check('Has 3-Second Quick Decider box', html.includes('decision-helper-box'));
check('Decider cards trigger switchSectionView', html.includes("onclick=\"switchSectionView('passes')\"") && html.includes("onclick=\"switchSectionView('memberships')\""));

// 3. Compact Collapsible Feature Matrix
check('Feature matrix wrapped in luxury drawer (no endless scrolling)', html.includes('<details class="luxury-drawer" id="compMatrixDrawer">'));
check('Includes desktop table and mobile accordion inside drawer', html.includes('desktop-comp-table') && html.includes('mobile-comp-cards'));

// 4. Live Coin Discount Simulator
check('Explicit ₹1,000 Template Comparison example included', html.includes('₹1,000 Template Comparison'));
check('Includes interactive price slider and preset buttons', html.includes('id="priceRange"') && html.includes('data-price="1000"'));
check('Includes tier selector (Free 20% vs Club 40%)', html.includes('data-tier="free"') && html.includes('data-tier="member"'));

// 5. Verification of IDs and APIs
check('Modal card preserved', html.includes('sub-modal-card'));
check('Bottom navigation dock preserved', html.includes('vanvi-bottom-dock'));
check('Safe back button present', html.includes('safeGoBack()'));
check('API SDK imported', html.includes('js/vanvi-api.js'));

console.log(`\nResults: ${pass}/${total} Passed (${Math.round((pass/total)*100)}%)`);

if (pass === total) {
  console.log('🎉 ALL CHECKS PASSED PERFECTLY!');
  process.exit(0);
} else {
  process.exit(1);
}
