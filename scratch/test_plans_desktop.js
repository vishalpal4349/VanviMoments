const { chromium } = require('playwright-core');

async function testPlansDesktop() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });

  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto('http://localhost:3000/plans.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(600);

  // Check desktop metrics
  const desktopMetrics = await page.evaluate(() => {
    const passesTrack = document.getElementById('passesTrack');
    const coinsTrack = document.getElementById('coinsTrack');
    const subsTrack = document.getElementById('subsTrack');
    const passesComputed = window.getComputedStyle(passesTrack);
    const subsComputed = window.getComputedStyle(subsTrack);

    const passesCards = Array.from(passesTrack.querySelectorAll('.compact-slider-card')).map(c => {
      const r = c.getBoundingClientRect();
      return { width: Math.round(r.width), height: Math.round(r.height), top: Math.round(r.top) };
    });

    const subsCards = Array.from(subsTrack.querySelectorAll('.compact-slider-card')).map(c => {
      const r = c.getBoundingClientRect();
      return { width: Math.round(r.width), height: Math.round(r.height), top: Math.round(r.top) };
    });

    return {
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      passesDisplay: passesComputed.display,
      subsDisplay: subsComputed.display,
      passesGridCols: passesComputed.gridTemplateColumns,
      subsGridCols: subsComputed.gridTemplateColumns,
      passesCards,
      subsCards
    };
  });

  console.log('\n=== Desktop (1280px) Metrics ===');
  console.log('Document scrollWidth vs innerWidth:', desktopMetrics.scrollWidth, desktopMetrics.innerWidth);
  console.log('Passes Track Display:', desktopMetrics.passesDisplay);
  console.log('Passes Cards:', desktopMetrics.passesCards);
  console.log('Subs Track Display:', desktopMetrics.subsDisplay);
  console.log('Subs Cards count:', desktopMetrics.subsCards.length);

  // Take screenshot of Desktop Hero & Converter
  await page.screenshot({ path: 'C:/Users/RISHU KUMARI/.gemini/antigravity-ide/brain/853592c6-08b7-485a-b854-fae429885680/plans_desktop_hero_converter.png', fullPage: false });

  // Scroll to passes track & screenshot
  await page.evaluate(() => {
    document.getElementById('stageCreditsPasses').scrollIntoView();
  });
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'C:/Users/RISHU KUMARI/.gemini/antigravity-ide/brain/853592c6-08b7-485a-b854-fae429885680/plans_desktop_cards_grid.png', fullPage: false });

  // Take mobile screenshots
  const mobilePage = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await mobilePage.goto('http://localhost:3000/plans.html', { waitUntil: 'domcontentloaded' });
  await mobilePage.waitForTimeout(600);
  await mobilePage.screenshot({ path: 'C:/Users/RISHU KUMARI/.gemini/antigravity-ide/brain/853592c6-08b7-485a-b854-fae429885680/plans_mobile_hero_compact.png', fullPage: false });

  await mobilePage.evaluate(() => {
    document.getElementById('stageCreditsPasses').scrollIntoView();
  });
  await mobilePage.waitForTimeout(400);
  await mobilePage.screenshot({ path: 'C:/Users/RISHU KUMARI/.gemini/antigravity-ide/brain/853592c6-08b7-485a-b854-fae429885680/plans_mobile_cards_compact.png', fullPage: false });

  await browser.close();
  console.log('🎉 Desktop & Mobile validation screenshots captured successfully!');
}

testPlansDesktop().catch(console.error);
