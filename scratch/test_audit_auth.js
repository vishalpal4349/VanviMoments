const http = require('http');

function post(path, body, token) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const headers = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    };
    if (token) headers['Authorization'] = 'Bearer ' + token;

    const req = http.request({
      hostname: '127.0.0.1',
      port: 3000,
      path,
      method: 'POST',
      headers
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function get(path, token) {
  return new Promise((resolve, reject) => {
    const headers = {};
    if (token) headers['Authorization'] = 'Bearer ' + token;

    const req = http.request({
      hostname: '127.0.0.1',
      port: 3000,
      path,
      method: 'GET',
      headers
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

(async () => {
  console.log('--- AUDITING AUTH FLOWS ---');
  const testEmail = `test_audit_${Date.now()}@gmail.com`;
  const testPassword = 'Password@123';

  // 1. Signup
  console.log('\n[1] Testing Signup...');
  const signupRes = await post('/api/auth/signup', {
    name: 'Audit User',
    email: testEmail,
    password: testPassword
  });
  console.log('Signup status:', signupRes.status, signupRes.data?.success, 'Coins:', signupRes.data?.user?.coins);

  // 2. Login
  console.log('\n[2] Testing Login...');
  const loginRes = await post('/api/auth/login', {
    identifier: testEmail,
    password: testPassword
  });
  console.log('Login status:', loginRes.status, loginRes.data?.success, 'Token received:', !!loginRes.data?.token);
  const token = loginRes.data?.token;

  // 3. Auth Me
  console.log('\n[3] Testing GET /api/auth/me with Token...');
  const meRes = await get('/api/auth/me', token);
  console.log('Me status:', meRes.status, meRes.data?.user?.email, 'Coins:', meRes.data?.user?.coins);

  // 4. Forgot Password
  console.log('\n[4] Testing Forgot Password...');
  const forgotRes = await post('/api/auth/forgot-password', { identifier: testEmail });
  console.log('Forgot status:', forgotRes.status, forgotRes.data?.success, 'Message:', forgotRes.data?.message);

  // 5. Test Coin Balance
  console.log('\n[5] Testing Coins Balance for New User...');
  const coinRes = await get('/api/coins/balance', token);
  console.log('Coins balance status:', coinRes.status, 'Coins:', coinRes.data?.coins);
})();
