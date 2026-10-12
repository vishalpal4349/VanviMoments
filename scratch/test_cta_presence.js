const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/templates/birthday-wish-01/index.html');
  await page.waitForTimeout(2000);
  
  const cta = await page.$('#vanviUniversalEndCta');
  console.log('vanviUniversalEndCta exists:', !!cta);
  if (cta) {
    const text = await cta.innerText();
    console.log('CTA text:\n', text);
  }
  
  const allElements = await page.evaluate(() => {
    return Array.from(document.body.children).map(c => ({
      tag: c.tagName,
      id: c.id,
      class: c.className,
      display: window.getComputedStyle(c).display,
      visibility: window.getComputedStyle(c).visibility
    }));
  });
  console.log('Body children:', JSON.stringify(allElements, null, 2));

  // Take screenshot of bottom of the page
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'scratch/bday_01_bottom.png' });

  await browser.close();
})().catch(console.error);
