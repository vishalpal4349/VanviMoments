const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');
const CHROME_PATHS = ['C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'];
let executablePath = null;
for (const p of CHROME_PATHS) { if (fs.existsSync(p)) { executablePath = p; break; } }

(async () => {
  const browser = await chromium.launch({ executablePath, headless: true });
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  const fileUrl = 'file:///' + path.resolve(__dirname, '..', 'templates.html').replace(/\\/g, '/');
  await page.goto(fileUrl, { waitUntil: 'load' });
  await page.waitForTimeout(500);

  await page.evaluate(() => {
    localStorage.setItem('vanvi_cookie_consent', 'accepted');
    const b = document.getElementById('cookieConsentBanner');
    if (b) b.remove();

    // change buttons to single Create ✦
    document.querySelectorAll('.btn-make-yours').forEach(btn => {
      btn.innerHTML = '<span>Create ✦</span>';
    });
  });

  // Inject fix styles
  await page.addStyleTag({
    content: `
      .vanvi-card .card-art-box,
      .vanvi-card .card-body,
      .vanvi-card .card-header-meta,
      .vanvi-card .card-exp-hint,
      .vanvi-card .card-meta-row,
      .vanvi-card .card-price-cluster,
      .vanvi-card .card-actions-grid {
        box-shadow: none !important;
        border: none !important;
        background: transparent !important;
        border-radius: 0 !important;
        transform: none !important;
      }
      .vanvi-card {
        border-radius: 20px !important;
      }
      .vanvi-card .card-art-box {
        aspect-ratio: 16 / 9.2 !important;
        padding: 8px 10px !important;
        background: radial-gradient(circle at 50% 45%, #fff7fb 0%, #faedf5 100%) !important;
        border-radius: 19px 19px 0 0 !important;
      }
      .vanvi-card .card-body {
        padding: 10px 12px 12px !important;
      }
      .vanvi-card .card-title {
        font-size: 15px !important;
        margin-bottom: 2px !important;
      }
      .vanvi-card .card-tagline {
        font-size: 10.5px !important;
        line-height: 1.35 !important;
        min-height: auto !important;
        max-height: 29px !important;
        margin-bottom: 6px !important;
      }
      .vanvi-card .card-meta-row {
        margin-bottom: 7px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        gap: 6px !important;
      }
      .vanvi-card .card-price-cluster {
        display: flex !important;
        align-items: baseline !important;
        gap: 4px !important;
        white-space: nowrap !important;
      }
      .vanvi-card .price-now {
        font-size: 14.5px !important;
      }
      .vanvi-card .price-orig {
        font-size: 10.5px !important;
      }
      .vanvi-card .discount-pill {
        font-size: 8.5px !important;
        padding: 1px 5px !important;
      }
      .vanvi-card .card-status-subtle {
        box-shadow: none !important;
        border: 0.75px solid rgba(255, 120, 175, 0.2) !important;
        border-radius: 999px !important;
        background: #fff8fb !important;
        padding: 2px 6px !important;
        font-size: 9.5px !important;
      }
      .vanvi-card .btn-take-look,
      .vanvi-card .btn-make-yours {
        height: 31px !important;
        font-size: 11px !important;
        border-radius: 999px !important;
      }
    `
  });
  await page.waitForTimeout(300);

  const firstCard = await page.$('.vanvi-card');
  if (firstCard) {
    await firstCard.screenshot({ path: path.join(__dirname, 'fixed_single_card_create_sparkle.png') });
  }

  // Mobile screenshot
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(300);
  const mobileCard = await page.$('.vanvi-card');
  if (mobileCard) {
    await mobileCard.screenshot({ path: path.join(__dirname, 'fixed_mobile_card.png') });
  }
  await page.screenshot({ path: path.join(__dirname, 'fixed_mobile_overview.png'), clip: { x: 0, y: 150, width: 375, height: 550 } });

  await browser.close();
  console.log('Mobile and desktop sparkle screenshots generated');
})();
