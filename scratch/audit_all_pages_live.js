const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATHS = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
];
let executablePath = null;
for (const p of CHROME_PATHS) {
  if (fs.existsSync(p)) { executablePath = p; break; }
}

function getHtmlPages() {
  const rootFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
  return rootFiles;
}

async function auditAllPages() {
  console.log('======================================================');
  console.log('🔍 VANVI MOMENTS — DEEP AUDIT OF ALL HTML PAGES');
  console.log('======================================================');

  const pages = getHtmlPages();
  console.log(`Found ${pages.length} root HTML pages to test.\n`);

  const browser = await chromium.launch({ executablePath, headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  
  const results = [];

  for (const pageName of pages) {
    const pageUrl = `http://localhost:3000/${pageName}`;
    const page = await context.newPage();
    const consoleErrors = [];
    const failedRequests = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Ignore expected third party external CDN/fonts network warnings if offline
        if (!text.includes('Failed to load resource: net::ERR_NAME_NOT_RESOLVED') &&
            !text.includes('favicon.ico')) {
          consoleErrors.push(text);
        }
      }
    });

    page.on('requestfailed', req => {
      const url = req.url();
      // Ignore external analytics or CDNs if blocked/offline
      if (url.includes('localhost:3000') && !url.includes('favicon.ico')) {
        failedRequests.push(`${req.method()} ${url} (${req.failure()?.errorText})`);
      }
    });

    page.on('response', resp => {
      if (resp.status() >= 400 && resp.url().includes('localhost:3000') && !resp.url().includes('favicon.ico')) {
        failedRequests.push(`HTTP ${resp.status()} on ${resp.url()}`);
      }
    });

    let loadSuccess = false;
    let title = '';
    let buttonsCount = 0;
    let inputsCount = 0;

    try {
      const resp = await page.goto(pageUrl, { waitUntil: 'domcontentloaded', timeout: 8000 });
      loadSuccess = resp ? resp.ok() : false;
      title = await page.title();
      buttonsCount = await page.$$eval('button, a.btn, [role="button"]', els => els.length);
      inputsCount = await page.$$eval('input, textarea, select', els => els.length);

      // Test theme switching
      for (const t of ['clay', 'emerald', 'glass']) {
        await page.evaluate(theme => {
          document.documentElement.setAttribute('data-vanvi-theme', theme);
        }, t);
      }
    } catch (err) {
      consoleErrors.push(`Page load error: ${err.message}`);
    }

    const hasIssue = consoleErrors.length > 0 || failedRequests.length > 0 || !loadSuccess;
    results.push({
      pageName,
      loadSuccess,
      title,
      buttonsCount,
      inputsCount,
      consoleErrors,
      failedRequests,
      status: hasIssue ? 'FAIL' : 'PASS'
    });

    if (hasIssue) {
      console.log(`❌ [${pageName}]: FAILED (Errors: ${consoleErrors.length}, Failed Req: ${failedRequests.length})`);
      if (consoleErrors.length) console.log('   Console Errors:', consoleErrors.slice(0, 3));
      if (failedRequests.length) console.log('   Failed Requests:', failedRequests.slice(0, 3));
    } else {
      console.log(`✅ [${pageName}]: 100% OK (${buttonsCount} buttons, ${inputsCount} inputs, Title: "${title.substring(0, 30)}...")`);
    }

    await page.close();
  }

  await browser.close();

  const totalPages = results.length;
  const passedPages = results.filter(r => r.status === 'PASS').length;
  const failedPages = results.filter(r => r.status === 'FAIL');

  console.log('\n======================================================');
  console.log(`🎯 TOTAL AUDIT RESULT: ${passedPages}/${totalPages} pages passed without any errors.`);
  if (failedPages.length > 0) {
    console.log(`⚠️ ${failedPages.length} pages need attention:`, failedPages.map(p => p.pageName));
  } else {
    console.log('🌟 ALL PAGES LOADED FLAWLESSLY WITH ZERO ERRORS!');
  }
  console.log('======================================================');

  fs.writeFileSync('scratch/audit_report.json', JSON.stringify({ passedPages, totalPages, failedPages }, null, 2));
}

auditAllPages().catch(err => {
  console.error('Audit fatal error:', err);
  process.exit(1);
});
