const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const pages = [
    { name: 'login', file: 'login.html' },
    { name: 'signup', file: 'signup.html' },
    { name: 'forgot_password', file: 'forgot-password.html' }
  ];

  const viewports = [
    { device: 'desktop', width: 1280, height: 850 },
    { device: 'mobile', width: 390, height: 844 }
  ];

  const outDir = path.join(__dirname, 'snaps');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  for (const pageInfo of pages) {
    const page = await browser.newPage();
    const filePath = 'file:///' + path.resolve(__dirname, '..', pageInfo.file).replace(/\\/g, '/');

    for (const vp of viewports) {
      await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1.5 });
      await page.goto(filePath, { waitUntil: 'networkidle0' });
      await new Promise(r => setTimeout(r, 600));

      const outPath = path.join(outDir, `${pageInfo.name}_${vp.device}.png`);
      await page.screenshot({ path: outPath, fullPage: false });
      console.log(`Saved screenshot: ${outPath}`);
    }
    await page.close();
  }

  await browser.close();
  console.log('All auth screenshots captured successfully!');
})();
