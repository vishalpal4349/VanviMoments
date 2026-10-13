const { chromium } = require('playwright-core');
(async () => {
  const browser = await chromium.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: true });
  const page = await browser.newPage({ viewport: { width: 360, height: 740 } });
  await page.goto('http://localhost:3000/plans.html');
  const btn = await page.$('.btn-buy-compact');
  const box = await btn.boundingBox();
  console.log('Compact buy button in plans.html:', box);
  const scroll = await page.evaluate(() => ({ scrollW: document.documentElement.scrollWidth, innerW: window.innerWidth }));
  console.log('Plans page scroll width:', scroll);
  await browser.close();
})();
