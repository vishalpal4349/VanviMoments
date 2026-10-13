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

if (!executablePath) {
  console.error('No suitable browser executable found!');
  process.exit(1);
}

const ROOT_DIR = path.resolve(__dirname, '..');
const rootHtmlFiles = fs.readdirSync(ROOT_DIR).filter(f => f.endsWith('.html') && !f.startsWith('scratch') && !f.startsWith('backup'));

console.log(`Auditing ${rootHtmlFiles.length} root HTML files with executable: ${executablePath}`);

(async () => {
  const browser = await chromium.launch({
    executablePath,
    headless: true
  });

  // Test standard phone viewport (375x667 - iPhone SE / common Android)
  const context = await browser.newContext({
    viewport: { width: 375, height: 667 },
    deviceScaleFactor: 2
  });

  const page = await context.newPage();
  const oversizedButtons = [];
  const overflowingPages = [];

  for (const file of rootHtmlFiles) {
    const filePath = path.join(ROOT_DIR, file).replace(/\\/g, '/');
    const url = `file://${filePath}`;

    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 6000 });
      await page.waitForTimeout(250);

      // Check overall page horizontal overflow
      const pageMetrics = await page.evaluate(() => {
        return {
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2
        };
      });

      if (pageMetrics.hasOverflow) {
        overflowingPages.push({ file, ...pageMetrics });
      }

      // Check button sizing & positioning
      const buttonMetrics = await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button, a.btn, a.button, .cta-btn, .btn-primary, .btn-secondary, [role="button"], .vanvi-btn, .dock-btn, .action-btn, .auth-btn, .btn-hero, .btn-checkout'));
        const issues = [];

        btns.forEach((btn, index) => {
          const style = window.getComputedStyle(btn);
          if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return;

          const rect = btn.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) return;

          const text = (btn.innerText || btn.textContent || '').trim().replace(/\s+/g, ' ');
          
          // An issue if:
          // 1. Button height > 56px (unusually huge on mobile phone)
          // 2. Button width > 375px (overflows screen horizontally)
          // 3. Button font size >= 18px and height > 48px
          // 4. Button right edge overflows viewport
          const isTooTall = rect.height > 58;
          const isOverflowing = rect.right > window.innerWidth + 2 || rect.left < -2;
          const hasHugeFont = parseFloat(style.fontSize) >= 18;

          if (isTooTall || isOverflowing || (hasHugeFont && rect.height > 50)) {
            issues.push({
              index,
              text: text.slice(0, 35),
              tagName: btn.tagName,
              className: btn.className,
              width: Math.round(rect.width),
              height: Math.round(rect.height),
              fontSize: style.fontSize,
              lineHeight: style.lineHeight,
              padding: style.padding,
              isTooTall,
              isOverflowing,
              hasHugeFont
            });
          }
        });

        return issues;
      });

      if (buttonMetrics.length > 0) {
        oversizedButtons.push({ file, issues: buttonMetrics });
      }
    } catch (err) {
      console.error(`Error auditing ${file}:`, err.message);
    }
  }

  await browser.close();

  console.log('\n=============================================');
  console.log(`📱 PAGES WITH HORIZONTAL OVERFLOW ON MOBILE (WIDTH 375px): ${overflowingPages.length}`);
  overflowingPages.forEach(p => console.log(`   ⚠️  ${p.file} -> scrollWidth: ${p.scrollWidth}px (exceeds 375px by ${p.scrollWidth - 375}px)`));

  console.log(`\n🔘 PAGES WITH OVERSIZED / OVERFLOWING BUTTONS ON MOBILE: ${oversizedButtons.length}`);
  oversizedButtons.forEach(b => {
    console.log(`\n📄 ${b.file} (${b.issues.length} buttons):`);
    b.issues.forEach(iss => {
      console.log(`   • [${iss.tagName}] "${iss.text}" -> W:${iss.width}px, H:${iss.height}px, Font:${iss.fontSize} [${iss.isTooTall ? 'TOO TALL ' : ''}${iss.isOverflowing ? 'OVERFLOW ' : ''}${iss.hasHugeFont ? 'HUGE FONT' : ''}]`);
    });
  });

  fs.writeFileSync('scratch/mobile_button_audit.json', JSON.stringify({ overflowingPages, oversizedButtons }, null, 2));
  console.log('\nAudit report saved to scratch/mobile_button_audit.json');
})();
