const { chromium } = require('playwright-core');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  const browser = await chromium.launch({ executablePath: chromePath, headless: true });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));

  // 1. Mobile verification (375 x 812)
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('http://127.0.0.1:5500/index.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);

  const freeSec = page.locator('#freeCollectionSection');
  const premSec = page.locator('#premiumCollectionSection');

  await freeSec.screenshot({ path: 'scratch/free_slider_mobile.png' });
  console.log('Free slider mobile screenshot saved!');

  await premSec.screenshot({ path: 'scratch/prem_slider_mobile.png' });
  console.log('Prem slider mobile screenshot saved!');

  // Test arrow scrolling
  const nextBtn = page.locator('button[data-target="premiumTemplateSlider"][data-slide="next"]');
  if (await nextBtn.isVisible()) {
    const scrollBefore = await page.evaluate(() => document.getElementById('premiumTemplateSlider').scrollLeft);
    await nextBtn.click();
    await page.waitForTimeout(600);
    const scrollAfter = await page.evaluate(() => document.getElementById('premiumTemplateSlider').scrollLeft);
    console.log('Arrow click scroll check: before =', scrollBefore, 'after =', scrollAfter);
  }

  // 2. Desktop verification (1280 x 900)
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.waitForTimeout(600);

  await freeSec.screenshot({ path: 'scratch/free_slider_desktop.png' });
  console.log('Free slider desktop screenshot saved!');

  await premSec.screenshot({ path: 'scratch/prem_slider_desktop.png' });
  console.log('Prem slider desktop screenshot saved!');

  console.log('All verifications finished! Errors:', errors.length);
  await browser.close();
})();
