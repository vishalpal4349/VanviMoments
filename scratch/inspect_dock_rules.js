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
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('http://localhost:3000/index.html', { waitUntil: 'networkidle' });

  const comp = await page.evaluate(() => {
    const el = document.getElementById('bottomNavExplore');
    const s = window.getComputedStyle(el);
    return {
      background: s.background,
      border: s.border,
      boxShadow: s.boxShadow
    };
  });

  console.log('COMPUTED on #bottomNavExplore:', JSON.stringify(comp, null, 2));
  await browser.close();
})();
