const fs = require('fs');
const { chromium } = require('playwright-core');

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
  const browser = await chromium.launch({ executablePath, headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  
  console.log('1. Loading http://localhost:3000/templates/birthday-wish-01/index.html');
  await page.goto('http://localhost:3000/templates/birthday-wish-01/index.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Check if any popup or banner is visible on Scene 1
  const scene1Popups = await page.evaluate(() => {
    const list = [];
    document.querySelectorAll('*').forEach(el => {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      if (rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden') {
        if (el.id === 'vanviUniversalEndCta' || el.classList.contains('vanvi-universal-end-cta') ||
            el.id.toLowerCase().includes('modal') || el.id.toLowerCase().includes('popup')) {
          list.push({ id: el.id, className: el.className.toString(), text: el.innerText.slice(0, 60) });
        }
      }
    });
    return list;
  });
  console.log('Scene 1 popups found:', scene1Popups);
  await page.screenshot({ path: 'scratch/bday_scene1_clean.png' });

  // Navigate to Scene 7
  console.log('2. Navigating to Scene 7 (Finale)...');
  await page.evaluate(() => {
    if (typeof window.goToScene === 'function') {
      window.goToScene(7);
    }
  });
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'scratch/bday_scene7_luxe.png', fullPage: true });

  const finaleChecks = await page.evaluate(() => {
    const btn = document.getElementById('btnFinaleCustomize');
    const panel = document.querySelector('.vanvi-luxe-finale-panel');
    const wa = document.querySelector('.btn-dual-wa');
    const replay = document.querySelector('.btn-dual-replay');
    return {
      hasPanel: !!panel,
      hasBtnCustomize: !!btn,
      btnHref: btn ? btn.getAttribute('href') : null,
      btnText: btn ? btn.innerText.replace(/\s+/g, ' ').trim() : null,
      hasWhatsApp: !!wa,
      hasReplay: !!replay
    };
  });
  console.log('Finale checks in Scene 7:', JSON.stringify(finaleChecks, null, 2));

  console.log('3. Testing /preview.html?template=birthday-wish-01');
  await page.goto('http://localhost:3000/preview.html?template=birthday-wish-01', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  const previewUrl = page.url();
  console.log('Final URL after preview navigation:', previewUrl);

  const previewPopups = await page.evaluate(() => {
    const list = [];
    document.querySelectorAll('#vanviUniversalEndCta, .vanvi-universal-end-cta').forEach(el => {
      const style = window.getComputedStyle(el);
      if (style.display !== 'none') list.push(el.id || el.className);
    });
    return list;
  });
  console.log('Preview popups found (should be empty):', previewPopups);

  await browser.close();
  console.log('All tests finished successfully!');
})();
