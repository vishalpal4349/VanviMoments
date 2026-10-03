const fs = require('fs');
const { chromium } = require('playwright-core');
const path = require('path');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  const browser = await chromium.launch({ executablePath: chromePath, headless: true });
  const page = await browser.newPage();
  await page.goto('file:///' + path.resolve('index.html').replace(/\\/g, '/'));
  await page.waitForTimeout(500);

  // Check parent hierarchy of freeCollectionSection in the ACTUAL browser DOM
  const hierarchy = await page.evaluate(() => {
    const el = document.getElementById('freeCollectionSection');
    if (!el) return 'freeCollectionSection not found!';
    const chain = [];
    let curr = el;
    while (curr) {
      chain.push({
        tagName: curr.tagName,
        id: curr.id,
        className: curr.className,
        display: window.getComputedStyle(curr).display,
        visibility: window.getComputedStyle(curr).visibility,
        opacity: window.getComputedStyle(curr).opacity,
      });
      curr = curr.parentElement;
    }
    return chain;
  });

  console.log('DOM Hierarchy of freeCollectionSection:');
  console.log(JSON.stringify(hierarchy, null, 2));

  // Also check if any interval/timer changes visibility over time (e.g. over 10 seconds)
  console.log('Monitoring visibility over 10 seconds (every 1 second)...');
  for (let s = 1; s <= 10; s++) {
    await page.waitForTimeout(1000);
    const state = await page.evaluate(() => {
      const freeEl = document.getElementById('freeCollectionSection');
      const premEl = document.getElementById('premiumCollectionSection');
      const freeStyle = freeEl ? window.getComputedStyle(freeEl) : null;
      const premStyle = premEl ? window.getComputedStyle(premEl) : null;
      return {
        free: freeEl ? {
          display: freeStyle.display,
          visibility: freeStyle.visibility,
          opacity: freeStyle.opacity,
          rect: freeEl.getBoundingClientRect(),
          classes: freeEl.className
        } : null,
        prem: premEl ? {
          display: premStyle.display,
          visibility: premStyle.visibility,
          opacity: premStyle.opacity,
          rect: premEl.getBoundingClientRect(),
          classes: premEl.className
        } : null
      };
    });
    console.log(`[Second ${s}] Free visibility: ${state.free?.visibility}, opacity: ${state.free?.opacity}, display: ${state.free?.display}, x: ${state.free?.rect?.x}, y: ${state.free?.rect?.y}, width: ${state.free?.rect?.width}`);
    console.log(`[Second ${s}] Prem visibility: ${state.prem?.visibility}, opacity: ${state.prem?.opacity}, display: ${state.prem?.display}, x: ${state.prem?.rect?.x}, y: ${state.prem?.rect?.y}, width: ${state.prem?.rect?.width}`);
  }

  await browser.close();
})();
