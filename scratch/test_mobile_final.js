const { chromium } = require('playwright-core');
const path = require('path');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true
  });
  const page = await browser.newPage();
  
  for (const vp of [{ name: 'mobile-375', width: 375, height: 812 }, { name: 'mobile-320', width: 320, height: 600 }]) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto('file:///' + path.resolve(__dirname, '../index.html').replace(/\\/g, '/'));
    await page.waitForTimeout(500);

    const hero = await page.locator('.hero');
    await hero.screenshot({ path: path.join(__dirname, 'hero_screenshots', `${vp.name}-final.png`) });
    console.log(`Saved ${vp.name}-final.png`);
  }

  await browser.close();
})();
