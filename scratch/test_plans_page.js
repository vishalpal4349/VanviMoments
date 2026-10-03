const http = require('http');
const fs = require('fs');
const path = require('path');

const plansPath = path.join(__dirname, '..', 'plans.html');
const content = fs.readFileSync(plansPath, 'utf8');

console.log('=== Checking plans.html ===');
console.log('File size:', content.length);
console.log('Contains Ananya:', /ananya/i.test(content));
console.log('Contains overflow-x: hidden:', content.includes('overflow-x: hidden !important'));
console.log('Has safeGoBack:', content.includes('safeGoBack()'));
console.log('Has Segmented Switcher:', content.includes('category-switcher'));
console.log('Has Decision Guide:', content.includes('decision-helper-box'));
console.log('Has Memberships Section:', content.includes('id="membershipsSection"'));
console.log('Has Passes Section:', content.includes('id="passesSection"'));
console.log('Has Calculator Section:', content.includes('id="calculatorSection"'));
console.log('Has Light Luxury Modal:', content.includes('sub-modal-card'));
console.log('Has Bottom Dock:', content.includes('vanvi-bottom-dock'));

// HTTP Status check
http.get('http://localhost:5500/plans.html', (res) => {
  console.log('HTTP Status Code:', res.statusCode);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Served Payload Length:', data.length);
  });
}).on('error', (err) => {
  console.error('HTTP Error:', err.message);
});
