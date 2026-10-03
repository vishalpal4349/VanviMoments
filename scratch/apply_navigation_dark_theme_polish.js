const fs = require('fs');
const path = require('path');

const navCssPath = path.join(__dirname, '..', 'vanvi-navigation.css');
let css = fs.readFileSync(navCssPath, 'utf8');

// 1. Remove div[class*="section"] and section[class*="section"] from aggressive card selector
css = css.replace(/html\[data-vanvi-theme="emerald"\] body div\[class\*="section"\]:not\(\.bottom\):not\(\.vanvi-bottom-dock\),\s*/g, '');
css = css.replace(/html\[data-vanvi-theme="dark"\] body div\[class\*="section"\]:not\(\.bottom\):not\(\.vanvi-bottom-dock\),\s*/g, '');
css = css.replace(/html\[data-vanvi-theme="night"\] body div\[class\*="section"\]:not\(\.bottom\):not\(\.vanvi-bottom-dock\),\s*/g, '');
css = css.replace(/html\[data-vanvi-theme="emerald"\] body section\[class\*="hero"\],\s*/g, '');
css = css.replace(/html\[data-vanvi-theme="dark"\] body section\[class\*="hero"\],\s*/g, '');
css = css.replace(/html\[data-vanvi-theme="night"\] body section\[class\*="hero"\],\s*/g, '');

// 2. Fix button jitter/wobble by removing scale(1.03) from dock hover
css = css.replace(/transform:\s*translateY\(-2px\)\s*scale\(1\.03\)\s*!important;/g, 'transform: translateY(-2px) !important;');
css = css.replace(/transform:\s*translateY\(-1px\)\s*scale\(1\.02\)\s*!important;/g, 'transform: translateY(-1.5px) !important;');

// 3. Add stabilization rules for all buttons across pages to prevent layout shift & text jitter
const buttonStabilizationRules = `
/* ==========================================================================
   VANVI GLOBAL BUTTON STABILIZATION (ZERO JITTER / ZERO WOBBLE)
   ========================================================================== */
button,
a.primary,
a.secondary,
.btn,
.nav-btn,
.vanvi-btn-back,
.dock-link,
.pill,
.tbtn {
  box-sizing: border-box !important;
  backface-visibility: hidden !important;
  -webkit-backface-visibility: hidden !important;
  transform: translateZ(0);
  -webkit-font-smoothing: subpixel-antialiased !important;
}

button:hover,
a.primary:hover,
a.secondary:hover,
.btn:hover,
.nav-btn:hover,
.vanvi-btn-back:hover,
.dock-link:hover {
  transform-origin: center center !important;
}

/* Luxury Transparent Glass Styling for Interactive Keepsakes & Templates */
.glass-luxury-transparent,
[data-transparent="true"],
.template-transparent {
  background: rgba(255, 255, 255, 0.12) !important;
  backdrop-filter: blur(20px) saturate(180%) !important;
  -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
  border: 1.5px solid rgba(255, 255, 255, 0.35) !important;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.08), inset 0 1px 2px rgba(255, 255, 255, 0.4) !important;
}

html[data-vanvi-theme="dark"] .glass-luxury-transparent,
html[data-vanvi-theme="emerald"] .glass-luxury-transparent,
html[data-vanvi-theme="night"] .glass-luxury-transparent {
  background: rgba(15, 61, 50, 0.45) !important;
  backdrop-filter: blur(20px) saturate(180%) !important;
  -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
  border: 1.5px solid rgba(214, 184, 120, 0.35) !important;
  box-shadow: 0 16px 45px rgba(0, 0, 0, 0.65), 0 0 25px rgba(24, 168, 120, 0.15) !important;
}
`;

if (!css.includes('VANVI GLOBAL BUTTON STABILIZATION')) {
  css += buttonStabilizationRules;
}

// 4. Soften the dark card background rule so cards look curved, blended, and luxury rather than harsh boxes
const oldDarkCardRule = /html\[data-vanvi-theme="emerald"\] body \[style\*="background: rgba\(255, 255, 255"\][\s\S]*?background: rgba\(15, 61, 50, 0\.88\) !important;[\s\S]*?box-shadow: 0 16px 45px rgba\(0, 0, 0, 0\.65\), 0 0 25px rgba\(24, 168, 120, 0\.15\) !important;/;

const newDarkCardRule = `html[data-vanvi-theme="emerald"] body [style*="background: rgba(255, 255, 255"],
html[data-vanvi-theme="dark"] body [style*="background: rgba(255, 255, 255"],
html[data-vanvi-theme="night"] body [style*="background: rgba(255, 255, 255"] {
  background: linear-gradient(145deg, rgba(15, 61, 50, 0.88) 0%, rgba(11, 42, 35, 0.94) 60%, rgba(6, 26, 20, 0.96) 100%) !important;
  background-color: rgba(15, 61, 50, 0.90) !important;
  border: 1.5px solid rgba(214, 184, 120, 0.32) !important;
  border-radius: 20px !important;
  color: #F1F7F4 !important;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.6), 0 0 24px rgba(24, 168, 120, 0.12), inset 0 1px 1px rgba(214, 184, 120, 0.25) !important;
  backdrop-filter: blur(16px) saturate(150%) !important;
  -webkit-backdrop-filter: blur(16px) saturate(150%) !important;`;

if (oldDarkCardRule.test(css)) {
  css = css.replace(oldDarkCardRule, newDarkCardRule);
}

fs.writeFileSync(navCssPath, css, 'utf8');
console.log('✓ Successfully polished vanvi-navigation.css: eliminated button jitter, softened dark mode cards, and removed section-level rectangle boxing!');
