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

  // 1. Mobile viewport on index.html
  const page1 = await browser.newPage({ viewport: { width: 375, height: 750 } });
  await page1.goto('http://localhost:3000/index.html', { waitUntil: 'domcontentloaded' });
  await page1.waitForTimeout(600);
  await page1.screenshot({ path: 'scratch/dock_mobile_index.png' });
  console.log('Saved scratch/dock_mobile_index.png');

  // 2. Mobile viewport on templates.html
  const page2 = await browser.newPage({ viewport: { width: 375, height: 750 } });
  await page2.goto('http://localhost:3000/templates.html', { waitUntil: 'domcontentloaded' });
  await page2.waitForTimeout(600);
  await page2.screenshot({ path: 'scratch/dock_mobile_templates.png' });
  console.log('Saved scratch/dock_mobile_templates.png');

  // 3. Mobile viewport on rewards.html
  const page3 = await browser.newPage({ viewport: { width: 375, height: 750 } });
  await page3.goto('http://localhost:3000/rewards.html', { waitUntil: 'domcontentloaded' });
  await page3.waitForTimeout(600);
  await page3.screenshot({ path: 'scratch/dock_mobile_rewards.png' });
  console.log('Saved scratch/dock_mobile_rewards.png');

  await browser.close();
  console.log('All dock visual screenshots saved successfully!');
})();
