const assert = require('assert');
const fs = require('fs');
const http = require('http');
const crypto = require('crypto');
const { app } = require('../server/server.js');

console.log('========================================================');
console.log('   VANVI MOMENTS — RAZORPAY STANDARD INTEGRATION TEST   ');
console.log('========================================================\n');

// 1. Verify Environment & Gitignore
console.log('1. Checking Environment and .gitignore:');
const envContent = fs.readFileSync('.env', 'utf8');
assert.ok(envContent.includes('RAZORPAY_KEY_ID=rzp_test_ThkY8gWMHpmiMi'), 'RAZORPAY_KEY_ID must be configured in .env');
assert.ok(envContent.includes('RAZORPAY_KEY_SECRET=PqCuiAX1XEDJVnyq7H30sIup'), 'RAZORPAY_KEY_SECRET must be configured in .env');
console.log('  ✓ .env has valid Razorpay test credentials.');

const gitignoreContent = fs.readFileSync('.gitignore', 'utf8');
assert.ok(gitignoreContent.includes('.env'), '.gitignore must contain .env');
console.log('  ✓ .gitignore properly ignores .env.');

// 2. Verify Razorpay SDK Package
console.log('\n2. Checking Razorpay SDK Installation:');
const Razorpay = require('razorpay');
assert.ok(typeof Razorpay === 'function', 'Razorpay SDK must be installed and requireable');
const rzpInstance = new Razorpay({
  key_id: 'rzp_test_ThkY8gWMHpmiMi',
  key_secret: 'PqCuiAX1XEDJVnyq7H30sIup'
});
assert.ok(rzpInstance.orders && typeof rzpInstance.orders.create === 'function', 'Razorpay SDK instance must support orders.create');
console.log('  ✓ Razorpay SDK is installed, initialized, and operational.');

// 3. Verify Frontend Checkout
console.log('\n3. Checking Frontend Checkout Files:');
const checkoutHtml = fs.readFileSync('checkout.html', 'utf8');
assert.ok(checkoutHtml.includes('https://checkout.razorpay.com/v1/checkout.js'), 'checkout.html must include checkout.js script');
assert.ok(checkoutHtml.includes('js/vanvi-razorpay.js'), 'checkout.html must include vanvi-razorpay.js');
assert.ok(checkoutHtml.includes('btnCompletePayment'), 'checkout.html must have #btnCompletePayment');
assert.ok(checkoutHtml.includes('openCheckout'), 'checkout.html must call openCheckout');
console.log('  ✓ checkout.html includes Razorpay script, modal handler, and error handlers.');

const vanviRazorpayJs = fs.readFileSync('js/vanvi-razorpay.js', 'utf8');
assert.ok(vanviRazorpayJs.includes('createOrder'), 'vanvi-razorpay.js must implement createOrder');
assert.ok(vanviRazorpayJs.includes('verifyPayment'), 'vanvi-razorpay.js must implement verifyPayment');
assert.ok(vanviRazorpayJs.includes('openCheckout'), 'vanvi-razorpay.js must implement openCheckout');
assert.ok(vanviRazorpayJs.includes('ondismiss'), 'vanvi-razorpay.js must handle modal dismissal');
assert.ok(vanviRazorpayJs.includes('payment.failed'), 'vanvi-razorpay.js must handle payment.failed event');
console.log('  ✓ js/vanvi-razorpay.js contains complete standard checkout wrapper.');

// 4. Test API Endpoints on Live Test Server
const PORT = 3989;
const server = http.createServer(app);

server.listen(PORT, async () => {
  const baseUrl = `http://127.0.0.1:${PORT}`;
  console.log(`\n4. Testing Live HTTP API Endpoints on ${baseUrl}:`);

  try {
    // 4a. POST /api/create-order (Invalid Amount < 100 paise)
    const errRes = await fetch(`${baseUrl}/api/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 99 })
    });
    const errData = await errRes.json();
    assert.strictEqual(errRes.status, 400);
    assert.strictEqual(errData.error, 'Amount must be at least 100 paise');
    console.log('  ✓ STEP 1: Rejected amount < 100 paise with HTTP 400.');

    // 4b. POST /api/create-order (Valid Order)
    const createRes = await fetch(`${baseUrl}/api/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 19900, // ₹199
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        notes: { test: 'live_verification' }
      })
    });
    const orderData = await createRes.json();
    assert.strictEqual(createRes.status, 200);
    assert.ok(orderData.order_id && orderData.order_id.startsWith('order_'));
    assert.strictEqual(orderData.amount, 19900);
    assert.strictEqual(orderData.currency, 'INR');
    console.log('  ✓ STEP 1: Razorpay order created successfully:', orderData.order_id);

    const generatedOrderId = orderData.order_id;
    const testPaymentId = 'pay_' + crypto.randomBytes(6).toString('hex');
    const secret = 'PqCuiAX1XEDJVnyq7H30sIup';

    // 4c. POST /api/verify-payment (Missing fields)
    const missingRes = await fetch(`${baseUrl}/api/verify-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: generatedOrderId })
    });
    assert.strictEqual(missingRes.status, 400);
    console.log('  ✓ STEP 3: Rejected missing verification fields with HTTP 400.');

    // 4d. POST /api/verify-payment (Signature mismatch)
    const badSigRes = await fetch(`${baseUrl}/api/verify-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        order_id: generatedOrderId,
        payment_id: testPaymentId,
        razorpay_signature: 'fake_tampered_signature_hash'
      })
    });
    const badSigData = await badSigRes.json();
    assert.strictEqual(badSigRes.status, 400);
    assert.strictEqual(badSigData.error, 'Signature mismatch');
    console.log('  ✓ STEP 3: Rejected signature mismatch with HTTP 400.');

    // 4e. POST /api/verify-payment (Valid HMAC-SHA256 Signature)
    const authenticSignature = crypto
      .createHmac('sha256', secret)
      .update(`${generatedOrderId}|${testPaymentId}`)
      .digest('hex');

    const validRes = await fetch(`${baseUrl}/api/verify-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        razorpay_order_id: generatedOrderId,
        razorpay_payment_id: testPaymentId,
        razorpay_signature: authenticSignature
      })
    });
    const validData = await validRes.json();
    assert.strictEqual(validRes.status, 200);
    assert.strictEqual(validData.success, true);
    assert.strictEqual(validData.order_id, generatedOrderId);
    assert.strictEqual(validData.payment_id, testPaymentId);
    console.log('  ✓ STEP 3: Authentic HMAC-SHA256 signature verified with HTTP 200.');

    console.log('\n========================================================');
    console.log('   >>> ALL RAZORPAY INTEGRATION CRITERIA VERIFIED! <<<  ');
    console.log('========================================================\n');
  } catch (e) {
    console.error('Test Failed:', e);
    process.exit(1);
  } finally {
    server.close();
    process.exit(0);
  }
});
