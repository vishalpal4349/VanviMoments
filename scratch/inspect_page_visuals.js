const fs = require('fs');
const path = require('path');
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

const PAGES_TO_INSPECT = [
  'templates.html',
  'dashboard.html',
  'plans.html',
  'checkout.html',
  'games.html',
  'about.html',
  'contact.html',
  'faq.html',
  'category-love.html',
  'category-premium.html'
];

(async () => {
  const browser = await chromium.launch({ executablePath, headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Inspecting pages visual quality & dark mode contrast...');
  const baseUrl = 'http://localhost:3000';

  for (const pageName of PAGES_TO_INSPECT) {
    try {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(`${baseUrl}/${pageName}`, { waitUntil: 'domcontentloaded', timeout: 8000 });
      await page.waitForTimeout(600);

      // Check mobile overflow
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const innerWidth = await page.evaluate(() => window.innerWidth);
      const overflow = scrollWidth > innerWidth + 2;

      // Check dark mode
      await page.evaluate(() => {
        document.documentElement.setAttribute('data-vanvi-theme', 'dark');
        document.body.setAttribute('data-theme', 'dark');
      });
      await page.waitForTimeout(400);

      const baseName = pageName.replace('.html', '');
      await page.screenshot({ path: `scratch/preview_${baseName}_mobile_dark.png`, fullPage: false });

      console.log(`✓ ${pageName}: Overflow=${overflow ? 'YES (' + scrollWidth + 'px)' : 'NO'} | Screenshot saved.`);
    } catch (e) {
      console.error(`❌ Error on ${pageName}:`, e.message);
    }
  }

  await browser.close();
  console.log('\nInspection complete.');
})();
