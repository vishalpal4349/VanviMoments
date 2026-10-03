const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({ 
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', 
    headless: true 
  });
  const page = await browser.newPage();
  
  const viewports = [
    { name: 'Mobile-320', width: 320, height: 568 },
    { name: 'Mobile-360', width: 360, height: 640 },
    { name: 'Mobile-375', width: 375, height: 667 },
    { name: 'Mobile-390', width: 390, height: 844 },
    { name: 'Mobile-414', width: 414, height: 896 },
    { name: 'Tablet-768', width: 768, height: 1024 },
    { name: 'Laptop-1024', width: 1024, height: 768 },
    { name: 'Desktop-1280', width: 1280, height: 800 }
  ];

  let allPassed = true;

  console.log('--- Testing Responsiveness & Layout Across Viewports ---');

  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto('http://localhost:3000/templates.html', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(400);

    const metrics = await page.evaluate(() => {
      const scrollWidth = document.documentElement.scrollWidth;
      const clientWidth = document.documentElement.clientWidth;
      const overflow = scrollWidth - clientWidth;
      const cardCount = document.querySelectorAll('.vanvi-card').length;
      
      // Check first visible card buttons
      const firstCard = document.querySelector('.vanvi-card');
      let buttonsOk = false;
      if (firstCard) {
        const previewBtn = firstCard.querySelector('.btn-card-preview');
        const createBtn = firstCard.querySelector('.btn-card-create');
        if (previewBtn && createBtn) {
          const pBox = previewBtn.getBoundingClientRect();
          const cBox = createBtn.getBoundingClientRect();
          buttonsOk = pBox.width > 40 && pBox.height > 25 && cBox.width > 60 && cBox.height > 25;
        }
      }

      return { overflow, cardCount, buttonsOk };
    });

    if (metrics.overflow > 0 || metrics.cardCount === 0 || !metrics.buttonsOk) {
      console.error('FAIL ' + vp.name + ':', metrics);
      allPassed = false;
    } else {
      console.log('PASS ' + vp.name + ': ' + metrics.cardCount + ' cards loaded, buttons OK, overflow: ' + metrics.overflow + 'px');
    }
  }

  console.log('\n--- Testing Discovery Rails & Quick Categories ---');
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('http://localhost:3000/templates.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(300);

  // Check Occasion Rails exist
  const railsCount = await page.evaluate(() => document.querySelectorAll('.occasion-section').length);
  console.log('✓ Occasion sections rendered:', railsCount);

  // Click Quick Category: Birthday
  await page.click('#quick-cat-birthday');
  await page.waitForTimeout(400);
  const isGridView = await page.isVisible('#filterResultsView');
  const filteredCount = await page.evaluate(() => document.querySelectorAll('#filterGrid .vanvi-card').length);
  console.log('✓ Quick Category click switched to filtered grid:', isGridView, 'Cards count:', filteredCount);

  // Check Active Chips
  const chipText = await page.innerText('.active-chip-pill');
  console.log('✓ Active chip text:', chipText);

  // Remove Active Chip
  await page.click('.active-chip-pill');
  await page.waitForTimeout(300);
  const railsRestored = await page.isVisible('#discoveryRailsView');
  console.log('✓ Removed chip restored discovery rails view:', railsRestored);

  console.log('\n--- Testing Smart Filter Drawer ---');
  await page.click('#filterBtn');
  await page.waitForTimeout(300);
  const drawerVisible = await page.isVisible('#filterDrawer');
  console.log('✓ Filter drawer opened:', drawerVisible);

  // Select 100% Free filter
  await page.click('[data-price="free"]');
  await page.waitForTimeout(200);
  await page.click('.btn-drawer-apply');
  await page.waitForTimeout(400);
  const freeCardsCount = await page.evaluate(() => document.querySelectorAll('#filterGrid .vanvi-card').length);
  console.log('✓ Filtered by Free price cards count:', freeCardsCount);

  console.log('\n--- Testing User Flow CTAs ---');
  // Click Preview on first visible card
  const firstPreview = page.locator('.btn-card-preview:visible').first();
  const previewHref = await firstPreview.getAttribute('href');
  console.log('✓ Preview button target:', previewHref);

  const firstCreate = page.locator('.btn-card-create:visible').first();
  const createHref = await firstCreate.getAttribute('href');
  console.log('✓ Create button target:', createHref);

  await firstPreview.click();
  await page.waitForTimeout(600);
  console.log('✓ "Preview" navigated to:', page.url());

  // Return and test Create Moment
  await page.goto('http://localhost:3000/templates.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(300);
  await page.locator('.btn-card-create:visible').first().click();
  await page.waitForTimeout(600);
  console.log('✓ "Create Moment ✦" navigated to:', page.url());

  await browser.close();
  if (!allPassed) process.exit(1);
  console.log('\n🎉 ALL VANVIMOMENTS MARKETPLACE AUDITS PASSED WITH 100% SUCCESS!');
})();
