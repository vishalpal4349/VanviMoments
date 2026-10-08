const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  
  // 1. Desktop 1280x800 for index.html
  const desktopPage = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await desktopPage.goto('http://localhost:3000/index.html', { waitUntil: 'networkidle' });
  
  // Check hero text clipping
  const heroWords = await desktopPage.$$eval('.word-stage span', els => els.map(e => ({ text: e.innerText, rect: e.getBoundingClientRect() })));
  console.log('Hero words rects:', heroWords);

  // Check hero CTA link
  const heroCtaHref = await desktopPage.$eval('.actions .primary.flow-btn', el => el.getAttribute('href'));
  console.log('Hero CTA link:', heroCtaHref);

  // Check bottom dock visibility on desktop
  const dockDisplayDesktop = await desktopPage.$eval('.vanvi-bottom-dock', el => window.getComputedStyle(el).display);
  console.log('Desktop dock display:', dockDisplayDesktop);

  await desktopPage.screenshot({ path: 'scratch/desktop_index_hero.png', clip: { x: 0, y: 0, width: 1280, height: 750 } });

  // 2. Mobile 375x667 for index.html
  const mobilePage = await browser.newPage({ viewport: { width: 375, height: 667 } });
  await mobilePage.goto('http://localhost:3000/index.html', { waitUntil: 'networkidle' });
  const dockDisplayMobile = await mobilePage.$eval('.vanvi-bottom-dock', el => window.getComputedStyle(el).display);
  console.log('Mobile dock display:', dockDisplayMobile);

  // 3. Desktop 1280x900 for plans.html
  const plansDesktopPage = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await plansDesktopPage.goto('http://localhost:3000/plans.html', { waitUntil: 'networkidle' });
  
  const tracksVisible = await plansDesktopPage.$$eval('.plans-slider-track', tracks => tracks.map(t => ({ id: t.id, display: window.getComputedStyle(t).display, cardCount: t.children.length })));
  console.log('Plans tracks visibility:', tracksVisible);

  await plansDesktopPage.screenshot({ path: 'scratch/desktop_plans_sliders.png', clip: { x: 0, y: 350, width: 1280, height: 850 } });

  // 4. Mobile 375x800 for plans.html
  const plansMobilePage = await browser.newPage({ viewport: { width: 375, height: 800 } });
  await plansMobilePage.goto('http://localhost:3000/plans.html', { waitUntil: 'networkidle' });
  await plansMobilePage.screenshot({ path: 'scratch/mobile_plans_sliders.png', clip: { x: 0, y: 350, width: 375, height: 800 } });

  await browser.close();
  console.log('Screenshots captured successfully!');
})();
