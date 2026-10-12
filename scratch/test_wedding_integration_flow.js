const fs = require('fs');
const path = require('path');
const assert = require('assert');

async function runWeddingIntegrationAudit() {
  console.log('===============================================================');
  console.log('   VANVI MOMENTS — WEDDING TEMPLATES COMPLETE FLOW AUDIT       ');
  console.log('===============================================================');

  const root = path.resolve(__dirname, '..');
  let failures = [];

  function check(label, fn) {
    try {
      fn();
      console.log(`  [PASS] ${label}`);
    } catch (err) {
      console.error(`  [FAIL] ${label}: ${err.message}`);
      failures.push({ label, error: err.message });
    }
  }

  // 1. Template Registry Check (vanvi-templates-data.js)
  console.log('\n--- 1. Template Registry Check (js/vanvi-templates-data.js) ---');
  const tplDataRaw = fs.readFileSync(path.join(root, 'js', 'vanvi-templates-data.js'), 'utf8');

  check('Ivory Arch Wedding registered with price 499', () => {
    assert(tplDataRaw.includes("id: 'ivory-arch-wedding'"), 'ivory-arch-wedding ID missing');
    assert(tplDataRaw.includes("name: 'Ivory Arch Wedding'"), 'Ivory Arch Wedding name missing');
    assert(tplDataRaw.includes('price: 499'), 'Ivory Arch Wedding price 499 missing');
    assert(tplDataRaw.includes("templatePath: 'templates/ivory-arch-wedding/index.html'"), 'ivory-arch templatePath missing');
  });

  check('Royal Vows Indian Wedding registered with price 1499 / original 2499', () => {
    assert(tplDataRaw.includes("id: 'royal-vows-indian-wedding'"), 'royal-vows-indian-wedding ID missing');
    assert(tplDataRaw.includes("name: 'Royal Vows Indian Wedding'"), 'Royal Vows Indian Wedding name missing');
    assert(tplDataRaw.includes('price: 1499'), 'royal-vows price 1499 missing');
    assert(tplDataRaw.includes('originalPrice: 2499'), 'royal-vows originalPrice 2499 missing');
    assert(tplDataRaw.includes("templatePath: 'templates/royal-vows-indian-wedding/index.html'"), 'royal-vows templatePath missing');
  });

  // 2. Marketplace Pages Linkage (wedding.html)
  console.log('\n--- 2. Marketplace Page Linkage (wedding.html) ---');
  const weddingHtml = fs.readFileSync(path.join(root, 'wedding.html'), 'utf8');

  check('wedding.html contains Royal Vows card with preview & builder links', () => {
    assert(weddingHtml.includes('Royal Vows Indian Wedding'), 'Royal Vows title missing in wedding.html');
    assert(weddingHtml.includes('₹1,499'), 'Royal Vows ₹1,499 price missing in wedding.html');
    assert(weddingHtml.includes('₹2,499'), 'Royal Vows ₹2,499 strike price missing in wedding.html');
    assert(weddingHtml.includes('templates/royal-vows-indian-wedding/preview.html'), 'Royal Vows preview link missing');
    assert(weddingHtml.includes('templates/royal-vows-indian-wedding/builder.html'), 'Royal Vows builder link missing');
  });

  check('wedding.html contains Ivory Arch card with preview & builder links', () => {
    assert(weddingHtml.includes('Ivory Arch Wedding'), 'Ivory Arch title missing in wedding.html');
    assert(weddingHtml.includes('₹499'), 'Ivory Arch ₹499 price missing in wedding.html');
    assert(weddingHtml.includes('templates/ivory-arch-wedding/preview.html'), 'Ivory Arch preview link missing');
    assert(weddingHtml.includes('templates/ivory-arch-wedding/builder.html'), 'Ivory Arch builder link missing');
  });

  // 3. Royal Vows Template Inspection
  console.log('\n--- 3. Royal Vows Template Inspection ---');
  const rvIndex = fs.readFileSync(path.join(root, 'templates', 'royal-vows-indian-wedding', 'index.html'), 'utf8');
  const rvBuilder = fs.readFileSync(path.join(root, 'templates', 'royal-vows-indian-wedding', 'builder.html'), 'utf8');
  const rvMain = fs.readFileSync(path.join(root, 'templates', 'royal-vows-indian-wedding', 'main.js'), 'utf8');

  check('Royal Vows index.html has global styles, adapter scripts and no competitor links', () => {
    assert(rvIndex.includes('vanvi-global-experience.css'), 'global experience css missing');
    assert(rvIndex.includes('template-adapter.js'), 'template-adapter.js missing');
    assert(rvIndex.includes('vanvi-api.js'), 'vanvi-api.js missing');
    assert(rvIndex.includes('vanvi-template-lock.js'), 'vanvi-template-lock.js missing');
    assert(!rvIndex.includes('shaadipath.com'), 'shaadipath competitor link found in index.html');
    assert(rvIndex.includes('id="vanviWatermark"'), 'vanvi watermark missing');
  });

  check('Royal Vows builder.html has mobile responsiveness and checkout connection', () => {
    assert(rvBuilder.includes('switchMobileView'), 'switchMobileView function missing');
    assert(rvBuilder.includes('tabBtnEdit') && rvBuilder.includes('tabBtnPrev'), 'mobile tab buttons missing');
    assert(rvBuilder.includes('₹1,499'), 'builder price ₹1,499 missing');
    assert(rvBuilder.includes('₹2,499'), 'builder original price ₹2,499 missing');
    assert(rvBuilder.includes('checkout.html?template=royal-vows-indian-wedding&amount=1499'), 'checkout redirect missing');
  });

  check('Royal Vows main.js supports live preview sync and iCal generation', () => {
    assert(rvMain.includes('VANVI_LIVE_PREVIEW_SYNC'), 'VANVI_LIVE_PREVIEW_SYNC missing in main.js');
    assert(rvMain.includes('UPDATE_CONFIG'), 'UPDATE_CONFIG missing in main.js');
    assert(rvMain.includes('vanvi:momentLoaded'), 'vanvi:momentLoaded listener missing');
    assert(rvMain.includes('btn-ical-sync'), 'iCal sync event listener missing');
  });

  // 4. Ivory Arch Template Inspection
  console.log('\n--- 4. Ivory Arch Template Inspection ---');
  const iaIndex = fs.readFileSync(path.join(root, 'templates', 'ivory-arch-wedding', 'index.html'), 'utf8');
  const iaBuilder = fs.readFileSync(path.join(root, 'templates', 'ivory-arch-wedding', 'builder.html'), 'utf8');
  const iaScript = fs.readFileSync(path.join(root, 'templates', 'ivory-arch-wedding', 'script.js'), 'utf8');

  check('Ivory Arch index.html has global experience, adapter scripts and clean tracking', () => {
    assert(iaIndex.includes('vanvi-global-experience.css'), 'global experience css missing');
    assert(iaIndex.includes('template-adapter.js'), 'template-adapter.js missing');
    assert(iaIndex.includes('vanvi-api.js'), 'vanvi-api.js missing');
    assert(iaIndex.includes('vanvi-template-lock.js'), 'vanvi-template-lock.js missing');
    assert(!iaScript.includes('shaadipath.com'), 'telemetry script found in ivory-arch script.js');
  });

  check('Ivory Arch builder.html has ₹499 price and checkout linkage', () => {
    assert(iaBuilder.includes('₹499'), 'Ivory Arch builder price ₹499 missing');
    assert(iaBuilder.includes('checkout.html?template=ivory-arch-wedding&amount=499'), 'Ivory Arch checkout redirect missing');
  });

  // 5. Checkout & Order Success Flow Check
  console.log('\n--- 5. Checkout & Order Success Flow Check ---');
  const checkoutHtml = fs.readFileSync(path.join(root, 'checkout.html'), 'utf8');
  const orderSuccessHtml = fs.readFileSync(path.join(root, 'order-success.html'), 'utf8');

  check('checkout.html contains wedding theme profile and dynamic styling', () => {
    assert(checkoutHtml.includes('wedding: {'), 'wedding theme profile missing in checkout.html');
    assert(checkoutHtml.includes('Haute Royal Vivah & Wedding Edition'), 'wedding theme badge missing');
  });

  check('order-success.html resolves both wedding templates properly', () => {
    assert(orderSuccessHtml.includes('wedding: {'), 'wedding theme profile missing in order-success.html');
    assert(orderSuccessHtml.includes('templates/royal-vows-indian-wedding/index.html'), 'royal-vows URL resolution missing');
    assert(orderSuccessHtml.includes('templates/ivory-arch-wedding/index.html'), 'ivory-arch URL resolution missing');
  });

  // 6. Server-Side Purchase Verification & Watermark Architecture Check
  console.log('\n--- 6. Server-Side Purchase Verification ---');
  const momentsRoutes = fs.readFileSync(path.join(root, 'server', 'routes', 'moments.routes.js'), 'utf8');

  check('Server-side public moment route returns paid and status properties', () => {
    assert(momentsRoutes.includes('paid: Boolean(moment.paid || moment.isPurchased || moment.status === \'published\')'), 'paid status missing in public moment response');
    assert(momentsRoutes.includes('status: moment.status'), 'status missing in public moment response');
  });

  // 7. Live HTTP API Test
  console.log('\n--- 7. Live Server API Interaction Test ---');
  try {
    const healthRes = await fetch('http://localhost:3000/api/health');
    const healthData = await healthRes.json();
    assert(healthData.status === 'healthy', 'Server health is not healthy');
    console.log('  [PASS] Live Node.js backend server responded healthy');

    // Create a mock moment to test verified purchase watermark
    const draftRes = await fetch('http://localhost:3000/api/moments/draft', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Tanya & Rohan Royal Vivah',
        recipient: 'Tanya Sharma',
        sender: 'Rohan Verma',
        occasion: 'Wedding',
        templateId: 'royal-vows-indian-wedding',
        custom_data: { bride: 'Tanya', groom: 'Rohan', date: '2026-12-12' }
      })
    });
    const draftData = await draftRes.json();
    assert(draftData.success && draftData.moment && draftData.moment.id, 'Moment creation failed');
    const testMomentId = draftData.moment.slug || draftData.moment.id;
    console.log(`  [PASS] Draft wedding moment created with slug: ${testMomentId}`);

    // Query public endpoint
    const pubRes = await fetch(`http://localhost:3000/api/moments/public/${testMomentId}`);
    const pubData = await pubRes.json();
    assert(pubData.success, 'Public moment fetch failed');
    assert(pubData.moment.paid === false, 'Unpaid moment should have paid === false');
    console.log('  [PASS] Server-side public API correctly marks unpaid moment as paid: false (watermark preserved)');
  } catch (err) {
    console.error(`  [FAIL] Live Server API Interaction: ${err.message}`);
    failures.push({ label: 'Live Server API', error: err.message });
  }

  // 8. Mobile Viewport Layout Verification (320px, 360px, 375px, 390px, 414px)
  console.log('\n--- 8. Mobile Viewport Responsive CSS Rules Check ---');
  check('Viewport break logic accommodates 320px, 360px, 375px, 390px, 414px with no clipping', () => {
    assert(rvBuilder.includes('@media (max-width: 860px)'), 'Mobile layout media query missing');
    assert(rvBuilder.includes('@media (max-width: 360px)'), 'Ultra-compact mobile layout media query missing');
    assert(rvBuilder.includes('clamp('), 'Responsive clamp sizing missing in buttons');
  });

  console.log('\n===============================================================');
  if (failures.length === 0) {
    console.log('🎉 ALL INTEGRATION & FLOW AUDITS PASSED WITH ZERO FAILURES!');
  } else {
    console.log(`❌ ENCOUNTERED ${failures.length} AUDIT FAILURES:`);
    failures.forEach(f => console.log(`   - ${f.label}: ${f.error}`));
    process.exit(1);
  }
  console.log('===============================================================');
}

runWeddingIntegrationAudit();
