const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  await page.goto('http://localhost:3000/index.html');
  await page.evaluate(() => {
    localStorage.setItem('vanvi_aesthetic_theme', 'clay');
    localStorage.setItem('vanvi_font_pref', 'royal');
  });

  const testPages = [
    'builder.html',
    'moment.html',
    'share.html',
    'checkout.html',
    'order-success.html',
    'category-anniversary.html',
    'category-love.html',
    'block-blast.html',
    'contact.html',
    'terms.html'
  ];

  for (const p of testPages) {
    const cleanName = p.replace('.html', '');
    await page.goto('http://localhost:3000/' + p, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(300);
    const scrPath = 'scratch/clay_' + cleanName + '.png';
    await page.screenshot({ path: scrPath });
    console.log(`Saved screenshot: ${scrPath}`);
  }

  await browser.close();
  console.log('Batch 3 done!');
})();
