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

const allHtml = fs.readdirSync('.').filter(f => f.endsWith('.html') && f !== 'admin.html');

(async () => {
  console.log(`Starting comprehensive audit across ${allHtml.length} pages...`);
  const browser = await chromium.launch({ executablePath, headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const baseUrl = 'http://localhost:3000';
  let passed = 0;
  let failed = 0;

  for (const file of allHtml) {
    try {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(`${baseUrl}/${file}`, { waitUntil: 'domcontentloaded', timeout: 5000 });
      await page.waitForTimeout(150);

      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const innerWidth = await page.evaluate(() => window.innerWidth);
      const hasOverflow = scrollWidth > innerWidth + 2;

      if (hasOverflow) {
        console.warn(`⚠️ Overflow on ${file}: scrollWidth=${scrollWidth}, innerWidth=${innerWidth}`);
      } else {
        passed++;
      }
    } catch (e) {
      console.error(`❌ Error on ${file}:`, e.message);
      failed++;
    }
  }

  await browser.close();
  console.log(`\nAudit finished: ${passed} passed, ${failed} failed.`);
})();
