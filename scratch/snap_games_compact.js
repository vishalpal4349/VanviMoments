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
  const playSec = await page.$('#playAndEarnSection');
  if (playSec) {
    await playSec.screenshot({ path: 'scratch/games_section_mobile_compact.png' });
    console.log('Mobile games compact saved to scratch/games_section_mobile_compact.png');
  }

  // Desktop test
  const pageDesk = await browser.newPage({ viewport: { width: 1200, height: 800 } });
  await pageDesk.goto('http://localhost:3000/index.html', { waitUntil: 'domcontentloaded' });
  await pageDesk.waitForTimeout(1000);
  const playSecDesk = await pageDesk.$('#playAndEarnSection');
  if (playSecDesk) {
    await playSecDesk.screenshot({ path: 'scratch/games_section_desktop_compact.png' });
    console.log('Desktop games compact saved to scratch/games_section_desktop_compact.png');
  }

  await browser.close();
})();
