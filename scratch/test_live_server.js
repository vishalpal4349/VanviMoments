const { chromium } = require('playwright-core');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  const browser = await chromium.launch({ executablePath: chromePath, headless: true });
  const page = await browser.newPage();
  const errors = [];
  page.on('console', msg => console.log('Console:', msg.type(), msg.text()));
  page.on('pageerror', err => errors.push(err.message));

  await page.goto('http://127.0.0.1:5500/index.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  console.log('Errors on domcontentloaded:', errors);

  for (let s = 1; s <= 8; s++) {
    await page.waitForTimeout(1000);
    const vis = await page.evaluate(() => {
      const f = document.getElementById('freeCollectionSection');
      const p = document.getElementById('premiumCollectionSection');
      const fS = f ? window.getComputedStyle(f) : null;
      const pS = p ? window.getComputedStyle(p) : null;
      return {
        freeVisible: fS?.visibility === 'visible' && fS?.opacity !== '0' && fS?.display !== 'none',
        premVisible: pS?.visibility === 'visible' && pS?.opacity !== '0' && pS?.display !== 'none',
        freeOpacity: fS?.opacity,
        premOpacity: pS?.opacity
      };
    });
    console.log('Sec ' + s + ':', JSON.stringify(vis));
  }

  await browser.close();
})();
