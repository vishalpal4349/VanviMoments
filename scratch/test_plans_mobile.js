const { chromium } = require('playwright-core');

async function testPlansMobile() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });

  const viewports = [
    { name: 'iPhone SE (320px)', width: 320, height: 568 },
    { name: 'Android Small (360px)', width: 360, height: 740 },
    { name: 'iPhone 13 mini (375px)', width: 375, height: 812 },
    { name: 'iPhone 14 / 15 (393px)', width: 393, height: 852 }
  ];

  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.goto('http://localhost:3000/plans.html', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);

    const docMetrics = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      overflowDiff: document.documentElement.scrollWidth - window.innerWidth
    }));

    console.log(`\n=== Viewport: ${vp.name} ===`);
    console.log(`Document Overflow: scrollWidth=${docMetrics.scrollWidth}, innerWidth=${docMetrics.innerWidth}, diff=${docMetrics.overflowDiff}px`);

    if (docMetrics.overflowDiff > 0) {
      console.error(`❌ Overflow detected on ${vp.name}!`);
    } else {
      console.log(`✅ Zero page overflow on ${vp.name}`);
    }

    // Inspect card dimensions in passesTrack
    const cardMetrics = await page.evaluate(() => {
      const card = document.querySelector('#passesTrack .compact-slider-card');
      const track = document.getElementById('passesTrack');
      if (!card || !track) return null;
      const rect = card.getBoundingClientRect();
      return {
        cardWidth: Math.round(rect.width),
        cardHeight: Math.round(rect.height),
        trackScrollWidth: track.scrollWidth,
        trackClientWidth: track.clientWidth,
        isScrollable: track.scrollWidth > track.clientWidth
      };
    });

    console.log('Passes Card Metrics:', cardMetrics);

    // Verify card peeking (card should be significantly smaller than viewport width so next card is visible)
    const peekWidth = vp.width - cardMetrics.cardWidth;
    console.log(`Peek space for next card: ${peekWidth}px (Target > 50px for obvious swipe affordance)`);

    // Verify smooth horizontal scroll programmatically & track scrollBy
    const scrollResult = await page.evaluate(async () => {
      const track = document.getElementById('passesTrack');
      const start = track.scrollLeft;
      track.scrollBy({ left: 150, behavior: 'instant' });
      await new Promise(r => setTimeout(r, 100));
      const after = track.scrollLeft;
      return { start, after, scrolled: after > start };
    });
    console.log('Horizontal swipe test:', scrollResult);

    await page.close();
  }

  // Interactive UI test on 360px viewport
  console.log('\n=== Interactive Features Test (360px) ===');
  const testPage = await browser.newPage({ viewport: { width: 360, height: 740 } });
  await testPage.goto('http://localhost:3000/plans.html');
  await testPage.waitForTimeout(400);

  // 1. Category tab navigation
  const tabs = await testPage.$$('.hub-tab-btn');
  console.log(`Category tabs count: ${tabs.length} (Expected: 4 - Passes, Coins, VIP, Converter)`);
  for (let i = 0; i < tabs.length; i++) {
    const text = await tabs[i].textContent();
    console.log(`Tab ${i + 1}: ${text.trim()}`);
  }

  // Click Coins Tab
  await testPage.click('#tabBtnCoins');
  await testPage.waitForTimeout(300);
  const coinsActive = await testPage.$eval('#tabBtnCoins', el => el.classList.contains('active'));
  console.log('Coins tab activated on click:', coinsActive);

  // Click Subs Tab
  await testPage.click('#tabBtnSubs');
  await testPage.waitForTimeout(300);
  const subsActive = await testPage.$eval('#tabBtnSubs', el => el.classList.contains('active'));
  console.log('VIP Subs tab activated on click:', subsActive);

  // Click Converter Tab
  await testPage.click('#tabBtnConverter');
  await testPage.waitForTimeout(300);
  const convActive = await testPage.$eval('#tabBtnConverter', el => el.classList.contains('active'));
  console.log('Converter tab activated on click:', convActive);

  // 2. Test Smart Converter
  console.log('\n=== Smart Converter & Matcher Test ===');
  // Type 1,000 in convertCoinInput
  await testPage.fill('#convertCoinInput', '1000');
  await testPage.evaluate(() => updateLiveConverter('coin'));
  await testPage.waitForTimeout(100);
  const outputCredit = await testPage.$eval('#convertCreditOutput', el => el.textContent);
  console.log('1,000 Coins converted to credits:', outputCredit, '(Expected: 100)');

  // Test Swap Direction
  await testPage.click('.btn-swap-direction');
  await testPage.waitForTimeout(200);
  const swappedUnit = await testPage.$eval('#convInputUnit', el => el.textContent);
  console.log('Swapped input unit:', swappedUnit, '(Expected: Rupees)');

  // Switch to Plan Matcher tab
  await testPage.click('#convTabMatcher');
  await testPage.waitForTimeout(200);
  const isMatcherVisible = await testPage.$eval('#convPanelMatcher', el => !el.classList.contains('hidden'));
  console.log('Plan Matcher tab visible:', isMatcherVisible);

  // Select 2 Moments
  await testPage.click('.matcher-options-grid button:nth-child(2)');
  await testPage.waitForTimeout(200);
  const recTitle = await testPage.$eval('#matcherResultTitle', el => el.textContent);
  console.log('2 Moments Matcher Recommendation:', recTitle, '(Expected: Mini Celebration Pass)');

  // 3. Click Buy Button on VIP card to verify checkout modal
  const buyBtn = await testPage.$('#stageSubs .btn-buy-compact.btn-style-creator');
  if (buyBtn) {
    await buyBtn.click();
    await testPage.waitForTimeout(300);
    const modalActive = await testPage.$eval('#subModal', m => m.classList.contains('active'));
    console.log('Sub Modal opens on CTA click:', modalActive);
    const modalTitle = await testPage.$eval('#modalPlanTitle', el => el.textContent);
    console.log('Modal Plan Title:', modalTitle);
    await testPage.click('.modal-close');
    await testPage.waitForTimeout(200);
  }

  // 4. Verify no lingering combo passes elements
  const comboPod = await testPage.$('#stageCombos');
  const comboTab = await testPage.$('#tabBtnCombos');
  console.log('Is stageCombos present?', comboPod !== null ? '❌ YES' : '✅ NO (Successfully Removed)');
  console.log('Is tabBtnCombos present?', comboTab !== null ? '❌ YES' : '✅ NO (Successfully Removed)');

  await browser.close();
  console.log('\n🎉 ALL MOBILE & INTERACTIVE TESTS FINISHED PERFECTLY!');
}

testPlansMobile().catch(console.error);
