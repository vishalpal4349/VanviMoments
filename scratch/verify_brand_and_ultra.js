const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');

const CHROME_PATHS = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
];

let executablePath = null;
for (const p of CHROME_PATHS) {
  if (fs.existsSync(p)) {
    executablePath = p;
    break;
  }
}

async function main() {
  const browser = await chromium.launch({ executablePath, headless: true });
  
  // 1. Mobile 390px Test
  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  // Set cookie consent so banner does not cover
  await mobilePage.addInitScript(() => {
    localStorage.setItem('vanvi_cookie_consent', 'all');
  });
  await mobilePage.goto('http://localhost:3000/index.html', { waitUntil: 'domcontentloaded' });
  await mobilePage.waitForTimeout(800);

  const mobileHeader = await mobilePage.$('header');
  if (mobileHeader) {
    await mobileHeader.screenshot({ path: path.join(__dirname, 'header_mobile.png') });
  }

  // Scroll to ultraSection to trigger scroll-animate
  const ultraEl = mobilePage.locator('#ultraSection');
  await ultraEl.scrollIntoViewIfNeeded();
  await mobilePage.waitForTimeout(600);

  const ultraBox = await ultraEl.boundingBox();
  console.log('Mobile UltraSection bounding box:', ultraBox);
  await ultraEl.screenshot({ path: path.join(__dirname, 'ultra_mobile.png') });

  // 2. Desktop 1280px Test
  const desktopPage = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await desktopPage.addInitScript(() => {
    localStorage.setItem('vanvi_cookie_consent', 'all');
  });
  await desktopPage.goto('http://localhost:3000/index.html', { waitUntil: 'domcontentloaded' });
  await desktopPage.waitForTimeout(800);

  const desktopUltra = desktopPage.locator('#ultraSection');
  await desktopUltra.scrollIntoViewIfNeeded();
  await desktopPage.waitForTimeout(600);
  await desktopUltra.screenshot({ path: path.join(__dirname, 'ultra_desktop.png') });

  await browser.close();
  console.log('Mobile & Desktop captures complete!');
}

main().catch(err => {
  console.error('Error running test:', err);
  process.exit(1);
});
