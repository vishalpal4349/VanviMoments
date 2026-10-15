const express = require('express');
const router = express.Router();
const { Orders, Moments, Users, CoinLedger } = require('../db/database');
const { optionalAuth, requireAuth } = require('../middleware/auth');
const { COIN_CONFIG, calculateCoinEligibility } = require('../config/coins');
const templatesCatalog = require('../../js/vanvi-templates-data.js');
const { sendOrderConfirmation } = require('../services/email.service');

const LEGACY_TEMPLATE_PRICES = {
  'midnight wish 3d cinema': 1000
};

const VALID_COUPONS = {
  'WELCOME30': { pct: 30, label: '30% Welcome Bonus' },
  'LOVE25': { pct: 25, label: '25% Love Celebration Special' },
  'SPECIAL25': { pct: 25, label: '25% Festive Offer' },
  'VANVI20': { pct: 20, label: '20% Creator Reward' },
  'CELEBRATE20': { pct: 20, label: '20% Celebration Voucher' },
  'HELP15': { pct: 15, label: '15% Concierge Courtesy Coupon' }
};

/**
 * POST /api/orders/create
 * SERVER-SIDE PRICING & COIN / COUPON ELIGIBILITY ENFORCEMENT
 */
router.post('/create', optionalAuth, async (req, res) => {
  try {
    const { momentId, templateName, templateId, applyCoins, applyPassCredits, couponCode, customAmount } = req.body;
    const userId = req.user ? req.user.id : null;

    if (momentId) {
      const moment = await Moments.findById(momentId);
      if (!moment) {
        return res.status(404).json({ success: false, error: 'Celebration moment not found.' });
      }
      if (moment.userId && moment.userId !== userId) {
        return res.status(403).json({ success: false, error: 'You are not authorized to purchase this moment.' });
      }
    }

    // 1. Determine Base Price on Server (Authoritative)
    const catalogTemplate = templateId
      ? templatesCatalog.getById(templateId)
      : templatesCatalog.templates.find(template =>
        templateName && template.name.toLowerCase() === String(templateName).trim().toLowerCase()
      );
    const normalizedName = String(templateName || '').trim().toLowerCase();

    let basePrice = 199;
    if (customAmount && Number(customAmount) > 0) {
      basePrice = Math.max(1, Math.round(Number(customAmount)));
    } else if (catalogTemplate && Number.isFinite(Number(catalogTemplate.price))) {
      basePrice = Number(catalogTemplate.price);
    } else if (LEGACY_TEMPLATE_PRICES[normalizedName]) {
      basePrice = LEGACY_TEMPLATE_PRICES[normalizedName];
    } else if (templateId && COIN_CONFIG.TEMPLATE_PRICES[templateId]) {
      basePrice = COIN_CONFIG.TEMPLATE_PRICES[templateId];
    } else if (req.body.amount && Number(req.body.amount) > 0) {
      basePrice = Math.max(1, Math.round(Number(req.body.amount)));
    } else {
      basePrice = COIN_CONFIG.TEMPLATE_PRICES['default'] || 199;
    }

    // 2. Validate & Apply Promotional Coupon (WELCOME30 = 30%, LOVE25 = 25%, etc.)
    let couponDiscountINR = 0;
    let appliedCoupon = null;
    if (couponCode) {
      const cleanCode = String(couponCode).trim().toUpperCase();
      if (VALID_COUPONS[cleanCode]) {
        appliedCoupon = cleanCode;
        const cMeta = VALID_COUPONS[cleanCode];
        couponDiscountINR = Math.round((basePrice * cMeta.pct) / 100);
      }
    }
    const amountAfterCoupon = Math.max(0, basePrice - couponDiscountINR);

    let coinsUsed = 0;
    let discountINR = 0;
    let passCreditsUsed = 0;
    let amountAfterCoins = amountAfterCoupon;

    // 3. Coins Redemption (30% for Free users, 50% for Club / VIP users)
    const user = userId ? await Users.findById(userId) : null;
    if (applyCoins) {
      const userCoins = user ? user.coins : (req.body.userCoins ? Math.max(0, parseInt(req.body.userCoins, 10) || 0) : 0);
      const userTier = user ? user.tier : (req.body.userTier || 'free');
      const eligibility = calculateCoinEligibility(amountAfterCoupon, userCoins, userTier, { templateId });

      if (eligibility.eligible) {
        coinsUsed = eligibility.maxCoinsUsable;
        discountINR = eligibility.maxDiscountINR;
        amountAfterCoins = Math.max(0, amountAfterCoupon - discountINR);
      }
    }

    // 4. Celebration Pass Credits (1 Credit = ₹1)
    if (applyPassCredits) {
      const availableCredits = Number(user ? user.templateCredits : (req.body.userCredits || 0));
      if (availableCredits > 0) {
        passCreditsUsed = Math.min(amountAfterCoins, availableCredits);
      }
    }

    const finalAmountINR = Math.max(0, amountAfterCoins - passCreditsUsed);

    // 5. Create Server Order Record
    const order = await Orders.create({
      userId,
      momentId: momentId || null,
      templateName: catalogTemplate?.name || templateName || 'Bespoke Celebration',
      basePrice,
      couponCode: appliedCoupon,
      couponDiscountINR,
      coinsUsed,
      discountINR,
      passCreditsUsed,
      finalAmountINR,
      gateway: finalAmountINR === 0 ? 'credits_pass' : 'razorpay',
      status: finalAmountINR === 0 ? 'paid' : 'pending'
    });

    let gatewayOrder = null;
    if (finalAmountINR > 0) {
      try {
        const { createGatewayOrder } = require('../services/payment.service');
        gatewayOrder = await createGatewayOrder({
          orderId: order.id,
          amountINR: finalAmountINR,
          currency: 'INR',
          customerEmail: req.user ? req.user.email : undefined,
          customerName: req.user ? req.user.name : undefined,
          customerPhone: req.user ? req.user.phone : undefined
        });
        await Orders.update(order.id, {
          gateway: gatewayOrder.gateway || 'razorpay',
          gatewayOrderId: gatewayOrder.gatewayOrderId
        });
      } catch (gatewayError) {
        await Orders.update(order.id, { status: 'failed' });
        return res.status(gatewayError.statusCode || 503).json({
          success: false,
          error: gatewayError.statusCode === 400
            ? gatewayError.message
            : 'Payment gateway is unavailable. Please try again later.'
        });
      }
    }

    // 6. If 100% settled with credits/coins/welcome bonus, instantly deduct balance & activate moment
    let remainingUserCredits = null;
    if (userId && passCreditsUsed > 0) {
      const freshUser = await Users.findById(userId);
      remainingUserCredits = Math.max(0, Number(freshUser ? freshUser.templateCredits : 0) - passCreditsUsed);
      await Users.update(userId, { templateCredits: remainingUserCredits });

      if (finalAmountINR === 0 && momentId) {
        await Moments.update(momentId, { status: 'published' });
        const moment = await Moments.findById(momentId);
        sendOrderConfirmation({
          toEmail: user ? user.email : null,
          customerName: user ? user.name : 'VIP Pass Creator',
          customerPhone: user ? user.phone : null,
          orderId: order.id,
          templateName: order.templateName,
          amountINR: 0,
          momentUrl: `moment.html?id=${moment ? moment.slug : 'published'}`,
          momentPin: moment ? moment.pinHint : null,
          paymentId: 'credits_pass_settled'
        }).catch(err => console.warn('[Credits Order Email Notice]', err.message));
      }
    }

    // 6. Return Gateway-Ready Payload
    return res.status(201).json({
      success: true,
      order: {
        id: order.id,
        gatewayOrderId: gatewayOrder ? gatewayOrder.gatewayOrderId : order.gatewayOrderId,
        basePrice,
        couponCode: appliedCoupon,
        couponDiscountINR,
        coinsUsed,
        discountINR,
        passCreditsUsed,
        finalAmountINR,
        currency: 'INR',
        amountInPaisa: Math.round(finalAmountINR * 100),
        status: order.status,
        paymentMode: gatewayOrder ? gatewayOrder.mode : (finalAmountINR === 0 ? 'simulation' : 'live'),
        paymentGateway: gatewayOrder ? gatewayOrder.gateway : (finalAmountINR === 0 ? 'credits_pass' : 'razorpay'),
        paymentSessionId: gatewayOrder ? gatewayOrder.paymentSessionId : null,
        keyId: gatewayOrder ? (gatewayOrder.keyId || gatewayOrder.key_id || null) : (process.env.RAZORPAY_KEY_ID || 'rzp_live_TnxqOG4GfR4ZXi'),
        fullyCoveredByCredits: finalAmountINR === 0,
        remainingCredits: remainingUserCredits
      }
    });
  } catch (err) {
    console.error('Order creation error:', err);
    return res.status(500).json({ success: false, error: 'Failed to create order.' });
  }
});

module.exports = router;
