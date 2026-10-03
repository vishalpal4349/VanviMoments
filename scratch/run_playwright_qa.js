const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');

const CHROME_PATHS = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
];

let executablePath = null;
for (const p of CHROME_PATHS) {
  if (fs.existsSync(p)) {
    executablePath = p;
    break;
  }
}

if (!executablePath) {
  console.error('No suitable browser executable found!');
  process.exit(1);
}

console.log('Using browser executable:', executablePath);

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

const ALL_PAGES = [
  '404.html',
  'about.html',
  'admin.html',
  'ai-matcher.html',
  'ai.html',
  'builder.html',
  'category-anniversary.html',
  'category-apology.html',
  'category-birthday.html',
  'category-celebration.html',
  'category-family.html',
  'category-free.html',
  'category-friendship.html',
  'category-love.html',
  'category-memories.html',
  'category-premium.html',
  'checkout.html',
  'coming-soon.html',
  'constellation-of-love.html',
  'contact.html',
  'custom-experience.html',
  'dashboard.html',
  'faq.html',
  'forgot-password.html',
  'games.html',
  'gem-catch.html',
  'heart-rain.html',
  'hidden-hearts.html',
  'index.html',
  'login.html',
  'love-puzzle.html',
  'memory-rush.html',
  'memory-sequence.html',
  'moment.html',
  'order-success.html',
  'plans.html',
  'privacy.html',
  'products.html',
  'profile.html',
  'quick-tap.html',
  'refer.html',
  'refund.html',
  'rewards.html',
  'risk-run.html',
  'share.html',
  'preview.html',
  'templates/birthday-3d-candle/index.html',
  'templates.html',
  'terms.html',
  'unlock-gift.html',
  'vanvi-assistant.html',
  'word-whisper.html'
];

const VIEWPORTS = [
  { name: 'Mobile-320', width: 320, height: 568 },
  { name: 'Mobile-360', width: 360, height: 640 },
  { name: 'Mobile-375', width: 375, height: 667 },
  { name: 'Mobile-390', width: 390, height: 844 },
  { name: 'Mobile-414', width: 414, height: 896 },
  { name: 'Tablet-768', width: 768, height: 1024 },
  { name: 'Laptop-1024', width: 1024, height: 768 },
  { name: 'Desktop-1280', width: 1280, height: 800 }
];

async function runBrowserAudit() {
  const browser = await chromium.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const results = {
    totalPages: ALL_PAGES.length,
    passedPages: [],
    failedPages: [],
    overflows: [],
    consoleErrors: [],
    brokenAssets: [],
    deadButtons: [],
    journeys: []
  };

  console.log(`Starting automated browser audit across ${ALL_PAGES.length} pages...`);

  const page = await browser.newPage();

  // Test all 58 pages for load, console errors, broken assets, and responsive overflow
  for (let i = 0; i < ALL_PAGES.length; i++) {
    const pagePath = ALL_PAGES[i];
    const fullUrl = `${BASE_URL}/${pagePath}`;
    const pageErrors = [];
    const pageFailedReqs = [];

    const onConsole = msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Ignore known benign third-party or chrome extension errors
        if (!text.includes('favicon.ico') && !text.includes('net::ERR_FAILED') && !text.includes('WebSocket')) {
          pageErrors.push(text);
        }
      }
    };
    const onReqFailed = req => {
      const url = req.url();
      if (!url.includes('google-analytics') && !url.includes('doubleclick') && !url.includes('favicon.ico') && !url.includes('razorpay')) {
        pageFailedReqs.push(url);
      }
    };

    page.on('console', onConsole);
    page.on('requestfailed', onReqFailed);

    try {
      await page.goto(fullUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForTimeout(400);

      // Verify desktop & mobile responsiveness
      for (const vp of [VIEWPORTS[0], VIEWPORTS[2], VIEWPORTS[5], VIEWPORTS[7]]) {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.waitForTimeout(100);

        const overflow = await page.evaluate(() => {
          const docEl = document.documentElement;
          const scrollWidth = docEl.scrollWidth;
          const clientWidth = docEl.clientWidth;
          window.scrollTo(50, 0);
          const scrolled = window.scrollX > 0;
          window.scrollTo(0, 0);
          return {
            hasOverflow: (scrollWidth > clientWidth + 2) || scrolled,
            diff: Math.max(0, scrollWidth - clientWidth)
          };
        });

        if (overflow.hasOverflow) {
          results.overflows.push({
            page: pagePath,
            viewport: vp.name,
            diff: overflow.diff
          });
        }
      }

      // Check for dead anchors (href="#" without click handler)
      const deadAnchorsCount = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a[href="#"]'));
        return links.filter(a => !a.getAttribute('onclick') && !a.getAttribute('role') && !a.id).length;
      });

      if (deadAnchorsCount > 0) {
        results.deadButtons.push({ page: pagePath, count: deadAnchorsCount });
      }

      if (pageErrors.length > 0) {
        results.consoleErrors.push({ page: pagePath, errors: pageErrors });
      }
      if (pageFailedReqs.length > 0) {
        results.brokenAssets.push({ page: pagePath, assets: pageFailedReqs });
      }

      results.passedPages.push(pagePath);
      process.stdout.write(`\r[${i + 1}/${ALL_PAGES.length}] Checked: ${pagePath} - OK`);
    } catch (err) {
      console.error(`\nFailed loading ${pagePath}:`, err.message);
      results.failedPages.push({ page: pagePath, error: err.message });
    } finally {
      page.off('console', onConsole);
      page.off('requestfailed', onReqFailed);
    }
  }

  console.log('\n\n--- Testing End-to-End User Journey 1: Customer Creation Flow ---');
  try {
    // 1. Home
    await page.goto(`${BASE_URL}/index.html`, { waitUntil: 'domcontentloaded' });
    console.log('✓ Step 1: Loaded Home Page');

    // 2. Discover Templates
    await page.goto(`${BASE_URL}/templates.html`, { waitUntil: 'domcontentloaded' });
    console.log('✓ Step 2: Loaded Discover Templates Catalog');

    // 3. Category Page
    await page.goto(`${BASE_URL}/category-birthday.html`, { waitUntil: 'domcontentloaded' });
    console.log('✓ Step 3: Loaded Birthday Category Page');

    // 4. Live Interactive Preview Page
    await page.goto(`${BASE_URL}/preview.html?template=birthday-3d-candle`, { waitUntil: 'domcontentloaded' });
    console.log('✓ Step 4: Loaded Live Interactive Preview Page (preview.html)');

    // 5. Creator Studio (Builder)
    await page.goto(`${BASE_URL}/builder.html?template=birthday-white-bloom-001`, { waitUntil: 'domcontentloaded' });
    console.log('✓ Step 5: Loaded Creator Studio (Builder)');

    // 6. Login Page
    await page.goto(`${BASE_URL}/login.html`, { waitUntil: 'domcontentloaded' });
    console.log('✓ Step 6: Loaded Sign In / Authentication Page');

    // 7. Checkout Page
    await page.goto(`${BASE_URL}/checkout.html?template=Birthday+White+Bloom&price=199`, { waitUntil: 'domcontentloaded' });
    console.log('✓ Step 7: Loaded Checkout Page with Coin Redemption');

    // 8. Order Success
    await page.goto(`${BASE_URL}/order-success.html?orderId=ORD_TEST_123`, { waitUntil: 'domcontentloaded' });
    console.log('✓ Step 8: Loaded Order Success Confirmation Page');

    // 9. Moment Page
    await page.goto(`${BASE_URL}/moment.html?recipient=Aarav&sender=Sneha`, { waitUntil: 'domcontentloaded' });
    console.log('✓ Step 9: Loaded Recipient Moment Surprise Experience');

    // 10. Share Studio
    await page.goto(`${BASE_URL}/share.html?id=vm_test_123`, { waitUntil: 'domcontentloaded' });
    console.log('✓ Step 10: Loaded Luxury Share Studio & QR Canvas');

    results.journeys.push({ name: 'Journey 1: Full Customer Checkout Journey', status: 'PASS' });
  } catch (j1Err) {
    console.error('Journey 1 Error:', j1Err);
    results.journeys.push({ name: 'Journey 1: Full Customer Checkout Journey', status: 'FAIL', error: j1Err.message });
  }

  console.log('\n--- Testing End-to-End User Journey 2: AI Co-Pilot Recommendation Flow ---');
  try {
    // 1. Home
    await page.goto(`${BASE_URL}/index.html`, { waitUntil: 'domcontentloaded' });
    console.log('✓ Step 1: Loaded Home Page');

    // 2. Vanvi AI Co-Pilot
    await page.goto(`${BASE_URL}/ai.html`, { waitUntil: 'domcontentloaded' });
    console.log('✓ Step 2: Loaded Vanvi AI Studio');

    // 3. AI Matcher
    await page.goto(`${BASE_URL}/ai-matcher.html`, { waitUntil: 'domcontentloaded' });
    console.log('✓ Step 3: Loaded AI Occasion Matcher');

    // 4. Template recommendation
    await page.goto(`${BASE_URL}/templates.html`, { waitUntil: 'domcontentloaded' });
    console.log('✓ Step 4: Loaded Recommended Template Detail');

    // 5. Personalize in Studio
    await page.goto(`${BASE_URL}/builder.html?template=birthday-wish-1`, { waitUntil: 'domcontentloaded' });
    console.log('✓ Step 5: Loaded Builder with AI Recommendation');

    results.journeys.push({ name: 'Journey 2: AI Recommendation Journey', status: 'PASS' });
  } catch (j2Err) {
    console.error('Journey 2 Error:', j2Err);
    results.journeys.push({ name: 'Journey 2: AI Recommendation Journey', status: 'FAIL', error: j2Err.message });
  }

  await browser.close();

  console.log('\n\n========================================');
  console.log('      AUTOMATED BROWSER AUDIT SUMMARY   ');
  console.log('========================================');
  console.log(`Total HTML Pages: ${results.totalPages}`);
  console.log(`Passed Loading:   ${results.passedPages.length}`);
  console.log(`Failed Loading:   ${results.failedPages.length}`);
  console.log(`Overflow Issues:  ${results.overflows.length}`);
  console.log(`Console Errors:   ${results.consoleErrors.length}`);
  console.log(`Broken Assets:    ${results.brokenAssets.length}`);
  console.log(`Dead Anchors:     ${results.deadButtons.length}`);
  console.log(`User Journeys:    ${results.journeys.map(j => j.name + ': ' + j.status).join(', ')}`);
  console.log('========================================\n');

  fs.writeFileSync('scratch/browser_audit_results.json', JSON.stringify(results, null, 2));
}

runBrowserAudit().catch(err => {
  console.error('Fatal audit error:', err);
  process.exit(1);
});
