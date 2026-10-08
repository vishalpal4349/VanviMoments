const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

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

(async () => {
  console.log('🚀 Starting templates.html visual and DOM verification...');
  const browser = await chromium.launch({ executablePath, headless: true });

  // 1. Desktop Test (1200px)
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  const fileUrl = 'file:///' + path.resolve(__dirname, '..', 'templates.html').replace(/\\/g, '/');
  await page.goto(fileUrl, { waitUntil: 'load' });
  await page.waitForTimeout(600);

  // dismiss cookie banner
  await page.evaluate(() => {
    localStorage.setItem('vanvi_cookie_consent', 'accepted');
    const b = document.getElementById('cookieConsentBanner');
    if (b) b.remove();
  });
  await page.waitForTimeout(300);

  // Measure first 5 cards on desktop
  const desktopCards = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.vanvi-card')).slice(0, 5);
    return cards.map(c => {
      const rect = c.getBoundingClientRect();
      const art = c.querySelector('.card-art-box')?.getBoundingClientRect();
      const body = c.querySelector('.card-body')?.getBoundingClientRect();
      const title = c.querySelector('.card-title')?.innerText;
      const priceCluster = c.querySelector('.card-price-cluster');
      const priceNow = c.querySelector('.price-now')?.innerText;
      const priceOrig = c.querySelector('.price-orig')?.innerText;
      const discount = c.querySelector('.discount-pill')?.innerText;
      const btnMake = c.querySelector('.btn-make-yours');
      const btnText = btnMake?.innerText?.trim();
      const spans = Array.from(btnMake?.querySelectorAll('span') || []).map(s => s.innerText);

      // Check for nested shadow bubbles on sub-elements
      const headerMeta = c.querySelector('.card-header-meta');
      const metaRow = c.querySelector('.card-meta-row');
      const headerBoxShadow = headerMeta ? window.getComputedStyle(headerMeta).boxShadow : 'none';
      const metaRowBoxShadow = metaRow ? window.getComputedStyle(metaRow).boxShadow : 'none';

      return {
        title,
        width: rect.width,
        height: rect.height,
        artHeight: art ? art.height : 0,
        bodyHeight: body ? body.height : 0,
        priceNow,
        priceOrig,
        discount,
        btnText,
        spans,
        headerBoxShadow,
        metaRowBoxShadow
      };
    });
  });

  console.log('\n--- DESKTOP VERIFICATION (1200px) ---');
  desktopCards.forEach((c, idx) => {
    console.log(`Card #${idx + 1} [${c.title}]: Height = ${c.height.toFixed(1)}px (Art: ${c.artHeight.toFixed(1)}px, Body: ${c.bodyHeight.toFixed(1)}px), Button = "${c.btnText}", Price = ${c.priceNow}`);
    
    // Assert no double "Create"
    assert(!c.btnText.includes('Create Moment ✦ Create'), `Card ${c.title} must NOT have double Create text! Got: ${c.btnText}`);
    assert(!c.btnText.includes('Create Create'), `Card ${c.title} must NOT have duplicate Create! Got: ${c.btnText}`);
    assert(c.btnText === 'Create ✦' || c.btnText === 'Create', `Button must be concise Create ✦, got: ${c.btnText}`);

    // Assert compact height
    assert(c.height <= 340, `Card height must be sleek & compact (<= 340px), got: ${c.height}px`);

    // Assert no nested shadow bubble on card internal parts
    assert(c.headerBoxShadow === 'none', `Header meta must not have bloated box-shadow! Got: ${c.headerBoxShadow}`);
    assert(c.metaRowBoxShadow === 'none', `Meta row must not have bloated box-shadow! Got: ${c.metaRowBoxShadow}`);
  });

  // Capture desktop screenshots
  await page.screenshot({ path: path.join(__dirname, 'desktop_templates_final.png'), clip: { x: 30, y: 300, width: 1140, height: 480 } });
  const singleCardDesktop = await page.$('.vanvi-card');
  if (singleCardDesktop) {
    await singleCardDesktop.screenshot({ path: path.join(__dirname, 'single_card_desktop_final.png') });
  }

  // 2. Mobile Test (375px)
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(400);

  const mobileCardData = await page.evaluate(() => {
    const c = document.querySelector('.vanvi-card');
    if (!c) return null;
    const rect = c.getBoundingClientRect();
    const btnMake = c.querySelector('.btn-make-yours');
    const priceCluster = c.querySelector('.card-price-cluster')?.getBoundingClientRect();
    const statusSubtle = c.querySelector('.card-status-subtle')?.getBoundingClientRect();
    return {
      width: rect.width,
      height: rect.height,
      btnText: btnMake?.innerText?.trim(),
      priceClusterWidth: priceCluster?.width,
      statusSubtleWidth: statusSubtle?.width
    };
  });

  console.log('\n--- MOBILE VERIFICATION (375px) ---');
  console.log('Mobile Card:', mobileCardData);
  assert(mobileCardData.btnText === 'Create ✦' || mobileCardData.btnText === 'Create', `Mobile button text clean`);
  assert(mobileCardData.height <= 340, `Mobile card height compact (<= 340px)`);

  await page.screenshot({ path: path.join(__dirname, 'mobile_templates_final.png'), clip: { x: 0, y: 150, width: 375, height: 550 } });
  const singleCardMobile = await page.$('.vanvi-card');
  if (singleCardMobile) {
    await singleCardMobile.screenshot({ path: path.join(__dirname, 'single_card_mobile_final.png') });
  }

  // 3. Test Filter Mode Grid
  await page.evaluate(() => {
    const input = document.getElementById('searchInput');
    if (input) {
      input.value = 'birthday';
      input.dispatchEvent(new Event('input'));
    }
  });
  await page.waitForTimeout(400);

  const gridCount = await page.evaluate(() => {
    const grid = document.getElementById('filterGrid');
    return grid ? grid.querySelectorAll('.vanvi-card').length : 0;
  });
  console.log('\n--- FILTER GRID VERIFICATION ---');
  console.log(`Search 'birthday' yielded ${gridCount} cards in filterGrid`);
  assert(gridCount > 0, 'Filter search must return cards in filterGrid');

  await browser.close();
  console.log('\n🎉 ALL TESTS PASSED! Templates section is compact, sleek, and duplicate Create bug is completely fixed!');
})();
