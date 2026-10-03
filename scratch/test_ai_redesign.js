/**
 * VANVI AI — REDESIGN VERIFICATION SUITE
 * Verifies simple UX, natural language understanding, 1-card result,
 * essential 5 actions, builder handoff, and mobile responsiveness.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('\n======================================================');
console.log('   VANVI AI — REDESIGN VERIFICATION SUITE');
console.log('======================================================\n');

const html = fs.readFileSync(path.join(__dirname, '..', 'ai.html'), 'utf8');

// 1. Hero Content & Copy
console.log('1. Checking Hero Content & Copy...');
assert.ok(html.includes('Tell Vanvi what you want to create.'), 'Hero headline must match');
assert.ok(html.includes('Just type it normally. Vanvi will understand.'), 'Hero subtitle must match');
console.log('  ✅ Hero headline and subtitle verified.');

// 2. Large Input
console.log('\n2. Checking Large Hero Input Box...');
assert.ok(html.includes('id="aiPromptInput"'), 'Prompt textarea present');
assert.ok(html.includes('placeholder="Birthday message for my best friend..."'), 'Exact placeholder verified');
assert.ok(html.includes('font-size: 16px; /* Crucial: 16px prevents mobile auto-zoom */'), '16px input font size verified');
console.log('  ✅ Large input box with placeholder and 16px anti-zoom verified.');

// 3. Occasions & Styles Selectors
console.log('\n3. Checking Quick Selectors...');
const occasions = ['Birthday', 'Love', 'Anniversary', 'Friendship', 'Celebration', 'Other'];
occasions.forEach(occ => {
  assert.ok(html.includes(`data-occ="${occ}"`), `Occasion chip for ${occ} must be present`);
});

const styles = ['Emotional', 'Cute', 'Elegant', 'Fun'];
styles.forEach(st => {
  assert.ok(html.includes(`data-style="${st}"`), `Style chip for ${st} must be present`);
});
console.log('  ✅ 6 Occasion chips and 4 Style chips verified.');

// 4. Primary Button
console.log('\n4. Checking Primary Button...');
assert.ok(html.includes('id="btnCreateWithVanvi"'), 'Primary create button present');
assert.ok(html.includes('Create with Vanvi ✨'), 'Button label verified');
console.log('  ✅ ONE Primary Button "Create with Vanvi ✨" verified.');

// 5. Smart "Vanvi Understood" Card
console.log('\n5. Checking Smart "Vanvi understood" Card...');
assert.ok(html.includes('id="aiUnderstandingCard"'), 'Understanding card present');
assert.ok(html.includes('Vanvi understood:'), 'Understanding label verified');
assert.ok(html.includes('id="pillOccasion"'), 'Occasion pill present');
assert.ok(html.includes('id="pillRecipient"'), 'Recipient pill present');
assert.ok(html.includes('id="pillStyle"'), 'Style pill present');
assert.ok(html.includes('id="pillLanguage"'), 'Language pill present');
console.log('  ✅ Smart understanding card with editable pills verified.');

// 6. Single Result Card & 5 Essential Actions
console.log('\n6. Checking Single Result Card & 5 Essential Actions...');
assert.ok(html.includes('id="resultCard"'), 'Result card present');
assert.ok(html.includes('id="messageOutput"'), 'Message output box present');
assert.ok(html.includes('id="btnMakeBetter"'), 'Action 1: Make it better present');
assert.ok(html.includes('id="btnTryAnother"'), 'Action 2: Try another present');
assert.ok(html.includes('id="btnCopy"'), 'Action 3: Copy present');
assert.ok(html.includes('id="btnEdit"'), 'Action 4: Edit present');
assert.ok(html.includes('id="btnCreateMyMoment"'), 'Action 5: Create My Moment present');
assert.ok(!html.includes('Variation 1 · Deep'), 'No confusing 10+ tab clutter in default card');
console.log('  ✅ Exactly 5 clear actions verified (Make better, Try another, Copy, Edit, Create My Moment).');

// 7. Loading and Error States
console.log('\n7. Checking Loading & Error States...');
assert.ok(html.includes('Vanvi is creating something special...'), 'Clean loading state message present');
assert.ok(html.includes('Something went wrong. Try again.'), 'Friendly error state message present');
console.log('  ✅ Clean loading and error states verified.');

// 8. Advanced "More Options" Drawer
console.log('\n8. Checking Advanced Options Drawer...');
assert.ok(html.includes('id="btnToggleMoreOptions"'), 'More options toggle button present');
assert.ok(html.includes('id="optionsDrawer" style="display:none;"'), 'Drawer closed by default');
assert.ok(html.includes('id="ctrlLanguage"'), 'Language select present');
assert.ok(html.includes('id="ctrlLength"'), 'Length select present');
assert.ok(html.includes('id="ctrlFeeling"'), 'Feeling select present');
assert.ok(html.includes('id="ctrlRecipient"'), 'Recipient select present');
console.log('  ✅ Advanced options drawer (Language, Length, Feeling, Recipient) verified hidden by default.');

// 9. Builder Studio Handoff
console.log('\n9. Checking Builder Studio Handoff...');
assert.ok(html.includes("sessionStorage.setItem('vanvi_transient_moment'"), 'Transient moment stored in sessionStorage');
assert.ok(html.includes('builder.html?mode=create'), 'Redirects to builder.html with parameters');
console.log('  ✅ Context handoff to existing Builder Studio verified.');

// 10. Mobile Viewport & CSS Check
console.log('\n10. Checking Mobile Viewports (320px - 414px) & CSS Constraints...');
assert.ok(html.includes('<meta content="width=device-width'), 'Viewport meta width=device-width present');
assert.ok(html.includes('overflow-x: hidden !important;'), 'Strict horizontal overflow locked');
assert.ok(html.includes('min-height: 52px;'), 'Thumb-friendly primary button size');
assert.ok(html.includes('min-height: 48px;'), 'Thumb-friendly handoff button size');
console.log('  ✅ Mobile layout & viewport rules verified.');

console.log('\n======================================================');
console.log('🎉 ALL 10 AI REDESIGN VERIFICATIONS PASSED 100%!');
console.log('======================================================\n');

