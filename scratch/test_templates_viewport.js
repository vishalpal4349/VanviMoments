// scratch/test_templates_viewport.js
const { chromium } = require('playwright-core');
const fs = require('fs');

const viewports = [
  { width: 320, height: 600, name: '320px (iPhone SE compact)' },
  { width: 360, height: 740, name: '360px (Android compact)' },
  { width: 375, height: 667, name: '375px (iPhone SE/6/7/8)' },
  { width: 390, height: 844, name: '390px (iPhone 12/13/14)' },
  { width: 414, height: 896, name: '414px (iPhone Plus/Max)' },
  { width: 768, height: 1024, name: '768px (iPad/Tablet)' },
  { width: 1024, height: 768, name: '1024px (Small Laptop)' },
  { width: 1280, height: 800, name: '1280px (MacBook Desktop)' },
  { width: 1440, height: 900, name: '1440px (Wide Desktop)' }
];

async function runAudit() {
  console.log('Launching browser audit...');
  let browser;
  try {
    // Try launching edge or chrome on windows
    browser = await chromium.launch({
      channel: 'msedge',
      headless: true
    });
  } catch (e) {
    try {
      browser = await chromium.launch({
        channel: 'chrome',
        headless: true
      });
    } catch (e2) {
      console.log('Could not launch Chrome/Edge directly:', e2.message);
      return;
    }
  }

  const results = [];

  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height }
    });
    const page = await context.newPage();

    await page.goto('http://localhost:3000/templates.html', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);

    const audit = await page.evaluate((vpName) => {
      const docW = document.documentElement.scrollWidth;
      const winW = window.innerWidth;
      const hasHScroll = docW > winW;

      // Check search + filter alignment
      const searchBox = document.getElementById('searchBoxContainer');
      const filterBtn = document.getElementById('btnSmartFilterTrigger');
      const searchBoxTop = searchBox ? searchBox.getBoundingClientRect().top : 0;
      const filterBtnTop = filterBtn ? filterBtn.getBoundingClientRect().top : 0;
      const searchFilterSameRow = Math.abs(searchBoxTop - filterBtnTop) <= 4;

      // Check category row
      const catStrip = document.getElementById('quickOccasionsStrip');
      const catHeight = catStrip ? catStrip.offsetHeight : 0;

      // Check recommended sort + grid/list toggle row
      const sortBox = document.querySelector('.sort-select-box');
      const viewToggle = document.getElementById('viewModeToggle');
      const sortTop = sortBox ? sortBox.getBoundingClientRect().top : 0;
      const viewTop = viewToggle ? viewToggle.getBoundingClientRect().top : 0;
      const sortViewSameRow = Math.abs(sortTop - viewTop) <= 4;

      // Check cards above the fold on mobile
      const firstCard = document.querySelector('.vanvi-card');
      const firstCardTop = firstCard ? firstCard.getBoundingClientRect().top : 9999;
      const isCardAboveFold = firstCardTop < window.innerHeight;

      // Check card action buttons
      const actionBtns = Array.from(document.querySelectorAll('.vanvi-card .card-actions-grid a'));
      const buttonsInsideCard = actionBtns.slice(0, 4).every(b => {
        const card = b.closest('.vanvi-card');
        if (!card) return true;
        const bRect = b.getBoundingClientRect();
        const cRect = card.getBoundingClientRect();
        return bRect.right <= cRect.right + 2 && bRect.left >= cRect.left - 2;
      });

      return {
        viewport: vpName,
        winW,
        docW,
        hasHScroll,
        searchFilterSameRow,
        catHeight,
        sortViewSameRow,
        firstCardTop: Math.round(firstCardTop),
        isCardAboveFold,
        buttonsInsideCard
      };
    }, vp.name);

    results.push(audit);
    await context.close();
  }

  // Functional test on 390px
  const context390 = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page390 = await context390.newPage();
  await page390.goto('http://localhost:3000/templates.html');

  // Test 1: Search
  await page390.fill('#searchInput', 'birthday');
  await page390.waitForTimeout(300);
  const searchResultsCount = await page390.evaluate(() => {
    const grid = document.getElementById('filterGrid');
    return grid ? grid.querySelectorAll('.vanvi-card').length : 0;
  });

  // Test 2: Category filter
  await page390.click('#quick-cat-love');
  await page390.waitForTimeout(300);
  const loveResultsCount = await page390.evaluate(() => {
    const grid = document.getElementById('filterGrid');
    return grid ? grid.querySelectorAll('.vanvi-card').length : 0;
  });

  // Test 3: Grid vs Magazine Toggle
  await page390.click('#btnViewMag');
  await page390.waitForTimeout(200);
  const isMagViewActive = await page390.evaluate(() => {
    const btnMag = document.getElementById('btnViewMag');
    const filterGrid = document.getElementById('filterGrid');
    return btnMag.classList.contains('active') && filterGrid.classList.contains('is-magazine-view');
  });

  await page390.click('#btnViewGrid');
  await page390.waitForTimeout(200);
  const isGridViewRestored = await page390.evaluate(() => {
    const btnGrid = document.getElementById('btnViewGrid');
    const filterGrid = document.getElementById('filterGrid');
    return btnGrid.classList.contains('active') && !filterGrid.classList.contains('is-magazine-view');
  });

  // Test 4: Filter drawer
  await page390.click('#btnSmartFilterTrigger');
  await page390.waitForTimeout(200);
  const isDrawerOpen = await page390.evaluate(() => {
    const drawer = document.getElementById('filterDrawer');
    return drawer && window.getComputedStyle(drawer).display !== 'none';
  });

  await page390.click('.drawer-close-btn');
  await page390.waitForTimeout(200);
  const isDrawerClosed = await page390.evaluate(() => {
    const drawer = document.getElementById('filterDrawer');
    return drawer && window.getComputedStyle(drawer).display === 'none';
  });

  await browser.close();

  console.log('\n=== VIEWPORT RESPONSIVE AUDIT RESULTS ===');
  console.table(results);

  console.log('\n=== FUNCTIONAL VERIFICATION RESULTS ===');
  console.log('Search "birthday" results count:', searchResultsCount, searchResultsCount > 0 ? '✅ PASS' : '❌ FAIL');
  console.log('Category "Love" results count:', loveResultsCount, loveResultsCount > 0 ? '✅ PASS' : '❌ FAIL');
  console.log('Magazine / List mode toggle:', isMagViewActive ? '✅ PASS' : '❌ FAIL');
  console.log('Grid mode restore toggle:', isGridViewRestored ? '✅ PASS' : '❌ FAIL');
  console.log('Filter drawer open on tap:', isDrawerOpen ? '✅ PASS' : '❌ FAIL');
  console.log('Filter drawer close on tap:', isDrawerClosed ? '✅ PASS' : '❌ FAIL');
}

runAudit();
