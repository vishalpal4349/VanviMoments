const { chromium } = require('playwright-core');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  let fail = false;
  for (const width of [360, 390, 420, 768, 1024, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 800 } });
    const fileUrl = 'file:///' + path.resolve('templates.html').replace(/\\/g, '/');
    await page.goto(fileUrl, { waitUntil: 'domcontentloaded' });
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    const hasOverflow = scrollWidth > clientWidth;
    console.log(`Viewport ${width}px -> scrollWidth: ${scrollWidth}, clientWidth: ${clientWidth}, overflow: ${hasOverflow ? 'YES (FAIL)' : 'NO (PERFECT)'}`);
    if (hasOverflow) fail = true;

    // Check navbar brand logo
    const brandText = await page.textContent('.nav-brand-static');
    if (!brandText.includes('Vanvi Moments')) {
      console.error(`Missing brand text at ${width}px!`);
      fail = true;
    }

    // Check AI matcher pill
    const aiPill = await page.isVisible('#heroAssistantPill');
    if (!aiPill) {
      console.error(`AI matcher pill not visible at ${width}px!`);
      fail = true;
    }

    // Check quick occasions strip
    const stripVisible = await page.isVisible('#quickOccasionsStrip');
    if (!stripVisible) {
      console.error(`Quick occasions strip not visible at ${width}px!`);
      fail = true;
    }

    await page.close();
  }
  await browser.close();

  if (fail) {
    console.error('❌ Responsive audit had failures!');
    process.exit(1);
  } else {
    console.log('✅ ALL RESPONSIVE VIEWPORT CHECKS PASSED FLAWLESSLY WITH ZERO OVERFLOW!');
  }
})();
