const fs = require('fs');
const path = require('path');

const files = [
  'plans.html',
  'coming-soon.html',
  'contact.html',
  'privacy.html',
  'terms.html',
  'profile.html',
  'login.html'
];

console.log('=== Universal Consistency Verification ===');
let hasError = false;

for (const f of files) {
  const fp = path.join(__dirname, '..', f);
  if (!fs.existsSync(fp)) {
    console.error(`File missing: ${f}`);
    hasError = true;
    continue;
  }
  const content = fs.readFileSync(fp, 'utf8');
  const ananyaMatch = /ananya/i.test(content);
  const overflowCheck = content.includes('overflow-x: hidden') || content.includes('overflow-x:clip') || content.includes('overflow-x: hidden !important');
  const safeBackCheck = /safeGoBack|vanviGoBack|history\.back/i.test(content);

  console.log(`[${f}]: Ananya = ${ananyaMatch ? 'FAIL' : 'PASS'}, Overflow-X = ${overflowCheck ? 'PASS' : 'FAIL'}, BackBtn = ${safeBackCheck ? 'PASS' : 'FAIL'}`);

  if (ananyaMatch || !overflowCheck || !safeBackCheck) {
    hasError = true;
  }
}

if (!hasError) {
  console.log('✅ ALL PAGES FULLY CONSISTENT AND VERIFIED!');
} else {
  console.error('❌ Issues detected');
}
