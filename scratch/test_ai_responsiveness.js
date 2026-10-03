const fs = require('fs');

const content = fs.readFileSync('c:/Users/RISHU KUMARI/VanviMoments/ai.html', 'utf8');

console.log('=== VANVI AI STUDIO RESPONSIVE AUDIT ===\n');

// 1. Check for overflow-x rules
console.log('1. Overflow safety:');
console.log('  html/body overflow-x:', content.includes('overflow-x: hidden !important'));

// 2. Check viewport meta
console.log('2. Viewport meta:');
console.log('  name="viewport" present:', content.includes('name="viewport"'));
console.log('  allows user zoom:', content.includes('user-scalable=yes'));

// 3. Check Logo is brand only (not a link)
console.log('3. Logo link audit:');
const hasLogoLink = /<a[^>]*class=["'][^"']*header-brand/i.test(content);
console.log('  Is logo an <a> link?:', hasLogoLink ? 'FAIL (is link)' : 'PASS (is div/brand only)');

// 4. Check Back button
console.log('4. Back button audit:');
console.log('  Has btn-nav-back:', content.includes('class="btn-nav-back"'));
console.log('  Calls vanviGoBack:', content.includes("onclick=\"vanviGoBack('index.html')\""));

// 5. Check Mobile media queries
console.log('5. Media query coverage:');
console.log('  Has @media (max-width: 1023px):', content.includes('@media (max-width: 1023px)'));
console.log('  Has @media (max-width: 640px):', content.includes('@media (max-width: 640px)'));
console.log('  Has @media (max-width: 360px):', content.includes('@media (max-width: 360px)'));

// 6. Check No awkward 3D hardware elements
console.log('6. 3D phone removal audit:');
console.log('  3D phone shell removed from DOM:', !content.includes('<div class="live-phone-shell" id="phoneShell">'));
console.log('  Clean live preview card in DOM:', content.includes('id="livePreviewCard"'));

// 7. Check Studio Flow order
console.log('7. AI Studio Flow hierarchy:');
const idxHero = content.indexOf('class="studio-hero-card"');
const idxPrompt = content.indexOf('class="prompt-card"');
const idxUnder = content.indexOf('class="understanding-card"');
const idxMagic = content.indexOf('class="magic-actions-section"');
const idxAdv = content.indexOf('class="advanced-accordion"');
const idxPrev = content.indexOf('class="preview-panel"');
const idxReady = content.indexOf('class="ready-banner"');

const orderValid = (idxHero < idxPrompt) && 
                   (idxPrompt < idxUnder) && 
                   (idxUnder < idxMagic) && 
                   (idxMagic < idxAdv) && 
                   (idxAdv < idxPrev) && 
                   (idxPrev < idxReady);

console.log('  Flow order (Hero -> Prompt -> Understood -> Magic -> Adv -> Preview -> Ready):', orderValid ? 'PASS ✅' : 'FAIL ❌');

console.log('\nAudit complete.');
