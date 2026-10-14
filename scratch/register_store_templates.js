const fs = require('fs');
const path = require('path');

const storePath = path.resolve(__dirname, '../server/data/store.json');
const raw = fs.readFileSync(storePath, 'utf8');
const store = JSON.parse(raw);

if (!Array.isArray(store.templates)) {
  store.templates = [];
}

const cuteSorryTpl = {
  id: "cute-sorry",
  slug: "cute-sorry",
  sku: "VM-SORRY-01",
  name: "Cute Sorry",
  category: "Apology",
  categorySlug: "apology",
  categoryName: "Apology & Reconciliation",
  subcategory: "Love Apology",
  price: 29,
  originalPrice: 199,
  discount: "85% OFF",
  isFree: false,
  tier: "Special Deal",
  badge: "💗 Romantic Apology",
  type: "Interactive Multi-Chapter Love Microsite",
  icon: "💌",
  thumbnail: "https://cdn.cutiepage.in/template-seeds/cute-apology/intro.gif",
  coverImage: "https://cdn.cutiepage.in/template-seeds/cute-apology/intro.gif",
  soundtrack: "I Love You (Acoustic)",
  previewVideo: "",
  gallery: [],
  description: "A deeply heartfelt interactive apology microsite crafted to turn any frown into the sweetest smile. Features a charming magazine cover, interactive Tic-Tac-Love game, 3D wax-sealed handwritten apology note, vintage polaroid memory flipbook, and nostalgic vinyl jukebox.",
  shortDescription: "Heartfelt magazine cover, Tic-Tac-Love game, and wax-sealed letter.",
  tags: ["sorry", "apology", "bubu", "cute", "love", "game", "music", "polaroid"],
  featured: true,
  trending: true,
  popular: true,
  isNew: true,
  visibility: "public",
  sortOrder: 1,
  accentColor: "#f472b6",
  templatePath: "templates/sorry-bubu/index.html",
  builderPath: "templates/sorry-bubu/builder.html",
  previewPath: "templates/sorry-bubu/index.html",
  status: "published",
  version: "1.0.0",
  createdAt: Date.now(),
  updatedAt: Date.now()
};

const birthday2Tpl = {
  id: "birthday-2-0",
  slug: "birthday-2-0",
  sku: "VM-BDAY-20",
  name: "Birthday 2.0",
  category: "Birthday",
  categorySlug: "birthday",
  categoryName: "Birthday Celebrations",
  subcategory: "Romantic Birthday",
  price: 0,
  originalPrice: 249,
  discount: "100% FREE",
  isFree: true,
  tier: "100% Free Forever",
  badge: "🎁 Free Luxury Keepsake",
  type: "3D Wax Seal Keepsake Experience",
  icon: "🎂",
  thumbnail: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800&auto=format&fit=crop",
  coverImage: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800&auto=format&fit=crop",
  soundtrack: "A Song for Your Day",
  previewVideo: "",
  gallery: [],
  description: "An ultra-romantic, interactive birthday keepsake experience featuring an unwrap opening ceremony, 3D interactive candle lighting & cake cutting with knife physics, 3D wax-sealed sliding letter, nostalgic vinyl song player, scratch card date pass, and cream stationery letter.",
  shortDescription: "Unwrap gift, blow 3D candle, cut cake & open wax-sealed letter.",
  tags: ["free", "birthday", "cake", "candle", "wax-seal", "vinyl", "scratch-card", "music"],
  featured: true,
  trending: true,
  popular: true,
  isNew: true,
  visibility: "public",
  sortOrder: 1,
  accentColor: "#e11d48",
  templatePath: "templates/Birthday 2.0/index.html",
  builderPath: "templates/Birthday 2.0/builder.html",
  previewPath: "templates/Birthday 2.0/index.html",
  status: "published",
  version: "1.0.0",
  createdAt: Date.now(),
  updatedAt: Date.now()
};

// Filter out existing if any
store.templates = store.templates.filter(t => t.id !== 'cute-sorry' && t.id !== 'sorry-bubu' && t.id !== 'birthday-2-0');

// Insert at beginning of templates list
store.templates.unshift(birthday2Tpl);
store.templates.unshift(cuteSorryTpl);

fs.writeFileSync(storePath, JSON.stringify(store, null, 2), 'utf8');
console.log('Successfully registered Cute Sorry and Birthday 2.0 in store.json! Total templates:', store.templates.length);
