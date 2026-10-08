const { chromium } = require('playwright-core');

async function inspectButtons() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto('http://localhost:3000/index.html', { waitUntil: 'domcontentloaded' });

  const btn2 = await page.evaluate(() => {
    const candidates = Array.from(document.querySelectorAll('button, a.btn, a[class*="btn"], a[class*="cta"], .cta, [role="button"], input[type="button"], input[type="submit"]'));
    const visible = candidates.filter(el => {
      const s = window.getComputedStyle(el);
      return s.display !== 'none' && s.visibility !== 'hidden' && s.opacity !== '0' && el.getBoundingClientRect().width > 0;
    });

    const b2 = visible[1]; // Button #2
    const bHome = document.getElementById('bottomNavHome');
    const bCreate = document.getElementById('bottomNavCreate');

    return {
      b2: b2 ? {
        outerHTML: b2.outerHTML.slice(0, 200),
        rect: b2.getBoundingClientRect(),
        parent: b2.parentElement ? b2.parentElement.outerHTML.slice(0, 200) : null
      } : null,
      bHome: bHome ? {
        transform: window.getComputedStyle(bHome).transform,
        rect: bHome.getBoundingClientRect()
      } : null,
      bCreate: bCreate ? {
        transform: window.getComputedStyle(bCreate).transform,
        rect: bCreate.getBoundingClientRect()
      } : null
    };
  });

  console.log('Button 2 info:', btn2);
  await browser.close();
}

inspectButtons().catch(console.error);
