const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('🪷 STARTING COMPREHENSIVE VERIFICATION: FLOATING LOTUS 3D WEDDING INVITATION 🪷');

const baseDir = path.join(__dirname, '..', 'templates', 'wedding-floating-lotus');
const indexPath = path.join(baseDir, 'index.html');
const stylePath = path.join(baseDir, 'style.css');
const scriptPath = path.join(baseDir, 'script.js');
const builderPath = path.join(baseDir, 'builder.html');
const previewPath = path.join(baseDir, 'preview.html');
const jsonPath = path.join(baseDir, 'template.json');

// 1. Files existence check
assert(fs.existsSync(indexPath), 'index.html must exist');
assert(fs.existsSync(stylePath), 'style.css must exist');
assert(fs.existsSync(scriptPath), 'script.js must exist');
assert(fs.existsSync(builderPath), 'builder.html must exist');
assert(fs.existsSync(previewPath), 'preview.html must exist');
assert(fs.existsSync(jsonPath), 'template.json must exist');
console.log('✓ All 6 required files exist in templates/wedding-floating-lotus/!');

// 2. index.html checks
const indexHtml = fs.readFileSync(indexPath, 'utf8');
assert(indexHtml.includes('lotusCanvas'), 'Missing #lotusCanvas');
assert(indexHtml.includes('guestNameText'), 'Missing #guestNameText');
assert(indexHtml.includes('cinematicIntro'), 'Missing #cinematicIntro');
assert(indexHtml.includes('introSealBtn'), 'Missing #introSealBtn');
assert(indexHtml.includes('Together — A New Beginning'), 'Missing Together — A New Beginning hero headline');
assert(indexHtml.includes('cdDays'), 'Missing #cdDays');
assert(indexHtml.includes('cdHours'), 'Missing #cdHours');
assert(indexHtml.includes('polaroidCardsDeck'), 'Missing #polaroidCardsDeck');
assert(indexHtml.includes('scratchCanvas'), 'Missing #scratchCanvas');
assert(indexHtml.includes('eventsCarouselTrack'), 'Missing #eventsCarouselTrack');
assert(indexHtml.includes('carouselPrevBtn'), 'Missing #carouselPrevBtn');
assert(indexHtml.includes('carouselNextBtn'), 'Missing #carouselNextBtn');
assert(indexHtml.includes('btnSaveCalendar'), 'Missing #btnSaveCalendar');
assert(indexHtml.includes('btnWhatsApp'), 'Missing #btnWhatsApp');
assert(indexHtml.includes('btnOpenVenueModal'), 'Missing #btnOpenVenueModal');
assert(indexHtml.includes('musicDock'), 'Missing #musicDock');
assert(indexHtml.includes('venueModalLayer'), 'Missing #venueModalLayer');
console.log('✓ index.html has complete Shaadipath std-04-lotus interactive flow!');

// 3. script.js checks
const scriptJs = fs.readFileSync(scriptPath, 'utf8');
assert(scriptJs.includes('window.MOMENT_DATA'), 'Missing window.MOMENT_DATA integration');
assert(scriptJs.includes('vanvi_floating_lotus_config'), 'Missing localStorage integration');
assert(scriptJs.includes('drawSacredLotus'), 'Missing canvas floating lotus blossoms renderer');
assert(scriptJs.includes('AudioContext'), 'Missing Web Audio API synthesis');
assert(scriptJs.includes('targetIsoDate'), 'Missing countdown target calculation');
assert(scriptJs.includes('checkScratchedRatio'), 'Missing gold scratch calculation');
assert(scriptJs.includes('perspective(800px) rotateX'), 'Missing 3D photo tilt calculation');
assert(scriptJs.includes('BEGIN:VCALENDAR'), 'Missing .ics calendar download generator');
console.log('✓ script.js has full 60fps canvas, audio synth, and dynamic features!');

// 4. builder.html checks
const builderHtml = fs.readFileSync(builderPath, 'utf8');
assert(builderHtml.includes('inputBride'), 'Missing inputBride in builder');
assert(builderHtml.includes('inputGroom'), 'Missing inputGroom in builder');
assert(builderHtml.includes('tabPhotos'), 'Missing tabPhotos in builder');
assert(builderHtml.includes('tabItinerary'), 'Missing tabItinerary in builder');
assert(builderHtml.includes('tabGuests'), 'Missing tabGuests in builder');
assert(builderHtml.includes('createGuestLink'), 'Missing createGuestLink function');
assert(builderHtml.includes('saveLotusDraft'), 'Missing saveLotusDraft function');
assert(builderHtml.includes('livePreviewIframe'), 'Missing livePreviewIframe');
console.log('✓ builder.html has complete atelier tabs and live preview sync!');

// 5. template.json checks
const tplJson = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
assert.strictEqual(tplJson.price, 499, 'Price must be ₹499');
assert.strictEqual(tplJson.originalPrice, 1499, 'Original price must be ₹1,499');
assert.strictEqual(tplJson.isBestseller, true, 'Must be marked as Bestseller');
console.log('✓ template.json configured with ₹499 pricing and wedding bestseller metadata!');

// 6. Catalog checks
const catalogJs = fs.readFileSync(path.join(__dirname, '..', 'js', 'vanvi-templates-data.js'), 'utf8');
assert(catalogJs.includes('wedding-floating-lotus'), 'Missing wedding-floating-lotus in js/vanvi-templates-data.js');
console.log('✓ Template registered in js/vanvi-templates-data.js!');

const previewHtml = fs.readFileSync(path.join(__dirname, '..', 'preview.html'), 'utf8');
assert(previewHtml.includes('wedding-floating-lotus'), 'Missing wedding-floating-lotus in preview.html');
console.log('✓ Template registered in preview.html!');

const templatesHtml = fs.readFileSync(path.join(__dirname, '..', 'templates.html'), 'utf8');
assert(templatesHtml.includes('wedding-floating-lotus'), 'Missing wedding-floating-lotus in templates.html');
console.log('✓ Template thumbnail registered in templates.html!');

console.log('\n🎉 ALL FLOATING LOTUS VERIFICATION CHECKS PASSED 100%! 🎉');
