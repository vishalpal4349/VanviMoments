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
  const p1 = await browser.newPage();
  await p1.setViewportSize({ width: 1280, height: 900 });
  await p1.goto('http://localhost:3000/games.html', { waitUntil: 'networkidle' });
  await p1.screenshot({ path: 'scratch/screenshot_games_before_desktop.png' });
  console.log('Games Desktop saved');

  // Mobile
  const p2 = await browser.newPage();
  await p2.setViewportSize({ width: 390, height: 844 });
  await p2.goto('http://localhost:3000/games.html', { waitUntil: 'networkidle' });
  await p2.screenshot({ path: 'scratch/screenshot_games_before_mobile.png' });
  console.log('Games Mobile saved');

  await browser.close();
})();
