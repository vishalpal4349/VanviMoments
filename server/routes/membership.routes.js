const express = require('express');
const router = express.Router();
const { Memberships, Users, Orders, CoinLedger } = require('../db/database');
const { requireAuth } = require('../middleware/auth');
const { MEMBERSHIP_PLANS, TIER_PERKS, TEMPLATE_PASSES } = require('../config/membership');
const { createGatewayOrder } = require('../services/payment.service');

/**
 * GET /api/membership/plans
 * Public endpoint to list available plans, perks, and celebration passes
 */
router.get('/plans', (req, res) => {
  return res.json({
    success: true,
    plans: Object.values(MEMBERSHIP_PLANS),
    passes: Object.values(TEMPLATE_PASSES),
    perks: TIER_PERKS
  });
});

/**
 * GET /api/membership/status
 * Check current user's membership and template pass status
 */
router.get('/status', requireAuth, async (req, res) => {
  try {
    const user = req.user;
    const activeMem = await Memberships.getActiveByUserId(user.id);
    const perks = TIER_PERKS[user.tier] || TIER_PERKS.free;

    return res.json({
      success: true,
      tier: user.tier,
      isMember: user.tier !== 'free',
      membership: activeMem,
      perks,
      templateCredits: user.templateCredits || 0,
      activePass: user.activePass || null,
      passExpiry: user.passExpiry || null
    });
  } catch (err) {
    console.error('Membership status error:', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve membership status.' });
  }
});

/**
 * POST /api/membership/subscribe
 * Initiate subscription purchase
 */
router.post('/subscribe', requireAuth, async (req, res) => {
  try {
    const { planId } = req.body;
    const plan = MEMBERSHIP_PLANS[planId];

    if (!plan) {
      return res.status(400).json({ success: false, error: 'Invalid membership plan selected.' });
    }

    const user = req.user;

    // Create payment gateway order for membership
    const gatewayOrder = await createGatewayOrder({
      orderId: 'mem_ord_' + Date.now(),
      amountINR: plan.priceINR,
      customerEmail: user.email,
      customerName: user.name
    });

    if (process.env.NODE_ENV === 'production' && gatewayOrder.mode === 'simulation') {
      return res.status(503).json({
        success: false,
        error: 'Membership payments are not configured yet. Please try again later.'
      });
    }

    if (gatewayOrder.mode !== 'simulation') {
      return res.status(201).json({
        success: true,
        pending: true,
        plan,
        gatewayOrder,
        message: 'Payment order created. Membership activates after verified payment.'
      });
    }

    // Directly activate membership in dev / simulation mode
    const membership = await Memberships.create({
      userId: user.id,
      planId: plan.id,
      durationDays: plan.durationDays,
      gatewaySubId: gatewayOrder.gatewayOrderId
    });

    // Credit bonus loyalty coins if the plan provides them (e.g. Annual gets 500 coins)
    if (plan.bonusCoins && plan.bonusCoins > 0) {
      await CoinLedger.create({
        userId: user.id,
        type: 'credit',
        amount: plan.bonusCoins,
        reason: `${plan.name} Welcome Reward (+${plan.bonusCoins} Coins)`,
        refId: 'bonus_' + membership.id
      });
    }

    const updatedUser = await Users.findById(user.id);

    return res.status(201).json({
      success: true,
      plan,
      membership,
      user: updatedUser,
      gatewayOrder,
      message: `Successfully upgraded to ${plan.name}!`
    });
  } catch (err) {
    console.error('Membership subscription error:', err);
    return res.status(500).json({ success: false, error: 'Failed to process membership subscription.' });
  }
});

/**
 * POST /api/membership/buy-pass
 * Purchase a prepaid Template Celebration Pass (Credits Economy)
 */
router.post('/buy-pass', requireAuth, async (req, res) => {
  try {
    const { passId } = req.body;
    const pass = TEMPLATE_PASSES[passId];

    if (!pass) {
      return res.status(400).json({ success: false, error: 'Invalid celebration pass selected.' });
    }

    const user = req.user;

    // Create payment gateway order for the pass
    const gatewayOrder = await createGatewayOrder({
      orderId: 'pass_ord_' + Date.now(),
      amountINR: pass.priceINR,
      customerEmail: user.email,
      customerName: user.name
    });

    if (process.env.NODE_ENV === 'production' && gatewayOrder.mode === 'simulation') {
      return res.status(503).json({
        success: false,
        error: 'Pass payments are not configured yet. Please try again later.'
      });
    }

    if (gatewayOrder.mode !== 'simulation') {
      return res.status(202).json({
        success: true,
        pending: true,
        pass,
        gatewayOrder,
        message: 'Payment order created. Pass activates after verified payment.'
      });
    }

    // Direct simulation / development instant activation
    const currentCredits = Number(user.templateCredits || 0);
    const newCredits = currentCredits + pass.credits;
    const expiryDate = Date.now() + (pass.validityDays * 86400000);

    const updatedUser = await Users.update(user.id, {
      templateCredits: newCredits,
      activePass: pass.name,
      activePassId: pass.id,
      passExpiry: expiryDate
    });

    return res.status(201).json({
      success: true,
      pass,
      creditsAdded: pass.credits,
      totalCredits: newCredits,
      passExpiry: expiryDate,
      user: updatedUser,
      message: `🎉 Celebration Pass Activated! You have ${newCredits} Template Credits to spend.`
    });
  } catch (err) {
    console.error('Pass purchase error:', err);
    return res.status(500).json({ success: false, error: 'Failed to process celebration pass purchase.' });
  }
});

module.exports = router;


