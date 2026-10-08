/**
 * VANVI MOMENTS — TEST SUITE FOR GLOBAL UX, GAMES, REFERRAL & HINDI SYSTEM
 */

const fs = require('fs');
const http = require('http');
const app = require('../server/server');
const { Users, CoinLedger } = require('../server/db/database');
const { COIN_CONFIG } = require('../server/config/coins');

console.log('=== VANVI MOMENTS GLOBAL UX, GAMES, REFERRAL & i18n TEST SUITE ===\n');

let pass = 0;
let total = 0;

function check(label, condition) {
  total++;
  if (condition) {
    console.log(`  ✅ PASS: ${label}`);
    pass++;
  } else {
    console.error(`  ❌ FAIL: ${label}`);
  }
}

// -------------------------------------------------------------
// 1. Central Translation System (js/vanvi-i18n.js)
// -------------------------------------------------------------
console.log('1. Central Translation System (js/vanvi-i18n.js):');
const i18nJs = fs.readFileSync('js/vanvi-i18n.js', 'utf8');
check('vanvi-i18n.js exists and is populated', i18nJs.length > 1000);
check('Has localStorage persistence key vanvi_lang', i18nJs.includes("'vanvi_lang'"));
check('Has authentic Devanagari Hindi navigation (होम, टेम्प्लेट्स, पल बनाएं, उपहार स्टोर, वीआईपी प्लान्स, रिवॉर्ड्स)', 
  i18nJs.includes('होम') && i18nJs.includes('टेम्प्लेट्स') && i18nJs.includes('पल बनाएं') && i18nJs.includes('उपहार स्टोर') && i18nJs.includes('रिवॉर्ड्स'));
check('Has authentic Devanagari Hindi for Refer & Earn (रेफर करें और कमाएं, मित्रों को आमंत्रित करें)',
  i18nJs.includes('रेफर करें और कमाएं') && i18nJs.includes('मित्रों को आमंत्रित करें'));
check('Has authentic Devanagari Hindi for Games & Fortune Wheel (दैनिक फॉर्च्यून व्हील, लकी मोमेंट)',
  i18nJs.includes('दैनिक फॉर्च्यून व्हील') && i18nJs.includes('लकी मोमेंट'));
check('Implements applyTranslations, setLanguage, and toggle methods',
  i18nJs.includes('applyTranslations()') && i18nJs.includes('setLanguage(lang)') && i18nJs.includes('toggle()'));
check('Exposes window.VanviI18n globally', i18nJs.includes('window.VanviI18n = i18n'));

// -------------------------------------------------------------
// 2. Rewards & Referrals Page (rewards.html)
// -------------------------------------------------------------
console.log('\n2. Rewards & Referrals Redesign (rewards.html):');
const rewardsHtml = fs.readFileSync('rewards.html', 'utf8');
check('rewards.html has smart back navigation', rewardsHtml.includes('if (history.length > 1) { history.back(); } else { location.href=\'index.html\'; }'));
check('rewards.html includes vanvi-i18n.js', rewardsHtml.includes('src="js/vanvi-i18n.js"'));
check('rewards.html has .lang-toggle in header', rewardsHtml.includes('class="lang-toggle"'));
check('rewards.html has 4-step referral flow in markup', 
  rewardsHtml.includes('1. Invite Friends') && 
  rewardsHtml.includes('2. Friend Joins') && 
  rewardsHtml.includes('3. Creates First Moment') && 
  rewardsHtml.includes('4. Reward Unlocked'));
check('rewards.html has referral code box and 1-tap copy button', rewardsHtml.includes('id="userReferralCode"') && rewardsHtml.includes('id="btnCopyReferralCode"'));
check('rewards.html has WhatsApp and Native Share buttons', rewardsHtml.includes('btn-share-whatsapp') && rewardsHtml.includes('shareNativeLink()'));
check('rewards.html has interactive tabs for Refer & Earn, Daily Fortune, and Coupons', 
  rewardsHtml.includes('id="tabBtnReferral"') && 
  rewardsHtml.includes('id="tabBtnWheel"') && 
  rewardsHtml.includes('id="tabBtnCoupons"'));
check('rewards.html preserves Daily Fortune Wheel and 14-day Lucky Moment',
  rewardsHtml.includes('id="rewardWheelDisc"') && rewardsHtml.includes('id="hubSpinBtn"') && rewardsHtml.includes('id="btnClaimLucky"'));
check('rewards.html has live coin balance and 10 coins = ₹1 exchange rate indicator',
  rewardsHtml.includes('id="displayCoinBalance"') && rewardsHtml.includes('10 Coins = ₹1.00'));

// -------------------------------------------------------------
// 3. Micro-Games Page (games.html)
// -------------------------------------------------------------
console.log('\n3. Micro-Games & Coin Cap (games.html):');
const gamesHtml = fs.readFileSync('games.html', 'utf8');
check('games.html has smart back navigation', gamesHtml.includes('if (history.length > 1) { history.back(); } else { location.href=\'index.html\'; }'));
check('games.html includes vanvi-i18n.js', gamesHtml.includes('src="js/vanvi-i18n.js"'));
check('games.html has daily coin limit banner', gamesHtml.includes('Daily Virtual Coin Rewards') || gamesHtml.includes('economy-banner'));
check('games.html cards show coins reward badge', gamesHtml.includes('coin-tag') || gamesHtml.includes('Coins'));
check('games.html has daily cap status indicator', gamesHtml.includes('dailyCoinsStatus') && gamesHtml.includes('Daily cap'));
check('games.html features curated celebration arcade games',
  gamesHtml.includes('Heart Rain') && gamesHtml.includes('games-master-grid'));

// -------------------------------------------------------------
// 4. Site-wide Smart Back Navigation & i18n
// -------------------------------------------------------------
console.log('\n4. Site-Wide Consistency:');
const indexHtml = fs.readFileSync('index.html', 'utf8');
check('index.html includes vanvi-i18n.js', indexHtml.includes('src="js/vanvi-i18n.js"'));
check('index.html connects language toggle with VanviI18n', indexHtml.includes('window.VanviI18n.setLanguage'));

const productsHtml = fs.readFileSync('products.html', 'utf8');
check('products.html includes vanvi-i18n.js', productsHtml.includes('src="js/vanvi-i18n.js"'));
check('products.html has smart back button', productsHtml.includes('if (history.length > 1) { history.back(); return false; }'));

const templatesHtml = fs.readFileSync('templates.html', 'utf8');
check('templates.html includes vanvi-i18n.js', templatesHtml.includes('src="js/vanvi-i18n.js"'));
check('templates.html has clean navigation without unwanted back button', !templatesHtml.includes('safeGoBack()'));

const plansHtml = fs.readFileSync('plans.html', 'utf8');
check('plans.html includes vanvi-i18n.js', plansHtml.includes('src="js/vanvi-i18n.js"'));
check('plans.html has smart back button', plansHtml.includes('if (history.length > 1) { history.back(); return false; }'));

const builderHtml = fs.readFileSync('builder.html', 'utf8');
check('builder.html includes vanvi-i18n.js', builderHtml.includes('src="js/vanvi-i18n.js"'));
check('builder.html has smart back button', builderHtml.includes('if (history.length > 1) { history.back(); return false; }'));

const checkoutHtml = fs.readFileSync('checkout.html', 'utf8');
check('checkout.html includes vanvi-i18n.js', checkoutHtml.includes('src="js/vanvi-i18n.js"'));
check('checkout.html has smart back button', checkoutHtml.includes('if (history.length > 1) { history.back(); return false; }'));

// -------------------------------------------------------------
// 5. Backend Server Endpoints Test
// -------------------------------------------------------------
console.log('\n5. Backend Coins & Referral API:');

let server;
let BASE_URL = '';

async function runServerTests() {
  await new Promise(resolve => {
    server = app.listen(0, () => {
      BASE_URL = `http://localhost:${server.address().port}`;
      resolve();
    });
  });

  try {
    // 5.1 Test calculate-eligibility endpoint
    const calcRes = await fetch(`${BASE_URL}/api/coins/calculate-eligibility`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderAmountINR: 1000, userCoins: 2000, tier: 'free' })
    });
    const calcData = await calcRes.json();
    check('POST /api/coins/calculate-eligibility responds cleanly', calcRes.ok && calcData.success);
    check('Free creator calculation applies 20% max discount', calcData.calculation.maxDiscountINR === 200);

    // 5.2 Test Referral Claim Endpoint validation
    const refClaimRes = await fetch(`${BASE_URL}/api/coins/referral/claim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    check('POST /api/coins/referral/claim rejects missing code or unauthenticated request', refClaimRes.status === 401 || refClaimRes.status === 400);

    // 5.3 Test Game Reward endpoint validation
    const gameRewardRes = await fetch(`${BASE_URL}/api/coins/game-reward`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameId: 'bloom' })
    });
    check('POST /api/coins/game-reward rejects unauthenticated request cleanly', gameRewardRes.status === 401);

  } finally {
    if (server) server.close();
  }

  console.log(`\nResults: ${pass} / ${total} checks passed.`);
  if (pass === total) {
    console.log('🎉 ALL GLOBAL UX, GAMES, REFERRAL & i18n TESTS PASSED FLAWLESSLY!\n');
    process.exit(0);
  } else {
    console.error('⚠️ SOME CHECKS FAILED!');
    process.exit(1);
  }
}

runServerTests();

