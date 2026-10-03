const assert = require('assert');
const fs = require('fs');
const path = require('path');
const http = require('http');

async function testAuthApi() {
  console.log('Testing Phone & Email Unified Auth + Google OAuth (No WhatsApp UI)...');

  function postJson(urlPath, body) {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify(body);
      const req = http.request({
        hostname: 'localhost',
        port: 3000,
        path: urlPath,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data)
        }
      }, (res) => {
        let resData = '';
        res.on('data', chunk => resData += chunk);
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(resData) });
          } catch (e) {
            resolve({ status: res.statusCode, body: resData });
          }
        });
      });
      req.on('error', reject);
      req.write(data);
      req.end();
    });
  }

  // 1. Test Unified Signup with Phone Number
  const testPhone = '98' + Math.floor(10000000 + Math.random() * 89999999);
  const testPass = 'VanviSecurity#123';
  const signupRes = await postJson('/api/auth/signup', {
    name: 'Kabir Sharma',
    identifier: testPhone,
    password: testPass
  });
  assert.strictEqual(signupRes.status, 201, 'Signup with phone should return 201');
  assert.strictEqual(signupRes.body.success, true, 'Signup with phone should succeed');
  assert.strictEqual(signupRes.body.user.phone, testPhone, 'User phone should match');
  console.log('  ✅ Phone Number Unified Signup passed');

  // 2. Test Unified Login with Phone Number + Password
  const loginRes = await postJson('/api/auth/login', { identifier: testPhone, password: testPass });
  assert.strictEqual(loginRes.status, 200, 'Login with phone should return 200');
  assert.strictEqual(loginRes.body.success, true, 'Login with phone should succeed');
  assert.strictEqual(loginRes.body.user.phone, testPhone, 'Logged in user phone should match');
  console.log('  ✅ Phone Number Unified Login passed');

  // 3. Test Google OAuth
  const googleRes = await postJson('/api/auth/google', {
    email: 'mytestuser@gmail.com',
    name: 'Kabir Google',
    googleId: 'g_123456789'
  });
  assert.strictEqual(googleRes.status, 200, 'Google auth should return 200');
  assert.strictEqual(googleRes.body.success, true, 'Google auth should succeed');
  console.log('  ✅ Google OAuth API endpoint passed');

  // 4. Inspect signup.html
  const signupHtml = fs.readFileSync(path.join(__dirname, '..', 'signup.html'), 'utf8');
  assert(signupHtml.includes('placeholder="Enter your name"'), 'signup.html must have placeholder="Enter your name"');
  assert(signupHtml.includes('placeholder="Enter email or phone number"'), 'signup.html must have placeholder="Enter email or phone number"');
  assert(!signupHtml.includes('name@example.com'), 'signup.html must NOT have name@example.com');
  assert(!signupHtml.includes('9876543210'), 'signup.html must NOT have 9876543210');
  assert(!signupHtml.includes('e.g. Priya Sharma'), 'signup.html must NOT have Priya Sharma');
  assert(!signupHtml.includes('creator@gmail.com'), 'signup.html must NOT have creator@gmail.com');
  assert(!signupHtml.includes('personal@gmail.com'), 'signup.html must NOT have personal@gmail.com');
  assert(!signupHtml.includes('id="whatsappSignupBtn"'), 'signup.html must NOT have whatsappSignupBtn');
  assert(!signupHtml.includes('id="whatsappModal"'), 'signup.html must NOT have whatsappModal');
  assert(signupHtml.includes('id="googleSignupBtn"'), 'signup.html must have googleSignupBtn');
  assert(signupHtml.includes('vanvimoments@gmail.com'), 'signup.html must have support link vanvimoments@gmail.com');
  assert(signupHtml.includes('butterfly-flight-layer'), 'signup.html must include butterfly flight layer');
  assert(signupHtml.includes('airplane-sky-layer'), 'signup.html must include airplane sky layer');
  assert(signupHtml.includes('runButterflies'), 'signup.html must run butterfly simulation');
  assert(signupHtml.includes('launchAirplaneFlight'), 'signup.html must run airplane simulation');
  assert(signupHtml.includes('triggerAuthSuccessCelebration'), 'signup.html must have celebration unlock sequence');
  assert(!signupHtml.includes('id="googleEmailCustom"'), 'signup.html must NOT have googleEmailCustom input');
  assert(signupHtml.includes('id="btnGoogleDirectAuth"'), 'signup.html must have btnGoogleDirectAuth');
  console.log('  ✅ signup.html: Pure Google OAuth & 3D ecosystem verified');

  // 5. Inspect login.html
  const loginHtml = fs.readFileSync(path.join(__dirname, '..', 'login.html'), 'utf8');
  assert(loginHtml.includes('placeholder="Enter email or phone number"'), 'login.html must have placeholder="Enter email or phone number"');
  assert(!loginHtml.includes('name@example.com'), 'login.html must NOT have name@example.com');
  assert(!loginHtml.includes('9876543210'), 'login.html must NOT have 9876543210');
  assert(!loginHtml.includes('creator@gmail.com'), 'login.html must NOT have creator@gmail.com');
  assert(!loginHtml.includes('personal@gmail.com'), 'login.html must NOT have personal@gmail.com');
  assert(!loginHtml.includes('id="whatsappLoginBtn"'), 'login.html must NOT have whatsappLoginBtn');
  assert(!loginHtml.includes('id="whatsappModal"'), 'login.html must NOT have whatsappModal');
  assert(loginHtml.includes('id="googleLoginBtn"'), 'login.html must have googleLoginBtn');
  assert(!loginHtml.includes('id="googleEmailCustom"'), 'login.html must NOT have googleEmailCustom input');
  assert(loginHtml.includes('id="btnGoogleDirectAuth"'), 'login.html must have btnGoogleDirectAuth');
  assert(loginHtml.includes('vanvimoments@gmail.com'), 'login.html must have vanvimoments@gmail.com');
  assert(loginHtml.includes('runButterflies'), 'login.html must run butterfly simulation');
  assert(loginHtml.includes('launchAirplaneFlight'), 'login.html must run airplane simulation');
  assert(loginHtml.includes('triggerAuthSuccessCelebration'), 'login.html must have celebration unlock');
  console.log('  ✅ login.html: Pure Google OAuth & 3D ecosystem verified');

  console.log('\n🎉 ALL UPDATES VERIFIED 100% SUCCESSFUL!\n');
}

testAuthApi().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
