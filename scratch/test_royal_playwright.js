const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log('🚀 Launching Playwright browser to test Royal Shaadi Invite...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  const indexPath = 'file:///' + path.resolve(__dirname, '../templates/royal-shaadi-invite/index.html').replace(/\\/g, '/') + '?guest=Chacha%20Chachi%20ji';
  console.log('Navigating to:', indexPath);
  await page.goto(indexPath, { waitUntil: 'load' });

  // 1. Test Dynamic Guest Greeting
  const guestText = await page.$eval('#guestNameDisplay', el => el.textContent.trim());
  console.log('1. Guest Header Greeting:', guestText);
  if (guestText !== 'Welcome, Chacha Chachi ji') {
    throw new Error(`Expected "Welcome, Chacha Chachi ji" but got "${guestText}"`);
  }

  // 2. Test Monogram
  const monoText = await page.$eval('#headerMonogramPill', el => el.textContent.trim());
  console.log('2. Monogram Pill:', monoText);
  if (monoText !== '#Shaya') {
    throw new Error(`Expected "#Shaya" but got "${monoText}"`);
  }

  // 3. Test 3D Wax Seal Unboxing
  const isOpenBefore = await page.$eval('#envelopeWrapper', el => el.classList.contains('is-open'));
  console.log('3. Envelope open before seal click:', isOpenBefore);
  if (isOpenBefore) throw new Error('Envelope should start closed');

  await page.click('#envelopeSealBtn');
  await page.waitForTimeout(600);

  const isOpenAfter = await page.$eval('#envelopeWrapper', el => el.classList.contains('is-open'));
  console.log('3. Envelope open after seal click:', isOpenAfter);
  if (!isOpenAfter) throw new Error('Envelope did not open upon wax seal click');

  // 4. Test Storyboard cards
  const cardsCount = await page.$$eval('.polaroid-card', els => els.length);
  console.log('4. Storyboard polaroids count:', cardsCount);
  if (cardsCount !== 3) throw new Error(`Expected 3 polaroids but got ${cardsCount}`);

  // 5. Test Scratch Card
  const scratchCanvasVisible = await page.$eval('#scratchCanvas', el => el.offsetWidth > 0 && el.offsetHeight > 0);
  console.log('5. Scratch canvas rendered:', scratchCanvasVisible);
  if (!scratchCanvasVisible) throw new Error('Scratch canvas not rendered');

  // Perform drag/scratch gesture on canvas
  const canvasBox = await page.$('#scratchCanvas');
  const box = await canvasBox.boundingBox();
  if (box) {
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2 + 50, box.y + box.height / 2 + 30);
    await page.mouse.up();
    console.log('5. Performed scratch drag gesture successfully');
  }

  // 6. Test Venue Directions Modal
  await page.click('#btnVenueDirections');
  await page.waitForTimeout(300);
  const isModalActive = await page.$eval('#venueModal', el => el.classList.contains('active'));
  console.log('6. Venue modal opened:', isModalActive);
  if (!isModalActive) throw new Error('Venue modal did not activate');

  await page.click('#modalCloseBtn');
  await page.waitForTimeout(300);
  const isModalClosed = await page.$eval('#venueModal', el => !el.classList.contains('active'));
  console.log('6. Venue modal closed:', isModalClosed);
  if (!isModalClosed) throw new Error('Venue modal did not close');

  // 7. Test Blessings Guestbook submission
  await page.fill('#wishAuthorInput', 'Mama ji');
  await page.fill('#wishMessageInput', 'Sada sukhi raho aur khush raho!');
  await page.click('.btn-send-blessing');
  await page.waitForTimeout(300);
  const latestWish = await page.$eval('.blessing-bubble .blessing-author', el => el.textContent.trim());
  console.log('7. Latest blessing submitted author:', latestWish);
  if (latestWish !== 'Mama ji') throw new Error(`Expected "Mama ji" but got "${latestWish}"`);

  // 8. Test Builder Page
  const builderUrl = 'file:///' + path.resolve(__dirname, '../templates/royal-shaadi-invite/builder.html').replace(/\\/g, '/');
  console.log('\nNavigating to Builder:', builderUrl);
  await page.goto(builderUrl, { waitUntil: 'load' });

  // Switch to Guest Links tab
  await page.click('button:has-text("Guest Links 👑")');
  await page.waitForTimeout(300);
  await page.fill('#inputGuestName', 'Sharma Parivar');
  await page.click('button:has-text("Generate Personalized Guest Link ✦")');
  await page.waitForTimeout(300);

  const genLink = await page.$eval('#generatedLinkDisplay', el => el.textContent.trim());
  console.log('8. Generated Link in Builder:', genLink);
  if (!genLink.includes('guest=Sharma+Parivar')) {
    throw new Error(`Generated link does not include guest name: ${genLink}`);
  }

  console.log('\n✨ ALL PLAYWRIGHT LIVE BROWSER TESTS PASSED FLAWLESSLY! ✨');
  await browser.close();
})();
