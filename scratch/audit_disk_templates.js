const fs = require('fs');
const path = require('path');

const tplDir = path.join(__dirname, '..', 'templates');
const folders = fs.readdirSync(tplDir).filter(f => fs.statSync(path.join(tplDir, f)).isDirectory());

console.log(`Found ${folders.length} template folders in /templates`);

const folderAudit = folders.map(folder => {
  const fPath = path.join(tplDir, folder);
  const indexPath = path.join(fPath, 'index.html');
  const builderPath = path.join(fPath, 'builder.html');
  const previewPath = path.join(fPath, 'preview.html');
  const tplJsonPath = path.join(fPath, 'template.json');

  const info = {
    folder,
    hasIndex: fs.existsSync(indexPath),
    hasBuilder: fs.existsSync(builderPath),
    hasPreview: fs.existsSync(previewPath),
    hasTemplateJson: fs.existsSync(tplJsonPath),
    hasWatermark: false,
    hasCheckoutLink: false,
    checkoutAmount: null,
    hasMobileRules: false,
    buttonFitMobile: false,
    buttonsFound: [],
    externalBrands: []
  };

  if (info.hasIndex) {
    const idx = fs.readFileSync(indexPath, 'utf8');
    if (idx.includes('vanviWatermark') || idx.includes('vanvi-watermark')) info.hasWatermark = true;
    if (idx.includes('cutiepage')) info.externalBrands.push('cutiepage');
    if (idx.includes('audio') || idx.includes('music')) info.buttonsFound.push('music');
    if (idx.includes('rsvp') || idx.includes('RSVP')) info.buttonsFound.push('rsvp');
    if (idx.includes('countdown') || idx.includes('cdDays')) info.buttonsFound.push('countdown');
  }

  if (info.hasBuilder) {
    const bld = fs.readFileSync(builderPath, 'utf8');
    if (bld.includes('checkout.html') || bld.includes('Razorpay')) info.hasCheckoutLink = true;
    const matchAmt = bld.match(/amount=(\d+)/) || bld.match(/price=(\d+)/) || bld.match(/₹(\d+)/);
    if (matchAmt) info.checkoutAmount = matchAmt[1];
    if (bld.includes('@media (max-width: 600px)') || bld.includes('@media (max-width: 480px)')) info.hasMobileRules = true;
    if (bld.includes('flex: 1') && bld.includes('.btn-nav-step') || bld.includes('.btn-nav-step')) info.buttonFitMobile = true;
    if (bld.includes('cutiepage')) info.externalBrands.push('cutiepage');
  }

  return info;
});

console.log(JSON.stringify(folderAudit, null, 2));
