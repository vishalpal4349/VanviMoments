/**
 * VANVI MOMENTS — CENTRAL COIN & PRICING RULES
 * Single source of truth for business thresholds, loyalty coins, and anti-abuse policies.
 */

const COIN_CONFIG = {
  // Exchange Rate: 10 coins = ₹1.00
  COINS_PER_RUPEE: 10,

  // Minimum order amount required to be eligible for coin redemption
  MIN_ORDER_FOR_DISCOUNT_INR: 150,

  // Absolute minimum cash amount that must be paid in INR
  MIN_PAYABLE_AMOUNT_INR: 49,

  // Maximum fixed rupee discount cap for standard templates (can be overridden per template)
  MAX_FIXED_DISCOUNT_CAP_INR: 500,

  // Maximum percentage discount allowed via coins based on tier
  // FREE: 20% max
  // CLUB / ANNUAL / LIFETIME: 40% max
  MAX_DISCOUNT_TIERS: {
    free: 0.20,       // Free users: max 20% discount (e.g., up to ₹200 on ₹1,000)
    member: 0.40,     // Club / Annual: max 40% discount (e.g., up to ₹400 on ₹1,000)
    vip: 0.40         // Lifetime Patron: max 40% discount
  },

  // Daily Fortune Wheel rules (Significantly reduced, non-predictable, weighted economy)
  DAILY_SPIN: {
    COOLDOWN_HOURS: 24,
    COOLDOWN_MS: 24 * 60 * 60 * 1000,
    MAX_WIN_COINS: 80,
    POSSIBLE_REWARDS: [0, 3, 5, 6, 9, 10, 15, 20, 25, 30, 40, 50, 60, 80],
    WEIGHTED_REWARDS: [
      { value: 0, weight: 100 },   // 10% - Emotional Zero-Coin Result
      { value: 3, weight: 180 },   // 18% - Common small reward
      { value: 5, weight: 180 },   // 18% - Common small reward
      { value: 6, weight: 130 },   // 13% - Common small reward
      { value: 9, weight: 110 },   // 11% - Common small reward
      { value: 10, weight: 100 },  // 10% - Common small reward (3,5,6,9,10 = 70%)
      { value: 15, weight: 70 },   // 7%  - Less common
      { value: 20, weight: 55 },   // 5.5% - Less common
      { value: 25, weight: 35 },   // 3.5% - Less common (15,20,25 = 16%)
      { value: 30, weight: 22 },   // 2.2% - Rare
      { value: 40, weight: 12 },   // 1.2% - Rare
      { value: 50, weight: 4 },    // 0.4% - Very rare
      { value: 60, weight: 1.5 },  // 0.15% - Extremely rare
      { value: 80, weight: 0.5 }   // 0.05% - Exceptional Jackpot
    ]
  },

  // Two-Week Special Reward ("Lucky Moment" — bi-weekly surprise)
  LUCKY_MOMENT: {
    COOLDOWN_DAYS: 14,
    COOLDOWN_MS: 14 * 24 * 60 * 60 * 1000,
    POSSIBLE_REWARDS: [20, 30, 40, 50, 60],
    WEIGHTED_REWARDS: [
      { value: 20, weight: 35 },
      { value: 30, weight: 30 },
      { value: 40, weight: 20 },
      { value: 50, weight: 10 },
      { value: 60, weight: 5 }
    ]
  },

  // Heartwarming, emotionally supportive zero-coin messages
  ZERO_COIN_MESSAGES: [
    { title: "Have a Good Day 😊", message: "Not every moment needs coins. Some moments just need a smile. ✨" },
    { title: "Keep Smiling ✨", message: "Today came with a warm smile instead of coins. Have a beautiful day! 💕" },
    { title: "A Little Joy for You 🌸", message: "Your next little surprise is waiting. Sending you warm thoughts! ✨" },
    { title: "Sunshine & Smiles 😊", message: "Some of the sweetest things in life are free. Enjoy every moment! 💖" },
    { title: "Positive Vibes ✨", message: "May your day be filled with laughter, love, and sweet celebration memories! 🌸" }
  ],

  // Welcome bonus for new signups
  WELCOME_BONUS_COINS: 100,

  // Standard template prices (INR)
  TEMPLATE_PRICES: {
    'default': 199,
    'bespoke': 199,
    'cinema-3d': 299,
    'vip-luxury': 499,
    'wedding-royal': 999,
    'the-grand-royal-palace-wedding': 999,
    'royal-udaipur': 999,
    'mirror-reveal': 999,
    'temple-grandeur': 999,
    'milestone-odyssey': 1000
  }
};

/**
 * Weighted random selector for daily spin rewards
 */
function pickRandomSpinReward() {
  const rewards = COIN_CONFIG.DAILY_SPIN.WEIGHTED_REWARDS;
  const totalWeight = rewards.reduce((sum, r) => sum + r.weight, 0);
  let random = Math.random() * totalWeight;
  for (const item of rewards) {
    if (random < item.weight) {
      return item.value;
    }
    random -= item.weight;
  }
  return rewards[0].value;
}

/**
 * Weighted random selector for bi-weekly Lucky Moment
 */
function pickRandomLuckyMomentReward() {
  const rewards = COIN_CONFIG.LUCKY_MOMENT.WEIGHTED_REWARDS;
  const totalWeight = rewards.reduce((sum, r) => sum + r.weight, 0);
  let random = Math.random() * totalWeight;
  for (const item of rewards) {
    if (random < item.weight) {
      return item.value;
    }
    random -= item.weight;
  }
  return rewards[0].value;
}

/**
 * Get random comforting zero-coin message
 */
function getRandomZeroCoinMessage() {
  const list = COIN_CONFIG.ZERO_COIN_MESSAGES;
  return list[Math.floor(Math.random() * list.length)];
}

/**
 * SMART COIN REDEMPTION CALCULATION ENGINE (AUTHORITATIVE SERVER-SIDE)
 *
 * Formula:
 * eligible_coin_discount = MIN(
 *     percentage_limit,
 *     fixed_rupee_cap,
 *     available_coin_value,
 *     template_allowed_discount
 * )
 *
 * final_payable = MAX(
 *     template_price - eligible_coin_discount,
 *     minimum_payable
 * )
 *
 * @param {number} orderAmountINR - Base price of the product/template
 * @param {number} userCoins - User's available coin balance
 * @param {string} tier - 'free' | 'member' | 'vip'
 * @param {object} options - Optional overrides (fixedRupeeCap, templateAllowedDiscount, minimumPayable, minOrderRequired)
 */
function calculateCoinEligibility(orderAmountINR, userCoins, tier = 'free', options = {}) {
  const basePrice = Math.max(0, Number(orderAmountINR) || 0);
  const coinsAvailable = Math.max(0, parseInt(userCoins, 10) || 0);
  const minOrderRequired = options.minOrderRequired !== undefined 
    ? options.minOrderRequired 
    : COIN_CONFIG.MIN_ORDER_FOR_DISCOUNT_INR;

  // 1. Minimum order eligibility check
  if (basePrice < minOrderRequired) {
    return {
      eligible: false,
      reason: `Orders under ₹${minOrderRequired} are not eligible for coin redemption.`,
      basePrice,
      maxCoinsUsable: 0,
      maxDiscountINR: 0,
      finalAmountINR: basePrice,
      remainingCoins: coinsAvailable,
      tier,
      maxPercentAllowed: 0
    };
  }

  // 2. Percentage limit: 20% for free, 40% for member/vip
  const maxPercent = COIN_CONFIG.MAX_DISCOUNT_TIERS[tier] !== undefined 
    ? COIN_CONFIG.MAX_DISCOUNT_TIERS[tier] 
    : COIN_CONFIG.MAX_DISCOUNT_TIERS.free;
  const percentageLimitINR = Math.floor(basePrice * maxPercent * 100) / 100;

  // 3. Fixed Rupee Cap (e.g. ₹500 default or template override)
  const fixedRupeeCapINR = options.fixedRupeeCap !== undefined 
    ? options.fixedRupeeCap 
    : COIN_CONFIG.MAX_FIXED_DISCOUNT_CAP_INR;

  // 4. Available coin cash value (10 coins = ₹1)
  const availableCoinValueINR = Math.floor((coinsAvailable / COIN_CONFIG.COINS_PER_RUPEE) * 100) / 100;

  // 5. Template-specific allowed discount (if capped lower for a high-value product)
  const templateAllowedDiscountINR = options.templateAllowedDiscount !== undefined 
    ? options.templateAllowedDiscount 
    : percentageLimitINR;

  // Authoritative discount = MIN of all 4 limits
  let eligibleDiscountINR = Math.min(
    percentageLimitINR,
    fixedRupeeCapINR,
    availableCoinValueINR,
    templateAllowedDiscountINR
  );

  // 6. Minimum payable amount constraint:
  // Customer must pay at least:
  // (a) BasePrice - percentageLimitINR (ensures max % is never exceeded)
  // (b) COIN_CONFIG.MIN_PAYABLE_AMOUNT_INR or custom minimumPayable
  const calculatedFloor = Math.max(0, Math.round(basePrice * (1 - maxPercent) * 100) / 100);
  const minimumPayable = options.minimumPayable !== undefined 
    ? options.minimumPayable 
    : Math.max(COIN_CONFIG.MIN_PAYABLE_AMOUNT_INR, calculatedFloor);

  if (basePrice - eligibleDiscountINR < minimumPayable) {
    eligibleDiscountINR = Math.max(0, basePrice - minimumPayable);
  }

  // Convert exact rupee discount to integer coins
  const maxCoinsUsable = Math.floor(eligibleDiscountINR * COIN_CONFIG.COINS_PER_RUPEE);
  const finalDiscountINR = Math.floor((maxCoinsUsable / COIN_CONFIG.COINS_PER_RUPEE) * 100) / 100;
  const finalAmountINR = Math.max(0, Math.round((basePrice - finalDiscountINR) * 100) / 100);

  return {
    eligible: maxCoinsUsable > 0,
    basePrice,
    tier,
    maxPercentAllowed: maxPercent,
    percentageLimitINR,
    fixedRupeeCapINR,
    templateAllowedDiscountINR,
    availableCoinValueINR,
    maxCoinsUsable,
    maxDiscountINR: finalDiscountINR,
    finalAmountINR,
    minimumPayableINR: minimumPayable,
    remainingCoins: coinsAvailable - maxCoinsUsable,
    coinsPerRupee: COIN_CONFIG.COINS_PER_RUPEE
  };
}

module.exports = {
  COIN_CONFIG,
  calculateCoinEligibility,
  pickRandomSpinReward,
  pickRandomLuckyMomentReward,
  getRandomZeroCoinMessage
};

