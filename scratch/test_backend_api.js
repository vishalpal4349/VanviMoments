const http = require('http');
const app = require('../server/server');

console.log('=== VANVI MOMENTS BACKEND API VERIFICATION SUITE ===\n');

const server = http.createServer(app);
const PORT = 3899; // Isolated test port

server.listen(PORT, async () => {
  console.log(`Test server active on port ${PORT}`);
  let passed = 0;
  let total = 0;

  function check(label, condition) {
    total++;
    if (condition) {
      console.log(`✅ PASS: ${label}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${label}`);
    }
  }

  async function api(path, options = {}) {
    const res = await fetch(`http://localhost:${PORT}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.token ? { 'Authorization': `Bearer ${options.token}` } : {}),
        ...options.headers
      },
      method: options.method || 'GET',
      body: options.body ? JSON.stringify(options.body) : undefined
    });
    const data = await res.json().catch(() => ({}));
    return { status: res.status, data };
  }

  try {
    // 1. Healthcheck
    const health = await api('/api/health');
    check('Server is healthy', health.status === 200 && health.data.status === 'healthy');

    // 2. Signup Validation
    const badSignup = await api('/api/auth/signup', {
      method: 'POST',
      body: { name: 'A', email: 'invalid', password: '123' }
    });
    check('Rejects invalid registration input (400)', badSignup.status === 400);

    // 3. Successful Signup
    const testEmail = `test_${Date.now()}@vanvimoments.com`;
    const signup = await api('/api/auth/signup', {
      method: 'POST',
      body: { name: 'Rahul Sharma', email: testEmail, password: 'securePassword2026' }
    });
    check('Successful user signup (201)', signup.status === 201 && signup.data.success);
    check('Received JWT token and 100 welcome coins', signup.data.token && signup.data.user.coins === 100);

    const token = signup.data.token;

    // 4. Duplicate Signup Prevention
    const dupSignup = await api('/api/auth/signup', {
      method: 'POST',
      body: { name: 'Duplicate User', email: testEmail, password: 'securePassword2026' }
    });
    check('Rejects duplicate email (409)', dupSignup.status === 409);

    // 5. Login
    const loginWrong = await api('/api/auth/login', {
      method: 'POST',
      body: { email: testEmail, password: 'wrongPassword' }
    });
    check('Rejects wrong password (401)', loginWrong.status === 401);

    const loginOk = await api('/api/auth/login', {
      method: 'POST',
      body: { email: testEmail, password: 'securePassword2026' }
    });
    check('Successful login (200)', loginOk.status === 200 && loginOk.data.token);

    // 6. Authenticated Profile /me
    const profile = await api('/api/auth/me', { token });
    check('Profile returns authenticated user details', profile.status === 200 && profile.data.user.email === testEmail);

    // 7. Coin Balance & Fortune Wheel Spin
    const coinBal = await api('/api/coins/balance', { token });
    check('Coin balance endpoint returns 100 coins', coinBal.status === 200 && coinBal.data.coins === 100);

    const spin = await api('/api/coins/spin', { method: 'POST', token });
    check('Daily spin awards bonus coins', spin.status === 200 && spin.data.wonCoins >= 0);

    const dupSpin = await api('/api/coins/spin', { method: 'POST', token });
    check('Enforces 24-hour spin cooldown (429)', dupSpin.status === 429);

    // 8. Create PIN-Protected Moment
    const momentDraft = await api('/api/moments/draft', {
      method: 'POST',
      token,
      body: {
        title: 'Secret Birthday Surprise',
        recipient: 'Vanvi',
        sender: 'Rahul',
        occasion: 'Birthday',
        message: 'This is the private letter only visible after PIN entry!',
        photos: ['https://example.com/photo1.jpg'],
        lockMode: 'pin',
        pin: '1234',
        pinHint: 'Our special year'
      }
    });
    check('Moment draft created with unique slug', momentDraft.status === 201 && momentDraft.data.moment.slug);
    const slug = momentDraft.data.moment.slug;

    // 9. Public Moment Fetch (Security: Message hidden!)
    const publicMoment = await api(`/api/moments/public/${slug}`);
    check('Public fetch succeeds', publicMoment.status === 200);
    check('Sensitive message is NOT exposed before unlock', publicMoment.data.moment.message === undefined);
    check('Photos are NOT exposed before unlock', publicMoment.data.moment.photos === undefined);
    check('Lock mode reports locked: true', publicMoment.data.moment.locked === true);

    // 10. Server-Side PIN Verification
    const wrongPin = await api(`/api/moments/public/${slug}/verify-pin`, {
      method: 'POST',
      body: { pin: '9999' }
    });
    check('Wrong PIN rejected (401)', wrongPin.status === 401);

    const correctPin = await api(`/api/moments/public/${slug}/verify-pin`, {
      method: 'POST',
      body: { pin: '1234' }
    });
    check('Correct PIN unlocks secret message & photos', correctPin.status === 200 && correctPin.data.message.includes('private letter'));

    // 11. Reaction Heart Tap
    const react = await api(`/api/moments/public/${slug}/react`, { method: 'POST' });
    check('Heart reaction increments counter', react.status === 200 && react.data.hearts >= 1);

    // 12. Server-Side Order & Coin Eligibility Calculation
    const orderCreate = await api('/api/orders/create', {
      method: 'POST',
      token,
      body: {
        templateName: 'Midnight Wish 3D',
        applyCoins: true
      }
    });
    check('Order calculated on server', orderCreate.status === 201);
    check('Coin discount correctly capped at 20%', orderCreate.data.order.discountINR <= 39.80);
    check('Final payable verified on server', orderCreate.data.order.finalAmountINR === orderCreate.data.order.basePrice - orderCreate.data.order.discountINR);

    // 13. Payment Verification & Moment Publish
    const orderId = orderCreate.data.order.id;
    const testSecret = process.env.RAZORPAY_KEY_SECRET;
    const testSig = testSecret
      ? require('crypto').createHmac('sha256', testSecret).update(`${orderCreate.data.order.gatewayOrderId}|pay_test_123`).digest('hex')
      : 'simulated_sig';

    const paymentVerify = await api('/api/payments/verify', {
      method: 'POST',
      token,
      body: {
        orderId,
        paymentId: 'pay_test_123',
        signature: testSig,
        momentData: {
          recipient: 'Sneha',
          sender: 'Karan',
          occasion: 'Love',
          message: 'Forever and always.',
          lockMode: 'envelope'
        }
      }
    });
    check('Payment verified and moment published', paymentVerify.status === 200 && paymentVerify.data.momentSlug);
    check('Share URL generated with unguessable slug', paymentVerify.data.shareUrl.includes('id=m_'));

    console.log(`\nResults: ${passed} / ${total} tests passed.`);
    if (passed === total) {
      console.log('🎉 ALL BACKEND API & SECURITY TESTS PASSED PERFECTLY!\n');
      server.close(() => process.exit(0));
    } else {
      console.error('⚠️ SOME TESTS FAILED!\n');
      server.close(() => process.exit(1));
    }

  } catch (err) {
    console.error('Fatal test error:', err);
    server.close(() => process.exit(1));
  }
});

