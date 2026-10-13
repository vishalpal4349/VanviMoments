const { chromium } = require('playwright-core');
(async () => {
  const browser = await chromium.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: true });
  const page = await browser.newPage({ viewport: { width: 360, height: 740 } });
  await page.goto('http://localhost:3000/risk-run.html');
  const btn = await page.$('.arena-screen button');
  const box = await btn.boundingBox();
  console.log('Bounding box:', box);
  const styles = await page.evaluate(el => {
    const s = window.getComputedStyle(el);
    return { height: s.height, padding: s.padding, lineHeight: s.lineHeight, fontSize: s.fontSize };
  }, btn);
  console.log('Styles:', styles);
  await browser.close();
})();
