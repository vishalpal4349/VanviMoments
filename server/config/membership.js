/**
 * VANVI MOMENTS — MEMBERSHIP TIERS & PRIVILEGES CONFIGURATION
 * Single source of truth for subscription plans, discounts, and tier privileges.
 */

const MEMBERSHIP_PLANS = {
  free: {
    id: 'free',
    name: 'Free Creator',
    priceINR: 0,
    durationDays: 36500,
    billingCycle: 'forever',
    tier: 'free',
    badge: 'Creator',
    maxCoinDiscountPercent: 0.20, // 20% max coin discount
    spinMultiplier: 1.0,
    unlocksAllPremium: false,
    storage: '50MB Cloud Space',
    aiLimit: '5 Generations / day',
    coinRedemption: 'Max 20% (up to ₹200 on ₹1,000)'
  },
  monthly: {
    id: 'monthly',
    name: 'Vanvi Club',
    priceINR: 99,
    durationDays: 30,
    billingCycle: 'monthly',
    tier: 'member',
    badge: '💎 Club Member',
    maxCoinDiscountPercent: 0.40, // 40% max coin discount
    spinMultiplier: 1.5,
    unlocksAllPremium: true,
    bonusCoins: 0,
    storage: '2GB Cloud Vault',
    aiLimit: 'Unlimited Vanvi AI Studio',
    coinRedemption: 'Max 40% (up to ₹400 on ₹1,000)'
  },
  annual: {
    id: 'annual',
    name: 'Vanvi Club Annual',
    priceINR: 799,
    durationDays: 365,
    billingCycle: 'annual',
    tier: 'member',
    badge: '👑 Club Annual VIP',
    maxCoinDiscountPercent: 0.40, // 40% max coin discount
    spinMultiplier: 1.5,
    unlocksAllPremium: true,
    bonusCoins: 500, // 500 bonus coins on activation
    effectiveMonthlyINR: 66,
    storage: '5GB Cloud Vault',
    aiLimit: 'Unlimited Priority AI Studio',
    coinRedemption: 'Max 40% (up to ₹400 on ₹1,000)'
  },
  lifetime: {
    id: 'lifetime',
    name: 'Lifetime Patron',
    priceINR: 2499,
    durationDays: 36500, // 100 years
    billingCycle: 'lifetime',
    tier: 'vip',
    badge: '🌟 Lifetime Patron',
    maxCoinDiscountPercent: 0.40, // 40% max coin discount
    spinMultiplier: 2.0,
    unlocksAllPremium: true,
    bonusCoins: 1000,
    storage: '10GB Cloud Vault',
    aiLimit: 'VIP Turbo Co-Pilot Access',
    coinRedemption: 'Max 40% (up to ₹400 on ₹1,000)'
  }
};

const TIER_PERKS = {
  free: {
    name: 'Free Creator',
    badge: 'Creator',
    maxCoinDiscountPercent: 0.20,
    spinMultiplier: 1.0,
    maxDrafts: 5,
    unlimitedTemplates: false,
    creation: 'Basic Moment creation',
    ai: 'Limited Vanvi AI (5 runs/day)',
    templates: 'Basic 100% Free collection',
    customization: 'Basic text & single photo',
    storage: '50MB basic storage',
    sharing: 'Standard web & WhatsApp link',
    coins: 'Daily Fortune Wheel',
    coinRedemption: 'Up to 20% on eligible items',
    effects: 'Standard transitions',
    support: 'Community & standard email',
    earlyAccess: false,
    membershipBenefits: 'Standard'
  },
  member: {
    name: 'Vanvi Club Member',
    badge: '💎 Club Member',
    maxCoinDiscountPercent: 0.40,
    spinMultiplier: 1.5,
    maxDrafts: 100,
    unlimitedTemplates: true,
    creation: 'Unlimited Moment creation',
    ai: 'More Vanvi AI usage & poetic tones',
    templates: 'Full Premium & Cinema Catalog',
    customization: 'Advanced photo reels, PIN & custom music',
    storage: '2GB Cloud Vault',
    sharing: 'Custom slug recipient links',
    coins: '1.5x Daily Fortune Wheel multiplier + bonus',
    coinRedemption: 'Up to 40% on eligible items',
    effects: '3D wax seals, blooming petals, particle glow',
    support: 'Priority WhatsApp & Email support',
    earlyAccess: true,
    membershipBenefits: 'Club badge + member-only drops'
  },
  vip: {
    name: 'Lifetime Patron',
    badge: '🌟 Lifetime Patron',
    maxCoinDiscountPercent: 0.40,
    spinMultiplier: 2.0,
    maxDrafts: 999,
    unlimitedTemplates: true,
    creation: 'Unlimited lifetime Moment creation',
    ai: 'VIP Turbo AI Co-Pilot & unlimited generation',
    templates: 'Lifetime access to all Club-level templates',
    customization: 'Full suite: audio voiceovers, high-res galleries',
    storage: '10GB Cloud Vault',
    sharing: 'Ad-free white-label recipient experience',
    coins: '2.0x Daily Fortune Wheel + 1,000 bonus coins',
    coinRedemption: 'Up to 40% on eligible items',
    effects: 'All VIP effects & future cinematic packs',
    support: 'Dedicated VIP Concierge',
    earlyAccess: true,
    membershipBenefits: 'Permanent Patron badge & private beta access'
  }
};

const TEMPLATE_PASSES = {
  mini: {
    id: 'mini',
    name: 'Mini Celebration Pass',
    badge: '🌸 Starter Choice',
    priceINR: 249,
    credits: 320,
    bonusValueINR: 71,
    bonusPercent: 22,
    validityDays: 180,
    description: 'Ideal for 2 sweet celebrations (e.g. 2 × ₹149 standard templates).',
    idealFor: '2 Standard Celebrations',
    features: [
      '320 Usable Template Credits (1 Credit = ₹1)',
      'Valid on any template across all categories',
      'Instant 1-tap checkout with pass balance',
      'Use for partial top-up on Bespoke templates',
      '6 Months Validity'
    ]
  },
  creator: {
    id: 'creator',
    name: 'Creator Festival Pass',
    badge: '💖 Most Popular · Best Value',
    isPopular: true,
    priceINR: 499,
    credits: 700,
    bonusValueINR: 201,
    bonusPercent: 28,
    validityDays: 180,
    description: 'Ideal for 3–4 premium birthdays, anniversaries & love milestones.',
    idealFor: '3–4 Premium Experiences',
    features: [
      '700 Usable Template Credits (1 Credit = ₹1)',
      'Save ₹201 instantly (28% bonus purchasing power)',
      'Roll-over unspent credits for 6 months',
      'Covers multiple celebrations hassle-free',
      'Zero subscription commitment'
    ]
  },
  vip: {
    id: 'vip',
    name: 'VIP Luxury All-Access Pass',
    badge: '👑 Ultra Luxury & Bespoke',
    priceINR: 999,
    credits: 1500,
    bonusValueINR: 501,
    bonusPercent: 33,
    validityDays: 180,
    description: 'Maximum freedom for bespoke milestones, cinema reels & luxury designs.',
    idealFor: 'Bespoke, Cinema & Luxury Milestones',
    features: [
      '1,500 Usable Template Credits (1 Credit = ₹1)',
      'Save ₹501 instantly (33% bonus purchasing power)',
      'Unlocks High-Ticket & Bespoke creations',
      'Priority HD media delivery & Cloud vault',
      '6 Months Extended Validity'
    ]
  }
};

module.exports = {
  MEMBERSHIP_PLANS,
  TIER_PERKS,
  TEMPLATE_PASSES
};

