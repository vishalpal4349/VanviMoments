const { chromium } = require('playwright-core');

async function testPage(page, url, width, height) {
  await page.setViewportSize({ width, height });
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => errors.push(err.message));

  console.log(`\nTesting ${url} at ${width}x${height}...`);
  const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
  console.log(`Status: ${resp.status()}`);

  await page.waitForTimeout(1000);

  // Check horizontal overflow
  const overflow = await page.evaluate(() => {
    const docW = document.documentElement.clientWidth;
    const scrollW = document.documentElement.scrollWidth;
    return { docW, scrollW, hasOverflow: scrollW > docW };
  });
  console.log(`Viewport: ${width}px | clientWidth: ${overflow.docW}px | scrollWidth: ${overflow.scrollW}px | Overflow: ${overflow.hasOverflow}`);

  // Check card buttons
  const buttonCheck = await page.evaluate(() => {
    const takeLook = document.querySelectorAll('.btn-take-look').length;
    const makeYours = document.querySelectorAll('.btn-make-yours').length;
    const recSection = document.querySelectorAll('.more-templates-section').length;
    const recCards = document.querySelectorAll('.recommendations-grid .vanvi-card').length;
    return { takeLook, makeYours, recSection, recCards };
  });
  console.log('Button & Rec Stats:', buttonCheck);

  if (errors.length > 0) {
    console.error('Console Errors:', errors);
  } else {
    console.log('0 console errors!');
  }

  return { url, width, status: resp.status(), overflow: overflow.hasOverflow, errors: errors.length };
}

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage();

  const results = [];

  // Test templates.html on mobile (360px) and desktop (1280px)
  results.push(await testPage(page, 'http://localhost:3000/templates.html', 360, 800));
  results.push(await testPage(page, 'http://localhost:3000/templates.html', 1280, 800));

  // Test preview.html on mobile (360px) and desktop (1280px)
  results.push(await testPage(page, 'http://localhost:3000/preview.html?template=birthday-wish-1', 360, 800));
  results.push(await testPage(page, 'http://localhost:3000/preview.html?template=birthday-wish-1', 1280, 800));

  // Test category-birthday.html on mobile (360px) and desktop (1280px)
  results.push(await testPage(page, 'http://localhost:3000/category-birthday.html', 360, 800));
  results.push(await testPage(page, 'http://localhost:3000/category-birthday.html', 1280, 800));

  // Test category-love.html on mobile (360px) and desktop (1280px)
  results.push(await testPage(page, 'http://localhost:3000/category-love.html', 360, 800));

  await browser.close();

  const allPassed = results.every(r => r.status === 200 && !r.overflow && r.errors === 0);
  console.log('\n=========================================');
  console.log('OVERALL UX VERIFICATION PASS:', allPassed);
  console.log('=========================================');
  if (!allPassed) process.exit(1);
})();
