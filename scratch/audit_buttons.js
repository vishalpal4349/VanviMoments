const { chromium } = require('playwright-core');

async function auditPage(url, pageName) {
  console.log(`\n======================================================`);
  console.log(`AUDITING BUTTONS ON: ${pageName} (${url})`);
  console.log(`======================================================`);

  let browser;
  try {
    browser = await chromium.launch({ channel: 'msedge', headless: true });
  } catch (e) {
    browser = await chromium.launch({ channel: 'chrome', headless: true });
  }

  const viewports = [
    { w: 320, h: 568, name: '320px (Mobile SE)' },
    { w: 375, h: 667, name: '375px (iPhone)' },
    { w: 768, h: 1024, name: '768px (iPad)' },
    { w: 1280, h: 800, name: '1280px (Desktop)' }
  ];

  for (const vp of viewports) {
    console.log(`\n--- Viewport: ${vp.name} ---`);
    const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h } });
    const page = await ctx.newPage();
    
    // Listen for console errors
    page.on('console', msg => {
      if (msg.type() === 'error') console.log(`  [Console Error]: ${msg.text()}`);
    });

    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);

    const buttonAudit = await page.evaluate(() => {
      const candidates = Array.from(document.querySelectorAll('button, a.btn, a[class*="btn"], a[class*="cta"], .cta, [role="button"], input[type="button"], input[type="submit"]'));
      
      const results = [];
      candidates.forEach((el, index) => {
        // Ignore hidden elements
        const style = window.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return;

        const rect = el.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) return;

        const text = (el.innerText || el.textContent || el.value || el.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 35);
        const tag = el.tagName.toLowerCase();
        const id = el.id ? `#${el.id}` : '';
        const className = el.className ? `.${Array.from(el.classList).join('.')}` : '';
        const selector = `${tag}${id}${className}`;

        // Check animations, transforms, positions
        const transform = style.transform;
        const animation = style.animationName;
        const position = style.position;
        const top = style.top;
        const bottom = style.bottom;
        const left = style.left;
        const right = style.right;

        // Check parent container
        const parent = el.parentElement;
        const parentStyle = parent ? window.getComputedStyle(parent) : null;
        const parentDisplay = parentStyle ? parentStyle.display : '';
        const parentFlex = parentStyle ? `${parentStyle.flexDirection} ${parentStyle.justifyContent} ${parentStyle.alignItems}` : '';

        // Test hover shift
        const initialRect = { x: rect.x, y: rect.y, w: rect.width, h: rect.height };

        results.push({
          selector: selector.slice(0, 50),
          text,
          rect: initialRect,
          position,
          transform: transform !== 'none' ? transform : 'none',
          animation: animation !== 'none' ? animation : 'none',
          parentDisplay,
          parentFlex
        });
      });
      return results;
    });

    console.log(`  Found ${buttonAudit.length} visible buttons/CTAs.`);
    buttonAudit.forEach((b, i) => {
      const issues = [];
      if (b.transform !== 'none' && !b.transform.includes('matrix(1, 0, 0, 1, 0, 0)')) {
        issues.push(`active transform: ${b.transform}`);
      }
      if (b.animation !== 'none') {
        issues.push(`animation: ${b.animation}`);
      }
      if (b.position === 'absolute' || b.position === 'fixed') {
        issues.push(`position: ${b.position}`);
      }
      if (issues.length > 0) {
        console.log(`  [!] Button #${i+1} [${b.text || b.selector}]: ${issues.join(' | ')} (x:${Math.round(b.rect.x)}, y:${Math.round(b.rect.y)}, w:${Math.round(b.rect.w)}, h:${Math.round(b.rect.h)})`);
      }
    });

    await ctx.close();
  }

  await browser.close();
}

async function main() {
  await auditPage('http://localhost:3000/index.html', 'ROOT HOMEPAGE (index.html)');
  await auditPage('http://localhost:3000/templates/temple-royal-wedding/index.html', 'TEMPLE ROYALE (templates/temple-royal-wedding/index.html)');
}

main().catch(console.error);
