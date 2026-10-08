const fs = require('fs');

const storePath = 'server/data/store.json';
const store = JSON.parse(fs.readFileSync(storePath, 'utf8'));

const bloomObj = {
  id: "birthday-botanical-bloom",
  slug: "birthday-botanical-bloom",
  sku: "VM-B-BLOOM",
  name: "Botanical Bloom — Garden of Milestones",
  aliases: [
    "botanical-bloom",
    "garden-milestones",
    "birthday-garden"
  ],
  category: "Birthday",
  categorySlug: "birthday",
  categoryName: "Birthday",
  price: 399,
  originalPrice: 1199,
  isFree: false,
  tier: "Signature",
  badge: "🌸 Botanical Bloom Edition",
  isLuxury: true,
  type: "18-Section Interactive Bloom & Milestone Herbarium",
  icon: "🌸",
  thumbnail: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=600&q=80",
  soundtrack: "Acoustic Garden Melodies & Chimes",
  tags: [
    "birthday",
    "botanical",
    "bloom",
    "flowers",
    "milestones",
    "nature",
    "luxury"
  ],
  description: "Vanvi Moments Botanical Edition: 18-section lush garden celebration featuring an interactive tap-to-bloom flower with acoustic chimes, pressed-flower milestone herbarium, and organic life growth timeline.",
  features: [
    "Interactive Tap-to-Bloom Flower Blossom with Audio Chime",
    "Pressed Flower Herbarium Memory Gallery",
    "Life Growth Milestones Foliage Timeline",
    "Botanical Garden Gate Welcome Scene",
    "Secret Flower Seed Dedication Envelope",
    "Organic Flora Birthday Countdown Clock"
  ],
  customizableFields: [
    "Birthday Person Name",
    "Age",
    "Main Birthday Ode",
    "Milestone Memories",
    "Garden Photos",
    "Sender Name"
  ],
  previewOccasion: "Birthday",
  previewRecipient: "Tara Sen",
  previewSender: "Reyansh & Loved Ones",
  previewMessage: "Like the rarest orchid blooming in sunlight, you bring colour, joy, and quiet grace into all of our lives.",
  accentColor: "#2e5a44",
  templatePath: "templates/birthday-botanical-bloom/index.html",
  themeConfig: {
    accent: "#2e5a44",
    gradient: "linear-gradient(135deg, #2e5a44 0%, #a3c9a8 50%, #f4c2c2 100%)",
    glow: "rgba(46, 90, 68, 0.35)",
    light: "#e8f5e9",
    badge: "🌸 Botanical Bloom",
    ambientType: "confetti"
  },
  experienceType: "candle-cake",
  customizerProfile: "birthday",
  discount: "67% off",
  tagline: "Botanical garden interactive blooming flower with life milestones and acoustic chimes.",
  rating: "4.9",
  reviewsCount: 890
};

const existingIndex = store.templates.findIndex(t => t.id === bloomObj.id);
if (existingIndex >= 0) {
  store.templates[existingIndex] = bloomObj;
  console.log('Updated existing template.');
} else {
  const insertAfter = store.templates.findIndex(t => t.id === 'birthday-champagne-scratch');
  if (insertAfter >= 0) {
    store.templates.splice(insertAfter + 1, 0, bloomObj);
  } else {
    store.templates.push(bloomObj);
  }
  console.log('Inserted template successfully.');
}

fs.writeFileSync(storePath, JSON.stringify(store, null, 2), 'utf8');
console.log('Total templates now:', store.templates.length);
