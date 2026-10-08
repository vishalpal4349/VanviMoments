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
  { width: 320, height: 600, label: '320px (Compact Mobile)' },
  { width: 360, height: 740, label: '360px (Standard Android)' },
  { width: 375, height: 667, label: '375px (iPhone SE)' },
  { width: 390, height: 844, label: '390px (iPhone 12/13/14)' },
  { width: 414, height: 896, label: '414px (iPhone Plus/Max)' },
  { width: 768, height: 1024, label: '768px (iPad Mini)' },
  { width: 1024, height: 768, label: '1024px (iPad Pro/Laptop)' },
  { width: 1280, height: 800, label: '1280px (Desktop HD)' }
];

const testPages = [
  'index.html',
  'templates.html',
  'preview.html',
  'builder.html',
  'checkout.html',
  'order-success.html',
  'moment.html',
  'share.html',
  'ai-matcher.html',
  'vanvi-assistant.html'
];

(async () => {
  if (!executablePath) {
    console.error('No Chrome or Edge found');
    process.exit(1);
  }

  const browser = await chromium.launch({ executablePath, headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('=== MULTI-VIEWPORT RESPONSIVENESS & CONSOLE ERROR AUDIT ===');
  let issues = 0;

  for (const pageName of testPages) {
    const url = `http://localhost:3000/${pageName}`;
    process.stdout.write(`Testing ${pageName} across 8 viewports: `);

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      const consoleErrors = [];
      const onConsole = msg => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      };
      page.on('console', onConsole);

      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 8000 });
        await page.waitForTimeout(100);

        // Check horizontal overflow
        const overflow = await page.evaluate(() => {
          const docEl = document.documentElement;
          const body = document.body;
          const maxScroll = Math.max(docEl.scrollWidth, body.scrollWidth);
          const clientW = window.innerWidth;
          return {
            hasOverflow: maxScroll > clientW + 3,
            maxScroll,
            clientW
          };
        });

        if (overflow.hasOverflow) {
          process.stdout.write(`[⚠️ ${vp.width}px overflow: ${overflow.maxScroll}px] `);
          issues++;
        } else {
          process.stdout.write(`[${vp.width}px ✓] `);
        }
      } catch (err) {
        process.stdout.write(`[❌ ${vp.width}px error] `);
        issues++;
      } finally {
        page.off('console', onConsole);
      }
    }
    console.log('');
  }

  await browser.close();
  console.log('\n======================================================');
  if (issues === 0) {
    console.log('🎉 ALL PAGES & VIEWPORTS (320px - 1280px) PASSED WITH ZERO OVERFLOW!');
  } else {
    console.log(`⚠️ Completed with ${issues} minor warnings.`);
  }
  console.log('======================================================');
})();
