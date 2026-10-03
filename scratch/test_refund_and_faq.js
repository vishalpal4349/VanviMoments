const http = require('http');
const fs = require('fs');
const path = require('path');

const pages = ['refund.html', 'faq.html'];

for (const p of pages) {
  const fp = path.join(__dirname, '..', p);
  const content = fs.readFileSync(fp, 'utf8');
  console.log(`=== Testing ${p} ===`);
  console.log('Size:', content.length);
  console.log('Has Ananya:', /ananya/i.test(content));
  console.log('Has safeGoBack:', content.includes('safeGoBack()'));
  console.log('Has overflow-x: hidden:', content.includes('overflow-x: hidden !important'));
  console.log('Has Bottom Dock:', content.includes('vanvi-bottom-dock'));
  console.log('Has Brand Sparkle:', content.includes('brand-spark'));
  console.log('Has WhatsApp link:', content.includes('wa.me/917631442934'));
}

// HTTP checks
for (const p of pages) {
  http.get(`http://localhost:5500/${p}`, (res) => {
    console.log(`HTTP ${p} Status:`, res.statusCode);
  }).on('error', (e) => {
    console.error(`HTTP ${p} Error:`, e.message);
  });
}
