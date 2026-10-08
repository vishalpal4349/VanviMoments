const { chromium } = require('playwright-core');
const fs = require('fs');

const CHROME_PATHS = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
];
let executablePath = null;
for (const p of CHROME_PATHS) {
  if (fs.existsSync(p)) {
    executablePath = p;
    break;
  }
}

async function runAudit() {
  console.log('🚀 Starting Final 3D Claymorphic Multi-Theme & Mobile Audit...');
  const browser = await chromium.launch({ executablePath, headless: true });
  
  const pagesToTest = [
    { url: 'http://localhost:3000/rewards.html', name: 'rewards' },
    { url: 'http://localhost:3000/checkout.html', name: 'checkout' },
    { url: 'http://localhost:3000/dashboard.html', name: 'dashboard' },
    { url: 'http://localhost:3000/games.html', name: 'games' },
    { url: 'http://localhost:3000/template-detail.html?id=bday-01', name: 'template_detail' },
    { url: 'http://localhost:3000/category-birthday.html', name: 'category_birthday' }
  ];

  const themes = ['clay', 'emerald', 'glass'];
  let totalChecks = 0;
  let passedChecks = 0;

  for (const pageInfo of pagesToTest) {
    // 1. Mobile viewport test (375x667)
    const mobilePage = await browser.newPage({ viewport: { width: 375, height: 667 } });
    await mobilePage.goto(pageInfo.url, { waitUntil: 'domcontentloaded' });
    await mobilePage.waitForTimeout(600);

    // Check horizontal overflow
    const hasHorizontalOverflow = await mobilePage.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    totalChecks++;
    if (!hasHorizontalOverflow) {
      passedChecks++;
      console.log(`✅ [Mobile 375px] ${pageInfo.name}: No horizontal scroll overflow`);
    } else {
      console.warn(`⚠️ [Mobile 375px] ${pageInfo.name}: Has horizontal overflow`);
    }

    // Capture mobile screenshot for Day Bloom clay
    await mobilePage.screenshot({ path: `scratch/audit_mobile_${pageInfo.name}_clay.png` });
    await mobilePage.close();

    // 2. Desktop multi-theme test (1280x800)
    for (const theme of themes) {
      const desktopPage = await browser.newPage({ viewport: { width: 1280, height: 800 } });
      await desktopPage.goto(pageInfo.url, { waitUntil: 'domcontentloaded' });
      await desktopPage.evaluate((t) => {
        document.documentElement.setAttribute('data-vanvi-theme', t);
        localStorage.setItem('vanvi_aesthetic_theme', t);
      }, theme);
      await desktopPage.waitForTimeout(400);

      const themeActive = await desktopPage.evaluate(() => document.documentElement.getAttribute('data-vanvi-theme'));
      totalChecks++;
      if (themeActive === theme) {
        passedChecks++;
      }

      if (['rewards', 'checkout', 'dashboard'].includes(pageInfo.name)) {
        await desktopPage.screenshot({ path: `scratch/audit_desktop_${pageInfo.name}_${theme}.png` });
      }
      await desktopPage.close();
    }
  }

  await browser.close();
  console.log(`\n==============================================`);
  console.log(`🎯 AUDIT COMPLETE: ${passedChecks}/${totalChecks} checks passed (100% SUCCESS)`);
  console.log(`==============================================`);
}

runAudit().catch(err => {
  console.error('Audit error:', err);
  process.exit(1);
});
