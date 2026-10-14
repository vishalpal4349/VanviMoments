const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');

const root = path.resolve(__dirname, '..');
const dirs = fs.readdirSync(path.join(root, 'templates'), { withFileTypes: true })
  .filter(entry => entry.isDirectory()).map(entry => entry.name).sort();
const pages = dirs.flatMap(folder => ['index.html', 'builder.html', 'preview.html']
  .filter(file => fs.existsSync(path.join(root, 'templates', folder, file)))
  .map(file => ({ folder, file })));

(async () => {
  const browser = await chromium.launch();
  const results = [];
  const page = await browser.newPage({ viewport: { width: 320, height: 740 } });
  page.setDefaultTimeout(4000);
  for (const item of pages) {
    const result = { ...item, overflow: [], pageErrors: [], requestFailures: [], watermark: null, floatingPill: null };
    for (const width of [320, 390, 420]) {
      await page.setViewportSize({ width, height: 740 });
      const onPageError = error => result.pageErrors.push(error.message);
      const onRequestFailed = request => {
        const url = request.url();
        if (url.startsWith('file:')) result.requestFailures.push(url);
      };
      page.on('pageerror', onPageError);
      page.on('requestfailed', onRequestFailed);
      const url = `file:///${path.join(root, 'templates', item.folder, item.file).replace(/\\/g, '/')}`;
      try {
        await page.goto(url, { waitUntil: 'commit', timeout: 4000 });
        const metrics = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          watermark: Boolean(document.querySelector('#demoWatermarkBadge')),
          pill: Boolean(document.querySelector('.pill, .floating-action-pill, [data-action="customize"]'))
        }));
        if (metrics.scrollWidth > metrics.clientWidth) result.overflow.push({ width, ...metrics });
        if (item.file === 'preview.html') { result.watermark = metrics.watermark; result.floatingPill = metrics.pill; }
      } catch (error) { result.pageErrors.push(`navigation: ${error.message}`); }
      page.off('pageerror', onPageError);
      page.off('requestfailed', onRequestFailed);
    }
    result.pageErrors = [...new Set(result.pageErrors)];
    result.requestFailures = [...new Set(result.requestFailures)];
    results.push(result);
  }
  await page.close();
  await browser.close();
  const summary = { pages: results.length, overflowPages: results.filter(item => item.overflow.length).length,
    pagesWithErrors: results.filter(item => item.pageErrors.length).length,
    localRequestFailurePages: results.filter(item => item.requestFailures.length).length,
    previewFailures: results.filter(item => item.file === 'preview.html' && (!item.watermark || !item.floatingPill)).length, results };
  fs.writeFileSync(path.join(__dirname, 'browser-template-audit.json'), JSON.stringify(summary, null, 2));
  console.log(JSON.stringify(summary, null, 2));
  if (summary.overflowPages || summary.pagesWithErrors || summary.localRequestFailurePages || summary.previewFailures) process.exitCode = 1;
})();
