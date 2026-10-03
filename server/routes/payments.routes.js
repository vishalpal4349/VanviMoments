const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { Orders, Moments, CoinLedger, Users } = require('../db/database');
const { optionalAuth } = require('../middleware/auth');
const { ordersRateLimiter } = require('../middleware/security');
const {
  verifyPaymentSignature,
  verifyWebhookSignature,
  verifyCashfreeWebhookSignature
} = require('../services/payment.service');
const { sendOrderConfirmation } = require('../services/email.service');

/**
 * POST /api/payments/verify
 * Confirms payment, applies ledger deductions, publishes moment, and dispatches email receipt
 */
router.post('/verify', ordersRateLimiter, optionalAuth, async (req, res) => {
  try {
    const { orderId, paymentId, signature, momentData, customerEmail, customerName } = req.body;

    if (!orderId) {
      return res.status(400).json({ success: false, error: 'Order ID is required.' });
    }

    const order = await Orders.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found.' });
    }

    if (order.status === 'paid') {
      const existingMoment = order.momentId ? await Moments.findById(order.momentId) : null;
      return res.json({
        success: true,
        message: 'Order already completed.',
        order,
        momentSlug: existingMoment ? existingMoment.slug : 'published',
        shareUrl: existingMoment ? `moment.html?id=${existingMoment.slug}` : 'dashboard.html'
      });
    }

    // Verify signature timing-safely
    const isValid = verifyPaymentSignature({
      gatewayOrderId: order.gatewayOrderId,
      paymentId,
      signature
    });

    if (!isValid) {
      return res.status(400).json({ success: false, error: 'Invalid payment signature.' });
    }

    // Mark order as paid
    await Orders.markAsPaid(order.id, {
      paymentId: paymentId || 'pay_sim_' + Date.now(),
      paidAt: Date.now()
    });

    // Deduct coins from user ledger if coins were applied
    if (order.userId && order.coinsUsed > 0) {
      await CoinLedger.create({
        userId: order.userId,
        type: 'debit',
        amount: order.coinsUsed,
        reason: `Checkout discount on ${order.templateName}`,
        refId: order.id
      });
    }

    // Activate or create the published moment
    let moment = null;
    if (order.momentId) {
      moment = await Moments.findById(order.momentId);
      if (moment) {
        moment = await Moments.update(moment.id, { status: 'published' });
      }
    } else if (momentData) {
      // Create new published moment
      moment = await Moments.create({
        userId: order.userId,
        title: momentData.title || order.templateName,
        recipient: momentData.recipient,
        sender: momentData.sender,
        occasion: momentData.occasion,
        message: momentData.message,
        photos: momentData.photos,
        musicTrack: momentData.musicTrack,
        lockMode: momentData.lockMode,
        pinHash: momentData.pinHash,
        pinHint: momentData.pinHint,
        theme: momentData.theme,
        status: 'published'
      });
      await Orders.update(order.id, { momentId: moment.id });
    }

    const momentSlug = moment ? moment.slug : 'published';
    const recipientEmail = customerEmail || (req.user ? req.user.email : null);
    const buyerName = customerName || (req.user ? req.user.name : 'Valued Creator');
    const shareUrl = `moment.html?id=${momentSlug}`;

    // Dispatch transactional confirmation receipt asynchronously
    if (recipientEmail) {
      sendOrderConfirmation({
        toEmail: recipientEmail,
        customerName: buyerName,
        orderId: order.id,
        templateName: order.templateName,
        amountINR: order.finalAmountINR,
        momentUrl: `${process.env.BASE_URL || ''}/${shareUrl}`,
        momentPin: moment ? moment.pinHint : null
      }).catch(err => console.warn('Email dispatch warning:', err.message));
    }

    return res.json({
      success: true,
      orderId: order.id,
      momentId: moment ? moment.id : null,
      momentSlug: momentSlug,
      shareUrl,
      message: 'Payment verified and moment published successfully!'
    });
  } catch (err) {
    console.error('Payment verification error:', err);
    return res.status(500).json({ success: false, error: 'Internal error during payment verification.' });
  }
});

/**
 * POST /api/payments/webhook
 * Production gateway webhook receiver with HMAC signature verification and auto-publish
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const rawBody = req.body;
    const rzpSignature = req.headers['x-razorpay-signature'];
    const cfSignature = req.headers['x-webhook-signature'];
    const cfTimestamp = req.headers['x-webhook-timestamp'];

    // Verify Razorpay Webhook
    if (rzpSignature) {
      const isValid = verifyWebhookSignature(rawBody, rzpSignature);
      if (!isValid) {
        return res.status(400).json({ error: 'Invalid Razorpay webhook signature' });
      }

      const payload = typeof rawBody === 'string' ? JSON.parse(rawBody) : JSON.parse(rawBody.toString('utf8'));
      if (payload.event === 'order.paid' || payload.event === 'payment.captured') {
        const paymentEntity = payload.payload?.payment?.entity;
        const gatewayOrderId = paymentEntity?.order_id;

        if (gatewayOrderId) {
          const order = await Orders.findByGatewayOrderId(gatewayOrderId);
          if (order && order.status !== 'paid') {
            await Orders.markAsPaid(order.id, {
              paymentId: paymentEntity.id,
              paidAt: Date.now()
            });

            if (order.momentId) {
              await Moments.update(order.momentId, { status: 'published' });
            }
          }
        }
      }
    }

    // Verify Cashfree Webhook
    if (cfSignature && cfTimestamp) {
      const isValid = verifyCashfreeWebhookSignature({
        timestamp: cfTimestamp,
        rawBody,
        signatureHeader: cfSignature
      });
      if (!isValid) {
        return res.status(400).json({ error: 'Invalid Cashfree webhook signature' });
      }
    }

    return res.status(200).json({ success: true, received: true });
  } catch (err) {
    console.error('Webhook processing error:', err);
    return res.status(500).json({ success: false, error: 'Webhook processing failed' });
  }
});

/**
 * STEP 1: POST /api/create-order & /api/payments/create-order
 * Request: { amount (paise), currency, receipt, notes }
 * Return: { order_id, amount, currency, key_id }
 * Minimum amount: 100 paise
 */
async function createOrderHandler(req, res) {
  try {
    const { amount, currency = 'INR', receipt, notes } = req.body;

    const numericAmount = Number(amount);
    if (!numericAmount || isNaN(numericAmount) || numericAmount < 100) {
      return res.status(400).json({
        success: false,
        error: 'Amount must be at least 100 paise'
      });
    }

    const { createRazorpayOrder } = require('../services/payment.service');
    const orderData = await createRazorpayOrder({
      amount: numericAmount,
      currency: currency || 'INR',
      receipt: receipt || `rcpt_${Date.now()}`,
      notes: notes || {}
    });

    return res.status(200).json({
      order_id: orderData.order_id,
      amount: orderData.amount,
      currency: orderData.currency,
      key_id: orderData.key_id
    });
  } catch (err) {
    console.error('Create Order Error:', err);
    const statusCode = err.statusCode || (err.message && err.message.includes('401') ? 401 : 500);
    return res.status(statusCode).json({
      success: false,
      error: err.message || 'Failed to create Razorpay order'
    });
  }
}

/**
 * STEP 3: POST /api/verify-payment & /api/payments/verify-payment
 * Algorithm: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
 * Compare generated signature with razorpay_signature
 * Return success only if signatures match
 */
async function verifyPaymentHandler(req, res) {
  try {
    const order_id = req.body.razorpay_order_id || req.body.order_id;
    const payment_id = req.body.razorpay_payment_id || req.body.payment_id;
    const razorpay_signature = req.body.razorpay_signature || req.body.signature;

    if (!order_id || !payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: 'Missing required payment verification fields'
      });
    }

    const { verifyRazorpaySignature } = require('../services/payment.service');
    let isValid = false;
    try {
      isValid = verifyRazorpaySignature({
        order_id,
        payment_id,
        razorpay_signature
      });
    } catch (sigErr) {
      return res.status(sigErr.statusCode || 400).json({
        success: false,
        error: sigErr.message
      });
    }

    if (!isValid) {
      return res.status(400).json({
        success: false,
        error: 'Signature mismatch'
      });
    }

    // Mark corresponding store order as paid if found
    let matchedOrder = await Orders.findByGatewayOrderId(order_id);
    if (!matchedOrder && req.body.appOrderId) {
      matchedOrder = await Orders.findById(req.body.appOrderId);
    }

    if (matchedOrder && matchedOrder.status !== 'paid') {
      await Orders.markAsPaid(matchedOrder.id, {
        paymentId: payment_id,
        paidAt: Date.now()
      });

      if (matchedOrder.userId && matchedOrder.coinsUsed > 0) {
        await CoinLedger.create({
          userId: matchedOrder.userId,
          type: 'debit',
          amount: matchedOrder.coinsUsed,
          reason: `Checkout discount on ${matchedOrder.templateName}`,
          refId: matchedOrder.id
        });
      }

      if (matchedOrder.momentId) {
        await Moments.update(matchedOrder.momentId, { status: 'published' });
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      order_id,
      payment_id
    });
  } catch (err) {
    console.error('Verify Payment Error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Internal error during payment verification'
    });
  }
}

function getConfigHandler(req, res) {
  return res.json({
    key_id: process.env.RAZORPAY_KEY_ID || '',
    currency: 'INR'
  });
}

// Router mounts
router.post('/create-order', createOrderHandler);
router.post('/verify-payment', verifyPaymentHandler);
router.get('/config', getConfigHandler);

module.exports = router;
module.exports.createOrderHandler = createOrderHandler;
module.exports.verifyPaymentHandler = verifyPaymentHandler;
module.exports.getConfigHandler = getConfigHandler;
