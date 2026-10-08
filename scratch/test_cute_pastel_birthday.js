/**
 * VANVI MOMENTS — CUTE PASTEL BIRTHDAY TEMPLATE TEST SUITE
 * Complete end-to-end audit for Template #1: Cute Pastel Birthday
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('\n=============================================================');
console.log('   VANVI MOMENTS — CUTE PASTEL BIRTHDAY QA & VERIFICATION    ');
console.log('=============================================================\n');

const ROOT = path.join(__dirname, '..');
const TEMPLATE_DIR = path.join(ROOT, 'templates', 'cute-pastel-birthday');

// 1. Files & Assets verification
console.log('📁 1. Verifying File Structure & Core Assets...');
const requiredFiles = [
  'template.json',
  'index.html',
  'preview.html',
  'builder.html',
  'style.css',
  'script.js',
  'assets/cake.jpg',
  'assets/gift-box.jpg',
  'assets/hero-cover.jpg',
  'assets/gallery-1.jpg',
  'assets/gallery-2.jpg',
  'assets/gallery-3.jpg',
  'assets/gallery-4.jpg',
  'assets/qrcode.min.js'
];

requiredFiles.forEach(file => {
  const fullPath = path.join(TEMPLATE_DIR, file);
  assert.ok(fs.existsSync(fullPath), `Required template file must exist: ${file}`);
  const stats = fs.statSync(fullPath);
  assert.ok(stats.size > 0, `File must not be empty: ${file} (size: ${stats.size} bytes)`);
});

const thumbPath = path.join(ROOT, 'assets', 'cute-pastel-birthday-thumb.jpg');
assert.ok(fs.existsSync(thumbPath), 'Catalog thumbnail must exist in root assets');
console.log('  ✅ All 14 template assets and files exist with non-zero size.');

// 2. Template Registry verification
console.log('📑 2. Auditing Template Registry (js/vanvi-templates-data.js)...');
const registryContent = fs.readFileSync(path.join(ROOT, 'js', 'vanvi-templates-data.js'), 'utf8');

assert.ok(registryContent.includes("id: 'cute-pastel-birthday'"), 'cute-pastel-birthday must be in registry');
assert.ok(registryContent.includes("price: 149"), 'Price must strictly be ₹149');
assert.ok(registryContent.includes("originalPrice: 499"), 'Original price must be 499');
assert.ok(registryContent.includes("Cute Pastel Birthday"), 'Template name must match');
assert.ok(registryContent.includes("templates/cute-pastel-birthday/index.html"), 'templatePath must be configured');
assert.ok(registryContent.includes("templates/cute-pastel-birthday/preview.html"), 'previewPath must be configured');
assert.ok(registryContent.includes("templates/cute-pastel-birthday/builder.html"), 'builderPath must be configured');
console.log('  ✅ Master registry verified (Template #1, price ₹149, all routes intact).');

// 3. Dynamic Router in builder.html
console.log('🔄 3. Auditing Builder Router (builder.html)...');
const builderHtml = fs.readFileSync(path.join(ROOT, 'builder.html'), 'utf8');
assert.ok(builderHtml.includes("'cute-pastel-birthday': 'templates/cute-pastel-birthday/builder.html'"), 'builder.html router must map cute-pastel-birthday');
assert.ok(builderHtml.includes("'cute-pastel': 'templates/cute-pastel-birthday/builder.html'"), 'builder.html router must map cute-pastel alias');
console.log('  ✅ Root builder dynamic router alias mappings verified.');

// 4. All 15 Chapters in index.html
console.log('✨ 4. Auditing 15 Chapters in index.html...');
const indexHtml = fs.readFileSync(path.join(TEMPLATE_DIR, 'index.html'), 'utf8');

const chaptersCheck = [
  { id: 'introLoader', desc: 'Chapter 00: Intro Luxury Loader' },
  { id: 'heroSection', desc: 'Chapter 01: Pastel Sky Hero & Floating Balloons' },
  { id: 'heroRecipientName', desc: 'Hero Dynamic Recipient Name' },
  { id: 'giftSection', desc: 'Chapter 02: 3D Interactive Gift Box Reveal' },
  { id: 'giftBoxWrap', desc: '3D Gift Box Trigger Element' },
  { id: 'btnOpenGift', desc: 'Open Your Surprise Button' },
  { id: 'countdownSection', desc: 'Chapter 03: Celebration Countdown Timer' },
  { id: 'cdDays', desc: 'Countdown Days Pill' },
  { id: 'cakeSection', desc: 'Chapter 04: Cake Celebration Scene' },
  { id: 'cakeCandlesGlow', desc: 'Cake Flickering Candle Flame Glow' },
  { id: 'btnMakeWish', desc: 'Make A Wish Button' },
  { id: 'gallerySection', desc: 'Chapters 05 & 06: Photo Memory Intro & Polaroid Gallery' },
  { id: 'galleryHeroWrapper', desc: 'Hero Spotlight Photo Wrapper' },
  { id: 'polaroidGrid', desc: 'Polaroid Cards Grid Deck' },
  { id: 'timelineSection', desc: 'Chapter 07: Memory Timeline (Our Beautiful Journey)' },
  { id: 'timelineTrack', desc: 'Timeline Track Container' },
  { id: 'letterSection', desc: 'Chapter 08: Royal Wax-Sealed Birthday Letter' },
  { id: 'envelopeBox', desc: 'Royal Letter Envelope' },
  { id: 'btnReadLetter', desc: 'Read Your Letter Button' },
  { id: 'memoriesSection', desc: 'Chapter 09: Special Memories Cards Deck' },
  { id: 'surpriseSection', desc: 'Chapter 10: Mystery Surprise Reveal Card' },
  { id: 'btnRevealSurprise', desc: 'Reveal Surprise Button' },
  { id: 'floatingMusicWidget', desc: 'Chapter 11: Floating Cute Vinyl Music Player' },
  { id: 'miniVinylDisc', desc: 'Rotating Mini Vinyl Disc' },
  { id: 'ambientCanvas', desc: 'Chapter 12: Ambient Floating Petals Canvas' },
  { id: 'finalMessageSection', desc: 'Chapter 13: May Your Next Chapter Be Beautiful Final Chapter' },
  { id: 'confettiCanvas', desc: 'Confetti Canvas Engine' },
  { id: 'btnCelebrateAgain', desc: 'Chapter 14: Celebrate Again Confetti Cannon' },
  { id: 'shareSection', desc: 'Chapter 15: Share & High-Res QR Code' },
  { id: 'btnCopyLink', desc: 'Copy Link Button' },
  { id: 'btnShareWhatsapp', desc: 'WhatsApp Share Button' },
  { id: 'shareQrCanvas', desc: 'High-Res QR Code Canvas' }
];

chaptersCheck.forEach(item => {
  assert.ok(indexHtml.includes(`id="${item.id}"`), `Must include element #${item.id} (${item.desc})`);
});
console.log(`  ✅ All ${chaptersCheck.length} crucial interactive chapter elements confirmed in index.html.`);

// 5. Auditing Design System in style.css
console.log('🎨 5. Auditing Design System, Tokens & 6 Themes in style.css...');
const styleCss = fs.readFileSync(path.join(TEMPLATE_DIR, 'style.css'), 'utf8');

assert.ok(styleCss.includes('clueButtonFlow'), 'Option #4 flowing button animation must exist');
assert.ok(styleCss.includes('[data-theme="lavender"]'), 'Theme 2: Lavender Dream must be styled');
assert.ok(styleCss.includes('[data-theme="peach"]'), 'Theme 3: Peach Bloom must be styled');
assert.ok(styleCss.includes('[data-theme="blue"]'), 'Theme 4: Baby Blue must be styled');
assert.ok(styleCss.includes('[data-theme="cotton-candy"]'), 'Theme 5: Cotton Candy must be styled');
assert.ok(styleCss.includes('[data-theme="cream"]'), 'Theme 6: Cream & Blush must be styled');
assert.ok(styleCss.includes('var(--shadow-clay)'), 'Clay neumorphic shadows must be defined');
assert.ok(styleCss.includes('@media (max-width: 480px)'), 'Mobile-first responsive media queries must be defined');
console.log('  ✅ Design tokens, 6 themes, flowing buttons, and responsive breakpoints verified.');

// 6. Auditing Interactive Engine in script.js
console.log('⚡ 6. Auditing script.js Logic & Interactions...');
const scriptJs = fs.readFileSync(path.join(TEMPLATE_DIR, 'script.js'), 'utf8');

assert.ok(scriptJs.includes('startSynthesizerMelody'), 'Web Audio harmonic synth fallback must be implemented');
assert.ok(scriptJs.includes('fireConfetti'), 'Canvas confetti cannon must be implemented');
assert.ok(scriptJs.includes('VANVI_LIVE_UPDATE'), 'Live 2-way postMessage sync listener must be implemented');
assert.ok(scriptJs.includes('setupCountdown'), 'Live countdown logic must be implemented');
assert.ok(scriptJs.includes('openLightbox'), 'Fullscreen lightbox gesture engine must be implemented');
assert.ok(scriptJs.includes('QRCode'), 'High-res QR code generation must be implemented');
console.log('  ✅ script.js interactive engine verified.');

// 7. Auditing Bespoke Builder in builder.html
console.log('🛠️  7. Auditing Customization Studio in builder.html...');
const templateBuilderHtml = fs.readFileSync(path.join(TEMPLATE_DIR, 'builder.html'), 'utf8');

assert.ok(templateBuilderHtml.includes('inpRecipient'), 'Recipient input must exist');
assert.ok(templateBuilderHtml.includes('inpSender'), 'Sender input must exist');
assert.ok(templateBuilderHtml.includes('inpDate'), 'Date input must exist');
assert.ok(templateBuilderHtml.includes('themePicker'), '6-color theme picker must exist');
assert.ok(templateBuilderHtml.includes('photosDeck'), 'Photos deck (5-15 photos) must exist');
assert.ok(templateBuilderHtml.includes('previewFrame'), 'Live preview iframe must exist');
assert.ok(templateBuilderHtml.includes('checkout.html') && templateBuilderHtml.includes('price=149'), 'Publish must route to checkout at ₹149');
console.log('  ✅ Builder studio verified (inputs, theme picker, photo deck, live preview, ₹149 checkout).');

// 8. Auditing Fullscreen Preview in preview.html
console.log('🖥️  8. Auditing preview.html...');
const previewHtml = fs.readFileSync(path.join(TEMPLATE_DIR, 'preview.html'), 'utf8');

assert.ok(previewHtml.includes('template-fullscreen-viewport'), 'Fullscreen native template viewport must exist');
assert.ok(previewHtml.includes('₹149'), 'Pricing pill must display ₹149');
assert.ok(previewHtml.includes('builder.html'), 'Customize & Buy button must link to builder.html');
console.log('  ✅ preview.html verified.');

console.log('\n=============================================================');
console.log('🎉 CUTE PASTEL BIRTHDAY MASTER AUDIT: 100% SUCCESS!');
console.log('=============================================================\n');
