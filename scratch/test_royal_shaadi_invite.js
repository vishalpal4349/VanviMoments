const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('👑 STARTING COMPLETE VERIFICATION: ROYAL SHAADI INVITE TEMPLATE & BUILDER 👑');

const baseDir = path.join(__dirname, '..', 'templates', 'royal-shaadi-invite');
const indexPath = path.join(baseDir, 'index.html');
const builderPath = path.join(baseDir, 'builder.html');
const stylePath = path.join(baseDir, 'style.css');
const jsonPath = path.join(baseDir, 'template.json');

// 1. Files existence check
assert(fs.existsSync(indexPath), 'templates/royal-shaadi-invite/index.html must exist');
assert(fs.existsSync(builderPath), 'templates/royal-shaadi-invite/builder.html must exist');
assert(fs.existsSync(stylePath), 'templates/royal-shaadi-invite/style.css must exist');
assert(fs.existsSync(jsonPath), 'templates/royal-shaadi-invite/template.json must exist');
console.log('✓ All 4 core template files exist!');

// 2. index.html verification
const indexHtml = fs.readFileSync(indexPath, 'utf8');

// Feature 1: Personalized Guest Greeting
assert(indexHtml.includes('guestWelcomeHeader'), 'Missing guestWelcomeHeader ID');
assert(indexHtml.includes('guestNameDisplay'), 'Missing guestNameDisplay ID');
assert(indexHtml.includes("urlParams.get('guest')"), 'Missing query param reader for guest');
assert(indexHtml.includes('Honored Guest'), 'Missing Honored Guest badge');

// Feature 2: 3D Royal Envelope & Wax Seal
assert(indexHtml.includes('envelopeWrapper'), 'Missing envelopeWrapper ID');
assert(indexHtml.includes('envelopeSealBtn'), 'Missing envelopeSealBtn ID');
assert(indexHtml.includes('sparkleCanvas'), 'Missing sparkleCanvas ID');
assert(indexHtml.includes('invitationLetterSheet'), 'Missing invitationLetterSheet ID');
assert(indexHtml.includes('#Shaya'), 'Missing default monogram #Shaya');
assert(indexHtml.includes('is-open'), 'Missing is-open class toggle on seal click');
assert(indexHtml.includes('fireCanvasSparkles'), 'Missing golden sparkle canvas particle burst logic');

// Feature 3: Interactive Storyboard (Our Story)
assert(indexHtml.includes('storyboard-section'), 'Missing storyboard-section');
assert(indexHtml.includes('polaroid-card'), 'Missing polaroid-card class');
assert(indexHtml.includes('data-tilt'), 'Missing 3D photo tilt attribute');
assert(indexHtml.includes('perspective(800px) rotateX'), 'Missing 3D photo tilt calculation');

// Feature 4: Scratch-to-Reveal Date
assert(indexHtml.includes('scratchCardBox'), 'Missing scratchCardBox ID');
assert(indexHtml.includes('scratchCanvas'), 'Missing scratchCanvas ID');
assert(indexHtml.includes('revealedDateText'), 'Missing revealedDateText ID');
assert(indexHtml.includes('destination-out'), 'Missing destination-out composite mode for scratch');
assert(indexHtml.includes('checkScratchPercentage'), 'Missing scratch percentage calculator');

// Feature 5: Evening Itinerary & Schedule
assert(indexHtml.includes('itinerary-section'), 'Missing itinerary-section');
assert(indexHtml.includes('timelineTrackWrap'), 'Missing timelineTrackWrap ID');
assert(indexHtml.includes('06:30 PM'), 'Missing 06:30 PM event time');
assert(indexHtml.includes('08:00 PM'), 'Missing 08:00 PM event time');
assert(indexHtml.includes('09:30 PM'), 'Missing 09:30 PM event time');
assert(indexHtml.includes('10:30 PM'), 'Missing 10:30 PM event time');

// Feature 6: Action Suite
assert(indexHtml.includes('btnSaveCalendar'), 'Missing Save to Calendar button');
assert(indexHtml.includes('btnWhatsAppGroup'), 'Missing WhatsApp Group button');
assert(indexHtml.includes('btnVenueDirections'), 'Missing Venue Directions button');
assert(indexHtml.includes('btnScrollToWish'), 'Missing Send a Wish button');
assert(indexHtml.includes('BEGIN:VCALENDAR'), 'Missing .ics calendar generation');
assert(indexHtml.includes('calendar.google.com/calendar/render'), 'Missing Google Calendar live URL');
assert(indexHtml.includes('venueModal'), 'Missing venueModal ID');
assert(indexHtml.includes('blessingsWallFeed'), 'Missing blessingsWallFeed ID');
assert(indexHtml.includes('blessingForm'), 'Missing blessingForm ID');

// Feature 7: Floating Audio Bar
assert(indexHtml.includes('floatingAudioBar'), 'Missing floatingAudioBar ID');
assert(indexHtml.includes('audioEqualizer'), 'Missing audioEqualizer ID');
assert(indexHtml.includes('AudioContext'), 'Missing Web Audio API synthesis');
console.log('✓ index.html contains all 7 ultra-luxury Shaadipath features!');

// 3. builder.html verification
const builderHtml = fs.readFileSync(builderPath, 'utf8');
assert(builderHtml.includes('inputBride'), 'Missing inputBride');
assert(builderHtml.includes('inputGroom'), 'Missing inputGroom');
assert(builderHtml.includes('inputMonogram'), 'Missing inputMonogram');
assert(builderHtml.includes('inputDate'), 'Missing inputDate');
assert(builderHtml.includes('tabPhotos'), 'Missing tabPhotos for storyboard customization');
assert(builderHtml.includes('photo1Url'), 'Missing photo1Url');
assert(builderHtml.includes('tabItinerary'), 'Missing tabItinerary for timeline customization');
assert(builderHtml.includes('itin1Time'), 'Missing itin1Time');
assert(builderHtml.includes('tabGuests'), 'Missing tabGuests');
assert(builderHtml.includes('inputGuestName'), 'Missing inputGuestName');
assert(builderHtml.includes('generateGuestLink'), 'Missing generateGuestLink function');
assert(builderHtml.includes('generatedLinkDisplay'), 'Missing generatedLinkDisplay ID');
assert(builderHtml.includes('copyGuestLink'), 'Missing copyGuestLink function');
assert(builderHtml.includes('shareOnWhatsApp'), 'Missing shareOnWhatsApp function');
assert(builderHtml.includes('previewIframe'), 'Missing live preview iframe');
console.log('✓ builder.html contains complete customization suite & guest link generator!');

// 4. style.css verification
const styleCss = fs.readFileSync(stylePath, 'utf8');
assert(styleCss.includes('--royal-crimson'), 'Missing --royal-crimson token');
assert(styleCss.includes('--gold-metallic'), 'Missing --gold-metallic token');
assert(styleCss.includes('envelope-wrapper'), 'Missing envelope styling');
assert(styleCss.includes('envelope-seal-button'), 'Missing wax seal button styling');
assert(styleCss.includes('scratch-card-box'), 'Missing scratch card box styling');
assert(styleCss.includes('floating-audio-bar'), 'Missing floating audio bar styling');
assert(styleCss.includes('audio-equalizer'), 'Missing audio equalizer styling');
console.log('✓ style.css contains all royal tokens and luxury animations!');

// 5. Catalog check
const catalogFile = fs.readFileSync(path.join(__dirname, '..', 'js', 'vanvi-templates-data.js'), 'utf8');
assert(catalogFile.includes('royal-shaadi-invite'), 'Missing royal-shaadi-invite in catalog');
console.log('✓ Template registered in js/vanvi-templates-data.js!');

const previewFile = fs.readFileSync(path.join(__dirname, '..', 'preview.html'), 'utf8');
assert(previewFile.includes('royal-shaadi-invite'), 'Missing royal-shaadi-invite in preview.html');
console.log('✓ Template registered in preview.html!');

console.log('\n🎉 ALL CODE ASSERTIONS PASSED WITH 100% SUCCESS!');
