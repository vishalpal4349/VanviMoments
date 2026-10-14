const http = require('http');

function postJson(path, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log('--- STARTING AUTH SUITE BACKEND TESTS ---');
  let passed = 0;
  let total = 0;

  function assert(testName, condition, details = '') {
    total++;
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}: ${details}`);
    }
  }

  const testEmail = `authtest_${Date.now()}@example.com`;
  const testPassword = 'SecurePassword123!';

  // 1. Signup
  try {
    const signupRes = await postJson('/api/auth/signup', {
      name: 'Test Vanvi User',
      email: testEmail,
      identifier: testEmail,
      password: testPassword
    });
    assert('Signup with valid details returns 201', signupRes.status === 201);
    assert('Signup returns JWT token', !!signupRes.body.token);
    assert('Signup returns 100 free coins', signupRes.body.user && signupRes.body.user.coins === 100);
  } catch (e) {
    assert('Signup request failed', false, e.message);
  }

  // 2. Duplicate Signup Prevention
  try {
    const dupRes = await postJson('/api/auth/signup', {
      name: 'Duplicate User',
      email: testEmail,
      identifier: testEmail,
      password: testPassword
    });
    assert('Duplicate email registration returns 409', dupRes.status === 409);
    assert('Duplicate email has clear error message', dupRes.body.error && dupRes.body.error.includes('already exists'));
  } catch (e) {
    assert('Duplicate signup test failed', false, e.message);
  }

  // 3. Login Valid
  try {
    const loginRes = await postJson('/api/auth/login', {
      identifier: testEmail,
      password: testPassword
    });
    assert('Login with correct credentials returns 200', loginRes.status === 200);
    assert('Login returns JWT token', !!loginRes.body.token);
    assert('Login returns user profile', loginRes.body.user && loginRes.body.user.email === testEmail);
  } catch (e) {
    assert('Login valid test failed', false, e.message);
  }

  // 4. Login Invalid Password
  try {
    const invalidRes = await postJson('/api/auth/login', {
      identifier: testEmail,
      password: 'WrongPassword999!'
    });
    assert('Login with wrong password returns 401', invalidRes.status === 401);
    assert('Login returns clear error message', !!invalidRes.body.error);
  } catch (e) {
    assert('Login invalid test failed', false, e.message);
  }

  // 5. Forgot Password (Anti-Enumeration Confirmation)
  try {
    const forgotRes = await postJson('/api/auth/forgot-password', {
      identifier: testEmail
    });
    assert('Forgot password returns 200 for existing user', forgotRes.status === 200);
    assert('Forgot password returns safe message', forgotRes.body.message && forgotRes.body.message.includes('dispatched'));

    const forgotUnknownRes = await postJson('/api/auth/forgot-password', {
      identifier: 'nonexistent_account_999999@randomdomain.com'
    });
    assert('Forgot password returns 200 for unknown user (anti-enumeration)', forgotUnknownRes.status === 200);
  } catch (e) {
    assert('Forgot password test failed', false, e.message);
  }

  // 6. Verify Reset OTP Invalid
  try {
    const otpRes = await postJson('/api/auth/verify-reset-otp', {
      email: testEmail,
      otp: '000000'
    });
    assert('Invalid OTP verification returns 400', otpRes.status === 400);
  } catch (e) {
    assert('OTP test failed', false, e.message);
  }

  // 7. Google Auth Invalid Credential Rejection
  try {
    const forgedGoogleRes = await postJson('/api/auth/google', {
      credential: 'fake.header.forgedsignature',
      email: 'hacker@gmail.com'
    });
    assert('Forged/invalid Google credential returns 401', forgedGoogleRes.status === 401);
  } catch (e) {
    assert('Google token rejection test failed', false, e.message);
  }

  // 8. Google Auth Legitimate/Direct Flow
  try {
    const googleUserEmail = `g_user_${Date.now()}@gmail.com`;
    const legitGoogleRes = await postJson('/api/auth/google', {
      email: googleUserEmail,
      name: 'Google Verified User',
      googleId: 'gid_' + Date.now(),
      picture: 'https://lh3.googleusercontent.com/a/default'
    });
    assert('Google sign-in returns 200', legitGoogleRes.status === 200);
    assert('Google user created with provider=google', legitGoogleRes.body.user && legitGoogleRes.body.user.provider === 'google');
    assert('Google user gets 100 bonus coins', legitGoogleRes.body.user && legitGoogleRes.body.user.coins === 100);
  } catch (e) {
    assert('Google legitimate test failed', false, e.message);
  }

  console.log(`\n--- RESULT: ${passed}/${total} TESTS PASSED ---`);
  if (passed === total) {
    console.log('🎉 ALL BACKEND AUTH TESTS PASSED PERFECTLY!');
  } else {
    process.exit(1);
  }
}

runTests();
