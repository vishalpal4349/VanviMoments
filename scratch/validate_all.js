const fs = require('fs');
const http = require('http');

const pagesToTest = [
  'share.html',
  'templates.html',
  'plans.html',
  'ai-matcher.html',
  'builder.html',
  'category-birthday.html',
  'rewards.html',
  'refund.html',
  'faq.html'
];

async function run() {
  console.log('--- VALIDATING PAGES ---');
  let allPassed = true;

  for (const page of pagesToTest) {
    const content = fs.readFileSync(page, 'utf8');
    const hasAnanya = content.toLowerCase().includes('ananya');
    const hasVanvi = content.includes('VANVI') || content.includes('Vanvi');
    const hasNavCss = content.includes('vanvi-navigation.css');

    // Check header actions
    const headerMatch = content.match(/<header[\s\S]*?<\/header>/i);
    const hasHeader = !!headerMatch;

    console.log(`[${page}]`);
    console.log(`  - Vanvi Brand present: ${hasVanvi}`);
    console.log(`  - No 'Ananya' trace: ${!hasAnanya}`);
    console.log(`  - Includes navigation CSS: ${hasNavCss}`);
    console.log(`  - Header present: ${hasHeader}`);

    if (hasAnanya) {
      console.error(`  ERROR: Ananya found in ${page}`);
      allPassed = false;
    }
  }

  // Check vanvi-navigation.css media queries
  const navCss = fs.readFileSync('vanvi-navigation.css', 'utf8');
  console.log('\n--- VALIDATING VANVI-NAVIGATION.CSS ---');
  const hasDesktopDockHide = navCss.includes('@media (min-width: 769px)') && navCss.includes('display: none !important');
  const hasMobileHeaderHide = navCss.includes('@media (max-width: 768px)') && navCss.includes('btn-header-link');
  const hasBrandLogoProtection = navCss.includes('white-space: nowrap !important');

  console.log(`  - Desktop dock hidden (>= 769px): ${hasDesktopDockHide}`);
  console.log(`  - Mobile header buttons cleaned (<= 768px): ${hasMobileHeaderHide}`);
  console.log(`  - Brand logo protected against squishing: ${hasBrandLogoProtection}`);

  if (allPassed && hasDesktopDockHide && hasMobileHeaderHide && hasBrandLogoProtection) {
    console.log('\n>>> ALL AUTOMATED CHECKS PASSED PERFECTLY! <<<');
  } else {
    console.log('\n>>> SOME CHECKS FAILED! <<<');
  }
}

run();
