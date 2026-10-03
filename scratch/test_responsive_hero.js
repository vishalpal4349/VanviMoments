const { chromium } = require('playwright-core');
const path = require('path');
const fs = require('fs');

async function testScreenshots() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const executablePath = fs.existsSync(edgePath) ? edgePath : chromePath;

  console.log('Using executable:', executablePath);
  const browser = await chromium.launch({
    executablePath,
    headless: true
  });

  const viewports = [
    { name: 'mobile-320', width: 320, height: 600 },
    { name: 'mobile-360', width: 360, height: 740 },
    { name: 'mobile-375', width: 375, height: 812 },
    { name: 'mobile-390', width: 390, height: 844 },
    { name: 'mobile-414', width: 414, height: 896 },
    { name: 'tablet-768', width: 768, height: 1024 },
    { name: 'laptop-1024', width: 1024, height: 768 },
    { name: 'laptop-1280', width: 1280, height: 800 },
    { name: 'desktop-1440', width: 1440, height: 900 },
    { name: 'desktop-1920', width: 1920, height: 1080 }
  ];

  const htmlPath = 'file:///' + path.resolve(__dirname, '../index.html').replace(/\\/g, '/');
  console.log('Loading:', htmlPath);

  const outDir = path.resolve(__dirname, 'hero_screenshots');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const page = await browser.newPage();

  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto(htmlPath, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);

    // Inspect layout measurements
    const metrics = await page.evaluate(() => {
      const hero = document.querySelector('.hero');
      const headline = document.querySelector('.hero-headline') || document.querySelector('.hero h2');
      const makeMoments = document.querySelector('.make-moments');
      const pill = document.querySelector('.word-stage-pill');
      const stage = document.querySelector('.word-stage');
      const bodyWidth = document.body.scrollWidth;
      const windowWidth = window.innerWidth;
      const hasOverflow = bodyWidth > windowWidth;

      return {
        windowWidth,
        bodyWidth,
        hasOverflow,
        heroWidth: hero ? hero.offsetWidth : null,
        headlineWidth: headline ? headline.offsetWidth : null,
        makeMomentsWidth: makeMoments ? makeMoments.offsetWidth : null,
        pillWidth: pill ? pill.offsetWidth : null,
        stageWidth: stage ? stage.offsetWidth : null
      };
    });

    console.log(`[${vp.name}] W:${vp.width}px - Overflow: ${metrics.hasOverflow} (body: ${metrics.bodyWidth} vs win: ${metrics.windowWidth}) | Pill W: ${metrics.pillWidth}px | Stage W: ${metrics.stageWidth}px`);

    const heroEl = await page.$('.hero');
    if (heroEl) {
      await heroEl.screenshot({ path: path.join(outDir, `${vp.name}-hero.png`) });
    }
  }

  await browser.close();
  console.log('Finished capturing all viewport screenshots successfully!');
}

testScreenshots().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
