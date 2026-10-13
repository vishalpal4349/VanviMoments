const fs = require('fs');
const path = require('path');

const templatesData = require('../js/vanvi-templates-data.js');
const allTemplates = templatesData.getAll();

console.log(`=== AUDITING ALL ${allTemplates.length} REGISTERED TEMPLATES ===\n`);

const thumbnailCounts = {};
allTemplates.forEach(t => {
  const thumb = t.thumbnail || 'NONE';
  thumbnailCounts[thumb] = (thumbnailCounts[thumb] || 0) + 1;
});

const results = [];

allTemplates.forEach(t => {
  const res = {
    id: t.id,
    name: t.name,
    category: t.category,
    price: t.price,
    isFree: t.isFree,
    thumbnail: t.thumbnail,
    isDuplicateThumb: (thumbnailCounts[t.thumbnail] || 0) > 1,
    hasExternalRef: (t.thumbnail && (t.thumbnail.includes('cutiepage') || t.thumbnail.includes('unsplash'))) || false,
    templatePathExists: false,
    builderPathExists: false,
    hasCheckoutLink: false,
    hasMobileResponsiveBuilder: false,
    hasWorkingButtons: {
      music: false,
      rsvp: false,
      countdown: false,
      watermark: false
    },
    notes: []
  };

  // Check template file
  const tplPath = t.templatePath ? path.join(__dirname, '..', t.templatePath) : null;
  if (tplPath && fs.existsSync(tplPath)) {
    res.templatePathExists = true;
    const content = fs.readFileSync(tplPath, 'utf8');
    if (content.includes('audio') || content.includes('music')) res.hasWorkingButtons.music = true;
    if (content.includes('rsvp') || content.includes('<form') || content.includes('RSVP')) res.hasWorkingButtons.rsvp = true;
    if (content.includes('countdown') || content.includes('cdDays') || content.includes('updateCountdown')) res.hasWorkingButtons.countdown = true;
    if (content.includes('vanviWatermark') || content.includes('vanvi-watermark')) res.hasWorkingButtons.watermark = true;
    if (content.includes('cutiepage')) res.notes.push('Contains cutiepage reference in index.html');
  } else {
    res.notes.push('Template index file missing on disk');
  }

  // Check builder file
  const bldPath = t.builderPath ? path.join(__dirname, '..', t.builderPath) : null;
  if (bldPath && fs.existsSync(bldPath)) {
    res.builderPathExists = true;
    const bContent = fs.readFileSync(bldPath, 'utf8');
    if (bContent.includes('checkout.html') || bContent.includes('Razorpay') || bContent.includes('razorpay')) res.hasCheckoutLink = true;
    if (bContent.includes('@media (max-width: 600px)') || bContent.includes('@media (max-width: 768px)') || bContent.includes('@media (max-width: 900px)')) {
      res.hasMobileResponsiveBuilder = true;
    }
    if (bContent.includes('cutiepage')) res.notes.push('Contains cutiepage reference in builder.html');
  } else {
    res.notes.push('No dedicated builder.html');
  }

  results.push(res);
});

console.log(JSON.stringify(results, null, 2));

// Summary of Duplicate Thumbnails
console.log('\n=== DUPLICATE / GENERIC THUMBNAILS ===');
Object.entries(thumbnailCounts).forEach(([thumb, count]) => {
  if (count > 1) {
    const matching = allTemplates.filter(t => t.thumbnail === thumb).map(t => t.id);
    console.log(`Count ${count}: ${thumb}`);
    console.log(`  Templates: ${matching.join(', ')}`);
  }
});
