const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');
const CHROME_PATHS = ['C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'];
let executablePath = null;
for (const p of CHROME_PATHS) { if (fs.existsSync(p)) { executablePath = p; break; } }

(async () => {
  const browser = await chromium.launch({ executablePath, headless: true });
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  const fileUrl = 'file:///' + path.resolve(__dirname, '..', 'templates.html').replace(/\\/g, '/');
  await page.goto(fileUrl, { waitUntil: 'load' });
  await page.waitForTimeout(500);
  
  await page.evaluate(() => {
    localStorage.setItem('vanvi_cookie_consent', 'accepted');
    const b = document.getElementById('cookieConsentBanner');
    if (b) b.remove();
  });
  await page.waitForTimeout(300);
  
  await page.screenshot({ path: path.join(__dirname, 'desktop_cards_detailed.png'), clip: { x: 30, y: 350, width: 1140, height: 500 } });
  
  const firstCard = await page.$('.vanvi-card');
  if (firstCard) {
    await firstCard.screenshot({ path: path.join(__dirname, 'single_card_desktop.png') });
  }

  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(300);
  const mobileCard = await page.$('.vanvi-card');
  if (mobileCard) {
    await mobileCard.screenshot({ path: path.join(__dirname, 'single_card_mobile.png') });
  }

  await browser.close();
  console.log('Screenshots captured successfully!');
})();
