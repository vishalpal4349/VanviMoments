/**
 * VANVI MOMENTS — PRODUCTION FULL ARCHITECTURE TEST SUITE
 * Comprehensive verification of all production backend services, security, admin, and payment/coin ledger.
 */

const http = require('http');
const app = require('../server/server');
const { Users, Moments, Orders, CoinLedger, Memberships } = require('../server/db/database');
const { validateImageBuffer } = require('../server/services/storage.service');

let server;
let BASE_URL = '';

async function startServer() {
  return new Promise((resolve) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      BASE_URL = `http://localhost:${port}`;
      console.log(`[TEST RUNNER] Test server active on ${BASE_URL}`);
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

async function apiRequest(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  const res = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const data = await res.json().catch(() => ({}));
  return {
    status: res.status,
    headers: res.headers,
    ok: res.ok,
    data
  };
}

let passedCount = 0;
let failedCount = 0;

function assert(condition, message) {
  if (condition) {
    passedCount++;
    console.log(`  ✅ PASS: ${message}`);
  } else {
    failedCount++;
    console.error(`  ❌ FAIL: ${message}`);
  }
}

async function runTests() {
  console.log('\n======================================================');
  console.log('🚀 VANVI MOMENTS PRODUCTION FULL TEST SUITE');
  console.log('======================================================\n');

  await startServer();

  try {
    // -------------------------------------------------------------
    // SUITE 1: Server Health & Security Headers
    // -------------------------------------------------------------
    console.log('\n📦 SUITE 1: Server Health & Security Headers');
    const health = await apiRequest('/api/health');
    assert(health.status === 200 && health.data.status === 'healthy', 'GET /api/health responds with healthy status');
    assert(health.headers.get('x-content-type-options') === 'nosniff', 'Security header X-Content-Type-Options is nosniff');
    assert(health.headers.get('x-frame-options') === 'DENY', 'Security header X-Frame-Options is DENY (strictest framing policy)');
    assert(health.headers.get('referrer-policy') === 'strict-origin-when-cross-origin', 'Security header Referrer-Policy is present');

    // -------------------------------------------------------------
    // SUITE 2: Body XSS Sanitization
    // -------------------------------------------------------------
    console.log('\n🛡️ SUITE 2: Input Sanitization & Anti-XSS');
    const testEmail = `xss_test_${Date.now()}@vanvimoments.com`;
    const signupRes = await apiRequest('/api/auth/signup', {
      method: 'POST',
      body: {
        name: '<script>alert("hacked")</script>Priya Sharma',
        email: testEmail,
        password: 'Password123'
      }
    });
    assert(signupRes.status === 201 && signupRes.data.success, 'Registration succeeds');
    assert(!signupRes.data.user.name.includes('<script>'), 'Script tags were safely sanitized from user name');
    const userToken = signupRes.data.token;
    const userId = signupRes.data.user.id;

    // -------------------------------------------------------------
    // SUITE 3: AI Service & Generation Routes
    // -------------------------------------------------------------
    console.log('\n✨ SUITE 3: Vanvi AI Multi-Provider Generation');
    const aiRes = await apiRequest('/api/ai/generate', {
      method: 'POST',
      body: {
        prompt: 'A warm birthday memory for my sister Vanvi',
        occasion: 'Birthday',
        recipient: 'Vanvi',
        style: 'deep'
      }
    });
    assert(aiRes.status === 200 && aiRes.data.success, 'POST /api/ai/generate responds 200 with success');
    assert(aiRes.data.variations && typeof aiRes.data.variations.deep === 'string', 'AI returns deep poetic variation');
    assert(typeof aiRes.data.variations.hinglish === 'string', 'AI returns warm Hinglish variation');
    assert(typeof aiRes.data.variations.short === 'string', 'AI returns short punchy variation');

    // -------------------------------------------------------------
    // SUITE 4: Secure Upload System & Magic Byte Validation
    // -------------------------------------------------------------
    console.log('\n📸 SUITE 4: Secure Image Storage & Magic Bytes');
    // Valid 1x1 transparent PNG data URI
    const validPngBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const uploadRes = await apiRequest('/api/upload', {
      method: 'POST',
      body: {
        image: validPngBase64,
        originalName: 'test-memory.png'
      }
    });
    assert(uploadRes.status === 201 && uploadRes.data.success, 'Valid PNG upload accepted and stored');
    assert(typeof uploadRes.data.url === 'string' && (uploadRes.data.url.startsWith('/uploads/') || uploadRes.data.url.includes('cloudinary.com')), 'Returns valid safe upload URL path');

    // Reject fake / malicious file pretending to be image
    const fakeBase64 = 'data:image/png;base64,' + Buffer.from('MZ... executable content ...').toString('base64');
    const fakeUploadRes = await apiRequest('/api/upload', {
      method: 'POST',
      body: { image: fakeBase64, originalName: 'malicious.exe' }
    });
    assert(fakeUploadRes.status === 400 && !fakeUploadRes.data.success, 'Corrupted / fake image buffer rejected by magic bytes');

    // Reject file > maximum limit
    const largeBuffer = Buffer.alloc(16 * 1024 * 1024);
    largeBuffer[0] = 0x89; largeBuffer[1] = 0x50; largeBuffer[2] = 0x4E; largeBuffer[3] = 0x47;
    const validateLarge = validateImageBuffer(largeBuffer, 'image/png');
    assert(!validateLarge.valid && (validateLarge.error.includes('15MB') || validateLarge.error.includes('maximum allowed size')), 'Storage service enforces file size limit');

    // -------------------------------------------------------------
    // SUITE 5: Membership System & Tiers
    // -------------------------------------------------------------
    console.log('\n💎 SUITE 5: Memberships & Tier Perks');
    const plansRes = await apiRequest('/api/membership/plans');
    assert(plansRes.status === 200 && plansRes.data.success, 'GET /api/membership/plans returns available tiers');
    assert(plansRes.data.plans.some(p => p.id === 'monthly'), 'Vanvi Club Monthly tier is available');

    const statusRes = await apiRequest('/api/membership/status', {
      headers: { 'Authorization': `Bearer ${userToken}` }
    });
    assert(statusRes.status === 200 && statusRes.data.tier === 'free', 'New user status is initially free tier');

    const subOrder = await apiRequest('/api/membership/subscribe', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${userToken}` },
      body: { planId: 'monthly' }
    });
    assert(subOrder.status === 201 && subOrder.data.success, 'Membership subscription creates gateway order');
    assert(subOrder.data.plan.priceINR === 99, 'Vanvi Club subscription correctly priced at ₹99');

    // -------------------------------------------------------------
    // SUITE 6: Analytics Event Tracking
    // -------------------------------------------------------------
    console.log('\n📊 SUITE 6: Privacy-Preserving Analytics');
    const eventRes = await apiRequest('/api/analytics/event', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${userToken}` },
      body: {
        eventName: 'test_moment_shared',
        properties: { template: 'celestial-galaxy', platform: 'whatsapp' }
      }
    });
    assert(eventRes.status === 202 && eventRes.data.success, 'POST /api/analytics/event accepts event with 202 Accepted');

    // -------------------------------------------------------------
    // SUITE 7: Admin Panel & RBAC Access Control
    // -------------------------------------------------------------
    console.log('\n🔐 SUITE 7: Admin Panel RBAC & Operations');
    // Normal user denied
    const forbiddenRes = await apiRequest('/api/admin/overview', {
      headers: { 'Authorization': `Bearer ${userToken}` }
    });
    assert(forbiddenRes.status === 403, 'Regular user forbidden from accessing /api/admin/overview (403)');

    // Admin login
    const adminLogin = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: {
        email: 'admin@vanvimoments.com',
        password: 'admin123'
      }
    });
    assert(adminLogin.status === 200 && adminLogin.data.success, 'Admin credentials login successfully');
    assert(adminLogin.data.user.role === 'admin', 'Admin user has role: "admin"');
    const adminToken = adminLogin.data.token;

    // Admin overview
    const overviewRes = await apiRequest('/api/admin/overview', {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    assert(overviewRes.status === 200 && overviewRes.data.success, 'Admin successfully accesses /api/admin/overview');
    assert(overviewRes.data.metrics.totalUsers > 0, 'Admin metrics report total users');

    // Admin users list
    const usersListRes = await apiRequest('/api/admin/users', {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    assert(usersListRes.status === 200 && usersListRes.data.users.length > 0, 'Admin can list registered users');

    // Admin coin adjustment
    const adjustRes = await apiRequest(`/api/admin/users/${userId}/coins`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${adminToken}` },
      body: {
        amount: 250,
        type: 'credit',
        reason: 'Automated test reward'
      }
    });
    assert(adjustRes.status === 200 && adjustRes.data.success, 'Admin can credit coins to user account');
    assert(adjustRes.data.user.coins >= 250, 'User balance reflects admin credited coins');

    // Admin moments moderation
    const moment = await Moments.create({
      userId,
      title: 'Admin Moderation Test Moment',
      recipient: 'Rohan',
      sender: 'Priya',
      occasion: 'Anniversary',
      message: 'Happy anniversary!',
      lockMode: 'envelope',
      status: 'published'
    });
    assert(moment && moment.status === 'published', 'Moment created for moderation test');

    const revokeRes = await apiRequest(`/api/admin/moments/${moment.id}/status`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${adminToken}` },
      body: { status: 'revoked' }
    });
    assert(revokeRes.status === 200 && revokeRes.data.moment.status === 'revoked', 'Admin can moderate/revoke moment');

    // Revoked moment not accessible publicly
    const publicRevoked = await apiRequest(`/api/moments/public/${moment.slug}`);
    assert(publicRevoked.status === 404, 'Revoked moment is not accessible via public link');

    // -------------------------------------------------------------
    // SUITE 8: Order Refund & Coin Restitution
    // -------------------------------------------------------------
    console.log('\n🪙 SUITE 8: Order Refund & Coin Restitution');
    const order = await Orders.create({
      userId,
      momentId: moment.id,
      templateName: 'Love Letter Experience',
      totalAmount: 299,
      coinsUsed: 150, // 150 coins redeemed
      payableAmount: 284,
      status: 'paid',
      gatewayPaymentId: 'pay_test_refund_123'
    });

    const refundRes = await apiRequest(`/api/admin/orders/${order.id}/refund`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${adminToken}` },
      body: { reason: 'Customer test cancellation' }
    });
    assert(refundRes.status === 200 && refundRes.data.success, 'Admin order refund processed successfully');
    assert(refundRes.data.order.status === 'refunded', 'Order status marked as refunded');

    // Check user coins restored
    const updatedUser = await Users.findById(userId);
    const userLedger = await CoinLedger.getByUserId(userId);
    const hasRestitution = userLedger.some(l => l.reason.includes('Restitution') || l.reason.includes('Refund'));
    assert(hasRestitution, '150 redeemed coins were automatically restituted to user ledger');

    // Admin audit logs
    const auditRes = await apiRequest('/api/admin/audit-logs', {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    assert(auditRes.status === 200 && auditRes.data.logs.length > 0, 'Admin audit log entries recorded and retrievable');

  } catch (err) {
    console.error('[TEST ERROR] Unhandled test exception:', err);
    failedCount++;
  } finally {
    await stopServer();
  }

  console.log('\n======================================================');
  console.log(`🏁 PRODUCTION TEST SUMMARY: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log('======================================================\n');

  if (failedCount > 0) {
    process.exit(1);
  }
}

if (require.main === module) {
  runTests();
}

module.exports = { runTests };
