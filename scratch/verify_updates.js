const { chromium } = require('playwright-core');
const path = require('path');
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
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Testing 404 page...');
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('http://localhost:3000/404.html', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'scratch/screenshot_404_desktop.png', fullPage: false });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:3000/404.html', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'scratch/screenshot_404_mobile.png', fullPage: false });

  console.log('Testing Templates Create button...');
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('http://localhost:3000/templates.html', { waitUntil: 'networkidle' });
  await page.waitForSelector('.btn-make-yours');
  await page.screenshot({ path: 'scratch/screenshot_templates_create_btn.png', fullPage: false });

  console.log('Testing AI floating button on index.html (Desktop)...');
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('http://localhost:3000/index.html', { waitUntil: 'networkidle' });
  
  // Click AI button
  const aiBtn = await page.$('#aiFloatBtn');
  if (aiBtn) {
    await aiBtn.click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'scratch/screenshot_ai_hub_desktop.png', fullPage: false });
  } else {
    console.log('aiFloatBtn not found on desktop');
  }

  console.log('Testing AI floating button on index.html (Mobile)...');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:3000/index.html', { waitUntil: 'networkidle' });
  const aiBtnMobile = await page.$('#aiFloatBtn');
  if (aiBtnMobile) {
    await aiBtnMobile.click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'scratch/screenshot_ai_hub_mobile.png', fullPage: false });
  }

  console.log('Testing bottom nav dock on index.html (Mobile)...');
  await page.evaluate(() => {
    const hub = document.getElementById('vanviAiHubModal');
    if (hub) hub.classList.remove('is-open');
  });
  await page.waitForTimeout(200);
  await page.screenshot({ path: 'scratch/screenshot_bottom_dock_mobile.png', fullPage: false });

  await browser.close();
  console.log('ALL PLAYWRIGHT TESTS COMPLETE!');
})();
