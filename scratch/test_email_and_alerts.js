/**
 * Comprehensive verification of Vanvi Moments Transactional Email & Alerting Engine
 */

require('../server/config/env');
const emailService = require('../server/services/email.service');
const assert = require('assert');

async function runTests() {
  console.log('🧪 Starting Vanvi Moments Email & Notification Tests...\n');

  // Test 1: Order Confirmation & Owner Alert
  console.log('Test 1: Testing Order Confirmation & Owner Alert...');
  const orderRes = await emailService.sendOrderConfirmation({
    toEmail: 'customer.test@example.com',
    customerName: 'Ananya Sharma',
    customerPhone: '9876543210',
    orderId: 'ORD_TEST_9988',
    templateName: 'Midnight Wish 3D Candle Surprise',
    amountINR: 199,
    momentUrl: 'https://vanvimoments.shop/moment.html?id=vm_test_9988',
    momentPin: '7788',
    paymentId: 'pay_test_razorpay_123'
  });
  assert(orderRes.success === true, 'Order confirmation failed');
  console.log('✅ Test 1 Passed: Order confirmation & owner alert dispatched.\n');

  // Test 2: Bespoke Atelier Commission Alert
  console.log('Test 2: Testing Bespoke Commission Alert...');
  const bespokeRes = await emailService.sendOwnerBespokeAlert({
    name: 'Vikram Malhotra',
    email: 'vikram.test@example.com',
    contact: '+91 99887 76655',
    occasion: 'Royal Palace Proposal',
    recipient: 'Simran',
    budget: '₹9,999 (Royal Signature)',
    style: 'Udaipur Palace Candlelight',
    idea: 'A custom floating lantern animation leading to a velvet ring box with our favorite Arijit Singh acoustic song playing in background.',
    references: 'https://instagram.com/p/example_ref',
    details: 'Need it delivered by Oct 24th evening.',
    requestId: 'CX_TEST_7711'
  });
  assert(bespokeRes.success === true, 'Bespoke alert failed');
  console.log('✅ Test 2 Passed: Bespoke commission alert dispatched to vanvimoments@gmail.com.\n');

  // Test 3: Contact / Concierge Inquiry & Courtesy Acknowledgment
  console.log('Test 3: Testing Contact Inquiry & Courtesy Acknowledgment...');
  const contactRes = await emailService.sendContactNotification({
    fromName: 'Pooja Verma',
    fromEmail: 'pooja.test@example.com',
    fromPhone: '9811223344',
    topic: 'order_help',
    orderId: 'ORD_1234',
    message: 'Can I add 2 more photos to my anniversary moment after sharing the link?',
    ticketId: 'TICK_TEST_5544'
  });
  assert(contactRes.success === true, 'Contact notification failed');
  console.log('✅ Test 3 Passed: Contact notification dispatched.\n');

  // Test 4: Website Issue / Bug Report Alert
  console.log('Test 4: Testing Website Issue / Bug Report Alert...');
  const issueRes = await emailService.sendIssueReportAlert({
    reportId: 'BUG_TEST_101',
    reporterName: 'Rahul Mehta',
    reporterEmail: 'rahul.test@example.com',
    reporterPhone: '9765432100',
    category: 'Payment Issue',
    pageUrl: 'https://vanvimoments.shop/checkout.html',
    description: 'UPI QR code screen took 10 seconds to load on mobile 4G network.',
    deviceInfo: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)'
  });
  assert(issueRes.success === true, 'Issue report alert failed');
  console.log('✅ Test 4 Passed: Website bug report alert dispatched.\n');

  // Test 5: Welcome Email with Bonus Coins & CELEBRATE20 Coupon
  console.log('Test 5: Testing Welcome Email (+100 Coins & Coupon)...');
  const welcomeRes = await emailService.sendWelcomeEmail({
    toEmail: 'newcreator@example.com',
    customerName: 'Aarav Patel',
    coins: 100
  });
  assert(welcomeRes.success === true, 'Welcome email failed');
  console.log('✅ Test 5 Passed: Welcome email dispatched.\n');

  // Test 6: 6-Digit Password Reset OTP Email
  console.log('Test 6: Testing 6-Digit Password Reset OTP...');
  const otpRes = await emailService.sendPasswordResetOtp({
    toEmail: 'resetuser@example.com',
    customerName: 'Priya Sen',
    otp: '482910',
    resetRef: 'VNV_RST_4829'
  });
  assert(otpRes.success === true, 'Password reset OTP failed');
  console.log('✅ Test 6 Passed: Password reset OTP dispatched.\n');

  console.log('🎉 ALL 6 EMAIL & ALERT SUITES PASSED WITH 100% SUCCESS!');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
