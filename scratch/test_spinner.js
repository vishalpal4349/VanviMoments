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
  
  await page.goto('file:///' + path.resolve('index.html').replace(/\\/g, '/'));
  await page.waitForTimeout(500);

  const floatBtn = await page.$('#scratchFloatBtn');
  console.log('Float btn exists:', !!floatBtn);
  if (floatBtn) {
    const box = await floatBtn.boundingBox();
    console.log('Float btn bounding box:', box);
    const visible = await floatBtn.isVisible();
    console.log('Float btn isVisible:', visible);

    // Click it
    await floatBtn.click();
    await page.waitForTimeout(500);

    const modal = await page.$('#vanviSpinModal');
    const modalClass = await modal.getAttribute('class');
    const modalVisible = await modal.isVisible();
    console.log('Modal class after click:', modalClass, 'isVisible:', modalVisible);

    // Let's also check if user clicks spinWheelAction
    const spinAction = await page.$('#spinWheelAction');
    console.log('spinWheelAction exists:', !!spinAction);
    if (spinAction && modalVisible) {
      await spinAction.click();
      console.log('Clicked spinWheelAction');
      await page.waitForTimeout(1000);
      const prize = await page.$eval('#spinPrizeName', el => el.textContent);
      console.log('Prize text:', prize);
    }
  }
  console.log('Console errors:', errors);
  await browser.close();
})();
