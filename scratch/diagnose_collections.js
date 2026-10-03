const { chromium } = require('playwright-core');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  const browser = await chromium.launch({ executablePath: chromePath, headless: true });
  const page = await browser.newPage();

  const logs = [];
  const errors = [];
  page.on('console', msg => logs.push(`[${msg.type()}] ${msg.text()}`));
  page.on('pageerror', err => errors.push(err.message));

  await page.setViewportSize({ width: 375, height: 812 }); // Mobile iPhone
  await page.goto('file:///' + path.resolve('index.html').replace(/\\/g, '/'));
  await page.waitForTimeout(1000);

  console.log('Mobile Console Errors:', errors);
  console.log('Mobile Console Logs:', logs.slice(0, 15));

  // Check freeCollectionSection and premiumCollectionSection bounding boxes and computed styles
  const freeSec = await page.$('#freeCollectionSection');
  const premSec = await page.$('#premiumCollectionSection');

  console.log('Free section exists:', !!freeSec);
  console.log('Prem section exists:', !!premSec);

  if (freeSec) {
    const freeBox = await freeSec.boundingBox();
    console.log('Free section bounding box:', freeBox);
    await freeSec.screenshot({ path: 'scratch/free_section_mobile.png' });
  }

  if (premSec) {
    const premBox = await premSec.boundingBox();
    console.log('Prem section bounding box:', premBox);
    await premSec.screenshot({ path: 'scratch/prem_section_mobile.png' });
  }

  // Also check desktop
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.waitForTimeout(500);

  if (freeSec) {
    await freeSec.screenshot({ path: 'scratch/free_section_desktop.png' });
  }
  if (premSec) {
    await premSec.screenshot({ path: 'scratch/prem_section_desktop.png' });
  }

  // Check card styles and image heights/widths
  const cardDetails = await page.evaluate(() => {
    const cards = document.querySelectorAll('#freeCollectionSection .cutie-card, #premiumCollectionSection .cutie-card');
    return Array.from(cards).map(c => {
      const img = c.querySelector('.cutie-img');
      const rect = c.getBoundingClientRect();
      const style = window.getComputedStyle(c);
      return {
        id: c.id,
        width: rect.width,
        height: rect.height,
        borderRadius: style.borderRadius,
        imgWidth: img ? img.getBoundingClientRect().width : null,
        imgHeight: img ? img.getBoundingClientRect().height : null,
      };
    });
  });
  console.log('Card details:', cardDetails);

  await browser.close();
})();
