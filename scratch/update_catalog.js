const fs = require('fs');

let code = fs.readFileSync('js/vanvi-templates-data.js', 'utf8');

// 1. Update Category counts
code = code.replace(
  /const VANVI_CATEGORIES = \[[\s\S]*?\];/,
  `const VANVI_CATEGORIES = [
    { id: 'all', name: 'All Moments', icon: '✨', count: 16 },
    { id: 'wedding', name: 'Wedding', icon: '💍', count: 9 },
    { id: 'birthday', name: 'Birthday', icon: '🎂', count: 5 },
    { id: 'family', name: 'Family & Friends', icon: '👨‍👩‍👧', count: 1 },
    { id: 'apology', name: 'Apology', icon: '💌', count: 1 },
    { id: 'free', name: 'Free (₹0)', icon: '🎁', count: 8 }
  ];`
);

// 2. Define the new template entry
const newTemplate = {
  id: "hey-birthday",
  slug: "hey-birthday",
  sku: "VNV-BDAY-HEY-01",
  name: "Hey Birthday — Amado Playful Surprise Experience",
  aliases: [
    "hey-birthday",
    "Hey Birthday",
    "heybirthday",
    "amado-birthday",
    "birthday-portal",
    "amadowish-birthday"
  ],
  category: "Birthday",
  categorySlug: "birthday",
  categoryName: "Birthday Magic",
  price: 0,
  originalPrice: 499,
  isFree: true,
  tier: "Signature",
  badge: "🎂 Viral Playful Surprise / Interactive Portal",
  type: "Interactive Multi-Screen Birthday Portal & Mini-Games",
  icon: "🎂",
  thumbnail: "templates/Hey Birthday/assets/photo1.jpg",
  soundtrack: "Birthday Serenade Soundtrack (music.mp3)",
  tags: [
    "bestseller",
    "trending",
    "birthday",
    "interactive",
    "games",
    "balloons",
    "cake",
    "candles",
    "letter",
    "polaroid",
    "cute",
    "free"
  ],
  description: "100% faithful interactive birthday surprise experience: Private verification checkpoint, adorable bunny mascot scene, breaking birthday news, 4 flip pastel stickers with 3D audio, 5 popping balloons mini-game with realistic pop audio, scientific Laugh-O-Meter mood machine with chime SFX, 5-photo museum spotlight Polaroid album, interactive 3D SVG cake with blow-out candles & smoke animation, and a heartfelt handwritten letter with emotional reactions.",
  features: [
    "9-Screen Playful Interactive Flow with zero friction",
    "Realistic Audio Effects: Balloon pops, card flips, mood chimes, and birthday serenade",
    "Interactive 3D SVG Cake with blowable candles, smoke physics & heart confetti burst",
    "Five-balloon mini-game with randomized pitch sound effects and cheeky commentary",
    "Mood-O-Meter laugh certification machine with animated expressions",
    "Tilted Polaroid photo album with museum spotlight lightbox",
    "Heartfelt final letter with recipient & sender personalization and emotion reaction chips",
    "Full-featured Hey Birthday Studio customizer with real-time live preview and 1-click WhatsApp sharing"
  ],
  customizableFields: [
    "Recipient Name",
    "Sender Name",
    "4 Flip Notes (Stickers)",
    "Final Letter Message (one paragraph per line)",
    "5 Polaroid Photos"
  ],
  previewOccasion: "Birthday Celebration",
  previewRecipient: "Emma",
  previewSender: "Rahul",
  previewMessage: "Happy Birthday Emma 🎂💗 — A playful surprise universe built with love, balloons, cake, and zero calories!",
  accentColor: "#df679c",
  templatePath: "templates/Hey Birthday/index.html",
  previewPath: "templates/Hey Birthday/index.html",
  builderPath: "templates/Hey Birthday/builder.html",
  themeConfig: {
    accent: "#df679c",
    gradient: "linear-gradient(135deg, #ff8fbd 0%, #df679c 50%, #7c62a7 100%)",
    glow: "rgba(223, 103, 156, 0.35)",
    light: "#fff9fb",
    badge: "🎂 Birthday Magic",
    ambientType: "confetti"
  }
};

const newTemplateStr = JSON.stringify(newTemplate, null, 2);

// Insert right after birthday-3d-candle-surprise entry
const searchMarker = '"id": "birthday-3d-candle-surprise",';
const idx = code.indexOf(searchMarker);
if (idx === -1) {
  console.error('Marker not found!');
  process.exit(1);
}

// Find the end of birthday-3d-candle-surprise object
let braceCount = 0;
let endIdx = -1;
for (let i = idx; i < code.length; i++) {
  if (code[i] === '{') braceCount++;
  else if (code[i] === '}') {
    braceCount--;
    if (braceCount === -1) { // closed the object that opened before idx
      endIdx = i;
      break;
    }
  }
}

// If after endIdx there is a comma, include it
if (code[endIdx + 1] === ',') endIdx++;

code = code.slice(0, endIdx + 1) + ',\n' + newTemplateStr + code.slice(endIdx + 1);

fs.writeFileSync('js/vanvi-templates-data.js', code, 'utf8');
console.log('Successfully updated js/vanvi-templates-data.js with hey-birthday!');
