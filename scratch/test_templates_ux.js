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
  console.log('Testing templates.html UX and Layout...');
  const browser = await chromium.launch({ executablePath, headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  await page.goto('http://localhost:3000/templates.html', { waitUntil: 'networkidle' });

  // 1. Check title and search bar
  const searchInput = await page.$('#searchInput');
  console.log('Search input exists:', !!searchInput);

  const miniFilterBtn = await page.$('#btnSmartFilterTrigger');
  console.log('Mini filter button exists:', !!miniFilterBtn);

  // 2. Check search and filter alignment in DOM
  const searchBox = await page.$('.search-box');
  const searchBoxChildren = await searchBox.$$eval('*', els => els.map(e => e.id || e.className));
  console.log('Search box elements:', searchBoxChildren);

  // 3. Test opening the filter drawer
  await miniFilterBtn.click();
  const drawerVisible = await page.$eval('#filterDrawer', el => window.getComputedStyle(el).display !== 'none');
  console.log('Filter drawer opens on click:', drawerVisible);

  // Close drawer
  await page.click('.drawer-close-btn');
  const drawerClosed = await page.$eval('#filterDrawer', el => window.getComputedStyle(el).display === 'none');
  console.log('Filter drawer closes on close button:', drawerClosed);

  // 4. Check discovery rails count badges
  const featuredBadge = await page.$eval('#count-featured', el => el.textContent);
  const popularBadge = await page.$eval('#count-popular', el => el.textContent);
  const birthdayBadge = await page.$eval('#count-birthday', el => el.textContent);
  console.log('Discovery counts:', { featuredBadge, popularBadge, birthdayBadge });

  // 5. Check Recommended section
  const recCards = await page.$$eval('#recommendationsContainer .vanvi-card', cards => cards.length);
  console.log('Recommended section cards rendered:', recCards);

  // 6. Test quick category horizontal scroll
  const quickStripScrollable = await page.$eval('#quickOccasionsStrip', el => el.scrollWidth > el.clientWidth);
  console.log('Quick occasions strip is scrollable:', quickStripScrollable);

  // 7. Check for console errors
  console.log('Console errors:', errors);

  // Capture screenshot desktop
  await page.screenshot({ path: 'scratch/templates_desktop_perfect.png', fullPage: false });

  // Capture mobile viewport
  await page.setViewportSize({ width: 375, height: 750 });
  await page.screenshot({ path: 'scratch/templates_mobile_perfect.png', fullPage: false });

  await browser.close();
  console.log('Test completed successfully!');
})();
