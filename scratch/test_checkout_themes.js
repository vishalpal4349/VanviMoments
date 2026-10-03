const fs = require('fs');

console.log('=== TESTING CHECKOUT DYNAMIC TEMPLATE THEME ENGINE ===\n');

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

// 1. Check Dynamic Theme Styles & Root Variables
check('Has CSS variables for dynamic theme (--theme-accent, --theme-glow, --theme-gradient)', 
  html.includes('--theme-accent:') && 
  html.includes('--theme-glow:') && 
  html.includes('--theme-gradient:'));

// 2. Check Dynamic Theme Script presence
check('Loads vanvi-templates-data.js master catalog', html.includes('src="js/vanvi-templates-data.js"'));
check('Has THEME_PROFILES map (birthday, love, anniversary, apology, friendship, celebration)', 
  html.includes('birthday:') && 
  html.includes('love:') && 
  html.includes('anniversary:') && 
  html.includes('apology:') && 
  html.includes('friendship:') && 
  html.includes('celebration:'));

check('Has dynamic runtime root.style.setProperty for --theme-accent', 
  html.includes("root.style.setProperty('--theme-accent'"));

check('Has dynamic theme badge and header icon', 
  html.includes('id="checkoutBadgeText"') && 
  html.includes('id="themeHeadIcon"') && 
  html.includes('id="itemThumbIcon"'));

// 3. Check Interactive Coupon System
check('Has promo code input and apply button', 
  html.includes('id="inputPromoCode"') && 
  html.includes('id="btnApplyCoupon"'));

check('Has instant coupon tags (WELCOME10, VANVI15, LOVE20, CELEBRATE50)', 
  html.includes('WELCOME10') && 
  html.includes('VANVI15') && 
  html.includes('LOVE20') && 
  html.includes('CELEBRATE50'));

// 4. Check Luxury Trust Ribbon
check('Has 3-item trust ribbon (Instant Delivery, 100% Satisfaction, Bank-Grade SSL)', 
  html.includes('trust-ribbon') && 
  html.includes('100% Satisfaction') && 
  html.includes('Bank-Grade SSL'));

// 5. Check Total Savings Callout
check('Has dynamic savings callout badge (#savingsCallout, #txtTotalSavings)', 
  html.includes('id="savingsCallout"') && 
  html.includes('id="txtTotalSavings"'));

console.log(`\nResults: ${pass} / ${total} theme checks passed.`);
if (pass === total) {
  console.log('🎉 ALL DYNAMIC THEME SYSTEM CHECKS PASSED!');
} else {
  process.exit(1);
}
