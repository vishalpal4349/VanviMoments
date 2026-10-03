const fs = require('fs');
const { chromium } = require('playwright-core');

const CHROME_PATHS = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
];

let executablePath = null;
for (const p of CHROME_PATHS) {
  if (fs.existsSync(p)) {
    executablePath = p;
    break;
  }
}

(async () => {
  const browser = await chromium.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu']
  });

  // 1. Templates Page - Desktop View
  const pageDesk = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await pageDesk.goto('http://localhost:3000/templates.html', { waitUntil: 'networkidle' });
  await pageDesk.evaluate(() => {
    localStorage.setItem('vanvi_cookie_consent', 'all');
    const b = document.getElementById('cookieBanner');
    if (b) b.style.display = 'none';
  });

  // Capture search and smart filter bar
  await pageDesk.screenshot({ path: 'scratch/templates_desktop_filters.png', fullPage: false });

  // Test Smart Quick Tag Click (e.g. E-Magazine)
  await pageDesk.evaluate(() => {
    window.applySearchTag('magazine');
  });
  await pageDesk.waitForTimeout(400);
  await pageDesk.screenshot({ path: 'scratch/templates_desktop_search_magazine.png', fullPage: false });

  // Test Ultra VIP Category Filter Pill (shows ₹700+ templates)
  await pageDesk.evaluate(() => {
    window.selectQuickCategory('vip');
  });
  await pageDesk.waitForTimeout(400);
  await pageDesk.screenshot({ path: 'scratch/templates_desktop_vip_filter.png', fullPage: false });

  // 2. Templates Page - Mobile View
  const pageMob = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await pageMob.goto('http://localhost:3000/templates.html', { waitUntil: 'networkidle' });
  await pageMob.evaluate(() => {
    localStorage.setItem('vanvi_cookie_consent', 'all');
    const b = document.getElementById('cookieBanner');
    if (b) b.style.display = 'none';
  });
  await pageMob.screenshot({ path: 'scratch/templates_mobile_filters.png', fullPage: false });

  // 3. Category Premium Page (Ultra VIP & Bespoke) - Desktop View
  const pagePrem = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await pagePrem.goto('http://localhost:3000/category-premium.html', { waitUntil: 'networkidle' });
  await pagePrem.evaluate(() => {
    localStorage.setItem('vanvi_cookie_consent', 'all');
    const b = document.getElementById('cookieBanner');
    if (b) b.style.display = 'none';
  });

  // Scroll to ₹700+ Collection
  await pagePrem.evaluate(() => {
    const el = document.getElementById('premiumCollection');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await pagePrem.waitForTimeout(400);
  await pagePrem.screenshot({ path: 'scratch/premium_700_collection.png', fullPage: false });

  // Scroll to Single Clean Bespoke Order Form
  await pagePrem.evaluate(() => {
    const el = document.getElementById('bespokeStudio');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await pagePrem.waitForTimeout(400);
  await pagePrem.screenshot({ path: 'scratch/premium_bespoke_form.png', fullPage: false });

  // 4. Custom Experience Page - Mobile View (Check professional placeholders)
  const pageCustom = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await pageCustom.goto('http://localhost:3000/custom-experience.html', { waitUntil: 'networkidle' });
  await pageCustom.evaluate(() => {
    localStorage.setItem('vanvi_cookie_consent', 'all');
    const b = document.getElementById('cookieBanner');
    if (b) b.style.display = 'none';
    const form = document.getElementById('customForm');
    if (form) form.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await pageCustom.waitForTimeout(400);
  await pageCustom.screenshot({ path: 'scratch/custom_experience_form_mobile.png', fullPage: false });

  await browser.close();
  console.log('Turn 3 visual verification completed successfully!');
})();
