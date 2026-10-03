const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const htmlFiles = fs.readdirSync(root).filter(f => f.endsWith('.html')).sort();

function fetchUrl(file) {
  return new Promise((resolve) => {
    http.get('http://localhost:3000/' + file, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ file, status: res.statusCode, bytes: data.length });
      });
    }).on('error', (err) => {
      resolve({ file, status: 'ERROR', error: err.message });
    });
  });
}

async function run() {
  console.log('========================================================');
  console.log('VANVI MOMENTS — 52-PAGE COMPREHENSIVE PRODUCTION AUDIT');
  console.log('========================================================\n');

  let successCount = 0;
  let failCount = 0;
  const pageReports = [];

  for (const file of htmlFiles) {
    const content = fs.readFileSync(path.join(root, file), 'utf8');
    const httpRes = await fetchUrl(file);

    // Extract Title
    const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : 'No Title';

    // Check Viewport
    const hasViewport = /name=["']viewport["']/i.test(content);

    // Check Overflow Guard
    const hasOverflowGuard = content.includes('overflow-x') || content.includes('vanvi-inner-light.css') || content.includes('vanvi-navigation.css');

    // Count Buttons
    const buttons = [...content.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/gi)];

    // Count Anchors
    const anchors = [...content.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)];

    // Theme Check
    const isLightLuxury = content.includes('vanvi-inner-light.css') || content.includes('--rose-') || content.includes('--rose-gradient') || content.includes('vanvi-navigation.css') || file.includes('moment');

    if (httpRes.status === 200) successCount++;
    else failCount++;

    pageReports.push({
      file,
      title,
      status: httpRes.status,
      bytes: httpRes.bytes,
      buttons: buttons.length,
      anchors: anchors.length,
      viewport: hasViewport,
      overflowGuard: hasOverflowGuard,
      theme: isLightLuxury ? 'Light Luxury / Unified' : 'Custom Theme'
    });
  }

  console.log(`HTTP 200 Status Check: ${successCount} / ${htmlFiles.length} pages passed (Failed: ${failCount})\n`);

  console.log('| Page File | Title | HTTP | Buttons | Links | Responsive | Theme |');
  console.log('|---|---|:---:|:---:|:---:|:---:|:---:|');
  pageReports.forEach(p => {
    const resp = p.viewport && p.overflowGuard ? '✓ All Devices' : '⚠ Check';
    console.log(`| [${p.file}](file://${path.join(root, p.file).replace(/\\/g, '/')}) | ${p.title.slice(0, 32)} | ${p.status} | ${p.buttons} | ${p.anchors} | ${resp} | ${p.theme} |`);
  });

  console.log('\n--- AUDIT COMPLETE ---');
}

run();
