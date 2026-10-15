const http = require('http');

function post(path, body) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const req = http.request({
      hostname: '127.0.0.1',
      port: 3000,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
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

(async () => {
  console.log('--- AUDITING PAYMENT ENDPOINTS ---');

  // 1. Create Order via /api/orders/create
  console.log('\n[1] Testing /api/orders/create (Template checkout)...');
  const orderRes = await post('/api/orders/create', {
    templateId: 'vnv-royal-vintage-scroll',
    amount: 199,
    customerName: 'Test Buyer',
    customerEmail: 'buyer@example.com'
  });
  console.log('Order create status:', orderRes.status, 'Response:', orderRes.data?.success, 'Order ID:', orderRes.data?.order?.id || orderRes.data?.orderId);

  // 2. Test Verification /api/payments/verify in test simulation
  console.log('\n[2] Testing /api/payments/verify...');
  const orderId = orderRes.data?.order?.id || orderRes.data?.orderId;
  const verifyRes = await post('/api/payments/verify', {
    orderId: orderId,
    paymentId: 'pay_sim_' + Date.now(),
    signature: 'sig_sim_valid',
    customerEmail: 'buyer@example.com',
    customerName: 'Test Buyer'
  });
  console.log('Verify status:', verifyRes.status, 'Response:', verifyRes.data?.success, 'Message:', verifyRes.data?.message);
})();
