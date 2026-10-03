const { chromium } = require('playwright-core');
(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true
  });
  
  // Mobile test
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('http://localhost:3000/index.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  
  // Header screenshot
  const header = await page.$('header');
  if (header) {
    await header.screenshot({ path: 'scratch/header_logo_mobile.png' });
    console.log('Mobile header logo saved to scratch/header_logo_mobile.png');
  }

  // Full bottom area screenshot including floating buttons & bottom dock
  await page.screenshot({ path: 'scratch/mobile_bottom_dock_panda.png', clip: { x: 0, y: 700, width: 390, height: 144 } });
  console.log('Mobile bottom dock + panda saved to scratch/mobile_bottom_dock_panda.png');

  // Desktop header screenshot
  const pageDesk = await browser.newPage({ viewport: { width: 1200, height: 800 } });
  await pageDesk.goto('http://localhost:3000/index.html', { waitUntil: 'domcontentloaded' });
  await pageDesk.waitForTimeout(1000);
  const headerDesk = await pageDesk.$('header');
  if (headerDesk) {
    await headerDesk.screenshot({ path: 'scratch/header_logo_desktop.png' });
    console.log('Desktop header logo saved to scratch/header_logo_desktop.png');
  }

  await browser.close();
})();
