const { chromium } = require('playwright-core');
const http = require('http');
const app = require('../server/server.js');

async function runTest() {
  const server = http.createServer(app);
  await new Promise(resolve => server.listen(3002, resolve));
  console.log('Test server listening on port 3002');

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

  console.log('\n--- 1. Testing Template Index Page ---');
  await page.goto('http://localhost:3002/templates/the-grand-royal-palace-wedding/index.html', { waitUntil: 'domcontentloaded' });
  const title = await page.title();
  console.log('Page Title:', title);

  const watermark = await page.$('#demoWatermarkBadge');
  console.log('Watermark present in demo mode:', !!watermark);

  console.log('\n--- 2. Testing Watermark Auto-Removal on Purchase ---');
  await page.goto('http://localhost:3002/templates/the-grand-royal-palace-wedding/index.html?purchased=true', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
  const watermarkPurchased = await page.$('#demoWatermarkBadge');
  console.log('Watermark present when purchased=true:', !!watermarkPurchased);

  console.log('\n--- 3. Testing Builder Page ---');
  await page.goto('http://localhost:3002/templates/the-grand-royal-palace-wedding/builder.html', { waitUntil: 'domcontentloaded' });
  const builderTitle = await page.title();
  console.log('Builder Title:', builderTitle);

  const checkoutBtn = await page.$('#proceedCheckoutBtn');
  console.log('Checkout button present in builder:', !!checkoutBtn);

  console.log('\n--- 4. Testing Templates Showcase Catalog ---');
  await page.goto('http://localhost:3002/templates.html', { waitUntil: 'domcontentloaded' });
  const hasRoyalCard = await page.evaluate(() => {
    return document.body.innerText.includes('The Grand Royal Palace Vivah') && document.body.innerText.includes('999');
  });
  console.log('Royal template card visible on templates.html with ₹999 price:', hasRoyalCard);

  console.log('\nErrors recorded:', errors);

  await browser.close();
  server.close();
  console.log('\nAll tests complete!');
}

runTest().catch(console.error);
