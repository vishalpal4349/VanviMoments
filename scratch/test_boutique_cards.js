const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testBoutiqueCards() {
  const browser = await chromium.launch({
    executablePath: fs.existsSync(chromePath) ? chromePath : undefined,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const viewports = [
    { name: 'Mobile_320', width: 320, height: 640 },
    { name: 'Mobile_375', width: 375, height: 667 },
    { name: 'Mobile_390', width: 390, height: 844 },
    { name: 'Tablet_768', width: 768, height: 1024 },
    { name: 'Desktop_1280', width: 1280, height: 800 }
  ];

  console.log('--- Testing Boutique Cards & Atelier Filter Hub on templates.html ---');

  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height }
    });
    const page = await context.newPage();

    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto('http://localhost:3000/templates.html', { waitUntil: 'networkidle' });

    // Check horizontal overflow
    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });

    // Check cards count
    const cardCount = await page.locator('.vanvi-card').count();

    // Check button texts
    const makeYoursButtons = await page.locator('.btn-make-yours').count();
    const takeLookButtons = await page.locator('.btn-take-look').count();
    const metaRows = await page.locator('.card-meta-row').count();

    console.log(`[${vp.name}] Cards: ${cardCount} | Overflow: ${overflow} | MetaRows: ${metaRows} | ActionButtons: ${takeLookButtons}/${makeYoursButtons} | ConsoleErrors: ${consoleErrors.length}`);

    if (vp.name === 'Mobile_375') {
      await page.screenshot({ path: path.join(__dirname, 'templates_mobile_375.png'), fullPage: false });
      console.log('Saved screenshot templates_mobile_375.png');

      // Test segment tab switch to budget
      await page.click('#tabBudgets');
      await page.waitForTimeout(300);
      const budgetStripVisible = await page.evaluate(() => {
        const el = document.getElementById('quickPriceStrip');
        return el && window.getComputedStyle(el).display !== 'none';
      });
      console.log(`Mobile tab switch to budgets: strip visible = ${budgetStripVisible}`);
    }

    if (vp.name === 'Desktop_1280') {
      await page.screenshot({ path: path.join(__dirname, 'templates_desktop_1280.png'), fullPage: false });
      console.log('Saved screenshot templates_desktop_1280.png');
    }

    await context.close();
  }

  await browser.close();
  console.log('--- All Boutique Tests Completed ---');
}

testBoutiqueCards().catch(err => {
  console.error('Error running test:', err);
  process.exit(1);
});
