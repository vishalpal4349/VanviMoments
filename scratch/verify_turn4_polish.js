const { chromium } = require('playwright-core');
const path = require('path');
const fs = require('fs');

(async () => {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const executablePath = fs.existsSync(edgePath) ? edgePath : undefined;

  const browser = await chromium.launch({
    headless: true,
    executablePath,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  console.log('Testing login.html...');
  await page.goto('http://localhost:3000/login.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'scratch/test_login_desktop.png' });

  // Test password focus reaction
  const pwd = await page.$('#loginPassword');
  if (pwd) {
    await pwd.focus();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'scratch/test_login_pwd_focused.png' });
  }

  console.log('Testing signup.html...');
  await page.goto('http://localhost:3000/signup.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'scratch/test_signup_desktop.png' });

  console.log('Testing builder.html...');
  await page.goto('http://localhost:3000/builder.html?template=birthday-3d-candle', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'scratch/test_builder_with_badge.png' });

  console.log('Testing category-premium.html...');
  await page.goto('http://localhost:3000/category-premium.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'scratch/test_premium_polished.png' });

  // Mobile test
  console.log('Testing mobile login & premium...');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:3000/login.html', { waitUntil: 'domcontentloaded' });
  await mobilePage.waitForTimeout(800);
  await mobilePage.screenshot({ path: 'scratch/test_login_mobile.png' });

  await mobilePage.goto('http://localhost:3000/category-premium.html', { waitUntil: 'domcontentloaded' });
  await mobilePage.waitForTimeout(800);
  await mobilePage.screenshot({ path: 'scratch/test_premium_mobile.png' });

  await browser.close();
  console.log('Turn 4 verification completed successfully!');
})();
