const assert = require('assert');
const http = require('http');
const crypto = require('crypto');
const { app } = require('../server/server.js');

const PORT = 3987;
const server = http.createServer(app);

server.listen(PORT, async () => {
  console.log(`Test server running on port ${PORT}`);

  try {
    const baseUrl = `http://127.0.0.1:${PORT}`;

    // Test 1: GET /api/payment-config
    console.log('\n--- 1. Testing GET /api/payment-config ---');
    const configRes = await fetch(`${baseUrl}/api/payment-config`);
    const configData = await configRes.json();
    assert.strictEqual(configRes.status, 200);
    assert.strictEqual(configData.key_id, 'rzp_test_ThkY8gWMHpmiMi');
    console.log('✓ Config endpoint returned correct public key_id:', configData.key_id);

    // Test 2: POST /api/create-order with amount < 100 paise (Should fail with 400)
    console.log('\n--- 2. Testing POST /api/create-order with invalid amount ---');
    const lowAmountRes = await fetch(`${baseUrl}/api/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 50, currency: 'INR' })
    });
    const lowAmountData = await lowAmountRes.json();
    assert.strictEqual(lowAmountRes.status, 400);
    assert.ok(lowAmountData.error.includes('100 paise'));
    console.log('✓ Rejected low amount with 400:', lowAmountData.error);

    // Test 3: POST /api/create-order with valid amount (Should succeed with live Razorpay order)
    console.log('\n--- 3. Testing POST /api/create-order with valid amount ---');
    const createOrderRes = await fetch(`${baseUrl}/api/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 14900, // ₹149.00 in paise
        currency: 'INR',
        receipt: `test_rcpt_${Date.now()}`
      })
    });
    const createOrderData = await createOrderRes.json();
    assert.strictEqual(createOrderRes.status, 200);
    assert.ok(createOrderData.order_id);
    assert.strictEqual(createOrderData.amount, 14900);
    assert.strictEqual(createOrderData.currency, 'INR');
    console.log('✓ Successfully created Razorpay order:', createOrderData);

    const generatedOrderId = createOrderData.order_id;
    const testPaymentId = 'pay_live_test_' + Date.now();
    const keySecret = 'PqCuiAX1XEDJVnyq7H30sIup';

    // Test 4: POST /api/verify-payment with Missing Fields (Should fail with 400)
    console.log('\n--- 4. Testing POST /api/verify-payment with missing fields ---');
    const missingRes = await fetch(`${baseUrl}/api/verify-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: generatedOrderId })
    });
    const missingData = await missingRes.json();
    assert.strictEqual(missingRes.status, 400);
    console.log('✓ Rejected missing fields with 400:', missingData.error);

    // Test 5: POST /api/verify-payment with Bad Signature (Should fail with 400)
    console.log('\n--- 5. Testing POST /api/verify-payment with signature mismatch ---');
    const badSigRes = await fetch(`${baseUrl}/api/verify-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        razorpay_order_id: generatedOrderId,
        razorpay_payment_id: testPaymentId,
        razorpay_signature: 'invalid_tampered_signature_hex'
      })
    });
    const badSigData = await badSigRes.json();
    assert.strictEqual(badSigRes.status, 400);
    assert.strictEqual(badSigData.error, 'Signature mismatch');
    console.log('✓ Rejected bad signature with 400:', badSigData.error);

    // Test 6: POST /api/verify-payment with Authentic HMAC-SHA256 Signature (Should succeed with 200)
    console.log('\n--- 6. Testing POST /api/verify-payment with authentic signature ---');
    const validSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${generatedOrderId}|${testPaymentId}`)
      .digest('hex');

    const validVerifyRes = await fetch(`${baseUrl}/api/verify-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        razorpay_order_id: generatedOrderId,
        razorpay_payment_id: testPaymentId,
        razorpay_signature: validSignature
      })
    });
    const validVerifyData = await validVerifyRes.json();
    assert.strictEqual(validVerifyRes.status, 200);
    assert.strictEqual(validVerifyData.success, true);
    assert.strictEqual(validVerifyData.order_id, generatedOrderId);
    assert.strictEqual(validVerifyData.payment_id, testPaymentId);
    console.log('✓ Successfully verified authentic payment:', validVerifyData);

    console.log('\n🎉 ALL RAZORPAY BACKEND SPECIFICATION TESTS PASSED PERFECTLY! 🎉\n');
  } catch (err) {
    console.error('Test assertion failed:', err);
    process.exit(1);
  } finally {
    server.close();
    process.exit(0);
  }
});
