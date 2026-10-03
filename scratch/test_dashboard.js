const fs = require('fs');
const vm = require('vm');

console.log('=== VANVI DASHBOARD.HTML VERIFICATION SUITE ===\n');

const html = fs.readFileSync('dashboard.html', 'utf8');

let passCount = 0;
let totalChecks = 0;

function check(label, condition) {
  totalChecks++;
  if (condition) {
    console.log(`✅ PASS: ${label}`);
    passCount++;
  } else {
    console.error(`❌ FAIL: ${label}`);
  }
}

// 1. Script tag existence and JS Syntax check
const scriptMatches = [...html.matchAll(/<script[\s\S]*?>([\s\S]*?)<\/script>/gi)];
check('Has script tags', scriptMatches.length > 0);

scriptMatches.forEach((match, idx) => {
  const code = match[1].trim();
  if (code) {
    try {
      new vm.Script(code);
      check(`Script ${idx + 1} valid syntax`, true);
    } catch (err) {
      console.error(`Syntax error in script ${idx + 1}:`, err.message);
      check(`Script ${idx + 1} valid syntax`, false);
    }
  }
});

// 2. Duplicate ID Check
const idMatches = [...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
const idCounts = {};
idMatches.forEach(id => { idCounts[id] = (idCounts[id] || 0) + 1; });
const duplicates = Object.keys(idCounts).filter(id => idCounts[id] > 1);
check(`Zero duplicate IDs found (${idMatches.length} IDs checked)`, duplicates.length === 0);
if (duplicates.length > 0) {
  console.error('Duplicate IDs detected:', duplicates);
}

// 3. User Stats & Metrics Check
check('Total moments counter present (#statTotalMoments)', html.includes('id="statTotalMoments"'));
check('Total views counter present (#statTotalViews)', html.includes('id="statTotalViews"'));
check('Total hearts counter present (#statTotalHearts)', html.includes('id="statTotalHearts"'));

// 4. Rewards & Coins Check
check('Coin balance display present (#dashCoinBalance)', html.includes('id="dashCoinBalance"'));
check('Coin rupee savings value present (#dashCoinValue)', html.includes('id="dashCoinValue"'));
check('Spin Daily Fortune Wheel button present (#dashSpinWheelLink)', html.includes('id="dashSpinWheelLink"'));
check('Coin ledger modal overlay present (#coinLedgerModal)', html.includes('id="coinLedgerModal"'));
check('Coin ledger container present (#ledgerListContainer)', html.includes('id="ledgerListContainer"'));

// 5. Moments Grid & Controls Check
check('Filter tabs container present (#filterTabsContainer)', html.includes('id="filterTabsContainer"'));
check('Moments search input present (#inputSearchMoments)', html.includes('id="inputSearchMoments"'));
check('Moments dynamic container present (#momentsContainer)', html.includes('id="momentsContainer"'));

// 6. Navigation & Quick Launcher Check
check('Ask AI link present', html.includes('href="ai.html"'));
check('Studio link present', html.includes('href="builder.html"'));
check('Home link present', html.includes('href="index.html"'));

// 7. Mobile Viewport & Accessibility Rules
check('Viewport allows user zoom (no user-scalable=no)', !html.includes('user-scalable=no') && html.includes('maximum-scale=5.0'));
check('Mobile 16px font-size rule present (anti-autozoom)', html.includes('font-size: 16px;'));
check('Overflow-x locked (overflow-x: hidden !important)', html.includes('overflow-x: hidden !important'));

console.log(`\nResults: ${passCount} / ${totalChecks} checks passed.`);
if (passCount === totalChecks) {
  console.log('🎉 ALL DASHBOARD.HTML CHECKS PASSED PERFECTLY!\n');
  process.exit(0);
} else {
  console.error('⚠️ SOME CHECKS FAILED!\n');
  process.exit(1);
}

