const fs = require('fs');
const html = fs.readFileSync('ai.html', 'utf8');

console.log('=== AI.HTML SIMPLIFIED & SMART CHECKS ===');
console.log('1. Zoom Lock & Viewport check:', html.includes('user-scalable=no') && html.includes('maximum-scale=1.0') ? 'PASS' : 'FAIL');
console.log('2. Input font-size 16px (Anti-iOS-Zoom) check:', html.includes('font-size: 16px') ? 'PASS' : 'FAIL');
console.log('3. Overflow-x hidden check:', html.includes('overflow-x: hidden !important') ? 'PASS' : 'FAIL');
console.log('4. 3 Variation Tabs present:', html.includes('tabVar1') && html.includes('tabVar2') && html.includes('tabVar3') ? 'PASS' : 'FAIL');
console.log('5. Matched Template Card present:', html.includes('matchedCard') && html.includes('recLink') ? 'PASS' : 'FAIL');
console.log('6. Back to Site & Home link present:', html.includes('href="index.html"') ? 'PASS' : 'FAIL');
console.log('7. Dynamic Smart Engine (pick helper & random arrays):', html.includes('function pick(') && html.includes('buildDynamicMoments(') ? 'PASS' : 'FAIL');
console.log('8. WhatsApp Share & Copy Text actions:', html.includes('btnCopy') && html.includes('btnWhatsapp') ? 'PASS' : 'FAIL');
const cardCount = html.split('class="card-item"').length - 1;
console.log('9. Filterable Template Cards count (' + cardCount + '):', cardCount >= 8 ? 'PASS' : 'FAIL');
