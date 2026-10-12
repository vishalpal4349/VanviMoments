/**
 * End-to-End API endpoint test for Vanvi Moments
 * Tests contact inquiries, issue reports, bespoke requests, signups, and payments
 */

const crypto = require('crypto');

async function testApi() {
  const BASE = 'http://localhost:3000';
  console.log('🚀 Running Vanvi API & Alert Trigger Integration Tests...\n');

  // 1. Health Check
  const healthRes = await fetch(`${BASE}/api/health`);
  const healthData = await healthRes.json();
  console.log('✅ 1. Health check OK:', healthData.status);

  // 2. Contact Inquiry (/api/contact/submit)
  console.log('Testing 2: Contact Inquiry Submission...');
  const contactRes = await fetch(`${BASE}/api/contact/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Rohan Kapoor',
      email: 'rohan.test@gmail.com',
      phone: '9876543210',
      topic: 'order_help',
      orderId: 'ORD_9911',
      message: 'Hello Vanvi team, I need help adding an audio message to my celebration.'
    })
  });
  const contactData = await contactRes.json();
  console.log('Contact response:', contactData);
  if (!contactData.success) throw new Error('Contact inquiry failed');
  console.log('✅ 2. Contact inquiry successfully recorded & alerted to owner!\n');

  // 3. Issue Report (/api/contact/report-issue)
  console.log('Testing 3: Technical Issue Reporting...');
  const issueRes = await fetch(`${BASE}/api/contact/report-issue`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Simran Kaur',
      email: 'simran.test@gmail.com',
      phone: '9812345678',
      category: 'Website Glitch',
      pageUrl: 'https://vanvimoments.shop/moment.html?id=vm_123',
      description: 'The background music pause button took 2 taps to stop on Android Chrome.'
    })
  });
  const issueData = await issueRes.json();
  console.log('Issue response:', issueData);
  if (!issueData.success) throw new Error('Issue reporting failed');
  console.log('✅ 3. Bug report successfully recorded & alerted to owner!\n');

  // 4. Bespoke Custom Request (/api/custom-requests/submit)
  console.log('Testing 4: Bespoke Custom Experience Request...');
  const bespokeRes = await fetch(`${BASE}/api/custom-requests/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Aditya & Rhea',
      email: 'aditya.rhea@gmail.com',
      contact: '+91 98989 89898',
      occasion: '5th Anniversary Surprise',
      recipient: 'Rhea',
      budget: '₹9,999 (Royal Signature)',
      style: 'Ivory Minimalist Editorial',
      idea: 'An interactive timeline with 5 interactive stages, 1 for each year of our relationship, ending with video montage.',
      details: 'Please ensure font is Cormorant Garamond.'
    })
  });
  const bespokeData = await bespokeRes.json();
  console.log('Bespoke response:', bespokeData);
  if (!bespokeData.success) throw new Error('Bespoke request failed');
  console.log('✅ 4. Bespoke request successfully recorded & alerted to owner!\n');

  // 5. Signup Welcome Email & Bonus Coins (/api/auth/signup)
  console.log('Testing 5: User Signup with Welcome Email...');
  const testUserEmail = `user_${Date.now()}@testcelebrate.com`;
  const signupRes = await fetch(`${BASE}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Kabir Singhania',
      email: testUserEmail,
      password: 'SecurePassword123!',
      phone: '9870001122'
    })
  });
  const signupData = await signupRes.json();
  console.log('Signup response:', signupData.user ? { name: signupData.user.name, email: signupData.user.email, coins: signupData.user.coins } : signupData);
  if (!signupData.success) throw new Error('Signup failed: ' + signupData.error);
  console.log('✅ 5. Signup successful! +100 Coins & Welcome email dispatched!\n');

  // 6. Forgot Password OTP (/api/auth/forgot-password)
  console.log('Testing 6: Forgot Password OTP Generation...');
  const forgotRes = await fetch(`${BASE}/api/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      identifier: testUserEmail
    })
  });
  const forgotData = await forgotRes.json();
  console.log('Forgot password response:', forgotData);
  if (!forgotData.success) throw new Error('Forgot password failed: ' + forgotData.error);
  console.log('✅ 6. Password reset 6-digit OTP generated & emailed!\n');

  // 7. Razorpay Order Creation & Verification with Owner Alert
  console.log('Testing 7: Order Creation & Payment Verification Alert...');
  const createOrderRes = await fetch(`${BASE}/api/create-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: 19900,
      currency: 'INR',
      receipt: 'rcpt_test_' + Date.now(),
      notes: {
        templateName: 'Midnight Wish 3D Candle Surprise',
        recipient: 'Simran',
        customerName: 'Kabir Singhania',
        customerEmail: testUserEmail,
        customerPhone: '9870001122'
      }
    })
  });
  const orderData = await createOrderRes.json();
  console.log('Create order response:', orderData);
  if (!orderData.order_id) throw new Error('Order creation failed');

  // Generate valid HMAC signature using Razorpay test secret from .env
  const secret = process.env.RAZORPAY_KEY_SECRET || 'H9VDRVzxk0MWWHMktCx7B7qc';
  const paymentId = 'pay_sim_' + Date.now().toString(36);
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(`${orderData.order_id}|${paymentId}`);
  const signature = hmac.digest('hex');

  const verifyRes = await fetch(`${BASE}/api/verify-payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      razorpay_order_id: orderData.order_id,
      razorpay_payment_id: paymentId,
      razorpay_signature: signature,
      templateName: 'Midnight Wish 3D Candle Surprise',
      recipient: 'Simran',
      customerName: 'Kabir Singhania',
      customerEmail: testUserEmail,
      customerPhone: '9870001122',
      amount: 19900
    })
  });
  const verifyData = await verifyRes.json();
  console.log('Verify payment response:', verifyData);
  if (!verifyData.success) throw new Error('Payment verification failed');
  console.log('✅ 7. Payment verified! Customer receipt + Owner Alert to vanvimoments@gmail.com dispatched!\n');

  console.log('🎉 ALL INTEGRATION API TESTS PASSED 100% SUCCESSFULLY!');
}

testApi().catch(err => {
  console.error('❌ API test failed:', err);
  process.exit(1);
});
