const fs = require('fs');
const assert = require('assert');

console.log('=== VERIFYING VANVI AI CREATIVE STUDIO UPGRADE ===\n');

const html = fs.readFileSync('ai.html', 'utf8');

let pass = 0;
let total = 0;
function check(name, cond) {
  total++;
  if (cond) {
    console.log(`✅ PASS: ${name}`);
    pass++;
  } else {
    console.error(`❌ FAIL: ${name}`);
  }
}

// 1. Hero & 3-Second Comprehension
check('Hero headline: "Tell Vanvi what you feel."', html.includes('Tell Vanvi what you feel.'));
check('Hero subtitle: "We’ll turn it into a beautiful message and memorable moment."', 
  html.includes('We’ll turn it into a beautiful message and memorable moment.'));

// 2. Realistic Visual Flow Showcase
check('Showcase user prompt example present', html.includes('My best friend’s birthday is coming. Make something emotional and cute.'));
check('Showcase 3-step visual indicator present', html.includes('Vanvi AI') && html.includes('Beautiful Message') && html.includes('Use in My Moment ✨'));

// 3. Primary CTA
check('Primary CTA button: "✨ Create with Vanvi AI"', html.includes('Create with Vanvi AI'));
check('Button ID #btnCreateWithVanvi present', html.includes('id="btnCreateWithVanvi"'));

// 4. Input & Anti-zoom
check('Large prompt textarea present (#aiPromptInput)', html.includes('id="aiPromptInput"'));
check('16px input font size to prevent mobile autozoom', html.includes('font-size: 16px !important;'));

// 5. Result Card & Magic Actions
check('Result card present (#resultCard)', html.includes('id="resultCard"'));
check('Editable message output box present (#messageOutput)', html.includes('id="messageOutput"'));
check('Magic action: 💖 More Emotional', html.includes('More Emotional'));
check('Magic action: 🌸 More Cute', html.includes('More Cute'));
check('Magic action: 🎬 Cinematic', html.includes('Cinematic'));
check('Magic action: ✂️ Shorter', html.includes('Shorter'));
check('Magic action: 🔄 Rewrite', html.includes('Rewrite'));

// 6. Language Switching
check('Language switcher: English, Hindi, Hinglish', 
  html.includes('data-lang="en"') && 
  html.includes('data-lang="hi"') && 
  html.includes('data-lang="hinglish"'));

// 7. Builder Handoff & Matching Template
check('Handoff button: "✨ Use in My Moment →"', html.includes('Use in My Moment →'));
check('Handoff stores in sessionStorage (vanvi_transient_moment)', html.includes('vanvi_transient_moment'));
check('Matching template banner present (#matchBanner)', html.includes('id="matchBanner"'));

// 8. Separate Inspiration & Ready-Made Vault Section
check('Separate inspiration vault section present (#vaultSection)', html.includes('id="vaultSection"'));
check('Vault categories: Birthday, Love, Friendship, Anniversary, Sorry, Thank You, Shayari',
  html.includes('data-vault="birthday"') &&
  html.includes('data-vault="love"') &&
  html.includes('data-vault="friendship"') &&
  html.includes('data-vault="anniversary"') &&
  html.includes('data-vault="sorry"') &&
  html.includes('data-vault="thankyou"') &&
  html.includes('data-vault="shayari"'));
check('Vault examples have "Use in Studio →" handoff action', html.includes('Use in Studio →'));

// 9. Branding & Safety
check('Zero Ananya branding', !html.toLowerCase().includes('ananya'));
check('Brand logo non-clickable badge', html.includes('pointer-events: none !important; cursor: default !important;'));
check('Overflow-x locked (overflow-x: hidden !important;)', html.includes('overflow-x: hidden !important;'));

console.log(`\nResults: ${pass} / ${total} tests passed.`);
if (pass === total) {
  console.log('🎉 ALL VANVI AI CREATIVE STUDIO REQUIREMENTS VERIFIED PERFECTLY!');
} else {
  process.exit(1);
}
