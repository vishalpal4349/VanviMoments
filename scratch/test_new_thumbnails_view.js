const fs = require('fs');
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

(async () => {
  const browser = await chromium.launch({ executablePath, headless: true });
  
  // 1. Desktop view of templates page
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  console.log('Navigating to http://localhost:3000/templates.html');
  await page.goto('http://localhost:3000/templates.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'scratch/templates_desktop_new_thumbnails.png' });

  // 2. Mobile view of birthday category
  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  console.log('Navigating to http://localhost:3000/category-birthday.html');
  await mobilePage.goto('http://localhost:3000/category-birthday.html', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1000);
  await mobilePage.screenshot({ path: 'scratch/category_birthday_mobile_new.png' });

  console.log('Screenshots saved successfully!');
  await browser.close();
})();
