const { chromium } = require('playwright-core');
const path = require('path');
const fs = require('fs');

(async () => {
  console.log('====================================================');
  console.log('   PLAYWRIGHT LIVE 3D CLAYMORPHIC VISUAL AUDIT      ');
  console.log('====================================================\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  // Set theme to clay (Day Bloom 3D Claymorphism)
  await page.goto('http://localhost:3000/index.html');
  await page.evaluate(() => {
    localStorage.setItem('vanvi_aesthetic_theme', 'clay');
    localStorage.setItem('vanvi_font_pref', 'royal');
  });

  const testPages = [
    'templates.html',
    'template-detail.html?template=birthday-midnight-royal',
    'category-birthday.html',
    'dashboard.html',
    'rewards.html',
    'plans.html',
    'faq.html',
    'about.html',
    'login.html',
    'games.html'
  ];

  const results = [];

  for (const p of testPages) {
    const cleanName = p.split('?')[0].replace('.html', '');
    await page.goto('http://localhost:3000/' + p, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(300);

    const audit = await page.evaluate(() => {
      const cards = document.querySelectorAll('div[class*="card"], .card, .template-card, .plan-card, .faq-item');
      let cardShadow = 'none';
      let cardRadius = 'none';
      if (cards.length > 0) {
        const cs = window.getComputedStyle(cards[0]);
        cardShadow = cs.boxShadow;
        cardRadius = cs.borderRadius;
      }

      const btns = document.querySelectorAll('.btn-primary, .btn-create, .btn-make-yours, button[class*="primary"]');
      let btnShadow = 'none';
      if (btns.length > 0) {
        btnShadow = window.getComputedStyle(btns[0]).boxShadow;
      }

      return {
        cardsFound: cards.length,
        cardShadow,
        cardRadius,
        btnsFound: btns.length,
        btnShadow
      };
    });

    results.push({ page: cleanName, audit });
    const scrPath = 'scratch/clay_' + cleanName + '.png';
    await page.screenshot({ path: scrPath });
    console.log(`📸 Page: ${cleanName.padEnd(26)} | Cards: ${audit.cardsFound} | Radius: ${audit.cardRadius} | Screenshot: ${scrPath}`);
  }

  await browser.close();
  console.log('\n====================================================');
  console.log('🎉 3D CLAYMORPHIC AUDIT COMPLETED!');
  console.log('====================================================\n');
})();
