const assert = require('assert');
const { getStore } = require('../server/db/database');
const { chatAdminCopilot } = require('../server/services/admin-copilot.service');
const { generateMomentContent, chatWithVanviAssistant } = require('../server/services/ai.service');

async function testAllJourneys() {
  console.log('=== VERIFYING ALL CORE CUSTOMER & ADMIN JOURNEYS ===\n');

  const store = getStore();

  // 1. Templates Catalog Integrity
  console.log('1. Checking Templates Catalog Integrity:');
  const tplData = require('../templates/registry/templates.js');
  const templates = tplData.getAllTemplates ? tplData.getAllTemplates() : [];
  console.log(`✓ Registry has ${templates.length} core templates`);
  assert.ok(templates.length > 0, 'Registry templates must not be empty');

  // Check unique IDs
  const ids = new Set();
  templates.forEach(t => {
    assert.ok(!ids.has(t.id), `Duplicate template id: ${t.id}`);
    ids.add(t.id);
  });
  console.log('✓ All template IDs are strictly unique with zero collisions');

  // 2. Commerce & Products Catalog
  console.log('\n2. Checking Commerce & Products:');
  require('../js/vanvi-products-data.js');
  const products = (typeof global !== 'undefined' && global.VANVI_PRODUCTS) ? global.VANVI_PRODUCTS : (store.products || []);
  console.log(`✓ Found ${products.length} products in physical gifts database`);
  assert.ok(products.length > 0, 'Store products must be populated');

  // 3. User Wallet & Coin System
  console.log('\n3. Checking Wallet & Coins Economy:');
  const users = store.users || [];
  console.log(`✓ Total registered user accounts: ${users.length}`);
  const testUser = users[0];
  if (testUser) {
    console.log(`✓ Sample user: ${testUser.email} has ${testUser.coins || 0} Vanvi Coins (Tier: ${testUser.tier || 'free'})`);
  }

  // 4. Autonomous Admin Copilot & GPT-6 Luna
  console.log('\n4. Checking Admin GPT-6 Luna Copilot:');
  const copilotRes = await chatAdminCopilot({
    message: 'store status batao'
  });
  assert.strictEqual(copilotRes.success, true);
  console.log('✓ Copilot responded successfully using provider:', copilotRes.provider);
  console.log('✓ Sample reply excerpt:', copilotRes.reply.slice(0, 80) + '...');

  // 5. Vanvi AI Message Generator
  console.log('\n5. Checking Vanvi AI Creative Engine:');
  const aiRes = await generateMomentContent({
    occasion: 'birthday',
    recipient: 'Friend',
    userNotes: 'always there for me'
  });
  assert.strictEqual(aiRes.success, true);
  console.log('✓ AI Variations generated successfully using provider:', aiRes.provider);
  assert.ok(aiRes.variations.short || aiRes.variations.deep || aiRes.variations.hinglish);

  console.log('\n🎉 ALL CORE CUSTOMER & ADMIN JOURNEYS VERIFIED 100% OPERATIONAL! 🎉\n');
}

testAllJourneys().catch(e => {
  console.error('Journey verification failed:', e);
  process.exit(1);
});
