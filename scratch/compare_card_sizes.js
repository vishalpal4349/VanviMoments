const { chromium } = require('playwright-core');
const fs = require('fs');
const CHROME_PATHS = ['C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'];
let executablePath = null;
for (const p of CHROME_PATHS) { if (fs.existsSync(p)) { executablePath = p; break; } }

(async () => {
  const browser = await chromium.launch({ executablePath, headless: true });
  const page = await browser.newPage({ viewport: { width: 375, height: 750 } });
  
  await page.goto('http://localhost:3000/templates.html', { waitUntil: 'networkidle' });
  const tCard = await page.$eval('.vanvi-card', el => {
    const r = el.getBoundingClientRect();
    return { width: r.width, height: r.height };
  });
  console.log('templates.html card on 375 mobile:', tCard);

  await page.goto('http://localhost:3000/index.html', { waitUntil: 'networkidle' });
  const iCard = await page.$eval('.template', el => {
    const r = el.getBoundingClientRect();
    return { width: r.width, height: r.height };
  });
  console.log('index.html card on 375 mobile:', iCard);

  await browser.close();
})();
