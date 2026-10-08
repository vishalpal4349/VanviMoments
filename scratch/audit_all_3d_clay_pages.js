const { chromium } = require('playwright-core');
const fs = require('fs');

(async () => {
  console.log('====================================================');
  console.log('   FULL PLATFORM 3D CLAYMORPHIC VISUAL AUDIT        ');
  console.log('====================================================\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  // Test list covering all core pages
  const testPages = [
    { name: 'templates', url: 'templates.html' },
    { name: 'template-detail', url: 'template-detail.html?template=birthday-midnight-royal' },
    { name: 'category-birthday', url: 'category-birthday.html' },
    { name: 'category-anniversary', url: 'category-anniversary.html' },
    { name: 'category-love', url: 'category-love.html' },
    { name: 'category-free', url: 'category-free.html' },
    { name: 'category-premium', url: 'category-premium.html' },
    { name: 'builder', url: 'builder.html' },
    { name: 'moment', url: 'moment.html' },
    { name: 'share', url: 'share.html' },
    { name: 'plans', url: 'plans.html' },
    { name: 'products', url: 'products.html' },
    { name: 'games', url: 'games.html' },
    { name: 'dashboard', url: 'dashboard.html' },
    { name: 'rewards', url: 'rewards.html' },
    { name: 'faq', url: 'faq.html' },
    { name: 'about', url: 'about.html' },
    { name: 'checkout', url: 'checkout.html' }
  ];

  // 1. Day Blossom (Clay) Audit
  console.log('--- AUDITING DAY BLOSSOM (3D CLAY) ---');
  for (const item of testPages) {
    try {
      await page.goto('http://localhost:3000/' + item.url, { waitUntil: 'domcontentloaded' });
      // Close cookie banner if present so content is clean
      await page.evaluate(() => {
        localStorage.setItem('vanvi_aesthetic_theme', 'clay');
        localStorage.setItem('vanvi_font_pref', 'royal');
        document.documentElement.setAttribute('data-vanvi-theme', 'clay');
        const cookieBanner = document.getElementById('cookieConsentBanner') || document.querySelector('.cookie-banner, .cookie-dialog');
        if (cookieBanner) cookieBanner.style.display = 'none';
      });
      await page.waitForTimeout(400);

      const metrics = await page.evaluate(() => {
        const cards = document.querySelectorAll('.vanvi-card, .template-card, .plan-card, .builder-select-card, .faq-card, .game-card, .card');
        const btns = document.querySelectorAll('.btn-primary, .btn-create, .btn-make-yours, button[class*="primary"]');
        let cardRadius = cards.length > 0 ? window.getComputedStyle(cards[0]).borderRadius : 'N/A';
        let cardShadow = cards.length > 0 ? window.getComputedStyle(cards[0]).boxShadow : 'N/A';
        return {
          cardCount: cards.length,
          cardRadius,
          cardShadow: cardShadow.length > 30 ? cardShadow.substring(0, 30) + '...' : cardShadow,
          btnCount: btns.length
        };
      });

      const scrPath = `scratch/clay_v2_${item.name}.png`;
      await page.screenshot({ path: scrPath });
      console.log(`✓ ${item.name.padEnd(22)} | Cards: ${String(metrics.cardCount).padEnd(3)} | Radius: ${metrics.cardRadius.padEnd(10)} | ${scrPath}`);
    } catch(err) {
      console.error(`✗ ${item.name} error:`, err.message);
    }
  }

  // 2. Emerald Night Theme Check
  console.log('\n--- AUDITING EMERALD NIGHT THEME ---');
  await page.goto('http://localhost:3000/templates.html', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.setItem('vanvi_aesthetic_theme', 'emerald');
    document.documentElement.setAttribute('data-vanvi-theme', 'emerald');
    const cookieBanner = document.getElementById('cookieConsentBanner');
    if (cookieBanner) cookieBanner.style.display = 'none';
  });
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'scratch/clay_v2_emerald_templates.png' });
  console.log('✓ Emerald Night templates snapshot saved: scratch/clay_v2_emerald_templates.png');

  // 3. Spatial Glass Theme Check
  console.log('\n--- AUDITING SPATIAL GLASS THEME ---');
  await page.goto('http://localhost:3000/templates.html', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.setItem('vanvi_aesthetic_theme', 'glass');
    document.documentElement.setAttribute('data-vanvi-theme', 'glass');
    const cookieBanner = document.getElementById('cookieConsentBanner');
    if (cookieBanner) cookieBanner.style.display = 'none';
  });
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'scratch/clay_v2_glass_templates.png' });
  console.log('✓ Spatial Glass templates snapshot saved: scratch/clay_v2_glass_templates.png');

  await browser.close();
  console.log('\n====================================================');
  console.log('🎉 ALL AUDITS AND SCREENSHOTS GENERATED SUCCESSFULLY!');
  console.log('====================================================\n');
})();
