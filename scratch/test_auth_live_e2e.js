const http = require('http');

function post(path, data) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function run() {
  console.log('--- TESTING REAL AUTH ENDPOINTS ---');

  // Test Google direct auth
  const gTest = await post('/api/auth/google', {
    email: 'direct_user_test@gmail.com',
    name: 'Direct Test User',
    googleId: 'g_direct_' + Date.now()
  });
  console.log('1. Google Auth Test:', gTest.status, gTest.data.success ? 'SUCCESS (Token received)' : 'FAILED', 'User:', gTest.data.user?.email);

  // Test Signup
  const email = 'user_test_' + Date.now() + '@example.com';
  const sTest = await post('/api/auth/signup', {
    name: 'Aman Test',
    email: email,
    password: 'password123'
  });
  console.log('2. Local Signup Test:', sTest.status, sTest.data.success ? 'SUCCESS (Token received)' : 'FAILED', 'User:', sTest.data.user?.email);

  // Test local login
  const lTest = await post('/api/auth/login', {
    identifier: email,
    password: 'password123'
  });
  console.log('3. Local Login Test:', lTest.status, lTest.data.success ? 'SUCCESS (Token received)' : 'FAILED', 'User:', lTest.data.user?.email);

  if (gTest.data.success && sTest.data.success && lTest.data.success) {
    console.log('\nALL 3 AUTH FLOWS TESTED & WORKING 100%! 🚀');
  } else {
    console.error('\nLIVE ENDPOINTS ERROR! ❌');
    process.exit(1);
  }
}

run();
