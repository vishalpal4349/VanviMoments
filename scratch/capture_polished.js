const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await page.goto('http://localhost:3000/plans.html');
  await page.evaluate(() => {
    localStorage.setItem('vanvi_cookie_consent', 'accepted');
    const b = document.getElementById('vanviCookieBanner');
    if (b) b.remove();
  });
  await page.reload();
  await page.waitForTimeout(400);

  const convEl = await page.$('#converterSection');
  if (convEl) {
    await convEl.screenshot({ path: 'C:/Users/RISHU KUMARI/.gemini/antigravity-ide/brain/853592c6-08b7-485a-b854-fae429885680/converter_mobile.png' });
  }

  const hubEl = await page.$('#stageCreditsPasses');
  if (hubEl) {
    await hubEl.screenshot({ path: 'C:/Users/RISHU KUMARI/.gemini/antigravity-ide/brain/853592c6-08b7-485a-b854-fae429885680/passes_cards_mobile.png' });
  }

  await browser.close();
  console.log('Screenshots captured successfully!');
})();
