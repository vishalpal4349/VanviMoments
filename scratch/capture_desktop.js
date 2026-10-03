const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto('http://127.0.0.1:8080/index.html', { waitUntil: 'networkidle' });

  const freeSection = await page.locator('#freeCollectionSection');
  await freeSection.scrollIntoViewIfNeeded();
  await page.screenshot({ path: 'scratch/free_section_desktop.png' });

  const premSection = await page.locator('#premiumCollectionSection');
  await premSection.scrollIntoViewIfNeeded();
  await page.screenshot({ path: 'scratch/prem_section_desktop.png' });

  const freeBox = await freeSection.boundingBox();
  const premBox = await premSection.boundingBox();
  console.log('Desktop Free Section Box:', freeBox);
  console.log('Desktop Prem Section Box:', premBox);

  await browser.close();
  console.log('Done!');
})();
