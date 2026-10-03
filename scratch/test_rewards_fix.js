const http = require('http');
const fs = require('fs');
const path = require('path');

const fp = path.join(__dirname, '..', 'rewards.html');
const content = fs.readFileSync(fp, 'utf8');

console.log('=== Checking rewards.html ===');
console.log('File size:', content.length);
console.log('Has Ananya:', /ananya/i.test(content));
console.log('Has safeGoBack:', content.includes('function safeGoBack()'));
console.log('Has overflow-x: hidden:', content.includes('overflow-x: hidden !important'));
console.log('Has Bottom Dock:', content.includes('vanvi-bottom-dock'));

// Check line 95-102
const lines = content.split('\n');
console.log('Lines 95 to 103:');
for (let i = 94; i <= 102 && i < lines.length; i++) {
  console.log(`${i+1}: ${lines[i]}`);
}

http.get('http://localhost:5500/rewards.html', (res) => {
  console.log('HTTP Status Code:', res.statusCode);
}).on('error', (err) => {
  console.error('HTTP Error:', err.message);
});
