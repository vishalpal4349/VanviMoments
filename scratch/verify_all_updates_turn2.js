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

async function main() {
  const browser = await chromium.launch({ executablePath, headless: true });

  // 1. AI Matcher Test (Desktop & Mobile)
  const matcherPage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await matcherPage.addInitScript(() => {
    localStorage.setItem('vanvi_cookie_consent', 'all');
  });
  await matcherPage.goto('http://localhost:3000/ai-matcher.html', { waitUntil: 'domcontentloaded' });
  await matcherPage.waitForTimeout(1000);

  // Take screenshot of hero & input
  await matcherPage.screenshot({ path: path.join(__dirname, 'aimatcher_mobile_hero.png'), clip: { x: 0, y: 0, width: 390, height: 650 } });

  // Scroll to suggestions and capture
  const suggestSection = matcherPage.locator('#suggestSection');
  await suggestSection.scrollIntoViewIfNeeded();
  await matcherPage.waitForTimeout(600);
  await matcherPage.screenshot({ path: path.join(__dirname, 'aimatcher_mobile_results.png'), clip: { x: 0, y: 650, width: 390, height: 750 } });

  // 2. Rewards Wheel Test
  const rewardsPage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await rewardsPage.addInitScript(() => {
    localStorage.setItem('vanvi_cookie_consent', 'all');
  });
  await rewardsPage.goto('http://localhost:3000/rewards.html', { waitUntil: 'domcontentloaded' });
  await rewardsPage.waitForTimeout(1000);

  const wheelEl = rewardsPage.locator('.wheel-card-section');
  await wheelEl.scrollIntoViewIfNeeded();
  await rewardsPage.waitForTimeout(500);
  await wheelEl.screenshot({ path: path.join(__dirname, 'wheel_rewards_mobile.png') });

  // 3. Home Games Section Test
  const homePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await homePage.addInitScript(() => {
    localStorage.setItem('vanvi_cookie_consent', 'all');
  });
  await homePage.goto('http://localhost:3000/index.html', { waitUntil: 'domcontentloaded' });
  await homePage.waitForTimeout(1000);

  const gamesSection = homePage.locator('#playAndEarnSection');
  await gamesSection.scrollIntoViewIfNeeded();
  await homePage.waitForTimeout(500);
  await gamesSection.screenshot({ path: path.join(__dirname, 'games_home_mobile.png') });

  // Desktop view of games section
  const desktopPage = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await desktopPage.addInitScript(() => {
    localStorage.setItem('vanvi_cookie_consent', 'all');
  });
  await desktopPage.goto('http://localhost:3000/index.html', { waitUntil: 'domcontentloaded' });
  await desktopPage.waitForTimeout(1000);

  const desktopGames = desktopPage.locator('#playAndEarnSection');
  await desktopGames.scrollIntoViewIfNeeded();
  await desktopPage.waitForTimeout(500);
  await desktopGames.screenshot({ path: path.join(__dirname, 'games_home_desktop.png') });

  await browser.close();
  console.log('All verification captures completed successfully!');
}

main().catch(err => {
  console.error('Error during test:', err);
  process.exit(1);
});
