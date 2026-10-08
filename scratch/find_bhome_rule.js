const { chromium } = require('playwright-core');

async function findRule() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto('http://localhost:3000/index.html', { waitUntil: 'domcontentloaded' });

  const info = await page.evaluate(() => {
    const el = document.getElementById('bottomNavHome');
    if (!el) return null;
    
    // Find all matching CSS rules
    const matched = [];
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule.selectorText && el.matches(rule.selectorText)) {
            if (rule.style.transform) {
              matched.push({
                sheet: sheet.href || 'inline',
                selector: rule.selectorText,
                transform: rule.style.transform
              });
            }
          }
        }
      } catch (e) {}
    }
    return matched;
  });

  console.log('Matching transform rules on #bottomNavHome:', info);
  await browser.close();
}

findRule().catch(console.error);
