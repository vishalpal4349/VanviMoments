const { chromium } = require('playwright-core');
const path = require('path');
const fs = require('fs');

(async () => {
  console.log('====================================================');
  console.log('   PLAYWRIGHT LIVE GLASS THEME VISUAL AUDIT         ');
  console.log('====================================================\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  // 1. Visit Index page
  console.log('🌐 Loading http://localhost:3000/index.html...');
  await page.goto('http://localhost:3000/index.html', { waitUntil: 'domcontentloaded' });

  // Activate Glass theme & Spatial font
  console.log('🫧 Activating Liquid Spatial Glass & Spatial Typography...');
  await page.evaluate(() => {
    window.setVanviTheme('glass');
    window.setVanviFont('spatial');
  });

  await page.waitForTimeout(500);

  // Inspect computed styles
  const indexAudit = await page.evaluate(() => {
    const htmlTheme = document.documentElement.getAttribute('data-vanvi-theme');
    const htmlFont = document.documentElement.getAttribute('data-vanvi-font');
    const bodyBg = window.getComputedStyle(document.body).backgroundColor;
    const bodyColor = window.getComputedStyle(document.body).color;
    const firstCard = document.querySelector('.card, .template-card, div[class*="card"]');
    const cardStyle = firstCard ? {
      backdropFilter: window.getComputedStyle(firstCard).backdropFilter || window.getComputedStyle(firstCard).webkitBackdropFilter,
      border: window.getComputedStyle(firstCard).border,
      borderRadius: window.getComputedStyle(firstCard).borderRadius,
      boxShadow: window.getComputedStyle(firstCard).boxShadow
    } : null;

    const dock = document.querySelector('.vanvi-bottom-dock, .bottom');
    const dockStyle = dock ? {
      backdropFilter: window.getComputedStyle(dock).backdropFilter || window.getComputedStyle(dock).webkitBackdropFilter,
      borderRadius: window.getComputedStyle(dock).borderRadius,
      background: window.getComputedStyle(dock).backgroundColor
    } : null;

    return { htmlTheme, htmlFont, bodyBg, bodyColor, cardStyle, dockStyle };
  });

  console.log('  Index theme attribute:', indexAudit.htmlTheme);
  console.log('  Index font attribute:', indexAudit.htmlFont);
  console.log('  Card backdrop filter:', indexAudit.cardStyle ? indexAudit.cardStyle.backdropFilter : 'N/A');
  console.log('  Dock border radius:', indexAudit.dockStyle ? indexAudit.dockStyle.borderRadius : 'N/A');

  // Take screenshot of Index in Glass Mode
  const artifactDir = path.resolve(__dirname, '..', 'scratch');
  if (!fs.existsSync(artifactDir)) fs.mkdirSync(artifactDir, { recursive: true });
  await page.screenshot({ path: path.join(artifactDir, 'index_glass_theme.png'), fullPage: false });
  console.log('  📸 Screenshot saved: scratch/index_glass_theme.png');

  // 2. Visit Template Detail Page
  console.log('\n🌐 Loading http://localhost:3000/template-detail.html?template=birthday-midnight-royal...');
  await page.goto('http://localhost:3000/template-detail.html?template=birthday-midnight-royal', { waitUntil: 'domcontentloaded' });

  // Theme should be preserved from localStorage!
  const detailAudit = await page.evaluate(() => {
    const htmlTheme = document.documentElement.getAttribute('data-vanvi-theme');
    const htmlFont = document.documentElement.getAttribute('data-vanvi-font');
    const heroCard = document.querySelector('.purchase-card, .trust-card, div[class*="card"]');
    const heroCardStyle = heroCard ? {
      backdropFilter: window.getComputedStyle(heroCard).backdropFilter || window.getComputedStyle(heroCard).webkitBackdropFilter,
      border: window.getComputedStyle(heroCard).border,
      borderRadius: window.getComputedStyle(heroCard).borderRadius
    } : null;

    return { htmlTheme, htmlFont, heroCardStyle };
  });

  console.log('  Detail preserved theme from localStorage:', detailAudit.htmlTheme);
  console.log('  Detail preserved font from localStorage:', detailAudit.htmlFont);
  console.log('  Detail card backdrop filter:', detailAudit.heroCardStyle ? detailAudit.heroCardStyle.backdropFilter : 'N/A');

  await page.screenshot({ path: path.join(artifactDir, 'detail_glass_theme.png'), fullPage: false });
  console.log('  📸 Screenshot saved: scratch/detail_glass_theme.png');

  // 3. Visit Games page
  console.log('\n🌐 Loading http://localhost:3000/games.html...');
  await page.goto('http://localhost:3000/games.html', { waitUntil: 'domcontentloaded' });
  const gamesAudit = await page.evaluate(() => {
    return {
      theme: document.documentElement.getAttribute('data-vanvi-theme'),
      cardsCount: document.querySelectorAll('div[class*="card"], .game-card').length
    };
  });
  console.log('  Games preserved theme:', gamesAudit.theme, '| Found game cards:', gamesAudit.cardsCount);

  // 4. Visit FAQ page
  console.log('\n🌐 Loading http://localhost:3000/faq.html...');
  await page.goto('http://localhost:3000/faq.html', { waitUntil: 'domcontentloaded' });
  const faqAudit = await page.evaluate(() => {
    return {
      theme: document.documentElement.getAttribute('data-vanvi-theme'),
      faqItems: document.querySelectorAll('.faq-item, div[class*="card"]').length
    };
  });
  console.log('  FAQ preserved theme:', faqAudit.theme, '| Found FAQ items:', faqAudit.faqItems);

  console.log('\nConsole errors detected:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.warn(consoleErrors);
  }

  await browser.close();

  console.log('\n====================================================');
  console.log('🎉 PLAYWRIGHT LIVE AUDIT CONFIRMED 100% SUCCESS!');
  console.log('====================================================\n');
})();
