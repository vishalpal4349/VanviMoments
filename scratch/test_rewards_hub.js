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

(async () => {
  console.log('🚀 Starting Rewards Hub and Dock QA Test with', executablePath);
  const browser = await chromium.launch({ executablePath, headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const baseUrl = 'http://localhost:3000';

  // TEST 1: Index.html Bottom Dock
  console.log('\n--- 1. Testing index.html Bottom Dock ---');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${baseUrl}/index.html`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1200);

  const rewardsDockBtn = page.locator('#bottomNavRewards');
  const count = await rewardsDockBtn.count();
  if (count === 0) {
    throw new Error('❌ #bottomNavRewards not found in index.html dock');
  }
  const dockText = await rewardsDockBtn.innerText();
  console.log(`✓ Found bottom dock item: "${dockText.replace(/\s+/g, ' ').trim()}"`);
  if (!dockText.includes('Rewards')) {
    throw new Error(`❌ Bottom dock text does not include "Rewards": got "${dockText}"`);
  }

  // Click Rewards dock button and verify navigation to rewards.html
  console.log('Clicking Rewards dock button...');
  await rewardsDockBtn.click();
  await page.waitForURL('**/rewards.html', { timeout: 6000 });
  console.log('✓ Successfully navigated to rewards.html from home dock!');

  // TEST 2: Rewards.html Layout & Features
  console.log('\n--- 2. Testing rewards.html Sections & Tabs ---');
  await page.waitForTimeout(1000);

  // Check Coin Hero Card
  const heroCard = page.locator('.coin-hero-card');
  if (await heroCard.count() === 0) throw new Error('❌ .coin-hero-card not found');
  const bal = await page.locator('#displayCoinBalance').innerText();
  console.log(`✓ Coin Hero Card present with balance: ${bal} Coins`);

  // Check Quick Hub Pills
  const quickHub = page.locator('.rewards-quick-hub');
  if (await quickHub.count() === 0) throw new Error('❌ .rewards-quick-hub not found');
  const pillsCount = await page.locator('.quick-hub-pill').count();
  console.log(`✓ Quick Access Hub present with ${pillsCount} action cards`);

  // Check Active Dock Tab on rewards.html
  const activeDockBtn = page.locator('.vanvi-bottom-dock .nav-btn.active, .vanvi-bottom-dock a.active');
  const activeText = await activeDockBtn.first().innerText();
  console.log(`✓ Active bottom dock item on rewards.html: "${activeText.replace(/\s+/g, ' ').trim()}"`);

  // Test Tab Switching: Games
  console.log('\nTesting Tab: Play & Earn Games...');
  await page.click('#tabBtnGames');
  await page.waitForTimeout(400);
  const gamesPane = page.locator('#tabPaneGames');
  const isGamesVisible = await gamesPane.isVisible();
  const gameCards = await page.locator('.game-card-reward').count();
  console.log(`✓ Play & Earn Games pane visible: ${isGamesVisible}, found ${gameCards} micro-game cards`);
  if (!isGamesVisible || gameCards < 4) {
    throw new Error('❌ Games tab failed to show game cards properly');
  }

  // Test Tab Switching: Discounts & Offers
  console.log('\nTesting Tab: Offers & Deals...');
  await page.click('#tabBtnCoupons');
  await page.waitForTimeout(400);
  const couponsPane = page.locator('#tabPaneCoupons');
  const isCouponsVisible = await couponsPane.isVisible();
  const couponCards = await page.locator('.coupon-card').count();
  console.log(`✓ Offers & Deals pane visible: ${isCouponsVisible}, found ${couponCards} active coupons`);
  const calcText = await page.locator('#coinCalcSummary').innerText();
  console.log(`✓ Coin Calculator: "${calcText.replace(/\s+/g, ' ').trim()}"`);

  // Test Tab Switching: Refer Friends
  console.log('\nTesting Tab: Refer Friends...');
  await page.click('#tabBtnReferral');
  await page.waitForTimeout(400);
  const referPane = page.locator('#tabPaneReferral');
  const isReferVisible = await referPane.isVisible();
  const referCode = await page.locator('#userReferralCode').innerText();
  console.log(`✓ Refer Friends pane visible: ${isReferVisible}, referral code: ${referCode}`);

  // Test Tab Switching: Daily Spin
  console.log('\nTesting Tab: Daily Fortune Wheel...');
  await page.click('#tabBtnWheel');
  await page.waitForTimeout(400);
  const wheelPane = page.locator('#tabPaneWheel');
  const isWheelVisible = await wheelPane.isVisible();
  console.log(`✓ Daily Fortune Wheel pane visible: ${isWheelVisible}`);

  // TEST 3: Mobile Responsiveness (No horizontal overflow)
  console.log('\n--- 3. Testing Mobile Responsiveness (390px) ---');
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const innerWidth = await page.evaluate(() => window.innerWidth);
  console.log(`ScrollWidth: ${scrollWidth}, InnerWidth: ${innerWidth}`);
  if (scrollWidth > innerWidth + 2) {
    throw new Error(`❌ Mobile overflow detected: scrollWidth (${scrollWidth}) > innerWidth (${innerWidth})`);
  }
  console.log('✓ Zero horizontal overflow on mobile!');

  // Take Mobile Screenshot
  await page.screenshot({ path: 'scratch/rewards_mobile.png', fullPage: false });
  console.log('✓ Saved mobile screenshot to scratch/rewards_mobile.png');

  // TEST 4: Desktop Viewport
  console.log('\n--- 4. Testing Desktop Viewport (1280px) ---');
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'scratch/rewards_desktop.png', fullPage: false });
  console.log('✓ Saved desktop screenshot to scratch/rewards_desktop.png');

  // TEST 5: Dark Mode Theme Verification
  console.log('\n--- 5. Testing Dark Mode Theme ---');
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-vanvi-theme', 'dark');
    document.body.setAttribute('data-theme', 'dark');
  });
  await page.waitForTimeout(500);

  const heroBg = await page.locator('.coin-hero-card').evaluate(el => window.getComputedStyle(el).backgroundColor);
  console.log(`Dark mode Coin Hero Background: ${heroBg}`);
  await page.screenshot({ path: 'scratch/rewards_dark_desktop.png', fullPage: false });
  console.log('✓ Saved dark mode screenshot to scratch/rewards_dark_desktop.png');

  await browser.close();
  console.log('\n🎉 ALL REWARDS HUB QA CHECKS PASSED WITH FLYING COLORS!');
})();
