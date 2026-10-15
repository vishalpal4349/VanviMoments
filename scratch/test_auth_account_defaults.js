const assert = require('assert');
const fs = require('fs');
const http = require('http');
const path = require('path');
const vm = require('vm');
const app = require('../server/server');
const { Users, getStore, saveStore } = require('../server/db/database');
const emailService = require('../server/services/email.service');

function postJson(port, route, body) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const request = http.request({
      hostname: '127.0.0.1',
      port,
      path: route,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, response => {
      let responseBody = '';
      response.setEncoding('utf8');
      response.on('data', chunk => { responseBody += chunk; });
      response.on('end', () => {
        try {
          resolve({ status: response.statusCode, body: JSON.parse(responseBody) });
        } catch (err) {
          reject(err);
        }
      });
    });
    request.on('error', reject);
    request.end(payload);
  });
}

function getJson(port, route) {
  return new Promise((resolve, reject) => {
    const request = http.request({
      hostname: '127.0.0.1',
      port,
      path: route,
      method: 'GET'
    }, response => {
      let responseBody = '';
      response.setEncoding('utf8');
      response.on('data', chunk => { responseBody += chunk; });
      response.on('end', () => {
        try {
          resolve({ status: response.statusCode, body: JSON.parse(responseBody) });
        } catch (err) {
          reject(err);
        }
      });
    });
    request.on('error', reject);
    request.end();
  });
}

async function run() {
  const email = `auth-regression-${Date.now()}@example.invalid`;
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });
  const port = server.address().port;

  try {
    const publicConfig = await getJson(port, '/api/config/public');
    assert.strictEqual(publicConfig.status, 200, 'Public Google config endpoint must be available.');
    assert.strictEqual(typeof publicConfig.body.googleClientId, 'string');
    assert(!Object.prototype.hasOwnProperty.call(publicConfig.body, 'googleClientSecret'), 'Public config must not expose a Google client secret.');

    const signup = await postJson(port, '/api/auth/signup', {
      name: 'Auth Regression User',
      email,
      identifier: email,
      password: 'VanviAuthRegression#123'
    });
    assert.strictEqual(signup.status, 201, 'Signup must create a new account.');
    assert.strictEqual(signup.body.user.coins, 0, 'New accounts must start with zero coins.');
    assert.strictEqual(signup.body.user.templateCredits, 0, 'New accounts must start with zero template credits.');
    assert.strictEqual(signup.body.user.activePass, null, 'New accounts must not inherit a pass.');

    const createdUser = await Users.findByEmail(email);
    await Users.update(createdUser.id, {
      templateCredits: 37,
      activePass: 'creator',
      passExpiry: 1798761600000
    });

    const login = await postJson(port, '/api/auth/login', {
      identifier: email,
      password: 'VanviAuthRegression#123'
    });
    assert.strictEqual(login.status, 200, 'New account must be able to sign in.');
    assert.strictEqual(login.body.user.coins, 0, 'Login must return the true zero balance.');
    assert.strictEqual(login.body.user.templateCredits, 37, 'Login must restore the account template-credit balance.');
    assert.strictEqual(login.body.user.activePass, 'creator', 'Login must restore the account pass.');
    assert.strictEqual(login.body.user.passExpiry, 1798761600000, 'Login must restore the account pass expiry.');

    if (!emailService.isEmailConfigured()) {
      const recovery = await postJson(port, '/api/auth/forgot-password', { identifier: email });
      assert.strictEqual(recovery.status, 503, 'Password reset must not claim an undelivered OTP was sent.');
      assert.strictEqual(recovery.body.success, false);
    }

    const user = await Users.findByEmail(email);
    if (user) {
      await Users.delete(user.id);
      const store = getStore();
      store.auditLogs = store.auditLogs.filter(log => log.actorUserId !== user.id && log.targetId !== user.id);
      saveStore();
    }
  } finally {
    await new Promise(resolve => server.close(resolve));
    const user = await Users.findByEmail(email);
    if (user) {
      await Users.delete(user.id);
      const store = getStore();
      store.auditLogs = store.auditLogs.filter(log => log.actorUserId !== user.id && log.targetId !== user.id);
      saveStore();
    }
  }

  const loginHtml = fs.readFileSync(path.join(__dirname, '..', 'login.html'), 'utf8');
  const signupHtml = fs.readFileSync(path.join(__dirname, '..', 'signup.html'), 'utf8');
  const clientApi = fs.readFileSync(path.join(__dirname, '..', 'js', 'vanvi-api.js'), 'utf8');
  const googleAuth = fs.readFileSync(path.join(__dirname, '..', 'js', 'vanvi-google-auth.js'), 'utf8');
  const googleAuthSection = (clientApi.split('async googleAuth')[1] || '').split('async forgotPassword')[0];
  const redirectHelper = clientApi.match(/window\.vanviSafeRedirect = function\(candidate, fallback = 'dashboard\.html'\) \{[\s\S]*?\n  \};/);
  assert(redirectHelper, 'Shared same-origin redirect helper must be present.');
  const redirectWindow = { location: { href: 'https://vanvimoments.shop/login.html', origin: 'https://vanvimoments.shop' } };
  vm.runInNewContext(redirectHelper[0], { window: redirectWindow, URL });
  assert(!loginHtml.includes('|| localStorage.getItem(\'vanvi_last_email\')'), 'Login must not autofill an unconsented legacy email.');
  assert(loginHtml.includes('id="rememberMe" />'), 'Remember-me must be opt-in by default.');
  assert(!signupHtml.includes('+100'), 'Signup must not advertise an uncredited coin bonus.');
  assert(clientApi.includes("localStorage.removeItem('vanvi_user_coins')"), 'Logout must clear any previous account coin balance.');
  assert(clientApi.includes("localStorage.removeItem('vanvi_template_credits')"), "Logout must clear another account's cached pass credits.");
  assert(clientApi.includes("localStorage.removeItem('vanvi_active_pass')"), "Logout must clear another account's cached pass.");
  assert(clientApi.includes("localStorage.removeItem('vanvi_pass_expiry')"), "Logout must clear another account's cached pass expiry.");
  assert(googleAuthSection.includes('syncWalletCache(res.user)'), 'Google sign-in must replace stale wallet and pass data with the signed-in account values.');
  assert(clientApi.includes('window.vanviSafeRedirect'), 'Auth pages must expose same-origin post-login redirect validation.');
  assert(loginHtml.includes('window.vanviSafeRedirect(new URLSearchParams(location.search).get(\'redirect\'))'), 'Login must reject external post-auth redirects.');
  assert(signupHtml.includes('window.vanviSafeRedirect(new URLSearchParams(location.search).get(\'redirect\'))'), 'Signup must reject external post-auth redirects.');
  assert(!googleAuth.includes('localStorage.getItem(\'vanvi_google_client_id\')'), 'Google sign-in must use the server-verified OAuth client ID, not stale browser state.');
  assert.strictEqual(redirectWindow.vanviSafeRedirect('/dashboard.html?welcome=1#top'), '/dashboard.html?welcome=1#top', 'Safe redirect preserves same-origin destinations.');
  assert.strictEqual(redirectWindow.vanviSafeRedirect('https://attacker.example/collect'), 'dashboard.html', 'Safe redirect blocks external destinations.');
  assert.strictEqual(redirectWindow.vanviSafeRedirect('//attacker.example/collect'), 'dashboard.html', 'Safe redirect blocks protocol-relative destinations.');
  assert.strictEqual(redirectWindow.vanviSafeRedirect('javascript:alert(1)'), 'dashboard.html', 'Safe redirect blocks script URLs.');

  console.log('Auth signup/login/recovery regressions passed.');
}

run().catch(err => {
  console.error('Auth account-default regression failed:', err);
  process.exitCode = 1;
});
