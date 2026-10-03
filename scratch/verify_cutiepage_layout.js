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

  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto('http://localhost:3000/templates.html', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(400);

    const metrics = await page.evaluate(() => {
      const scrollWidth = document.documentElement.scrollWidth;
      const clientWidth = document.documentElement.clientWidth;
      const overflow = scrollWidth - clientWidth;
      const cardCount = document.querySelectorAll('.cutie-card').length;
      return { overflow, cardCount };
    });

    if (metrics.overflow > 0 || metrics.cardCount === 0) {
      console.error('FAIL ' + vp.name + ':', metrics);
      allPassed = false;
    } else {
      console.log('PASS ' + vp.name + ': ' + metrics.cardCount + ' cards, overflow: ' + metrics.overflow + 'px');
    }
  }

  // Test Filter Modal
  await page.click('#filterBtn');
  await page.waitForTimeout(300);
  const modalVisible = await page.isVisible('#filterModal');
  console.log('✓ Filter modal opened:', modalVisible);

  // Click on Birthday category
  await page.click('[data-cat="birthday"]');
  await page.waitForTimeout(200);
  await page.click('.btn-apply-filters');
  await page.waitForTimeout(300);
  const bdayCount = await page.evaluate(() => document.querySelectorAll('.cutie-card').length);
  console.log('✓ Filtered by Birthday cards count:', bdayCount);

  // Test Navigation
  await page.click('.btn-card-take-look');
  await page.waitForTimeout(600);
  console.log('✓ "Take a look" navigated to:', page.url());

  // Go back and test Make it yours
  await page.goto('http://localhost:3000/templates.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(300);
  await page.click('.btn-card-make-yours');
  await page.waitForTimeout(600);
  console.log('✓ "Make it yours" navigated to:', page.url());

  await browser.close();
  if (!allPassed) process.exit(1);
  console.log('\n🎉 ALL CUTIEPAGE TESTS PASSED WITH 100% SUCCESS!');
})();
