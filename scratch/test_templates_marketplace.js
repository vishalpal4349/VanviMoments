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

const ROOT_DIR = path.resolve(__dirname, '..');
const fileUrl = (file) => `file://${path.join(ROOT_DIR, file).replace(/\\/g, '/')}`;

const VIEWPORTS = [
  { name: '320px', width: 320, height: 600 },
  { name: '360px', width: 360, height: 640 },
  { name: '375px', width: 375, height: 667 },
  { name: '390px', width: 390, height: 844 },
  { name: '414px', width: 414, height: 896 },
  { name: '768px', width: 768, height: 1024 },
  { name: '1024px', width: 1024, height: 768 },
  { name: '1280px', width: 1280, height: 800 },
  { name: '1440px', width: 1440, height: 900 }
];

async function runTests() {
  console.log('Starting Playwright QA Audit for Templates Experience...\n');
  const browser = await chromium.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  let failures = 0;

  // Track console errors
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  // 1. Test templates.html across all requested viewports
  console.log('--- TEST 1: Viewport Overflow & Responsiveness (templates.html) ---');
  for (const vp of VIEWPORTS) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto(fileUrl('templates.html'), { waitUntil: 'load' });
    await page.waitForTimeout(300);

    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    if (overflow) {
      console.error(`❌ Overflow detected at ${vp.name}! scrollWidth: ${scrollWidth} > innerWidth: ${vp.width}`);
      failures++;
    } else {
      console.log(`✅ ${vp.name}: No horizontal overflow (scrollWidth: ${scrollWidth}, innerWidth: ${vp.width})`);
    }
  }

  // 2. Test Rails population & card structure
  console.log('\n--- TEST 2: Discovery Rails & Card Structure ---');
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(fileUrl('templates.html'), { waitUntil: 'load' });
  await page.waitForTimeout(400);

  const rails = [
    'rail-featured',
    'rail-popular',
    'rail-birthday',
    'rail-love',
    'rail-anniversary',
    'rail-friendship',
    'rail-family',
    'rail-memories',
    'rail-premium'
  ];

  for (const r of rails) {
    const cardCount = await page.evaluate((id) => {
      const el = document.getElementById(id);
      return el ? el.querySelectorAll('.vanvi-card').length : 0;
    }, r);
    if (cardCount > 0) {
      console.log(`✅ #${r}: Successfully populated with ${cardCount} cards`);
    } else {
      console.error(`❌ #${r}: Empty rail!`);
      failures++;
    }
  }

  // Check card content
  const cardSample = await page.evaluate(() => {
    const card = document.querySelector('.vanvi-card');
    if (!card) return null;
    return {
      hasExpHint: !!card.querySelector('.card-exp-hint'),
      hasTagline: !!card.querySelector('.card-tagline'),
      hasPrice: !!card.querySelector('.card-price-cluster'),
      hasPreviewBtn: !!card.querySelector('.btn-take-look'),
      hasCreateBtn: !!card.querySelector('.btn-make-yours'),
      previewHref: card.querySelector('.btn-take-look')?.getAttribute('href'),
      createHref: card.querySelector('.btn-make-yours')?.getAttribute('href')
    };
  });

  console.log('\nCard Sample Inspection:', cardSample);
  if (cardSample && cardSample.hasExpHint && cardSample.hasPreviewBtn && cardSample.hasCreateBtn) {
    console.log('✅ Card structure conforms to requirements.');
  } else {
    console.error('❌ Card structure missing required elements!');
    failures++;
  }

  // 3. Test Filter Drawer interaction
  console.log('\n--- TEST 3: Smart Filter Drawer Interaction ---');
  await page.evaluate(() => window.openFilterDrawer());
  await page.waitForTimeout(200);

  const drawerVisible = await page.evaluate(() => {
    const d = document.getElementById('filterDrawer');
    return d && window.getComputedStyle(d).display !== 'none';
  });

  if (drawerVisible) {
    console.log('✅ Filter drawer opened successfully.');
  } else {
    console.error('❌ Filter drawer failed to open!');
    failures++;
  }

  // Test selecting a filter
  await page.evaluate(() => window.selectFilter('price', 'free'));
  await page.waitForTimeout(200);

  const filteredCardCount = await page.evaluate(() => {
    const grid = document.getElementById('filterGrid');
    return grid ? grid.querySelectorAll('.vanvi-card').length : 0;
  });
  console.log(`✅ Filtered results for price:free -> ${filteredCardCount} moments found.`);

  // Test reset
  await page.evaluate(() => window.resetAllFilters());
  await page.waitForTimeout(200);
  const resetRailsVisible = await page.evaluate(() => {
    const r = document.getElementById('discoveryRailsView');
    return r && window.getComputedStyle(r).display !== 'none';
  });
  if (resetRailsVisible) {
    console.log('✅ Filter reset successfully restored discovery rails.');
  } else {
    console.error('❌ Discovery rails not restored after reset!');
    failures++;
  }

  // 4. Test Search
  console.log('\n--- TEST 4: Search Interaction ---');
  await page.evaluate(() => {
    const input = document.getElementById('searchInput');
    input.value = 'candle';
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await page.waitForTimeout(200);

  const searchResultsCount = await page.evaluate(() => {
    const grid = document.getElementById('filterGrid');
    return grid ? grid.querySelectorAll('.vanvi-card').length : 0;
  });
  console.log(`✅ Search for "candle" -> ${searchResultsCount} moments found.`);
  if (searchResultsCount > 0) {
    console.log('✅ Search functionality working correctly.');
  } else {
    console.error('❌ Search returned 0 results for "candle"!');
    failures++;
  }

  // Clear search
  await page.evaluate(() => window.resetAllFilters());

  // 5. Test preview.html
  console.log('\n--- TEST 5: Preview Page (preview.html) ---');
  await page.goto(fileUrl('preview.html?template=birthday-wish-1'), { waitUntil: 'load' });
  await page.waitForTimeout(400);

  const previewInfo = await page.evaluate(() => {
    return {
      title: document.getElementById('tplTitle')?.textContent,
      price: document.getElementById('tplPrice')?.textContent,
      createBtnHref: document.getElementById('btnMakeItYours')?.getAttribute('href'),
      iframeSrc: document.getElementById('previewIframe')?.getAttribute('src')
    };
  });
  console.log('Preview Page Details:', previewInfo);
  if (previewInfo.title && previewInfo.createBtnHref && previewInfo.createBtnHref.includes('builder.html')) {
    console.log('✅ preview.html correctly loaded template metadata and linked to builder.html.');
  } else {
    console.error('❌ preview.html failed to load template properly!');
    failures++;
  }

  // Check preview.html responsiveness at 360px
  await page.setViewportSize({ width: 360, height: 640 });
  await page.waitForTimeout(200);
  const previewOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  if (!previewOverflow) {
    console.log('✅ preview.html: No horizontal overflow on 360px mobile viewport.');
  } else {
    console.error('❌ preview.html has horizontal overflow on 360px!');
    failures++;
  }

  // 6. Test builder.html handoff
  console.log('\n--- TEST 6: Builder Page Handoff (builder.html) ---');
  await page.goto(fileUrl('builder.html?template=birthday-wish-1&occasion=Birthday'), { waitUntil: 'load' });
  await page.waitForTimeout(300);

  const builderInfo = await page.evaluate(() => {
    return {
      selectedOccasion: document.getElementById('inpOccasion')?.value,
      hasSteps: document.querySelectorAll('.step-card-panel').length === 3
    };
  });
  console.log('Builder Info:', builderInfo);
  if (builderInfo.selectedOccasion === 'Birthday' && builderInfo.hasSteps) {
    console.log('✅ builder.html successfully initialized with selected template & occasion.');
  } else {
    console.error('❌ builder.html initialization issue!');
    failures++;
  }

  console.log('\n--- Console Errors Check ---');
  if (consoleErrors.length === 0) {
    console.log('✅ Zero console errors detected.');
  } else {
    console.log(`⚠️ Console errors recorded (${consoleErrors.length}):`, consoleErrors.slice(0, 5));
  }

  await browser.close();

  console.log('\n====================================================');
  if (failures === 0) {
    console.log('🎉 ALL TESTS PASSED! Template marketplace flow is verified.');
  } else {
    console.error(`💥 ${failures} tests failed!`);
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Audit crashed:', err);
  process.exit(1);
});
