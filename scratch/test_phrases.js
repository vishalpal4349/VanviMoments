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
      document.querySelectorAll('.word-stage > span').forEach((s, sIdx) => {
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

    const pill = await page.locator('.word-stage-pill');
    await pill.screenshot({ path: path.join(__dirname, 'hero_screenshots', `phrase-${i}.png`) });
    console.log(`Saved phrase-${i}.png`);
  }

  await browser.close();
  console.log('All phrases captured successfully!');
})();
