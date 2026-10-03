const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });

  const page = await browser.newPage();

  // Mobile screenshot (375px)
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('http://localhost:3000/templates.html', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'scratch/templates_mobile.png', fullPage: false });

  // Mobile recommendation section
  const recEl = await page.$('.more-templates-section');
  if (recEl) {
    await recEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'scratch/templates_recs_mobile.png', fullPage: false });
  }

  // Desktop screenshot
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('http://localhost:3000/templates.html', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'scratch/templates_desktop.png', fullPage: false });

  // Preview page mobile screenshot
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('http://localhost:3000/preview.html?template=birthday-wish-1', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'scratch/preview_mobile.png', fullPage: false });

  await browser.close();
  console.log('Screenshots captured successfully.');
})();
