const fs = require('fs');
const path = require('path');

console.log('====================================================');
console.log('   VERIFYING LIQUID SPATIAL GLASS ENGINE A TO Z     ');
console.log('====================================================\n');

// 1. Verify CSS definition
const css = fs.readFileSync('vanvi-navigation.css', 'utf8');
const checks = [
  { name: 'Spatial Font Engine', pattern: /html\[data-vanvi-font="spatial"\]/ },
  { name: 'Glass Aurora Canvas', pattern: /html\[data-vanvi-theme="glass"\] body/ },
  { name: 'Aurora Floating Mesh 1', pattern: /@keyframes vanviGlassAurora1/ },
  { name: 'Aurora Floating Mesh 2', pattern: /@keyframes vanviGlassAurora2/ },
  { name: 'Glass Header / Navbars', pattern: /html\[data-vanvi-theme="glass"\] header/ },
  { name: 'Universal Glass Cards', pattern: /html\[data-vanvi-theme="glass"\] body div\[class\*="card"\]/ },
  { name: 'VisionOS Bottom Dock', pattern: /html\[data-vanvi-theme="glass"\] \.vanvi-bottom-dock/ },
  { name: 'Pill-shaped Inputs', pattern: /html\[data-vanvi-theme="glass"\] input\[type="text"\]/ },
  { name: 'Glass CTA Buttons', pattern: /html\[data-vanvi-theme="glass"\] \.btn-primary/ },
  { name: 'Studio Modal Glass', pattern: /html\[data-vanvi-theme="glass"\] #studioModalContainer/ }
];

let cssPassed = 0;
checks.forEach(c => {
  const ok = c.pattern.test(css);
  console.log(`  ${ok ? '✅' : '❌'} CSS Rule: ${c.name}`);
  if (ok) cssPassed++;
});

console.log(`\n  CSS Rules Score: ${cssPassed}/${checks.length}`);

// 2. Verify all 58 pages have the instantaneous head script & nav links
const allPages = fs.readdirSync('.').filter(f => f.endsWith('.html'));
console.log(`\n📄 Auditing all ${allPages.length} HTML pages A to Z for theme integration...`);

let fullyIntegrated = 0;
const issues = [];

allPages.forEach(page => {
  const content = fs.readFileSync(page, 'utf8');
  const hasHeadSync = content.includes('data-vanvi-theme') && content.includes('vanvi_aesthetic_theme');
  const hasNavCss = content.includes('vanvi-navigation.css');
  const hasNavJs = content.includes('vanvi-navigation.js');

  if (hasHeadSync && hasNavCss && hasNavJs) {
    fullyIntegrated++;
  } else {
    issues.push({ page, hasHeadSync, hasNavCss, hasNavJs });
  }
});

console.log(`  ✅ ${fullyIntegrated}/${allPages.length} pages are 100% wired with Instant Head Theme Sync + CSS + JS!`);

if (issues.length > 0) {
  console.error('  ⚠️ Incomplete pages:', issues);
  process.exit(1);
}

// 3. Verify JS Studio Controller includes Glass
const navJs = fs.readFileSync('js/vanvi-navigation.js', 'utf8');
const jsChecks = [
  { name: 'setVanviTheme supports glass', ok: navJs.includes("theme === 'glass'") },
  { name: 'toggleVanviTheme cycles to glass', ok: navJs.includes("next = 'glass'") },
  { name: 'syncStudioControls handles glass label', ok: navJs.includes("🫧 Spatial Glass") },
  { name: 'Studio Modal has Spatial Glass option', ok: navJs.includes("data-theme=\"glass\"") },
  { name: 'Studio Modal has Spatial Vision font option', ok: navJs.includes("data-font=\"spatial\"") },
  { name: 'Cross-tab storage synchronization', ok: navJs.includes("window.addEventListener('storage'") }
];

console.log('\n⚙️  Auditing Navigation Controller JS...');
let jsPassed = 0;
jsChecks.forEach(c => {
  console.log(`  ${c.ok ? '✅' : '❌'} ${c.name}`);
  if (c.ok) jsPassed++;
});

console.log(`\n====================================================`);
if (cssPassed === checks.length && fullyIntegrated === allPages.length && jsPassed === jsChecks.length) {
  console.log('🎉 LIQUID SPATIAL GLASS ENGINE IS 100% OPERATIONAL SITE-WIDE!');
} else {
  console.log('⚠️ Some checks need attention.');
}
console.log('====================================================\n');
