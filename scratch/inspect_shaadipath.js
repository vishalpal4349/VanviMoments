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
  console.log('Navigating with domcontentloaded...');
  await page.goto('https://www.shaadipath.com/builder', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(4000);

  const info = await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5')).map(h => h.textContent.trim());
    const buttons = Array.from(document.querySelectorAll('button')).map(b => b.textContent.trim()).filter(Boolean);
    const labels = Array.from(document.querySelectorAll('label')).map(l => l.textContent.trim());
    const tabs = Array.from(document.querySelectorAll('[role="tab"], nav button, nav a')).map(t => t.textContent.trim());
    const fullText = document.body.innerText;
    return {
      title: document.title,
      headings,
      buttons: buttons.slice(0, 30),
      labels: labels.slice(0, 40),
      tabs: tabs.slice(0, 20),
      fullTextSnippet: fullText.substring(0, 2500)
    };
  });

  console.log('=== BUILDER INSPECTION ===');
  console.log(JSON.stringify(info, null, 2));
  await page.screenshot({ path: 'scratch/shaadipath_builder.png' });
  await browser.close();
})();
