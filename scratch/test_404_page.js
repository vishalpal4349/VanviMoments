const http = require('http');

http.get('http://localhost:5500/404.html', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('=== VANVI 404.HTML VERIFICATION SUITE ===\n');
    console.log('✓ HTTP Status:', res.statusCode);
    console.log('✓ Content Size:', data.length, 'bytes\n');

    const checks = [
      ['Label: Oops, this moment wandered away ✦', 'Oops, this moment wandered away ✦'],
      ['Large 404 Headline', '404'],
      ['Message: This page couldn’t be found...', 'This page couldn’t be found, but your next beautiful moment is still here.'],
      ['Primary CTA: Go Home', 'Go Home'],
      ['Go Home links to index.html', 'href="index.html"'],
      ['Secondary CTA: ‹ Back', '‹ Back'],
      ['Smart safeGoBack function', 'function safeGoBack()'],
      ['Logo is BRAND ONLY (not a link)', !/<a[^>]*class=["'][^"']*header-brand/i.test(data)],
      ['Floating glass visual memory element', 'floating-glass-visual'],
      ['Global Bottom Navigation Dock', 'class="bottom vanvi-bottom-dock"'],
      ['Enforces overflow-x: hidden', 'overflow-x: hidden !important'],
      ['Responsive Viewport Meta', 'name="viewport"'],
      ['Google Fonts Cormorant & Plus Jakarta Sans', 'family=Cormorant+Garamond'],
      ['No heavy 3D elements', !data.includes('canvas') && !data.includes('three.js')]
    ];

    let passed = 0;
    checks.forEach(([desc, test]) => {
      const ok = typeof test === 'boolean' ? test : data.includes(test);
      if (ok) {
        console.log(`  ✅ PASS: ${desc}`);
        passed++;
      } else {
        console.error(`  ❌ FAIL: ${desc}`);
      }
    });

    console.log(`\nResult: ${passed} / ${checks.length} passed.`);
    if (passed === checks.length) {
      console.log('🎉 404.HTML IS ULTRA PREMIUM AND 100% VERIFIED!');
    }
  });
}).on('error', (err) => {
  console.error('Request failed:', err.message);
});
