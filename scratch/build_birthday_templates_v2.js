/**
 * VANVI MOMENTS — ULTRA-LUXURY BIRTHDAY TEMPLATE FACTORY v2.0
 * Generates 5 genuinely premium, original, sellable Birthday digital experiences:
 * 1. birthday-midnight-royal (3D Candle Blow + Wax Seal + Midnight Regal)
 * 2. birthday-retro-polaroid (Interactive Vinyl Turntable + Draggable Polaroids)
 * 3. birthday-celestial-stars (Interactive Star Map + Shooting Star Wish)
 * 4. birthday-champagne-scratch (Gold Foil Scratch Cards + Champagne Pop)
 * 5. birthday-botanical-bloom (Flower Blooming Reveal + Milestone Garden)
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const templatesDir = path.join(rootDir, 'templates');

console.log('🚀 Starting Vanvi Moments Birthday Template Factory v2.0...\n');

// Helper to write file safely
function writeFile(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

// ============================================================================
// TEMPLATE 1: birthday-midnight-royal
// ============================================================================
console.log('👑 [1/5] Assembling birthday-midnight-royal...');
const tpl1Dir = path.join(templatesDir, 'birthday-midnight-royal');

const tpl1Json = {
  "id": "birthday-midnight-royal",
  "name": "Midnight Royal — The Imperial Celebration",
  "slug": "birthday-midnight-royal",
  "aliases": ["midnight-royal-birthday", "royal-candle-birthday"],
  "category": "Birthday",
  "categorySlug": "birthday",
  "price": 499,
  "originalPrice": 1499,
  "isFree": false,
  "badge": "👑 Imperial Bestseller",
  "tier": "Signature",
  "isLuxury": true,
  "type": "Ultra-Luxury 18-Section Digital Birthday Experience",
  "icon": "👑",
  "soundtrack": "Imperial Midnight Cello & Orchestral String Symphony",
  "tags": ["birthday", "royal", "candle-blow", "wax-seal", "midnight", "luxury", "particles", "voice-note"],
  "description": "Vanvi Moments Imperial Flagship: 18-section royal midnight birthday experience with 3D interactive candle blow ceremony, cracked golden wax seal keepsake letter, royal milestone timeline, crystal champagne toast, floating golden ember particles, and custom voice dedication.",
  "builder": {
    "type": "custom",
    "photoLimit": 8,
    "hasDate": true,
    "hasSoundtrack": true,
    "builderPath": "templates/birthday-midnight-royal/builder.html",
    "previewPath": "templates/birthday-midnight-royal/preview.html"
  },
  "sections": [
    "gala-curtain-entry",
    "gilded-monogram-name",
    "birth-date-astrology",
    "milestone-crown-badge",
    "imperial-welcome",
    "main-emotional-message",
    "interactive-3d-candle",
    "wax-seal-letter",
    "royal-photo-gallery",
    "milestone-timeline",
    "orchestral-soundtrack",
    "aristocratic-wishes-wall",
    "vip-crystal-toast",
    "five-regal-reasons",
    "midnight-surprise-box",
    "countdown-timer",
    "keepsake-qr-share",
    "atelier-signature-footer"
  ],
  "schema": {
    "fields": [
      { "key": "name", "label": "Birthday Person Name", "type": "text", "required": true, "default": "Aarav Sharma" },
      { "key": "nickname", "label": "Royal Title or Pet Name", "type": "text", "required": false, "default": "Prince Aarav" },
      { "key": "age", "label": "Milestone Age", "type": "number", "required": true, "default": 25 },
      { "key": "birthDate", "label": "Birth Date", "type": "text", "required": true, "default": "October 18" },
      { "key": "targetDate", "label": "Countdown Timestamp", "type": "datetime-local", "required": true, "default": "2026-10-18T00:00" },
      { "key": "mainMessage", "label": "Main Birthday Ode", "type": "textarea", "required": true, "default": "May your 25th milestone shine with unyielding grandeur, wisdom, and eternal joy. You walk with a rare grace that elevates every soul around you." },
      { "key": "letterText", "label": "Wax Seal Keepsake Letter", "type": "textarea", "required": true, "default": "To our dearest Aarav, through every high and quiet turn, your steadfast loyalty and radiant heart have been our greatest treasure. Here is to your most golden year yet." },
      { "key": "sender", "label": "Sender Name(s)", "type": "text", "required": true, "default": "Ananya, Kabir & The Clan" }
    ]
  }
};
writeFile(path.join(tpl1Dir, 'template.json'), JSON.stringify(tpl1Json, null, 2));

console.log('  ✅ birthday-midnight-royal template.json written.');

