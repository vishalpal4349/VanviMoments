const { execSync } = require('child_process');
const path = require('path');

const suites = [
  { name: 'Homepage (index.html regressions)', script: 'scratch/test_suite.js' },
  { name: 'Vanvi AI Template Matcher (ai-matcher.html)', script: 'scratch/test_ai.js' },
  { name: 'Creator Studio (builder.html)', script: 'scratch/test_builder.js' },
  { name: 'Checkout & Coin Redemption (checkout.html)', script: 'scratch/test_checkout.js' },
  { name: 'Recipient Experience (moment.html)', script: 'scratch/test_moment.js' },
  { name: 'Creator Dashboard & Hub (dashboard.html)', script: 'scratch/test_dashboard.js' },
  { name: 'Backend API & Core Security', script: 'scratch/test_backend_api.js' },
  { name: 'Full Production Services & Cloud Architecture', script: 'scratch/test_production_full.js' },
  { name: 'Category Portals & Templates Universe (Dedicated Pages)', script: 'scratch/test_category_pages.js' },
  { name: 'Premium Plans & Smart Coin Economy (plans.html)', script: 'scratch/test_plans_and_coins.js' },
  { name: 'Remaining Production & Legal Pages (About, Contact, FAQ, Privacy, Terms, Refunds, Success, Categories)', script: 'scratch/test_remaining_pages.js' },
  { name: 'Template #1 Birthday White Bloom Standalone & Ecosystem Suite', script: 'scratch/test_birthday_white_bloom.js' },
  { name: 'Final Pre-Launch Hardening, Security, Gateways & E2E QA', script: 'scratch/test_prelaunch_hardening.js' },
  { name: 'Vanvi AI Assistant (vanvi-assistant.html) Backend Integration', script: 'scratch/test_assistant.js' },
  { name: 'Global UX Rules, Games Cap, 4-Step Referral & Devanagari Hindi System', script: 'scratch/test_ux_games_referral_i18n.js' },
  { name: 'Authentication Account Defaults & Recovery Delivery', script: 'scratch/test_auth_account_defaults.js' }
];

console.log('====================================================');
console.log('    VANVI MOMENTS ECOSYSTEM MASTER VERIFICATION     ');
console.log('====================================================\n');

let allPassed = true;

suites.forEach((suite, idx) => {
  process.stdout.write(`[${idx + 1}/${suites.length}] Running ${suite.name}... `);
  try {
    execSync(`node "${path.join(__dirname, '..', suite.script)}"`, { stdio: 'pipe' });
    console.log('✅ 100% PASS');
  } catch (err) {
    console.log('❌ FAILED');
    const output = [err.stdout, err.stderr]
      .map((stream) => stream && stream.toString().trim())
      .filter(Boolean)
      .join('\n');
    console.error(output || err.message);
    allPassed = false;
  }
});

console.log('\n====================================================');
if (allPassed) {
  console.log(`🎉 ALL ${suites.length} PRODUCTION & SECURITY SUITES PASSED FLAWLESSLY!`);
} else {
  console.log('⚠️ SOME SUITES EXPERIENCED ISSUES');
}
console.log('====================================================\n');
