const { chromium } = require('playwright-core');
const http = require('http');
const app = require('../server/server.js');

async function testViewports() {
  const server = http.createServer(app);
  await new Promise(resolve => server.listen(3003, resolve));

  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });

  const viewports = [
    { name: '320px Micro Mobile', width: 320, height: 600 },
    { name: '375px iPhone Mini', width: 375, height: 667 },
    { name: '768px Tablet', width: 768, height: 1024 },
    { name: '1280px Desktop', width: 1280, height: 800 }
  ];

  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.goto('http://localhost:3003/templates/the-grand-royal-palace-wedding/index.html', { waitUntil: 'domcontentloaded' });
    const overflowX = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    console.log(`[${vp.name}] index.html Horizontal Overflow: ${overflowX}px`);
    await page.close();
  }

  await browser.close();
  server.close();
  console.log('Viewport audit finished!');
}

testViewports().catch(console.error);
