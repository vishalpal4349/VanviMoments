const fs = require('fs');
const path = require('path');

const templatesDir = path.resolve('templates');
const folders = fs.readdirSync(templatesDir).filter(f => fs.statSync(path.join(templatesDir, f)).isDirectory());
// Also include Bestie Friendship😘
folders.unshift('Bestie Friendship😘');

const results = [];

folders.forEach(folder => {
  const baseDir = folder === 'Bestie Friendship😘' ? path.resolve(folder) : path.join(templatesDir, folder);
  const indexPath = path.join(baseDir, 'index.html');
  const builderPath = path.join(baseDir, 'builder.html');
  const previewPath = path.join(baseDir, 'preview.html');
  const jsonPath = path.join(baseDir, 'template.json');

  const hasIndex = fs.existsSync(indexPath);
  const hasBuilder = fs.existsSync(builderPath);
  const hasPreview = fs.existsSync(previewPath);
  const hasJson = fs.existsSync(jsonPath);

  let indexContent = hasIndex ? fs.readFileSync(indexPath, 'utf8') : '';
  let builderContent = hasBuilder ? fs.readFileSync(builderPath, 'utf8') : '';

  // 1. Interactive buttons
  const buttons = {
    music: /audio|soundtrack|bgm|bgMusic|music-toggle|toggleMusic/i.test(indexContent),
    rsvp: /rsvp|attendance|whatsapp|confirm-rsvp|btn-rsvp/i.test(indexContent),
    countdown: /countdown|timer|muhurat|days|hours|minutes|seconds/i.test(indexContent),
    itinerary: /itinerary|timeline|schedule|events/i.test(indexContent),
    giftOrScratch: /scratch|gift|balloon|envelope|polaroid/i.test(indexContent)
  };

  // 2. Mobile fitting & button sizes
  let mobileFitStatus = 'Good';
  let buttonFitNotes = [];
  
  if (hasBuilder) {
    const hasMediaQueries = /@media\s*\(max-width:\s*(?:600|480|360)px\)/i.test(builderContent);
    const hasBottomBarClamp = /btn-nav-step\s*\{[^}]*flex:\s*1/i.test(builderContent) || /editor-bottom-bar/i.test(builderContent);
    const hasFixedHugeButtons = /width:\s*[2-9]\d{2}px/i.test(builderContent);
    
    if (!hasMediaQueries) {
      mobileFitStatus = 'Needs Mobile Queries';
      buttonFitNotes.push('Missing 360px mobile media query');
    } else {
      mobileFitStatus = 'Mobile Responsive (320px–414px)';
    }
  } else {
    mobileFitStatus = 'No Builder (Index-only view)';
  }

  // 3. Payment / Checkout
  let paymentStatus = 'Not Linked';
  let priceFound = null;

  if (hasBuilder) {
    const rzpMatch = builderContent.match(/(?:razorpay|create-order|vanvi-checkout|price|launchPrice|amount)[\s\S]{0,100}?(\d{2,4})/i);
    const priceTextMatch = builderContent.match(/₹\s*(\d{2,4})/);
    if (priceTextMatch) priceFound = priceTextMatch[1];
    else if (rzpMatch) priceFound = rzpMatch[1];

    if (/razorpay|create-order|vanvi-checkout/i.test(builderContent)) {
      paymentStatus = 'Linked to Razorpay (₹' + (priceFound || 'Active') + ')';
    } else if (priceFound) {
      paymentStatus = 'Price Set (₹' + priceFound + ')';
    }
  }

  // 4. Watermark
  const hasWatermark = /vanvi-watermark|watermark/i.test(indexContent) || /vanvi-watermark|watermark/i.test(builderContent);
  const watermarkRemovable = /isUnlocked|hasPaid|removeWatermark|watermark.*none/i.test(builderContent) || /isUnlocked/i.test(indexContent);

  // 5. Completion Category
  let categoryStatus = 'Production Ready';
  if (!hasBuilder) {
    categoryStatus = 'Index View Only (Catalog)';
  } else if (paymentStatus.startsWith('Linked') && buttons.music) {
    categoryStatus = '100% Complete & Live';
  } else {
    categoryStatus = 'Active Interactive Template';
  }

  results.push({
    folder,
    hasIndex,
    hasBuilder,
    hasPreview,
    buttons,
    mobileFitStatus,
    buttonFitNotes,
    paymentStatus,
    priceFound,
    hasWatermark,
    watermarkRemovable,
    categoryStatus
  });
});

console.log(JSON.stringify(results, null, 2));
