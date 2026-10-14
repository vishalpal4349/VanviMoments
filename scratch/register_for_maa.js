const fs = require('fs');
const path = require('path');

const storePath = path.resolve(__dirname, '../server/data/store.json');
const raw = fs.readFileSync(storePath, 'utf8');
const store = JSON.parse(raw);

if (!Array.isArray(store.templates)) {
  store.templates = [];
}

const forMaaTpl = {
  id: "for-maa-01",
  slug: "for-maa",
  sku: "VM-MAA-01",
  name: "For Maa — The Things She Always Says",
  category: "Family",
  categorySlug: "family",
  categoryName: "Family & Parents",
  subcategory: "Mother Tribute",
  price: 0,
  originalPrice: 499,
  discount: "100% FREE",
  isFree: true,
  tier: "100% Free Forever",
  badge: "❤️ Emotional Keepsake",
  type: "Emotional Digital Calling & Memory Flip Keepsake",
  icon: "🌸",
  thumbnail: "templates/For Maa/assets/images/card.jpg",
  coverImage: "templates/For Maa/assets/images/card.jpg",
  soundtrack: "Audio Synthesizer & Ringtone",
  previewVideo: "",
  gallery: [],
  description: "An emotional tribute for your mother. Authentic incoming phone call screen with custom photo avatar, 5 tactile 3D flipping phrase cards (What She Says vs. What She Meant), soul parchment letter with line-by-line reveal, and loving WhatsApp replies. Complete with 10 heritage Indian colour palettes and bilingual English/Hindi support.",
  shortDescription: "Incoming call screen, 5 flipping phrase cards & soul parchment letter for Maa.",
  tags: ["free", "maa", "mother", "mom", "family", "parents", "emotional", "call", "gratitude", "bilingual", "hindi", "trending", "popular"],
  featured: true,
  trending: true,
  popular: true,
  isNew: true,
  visibility: "public",
  sortOrder: 1,
  accentColor: "#d97706",
  templatePath: "templates/For Maa/index.html",
  builderPath: "templates/For Maa/builder.html",
  previewPath: "templates/For Maa/index.html",
  status: "published",
  version: "1.0.0",
  createdAt: Date.now(),
  updatedAt: Date.now()
};

// Filter out existing if any
store.templates = store.templates.filter(t => t.id !== 'for-maa-01' && t.id !== 'for-maa' && t.slug !== 'for-maa');

// Insert after Cute Sorry and Birthday 2.0 (index 2)
store.templates.splice(2, 0, forMaaTpl);

fs.writeFileSync(storePath, JSON.stringify(store, null, 2), 'utf8');
console.log('Successfully registered For Maa in store.json! Total templates:', store.templates.length);
