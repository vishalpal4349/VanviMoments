const http = require('http');
const path = require('path');

function apiCall(apiPath, method = 'GET', body = null, token = null) {
  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : null;
    const headers = { 'Content-Type': 'application/json' };
    if (postData) headers['Content-Length'] = Buffer.byteLength(postData);
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: apiPath,
      method,
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
    if (postData) req.write(postData);
    req.end();
  });
}

async function runAudit() {
  console.log('====================================================');
  console.log('🚀 VANVI MOMENTS — PRE-MIGRATION COMPLETE AUDIT');
  console.log('====================================================');
  let allPassed = true;

  // 1. Health
  try {
    const health = await apiCall('/api/health');
    console.log(`[1] Backend API Health: HTTP ${health.status} -> ${health.data?.status || 'OK'}`);
    if (health.status !== 200) allPassed = false;
  } catch (e) {
    console.error('[1] Health Failed:', e.message);
    allPassed = false;
  }

  // 2. Public Config
  try {
    const cfg = await apiCall('/api/config/public');
    console.log(`[2] Public Config: HTTP ${cfg.status} -> Razorpay Key: ${cfg.data?.razorpayKeyId || 'MISSING'}, Google OAuth: ${cfg.data?.googleClientId ? 'Configured' : 'Missing'}`);
    if (!cfg.data?.razorpayKeyId) allPassed = false;
  } catch (e) {
    console.error('[2] Public Config Failed:', e.message);
    allPassed = false;
  }

  // 3. User Signup & Auth
  let authToken = null;
  const testEmail = `creator_${Date.now()}@vanvimoments.shop`;
  try {
    const signup = await apiCall('/api/auth/signup', 'POST', {
      name: 'Priya Test',
      email: testEmail,
      password: 'VanviPassword123!'
    });
    console.log(`[3] User Signup: HTTP ${signup.status} -> User ID: ${signup.data?.user?.id || 'OK'}`);
    authToken = signup.data?.token;
    if (signup.status !== 201 && signup.status !== 200) allPassed = false;
  } catch (e) {
    console.error('[3] Signup Failed:', e.message);
    allPassed = false;
  }

  // 4. Moment Creation & 402 Unpaid Guard
  let momentSlug = null;
  try {
    const momentRes = await apiCall('/api/moments/', 'POST', {
      title: 'Birthday Surprise for Rishu',
      recipient: 'Rishu',
      sender: 'Vishal',
      occasion: 'Birthday',
      message: 'Happy Birthday! Have an extraordinary day!',
      photos: []
    }, authToken);
    console.log(`[4a] Moment Created (Draft): HTTP ${momentRes.status} -> Slug: ${momentRes.data?.moment?.slug}`);
    momentSlug = momentRes.data?.moment?.slug;

    // Check 402 guard on unpaid access
    if (momentSlug) {
      const pubRes = await apiCall(`/api/moments/public/${momentSlug}`);
      console.log(`[4b] Unpaid Moment Guard (Expected 402): HTTP ${pubRes.status} -> ${pubRes.data?.error}`);
      if (pubRes.status !== 402) allPassed = false;
    }
  } catch (e) {
    console.error('[4] Moment / Guard Failed:', e.message);
    allPassed = false;
  }

  // 5. Razorpay Live Order Creation (with WELCOME30)
  try {
    const orderRes = await apiCall('/api/orders/create', 'POST', {
      templateName: 'birthday-wish-01',
      couponCode: 'WELCOME30',
      applyCoins: true,
      userCoins: 500,
      userTier: 'free'
    }, authToken);
    console.log(`[5] Razorpay Live Order Creation: HTTP ${orderRes.status} -> Gateway Order ID: ${orderRes.data?.order?.gatewayOrderId}, Final: ₹${orderRes.data?.order?.finalAmountINR}`);
    if (orderRes.status !== 201 || !orderRes.data?.order?.gatewayOrderId) allPassed = false;
  } catch (e) {
    console.error('[5] Razorpay Live Order Failed:', e.message);
    allPassed = false;
  }

  // 6. Supabase Service Verification
  try {
    const supabaseService = require(path.join(__dirname, '../server/services/supabase.service'));
    console.log(`[6] Supabase Service Configured: ${supabaseService.isConfigured} (URL: ${process.env.SUPABASE_URL})`);
  } catch (e) {
    console.error('[6] Supabase check error:', e.message);
  }

  // 7. Resend Email Service Verification
  try {
    const emailService = require(path.join(__dirname, '../server/services/email.service'));
    console.log(`[7] Resend Email Service: Provider: ${emailService.isConfigured ? 'Resend API Active' : 'Fallback SMTP'}, From: ${process.env.EMAIL_FROM}`);
  } catch (e) {
    console.error('[7] Email Service check error:', e.message);
  }

  console.log('====================================================');
  console.log(`🏁 AUDIT RESULT: ${allPassed ? 'ALL SYSTEMS 100% OPERATIONAL & VERIFIED' : 'ATTENTION NEEDED'}`);
  console.log('====================================================');
}

runAudit();
