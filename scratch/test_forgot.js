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

  console.log('Testing forgot-password.html...');
  await page.goto('http://localhost:3000/forgot-password.html', { waitUntil: 'networkidle' });

  // 1. Verify single logo
  const logoSrc = await page.$eval('.brand-logo-img', el => el.getAttribute('src'));
  console.log('Logo src:', logoSrc);
  if (!logoSrc.includes('vanvi-moments-logo-header.png')) throw new Error('Wrong logo src');

  // 2. Verify no duplicate text near logo
  const headerText = await page.$eval('.brand-header-link', el => el.textContent.trim());
  console.log('Header badge text:', headerText);
  if (headerText.toLowerCase().includes('vanvi moments')) {
    throw new Error('Duplicate brand text found in logo anchor');
  }

  // 3. Verify empty submit validation
  await page.click('#btnSubmitRecovery');
  const errorText = await page.$eval('#helpStatus', el => el.textContent);
  console.log('Empty submit error:', errorText);
  if (!errorText.includes('enter your email')) throw new Error('Validation failed');

  // 4. Test WhatsApp button link
  const waLink = await page.$eval('#btnWhatsAppSupport', el => el.getAttribute('href'));
  console.log('WhatsApp link:', waLink);
  if (!waLink.includes('917631442934')) throw new Error('WhatsApp number incorrect');

  console.log('✅ ALL FORGOT-PASSWORD QA CHECKS PASSED!');
  await browser.close();
})();
