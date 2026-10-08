const { chromium } = require('playwright-core');

(async () => {
  console.log('====================================================');
  console.log('   AUDITING ALL THEMES & PAGES (CLAY, EMERALD, GLASS)');
  console.log('====================================================\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  const themes = ['clay', 'emerald', 'glass'];
  const testPages = ['dashboard.html', 'rewards.html', 'checkout.html', 'profile.html', 'refer.html', 'products.html'];

  for (const theme of themes) {
    console.log(`\n--- THEME: ${theme.toUpperCase()} ---`);
    for (const p of testPages) {
      const clean = p.replace('.html', '');
      try {
        await page.goto('http://localhost:3000/' + p, { waitUntil: 'domcontentloaded' });
        await page.evaluate((th) => {
          localStorage.setItem('vanvi_aesthetic_theme', th);
          document.documentElement.setAttribute('data-vanvi-theme', th);
          const cb = document.getElementById('cookieConsentBanner') || document.querySelector('.cookie-banner, .cookie-dialog');
          if (cb) cb.style.display = 'none';
        }, theme);
        await page.waitForTimeout(300);

        const scrPath = `scratch/theme_${theme}_${clean}.png`;
        await page.screenshot({ path: scrPath });
        console.log(`✓ [${theme}] ${clean.padEnd(16)} -> ${scrPath}`);
      } catch(e) {
        console.error(`✗ [${theme}] ${clean} error:`, e.message);
      }
    }
  }

  await browser.close();
  console.log('\n====================================================');
  console.log('🎉 THEME TRIAD AUDIT COMPLETED!');
  console.log('====================================================\n');
})();
