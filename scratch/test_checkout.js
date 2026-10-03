const fs = require('fs');

console.log('=== VANVI CHECKOUT.HTML VERIFICATION SUITE ===\n');

const html = fs.readFileSync('checkout.html', 'utf8');

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

// 1. Script syntax check
const scripts = html.match(/<script[\s\S]*?>([\s\S]*?)<\/script>/gi) || [];
check('Has script tags', scripts.length > 0);
scripts.forEach((s, i) => {
  const code = s.replace(/<script[\s\S]*?>/i, '').replace(/<\/script>/i, '');
  try {
    new Function(code);
    check(`Script ${i+1} valid syntax`, true);
  } catch (err) {
    check(`Script ${i+1} valid syntax (${err.message})`, false);
  }
});

// 2. Duplicate IDs check
const idMatches = [...html.matchAll(/id=["']([^"']+)["']/g)].map(m => m[1]);
const dupes = idMatches.filter((item, index) => idMatches.indexOf(item) !== index);
check(`Zero duplicate IDs found (${idMatches.length} IDs checked)`, dupes.length === 0);

// 3. Order summary card
check('Order item name and price present', html.includes('id="orderItemName"') && html.includes('id="orderItemBasePrice"'));
check('Subtotal row present (#txtSubtotal)', html.includes('id="txtSubtotal"'));

// 4. Coin redemption card
check('User total coins and rupee value present', html.includes('id="userTotalCoins"') && html.includes('id="userCoinsRupeeValue"'));
check('Apply coins checkbox present (#chkApplyCoins)', html.includes('id="chkApplyCoins"'));
check('Coin eligibility notice present (#coinEligibilityNotice)', html.includes('id="coinEligibilityNotice"'));
check('Discount row present (#txtDiscount)', html.includes('id="txtDiscount"'));
check('Remaining coins row present (#txtRemainingCoins)', html.includes('id="txtRemainingCoins"'));
check('Final payable amount present (#txtFinalPayable)', html.includes('id="txtFinalPayable"'));

// 5. Payment & Delivery
check('Complete payment button present (#btnCompletePayment)', html.includes('id="btnCompletePayment"'));
check('Order success modal present (#orderSuccessModal)', html.includes('id="orderSuccessModal"'));
check('WhatsApp deliver button present (#btnDeliverWhatsApp)', html.includes('id="btnDeliverWhatsApp"'));
check('Direct view link present (#linkViewDirect)', html.includes('id="linkViewDirect"'));

// 6. Mobile Safety & Responsive
const vp = html.match(/<meta[^>]*content="([^"]*)"[^>]*name="viewport"/i) || html.match(/<meta[^>]*name="viewport"[^>]*content="([^"]*)"/i);
check('Viewport allows user zoom (no user-scalable=no)', vp && !vp[1].includes('user-scalable=no'));
check('Overflow-x locked (overflow-x: hidden !important)', html.includes('overflow-x: hidden !important;'));

console.log(`\nResults: ${pass} / ${total} checks passed.`);
if (pass === total) {
  console.log('🎉 ALL CHECKOUT.HTML CHECKS PASSED PERFECTLY!');
} else {
  process.exit(1);
}
