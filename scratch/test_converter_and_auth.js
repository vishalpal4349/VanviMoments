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

async function runTest() {
  console.log('--- TESTING PLANS CONVERTER & AUTH PAGES ---');
  if (!executablePath) {
    console.error('No browser executable found!');
    process.exit(1);
  }

  const browser = await chromium.launch({
    headless: true,
    executablePath: executablePath
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  // 1. Test Plans Page Converter
  console.log('\n🔍 Testing plans.html converter interactions...');
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('http://localhost:3000/plans.html', { waitUntil: 'load' });
  await page.waitForTimeout(500);

  // Check initial state
  const initialCoin = await page.$eval('#convertCoinInput', el => el.value);
  const initialOutput = await page.$eval('#convertCreditOutput', el => el.textContent.trim());
  const initialTier = await page.$eval('#convTierBadge', el => el.textContent.trim());
  console.log(`Initial: input=${initialCoin}, output=₹${initialOutput}, tier="${initialTier}"`);

  // Test +50 stepper
  await page.click('button[title="Add 50 coins"]');
  await page.waitForTimeout(100);
  const steppedCoin = await page.$eval('#convertCoinInput', el => el.value);
  const steppedOutput = await page.$eval('#convertCreditOutput', el => el.textContent.trim());
  console.log(`After +50: input=${steppedCoin}, output=₹${steppedOutput}`);

  // Test Preset Chip (1,000 Coins)
  await page.evaluate(() => setConverterPreset(1000));
  await page.waitForTimeout(100);
  const presetCoin = await page.$eval('#convertCoinInput', el => el.value);
  const presetOutput = await page.$eval('#convertCreditOutput', el => el.textContent.trim());
  const presetTier = await page.$eval('#convTierBadge', el => el.textContent.trim());
  console.log(`After 1,000 preset: input=${presetCoin}, output=₹${presetOutput}, tier="${presetTier}"`);

  // Test Range Slider Sync
  await page.evaluate(() => syncRangeToInput(250));
  await page.waitForTimeout(100);
  const sliderCoin = await page.$eval('#convertCoinInput', el => el.value);
  const sliderOutput = await page.$eval('#convertCreditOutput', el => el.textContent.trim());
  console.log(`After slider to 250: input=${sliderCoin}, output=₹${sliderOutput}`);

  // Test Direction Swap
  await page.click('#convArrowIcon');
  await page.waitForTimeout(100);
  const swappedBadge = await page.$eval('#convDirectionBadge', el => el.textContent.trim());
  const swappedOutput = await page.$eval('#convertCreditOutput', el => el.textContent.trim());
  console.log(`After Swap: badge="${swappedBadge}", output=${swappedOutput} Coins`);

  // Swap back
  await page.click('#convArrowIcon');
  await page.waitForTimeout(100);
  await page.evaluate(() => setConverterPreset(500));
  await page.waitForTimeout(200);

  // Take screenshot of the converter on desktop & mobile
  const converterElement = await page.$('#converterSection');
  if (converterElement) {
    await converterElement.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await converterElement.screenshot({ path: 'scratch/plans_converter_desktop.png' });
    console.log('Saved scratch/plans_converter_desktop.png');
  }

  // Mobile converter screenshot
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('http://localhost:3000/plans.html#converterSection', { waitUntil: 'load' });
  await page.waitForTimeout(500);
  const mobileConverter = await page.$('#converterSection');
  if (mobileConverter) {
    await mobileConverter.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await mobileConverter.screenshot({ path: 'scratch/plans_converter_mobile.png' });
    console.log('Saved scratch/plans_converter_mobile.png');
  }

  // Check auth pages screenshots
  console.log('\n📸 Capturing auth pages desktop & mobile screenshots...');
  for (const item of [
    { name: 'login', url: 'http://localhost:3000/login.html' },
    { name: 'signup', url: 'http://localhost:3000/signup.html' },
    { name: 'forgot', url: 'http://localhost:3000/forgot-password.html' }
  ]) {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(item.url, { waitUntil: 'load' });
    await page.waitForTimeout(400);
    await page.screenshot({ path: `scratch/${item.name}_desktop_final.png` });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(item.url, { waitUntil: 'load' });
    await page.waitForTimeout(400);
    await page.screenshot({ path: `scratch/${item.name}_mobile_final.png` });
  }

  await browser.close();
  console.log('\n🎉 ALL TESTS AND SNAPSHOTS COMPLETED SUCCESSFULLY!');
}

runTest().catch(err => {
  console.error(err);
  process.exit(1);
});
