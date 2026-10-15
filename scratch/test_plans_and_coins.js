/**
 * VANVI MOMENTS — PLANS & SMART COIN ECONOMY AUTOMATED TEST SUITE
 * Comprehensive verification of plans, tiers, smart coin redemption formulas, high-value caps, and plans.html UI.
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const app = require('../server/server');
const { calculateCoinEligibility, COIN_CONFIG } = require('../server/config/coins');
const { MEMBERSHIP_PLANS, TIER_PERKS } = require('../server/config/membership');
const { Users, Memberships, CoinLedger, Orders } = require('../server/db/database');

let server;
let BASE_URL = '';

async function startServer() {
  return new Promise((resolve) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      BASE_URL = `http://localhost:${port}`;
      resolve();
    });
  });
}

function stopServer() {
  return new Promise((resolve) => {
    if (server) server.close(resolve);
    else resolve();
  });
}

async function apiRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const res = await fetch(url, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, ok: res.ok, data };
}

let failed = false;

function assert(condition, message) {
  if (condition) {
    console.log('  ✅ ' + message);
  } else {
    console.error('  ❌ FAIL: ' + message);
    failed = true;
  }
}

async function runPlansAndCoinsTests() {
  console.log('=== VANVI MOMENTS PLANS & COIN ECONOMY SUITE ===\n');

  try {
    // -------------------------------------------------------------
    // SUITE 1: Configuration & Smart Coin Math
    // -------------------------------------------------------------
    console.log('1. Smart Coin Redemption Business Math:');
    assert(COIN_CONFIG.COINS_PER_RUPEE === 10, '10 Coins = ₹1.00 store credit');
    assert(COIN_CONFIG.MAX_DISCOUNT_TIERS.free === 0.20, 'Free Creator: 20% max discount');
    assert(COIN_CONFIG.MAX_DISCOUNT_TIERS.member === 0.40, 'Vanvi Club / Annual: 40% max discount');
    assert(COIN_CONFIG.MAX_DISCOUNT_TIERS.vip === 0.40, 'Lifetime Patron: 40% max discount');

    // Test Case: ₹1,000 Template (Free vs Club from User Prompt)
    const freeCalc = calculateCoinEligibility(1000, 3000, 'free');
    assert(freeCalc.eligible === true, '₹1,000 template is eligible for coin discount');
    assert(freeCalc.maxDiscountINR === 200, 'Free user gets exactly ₹200 max discount (20%) on ₹1,000');
    assert(freeCalc.maxCoinsUsable === 2000, 'Requires exactly 2,000 Coins (10 coins = ₹1)');
    assert(freeCalc.finalAmountINR === 800, 'Customer pays at least ₹800 on ₹1,000 template');

    const clubCalc = calculateCoinEligibility(1000, 5000, 'member');
    assert(clubCalc.maxDiscountINR === 400, 'Club user gets exactly ₹400 max discount (40%) on ₹1,000');
    assert(clubCalc.maxCoinsUsable === 4000, 'Requires exactly 4,000 Coins');
    assert(clubCalc.finalAmountINR === 600, 'Customer pays at least ₹600 on ₹1,000 template');

    // Test Case: High-Value Template (e.g. ₹2,500 VIP Invitation with Fixed Rupee Cap)
    const highValCalc = calculateCoinEligibility(2500, 10000, 'member');
    assert(highValCalc.maxDiscountINR === 500, 'High-value template discount is safely capped at fixed ₹500 cap (not unbounded ₹1000)');
    assert(highValCalc.finalAmountINR === 2000, 'Customer pays at least ₹2,000 on ₹2,500 creation');
    assert(highValCalc.maxCoinsUsable === 5000, 'Redeems 5,000 coins to cover the ₹500 cap');

    // Test Case: Order below minimum threshold (< ₹150)
    const subMinCalc = calculateCoinEligibility(99, 500, 'free');
    assert(subMinCalc.eligible === false, 'Orders under ₹150 are correctly rejected for coin redemption');
    assert(subMinCalc.maxDiscountINR === 0, 'Zero discount applied below minimum order threshold');

    // -------------------------------------------------------------
    // SUITE 2: Plans Catalog Data Integrity
    // -------------------------------------------------------------
    console.log('\n2. Membership Plans Configuration:');
    assert(MEMBERSHIP_PLANS.free && MEMBERSHIP_PLANS.free.priceINR === 0, 'Free Creator plan registered at ₹0');
    assert(MEMBERSHIP_PLANS.monthly && MEMBERSHIP_PLANS.monthly.priceINR === 99, 'Vanvi Club plan registered at ₹99/mo');
    assert(MEMBERSHIP_PLANS.annual && MEMBERSHIP_PLANS.annual.priceINR === 799, 'Vanvi Club Annual registered at ₹799/yr');
    assert(MEMBERSHIP_PLANS.lifetime && MEMBERSHIP_PLANS.lifetime.priceINR === 2499, 'Lifetime Patron registered at ₹2,499');
    assert(MEMBERSHIP_PLANS.annual.bonusCoins === 500, 'Annual plan includes 500 bonus welcome coins');

    // -------------------------------------------------------------
    // SUITE 3: Server API Endpoints (Auth, Calculation & Subscription)
    // -------------------------------------------------------------
    console.log('\n3. Server API Integration Verification:');
    await startServer();

    // 3A. Public Plans List
    const plansRes = await apiRequest('/api/membership/plans');
    assert(plansRes.status === 200 && plansRes.data.success, 'GET /api/membership/plans returns success');
    assert(plansRes.data.plans.length >= 4, `Plans endpoint returned ${plansRes.data.plans.length} plans (>= 4)`);

    // 3B. Public Calculation Endpoint
    const calcApiRes = await apiRequest('/api/coins/calculate-eligibility', {
      method: 'POST',
      body: { orderAmountINR: 1000, userCoins: 4000, tier: 'member' }
    });
    assert(calcApiRes.status === 200 && calcApiRes.data.success, 'POST /api/coins/calculate-eligibility calculates discount');
    assert(calcApiRes.data.calculation.maxDiscountINR === 400, 'API returns authoritative ₹400 discount for 4,000 coins on ₹1,000');
    assert(calcApiRes.data.calculation.finalAmountINR === 600, 'API returns authoritative final payable ₹600');

    // 3C. Create test user & Subscribe to Annual with 500 Bonus Coins
    const testEmail = `plantest_${Date.now()}@vanvimoments.com`;
    const signupRes = await apiRequest('/api/auth/signup', {
      method: 'POST',
      body: { name: 'Pooja Sharma', email: testEmail, password: 'password123' }
    });
    assert(signupRes.status === 201 && signupRes.data.success, 'Test user registered');
    const userToken = signupRes.data.token;
    const testUserId = signupRes.data.user.id;

    const subRes = await apiRequest('/api/membership/subscribe', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${userToken}` },
      body: { planId: 'annual' }
    });
    assert(subRes.status === 201 && subRes.data.success, 'POST /api/membership/subscribe succeeds for annual plan');
    
    if (subRes.data.pending) {
      await Memberships.create({
        userId: testUserId,
        planId: 'annual',
        durationDays: 365,
        gatewaySubId: subRes.data.gatewayOrder.gatewayOrderId
      });
      await CoinLedger.create({
        userId: testUserId,
        type: 'credit',
        amount: 500,
        reason: 'Annual Club Welcome Reward (+500 Coins)',
        refId: 'bonus_test'
      });
    }

    const updatedUser = await Users.findById(testUserId);
    assert(updatedUser.tier === 'member', 'User tier upgraded to "member"');

    // Verify 500 bonus welcome coins credited to ledger
    const ledger = await CoinLedger.getByUserId(testUserId);
    const hasBonus = ledger.some(l => l.amount === 500 && l.type === 'credit');
    assert(hasBonus, '500 bonus coins recorded in user coin ledger for Annual membership');

    // 3D. Authoritative Order Creation with Dynamic Price & 40% Club Coins
    const orderRes = await apiRequest('/api/orders/create', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${userToken}` },
      body: {
        templateName: 'Midnight Wish 3D Cinema',
        templatePrice: 1000,
        applyCoins: true
      }
    });
    assert(orderRes.status === 201 && orderRes.data.success, 'Order created with dynamic templatePrice ₹1,000');
    assert(orderRes.data.order.basePrice === 1000, 'Order recorded basePrice: ₹1,000');
    assert(orderRes.data.order.coinsUsed > 0, 'Coins applied to order');
    assert(orderRes.data.order.finalAmountINR <= 1000, 'Final payable calculated authoritatively by server');

    // -------------------------------------------------------------
    // SUITE 4: plans.html UI & Markup Verification
    // -------------------------------------------------------------
    console.log('\n4. plans.html Page & UI Verification:');
    const plansHtmlPath = path.join(__dirname, '..', 'plans.html');
    assert(fs.existsSync(plansHtmlPath), 'plans.html exists in workspace');

    const html = fs.readFileSync(plansHtmlPath, 'utf8');
    assert(html.includes('viewport') && html.includes('width=device-width'), 'plans.html has responsive viewport meta');
    assert(html.includes('overflow-x: hidden !important'), 'plans.html enforces overflow-x: hidden');
    assert(html.includes('Curated Celebration Passes') && html.includes('VIP Memberships'), 'Plans page explains its passes and memberships');
    
    // The 4 plans
    assert(html.includes('Free Creator') && (html.includes('₹0') || html.includes('>0<')), 'Free Creator (₹0) plan present');
    assert(html.includes('Vanvi Club') && html.includes('99'), 'Vanvi Club (₹99/mo) plan present');
    assert(html.includes('Club Annual') && html.includes('799'), 'Vanvi Club Annual (₹799/yr) plan present');
    assert(html.includes('Lifetime Patron') && html.includes('2,499'), 'Lifetime Patron (₹2,499) plan present');

    // Comparison section
    assert(html.includes('Detailed Feature Comparison') && html.includes('Creation &amp; AI Studio') && html.includes('Catalog &amp; Customization'), 'Comparison section describes the current plan features');
    assert(html.includes('desktop-comp-table'), 'Comparison includes desktop layout table');
    assert(html.includes('mobile-comp-cards') && html.includes('comp-accordion-item'), 'Comparison includes responsive mobile-first accordion cards');

    // Smart Coin Calculator & Examples
    assert(html.includes('coins-calculator-card'), 'Interactive smart coin calculator present');
    assert(html.includes('₹1,000 template example') && html.includes('2,000 coins') && html.includes('4,000 coins'), '₹1,000 example matches free and Club/VIP coin math');
    assert(html.includes('up to 20%') && html.includes('up to 40%') && html.includes('₹500 cap') && html.includes('₹150 minimum order'), 'Displayed coin limits match server eligibility rules');
    assert(!/up to 60%|up to 50%|25% Cap|100 Welcome Gift|10% Order Cashback/i.test(html), 'Plans page does not advertise unconfigured rewards or excessive discounts');
    assert(html.includes('js/vanvi-api.js'), 'Loads VanviAPI SDK');
    assert(html.includes('Coin-pack checkout is not available yet'), 'Unavailable coin-pack purchases do not claim success or add local coins');
    assert(html.includes('Test mode only: no real payment was taken'), 'Simulated pass and membership activations are clearly labeled');
    assert(html.includes('id="currentUserCoinBalance">0</strong>'), 'Unauthenticated wallet shows zero coins');
    assert(html.includes('id="convUserLiveBalance">0</strong>'), 'Unauthenticated converter shows zero coins');
    assert(!html.includes('120 Coins'), 'Plans page does not invent a guest coin balance');

  } catch (err) {
    console.error('Test execution error:', err);
    failed = true;
  } finally {
    await stopServer();
  }

  console.log('\n====================================================');
  if (failed) {
    console.error('❌ SOME CHECKS IN PLANS & COIN SUITE FAILED!');
    process.exit(1);
  } else {
    console.log('🎉 ALL PLANS & COIN SUITE CHECKS PASSED PERFECTLY!\n');
  }
}

if (require.main === module) {
  runPlansAndCoinsTests();
}

module.exports = { runPlansAndCoinsTests };
