const { chromium } = require('playwright-core');
(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true
  });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('http://localhost:3000/index.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(800);
  const makeSec = await page.$('.make-section');
  if (makeSec) {
    await makeSec.screenshot({ path: 'scratch/make_section_mobile.png' });
    console.log('Mobile screenshot saved to scratch/make_section_mobile.png');
  }
  const pageDesktop = await browser.newPage({ viewport: { width: 1200, height: 800 } });
  await pageDesktop.goto('http://localhost:3000/index.html', { waitUntil: 'domcontentloaded' });
  await pageDesktop.waitForTimeout(800);
  const makeSecDesk = await pageDesktop.$('.make-section');
  if (makeSecDesk) {
    await makeSecDesk.screenshot({ path: 'scratch/make_section_desktop.png' });
    console.log('Desktop screenshot saved to scratch/make_section_desktop.png');
  }
  await browser.close();
})();
