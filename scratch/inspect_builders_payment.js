const fs = require('fs');
const path = require('path');

const dirs = fs.readdirSync('templates').filter(f => fs.statSync(path.join('templates', f)).isDirectory());

console.log(`Inspecting ${dirs.length} template builders for payment / checkout logic:\n`);

dirs.forEach(d => {
  const bPath = path.join('templates', d, 'builder.html');
  if (!fs.existsSync(bPath)) {
    console.log(`❌ [${d}] No builder.html`);
    return;
  }
  const content = fs.readFileSync(bPath, 'utf8');
  const hasCheckout = content.includes('checkout.html');
  const hasVanviBuilderCore = content.includes('VanviBuilderCore');
  const hasRazorpay = content.includes('Razorpay') || content.includes('VanviRazorpay');
  const saveCalls = [...content.matchAll(/(saveMoment|handlePublish|save\(|processPayment)/g)].map(m => m[0]);
  
  console.log(`[${d}]: hasCheckout=${hasCheckout}, hasBuilderCore=${hasVanviBuilderCore}, hasRazorpay=${hasRazorpay}, actions=[${[...new Set(saveCalls)].join(', ')}]`);
});
