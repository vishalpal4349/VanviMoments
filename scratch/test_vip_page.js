const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true
  });

  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2
  });

  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  console.log('Navigating to category-premium.html mobile...');
  await page.goto('http://localhost:3000/category-premium.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Take mobile screenshots
  await page.screenshot({ path: 'scratch/category_premium_mobile_top.png' });
  
  // Scroll down to cards grid
  const grid = await page.$('#premiumCollection');
  if (grid) {
    await grid.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'scratch/category_premium_mobile_cards.png' });
  }

  // Scroll down to bespoke section
  const bespoke = await page.$('#bespokeStudio');
  if (bespoke) {
    await bespoke.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'scratch/category_premium_mobile_bespoke.png' });
  }

  // Desktop view
  await page.setViewportSize({ width: 1200, height: 800 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'scratch/category_premium_desktop_top.png' });

  if (grid) {
    await grid.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'scratch/category_premium_desktop_cards.png' });
  }

  // Also check home page 24k atelier section
  await page.goto('http://localhost:3000/index.html', { waitUntil: 'networkidle' });
  const ultraSec = await page.$('#ultraSection');
  if (ultraSec) {
    await ultraSec.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'scratch/index_ultra_section.png' });
  }

  await browser.close();
  console.log('Screenshots complete!');
})();
