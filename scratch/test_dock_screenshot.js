const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

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
  
  // Desktop Test by targeting the element directly
  const desktopContext = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 2
  });
  const desktopPage = await desktopContext.newPage();
  await desktopPage.goto('http://localhost:3000/index.html', { waitUntil: 'networkidle' });
  await desktopPage.evaluate(() => {
    // Hide cookie banner if present so dock is fully visible
    const b = document.getElementById('vanviCookieBanner') || document.querySelector('.cookie-banner');
    if (b) b.style.display = 'none';
  });
  await desktopPage.waitForTimeout(300);
  
  const dock = await desktopPage.$('.vanvi-bottom-dock');
  if (dock) {
    await dock.screenshot({ path: path.join(__dirname, 'dock_desktop_element.png') });
  }

  await browser.close();
  console.log('Desktop dock element screenshot done!');
})();
