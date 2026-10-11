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

/**
 * POST /api/orders/create
 * SERVER-SIDE PRICING & COIN ELIGIBILITY ENFORCEMENT
 */
router.post('/create', optionalAuth, async (req, res) => {
  try {
    const { momentId, templateName, templateId, applyCoins, applyPassCredits } = req.body;
    const userId = req.user ? req.user.id : null;

    // 1. Determine Base Price on Server (Authoritative)
    const catalogTemplate = templateId
      ? templatesCatalog.getById(templateId)
      : templatesCatalog.templates.find(template =>
        templateName && template.name.toLowerCase() === String(templateName).trim().toLowerCase()
      );
    const normalizedName = String(templateName || '').trim().toLowerCase();
    const catalogPrice = catalogTemplate
      ? Number(catalogTemplate.price)
      : (LEGACY_TEMPLATE_PRICES[normalizedName] ?? null);
    const configuredPrice = templateId ? COIN_CONFIG.TEMPLATE_PRICES[templateId] : null;
    const basePrice = catalogPrice !== null
      ? catalogPrice
      : (configuredPrice || COIN_CONFIG.TEMPLATE_PRICES['default'] || 199);

    let coinsUsed = 0;
    let discountINR = 0;
    let finalAmountINR = basePrice;
    let passCreditsUsed = 0;

    // 2. If user is logged in and requests coin redemption, calculate legitimate discount
    if (userId && applyCoins) {
      const user = await Users.findById(userId);
      const userCoins = user ? user.coins : 0;
      const eligibility = calculateCoinEligibility(basePrice, userCoins, user ? user.tier : 'free', { templateId });

      if (eligibility.eligible) {
        coinsUsed = eligibility.maxCoinsUsable;
        discountINR = eligibility.maxDiscountINR;
        finalAmountINR = eligibility.finalAmountINR;
      }
    }

    // 3. If user requests Celebration Pass Credits redemption (1 Credit = ₹1)
    if (userId && applyPassCredits) {
      const user = await Users.findById(userId);
      const availableCredits = Number(user ? user.templateCredits : 0);
      if (availableCredits > 0) {
        passCreditsUsed = Math.min(finalAmountINR, availableCredits);
        finalAmountINR = Math.max(0, finalAmountINR - passCreditsUsed);
      }
    }

    // 4. Create Server Order Record
    const order = await Orders.create({
      userId,
      momentId: momentId || null,
      templateName: catalogTemplate?.name || templateName || 'Bespoke Celebration',
      basePrice,
      coinsUsed,
      discountINR,
      passCreditsUsed,
      finalAmountINR,
      gateway: finalAmountINR === 0 ? 'credits_pass' : 'razorpay',
      status: finalAmountINR === 0 ? 'paid' : 'pending'
    });

    // 5. If 100% settled with credits, instantly deduct balance & activate moment
    let remainingUserCredits = null;
    if (userId && passCreditsUsed > 0) {
      const user = await Users.findById(userId);
      remainingUserCredits = Math.max(0, Number(user ? user.templateCredits : 0) - passCreditsUsed);
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
        gatewayOrderId: order.gatewayOrderId,
        basePrice,
        coinsUsed,
        discountINR,
        passCreditsUsed,
        finalAmountINR,
        currency: 'INR',
        amountInPaisa: Math.round(finalAmountINR * 100),
        status: order.status,
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

