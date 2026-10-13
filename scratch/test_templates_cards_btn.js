const { chromium } = require('playwright-core');
(async () => {
  const browser = await chromium.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: true });
  const page = await browser.newPage({ viewport: { width: 360, height: 740 } });
  await page.goto('http://localhost:3000/templates.html');
  await page.waitForTimeout(500);

  const cardBtns = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('#templatesGrid button, #templatesGrid a.btn, #templatesGrid a'));
    return btns.slice(0, 5).map(b => {
      const r = b.getBoundingClientRect();
      const s = getComputedStyle(b);
      return {
        text: (b.innerText || '').slice(0, 25),
        w: Math.round(r.width),
        h: Math.round(r.height),
        fontSize: s.fontSize,
        padding: s.padding
      };
    });
  });

  console.log('Template Card Buttons on 360px mobile:', cardBtns);
  const scroll = await page.evaluate(() => ({ scrollW: document.documentElement.scrollWidth, innerW: window.innerWidth }));
  console.log('Templates page scroll width:', scroll);
  await browser.close();
})();
