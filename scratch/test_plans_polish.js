const fs = require('fs');

console.log('--- TESTING PLANS.HTML POLISH INTEGRITY ---');

const html = fs.readFileSync('plans.html', 'utf8');

const required = [
  'creditsSliderSection',
  'coinsSliderSection',
  'subscriptionsSection',
  'coinRewardsSection',
  'schedule-item-welcome',
  'schedule-item-spin',
  'schedule-item-cashback',
  'schedule-item-referral',
  'btn-spin-wheel-link',
  'rewards.html#wheel',
  'res-card-discount',
  'res-card-payable',
  'res-card-rules',
  'scroll-behavior: smooth',
  'cardPassMini',
  'cardPassCreator',
  'cardPassVip',
  'cardCoinSpark',
  'cardCoinCelebration',
  'cardCoinVault',
  'cardPlanFree',
  'cardPlanMonthly',
  'cardPlanAnnual',
  'cardPlanLifetime'
];

let failed = 0;
required.forEach(item => {
  if (html.includes(item)) {
    console.log(`PASS: Found "${item}"`);
  } else {
    console.error(`FAIL: Missing "${item}"`);
    failed++;
  }
});

if (failed === 0) {
  console.log('\nALL PLANS POLISH VERIFICATIONS PASSED (0 ERRORS)! 🚀');
} else {
  console.error(`\nFAILED ${failed} CHECKS! ❌`);
  process.exit(1);
}
