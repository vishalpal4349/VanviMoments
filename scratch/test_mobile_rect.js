const { chromium } = require('playwright-core');
const fs = require('fs');
const CHROME_PATHS = ['C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'];
let executablePath = null;
for (const p of CHROME_PATHS) { if (fs.existsSync(p)) { executablePath = p; break; } }

(async () => {
  const browser = await chromium.launch({ executablePath, headless: true });
  const page = await browser.newPage({ viewport: { width: 375, height: 750 } });
  await page.goto('http://localhost:3000/templates.html', { waitUntil: 'networkidle' });
  const box = await page.$eval('.search-box', el => {
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
  });
  console.log('Search box rect on 375px mobile:', box);
  const filterBtn = await page.$eval('#btnSmartFilterTrigger', el => {
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height, display: window.getComputedStyle(el).display };
  });
  console.log('Filter btn rect on 375px mobile:', filterBtn);
  await browser.close();
})();
