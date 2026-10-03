const { chromium } = require('playwright-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:3000';

const VIEWPORTS = [
  { name: 'Mobile-320', width: 320, height: 568 },
  { name: 'Mobile-360', width: 360, height: 640 },
  { name: 'Mobile-375', width: 375, height: 667 },
  { name: 'Mobile-390', width: 390, height: 844 },
  { name: 'Mobile-414', width: 414, height: 896 },
  { name: 'Tablet-768', width: 768, height: 1024 },
  { name: 'Laptop-1024', width: 1024, height: 768 },
  { name: 'Desktop-1280', width: 1280, height: 800 }
];

async function testTemplatesRedesign() {
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  console.log('Testing templates.html responsive design across viewports...');

  for (const vp of VIEWPORTS) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto(`${BASE_URL}/templates.html`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);

    // Check overflow
    const overflow = await page.evaluate(() => {
      const docEl = document.documentElement;
      return {
        scrollWidth: docEl.scrollWidth,
        clientWidth: docEl.clientWidth,
        hasOverflow: docEl.scrollWidth > docEl.clientWidth + 2
      };
    });

    if (overflow.hasOverflow) {
      console.error(`❌ Overflow on ${vp.name}: scrollWidth=${overflow.scrollWidth}, clientWidth=${overflow.clientWidth}`);
      process.exit(1);
    } else {
      console.log(`✓ ${vp.name}: 0px overflow (Perfect fit)`);
    }

    // Verify card buttons inside cover
    const buttonChecks = await page.evaluate(() => {
      const cards = document.querySelectorAll('.tpl-luxury-card');
      if (cards.length === 0) return { count: 0, ok: false };
      
      let allButtonsInside = true;
      let previewLinks = [];
      let makeLinks = [];

      cards.forEach((card, i) => {
        const cover = card.querySelector('.tpl-cover-stage');
        const capsule = card.querySelector('.tpl-floating-capsule');
        const prevBtn = card.querySelector('.btn-capsule-preview');
        const makeBtn = card.querySelector('.btn-capsule-make');
        const title = card.querySelector('.capsule-title');
        const price = card.querySelector('.capsule-price-val');

        if (!cover || !capsule || !prevBtn || !makeBtn || !title || !price) {
          allButtonsInside = false;
        }

        // Check if capsule is visually inside card bounding box
        if (cover && capsule) {
          const coverRect = cover.getBoundingClientRect();
          const capRect = capsule.getBoundingClientRect();
          if (capRect.bottom > coverRect.bottom + 2 || capRect.top < coverRect.top) {
            allButtonsInside = false;
          }
        }

        if (i < 3) {
          if (prevBtn) previewLinks.push(prevBtn.getAttribute('href'));
          if (makeBtn) makeLinks.push(makeBtn.getAttribute('href'));
        }
      });

      return {
        count: cards.length,
        allButtonsInside,
        previewLinks,
        makeLinks
      };
    });

    if (!buttonChecks.allButtonsInside) {
      console.error(`❌ Capsule placement check failed on ${vp.name}`);
      process.exit(1);
    }
  }

  console.log('✓ All viewports passed capsule bounding box and overflow tests!');

  // Test click on Preview
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto(`${BASE_URL}/templates.html`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(400);

  const previewHref = await page.$eval('.btn-capsule-preview', el => el.getAttribute('href'));
  console.log('Sample Preview href:', previewHref);
  if (!previewHref.startsWith('preview.html?template=')) {
    throw new Error('Preview link format incorrect');
  }

  const makeHref = await page.$eval('.btn-capsule-make', el => el.getAttribute('href'));
  console.log('Sample Make It Yours href:', makeHref);
  if (!makeHref.startsWith('builder.html?template=')) {
    throw new Error('Make It Yours link format incorrect');
  }

  // Click preview button and verify navigation
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
    page.click('.btn-capsule-preview')
  ]);
  console.log('✓ Click on [ Preview ] navigated to:', page.url());

  await browser.close();
  console.log('\n🎉 ALL TESTS PASSED WITH 100% SUCCESS!');
}

testTemplatesRedesign().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
