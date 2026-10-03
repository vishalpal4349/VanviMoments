const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });

  // Desktop view
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto('http://localhost:3000/ai-matcher.html', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    localStorage.setItem('vanvi_cookie_consent', 'all');
    const banner = document.getElementById('cookieBanner');
    if (banner) banner.style.display = 'none';
  });

  // Click calculate button
  await page.click('#btnRecalculate');
  await page.waitForTimeout(600);

  // Scroll to suggestSection
  await page.evaluate(() => {
    const el = document.getElementById('suggestSection');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page.waitForTimeout(400);

  await page.screenshot({ path: 'scratch/aimatcher_desktop_results_full.png', fullPage: false });

  // Mobile view
  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobilePage.goto('http://localhost:3000/ai-matcher.html', { waitUntil: 'networkidle' });
  await mobilePage.evaluate(() => {
    localStorage.setItem('vanvi_cookie_consent', 'all');
    const banner = document.getElementById('cookieBanner');
    if (banner) banner.style.display = 'none';
  });
  await mobilePage.click('#btnRecalculate');
  await mobilePage.waitForTimeout(600);

  await mobilePage.evaluate(() => {
    const el = document.getElementById('suggestSection');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await mobilePage.waitForTimeout(400);

  await mobilePage.screenshot({ path: 'scratch/aimatcher_mobile_cards_full.png', fullPage: false });

  await browser.close();
  console.log('Results captured successfully with btnRecalculate');
})();
