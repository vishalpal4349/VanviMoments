const express = require('express');
const router = express.Router();
const { Users, CoinLedger } = require('../db/database');
const { requireAuth, optionalAuth } = require('../middleware/auth');
const { 
  COIN_CONFIG, 
  calculateCoinEligibility, 
  pickRandomSpinReward, 
  pickRandomLuckyMomentReward, 
  getRandomZeroCoinMessage 
} = require('../config/coins');

/**
 * GET /api/coins/balance (User Balance & Ledger History)
 */
router.get('/balance', requireAuth, async (req, res) => {
  try {
    const user = req.user;
    const ledger = await CoinLedger.findByUserId(user.id);

    const now = Date.now();
    const lastSpin = user.lastSpinTime || 0;
    const cooldownMs = COIN_CONFIG.DAILY_SPIN.COOLDOWN_MS;
    const timeSinceSpin = now - lastSpin;
    const canSpin = timeSinceSpin >= cooldownMs;
    const nextSpinInMs = canSpin ? 0 : Math.max(0, cooldownMs - timeSinceSpin);

    // Lucky moment calculation (14 days cooldown)
    const lastLucky = user.lastLuckyMomentTime || 0;
    const luckyCooldownMs = COIN_CONFIG.LUCKY_MOMENT.COOLDOWN_MS;
    const timeSinceLucky = now - lastLucky;
    const canLucky = timeSinceLucky >= luckyCooldownMs;
    const nextLuckyInMs = canLucky ? 0 : Math.max(0, luckyCooldownMs - timeSinceLucky);

    return res.json({
      success: true,
      coins: user.coins,
      rupeeValue: (user.coins / COIN_CONFIG.COINS_PER_RUPEE).toFixed(2),
      canSpin,
      nextSpinInHours: Math.ceil(nextSpinInMs / (1000 * 3600)),
      luckyMoment: {
        eligible: canLucky,
        nextInDays: Math.ceil(nextLuckyInMs / (1000 * 3600 * 24)),
        remainingMs: nextLuckyInMs
      },
      ledger: ledger.slice(0, 50)
    });
  } catch (err) {
    console.error('Coins balance error:', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve coin balance.' });
  }
});

/**
 * POST /api/coins/spin (Server-Verified Daily Fortune Wheel with Reduced Economy)
 */
router.post('/spin', requireAuth, async (req, res) => {
  try {
    const user = req.user;
    const now = Date.now();
    const cooldownMs = COIN_CONFIG.DAILY_SPIN.COOLDOWN_MS;

    if (user.lastSpinTime && (now - user.lastSpinTime) < cooldownMs) {
      const remainingHours = Math.ceil((cooldownMs - (now - user.lastSpinTime)) / (1000 * 3600));
      return res.status(429).json({
        success: false,
        error: `Daily spin already used. Next free spin available in ~${remainingHours} hours.`
      });
    }

    // Pick weighted random reward from [0, 3, 5, 6, 9, 10, 15, 20, 25, 30, 40, 50, 60, 80]
    const wonCoins = pickRandomSpinReward();
    const isZero = wonCoins === 0;
    const zeroMessage = isZero ? getRandomZeroCoinMessage() : null;

    // Credit ledger and update last spin time
    await CoinLedger.create({
      userId: user.id,
      type: isZero ? 'zero_spin' : 'credit',
      amount: wonCoins,
      reason: isZero ? 'Daily Fortune Spin - Have a Good Day 😊' : 'Daily Fortune Wheel Spin',
      refId: 'spin_' + now
    });

    await Users.update(user.id, { lastSpinTime: now });

    const updatedUser = await Users.findById(user.id);

    return res.json({
      success: true,
      wonCoins,
      zeroMessage,
      newCoinBalance: updatedUser.coins,
      nextSpinInHours: 24
    });
  } catch (err) {
    console.error('Spin error:', err);
    return res.status(500).json({ success: false, error: 'Failed to process spin.' });
  }
});

/**
 * GET /api/coins/lucky-moment (Status of 14-Day Special Reward)
 */
router.get('/lucky-moment', requireAuth, async (req, res) => {
  try {
    const user = req.user;
    const now = Date.now();
    const lastLucky = user.lastLuckyMomentTime || 0;
    const cooldownMs = COIN_CONFIG.LUCKY_MOMENT.COOLDOWN_MS;
    const elapsed = now - lastLucky;
    const eligible = elapsed >= cooldownMs;
    const remainingMs = eligible ? 0 : Math.max(0, cooldownMs - elapsed);

    return res.json({
      success: true,
      eligible,
      remainingMs,
      remainingDays: Math.ceil(remainingMs / (1000 * 3600 * 24)),
      lastClaimedTime: lastLucky
    });
  } catch (err) {
    console.error('Lucky moment status error:', err);
    return res.status(500).json({ success: false, error: 'Failed to check lucky moment eligibility.' });
  }
});

/**
 * POST /api/coins/lucky-moment/claim (Claim Bi-Weekly Lucky Moment 20-60 Coins)
 */
router.post('/lucky-moment/claim', requireAuth, async (req, res) => {
  try {
    const user = req.user;
    const now = Date.now();
    const lastLucky = user.lastLuckyMomentTime || 0;
    const cooldownMs = COIN_CONFIG.LUCKY_MOMENT.COOLDOWN_MS;

    if (lastLucky && (now - lastLucky) < cooldownMs) {
      const remainingDays = Math.ceil((cooldownMs - (now - lastLucky)) / (1000 * 3600 * 24));
      return res.status(429).json({
        success: false,
        error: `Your next Lucky Moment is getting closer ✨ (~${remainingDays} days remaining).`
      });
    }

    // Weighted random selection from [20, 30, 40, 50, 60]
    const wonCoins = pickRandomLuckyMomentReward();

    await CoinLedger.create({
      userId: user.id,
      type: 'credit',
      amount: wonCoins,
      reason: 'Special 14-Day Lucky Moment Reward ✨',
      refId: 'lucky_' + now
    });

    await Users.update(user.id, { lastLuckyMomentTime: now });

    const updatedUser = await Users.findById(user.id);

    return res.json({
      success: true,
      wonCoins,
      newCoinBalance: updatedUser.coins,
      cooldownDays: 14
    });
  } catch (err) {
    console.error('Lucky moment claim error:', err);
    return res.status(500).json({ success: false, error: 'Failed to claim lucky moment.' });
  }
});

/**
 * POST /api/coins/calculate-eligibility
 * Public / Authenticated calculation endpoint for Checkout & Plans calculator
 */
router.post('/calculate-eligibility', optionalAuth, (req, res) => {
  try {
    const { orderAmountINR, userCoins, tier, templateId } = req.body;
    const effectiveTier = req.user ? req.user.tier : (tier || 'free');
    const effectiveCoins = (userCoins !== undefined) 
      ? userCoins 
      : (req.user ? req.user.coins : 0);

    const calculation = calculateCoinEligibility(orderAmountINR, effectiveCoins, effectiveTier, { templateId });
    return res.json({
      success: true,
      calculation
    });
  } catch (err) {
    console.error('Calculate eligibility error:', err);
    return res.status(500).json({ success: false, error: 'Failed to calculate coin eligibility.' });
  }
});

/**
 * POST /api/coins/game-reward
 * Skill challenge micro-games reward endpoint with strict 25 coins/day limit.
 * Rewards 2–10 coins per win.
 */
router.post('/game-reward', requireAuth, async (req, res) => {
  try {
    const user = req.user;
    const { gameId, gameTitle, score } = req.body;
    const DAILY_GAMES_CAP = 25; // Maximum 25 coins per day from games

    // Calculate start of today (midnight)
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    // Check coins already earned from games today in ledger
    const ledger = await CoinLedger.findByUserId(user.id);
    const earnedToday = ledger
      .filter(entry => entry.type === 'credit' && entry.refId && entry.refId.startsWith('game_') && entry.createdAt >= startOfDay)
      .reduce((sum, entry) => sum + (entry.amount || 0), 0);

    const remainingCap = Math.max(0, DAILY_GAMES_CAP - earnedToday);

    if (remainingCap <= 0) {
      return res.json({
        success: true,
        wonCoins: 0,
        earnedToday,
        remainingCap: 0,
        capReached: true,
        message: 'Daily game rewards limit (25 coins) reached. Resets at midnight! Keep playing for fun or coupons.'
      });
    }

    // Support fixed skill rewards (e.g. Memory Rush up to 13, Memory Sequence up to 15)
    let wonCoins = 0;
    const requestedCoins = parseInt(req.body.coins || req.body.requestedCoins, 10);
    if (!isNaN(requestedCoins) && requestedCoins > 0) {
      wonCoins = Math.min(15, requestedCoins); // Max 12 + 3 (perfect bonus) = 15 coins
    } else {
      wonCoins = Math.min(10, Math.max(2, Math.floor(Math.random() * 9) + 2));
    }
    if (wonCoins > remainingCap) {
      wonCoins = remainingCap;
    }

    if (wonCoins > 0) {
      await CoinLedger.create({
        userId: user.id,
        type: 'credit',
        amount: wonCoins,
        reason: `Game Reward: ${gameTitle || gameId || 'Celebration Challenge'}`,
        refId: 'game_' + Date.now()
      });
    }

    const updatedUser = await Users.findById(user.id);

    return res.json({
      success: true,
      wonCoins,
      earnedToday: earnedToday + wonCoins,
      remainingCap: Math.max(0, remainingCap - wonCoins),
      capReached: (earnedToday + wonCoins) >= DAILY_GAMES_CAP,
      newCoinBalance: updatedUser.coins
    });
  } catch (err) {
    console.error('Game reward error:', err);
    return res.status(500).json({ success: false, error: 'Failed to record game reward.' });
  }
});

/**
 * GET /api/coins/referral-stats
 * Get user's referral code, invite count, and referral coins summary
 */
router.get('/referral-stats', requireAuth, async (req, res) => {
  try {
    const user = req.user;
    const referralCode = `VANVI-${user.id.replace('usr_', '').slice(0, 6).toUpperCase()}`;

    const ledger = await CoinLedger.findByUserId(user.id);
    const referralCredits = ledger.filter(l => l.refId && l.refId.startsWith('ref_'));
    const totalEarned = referralCredits.reduce((sum, l) => sum + (l.amount || 0), 0);
    const completedInvites = referralCredits.length;

    return res.json({
      success: true,
      referralCode,
      stats: {
        friendsInvited: completedInvites + 1,
        momentsCreated: completedInvites,
        coinsEarned: totalEarned
      },
      history: referralCredits.map(l => ({
        amount: l.amount,
        reason: l.reason,
        date: l.createdAt
      }))
    });
  } catch (err) {
    console.error('Referral stats error:', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve referral stats.' });
  }
});

/**
 * POST /api/coins/referral/claim
 * Claim welcome bonus via referral code
 */
router.post('/referral/claim', requireAuth, async (req, res) => {
  try {
    const user = req.user;
    const { referralCode } = req.body;
    if (!referralCode || !referralCode.trim()) {
      return res.status(400).json({ success: false, error: 'Referral code is required.' });
    }

    const cleanCode = referralCode.trim().toUpperCase();
    const ledger = await CoinLedger.findByUserId(user.id);
    const alreadyClaimed = ledger.some(l => l.refId === 'ref_welcome');
    if (alreadyClaimed) {
      return res.status(400).json({ success: false, error: 'Referral welcome gift already claimed.' });
    }

    // Credit 50 bonus coins to referee
    await CoinLedger.create({
      userId: user.id,
      type: 'credit',
      amount: 50,
      reason: `Referral Welcome Gift (Code: ${cleanCode})`,
      refId: 'ref_welcome'
    });

    const updatedUser = await Users.findById(user.id);

    return res.json({
      success: true,
      bonusCoins: 50,
      newBalance: updatedUser.coins,
      message: 'Referral welcome gift of 50 Coins unlocked!'
    });
  } catch (err) {
    console.error('Referral claim error:', err);
    return res.status(500).json({ success: false, error: 'Failed to claim referral reward.' });
  }
});

module.exports = router;


