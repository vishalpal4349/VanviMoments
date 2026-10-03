/**
 * VANVI MOMENTS — MULTI-GATEWAY PAYMENT SERVICE (Razorpay & Cashfree Ready)
 * Handles server-side order generation, timing-safe HMAC signature verification,
 * and environment-driven live mode with development simulation fallback.
 */

const crypto = require('crypto');
let Razorpay = null;
try {
  Razorpay = require('razorpay');
} catch (e) {
  Razorpay = null;
}

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || '';

const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID || '';
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY || '';
const CASHFREE_API_VERSION = process.env.CASHFREE_API_VERSION || '2023-08-01';

const isRazorpayConfigured = !!(RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET);
const isCashfreeConfigured = !!(CASHFREE_APP_ID && CASHFREE_SECRET_KEY);
const isLiveGatewayConfigured = isRazorpayConfigured || isCashfreeConfigured;

let razorpayClient = null;
function getRazorpayClient() {
  const keyId = process.env.RAZORPAY_KEY_ID || RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET || RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret || !Razorpay) return null;
  if (!razorpayClient || razorpayClient.key_id !== keyId) {
    razorpayClient = new Razorpay({
      key_id: keyId,
      key_secret: keySecret
    });
  }
  return razorpayClient;
}

/**
 * Direct Razorpay Standard Order Creation
 * Validates minimum 100 paise, invokes Razorpay API, returns { order_id, amount, currency }
 */
async function createRazorpayOrder({ amount, currency = 'INR', receipt, notes = {} }) {
  const numericAmount = Number(amount);
  if (!numericAmount || isNaN(numericAmount) || numericAmount < 100) {
    const err = new Error('Amount must be at least 100 paise');
    err.statusCode = 400;
    throw err;
  }

  const client = getRazorpayClient();
  if (!client) {
    const err = new Error('Razorpay SDK not initialized. Ensure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are set.');
    err.statusCode = 500;
    throw err;
  }

  try {
    const order = await client.orders.create({
      amount: Math.round(numericAmount),
      currency: currency || 'INR',
      receipt: receipt || `rcpt_${Date.now()}`,
      notes: notes || {}
    });

    return {
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID || RAZORPAY_KEY_ID
    };
  } catch (err) {
    console.error('Razorpay SDK Order Creation Failed:', err);
    const statusCode = (err && (err.statusCode === 401 || err.status === 401)) ? 401 : 500;
    const msg = (err && err.error && err.error.description) || err.message || 'Razorpay order creation failed';
    const errorObj = new Error(msg);
    errorObj.statusCode = statusCode;
    throw errorObj;
  }
}

/**
 * Direct Razorpay Signature Verification
 * Algorithm: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
 */
function verifyRazorpaySignature({ order_id, payment_id, razorpay_signature }) {
  if (!order_id || !payment_id || !razorpay_signature) {
    const err = new Error('Missing required fields for signature verification');
    err.statusCode = 400;
    throw err;
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET || RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    const err = new Error('RAZORPAY_KEY_SECRET is not configured on server');
    err.statusCode = 500;
    throw err;
  }

  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${order_id}|${payment_id}`)
    .digest('hex');

  const bufA = Buffer.from(expectedSignature, 'utf8');
  const bufB = Buffer.from(razorpay_signature, 'utf8');
  if (bufA.length !== bufB.length) return false;

  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Creates an order with the active payment gateway
 */
async function createGatewayOrder({ orderId, amountINR, currency = 'INR', customerEmail, customerName, customerPhone, gateway = 'razorpay' }) {
  const amountPaisa = Math.round(amountINR * 100);

  // 1. Live Cashfree Order if selected & configured
  if (gateway === 'cashfree' && isCashfreeConfigured) {
    try {
      const isProd = process.env.NODE_ENV === 'production';
      const endpoint = isProd ? 'https://api.cashfree.com/pg/orders' : 'https://sandbox.cashfree.com/pg/orders';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'x-client-id': CASHFREE_APP_ID,
          'x-client-secret': CASHFREE_SECRET_KEY,
          'x-api-version': CASHFREE_API_VERSION,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          order_id: orderId,
          order_amount: amountINR,
          order_currency: currency,
          customer_details: {
            customer_id: 'cust_' + (customerEmail ? crypto.createHash('md5').update(customerEmail).digest('hex').slice(0, 10) : 'guest'),
            customer_name: customerName || 'Valued Creator',
            customer_email: customerEmail || 'guest@vanvimoments.shop',
            customer_phone: customerPhone || '9999999999'
          },
          order_meta: {
            return_url: `${process.env.BASE_URL || 'http://localhost:3000'}/order-success.html?order_id={order_id}`
          }
        })
      });

      const cfData = await response.json();
      if (response.ok && cfData.payment_session_id) {
        return {
          success: true,
          mode: 'live',
          gateway: 'cashfree',
          gatewayOrderId: cfData.order_id,
          paymentSessionId: cfData.payment_session_id,
          amountINR,
          currency
        };
      }
    } catch (err) {
      console.warn('Cashfree live order creation failed, falling back:', err.message);
    }
  }

  // 2. Live Razorpay Order if configured
  if (isRazorpayConfigured) {
    try {
      const authHeader = 'Basic ' + Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');
      const response = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: amountPaisa,
          currency,
          receipt: orderId,
          notes: {
            app: 'VanviMoments',
            customerName: customerName || 'Valued Creator'
          }
        })
      });

      const rzpOrder = await response.json();
      if (response.ok && rzpOrder.id) {
        return {
          success: true,
          mode: 'live',
          gateway: 'razorpay',
          gatewayOrderId: rzpOrder.id,
          keyId: RAZORPAY_KEY_ID,
          amountPaisa: rzpOrder.amount,
          currency: rzpOrder.currency
        };
      }
      throw new Error(rzpOrder.error ? rzpOrder.error.description : 'Failed to create Razorpay order');
    } catch (err) {
      console.warn('Live Razorpay order creation failed, falling back to secure simulation:', err.message);
    }
  }

  // 3. Safe Development Simulation Mode
  const simGatewayOrderId = 'order_sim_' + crypto.randomBytes(8).toString('hex');
  return {
    success: true,
    mode: 'simulation',
    gateway: gateway || 'razorpay',
    gatewayOrderId: simGatewayOrderId,
    keyId: RAZORPAY_KEY_ID || 'rzp_test_simulation',
    amountPaisa,
    currency
  };
}

/**
 * Verify Razorpay payment signature
 */
function verifyPaymentSignature({ gatewayOrderId, paymentId, signature }) {
  if (!isRazorpayConfigured) {
    return process.env.NODE_ENV !== 'production' && Boolean(gatewayOrderId && paymentId && signature);
  }

  if (!gatewayOrderId || !paymentId || !signature) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac('sha256', RAZORPAY_KEY_SECRET)
    .update(`${gatewayOrderId}|${paymentId}`)
    .digest('hex');

  const bufA = Buffer.from(expectedSignature, 'utf8');
  const bufB = Buffer.from(signature, 'utf8');
  if (bufA.length !== bufB.length) return false;

  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Verify Razorpay webhook HMAC signature
 */
function verifyWebhookSignature(rawBody, signatureHeader) {
  if (!RAZORPAY_WEBHOOK_SECRET || !signatureHeader) return false;

  const bodyString = typeof rawBody === 'string' ? rawBody : (Buffer.isBuffer(rawBody) ? rawBody.toString('utf8') : JSON.stringify(rawBody));
  const expectedSig = crypto
    .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
    .update(bodyString)
    .digest('hex');

  const bufA = Buffer.from(expectedSig, 'utf8');
  const bufB = Buffer.from(signatureHeader, 'utf8');
  if (bufA.length !== bufB.length) return false;

  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Verify Cashfree webhook signature
 */
function verifyCashfreeWebhookSignature({ timestamp, rawBody, signatureHeader }) {
  if (!CASHFREE_SECRET_KEY || !signatureHeader || !timestamp) return false;

  const bodyString = typeof rawBody === 'string' ? rawBody : (Buffer.isBuffer(rawBody) ? rawBody.toString('utf8') : JSON.stringify(rawBody));
  const payload = `${timestamp}${bodyString}`;
  const expectedSig = crypto
    .createHmac('sha256', CASHFREE_SECRET_KEY)
    .update(payload)
    .digest('base64');

  const bufA = Buffer.from(expectedSig, 'utf8');
  const bufB = Buffer.from(signatureHeader, 'utf8');
  if (bufA.length !== bufB.length) return false;

  return crypto.timingSafeEqual(bufA, bufB);
}

module.exports = {
  createGatewayOrder,
  createRazorpayOrder,
  verifyPaymentSignature,
  verifyRazorpaySignature,
  verifyWebhookSignature,
  verifyCashfreeWebhookSignature,
  getRazorpayClient,
  isLiveGatewayConfigured: () => isLiveGatewayConfigured,
  isRazorpayConfigured: () => isRazorpayConfigured,
  isCashfreeConfigured: () => isCashfreeConfigured
};
