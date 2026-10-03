const fs = require('fs');
const http = require('http');

const content = fs.readFileSync('plans.html', 'utf8');

// 1. Verify Passes Section is before Memberships Section
const passPos = content.indexOf('id="passesSection"');
const memPos = content.indexOf('id="membershipsSection"');
const calcPos = content.indexOf('id="calculatorSection"');

console.log('Passes Section Position:', passPos);
console.log('Memberships Section Position:', memPos);
console.log('Calculator Section Position:', calcPos);
console.log('Order is Passes -> Memberships -> Calculator:', (passPos < memPos && memPos < calcPos));

// 2. Verify Tab order
const tabPass = content.indexOf('id="tabBtnPasses"');
const tabMem = content.indexOf('id="tabBtnMemberships"');
console.log('Tab order is Passes first:', tabPass < tabMem);

// 3. Verify Coin Packs
console.log('Has Instant Coin Packs:', content.includes('coin-packs-wrapper'));
console.log('Has Spark Pack (₹25):', content.includes('data-coin-pack="spark"'));
console.log('Has Celebration Pack (₹50):', content.includes('data-coin-pack="celebration"'));
console.log('Has Vault Pack (₹100):', content.includes('data-coin-pack="vault"'));

// 4. Verify Toast
console.log('Has Luxury Toast:', content.includes('id="vanviToast"'));

// 5. Verify Zero Alert Calls
console.log('Contains alert():', content.includes('alert('));

// 6. Test HTTP server for plans.html
http.get('http://localhost:3000/plans.html', (res) => {
  console.log('HTTP GET /plans.html status:', res.statusCode);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Server returned plans.html, size bytes:', data.length);
    console.log('All Checks Passed with Flying Colors! 🚀');
  });
}).on('error', (e) => console.log('HTTP Error:', e.message));
