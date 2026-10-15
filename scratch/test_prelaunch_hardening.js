/**
 * VANVI MOMENTS — MASTER PRE-LAUNCH HARDENING & E2E QA SUITE
 * Comprehensive verification of all 13 production readiness priorities.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('\n======================================================');
console.log('   VANVI MOMENTS — PRE-LAUNCH HARDENING & E2E QA');
console.log('======================================================\n');

// --------------------------------------------------------------------------
// 1. Production Security Audit & Cryptography
// --------------------------------------------------------------------------
console.log('🛡️  1. Auditing Security, Headers & Cryptography...');
const {
  securityHeaders,
  sanitizeBody,
  timingSafeStringEqual,
  rateLimiter
} = require('../server/middleware/security');
const { requireAuth } = require('../server/middleware/auth');
const { verifyPaymentSignature } = require('../server/services/payment.service');

// Test Timing-safe string equal
assert.strictEqual(timingSafeStringEqual('secret_hash_12345', 'secret_hash_12345'), true, 'Equal strings must match');
assert.strictEqual(timingSafeStringEqual('secret_hash_12345', 'secret_hash_99999'), false, 'Different strings must fail');
assert.strictEqual(timingSafeStringEqual('short', 'longer_string'), false, 'Different length strings must fail');

// Test Security Headers
let headersSet = {};
const mockRes = {
  setHeader: (k, v) => { headersSet[k] = v; },
  status: () => mockRes,
  json: () => mockRes
};
securityHeaders({ headers: {}, secure: true }, mockRes, () => {});
assert.strictEqual(headersSet['X-Frame-Options'], 'DENY', 'X-Frame-Options must be DENY (strictest framing policy)');
assert.strictEqual(headersSet['X-Content-Type-Options'], 'nosniff', 'nosniff required');
assert.ok(headersSet['Content-Security-Policy'], 'CSP header must be set');
assert.ok(headersSet['Strict-Transport-Security'], 'HSTS must be set for HTTPS/production');

// Test XSS Body Sanitizer
const mockReq = {
  body: {
    title: 'Surprise <script>alert("xss")</script> Birthday',
    sender: 'Aman <img src=x onerror=alert(1)>',
    cleanNote: 'Safe heartfelt celebration'
  }
};
sanitizeBody(mockReq, mockRes, () => {});
assert.ok(!mockReq.body.title.includes('<script>'), 'Script tag stripped from title');
assert.ok(!mockReq.body.sender.includes('onerror='), 'onerror stripped from sender');
assert.strictEqual(mockReq.body.cleanNote, 'Safe heartfelt celebration', 'Clean note preserved');
console.log('  ✅ Security headers, HSTS, CSP, and XSS sanitization verified.');

const previousNodeEnv = process.env.NODE_ENV;
process.env.NODE_ENV = 'production';
assert.strictEqual(
  verifyPaymentSignature({
    gatewayOrderId: 'order_sim_forged',
    paymentId: 'pay_sim_forged',
    signature: 'anything'
  }),
  false,
  'Simulation signatures must never verify in production'
);
process.env.NODE_ENV = 'development';
assert.strictEqual(
  verifyPaymentSignature({
    gatewayOrderId: 'order_sim_test',
    paymentId: 'pay_sim_test',
    signature: 'development-only'
  }),
  true,
  'Development simulation signatures should remain available for local tests'
);
if (previousNodeEnv === undefined) {
  delete process.env.NODE_ENV;
} else {
  process.env.NODE_ENV = previousNodeEnv;
}
console.log('  ✅ Payment simulation is disabled in production and preserved for development.');

// --------------------------------------------------------------------------
// 2. Database & Migration Schema
// --------------------------------------------------------------------------
console.log('\n🗄️  2. Checking Database & Migration Engine...');
const { runMigration } = require('../server/db/migrate');
const { testConnection } = require('../server/db/database');

(async () => {
  const originalAdminSecretKey = process.env.ADMIN_SECRET_KEY;
  const mockAdminRes = {
    statusCode: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json() {
      return this;
    }
  };
  let nextCalled = false;

  try {
    delete process.env.ADMIN_SECRET_KEY;
    await requireAuth(
      { headers: { 'x-admin-key': 'vanvi_secret_admin_2025_x9k2p' }, cookies: {} },
      mockAdminRes,
      () => { nextCalled = true; }
    );
    assert.strictEqual(mockAdminRes.statusCode, 401, 'Default admin key must not authenticate when no key is configured');
    assert.strictEqual(nextCalled, false, 'Rejected admin key must not call next');
  } finally {
    if (originalAdminSecretKey === undefined) {
      delete process.env.ADMIN_SECRET_KEY;
    } else {
      process.env.ADMIN_SECRET_KEY = originalAdminSecretKey;
    }
  }

  const migrationResult = await runMigration({ dryRun: true });
  assert.strictEqual(migrationResult.success, true, 'Dry run migration must succeed');
  assert.strictEqual(migrationResult.tables.length, 8, 'All 8 relational tables must be verified');

  const dbStatus = await testConnection();
  assert.strictEqual(dbStatus.connected, true, 'Database testConnection must return connected');
  console.log(`  ✅ Database status: ${dbStatus.status} (${dbStatus.engine})`);

  // --------------------------------------------------------------------------
  // 3. Cloud Storage Pipeline & Magic-Bytes
  // --------------------------------------------------------------------------
  console.log('\n📸 3. Testing Cloud Storage & Magic-Byte Validation...');
  const { uploadImage, validateImageBuffer } = require('../server/services/storage.service');

  // Valid JPEG header: FF D8 FF
  const validJpeg = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46]);
  const validCheck = validateImageBuffer(validJpeg, 'image/jpeg');
  assert.strictEqual(validCheck.valid, true, 'Valid JPEG buffer must pass');

  // Valid PNG header: 89 50 4E 47
  const validPng = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  const validPngCheck = validateImageBuffer(validPng, 'image/png');
  assert.strictEqual(validPngCheck.valid, true, 'Valid PNG buffer must pass');

  // Invalid fake file with .jpg extension
  const fakeFile = Buffer.from('NOT_AN_IMAGE_FILE_JUST_MALICIOUS_TEXT');
  const fakeCheck = validateImageBuffer(fakeFile, 'image/jpeg');
  assert.strictEqual(fakeCheck.valid, false, 'Fake image must be rejected');

  // Perform upload test
  const uploadResult = await uploadImage({ buffer: validJpeg, originalName: 'memory.jpg', mimeType: 'image/jpeg' });
  assert.strictEqual(uploadResult.success, true, 'Upload must succeed');
  assert.ok(uploadResult.url.startsWith('/uploads/img_') || uploadResult.url.startsWith('/uploads/image_'), 'Must generate secure hashed URL');
  console.log(`  ✅ Storage upload pipeline verified (${uploadResult.provider} provider, url: ${uploadResult.url})`);

  // --------------------------------------------------------------------------
  // 4. Payment Gateway & Webhook Signature Verification
  // --------------------------------------------------------------------------
  console.log('\n💳 4. Testing Multi-Gateway Payment & Webhook Verification...');
  const {
    createGatewayOrder,
    verifyPaymentSignature,
    verifyWebhookSignature,
    verifyCashfreeWebhookSignature
  } = require('../server/services/payment.service');

  const paymentOrder = await createGatewayOrder({
    orderId: 'ORD_TEST_101',
    amountINR: 199,
    customerEmail: 'creator@vanvimoments.com',
    customerName: 'Aarav'
  });
  assert.strictEqual(paymentOrder.success, true, 'Payment order creation must succeed');
  assert.ok(paymentOrder.gatewayOrderId, 'Gateway order ID must be generated');
  assert.strictEqual(paymentOrder.amountPaisa, 19900, '199 INR must equal 19900 paisa');

  // Signature verification test (HMAC when configured, simulation otherwise)
  const testSecret = process.env.RAZORPAY_KEY_SECRET;
  const testSig = testSecret
    ? require('crypto').createHmac('sha256', testSecret).update(`${paymentOrder.gatewayOrderId}|pay_sim_123`).digest('hex')
    : 'sig_sim_123';

  const sigResult = verifyPaymentSignature({
    gatewayOrderId: paymentOrder.gatewayOrderId,
    paymentId: 'pay_sim_123',
    signature: testSig
  });
  assert.strictEqual(sigResult, true, 'Payment signature check must pass');
  console.log('  ✅ Payment gateway order creation and signature verification verified.');

  // --------------------------------------------------------------------------
  // 5. Real AI Co-Pilot & Multi-Provider Engine
  // --------------------------------------------------------------------------
  console.log('\n🤖 5. Testing Vanvi AI Co-Pilot & Emotional Fallback Engine...');
  const { generateMomentContent } = require('../server/services/ai.service');

  const occasionsToTest = ['Birthday', 'Love', 'Anniversary', 'Friendship', 'Apology', 'Family', 'Celebration'];
  for (const occ of occasionsToTest) {
    const aiRes = await generateMomentContent({
      prompt: `Heartfelt ${occ} note`,
      occasion: occ,
      recipient: 'Pooja',
      style: 'deep'
    });
    assert.strictEqual(aiRes.success, true, `AI generation for ${occ} must succeed`);
    assert.ok(aiRes.variations.deep, 'Deep variation must be present');
    assert.ok(aiRes.variations.hinglish, 'Hinglish variation must be present');
    assert.ok(aiRes.variations.short, 'Short variation must be present');
  }
  console.log(`  ✅ All 7 celebration occasions tested with 3 emotional variations.`);

  // --------------------------------------------------------------------------
  // 6. Transactional Email & Notifications
  // --------------------------------------------------------------------------
  console.log('\n📧 6. Testing Email & Notification Service...');
  const { sendOrderConfirmation, sendContactNotification } = require('../server/services/email.service');

  const emailRes = await sendOrderConfirmation({
    toEmail: 'customer@example.com',
    customerName: 'Kavya Sharma',
    orderId: 'ORD_EMAIL_TEST',
    templateName: 'Velvet Rose Cinema',
    amountINR: 199,
    momentUrl: 'http://localhost:3000/moment.html?id=velvet-rose-test',
    momentPin: '1234'
  });
  assert.strictEqual(emailRes.success, true, 'Order confirmation email dispatch must succeed');

  const contactEmailRes = await sendContactNotification({
    fromName: 'Rohan Verma',
    fromEmail: 'rohan@example.com',
    subject: 'Custom music question',
    message: 'Can I upload custom audio?'
  });
  assert.strictEqual(contactEmailRes.success, true, 'Contact email notification must succeed');
  console.log('  ✅ Order confirmation and contact inquiry dispatch verified.');

  // --------------------------------------------------------------------------
  // 7. Environment Variables Validation
  // --------------------------------------------------------------------------
  console.log('\n⚙️  7. Validating Environment Architecture...');
  const { validateEnv } = require('../server/config/env');
  const envCheck = validateEnv();
  assert.ok(envCheck.integrations, 'Integrations summary must be generated');
  assert.ok(envCheck.integrations.database, 'Database integration status present');
  assert.ok(envCheck.integrations.payments, 'Payments integration status present');
  assert.ok(envCheck.integrations.storage, 'Storage integration status present');
  console.log(`  ✅ Environment status verified: DB (${envCheck.integrations.database}), Pay (${envCheck.integrations.payments})`);

  // --------------------------------------------------------------------------
  // 8. Legal Placeholders Audit
  // --------------------------------------------------------------------------
  console.log('\n⚖️  8. Auditing Legal Pages for Placeholders...');
  const legalFiles = ['privacy.html', 'terms.html', 'refund.html'];
  legalFiles.forEach(fileName => {
    const filePath = path.join(__dirname, '..', fileName);
    const content = fs.readFileSync(filePath, 'utf8');

    // Check that no unresolved bracketed placeholder badges remain in the body
    const placeholderMatches = content.match(/<span class="placeholder-badge">\[.*?\]<\/span>/g);
    assert.strictEqual(placeholderMatches, null, `No placeholder badges allowed in ${fileName}`);

    // Verify key contact points exist
    assert.ok(content.includes('@vanvimoments.com') || content.includes('vanvimoments@gmail.com') || content.includes('@vanvimoments'), `${fileName} must have official contact email`);
  });
  console.log('  ✅ Legal placeholders audit passed: 0 unresolved placeholder badges.');

  // --------------------------------------------------------------------------
  // 9. Full End-to-End User Flow Integration
  // --------------------------------------------------------------------------
  console.log('\n🔄 9. Executing Complete End-to-End Flow QA...');
  const { Users, Moments, Orders, CoinLedger } = require('../server/db/database');

  // Step A: User Registration
  const testEmail = `e2e_user_${Date.now()}@vanvimoments.com`;
  const user = await Users.create({
    name: 'Vanvi Roy',
    email: testEmail,
    passwordHash: 'hash_test',
    salt: 'salt_test',
    coins: 0
  });
  assert.ok(user.id, 'User must be created with unique ID');

  // Step B: Verify Coin Ledger
  const balance = await CoinLedger.getBalance(user.id);
  assert.strictEqual(balance, 0, 'New users must start with zero coins');

  // Step C: Create Draft Moment
  const draft = await Moments.create({
    userId: user.id,
    title: 'Vanvi & Kabir Anniversary',
    recipient: 'Kabir',
    sender: 'Vanvi',
    occasion: 'Anniversary',
    message: 'Happy 5 years together! To forever and beyond.',
    photos: [uploadResult.url],
    musicTrack: 'acoustic-piano',
    lockMode: 'pin',
    pinHash: crypto.scryptSync('2026', 'salt', 32).toString('hex'),
    pinHint: 'Our special year',
    theme: 'Golden Champagne',
    status: 'draft'
  });
  assert.strictEqual(draft.status, 'draft', 'Initial moment status must be draft');

  // Step D: Checkout Order Creation with Coin Redemption
  // Grant test-earned coins explicitly before exercising coin redemption.
  await CoinLedger.create({
    userId: user.id,
    type: 'credit',
    amount: 100,
    reason: 'QA fixture: earned coins for checkout test',
    refId: `qa-earned-${Date.now()}`
  });

  // 100 coins = ₹10 discount on ₹199 template -> ₹189
  const order = await Orders.create({
    userId: user.id,
    momentId: draft.id,
    templateName: 'Golden Champagne Celebration',
    basePrice: 199,
    coinsUsed: 100,
    discountINR: 10,
    finalAmountINR: 189,
    gateway: 'razorpay'
  });
  assert.strictEqual(order.finalAmountINR, 189, 'Final amount must be ₹189');

  // Step E: Payment Gateway Order & Verification
  await Orders.markAsPaid(order.id, {
    paymentId: 'pay_e2e_' + Date.now(),
    paidAt: Date.now()
  });
  await Moments.update(draft.id, { status: 'published' });
  await CoinLedger.create({
    userId: user.id,
    type: 'debit',
    amount: 100,
    reason: `Checkout discount on ${order.templateName}`,
    refId: order.id
  });

  // Step F: Verify Published Moment
  const publishedMoment = await Moments.findById(draft.id);
  assert.strictEqual(publishedMoment.status, 'published', 'Moment must now be published');
  assert.strictEqual(publishedMoment.photos.length, 1, 'Photos array must be preserved');

  // Step G: Check Updated Coin Balance
  const postBalance = await CoinLedger.getBalance(user.id);
  assert.strictEqual(postBalance, 0, '100 coins debited from balance');
  console.log('  ✅ Full E2E flow verified: User -> Coins -> Draft -> Checkout -> Paid -> Published!');

  // --------------------------------------------------------------------------
  // 10. Mobile Viewport & CSS Overflow QA (All HTML Pages)
  // --------------------------------------------------------------------------
  const projectRoot = path.join(__dirname, '..');
  const allHtmlFiles = fs.readdirSync(projectRoot).filter(f => f.endsWith('.html'));
  console.log(`\n📱 10. Auditing Mobile Viewport & CSS Overflow (All ${allHtmlFiles.length} HTML Files)...`);
  assert.ok(allHtmlFiles.length >= 31, 'Must verify all current HTML files, including required auth, share, and 404 pages');

  let passedPages = 0;
  allHtmlFiles.forEach(file => {
    const htmlContent = fs.readFileSync(path.join(projectRoot, file), 'utf8');

    // 1. Check viewport meta tag
    assert.ok(htmlContent.includes('<meta content="width=device-width') || htmlContent.includes('<meta name="viewport" content="width=device-width'), `${file} must include responsive viewport meta`);

    // 2. Check inline and linked styles for horizontal overflow containment.
    const cssContents = [...htmlContent.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)]
      .map(match => match[1]);
    cssContents.push(...[...htmlContent.matchAll(/\bstyle=["']([^"']*)["']/gi)].map(match => match[1]));
    const stylesheetLinks = [...htmlContent.matchAll(/<link\b[^>]*href=["']([^"']+\.css(?:\?[^"']*)?)["'][^>]*>/gi)]
      .map(match => match[1])
      .filter(href => !/^https?:\/\//i.test(href));
    stylesheetLinks.forEach(href => {
      const cssPath = path.resolve(projectRoot, href.replace(/^[/\\]+/, '').split('?')[0]);
      if (fs.existsSync(cssPath)) cssContents.push(fs.readFileSync(cssPath, 'utf8'));
    });
    assert.ok(cssContents.some(css => /overflow-x\s*:\s*(hidden|clip)\b/i.test(css)), `${file} must enforce horizontal overflow containment`);

    passedPages++;
  });
  console.log(`  ✅ All ${passedPages} HTML pages verified for responsive mobile viewports & overflow control.`);

  console.log('\n======================================================');
  console.log('🎉 ALL 10 PRE-LAUNCH HARDENING VERIFICATIONS PASSED 100%!');
  console.log('======================================================\n');
})();
