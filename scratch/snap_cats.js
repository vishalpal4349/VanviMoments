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
  const page = await browser.newPage();
  
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('http://localhost:3000/category-friendship.html', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'scratch/screenshot_friendship_desktop.png' });

  await page.goto('http://localhost:3000/category-memories.html', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'scratch/screenshot_memories_desktop.png' });

  await page.goto('http://localhost:3000/category-birthday.html', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'scratch/screenshot_birthday_desktop.png' });

  await browser.close();
  console.log('Category screenshots captured!');
})();
