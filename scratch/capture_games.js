const fs = require('fs');
const { chromium } = require('playwright-core');

const CHROME_PATHS = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
];
const executablePath = CHROME_PATHS.find(p => fs.existsSync(p));

(async () => {
  const browser = await chromium.launch({ executablePath, headless: true });
  
  // 1. Mobile Gem Catch Playing
  const mCtx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mPage = await mCtx.newPage();
  await mPage.goto('http://localhost:3000/gem-catch.html', { waitUntil: 'domcontentloaded' });
  
  // Accept cookies if present
  try {
    const btn = await mPage.$('button:has-text("Accept All")');
    if (btn) await btn.click();
  } catch(e) {}

  await mPage.waitForTimeout(300);
  await mPage.click('#btnOverlayAction');
  await mPage.waitForTimeout(1000);
  await mPage.screenshot({ path: 'scratch/gem_catch_mobile_playing.png' });
  console.log('Gem Catch Mobile Playing saved');

  // 2. Desktop Gem Catch Playing
  const dCtx = await browser.newContext({ viewport: { width: 1200, height: 820 } });
  const dPage = await dCtx.newPage();
  await dPage.goto('http://localhost:3000/gem-catch.html', { waitUntil: 'domcontentloaded' });
  try {
    const btn = await dPage.$('button:has-text("Accept All")');
    if (btn) await btn.click();
  } catch(e) {}
  await dPage.waitForTimeout(300);
  await dPage.click('#btnOverlayAction');
  await dPage.waitForTimeout(1200);
  await dPage.screenshot({ path: 'scratch/gem_catch_desktop_playing.png' });
  console.log('Gem Catch Desktop Playing saved');

  // 3. Memory Rush Desktop
  const mrPage = await dCtx.newPage();
  await mrPage.goto('http://localhost:3000/memory-rush.html', { waitUntil: 'domcontentloaded' });
  await mrPage.waitForTimeout(500);
  await mrPage.screenshot({ path: 'scratch/memory_rush_desktop.png' });
  console.log('Memory Rush Desktop saved');

  // 4. Memory Sequence Desktop
  const msPage = await dCtx.newPage();
  await msPage.goto('http://localhost:3000/memory-sequence.html', { waitUntil: 'domcontentloaded' });
  await msPage.waitForTimeout(500);
  await msPage.screenshot({ path: 'scratch/memory_sequence_desktop.png' });
  console.log('Memory Sequence Desktop saved');

  // 6. AI Matcher Mobile & Desktop
  const aimMobilePage = await mCtx.newPage();
  await aimMobilePage.goto('http://localhost:3000/ai-matcher.html', { waitUntil: 'domcontentloaded' });
  await aimMobilePage.waitForTimeout(600);
  await aimMobilePage.screenshot({ path: 'scratch/ai_matcher_mobile.png' });
  console.log('AI Matcher Mobile saved');

  const aimDeskPage = await dCtx.newPage();
  await aimDeskPage.goto('http://localhost:3000/ai-matcher.html', { waitUntil: 'domcontentloaded' });
  await aimDeskPage.waitForTimeout(600);
  await aimDeskPage.screenshot({ path: 'scratch/ai_matcher_desktop.png' });
  console.log('AI Matcher Desktop saved');

  await browser.close();
})();
