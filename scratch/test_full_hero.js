const { chromium } = require('playwright-core');
const path = require('path');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true
  });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('file:///' + path.resolve(__dirname, '../index.html').replace(/\\/g, '/'));

  for (let i = 1; i <= 4; i++) {
    await page.evaluate((idx) => {
      const spans = document.querySelectorAll('.word-stage > span');
      spans.forEach((s, sIdx) => {
        if (sIdx + 1 === idx) {
          s.style.setProperty('animation', 'none', 'important');
          s.style.setProperty('opacity', '1', 'important');
          s.style.setProperty('visibility', 'visible', 'important');
          s.style.setProperty('transform', 'none', 'important');
          s.style.setProperty('filter', 'none', 'important');
          s.style.setProperty('display', 'flex', 'important');
        } else {
          s.style.setProperty('display', 'none', 'important');
        }
      });
    }, i);

    const hero = await page.locator('.hero');
    await hero.screenshot({ path: path.join(__dirname, 'hero_screenshots', `full-hero-${i}.png`) });
    console.log(`Saved full-hero-${i}.png`);
  }

  await browser.close();
})();
