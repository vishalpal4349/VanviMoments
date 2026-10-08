/**
 * Vanvi Moments — Temple Royale Template Validator & Build Script
 * Validates and maintains templates/temple-royal-wedding/index.html
 */

const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'templates', 'temple-royal-wedding', 'index.html');

function buildAndVerifyTempleRoyale() {
  if (!fs.existsSync(targetPath)) {
    console.error(`❌ Template target not found at: ${targetPath}`);
    process.exit(1);
  }

  const html = fs.readFileSync(targetPath, 'utf8');
  const lineCount = html.split('\n').length;
  const byteCount = Buffer.byteLength(html, 'utf8');

  // Verify essential luxury wedding elements
  const checks = [
    { name: 'Preloader', pattern: /id=["']preloader["']/ },
    { name: 'Sacred Audio Player', pattern: /id=["']bgMusic["']/ },
    { name: 'Royal Patrika Blessing', pattern: /id=["']patrikaBlessing["']/ },
    { name: 'Muhurtham & Events Roadmap', pattern: /id=["']eventsContainer["']/ },
    { name: 'Curtain Story', pattern: /id=["']revealCoupleNames["']/ },
    { name: 'Sacred Gallery Grid', pattern: /id=["']galleryGrid["']/ },
    { name: 'Things To Know (TTK)', pattern: /id=["']ttkHashtag["']/ },
    { name: 'RSVP WhatsApp Integration', pattern: /id=["']rsvpWaBtn["']/ },
    { name: 'Google Calendar Integration', pattern: /id=["']btnGoogleCalendar["']/ },
    { name: 'Live Builder PostMessage Sync', pattern: /VANVI_LIVE_PREVIEW_SYNC/ }
  ];

  const failedChecks = checks.filter(c => !c.pattern.test(html));

  if (failedChecks.length > 0) {
    console.warn(`⚠️ Warning: Missing elements in template: ${failedChecks.map(c => c.name).join(', ')}`);
    return false;
  }

  console.log(`✅ templates/temple-royal-wedding/index.html is 100% verified!`);
  console.log(`   - File size: ${(byteCount / 1024).toFixed(1)} KB`);
  console.log(`   - Total lines: ${lineCount}`);
  console.log(`   - Verified elements: ${checks.length}/${checks.length} luxury components active.`);
  return true;
}

if (require.main === module) {
  buildAndVerifyTempleRoyale();
}

module.exports = { buildAndVerifyTempleRoyale };
