const { chromium } = require('playwright-core');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  console.log('--- STARTING COMPREHENSIVE QA AUDIT ---');
  const browser = await chromium.launch({ executablePath: chromePath, headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push(err.message));

  // 1. Test Index on Mobile (375x667)
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('file:///' + path.resolve('index.html').replace(/\\/g, '/'));
  await page.waitForTimeout(600);

  // Test Floating Spinner
  const floatBtn = await page.$('#scratchFloatBtn');
  console.log('1. Mobile Float btn found:', !!floatBtn);
  await floatBtn.click();
  await page.waitForTimeout(400);

  const spinModalOpen = await page.$eval('#vanviSpinModal', el => el.classList.contains('open'));
  console.log('   Spin modal opened on click:', spinModalOpen);

  const canSpin = await page.evaluate(() => window.VanviRewardEngine ? window.VanviRewardEngine.canSpin() : false);
  console.log('   Can spin fortune wheel:', canSpin);

  // Close modal via API
  await page.evaluate(() => window.closeVanviSpinModal());
  await page.waitForTimeout(300);

  // 2. Test Mobile Hamburger Menu Toggle
  const menuBtn = await page.$('#mobileMenuBtn');
  console.log('2. Mobile Menu Btn found:', !!menuBtn);
  await menuBtn.click();
  await page.waitForTimeout(300);

  const drawerOpen = await page.$eval('#mobileDrawer', el => el.classList.contains('open'));
  const bodyHasClass = await page.evaluate(() => document.body.classList.contains('drawer-open'));
  console.log('   Drawer opened:', drawerOpen, 'Body has drawer-open:', bodyHasClass);

  // Close drawer
  await page.click('#drawerClose');
  await page.waitForTimeout(300);
  const drawerClosed = await page.$eval('#mobileDrawer', el => !el.classList.contains('open'));
  console.log('   Drawer cleanly closed:', drawerClosed);

  // 3. Test Free and Premium Collection Cards on Home
  const freeCards = await page.$$eval('#freeCollectionSection .cutie-card', els => els.length);
  const premiumCards = await page.$$eval('#premiumCollectionSection .cutie-card', els => els.length);
  console.log(`3. Free Collection Cards: ${freeCards} (Expected 4), Premium Collection Cards: ${premiumCards} (Expected 4)`);

  // Test Home Games Showcase
  const homeGameItems = await page.$$eval('.home-game-card', els => els.length);
  console.log(`   Homepage Games Showcase Items: ${homeGameItems} (Expected 6)`);

  // 4. Test games.html
  console.log('4. Testing games.html...');
  await page.goto('file:///' + path.resolve('games.html').replace(/\\/g, '/'));
  await page.waitForTimeout(600);

  const totalGameCards = await page.$$eval('.game-card', els => els.length);
  console.log(`   Total game cards in games.html: ${totalGameCards} (Expected 11)`);

  // Test tabs filter
  await page.click('button[data-filter="puzzle"]');
  await page.waitForTimeout(200);
  const visiblePuzzles = await page.$$eval('.game-card', els => els.filter(e => e.style.display !== 'none').length);
  console.log(`   Visible puzzles on tab click: ${visiblePuzzles} (Expected 3)`);

  // 5. Test each new game page loads with 0 errors
  const newGames = [
    'heart-sort.html',
    'cross-math.html',
    'block-blast.html',
    'gem-merge.html',
    'periodic-quiz.html',
    'brain-test.html'
  ];

  for (const gameFile of newGames) {
    const gameErrors = [];
    const gPage = await context.newPage();
    gPage.on('pageerror', err => gameErrors.push(err.message));
    await gPage.goto('file:///' + path.resolve(gameFile).replace(/\\/g, '/'));
    await gPage.waitForTimeout(400);

    const title = await gPage.title();
    console.log(`   ✓ ${gameFile}: "${title}" - Page Errors: ${gameErrors.length}`);
    await gPage.close();
  }

  console.log('Console errors captured during test:', errors.filter(e => !e.includes('favicon')));
  console.log('--- AUDIT COMPLETE ---');

  await browser.close();
})();
