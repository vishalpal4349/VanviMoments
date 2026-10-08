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
  await page.goto('http://localhost:3000/templates.html', { waitUntil: 'networkidle' });
  
  // dismiss cookie banner
  await page.evaluate(() => {
    const banner = document.getElementById('vanviCookieBanner');
    if (banner) banner.remove();
    const cookies = document.querySelectorAll('.vanvi-cookie-consent, [class*="cookie"]');
    cookies.forEach(c => c.remove());
  });

  // scroll to card actions
  const createBtn = await page.$('.vanvi-card .btn-make-yours');
  if (createBtn) {
    await createBtn.scrollIntoViewIfNeeded();
  }
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'scratch/screenshot_templates_cards_zoomed.png' });

  await browser.close();
  console.log('Template cards zoomed screenshot captured!');
})();
