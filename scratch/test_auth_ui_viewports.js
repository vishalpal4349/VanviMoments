const fs = require('fs');
const { chromium } = require('playwright-core');

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

const viewports = [
  { name: '320px (iPhone SE)', width: 320, height: 640 },
  { name: '360px (Android Compact)', width: 360, height: 740 },
  { name: '375px (iPhone Standard)', width: 375, height: 667 },
  { name: '390px (iPhone Modern)', width: 390, height: 844 },
  { name: '414px (iPhone Plus/Max)', width: 414, height: 896 },
  { name: '1280px (Desktop Centered)', width: 1280, height: 800 }
];

const pages = [
  { name: 'Login Page', url: 'http://localhost:3000/login.html', file: 'auth_login' },
  { name: 'Signup Page', url: 'http://localhost:3000/signup.html', file: 'auth_signup' },
  { name: 'Forgot Password Page', url: 'http://localhost:3000/forgot-password.html', file: 'auth_forgot' }
];

async function runUiTests() {
  console.log('--- STARTING AUTH UI & VIEWPORT RESPONSIVENESS QA (PLAYWRIGHT) ---');
  if (!executablePath) {
    console.error('No browser executable found!');
    process.exit(1);
  }

  const browser = await chromium.launch({
    headless: true,
    executablePath: executablePath
  });

  const context = await browser.newContext();
  const page = await context.newPage();
  let allPassed = true;

  for (const p of pages) {
    console.log(`\n🔍 Auditing ${p.name} (${p.url})`);
    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      const consoleErrors = [];
      const errorHandler = msg => {
        if (msg.type() === 'error' && !msg.text().includes('favicon') && !msg.text().includes('accounts.google.com')) {
          consoleErrors.push(msg.text());
        }
      };
      page.on('console', errorHandler);

      await page.goto(p.url, { waitUntil: 'load' });
      await page.waitForTimeout(300);

      const metrics = await page.evaluate(() => {
        const body = document.body;
        const html = document.documentElement;
        const card = document.querySelector('.clay-phone-card');
        const cardRect = card ? card.getBoundingClientRect() : null;
        const scrollWidth = Math.max(body.scrollWidth, html.scrollWidth);
        const windowWidth = window.innerWidth;
        const hasOverflow = scrollWidth > windowWidth;

        return {
          windowWidth,
          scrollWidth,
          hasOverflow,
          cardWidth: cardRect ? Math.round(cardRect.width) : 0,
          cardLeft: cardRect ? Math.round(cardRect.left) : 0
        };
      });

      page.off('console', errorHandler);

      const passOverflow = !metrics.hasOverflow;
      const passDesktopSize = vp.width === 1280 ? (metrics.cardWidth <= 425 && metrics.cardWidth >= 380) : true;

      if (passOverflow && passDesktopSize && consoleErrors.length === 0) {
        console.log(`  ✅ [PASS] ${vp.name}: window=${metrics.windowWidth}px, scroll=${metrics.scrollWidth}px, card=${metrics.cardWidth}px`);
      } else {
        allPassed = false;
        console.error(`  ❌ [FAIL] ${vp.name}: overflow=${metrics.hasOverflow} (scroll=${metrics.scrollWidth}px > win=${metrics.windowWidth}px), cardWidth=${metrics.cardWidth}px, errors=${consoleErrors.join('; ')}`);
      }
    }
  }

  // Visual snapshots
  console.log('\n📸 Capturing high-resolution desktop and mobile snapshots...');
  for (const p of pages) {
    await page.setViewportSize({ width: 1280, height: 850 });
    await page.goto(p.url, { waitUntil: 'load' });
    await page.screenshot({ path: `scratch/${p.file}_desktop.png` });

    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(p.url, { waitUntil: 'load' });
    await page.screenshot({ path: `scratch/${p.file}_mobile.png` });
  }

  await browser.close();

  if (allPassed) {
    console.log('\n🎉 ALL VIEWPORTS & PAGES PASSED ZERO-OVERFLOW & DESIGN AUDIT!');
  } else {
    process.exit(1);
  }
}

runUiTests();
