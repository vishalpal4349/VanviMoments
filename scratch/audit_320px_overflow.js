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

const keyPages = [
  'index.html',
  'templates.html',
  'template-detail.html',
  'plans.html',
  'faq.html',
  'games.html',
  'risk-run.html',
  'profile.html',
  'dashboard.html',
  'checkout.html',
  'wedding.html',
  'custom-experience.html'
];

(async () => {
  const browser = await chromium.launch({ executablePath, headless: true });
  const page = await browser.newPage({ viewport: { width: 320, height: 600 } });

  console.log('Testing 320px narrow mobile screens...');
  for (const f of keyPages) {
    try {
      await page.goto(`http://localhost:3000/${f}`, { waitUntil: 'domcontentloaded', timeout: 4000 });
      await page.waitForTimeout(200);

      const metrics = await page.evaluate(() => {
        return {
          scrollW: document.documentElement.scrollWidth,
          innerW: window.innerWidth,
          overflow: document.documentElement.scrollWidth > window.innerWidth + 2
        };
      });

      console.log(`[320px] ${f.padEnd(25)} -> scrollWidth: ${metrics.scrollW}px ${metrics.overflow ? '❌ OVERFLOW (' + (metrics.scrollW - 320) + 'px)' : '✅ PERFECT'}`);
    } catch (e) {
      console.log(`[320px] ${f.padEnd(25)} -> Timeout/Skip`);
    }
  }

  await browser.close();
})();
