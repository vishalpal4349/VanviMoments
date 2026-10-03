/**
 * TEST SUITE: VANVI BESPOKE TEMPLATE EXPERIENCE & PERSONALIZATION STUDIO
 * Validates dynamic archetypes, tailored customizers, interactive preview, and checkout handoffs.
 */

const fs = require('fs');
const assert = require('assert');
const path = require('path');

console.log('====================================================');
console.log('  TESTING VANVI BESPOKE TEMPLATE EXPERIENCE ENGINE  ');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function it(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     Error: ${err.message}`);
  }
}

// 1. Data Schema Verification
it('VanviTemplatesData exposes rich themes, experience types, and customizer profiles', () => {
  const code = fs.readFileSync('js/vanvi-templates-data.js', 'utf8');
  assert(code.includes('THEME_PRESETS'), 'Must define THEME_PRESETS');
  assert(code.includes('experienceType'), 'Must normalize experienceType');
  assert(code.includes('customizerProfile'), 'Must normalize customizerProfile');
  assert(code.includes('candle-cake'), 'Must support candle-cake archetype');
  assert(code.includes('wax-envelope'), 'Must support wax-envelope archetype');
  assert(code.includes('wedding-vows'), 'Must support wedding-vows archetype');
  assert(code.includes('festive-spark'), 'Must support festive-spark archetype');
  assert(code.includes('polaroid-wall'), 'Must support polaroid-wall archetype');
});

it('All 37 templates have required metadata and customized fields', () => {
  const sandbox = {};
  const code = fs.readFileSync('js/vanvi-templates-data.js', 'utf8');
  const runInContext = new Function('window', code);
  runInContext(sandbox);

  const templates = sandbox.VanviTemplatesData.templates;
  assert(Array.isArray(templates) && templates.length >= 35, `Catalog must have 35+ templates, found ${templates.length}`);

  templates.forEach(t => {
    assert(t.id, 'Every template must have an ID');
    assert(t.name, `Template ${t.id} must have a name`);
    assert(t.themeConfig, `Template ${t.id} must have a themeConfig`);
    assert(t.experienceType, `Template ${t.id} must have an experienceType`);
    assert(t.customizerProfile, `Template ${t.id} must have a customizerProfile`);
    assert(Array.isArray(t.customizableFields) && t.customizableFields.length > 0, `Template ${t.id} must have customizableFields`);
  });
});

// 2. HTML Architecture Verification
const detailHtml = fs.readFileSync('template-detail.html', 'utf8');

it('template-detail.html features exact user-requested primary CTA "✨ Make It Yours"', () => {
  assert(detailHtml.includes('✨ Make It Yours'), 'Must include exact primary CTA "✨ Make It Yours"');
  assert(detailHtml.includes('Create My Moment'), 'Must include final creation CTA "Create My Moment"');
});

it('template-detail.html includes interactive experience stage and device switcher', () => {
  assert(detailHtml.includes('id="interactiveStageArea"'), 'Must have interactive stage area');
  assert(detailHtml.includes('id="btnDeviceMobile"'), 'Must have mobile device switcher');
  assert(detailHtml.includes('id="btnDeviceDesktop"'), 'Must have desktop device switcher');
  assert(detailHtml.includes('id="btnFullscreen"'), 'Must have fullscreen toggle');
});

it('template-detail.html includes interactive candle blowout and wax unsealing layers', () => {
  assert(detailHtml.includes('id="cakeZone"'), 'Must have cake blowout zone');
  assert(detailHtml.includes('id="waxZone"'), 'Must have wax seal envelope zone');
  assert(detailHtml.includes('blowCandles()'), 'Must implement blowCandles()');
  assert(detailHtml.includes('unsealWax()'), 'Must implement unsealWax()');
});

it('template-detail.html includes Web Audio soundtrack synthesizer previewer', () => {
  assert(detailHtml.includes('toggleAudioPreview()'), 'Must have audio preview toggle');
  assert(detailHtml.includes('AudioContext'), 'Must leverage Web Audio API');
});

it('template-detail.html contains "Make It Yours" Studio with live keystroke preview synchronization', () => {
  assert(detailHtml.includes('id="viewStudio"'), 'Must have studio mode container');
  assert(detailHtml.includes('id="studioMiniPreviewCard"'), 'Must have real-time synchronized preview card');
  assert(detailHtml.includes('syncLivePreviews'), 'Must implement syncLivePreviews');
  assert(detailHtml.includes('addEventListener(\'input\''), 'Must sync inputs on keystroke');
});

it('template-detail.html features tailored archetype fields (not a generic one-size-fits-all form)', () => {
  assert(detailHtml.includes('id="groupAgeOrMilestone"'), 'Must have milestone/turning age group');
  assert(detailHtml.includes('id="groupEventDate"'), 'Must have date & countdown group');
  assert(detailHtml.includes('id="groupMessage"'), 'Must have message group');
  assert(detailHtml.includes('applyAiSuggestion'), 'Must provide AI quick refine helpers');
});

it('template-detail.html safely routes Free templates to instant share & Premium templates to Checkout', () => {
  assert(detailHtml.includes('checkout.html?template='), 'Must route premium templates to checkout with validation params');
  assert(detailHtml.includes('id="momentSuccessModal"'), 'Must feature instant moment celebration modal for free templates');
  assert(detailHtml.includes('vanvi_transient_moment'), 'Must preserve sessionStorage transient moment handoff');
});

it('template-detail.html preserves links and compatibility with builder and catalog', () => {
  assert(detailHtml.includes('builder.html?template='), 'Must provide optional handoff to advanced builder');
  assert(detailHtml.includes('templates/birthday-white-bloom-001/index.html'), 'Must route birthday white bloom');
  assert(detailHtml.includes('templates.html'), 'Must link back to templates');
});

console.log('\n====================================================');
console.log(`  RESULTS: ${passedTests}/${totalTests} TESTS PASSED (${Math.round(passedTests/totalTests*100)}%)`);
console.log('====================================================');

if (passedTests !== totalTests) {
  process.exit(1);
}
