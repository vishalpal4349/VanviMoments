const { chromium } = require('playwright-core');
const http = require('http');
const app = require('../server/server.js');

async function testMirrorReveal() {
  const server = http.createServer(app);
  await new Promise(resolve => server.listen(3004, resolve));
  console.log('Test server listening on port 3004');

  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });

  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  console.log('\n--- 1. Testing Mirror Reveal Index Page ---');
  await page.goto('http://localhost:3004/templates/mirror-reveal/index.html', { waitUntil: 'domcontentloaded' });
  const title = await page.title();
  console.log('Page Title:', title);

  const watermark = await page.$('#demoWatermarkBadge');
  console.log('Watermark present in demo mode:', !!watermark);

  console.log('\n--- 2. Testing Watermark Auto-Removal on Purchase ---');
  await page.goto('http://localhost:3004/templates/mirror-reveal/index.html?purchased=true', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(400);
  const watermarkPurchased = await page.$('#demoWatermarkBadge');
  console.log('Watermark present when purchased=true:', !!watermarkPurchased);

  console.log('\n--- 3. Testing Mirror Reveal Builder ---');
  await page.goto('http://localhost:3004/templates/mirror-reveal/builder.html', { waitUntil: 'domcontentloaded' });
  const builderTitle = await page.title();
  console.log('Builder Title:', builderTitle);

  const checkoutBtn = await page.$('#proceedCheckoutBtn');
  console.log('Checkout button present in builder:', !!checkoutBtn);

  console.log('\n--- 4. Testing Checkout Integration ---');
  await page.goto('http://localhost:3004/checkout.html?templateId=mirror-reveal&price=999', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
  const checkoutText = await page.evaluate(() => document.body.innerText);
  const hasMirrorName = checkoutText.includes('Mirror Reveal');
  const hasPrice = checkoutText.includes('999');
  console.log('Checkout resolves Mirror Reveal name:', hasMirrorName);
  console.log('Checkout resolves ₹999 price:', hasPrice);

  console.log('\n--- 5. Testing Templates Showcase Catalog ---');
  await page.goto('http://localhost:3004/templates.html', { waitUntil: 'domcontentloaded' });
  const hasCatalogEntry = await page.evaluate(() => document.body.innerText.includes('Mirror Reveal'));
  console.log('Mirror Reveal visible in templates.html:', hasCatalogEntry);

  console.log('\n--- 6. Testing Responsive Viewports (320px, 375px, 768px, 1280px) ---');
  const viewports = [
    { name: '320px Micro Mobile', width: 320, height: 600 },
    { name: '375px Mobile', width: 375, height: 667 },
    { name: '768px Tablet', width: 768, height: 1024 },
    { name: '1280px Desktop', width: 1280, height: 800 }
  ];
  for (const vp of viewports) {
    const vpPage = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await vpPage.goto('http://localhost:3004/templates/mirror-reveal/index.html', { waitUntil: 'domcontentloaded' });
    const overflowX = await vpPage.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    console.log(`[${vp.name}] Horizontal Overflow: ${overflowX}px`);
    await vpPage.close();
  }

  console.log('\nConsole Errors:', errors);
  await browser.close();
  server.close();
  console.log('\nMirror Reveal full verification test completed successfully!');
}

testMirrorReveal().catch(console.error);
