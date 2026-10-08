const fs = require('fs');
const { chromium } = require('playwright-core');

const CHROME_PATHS = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
];
const executablePath = CHROME_PATHS.find(p => fs.existsSync(p));

(async () => {
  const browser = await chromium.launch({ executablePath, headless: true });
  
  // Mobile test
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:3000/heart-rain.html', { waitUntil: 'domcontentloaded' });
  
  try {
    const btn = await mobilePage.$('button:has-text("Accept All")');
    if (btn) await btn.click();
  } catch(e) {}

  await mobilePage.waitForTimeout(400);
  await mobilePage.screenshot({ path: 'scratch/heart_rain_mobile.png', fullPage: false });
  console.log('Mobile screenshot saved to scratch/heart_rain_mobile.png');

  // Start game and take playing screenshot
  await mobilePage.click('#btnStartGame');
  await mobilePage.waitForTimeout(600);
  await mobilePage.screenshot({ path: 'scratch/heart_rain_mobile_playing.png', fullPage: false });
  console.log('Mobile playing screenshot saved to scratch/heart_rain_mobile_playing.png');

  // Desktop test
  const deskContext = await browser.newContext({
    viewport: { width: 1280, height: 850 },
    deviceScaleFactor: 2
  });
  const deskPage = await deskContext.newPage();
  await deskPage.goto('http://localhost:3000/heart-rain.html', { waitUntil: 'domcontentloaded' });
  try {
    const btn = await deskPage.$('button:has-text("Accept All")');
    if (btn) await btn.click();
  } catch(e) {}
  await deskPage.waitForTimeout(400);
  await deskPage.screenshot({ path: 'scratch/heart_rain_desktop.png', fullPage: false });
  console.log('Desktop screenshot saved to scratch/heart_rain_desktop.png');

  await browser.close();
})();
