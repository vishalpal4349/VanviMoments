const { chromium } = require('playwright-core');
const path = require('path');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push(err.message));

  // Test on mobile
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('file:///' + path.resolve('index.html').replace(/\\/g, '/'));
  await page.waitForTimeout(600);

  const floatBtn = await page.$('#scratchFloatBtn');
  const box = await floatBtn.boundingBox();
  console.log('Mobile float btn box:', box);

  // Check what element is at (box.x + 10, box.y + 10)
  const elAtPoint = await page.evaluate((b) => {
    const el = document.elementFromPoint(b.x + b.width / 2, b.y + b.height / 2);
    return el ? { tag: el.tagName, id: el.id, class: el.className } : null;
  }, box);
  console.log('Element at point on mobile:', elAtPoint);

  // Click it
  try {
    await floatBtn.click({ timeout: 2000 });
    console.log('Successfully clicked floatBtn on mobile');
  } catch(e) {
    console.error('Click error on mobile:', e.message);
  }

  const modal = await page.$('#vanviSpinModal');
  const modalOpen = await modal.evaluate(el => el.classList.contains('open'));
  console.log('Modal opened on mobile:', modalOpen);

  // Now test spin wheel click
  const spinAction = await page.$('#spinWheelAction');
  console.log('spinWheelAction box:', await spinAction.boundingBox());

  const canSpinBefore = await page.evaluate(() => window.VanviRewardEngine ? window.VanviRewardEngine.canSpin() : 'undefined');
  console.log('canSpinBefore:', canSpinBefore);

  await spinAction.click();
  await page.waitForTimeout(500);

  const transform = await page.$eval('#fortuneWheelDisc', el => el.style.transform);
  console.log('Wheel transform during/after spin:', transform);

  await browser.close();
})();
