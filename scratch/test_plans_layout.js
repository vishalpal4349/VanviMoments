const fs = require('fs');
const html = fs.readFileSync('plans.html', 'utf8');

const requiredIds = [
  'creditsSliderSection',
  'coinsSliderSection',
  'subscriptionsSection',
  'comparisonSection',
  'btnAutoTourToggle',
  'tourDirectorBanner',
  'creditsTrack',
  'coinsTrack',
  'creditsSliderDots',
  'coinsSliderDots',
  'walletStatusCapsule',
  'currentUserCreditBalance',
  'currentUserCoinBalance',
  'currentUserTierBadge',
  'subModal',
  'currencyExplainerModal',
  'vanviToast'
];

let missing = [];
for (const id of requiredIds) {
  if (!html.includes('id="' + id + '"')) {
    missing.push(id);
  }
}

if (missing.length > 0) {
  console.error('Missing IDs:', missing);
  process.exit(1);
} else {
  console.log('✅ All required IDs verified successfully!');
}

// Check JS syntax
const scriptMatches = html.match(/<script[\s\S]*?<\/script>/gi);
let inlineScripts = '';
scriptMatches.forEach(tag => {
  if (!tag.includes('src=')) {
    const code = tag.replace(/<\/?script>/gi, '');
    inlineScripts += code + '\n';
  }
});

try {
  new Function(inlineScripts);
  console.log('✅ Inline JavaScript syntax is 100% valid!');
} catch (e) {
  console.error('JS Syntax Error:', e);
  process.exit(1);
}

// Check passes data
const passes = ['mini', 'creator', 'vip'];
passes.forEach(p => {
  if (!html.includes(`handlePassSelection('${p}')`)) {
    console.error(`Missing pass handler for ${p}`);
    process.exit(1);
  }
});
console.log('✅ All celebration pass triggers present!');

// Check coin packs data
const packs = ['spark', 'celebration', 'vault'];
packs.forEach(p => {
  if (!html.includes(`handleCoinPackSelection('${p}')`)) {
    console.error(`Missing coin pack handler for ${p}`);
    process.exit(1);
  }
});
console.log('✅ All coin pack triggers present!');

// Check memberships data
const plans = ['free', 'monthly', 'annual', 'lifetime'];
plans.forEach(pl => {
  if (!html.includes(`data-plan="${pl}"`)) {
    console.error(`Missing plan card for ${pl}`);
    process.exit(1);
  }
});
console.log('✅ All VIP memberships cards present in continuous flow!');
