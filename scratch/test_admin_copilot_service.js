const assert = require('assert');
const { chatAdminCopilot } = require('../server/services/admin-copilot.service');
const { Users, getStore, saveStore } = require('../server/db/database');

async function runTest() {
  console.log('=== TESTING ADMIN GPT AUTONOMOUS COPILOT ===\n');

  // 1. Create a test user with unique email
  const testEmail = `priya_${Date.now()}@vanvimoments.shop`;
  const testUser = await Users.create({
    name: 'Priya Test',
    email: testEmail,
    coins: 50,
    tier: 'free'
  });
  console.log('1. Created test user:', testUser.name, 'with coins:', testUser.coins);

  // 2. Test Coin Adjustment Command
  console.log('\n2. Testing Autonomous Coin Adjustment:');
  const coinRes = await chatAdminCopilot({
    message: `${testEmail} ko 500 coins gift kar do`
  });
  console.log('Copilot Reply:', coinRes.reply);
  console.log('Action Executed:', coinRes.actionExecuted);

  assert.strictEqual(coinRes.success, true);
  assert.ok(coinRes.actionExecuted);
  assert.strictEqual(coinRes.actionExecuted.action, 'ADJUST_COINS');
  assert.strictEqual(coinRes.actionExecuted.currentCoins, 550);

  const reloadedUser = await Users.findById(testUser.id);
  assert.strictEqual(reloadedUser.coins, 550);
  console.log('✓ Database verified: User coins updated to', reloadedUser.coins);

  // 3. Test Promo Coupon Creation Command
  console.log('\n3. Testing Autonomous Promo Coupon Creation:');
  const freshCode = 'FESTIVE' + Math.floor(1000 + Math.random() * 9000);
  const couponRes = await chatAdminCopilot({
    message: `ek naya promo coupon bana do code ${freshCode} 40% discount wala`
  });
  console.log('Copilot Reply:', couponRes.reply);
  console.log('Action Executed:', couponRes.actionExecuted);

  assert.strictEqual(couponRes.success, true);
  assert.ok(couponRes.actionExecuted);
  assert.strictEqual(couponRes.actionExecuted.action, 'CREATE_COUPON');

  const store = getStore();
  const createdCoupon = (store.coupons || []).find(c => c.code === freshCode);
  assert.ok(createdCoupon, `Coupon ${freshCode} must exist in store`);
  assert.strictEqual(createdCoupon.value, 40);
  console.log('✓ Database verified: Coupon', createdCoupon.code, 'created with value', createdCoupon.value + '%');

  // 4. Test Maintenance Mode Toggle
  console.log('\n4. Testing Autonomous Maintenance Mode Toggle:');
  store.settings.maintenanceMode = false;
  saveStore(store);

  const maintRes = await chatAdminCopilot({
    message: 'maintenance mode on kar do'
  });
  console.log('Copilot Reply:', maintRes.reply);
  console.log('Action Executed:', maintRes.actionExecuted);

  assert.strictEqual(maintRes.success, true);
  assert.ok(maintRes.actionExecuted);
  assert.strictEqual(maintRes.actionExecuted.action, 'TOGGLE_MAINTENANCE');
  const freshStore = getStore();
  assert.strictEqual(freshStore.settings.maintenanceMode, true);
  console.log('✓ Database verified: Maintenance mode set to', freshStore.settings.maintenanceMode);

  // 5. Test Revenue & Orders Query
  console.log('\n5. Testing Live Platform Metrics Query:');
  const statsRes = await chatAdminCopilot({
    message: 'aaj ka revenue aur orders summary dikhao'
  });
  console.log('Copilot Reply:', statsRes.reply);
  assert.strictEqual(statsRes.success, true);
  assert.ok(statsRes.reply && statsRes.reply.length > 10);
  console.log('✓ Verified: Autonomous metrics reply generated successfully.');

  // Clean up test user
  await Users.delete(testUser.id);
  console.log('\n🎉 ALL ADMIN AUTONOMOUS COPILOT TESTS PASSED PERFECTLY! 🎉\n');
}

runTest().catch(err => {
  console.error('Test Error:', err);
  process.exit(1);
});
