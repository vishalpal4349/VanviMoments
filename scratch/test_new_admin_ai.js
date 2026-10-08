const assert = require('assert');
const { chatAdminCopilot } = require('../server/services/admin-copilot.service');
const { adminCmsService } = require('../server/services/admin-cms.service');

async function testNewAdminAiCommands() {
  console.log('Testing Vanvi Admin AI new commands...');

  // 1. Price command with plan & confirmation
  const res1 = await chatAdminCopilot({
    message: 'Birthday template ki price 1999 kar do'
  });
  console.log('Res1 requires confirmation:', res1.requiresConfirmation);
  assert.strictEqual(res1.requiresConfirmation, true);
  assert.ok(res1.pendingAction);

  // 1b. Now confirm
  const res1Confirmed = await chatAdminCopilot({
    message: 'haan confirm karo',
    confirmed: true,
    pendingAction: res1.pendingAction
  });
  console.log('Res1 Confirmed action:', res1Confirmed.actionExecuted);
  assert.strictEqual(res1Confirmed.actionExecuted.action, 'UPDATE_TEMPLATE_PRICE');
  assert.strictEqual(res1Confirmed.actionExecuted.newPrice, 1999);

  // Verify in database
  const tpl = adminCmsService.getTemplate('birthday-wish-1');
  assert.strictEqual(tpl.price, 1999);
  console.log('✓ Verified in database: Birthday Wish 01 price is now', tpl.price);

  // 2. Duplicate preset command
  const res2 = await chatAdminCopilot({
    message: 'Is preset ko duplicate karke wedding version banao',
    confirmed: true
  });
  console.log('Res2:', res2.actionExecuted);
  assert.strictEqual(res2.actionExecuted.action, 'DUPLICATE_PRESET');

  // 3. Unpublished templates query
  const res3 = await chatAdminCopilot({
    message: 'Sab unpublished templates dikhao'
  });
  console.log('Res3 reply has templates info:', res3.reply.includes('Unpublished'));
  assert.ok(res3.reply.includes('Unpublished') || res3.reply.includes('Templates'));

  console.log('🎉 ALL NEW VANVI ADMIN AI COMMANDS PASSED!');
}

testNewAdminAiCommands().catch(err => {
  console.error(err);
  process.exit(1);
});
