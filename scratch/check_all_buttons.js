const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true
  });

  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2
  });

  await page.goto('http://localhost:3000/index.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 1. Header & Hero
  await page.screenshot({ path: 'scratch/btn_01_hero.png' });

  // 2. What can we make
  const whatSec = await page.$('.what-make-snap-section');
  if (whatSec) {
    await whatSec.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'scratch/btn_02_whatcanwemake.png' });
  }

  // 3. Free template slider
  const freeSec = await page.$('#freeTemplateSlider');
  if (freeSec) {
    await freeSec.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'scratch/btn_03_templates.png' });
  }

  // 4. AI Dedication Section
  const aiSec = await page.$('.ai');
  if (aiSec) {
    await aiSec.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'scratch/btn_04_ai.png' });
  }

  // 5. Gifts & FAQ
  const faqSec = await page.$('.faq-btn');
  if (faqSec) {
    await faqSec.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'scratch/btn_05_faq_gifts.png' });
  }

  await browser.close();
  console.log('Button screenshots captured!');
})();
