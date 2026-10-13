const fs = require('fs');
const path = require('path');
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

const rootHtmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html') && !f.startsWith('scratch') && !f.startsWith('backup'));

console.log(`Starting Fast Mobile Button Audit across ${rootHtmlFiles.length} pages...`);

(async () => {
  const browser = await chromium.launch({
    executablePath,
    headless: true
  });

  // Mobile viewport: 360x740 (Standard Android / Galaxy / Redmi - very popular in India)
  const context = await browser.newContext({
    viewport: { width: 360, height: 740 },
    deviceScaleFactor: 2
  });

  const page = await context.newPage();
  const oversizedButtons = [];
  const overflowingPages = [];

  let count = 0;
  for (const file of rootHtmlFiles) {
    count++;
    const url = `http://localhost:3000/${file}`;

    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 3500 });
      await page.waitForTimeout(150);

      // Check overflow
      const overflow = await page.evaluate(() => {
        const docW = document.documentElement.scrollWidth;
        const winW = window.innerWidth;
        return {
          scrollWidth: docW,
          innerWidth: winW,
          hasOverflow: docW > winW + 2
        };
      });

      if (overflow.hasOverflow) {
        overflowingPages.push({ file, ...overflow });
      }

      // Check buttons
      const issues = await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button, a.btn, a.button, .cta-btn, .btn-primary, .btn-secondary, [role="button"], .vanvi-btn, .dock-btn, .action-btn, .btn-hero, .auth-btn, .checkout-btn, .editor-btn'));
        const found = [];

        btns.forEach((b, idx) => {
          const s = window.getComputedStyle(b);
          if (s.display === 'none' || s.visibility === 'hidden' || s.opacity === '0') return;

          const r = b.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) return;

          const text = (b.innerText || b.textContent || '').trim().replace(/\s+/g, ' ');
          
          // Candle pod in surprise template is a graphic candle, skip candle-pod
          if (b.classList.contains('candle-pod')) return;

          // Check if button is abnormally tall on phone (height > 58px)
          const isTooTall = r.height > 58;
          // Check if button overflows horizontally
          const isOverflowing = r.right > window.innerWidth + 2 || r.left < -2;
          // Check if font is disproportionately huge on mobile
          const isHugeFont = parseFloat(s.fontSize) >= 19;

          if (isTooTall || isOverflowing || (isHugeFont && r.height > 50)) {
            found.push({
              text: text.slice(0, 30),
              tagName: b.tagName,
              className: b.className.slice(0, 40),
              width: Math.round(r.width),
              height: Math.round(r.height),
              fontSize: s.fontSize,
              isTooTall,
              isOverflowing,
              isHugeFont
            });
          }
        });

        return found;
      });

      if (issues.length > 0) {
        oversizedButtons.push({ file, issues });
      }
      process.stdout.write(`[${count}/${rootHtmlFiles.length}] ${file} ` + (issues.length ? `⚠️ (${issues.length} btns)\n` : '✓\n'));
    } catch (e) {
      process.stdout.write(`[${count}/${rootHtmlFiles.length}] ${file} (Skipped/Timeout)\n`);
    }
  }

  await browser.close();

  console.log('\n=============================================');
  console.log(`📱 PAGES WITH OVERFLOW (WIDTH 360px): ${overflowingPages.length}`);
  overflowingPages.forEach(p => console.log(`   ⚠️  ${p.file}: scrollWidth ${p.scrollWidth}px vs ${p.innerWidth}px`));

  console.log(`\n🔘 PAGES WITH OVERSIZED BUTTONS (WIDTH 360px): ${oversizedButtons.length}`);
  oversizedButtons.forEach(b => {
    console.log(`\n📄 ${b.file}:`);
    b.issues.forEach(i => {
      console.log(`   • [${i.tagName}] "${i.text}" | W:${i.width}px, H:${i.height}px, F:${i.fontSize} | ${i.isTooTall ? 'TOO TALL ' : ''}${i.isOverflowing ? 'OVERFLOW ' : ''}${i.isHugeFont ? 'HUGE FONT' : ''}`);
    });
  });

  fs.writeFileSync('scratch/mobile_fast_audit.json', JSON.stringify({ overflowingPages, oversizedButtons }, null, 2));
})();
