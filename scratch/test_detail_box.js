const { chromium } = require('playwright-core');
(async () => {
  const browser = await chromium.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: true });
  const page = await browser.newPage({ viewport: { width: 360, height: 740 } });
  await page.goto('http://localhost:3000/template-detail.html');
  const btn = await page.$('.btn-make-yours');
  const box = await btn.boundingBox();
  console.log('btnMakeYours box:', box);
  const overflow = await page.evaluate(() => ({ scrollW: document.documentElement.scrollWidth, innerW: window.innerWidth }));
  console.log('Page scroll width:', overflow);
  await browser.close();
})();
