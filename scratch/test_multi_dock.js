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
  
  const viewports = [
    { name: 'iphone_390', width: 390, height: 844 },
    { name: 'iphone_414', width: 414, height: 896 },
    { name: 'ipad_768', width: 768, height: 1024 }
  ];

  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2
    });
    const page = await context.newPage();
    
    // Test index.html
    await page.goto('http://localhost:3000/index.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    const dockElIndex = await page.$('.vanvi-bottom-dock');
    if (dockElIndex) {
      await dockElIndex.screenshot({ path: path.join(__dirname, `dock_${vp.name}_index.png`) });
    }

    // Test templates.html
    await page.goto('http://localhost:3000/templates.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    const dockElTemplates = await page.$('.vanvi-bottom-dock');
    if (dockElTemplates) {
      await dockElTemplates.screenshot({ path: path.join(__dirname, `dock_${vp.name}_templates.png`) });
    }

    // Test rewards.html
    await page.goto('http://localhost:3000/rewards.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    const dockElRewards = await page.$('.vanvi-bottom-dock');
    if (dockElRewards) {
      await dockElRewards.screenshot({ path: path.join(__dirname, `dock_${vp.name}_rewards.png`) });
    }

    await context.close();
  }

  await browser.close();
  console.log('Multi-viewport dock screenshots taken successfully!');
})();
