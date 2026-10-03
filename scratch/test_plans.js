const fs = require('fs');
const content = fs.readFileSync('plans.html', 'utf8');

const requiredIds = [
  'walletStatusCapsule',
  'currentUserCreditBalance',
  'currentUserCoinBalance',
  'currentUserTierBadge',
  'converterSection',
  'convertCoinInput',
  'convertCreditOutput',
  'plansMasterHub',
  'tabBtnPasses',
  'tabBtnCombos',
  'tabBtnCoins',
  'tabBtnSubs',
  'passesTrack',
  'combosTrack',
  'coinsTrack',
  'subsTrack',
  'hubSliderDots',
  'hubCategoryTitle',
  'hubSlideIndicator',
  'subModal',
  'vanviToast'
];

let missing = [];
requiredIds.forEach(id => {
  if (!content.includes('id="' + id + '"')) missing.push(id);
});

if (missing.length > 0) {
  console.error('Missing IDs:', missing);
  process.exit(1);
} else {
  console.log('PASS: All 21 essential UI and JS IDs verified present in plans.html!');
}

const requiredFunctions = [
  'switchHubTab',
  'slideActiveTrack',
  'jumpActiveTrack',
  'updateLiveConverter',
  'setConverterPreset',
  'executeCoinCreditConversion',
  'handlePassSelection',
  'handleCoinPackSelection',
  'handlePlanSelection',
  'runCalculator'
];

let missingFns = [];
requiredFunctions.forEach(fn => {
  if (!content.includes('function ' + fn)) missingFns.push(fn);
});

if (missingFns.length > 0) {
  console.error('Missing functions:', missingFns);
  process.exit(1);
} else {
  console.log('PASS: All 10 required JavaScript functions verified present!');
}
