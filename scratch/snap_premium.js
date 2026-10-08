const { chromium } = require('playwright-core');
const fs = require('fs');

const CHROME_PATHS = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
];
let executablePath = null;
for (const p of CHROME_PATHS) {
  if (fs.existsSync(p)) { executablePath = p; break; }
}

(async () => {
  const browser = await chromium.launch({ executablePath, headless: true });
  
  // Desktop
  const pageDesk = await browser.newPage();
  await pageDesk.setViewportSize({ width: 1280, height: 900 });
  await pageDesk.goto('http://localhost:3000/category-premium.html', { waitUntil: 'networkidle' });
  await pageDesk.screenshot({ path: 'scratch/screenshot_premium_desktop.png' });
  console.log('Premium Desktop screenshot taken');

  // Mobile
  const pageMob = await browser.newPage();
  await pageMob.setViewportSize({ width: 390, height: 844 });
  await pageMob.goto('http://localhost:3000/category-premium.html', { waitUntil: 'networkidle' });
  await pageMob.screenshot({ path: 'scratch/screenshot_premium_mobile.png' });
  console.log('Premium Mobile screenshot taken');

  await browser.close();
})();
