const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

console.log('=== VANVI MOMENTS COMPREHENSIVE TEST SUITE ===\n');

// 1. Check Section Ordering (Updated to user's new layout)
const categoryPos = html.indexOf('class="section category-section"');
const discoverPos = html.indexOf('id="templateDiscovery"');
const freePos = html.indexOf('id="freeTemplateSlider"');
const premPos = html.indexOf('id="premiumTemplateSlider"');
const ultraThinPos = html.indexOf('class="ultra-thin-strip"');
const referralPos = html.indexOf('class="referral glass"');
const trendingPos = html.indexOf('id="trendingTemplateSlider"');
const otherMomentsPos = html.indexOf('❤️ Other Moments');
const makePos = html.indexOf('class="section make-section make-section"');
const mainUltraPos = html.indexOf('id="ultraSection"');

console.log('1. Section Order Check:');
console.log(' - Category section index:', categoryPos);
console.log(' - Discover (Search/Filter) index:', discoverPos);
console.log(' - Free Collection index:', freePos);
console.log(' - Premium Collection index:', premPos);
console.log(' - Thin Ultra Link index:', ultraThinPos);
console.log(' - Refer & Earn index:', referralPos);
console.log(' - Trending index:', trendingPos);
console.log(' - Other Moments index:', otherMomentsPos);
console.log(' - What Can You Make index:', makePos);
console.log(' - Main Ultra Section index:', mainUltraPos);

const isOrderCorrect = 
  categoryPos > 0 &&
  discoverPos > categoryPos &&
  freePos > discoverPos &&
  premPos > freePos &&
  ultraThinPos > premPos &&
  referralPos > ultraThinPos &&
  trendingPos > referralPos &&
  otherMomentsPos > trendingPos &&
  makePos > otherMomentsPos &&
  mainUltraPos > makePos;

console.log('Result: ' + (isOrderCorrect ? 'PASS (Exact requested order)' : 'FAIL'));

// 2. Hero Rotating Words
console.log('\n2. Hero Rotating Words Check:');
const words = ['SPECIAL.', 'BEAUTIFUL.', 'PERSONAL.', 'TIMELESS.'];
const wordsFound = words.every(w => html.includes(w));
console.log(' - Words exist: ' + (wordsFound ? 'PASS' : 'FAIL'));
const wordStageCentering = html.includes('justify-content: center !important') && html.includes('margin: 6px auto 0 !important');
console.log(' - Mobile centering CSS exists: ' + (wordStageCentering ? 'PASS' : 'FAIL'));

// 3. Three-line menu
console.log('\n3. Hamburger Menu Check:');
const menuButtonMatch = html.match(/<button[^>]*class="[^"]*menu mobile-only[^"]*"[^>]*>([\s\S]*?)<\/button>/i);
const spanCount = (menuButtonMatch[1].match(/<span><\/span>/g) || []).length;
console.log(' - Span count inside menu button: ' + spanCount);
const menuCssPass = html.includes('gap: 4px !important') && html.includes('flex-direction: column !important');
console.log(' - 3-line CSS styling: ' + (menuCssPass ? 'PASS' : 'FAIL'));

// 4. Floating Controls
console.log('\n4. Floating Controls Check:');
const hasAiFloat = html.includes('class="float-btn ai-float"');
const hasScratchFloat = html.includes('class="float-btn game-float scratch-float"');
const scratchNoShrink = html.includes('scratchWheelSpin') && html.includes('transform: none !important');
console.log(' - AI Floating button present: ' + (hasAiFloat ? 'PASS' : 'FAIL'));
console.log(' - Scratch/Spin Floating button present: ' + (hasScratchFloat ? 'PASS' : 'FAIL'));
console.log(' - Button container inside viewport (bottom/right): ' + (html.includes('right: 14px !important') ? 'PASS' : 'FAIL'));
console.log(' - Button scaling stopped / icon-only spin: ' + (scratchNoShrink ? 'PASS' : 'FAIL'));

// 5. Thin Ultra Premium Entry
console.log('\n5. Thin Ultra Premium Link Check:');
const ultraBadge = html.includes('Ultra Premium');
const ultraText = html.includes('Create something truly extraordinary');
const ultraLink = html.includes('Explore Ultra Premium →');
console.log(' - Ultra badge, text, and link present: ' + (ultraBadge && ultraText && ultraLink ? 'PASS' : 'FAIL'));

// 6. Color Flow Check
console.log('\n6. Color Flow Gradient Check:');
const hasTopPink = html.includes('#fff8fb 0%') && html.includes('#ffe9f2 16%');
const hasMidLilac = html.includes('#f8ebfc 36%') && html.includes('#f0e8ff 56%');
const hasSoftBlue = html.includes('#e8f3ff 78%') && html.includes('#e6edff 92%');
console.log(' - Top Pink -> Lilac -> Soft Blue gradient: ' + (hasTopPink && hasMidLilac && hasSoftBlue ? 'PASS' : 'FAIL'));

// 7. Button stability / Zoom movement
console.log('\n7. Button Stability & Overflow Check:');
const overflowHidden = html.includes('overflow-x: hidden !important');
const noButtonTilt = html.includes('/* Stop button physical tilt/jump while keeping glowing ambient flow */');
console.log(' - Overflow-x locked: ' + (overflowHidden ? 'PASS' : 'FAIL'));
console.log(' - Button float shaking removed: ' + (noButtonTilt ? 'PASS' : 'FAIL'));
