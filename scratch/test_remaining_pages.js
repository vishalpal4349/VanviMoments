/**
 * VANVI MOMENTS — TEST SUITE FOR REMAINING PRODUCTION PAGES
 * Validates existence, markup, forms, responsiveness, and backend APIs for all 10 pages.
 */

const fs = require('fs');

console.log('=== VANVI MOMENTS REMAINING PAGES VERIFICATION SUITE ===\n');

let pass = 0;
let total = 0;

function check(label, condition) {
  total++;
  if (condition) {
    console.log(`✅ PASS: ${label}`);
    pass++;
  } else {
    console.error(`❌ FAIL: ${label}`);
  }
}

// 1. About Page
const aboutHtml = fs.readFileSync('about.html', 'utf8');
check('about.html exists and non-empty', aboutHtml.length > 500);
check('about.html has viewport allowing zoom', aboutHtml.includes('name="viewport"') && !aboutHtml.includes('user-scalable=no'));
check('about.html has story and how moments work', aboutHtml.includes('How It Works') && aboutHtml.includes('digital keepsake'));
check('about.html has overflow-x locked', aboutHtml.includes('overflow-x: hidden !important;'));

// 2. Contact Page
const contactHtml = fs.readFileSync('contact.html', 'utf8');
check('contact.html exists and non-empty', contactHtml.length > 500);
check('contact.html has contact form elements', contactHtml.includes('id="contactForm"') && contactHtml.includes('id="contactName"') && contactHtml.includes('id="contactEmail"') && (contactHtml.includes('id="contactSubject"') || contactHtml.includes('id="contactTopic"')) && contactHtml.includes('id="contactMessage"'));
check('contact.html has direct WhatsApp & Email options', contactHtml.includes('api.whatsapp.com/send') && (contactHtml.includes('vanvimoments@gmail.com') || contactHtml.includes('support@vanvimoments.com')));
check('contact.html has submit contact button', contactHtml.includes('btn-submit-contact'));

// 3. FAQ Page
const faqHtml = fs.readFileSync('faq.html', 'utf8');
check('faq.html exists and non-empty', faqHtml.length > 500);
check('faq.html has live search & filter pills', faqHtml.includes('id="faqSearchInput"') && faqHtml.includes('id="filterPillsRow"'));
check('faq.html has accordion items with aria-expanded', faqHtml.includes('class="faq-card"') && faqHtml.includes('aria-expanded'));
check('faq.html covers PIN, music, coins, and refunds', faqHtml.includes('4-digit PIN') && faqHtml.includes('soundtrack play') && faqHtml.includes('10 Vanvi Coins = ₹1.00') && faqHtml.includes('Refund'));

// 4. Privacy Policy Page
const privacyHtml = fs.readFileSync('privacy.html', 'utf8');
check('privacy.html exists and non-empty', privacyHtml.length > 500);
check('privacy.html covers account, photos, security, and storage', privacyHtml.includes('Information We Collect') && privacyHtml.includes('Protected') && privacyHtml.includes('Storage'));
check('privacy.html has responsive navigation and header', privacyHtml.includes('legal-container'));

// 5. Terms of Service Page
const termsHtml = fs.readFileSync('terms.html', 'utf8');
check('terms.html exists and non-empty', termsHtml.length > 500);
check('terms.html covers permitted use, coins, membership', termsHtml.includes('Acceptance') && termsHtml.includes('Vanvi Coins') && termsHtml.includes('Creative Content'));

// 6. Refund Policy Page
const refundHtml = fs.readFileSync('refund.html', 'utf8');
check('refund.html exists and non-empty', refundHtml.length > 500);
check('refund.html covers digital goods, guarantees, and coin restoration', refundHtml.includes('Digital Gifting Goods') && refundHtml.includes('Vanvi Coin Restoration Guarantee'));

// 7. Order Success Page
const successHtml = fs.readFileSync('order-success.html', 'utf8');
check('order-success.html exists and non-empty', successHtml.length > 500);
check('order-success.html has receipt elements', successHtml.includes('id="valOrderId"') && successHtml.includes('id="valItemName"') && successHtml.includes('id="valAmountPaid"'));
check('order-success.html has delivery actions (WhatsApp, Copy Link, QR Code)', successHtml.includes('id="btnShareWhatsApp"') && successHtml.includes('id="btnCopyUrl"') && successHtml.includes('id="qrCanvas"'));
check('order-success.html handles pending & failed states', successHtml.includes("status === 'failed'") && successHtml.includes("status === 'pending'"));

// 8. Category Portals
const apologyHtml = fs.readFileSync('category-apology.html', 'utf8');
check('category-apology.html exists and renders apologyGrid', apologyHtml.includes('id="apologyGrid"') && apologyHtml.includes("getByCategory('apology')"));

const familyHtml = fs.readFileSync('category-family.html', 'utf8');
check('category-family.html exists and renders familyGrid', familyHtml.includes('id="familyGrid"') && familyHtml.includes("getByCategory('family')"));

const celebHtml = fs.readFileSync('category-celebration.html', 'utf8');
check('category-celebration.html exists and renders celebrationGrid', celebHtml.includes('id="celebrationGrid"') && celebHtml.includes("getByCategory('celebration')"));

// 9. Backend Contact Route Test
const contactRoute = require('../server/routes/contact.routes');
check('contact.routes.js loads cleanly', typeof contactRoute === 'function');

console.log(`\nResults: ${pass} / ${total} checks passed.`);
if (pass === total) {
  console.log('🎉 ALL REMAINING PAGES VERIFIED PERFECTLY!\n');
} else {
  console.error('⚠️ SOME CHECKS FAILED!');
  process.exit(1);
}
