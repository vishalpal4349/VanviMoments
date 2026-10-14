const fs = require('fs');
const path = require('path');

const dataFilePath = path.resolve(__dirname, '../js/vanvi-templates-data.js');
const storeFilePath = path.resolve(__dirname, '../server/data/store.json');

// Require the existing module to get current objects
const existingModule = require(dataFilePath);
const allTemplates = existingModule.getAll();

const physicalDirs = fs.readdirSync(path.resolve(__dirname, '../templates')).filter(d => {
  return fs.statSync(path.resolve(__dirname, '../templates', d)).isDirectory();
});

console.log('Total templates before cleanup:', allTemplates.length);

const cleaned = [];
const seenIds = new Set();

allTemplates.forEach(t => {
  let realPath = t.templatePath || '';
  let exists = false;

  if (realPath === 'invitation-maker.html' && fs.existsSync(path.resolve(__dirname, '../invitation-maker.html'))) {
    exists = true;
  } else if (realPath && fs.existsSync(path.resolve(__dirname, '..', realPath))) {
    exists = true;
  } else {
    // Check if physical folder matches
    const match = physicalDirs.find(d => 
      d.toLowerCase() === (t.slug || '').toLowerCase() ||
      d.toLowerCase() === (t.id || '').toLowerCase() ||
      d.toLowerCase() === (t.name || '').toLowerCase() ||
      (t.aliases && t.aliases.some(a => a.toLowerCase() === d.toLowerCase()))
    );
    if (match) {
      exists = true;
      realPath = `templates/${match}/index.html`;
      t.templatePath = realPath;
      t.builderPath = `templates/${match}/builder.html`;
      t.previewPath = realPath;
    }
  }

  // Skip dummy clones and duplicates
  if (t.id === 'birthday-bloom' || t.id === 'birthday-cinema' || t.id === 'midnight-cake-surprise') {
    return;
  }

  if (exists && !seenIds.has(t.id)) {
    seenIds.add(t.id);

    // Normalize Category & Slug
    const cat = (t.category || '').toLowerCase();
    const name = (t.name || '').toLowerCase();
    const id = (t.id || '').toLowerCase();

    if (name.includes('wedding') || name.includes('vivah') || name.includes('mehendi') || name.includes('invitation') || cat.includes('wedding') || id.includes('wedding') || id.includes('vivah') || id.includes('invite')) {
      t.category = 'Wedding';
      t.categorySlug = 'wedding';
      t.categoryName = 'Wedding & Royal Vivah';
    } else if (name.includes('birthday') || cat.includes('birthday') || id.includes('birthday') || name.includes('candle') || name.includes('polaroid')) {
      t.category = 'Birthday';
      t.categorySlug = 'birthday';
      t.categoryName = 'Birthday Celebrations';
    } else if (name.includes('anniversary') || cat.includes('anniversary') || id.includes('anniversary')) {
      t.category = 'Anniversary';
      t.categorySlug = 'anniversary';
      t.categoryName = 'Anniversary & Milestones';
    } else if (name.includes('sorry') || cat.includes('apology') || id.includes('sorry')) {
      t.category = 'Apology';
      t.categorySlug = 'apology';
      t.categoryName = 'Apology & Reconciliation';
    } else if (name.includes('maa') || name.includes('mother') || cat.includes('family') || id.includes('maa')) {
      t.category = 'Family';
      t.categorySlug = 'family';
      t.categoryName = 'Family & Parents';
    } else if (name.includes('friend') || cat.includes('friendship') || id.includes('friend')) {
      t.category = 'Friendship';
      t.categorySlug = 'friendship';
      t.categoryName = 'Friendship & Besties';
    } else if (name.includes('constellation') || cat.includes('love') || id.includes('love') || id.includes('constellation')) {
      t.category = 'Love';
      t.categorySlug = 'love';
      t.categoryName = 'Love & Romance';
    }

    cleaned.push(t);
  }
});

console.log('Cleaned authentic templates count:', cleaned.length);

// Read the original file to get the header and footer methods
const originalContent = fs.readFileSync(dataFilePath, 'utf8');

// Find where categories start
const catMarker = '  // Category Metadata dictionary\n  const VANVI_CATEGORIES = {';
const themeMarker = '  // Theme & Experience archetypes catalog\n  const THEME_PRESETS = {';

const headerPart = `/**
 * VANVI MOMENTS — MASTER TEMPLATES CATALOG & REGISTRY
 * Unified single source of truth for all verified, working templates.
 */

(function(root) {
  'use strict';

  const VANVI_TEMPLATES = ${JSON.stringify(cleaned, null, 2)};
`;

const categoriesPart = `
  // Category Metadata dictionary (Only Active, Genuine Categories)
  const VANVI_CATEGORIES = {
    'all': {
      id: 'all',
      name: 'All Templates',
      icon: '🌟',
      badge: 'Studio Collection',
      title: 'The Complete Vanvi Moments Collection',
      subtitle: 'From free minimalist cards to ultra-luxury cinematic 3D experiences. Pick your canvas.',
      bannerGrad: 'linear-gradient(135deg, rgba(255, 0, 122, 0.25), rgba(192, 132, 252, 0.25))'
    },
    'free': {
      id: 'free',
      name: 'Free Moments',
      icon: '🎁',
      badge: 'Free Cards',
      title: 'Zero Cost, Infinite Emotion',
      subtitle: 'Send genuine handcrafted memory envelopes, polaroids, and scrolls without spending a single rupee.',
      bannerGrad: 'linear-gradient(135deg, rgba(34, 197, 94, 0.25), rgba(56, 189, 248, 0.25))'
    },
    'premium': {
      id: 'premium',
      name: 'Ultra Premium',
      icon: '👑',
      badge: 'VIP Craft',
      title: 'Extraordinary experiences, made for extraordinary moments',
      subtitle: 'Interactive wax seals, 3D candle blowing, cinematic letterbox reels, and royal bespoke masterpieces.',
      bannerGrad: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(255, 0, 122, 0.25))'
    },
    'wedding': {
      id: 'wedding',
      name: 'Wedding & Royal Vivah',
      icon: '💍',
      badge: 'Royal Vivah',
      title: 'Grand Palace & Sacred Heritage Weddings',
      subtitle: 'From bespoke Vivah suites with live venue QR codes to traditional Vedic lagna patrika and waterfront palaces.',
      bannerGrad: 'linear-gradient(135deg, rgba(212, 175, 55, 0.35), rgba(180, 83, 9, 0.25))'
    },
    'birthday': {
      id: 'birthday',
      name: 'Birthday Celebrations',
      icon: '🎂',
      badge: 'Celebrations',
      title: 'Make Their Birthday Truly Unforgettable',
      subtitle: 'Balloons, 3D candle blowouts, interactive cake cutting with knife physics, and heartfelt letters for their special day.',
      bannerGrad: 'linear-gradient(135deg, rgba(255, 0, 122, 0.25), rgba(245, 158, 11, 0.25))'
    },
    'anniversary': {
      id: 'anniversary',
      name: 'Anniversary & Milestones',
      icon: '✨',
      badge: 'Milestones',
      title: 'Milestones Worth Celebrating Forever',
      subtitle: 'From your first anniversary to golden jubilees. Timelines, promise renewals, and royal celebration invites.',
      bannerGrad: 'linear-gradient(135deg, rgba(245, 158, 11, 0.3), rgba(254, 240, 138, 0.2))'
    },
    'love': {
      id: 'love',
      name: 'Love & Romance',
      icon: '❤️',
      badge: 'Romance',
      title: 'Poetry, Passion & Forever Promises',
      subtitle: 'For the one who holds your heart. Starmap constellations, wax seals, and timeless romantic keepsakes.',
      bannerGrad: 'linear-gradient(135deg, rgba(244, 63, 94, 0.3), rgba(192, 132, 252, 0.25))'
    },
    'family': {
      id: 'family',
      name: 'Family & Parents',
      icon: '👨‍👩‍👧',
      badge: 'Special Tribute',
      title: 'Tributes for Maa, Papa & Family',
      subtitle: 'Show parents and siblings how deeply their love is felt with incoming calling screens and gratitude letters.',
      bannerGrad: 'linear-gradient(135deg, rgba(249, 115, 22, 0.25), rgba(245, 158, 11, 0.25))'
    },
    'friendship': {
      id: 'friendship',
      name: 'Friendship & Besties',
      icon: '👯',
      badge: 'Besties',
      title: 'Because Best Friends Deserve More Than A Plain Text',
      subtitle: 'Photo memories, polaroid collages, inside jokes, and timeless friendship soundtracks.',
      bannerGrad: 'linear-gradient(135deg, rgba(6, 182, 212, 0.25), rgba(168, 85, 247, 0.25))'
    },
    'apology': {
      id: 'apology',
      name: 'Apology & Reconciliation',
      icon: '🥺',
      badge: 'Dil Se',
      title: 'When Words Need To Heal',
      subtitle: 'A gentle, sincere peace offering with adorable Bubu Dudu animations, games, and heartfelt letters.',
      bannerGrad: 'linear-gradient(135deg, rgba(244, 114, 182, 0.25), rgba(251, 146, 60, 0.2))'
    }
  };
`;

// Extract methods and export part from original file (starting from THEME_PRESETS)
const themeIndex = originalContent.indexOf('const THEME_PRESETS = {');
if (themeIndex === -1) {
  console.error('Could not find THEME_PRESETS in original content!');
  process.exit(1);
}
const methodsPart = '  ' + originalContent.substring(themeIndex);

const finalFileContent = headerPart + categoriesPart + '\n' + methodsPart;

fs.writeFileSync(dataFilePath, finalFileContent, 'utf8');
console.log('Successfully wrote cleaned vanvi-templates-data.js!');

// Synchronize server/data/store.json
const rawStore = fs.readFileSync(storeFilePath, 'utf8');
const store = JSON.parse(rawStore);

store.templates = cleaned.map(t => ({
  id: t.id,
  slug: t.slug || t.id,
  sku: t.sku || `VM-${t.id.toUpperCase()}`,
  name: t.name,
  category: t.category,
  categorySlug: t.categorySlug || t.category.toLowerCase(),
  categoryName: t.categoryName || t.category,
  subcategory: t.subcategory || '',
  price: Number(t.price || 0),
  originalPrice: Number(t.originalPrice || 0),
  discount: t.discount || '',
  isFree: !!t.isFree || Number(t.price || 0) === 0,
  tier: t.tier || (t.isFree ? '100% Free Forever' : 'Signature Experience'),
  badge: t.badge || '',
  type: t.type || '',
  icon: t.icon || '✨',
  thumbnail: t.thumbnail || '',
  coverImage: t.coverImage || t.thumbnail || '',
  soundtrack: t.soundtrack || '',
  previewVideo: t.previewVideo || '',
  gallery: t.gallery || [],
  description: t.description || '',
  shortDescription: (t.description || '').slice(0, 100),
  tags: t.tags || [],
  featured: !!t.featured,
  trending: !!t.trending,
  popular: !!t.popular,
  isNew: !!t.isNew,
  visibility: 'public',
  sortOrder: 1,
  accentColor: t.accentColor || '#ff2a7a',
  templatePath: t.templatePath || '',
  builderPath: t.builderPath || '',
  previewPath: t.previewPath || t.templatePath || '',
  status: 'published',
  version: '1.0.0',
  createdAt: Date.now(),
  updatedAt: Date.now()
}));

fs.writeFileSync(storeFilePath, JSON.stringify(store, null, 2), 'utf8');
console.log('Successfully synchronized server/data/store.json with ' + store.templates.length + ' genuine templates!');
