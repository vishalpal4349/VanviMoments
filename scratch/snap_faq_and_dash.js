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
  
  // 1. Dashboard Desktop
  const p1 = await browser.newPage();
  await p1.setViewportSize({ width: 1280, height: 900 });
  await p1.goto('http://localhost:3000/dashboard.html', { waitUntil: 'networkidle' });
  await p1.screenshot({ path: 'scratch/screenshot_dashboard_v2_desktop.png' });
  console.log('Dashboard Desktop saved');

  // 2. Dashboard Mobile
  const p2 = await browser.newPage();
  await p2.setViewportSize({ width: 390, height: 844 });
  await p2.goto('http://localhost:3000/dashboard.html', { waitUntil: 'networkidle' });
  await p2.screenshot({ path: 'scratch/screenshot_dashboard_v2_mobile.png' });
  console.log('Dashboard Mobile saved');

  // 3. FAQ Desktop
  const p3 = await browser.newPage();
  await p3.setViewportSize({ width: 1280, height: 900 });
  await p3.goto('http://localhost:3000/faq.html', { waitUntil: 'networkidle' });
  await p3.screenshot({ path: 'scratch/screenshot_faq_desktop.png' });
  console.log('FAQ Desktop saved');

  // 4. FAQ Mobile
  const p4 = await browser.newPage();
  await p4.setViewportSize({ width: 390, height: 844 });
  await p4.goto('http://localhost:3000/faq.html', { waitUntil: 'networkidle' });
  await p4.screenshot({ path: 'scratch/screenshot_faq_mobile.png' });
  console.log('FAQ Mobile saved');

  await browser.close();
})();
