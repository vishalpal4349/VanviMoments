/**
 * VANVI MOMENTS — MASTER TEMPLATES CATALOG & REGISTRY
 * Unified single source of truth for all verified, working templates.
 */

(function(root) {
  'use strict';

  const THEME_PRESETS = {
    wedding: {
      accent: '#d4af37',
      gradient: 'linear-gradient(135deg, #2b0b18 0%, #170813 100%)',
      glow: 'rgba(212, 175, 55, 0.35)',
      light: '#fffaf5',
      badge: '💍 Wedding Celebrations',
      ambientType: 'gold-dust'
    },
    birthday: {
      accent: '#ff2a7a',
      gradient: 'linear-gradient(135deg, #ff2a7a 0%, #ff659c 100%)',
      glow: 'rgba(255, 42, 122, 0.28)',
      light: '#fff0f6',
      badge: '🎂 Birthday Magic',
      ambientType: 'confetti'
    },
    anniversary: {
      accent: '#d97706',
      gradient: 'linear-gradient(135deg, #451a03 0%, #1c0a00 100%)',
      glow: 'rgba(217, 119, 6, 0.35)',
      light: '#fffdf5',
      badge: '🥂 Anniversary & Milestones',
      ambientType: 'sparkles'
    },
    love: {
      accent: '#ec4899',
      gradient: 'linear-gradient(135deg, #500724 0%, #2e0817 100%)',
      glow: 'rgba(236, 72, 153, 0.32)',
      light: '#fff5f8',
      badge: '💖 Love & Romance',
      ambientType: 'floating-hearts'
    },
    friendship: {
      accent: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #2e1065 0%, #170733 100%)',
      glow: 'rgba(139, 92, 246, 0.32)',
      light: '#faf5ff',
      badge: '👯 Friendship & Besties',
      ambientType: 'stars'
    },
    family: {
      accent: '#f97316',
      gradient: 'linear-gradient(135deg, #ea580c 0%, #fb923c 100%)',
      glow: 'rgba(249, 115, 22, 0.28)',
      light: '#fff7ed',
      badge: '👨‍👩‍👧 Family Love',
      ambientType: 'hearts'
    },
    apology: {
      accent: '#f472b6',
      gradient: 'linear-gradient(135deg, #64748b 0%, #8b5cf6 100%)',
      glow: 'rgba(100, 116, 139, 0.28)',
      light: '#f8fafc',
      badge: '💌 Sincere Apology',
      ambientType: 'rain'
    },
    memories: {
      accent: '#a855f7',
      gradient: 'linear-gradient(135deg, #3b0764 0%, #1e0538 100%)',
      glow: 'rgba(168, 85, 247, 0.32)',
      light: '#faf5ff',
      badge: '📸 Cherished Memories',
      ambientType: 'polaroids'
    }
  };

  const VANVI_CATEGORIES = [
    { id: 'all', name: 'All Moments', icon: '✨', count: 24 },
    { id: 'wedding', name: 'Wedding', icon: '💍', count: 11 },
    { id: 'birthday', name: 'Birthday', icon: '🎂', count: 6 },
    { id: 'anniversary', name: 'Anniversary', icon: '🥂', count: 2 },
    { id: 'love', name: 'Love & Romance', icon: '❤️', count: 2 },
    { id: 'friendship', name: 'Friendship', icon: '👯', count: 1 },
    { id: 'family', name: 'Family & Friends', icon: '👨‍👩‍👧', count: 1 },
    { id: 'apology', name: 'Apology', icon: '💌', count: 1 },
    { id: 'free', name: 'Free (₹0)', icon: '🎁', count: 9 }
  ];



  const VANVI_TEMPLATES = [
  {
    "id": "floral-mehendi-story",
    "slug": "floral-mehendi-story",
    "sku": "VNV-FEST-01",
    "name": "Floral Mehendi Story — Luxury Festive Vivah Suite",
    "aliases": [
      "floral-mehendi",
      "mehendi-story",
      "phoolon-ki-haldi",
      "festive-floral-wedding"
    ],
    "category": "Wedding",
    "categorySlug": "wedding",
    "categoryName": "Wedding Celebrations",
    "price": 499,
    "originalPrice": 999,
    "isFree": false,
    "tier": "Signature",
    "badge": "🌿 Most Popular / Luxury Floral",
    "type": "Luxury Festive Floral Mehendi & Sangeet Keepsake",
    "icon": "🌸",
    "thumbnail": "assets/templates/floral-mehendi-story.jpg",
    "soundtrack": "Imperial Shehnai, Flute & Festive Sitar Symphony",
    "tags": [
      "bestseller",
      "mehendi",
      "haldi",
      "sangeet",
      "floral",
      "festive",
      "luxury",
      "wedding",
      "sage-green"
    ],
    "description": "Ultra-luxury floral and sage festive celebration keepsake: 3D Palace Parallax with swinging brass lanterns, Sage Curtains Reveal Animation, Auspicious 5-Ceremony Festive Itinerary, Interactive Ashirwad & Blessings Box with instant WhatsApp delivery, VIP Personalized Guest Greeting Generator (?guest=Name), and Floating Royal Shehnai Soundscape.",
    "features": [
      "3D Palace Parallax & Sage Silk Curtains Reveal Animation",
      "Floating Wedding Shehnai & Sitar Music Switcher with ambient soundscape",
      "VIP Personalized Invite Link Generator (?guest=Name)",
      "Interactive Ashirwad & Blessings Box with instant WhatsApp delivery & petal burst",
      "Live Astronomical Wedding Countdown with festive marigold glow",
      "Auspicious Itinerary (Mehendi Ki Raat, Phoolon Ki Haldi, Sangeet Dhamaka, Shubh Vivah, Reception)",
      "Direct Google Maps venue navigation and 1-Click WhatsApp RSVP",
      "Bespoke Studio Customizer with live side-by-side preview and mobile segmented switcher"
    ],
    "customizableFields": [
      "Bride & Groom Names",
      "Wedding & Ceremony Dates",
      "Palace Venue",
      "Love Note & Hashtag",
      "WhatsApp RSVP",
      "Digital Shagun UPI"
    ],
    "previewOccasion": "Festive Mehendi & Vivah Celebration",
    "previewRecipient": "Honoured Guests & Loved Ones",
    "previewSender": "With Festive Blessings, Avani & Kabir",
    "previewMessage": "Cordially invite you to celebrate our sacred Mehendi, Phoolon Ki Haldi & Vivah with joyful songs, fragrant henna and eternal love! 🌸🌿",
    "accentColor": "#c89b3c",
    "templatePath": "templates/floral-mehendi-story/index.html",
    "previewPath": "templates/floral-mehendi-story/index.html",
    "builderPath": "templates/floral-mehendi-story/builder.html",
    "themeConfig": {
      "accent": "#c89b3c",
      "gradient": "linear-gradient(135deg, #ff2a7a 0%, #ff659c 50%, #ff8cb4 100%)",
      "glow": "rgba(255, 42, 122, 0.28)",
      "light": "#fff0f6",
      "badge": "🎂 Birthday Celebration",
      "ambientType": "confetti"
    },
    "experienceType": "candle-cake",
    "customizerProfile": "birthday",
    "discount": "50% off",
    "isLuxury": true,
    "tagline": "Tap-to-interact celebration keepsake with personal letters and soundtrack.",
    "rating": "4.7",
    "reviewsCount": 557
  },
  {
    "id": "temple-blossom-luxe",
    "slug": "temple-blossom-luxe",
    "sku": "VM-BLOSSOM-01",
    "name": "Temple Blossom Luxe",
    "aliases": [
      "temple-blossom-luxe",
      "temple-blossom",
      "temple-blossom-wedding",
      "arjun-meera-wedding"
    ],
    "category": "Wedding",
    "categorySlug": "wedding",
    "categoryName": "Wedding Celebrations",
    "price": 799,
    "originalPrice": 2499,
    "isFree": false,
    "tier": "Luxury Light",
    "badge": "🌸 Temple Blossom Luxe",
    "type": "3D Temple Arch & Sacred Floral Unboxing Ceremony",
    "icon": "🛕",
    "thumbnail": "assets/templates/vanvi-temple-blossom-luxe.jpg",
    "soundtrack": "Temple Blossom Auspicious Shehnai & Santoor Melody",
    "tags": [
      "wedding",
      "temple-blossom",
      "temple",
      "blossom",
      "south-indian",
      "floral",
      "arjun-meera",
      "3d",
      "countdown",
      "itinerary",
      "music",
      "rsvp"
    ],
    "description": "Exquisite Temple Blossom & Sacred Floral Indian wedding celebration website. Featuring traditional mandap architecture, floral garland reveal, live auspicious countdown timer, parents honors, 4-ceremony itinerary, Google Maps venue navigation, background shehnai music, and WhatsApp RSVP.",
    "features": [
      "Sacred Temple Floral Mandap & Blossom Unboxing Experience",
      "High-Res Illustrated Couple Keepsake (Arjun & Meera)",
      "Live Auspicious Muhurat Countdown Heart Timer",
      "Respected Parents & Family Blessings Cards",
      "4-Event Ceremonies Itinerary with Timing & Venue Details",
      "One-Tap Google Maps Venue Route Navigation",
      "Curated Auspicious Shehnai & Santoor Wedding Melody",
      "Instant RSVP Dispatch via WhatsApp",
      "Real-Time Studio Builder with Mobile & Desktop Simulator"
    ],
    "customizableFields": [
      "Groom & Bride Names",
      "Intro Kicker & Date",
      "Parents Honors",
      "4 Events Details",
      "Venue & Map URL",
      "Couple Photos"
    ],
    "previewOccasion": "Shubh Vivah",
    "previewRecipient": "Arjun & Meera",
    "previewSender": "Together with their families",
    "previewMessage": "Invite you to celebrate a beautiful beginning, surrounded by love, laughter and flowers.",
    "accentColor": "#C89B55",
    "templatePath": "templates/temple-blossom-luxe/index.html",
    "previewPath": "templates/temple-blossom-luxe/preview.html",
    "builderPath": "templates/temple-blossom-luxe/builder.html",
    "themeConfig": {
      "accent": "#C89B55",
      "gradient": "linear-gradient(135deg, #ff2a7a 0%, #ff659c 50%, #ff8cb4 100%)",
      "glow": "rgba(255, 42, 122, 0.28)",
      "light": "#fff0f6",
      "badge": "🎂 Birthday Celebration",
      "ambientType": "confetti"
    },
    "experienceType": "candle-cake",
    "customizerProfile": "birthday",
    "discount": "68% off",
    "isLuxury": true,
    "tagline": "Tap-to-interact celebration keepsake with personal letters and soundtrack.",
    "rating": "4.8",
    "reviewsCount": 470
  },
  {
    "id": "ivory-arch-wedding",
    "slug": "ivory-arch-wedding",
    "sku": "VM-IVORY-01",
    "name": "Ivory Arch Wedding",
    "aliases": [
      "ivory-arch-wedding",
      "ivory-arch-collection",
      "ivory-arch"
    ],
    "category": "Wedding",
    "categorySlug": "wedding",
    "categoryName": "Wedding Celebrations",
    "price": 199,
    "originalPrice": 699,
    "isFree": false,
    "tier": "Minimal Luxe",
    "badge": "✨ Minimal Luxe",
    "type": "Layered Arches & Champagne Gold Celebration",
    "icon": "🏛️",
    "thumbnail": "assets/templates/vanvi-ivory-arch-wedding.jpg",
    "soundtrack": "Temple Santoor & Minimal Classical Sitar",
    "tags": [
      "wedding",
      "ivory-arch",
      "minimal-luxe",
      "gold",
      "shaadi",
      "rsvp",
      "3d"
    ],
    "description": "Minimal Luxe Ivory & Soft Champagne Gold wedding celebration website. Layered architectural arches, floating floral petals, elegant curtain reveal, live countdown timer, couple narrative, multi-event ceremony itinerary, and personalized guest link generator.",
    "features": [
      "Minimal Luxe Architectural Arches & Ivory Gold Palette",
      "Ambient Golden Dust & Delicate Rose Petal Canvas",
      "Smooth Interactive Curtain Unboxing",
      "Live Auspicious Muhurat Countdown Timer",
      "Full Multi-Event Itinerary with Google Maps Integration",
      "Curated Music Player with Raag Yaman & Sitar Synth",
      "Personalized VIP Relative Link Generator",
      "Instant RSVP & Attendance Confirmation via WhatsApp",
      "Real-Time Studio Builder with Mobile & Desktop Simulator"
    ],
    "customizableFields": [
      "Groom & Bride Names",
      "Muhurat & Date",
      "Family Honors",
      "Ceremonies Itinerary",
      "Dress Code",
      "VIP Guest Links"
    ],
    "previewOccasion": "Shubh Vivah",
    "previewRecipient": "Kishan & Divya",
    "previewSender": "Sharma & Verma Families",
    "previewMessage": "With the divine blessings of our elders, join us for our wedding celebration.",
    "accentColor": "#C8A870",
    "templatePath": "templates/ivory-arch-wedding/index.html",
    "previewPath": "templates/ivory-arch-wedding/preview.html",
    "builderPath": "templates/ivory-arch-wedding/builder.html",
    "themeConfig": {
      "accent": "#C8A870",
      "gradient": "linear-gradient(135deg, #ff2a7a 0%, #ff659c 50%, #ff8cb4 100%)",
      "glow": "rgba(255, 42, 122, 0.28)",
      "light": "#fff0f6",
      "badge": "🎂 Birthday Celebration",
      "ambientType": "confetti"
    },
    "experienceType": "candle-cake",
    "customizerProfile": "birthday",
    "discount": "50% off",
    "isLuxury": true,
    "tagline": "Tap-to-interact celebration keepsake with personal letters and soundtrack.",
    "rating": "4.9",
    "reviewsCount": 1281
  },
  {
    "id": "rose-invitation-wedding",
    "slug": "rose-invitation-wedding",
    "sku": "VM-WED-ROSE-01",
    "name": "Rose Invitation Wedding — Royal Jaipur Floral Suite",
    "aliases": [
      "rose-invitation-wedding",
      "rose-invitaion-wedding",
      "rose-wedding",
      "rose-invite",
      "Rose Invitaion Wedding",
      "jaipur-rose-wedding"
    ],
    "category": "Wedding",
    "categorySlug": "wedding",
    "categoryName": "Wedding Celebrations",
    "price": 499,
    "originalPrice": 2499,
    "isFree": false,
    "isLuxury": true,
    "tier": "Royal Couture",
    "badge": "🌹 Royal Jaipur Velvet",
    "type": "Interactive 6-Stage Grand Vivah Suite",
    "icon": "🌹",
    "thumbnail": "templates/Rose Invitaion Wedding/media/1-bg.webp",
    "soundtrack": "Auspicious Shehnai & Sitar Vivah Raag",
    "tags": [
      "wedding",
      "rose",
      "rose-invitation",
      "jaipur",
      "royal",
      "vivah",
      "luxury",
      "shagun",
      "interactive",
      "invitation"
    ],
    "description": "An opulent Royal Jaipur rose & gold interactive wedding invitation suite. Features an opening hanging cover card, Vedic invocation (Hindu/Sikh/Jain/Muslim), parents & grandparents lineage, 6 interactive ceremony cards with Google Map routes, polaroid love story gallery, and heartfelt family compliments.",
    "features": [
      "Interactive velvet cover card with hanging cord gesture opening",
      "Multi-faith Vedic invocations (Ganesha, Om, Ik Onkar, Jain, Ahimsa)",
      "Detailed bride & groom family lineage with gotra & ancestral blessings",
      "6 Interactive ceremony cards (Ring, Mehendi, Haldi, Sangeet, Vivaah, Reception)",
      "Couple love story polaroid wall with real-time photo uploads",
      "Built-in shehnai background music player and WhatsApp RSVP"
    ],
    "customizableFields": [
      "Bride & Groom Names",
      "Wedding Date & Muhurat",
      "Sacred Invocation & Tradition",
      "Parents & Lineage Details",
      "6 Ceremonies with Dates, Times & Venues",
      "Couple Love Story & Photos",
      "Family Compliments & Handwritten Notes"
    ],
    "previewOccasion": "Royal Jaipur Vivah",
    "previewRecipient": "Honored Guests & Families",
    "previewSender": "Divya & Vivan",
    "previewMessage": "We cordially invite you to grace the auspicious occasion of the marriage of Divya and Vivan.",
    "accentColor": "#962e44",
    "templatePath": "templates/Rose Invitaion Wedding/index.html",
    "previewPath": "templates/Rose Invitaion Wedding/index.html",
    "builderPath": "templates/Rose Invitaion Wedding/builder.html",
    "themeConfig": {
      "accent": "#962e44",
      "gradient": "linear-gradient(135deg, #ff2a7a 0%, #ff659c 50%, #ff8cb4 100%)",
      "glow": "rgba(255, 42, 122, 0.28)",
      "light": "#fff0f6",
      "badge": "🎂 Birthday Celebration",
      "ambientType": "confetti"
    },
    "experienceType": "wedding-patrika",
    "customizerProfile": "wedding",
    "discount": "80% off",
    "tagline": "Royal Jaipur floral wedding invitation with interactive 6-ceremony flip deck.",
    "rating": "4.9",
    "reviewsCount": 1420
  },
  {
    "id": "botanical-blush-wedding",
    "slug": "botanical-blush-wedding",
    "sku": "VM-WED-ROSE",
    "name": "Botanical Blush Wedding — Luxury Romance Suite",
    "aliases": [
      "botanical-blush-wedding",
      "botanical-blush",
      "maison-rose"
    ],
    "category": "Wedding",
    "categorySlug": "wedding",
    "categoryName": "Wedding Celebrations",
    "price": 499,
    "originalPrice": 1499,
    "isFree": false,
    "tier": "Premium",
    "badge": "🌸 Maison Botanical",
    "type": "Cinematic Botanical Web Keepsake",
    "icon": "🌸",
    "thumbnail": "assets/templates/hues-whispers-luxe.jpg",
    "soundtrack": "Acoustic Floral Waltz",
    "tags": [
      "wedding",
      "botanical",
      "blush",
      "floral",
      "romantic",
      "premium"
    ],
    "description": "An ethereal dusty peach & muted rose botanical celebration suite. Features delicate falling petals, interactive audio journey, venue navigation, and RSVP response handoff.",
    "features": [
      "Artisan French typography with Playfair Display & Alex Brush",
      "Falling botanical petal physics and soft ambient lighting",
      "Interactive Multi-Chapter Love Timeline",
      "Direct Google Maps venue integration and RSVP submission"
    ],
    "customizableFields": [
      "Couples Names",
      "Wedding Date",
      "Love Note",
      "Venues",
      "Gallery Photos"
    ],
    "previewOccasion": "Wedding Celebration",
    "previewRecipient": "Honored Guest",
    "previewSender": "Vivan & Divya",
    "previewMessage": "With immense joy and gratitude in our hearts, we invite you to share in the celebration of our wedding.",
    "accentColor": "#a74e5e",
    "templatePath": "templates/botanical-blush-wedding/index.html",
    "previewPath": "templates/botanical-blush-wedding/index.html",
    "builderPath": "templates/botanical-blush-wedding/builder.html",
    "themeConfig": {
      "accent": "#a74e5e",
      "gradient": "linear-gradient(135deg, #faf4ef 0%, #fcf5f1 100%)",
      "glow": "rgba(167, 78, 94, 0.28)",
      "light": "#faf4ef",
      "badge": "🌸 Maison Botanical",
      "ambientType": "petals"
    },
    "experienceType": "botanical-invitation",
    "customizerProfile": "wedding",
    "discount": "67% off",
    "isLuxury": true,
    "tagline": "Delicate falling rose petals, aesthetic typography & cinematic RSVP.",
    "rating": "4.9",
    "reviewsCount": 684
  },
  {
    "id": "the-grand-royal-palace-wedding",
    "slug": "the-grand-royal-palace-wedding",
    "sku": "VM-ROYAL-01",
    "name": "The Grand Royal Palace Vivah",
    "aliases": [
      "royal-udaipur",
      "royal-palace-wedding",
      "taj-lake-palace-vivah",
      "udaipur-royal-wedding"
    ],
    "category": "Wedding",
    "categorySlug": "wedding",
    "categoryName": "Wedding Celebrations",
    "price": 799,
    "originalPrice": 1999,
    "isFree": false,
    "tier": "Royal VIP",
    "badge": "👑 Royal Heritage",
    "type": "Palace Heritage Wedding Invitation",
    "icon": "👑",
    "thumbnail": "assets/templates/royal-palace-wedding.jpg",
    "soundtrack": "Royal Shehnai Harmony & Sitar Symphony",
    "tags": [
      "bestseller",
      "wedding",
      "royal",
      "udaipur",
      "lake-palace",
      "heritage",
      "luxury",
      "shaadi"
    ],
    "description": "India's most regal digital wedding invitation experience. Inspired by the majestic Taj Lake Palace Udaipur with animated palace gates, multi-ceremony schedule, sacred vows love note, royal photo gallery, interactive RSVP, and shehnai music.",
    "features": [
      "Majestic Lake Pichola Palace Gateway Animation",
      "Multi-Ceremony Royal Event Itinerary (Mehendi, Sangeet, Vivah, Reception)",
      "Sacred Seven Vows & Handwritten Love Note",
      "Royal Palace Photo Gallery with Ambient Starlight",
      "Interactive Guest RSVP via WhatsApp & Calendar Sync",
      "Authentic Shehnai & Sitar Harmony Soundtrack Player",
      "Dedicated Royal Wedding Builder Studio"
    ],
    "customizableFields": [
      "Bride & Groom Names",
      "Ceremony Schedule",
      "Palace Venue",
      "Family Lineage",
      "Love Letter",
      "Photos",
      "RSVP WhatsApp"
    ],
    "previewOccasion": "Wedding Celebration",
    "previewRecipient": "Honoured Guests & Family",
    "previewSender": "With Royal Blessings, Virat & Anushka",
    "previewMessage": "As we take our sacred seven pheras under the starlit sky of Lake Pichola, having your presence and heartfelt blessings means the entire world to us. Join us for our royal union! ✨👑",
    "accentColor": "#d4af37",
    "templatePath": "templates/royal-palace-wedding/index.html",
    "previewPath": "templates/royal-palace-wedding/index.html",
    "builderPath": "templates/royal-palace-wedding/builder.html",
    "themeConfig": {
      "accent": "#d4af37",
      "gradient": "linear-gradient(135deg, #ff2a7a 0%, #ff659c 50%, #ff8cb4 100%)",
      "glow": "rgba(255, 42, 122, 0.28)",
      "light": "#fff0f6",
      "badge": "🎂 Birthday Celebration",
      "ambientType": "confetti"
    },
    "experienceType": "festive-spark",
    "customizerProfile": "festival",
    "discount": "33% off",
    "isLuxury": true,
    "tagline": "Tap-to-interact celebration keepsake with personal letters and soundtrack.",
    "rating": "4.6",
    "reviewsCount": 498
  },
  {
    "id": "royal-vows-indian-wedding",
    "slug": "royal-vows-indian-wedding",
    "sku": "VM-VOWS-01",
    "name": "Royal Vows Indian Wedding",
    "aliases": [
      "royal-vows-indian-wedding",
      "royal-vows",
      "royal-vows-wedding",
      "haute-vivah"
    ],
    "category": "Wedding",
    "categorySlug": "wedding",
    "categoryName": "Wedding Celebrations",
    "price": 0,
    "originalPrice": 999,
    "isFree": true,
    "tier": "100% Free Forever",
    "badge": "🎁 Free Royal Vows",
    "type": "3D Palace Gates & Mandap Unboxing Ceremony",
    "icon": "👑",
    "thumbnail": "assets/templates/vanvi-royal-wedding-showcase.jpg",
    "soundtrack": "Auspicious Classical Shehnai & Santoor Melodies",
    "tags": [
      "wedding",
      "royal-vows",
      "royal",
      "palace-gates",
      "3d",
      "mandap",
      "shehnai",
      "santoor",
      "countdown",
      "patrika"
    ],
    "description": "Haute Royal Indian Vivah celebration website with 3D Palace Gates mandap unboxing, falling rose petals & golden dust canvas, live auspicious muhurat countdown, bride & groom introduction, shahi patrika, 6-event ceremony itinerary, and interactive blessings.",
    "features": [
      "Cinematic 3D Palace Gates Mandap Unboxing Ceremony",
      "Falling Rose Petals & Golden Shimmer Particle Canvas",
      "Synthesized Classical Shehnai & Santoor Soundscape",
      "Live Auspicious Muhurat Countdown Timer Ribbon",
      "Bride & Groom Royal Introduction Cards",
      "Authentic Shahi Patrika Digital Invitation Card",
      "Complete 6-Event Sacred Ceremonies Grid with Maps Integration",
      "Interactive Flower Shower & Haldi Blessings Button",
      "RSVP Form with Direct WhatsApp Confirmation Dispatch",
      "Integrated Live Studio Builder with Mobile & Desktop Simulator"
    ],
    "customizableFields": [
      "Bride & Groom Names",
      "Wedding Date & Muhurat",
      "Family & Patrika Text",
      "Ceremonies Details",
      "Couples Photos",
      "RSVP WhatsApp Number"
    ],
    "previewOccasion": "Shubh Vivah",
    "previewRecipient": "Tanya & Rohan",
    "previewSender": "Sharma & Verma Families",
    "previewMessage": "With hearts full of joy and the grace of the divine, we invite you to bless our sacred union.",
    "accentColor": "#6b0f1a",
    "templatePath": "templates/royal-vows-indian-wedding/index.html",
    "previewPath": "templates/royal-vows-indian-wedding/preview.html",
    "builderPath": "templates/royal-vows-indian-wedding/builder.html",
    "themeConfig": {
      "accent": "#6b0f1a",
      "gradient": "linear-gradient(135deg, #ff2a7a 0%, #ff659c 50%, #ff8cb4 100%)",
      "glow": "rgba(255, 42, 122, 0.28)",
      "light": "#fff0f6",
      "badge": "🎂 Birthday Celebration",
      "ambientType": "confetti"
    },
    "experienceType": "candle-cake",
    "customizerProfile": "birthday",
    "discount": "40% off",
    "isLuxury": true,
    "tagline": "Tap-to-interact celebration keepsake with personal letters and soundtrack.",
    "rating": "4.8",
    "reviewsCount": 1034
  },
  {
    "id": "royal-vivah-palace",
    "slug": "royal-vivah-palace",
    "sku": "VM-VIVAH-HERITAGE",
    "name": "Royal Vivah — Palace & Heritage",
    "aliases": [
      "royal-vivah-palace",
      "royal-vivah",
      "shaadipath-template01",
      "palace-vivah"
    ],
    "category": "Wedding",
    "categorySlug": "wedding",
    "categoryName": "Wedding Celebrations",
    "price": 0,
    "originalPrice": 1499,
    "isFree": true,
    "tier": "100% Free Forever",
    "badge": "🎁 Free Heritage Vivah",
    "type": "Multi-Event Royal Palace Experience",
    "icon": "👑",
    "thumbnail": "assets/templates/royal-palace-wedding.jpg",
    "soundtrack": "Shehnai & Sitar Harmony",
    "tags": [
      "wedding",
      "vivah",
      "royal",
      "palace",
      "heritage",
      "trending"
    ],
    "description": "Grand Udaipur palace architecture inspired digital wedding invitation. Features royal gold leaf accents, multi-day ceremony itinerary (Mehendi, Sangeet, Vivah), and interactive RSVP.",
    "features": [
      "Ornate Rajwada jharokha framing & gold zari patterns",
      "Multi-Event Ceremony Itinerary with live timings & Google Maps",
      "Grand Pushpa Vrishti (Flower Shower) celebration",
      "Instant WhatsApp RSVP and digital calendar sync"
    ],
    "customizableFields": [
      "Bride & Groom Names",
      "Family Blessings",
      "Multi-day Itinerary",
      "Venue Locations",
      "Couple Gallery"
    ],
    "previewOccasion": "Royal Vivah",
    "previewRecipient": "Honored Guest",
    "previewSender": "Anushka & Virat",
    "previewMessage": "With the divine blessings of Almighty and our loving families, we invite you to celebrate our sacred union.",
    "accentColor": "#d4af37",
    "templatePath": "templates/royal-vivah-palace/index.html",
    "previewPath": "templates/royal-vivah-palace/index.html",
    "builderPath": "templates/royal-vivah-palace/builder.html",
    "themeConfig": {
      "accent": "#d4af37",
      "gradient": "linear-gradient(135deg, #2b0b18 0%, #170813 100%)",
      "glow": "rgba(212, 175, 55, 0.35)",
      "light": "#fffaf5",
      "badge": "👑 Royal Vivah",
      "ambientType": "gold-dust"
    },
    "experienceType": "royal-vivah",
    "customizerProfile": "wedding",
    "discount": "100% free",
    "isLuxury": true,
    "tagline": "Ornate Rajwada jharokhas, multi-day itinerary & royal shehnai music.",
    "rating": "4.9",
  },
  {
    "id": "papercut-lotus",
    "slug": "papercut-lotus",
    "sku": "VM-WED-LOTUS",
    "name": "Papercut Lotus — Sacred Vedic Wedding & Heritage Patrika",
    "aliases": [
      "papercut-lotus",
      "Papercut Lotus",
      "papercut",
      "lotus-wedding",
      "paper-lotus",
      "vedic-lotus"
    ],
    "category": "Wedding",
    "categorySlug": "wedding",
    "categoryName": "Wedding Celebrations",
    "price": 499,
    "originalPrice": 1499,
    "isFree": false,
    "tier": "Signature",
    "badge": "🪷 Vedic Papercut Keepsake",
    "type": "Vedic Papercut Lotus Web Invitation",
    "icon": "🪷",
    "thumbnail": "assets/templates/papercut-lotus.webp",
    "soundtrack": "Vedic Shehnai & Sitar Harmony",
    "tags": [
      "wedding",
      "papercut",
      "lotus",
      "vedic",
      "ganesha",
      "patrika",
      "trending",
      "luxury"
    ],
    "description": "An extraordinary Vedic papercut lotus invitation. Features traditional Ganesha invocation, Sanskrit shlokas, bride & groom family gotra lineages, multi-ceremony itinerary, and divine background shehnai music.",
    "features": [
      "Intricate Vedic Papercut Lotus Animation",
      "Traditional Gotra & Elder Lineage Blessings",
      "Multi-Ceremony Event Itinerary with Maps",
      "Full Studio Customizer with WhatsApp RSVP"
    ],
    "customizableFields": [
      "Bride & Groom Names",
      "Family Gotra & Lineage",
      "Ceremony Timings & Venues",
      "Photo Gallery",
      "Music Soundtrack"
    ],
    "previewOccasion": "Wedding Celebration",
    "previewRecipient": "Honored Guest & Family",
    "previewSender": "Ankita & Kaushik",
    "previewMessage": "श्री गणेशाय नमः — We cordially invite you to grace the auspicious occasion of our sacred wedding ceremony.",
    "accentColor": "#09455d",
    "templatePath": "templates/Papercut Lotus/index.html",
    "previewPath": "templates/Papercut Lotus/index.html",
    "builderPath": "templates/Papercut Lotus/builder.html",
    "themeConfig": {
      "accent": "#ffd853",
      "gradient": "linear-gradient(135deg, #09455d 0%, #052633 100%)",
      "glow": "rgba(255, 216, 83, 0.35)",
      "light": "#fdf3e8",
      "badge": "🪷 Vedic Papercut Lotus",
      "ambientType": "gold-dust"
    },
    "experienceType": "vedic-lotus",
    "customizerProfile": "wedding",
    "discount": "67% off",
    "isLuxury": true,
    "tagline": "Intricate papercut lotus art, traditional Sanskrit shlokas & gotra patrika.",
    "rating": "4.9",
    "reviewsCount": 780
  },
  {

    "id": "birthday-box",
    "slug": "birthday-box",
    "sku": "VM-BBOX-01",
    "name": "Birthday Box",
    "aliases": [
      "birthday-box",
      "Birthday-Box",
      "birthday-box-3d",
      "bday-box",
      "box-surprise"
    ],

    "category": "Birthday",
    "categorySlug": "birthday",
    "categoryName": "Birthday Celebrations",
    "price": 49,
    "originalPrice": 249,
    "isFree": false,
    "tier": "Special Deal",
    "badge": "🎁 3D Unboxing Box",
    "type": "Interactive 3D Gift Box & Unboxing Surprise",
    "icon": "🎁",
    "thumbnail": "assets/templates/vanvi-birthday-box.jpg",
    "soundtrack": "Acoustic Birthday Serenade",
    "tags": [
      "birthday",
      "box",
      "gift",
      "unboxing",
      "surprise",
      "wishes",
      "cards",
      "polaroid",
      "letter",
      "3d"
    ],
    "description": "A magical 3D interactive birthday gift box. Unbox ribbons, reveal heartfelt personalized cards, open the memory closet photo frame, blow virtual candles, and read a wax-sealed letter.",
    "features": [
      "3D Interactive Gift Box with Ribbon Untying Animation",
      "6 Luxury Colour Palettes: Original, Lavender, Ocean, Mint, Sunset, Golden",
      "3 Secret Birthday Wishes Cards with Flip Animation",
      "Memory Closet Polaroid Photo Frame with Caption",
      "Personalized Wax-Sealed Birthday Letter",
      "Soundtrack Player & Automatic Watermark Removal on Publish"
    ],
    "customizableFields": [
      "Recipient Name",
      "Sender Name",
      "Line on Box",
      "3 Custom Wishes",
      "Memory Photo",
      "Birthday Letter"
    ],
    "previewOccasion": "Birthday Surprise",
    "previewRecipient": "Priya",
    "previewSender": "Rahul",
    "previewMessage": "Someone left you a birthday surprise. For someone who deserves a little extra magic today.",
    "accentColor": "#E8789A",
    "templatePath": "templates/Birthday-Box/index.html",
    "previewPath": "templates/Birthday-Box/index.html",
    "builderPath": "templates/Birthday-Box/builder.html",
    "themeConfig": {
      "accent": "#E8789A",
      "gradient": "linear-gradient(135deg, #ff2a7a 0%, #ff659c 50%, #ff8cb4 100%)",
      "glow": "rgba(255, 42, 122, 0.28)",
      "light": "#fff0f6",
      "badge": "🎂 Birthday Celebration",
      "ambientType": "confetti"
    },
    "experienceType": "candle-cake",
    "customizerProfile": "birthday",
    "discount": "70% off",
    "isLuxury": false,
    "tagline": "Interactive 3D candle flame, golden confetti bursts, and personal letter.",
    "rating": "4.7",
    "reviewsCount": 699
  },
  {
    "id": "birthday-2-0",
    "slug": "birthday-2-0",
    "sku": "VM-BDAY-20",
    "name": "Birthday 2.0",
    "aliases": [
      "birthday-2-0",
      "Birthday 2.0",
      "birthday-2.0",
      "birthday2",
      "wish-2"
    ],
    "category": "Birthday",
    "categorySlug": "birthday",
    "categoryName": "Birthday Celebrations",
    "price": 0,
    "originalPrice": 249,
    "isFree": true,
    "tier": "100% Free Forever",
    "badge": "🎁 Free Luxury Keepsake",
    "type": "3D Wax Seal Keepsake Experience",
    "icon": "🎂",
    "thumbnail": "assets/templates/vanvi-birthday-bold-luxe.jpg",
    "soundtrack": "A Song for Your Day",
    "tags": [
      "free",
      "birthday",
      "cake",
      "candle",
      "wax-seal",
      "vinyl",
      "scratch-card",
      "popular",
      "trending"
    ],
    "description": "An ultra-romantic, interactive birthday keepsake experience featuring an unwrap opening ceremony, 3D candle lighting & cake cutting with knife physics, 3D wax-sealed sliding letter, nostalgic vinyl song player, scratch card date pass, and handwritten love letter.",
    "features": [
      "Interactive Gift Unwrap Hero Ceremony",
      "3D Birthday Cake with Candle Lighting & Knife Cutting",
      "3D Wax-Sealed Sliding Letter with dedicated photo",
      "Nostalgic Vinyl Record Music Player with audio playback",
      "Interactive Silver Foil Scratch Card Date Voucher",
      "100% Free Lifetime Publishing with WhatsApp Sharing"
    ],
    "customizableFields": [
      "Recipient Name",
      "Portrait Photo",
      "Birthday Greeting",
      "Dedicated Song",
      "Handwritten Letter"
    ],
    "previewOccasion": "Birthday Surprise",
    "previewRecipient": "Riya",
    "previewSender": "Someone Special",
    "previewMessage": "Today is entirely yours. A whole little sanctuary of wishes for every laugh we’ve shared.",
    "accentColor": "#e11d48",
    "templatePath": "templates/Birthday 2.0/index.html",
    "previewPath": "templates/Birthday 2.0/index.html",
    "builderPath": "templates/Birthday 2.0/builder.html",
    "themeConfig": {
      "accent": "#e11d48",
      "gradient": "linear-gradient(135deg, #ff2a7a 0%, #ff659c 50%, #ff8cb4 100%)",
      "glow": "rgba(255, 42, 122, 0.28)",
      "light": "#fff0f6",
      "badge": "🎂 Birthday Celebration",
      "ambientType": "confetti"
    },
    "experienceType": "candle-cake",
    "customizerProfile": "birthday",
    "discount": "100% Free",
    "isLuxury": false,
    "tagline": "Interactive 3D candle flame, golden confetti bursts, and personal letter.",
    "rating": "4.9",
    "reviewsCount": 513
  },
  {
    "id": "cute-pastel-birthday",
    "slug": "cute-pastel-birthday",
    "sku": "VM-B00",
    "name": "Cute Pastel Birthday",
    "aliases": [
      "cute-pastel-bday",
      "pastel-birthday",
      "cute-birthday-01",
      "cute-pastel"
    ],
    "category": "Birthday",
    "categorySlug": "birthday",
    "categoryName": "Birthday Celebrations",
    "price": 0,
    "originalPrice": 149,
    "isFree": true,
    "tier": "100% Free Forever",
    "badge": "✨ #1 Bestseller",
    "type": "Dreamy Pastel Celebration & 15 Interactive Chapters",
    "icon": "🎂",
    "thumbnail": "assets/cute-pastel-birthday-thumb.jpg",
    "soundtrack": "Sweet Celebration Melodies",
    "tags": [
      "bestseller",
      "birthday",
      "cute",
      "pastel",
      "dreamy",
      "3d cake",
      "gift reveal",
      "polaroid",
      "timeline",
      "letter",
      "music player",
      "qr code"
    ],
    "description": "An ultra-premium, emotional, cinematic birthday experience with 3D gift reveal, interactive cake wish, memory timeline, wax letter, music player, photo gallery, and celebratory confetti.",
    "features": [
      "Cinematic Pastel Sky Hero & Floating Balloons",
      "Interactive 3D Gift Box Reveal & Confetti",
      "Live Birthday Countdown Timer",
      "Interactive 3D Cake & Tap-to-Blow Candles",
      "Little Moments Big Memories Photo Intro",
      "Cinematic Photo Gallery with Fullscreen Lightbox",
      "Our Beautiful Journey Scroll Timeline",
      "Royal Wax-Sealed Birthday Letter Reveal",
      "3D Special Memories Cards Deck",
      "Mystery Surprise Reveal Card",
      "Floating Cute Vinyl Record Music Player",
      "Ambient Floating Petals & Sparkle Canvas",
      "May Your Next Chapter Be Beautiful Final Chapter",
      "Celebrate Again Confetti & Balloon Burst",
      "Instant WhatsApp Share & High-Res QR Code"
    ],
    "customizableFields": [
      "Recipient Name",
      "Sender Name",
      "Birthday Date",
      "Main Hero Message",
      "Heartfelt Letter",
      "Surprise Message",
      "Photo Memories (5-15 Photos)",
      "6 Pastel Color Themes",
      "Soundtrack Dedication",
      "Memory Timeline Milestones"
    ],
    "previewOccasion": "Birthday",
    "previewRecipient": "Aaradhya",
    "previewSender": "From Riya",
    "previewMessage": "May your special day be filled with warm sunshine, endless laughter, and all the sweet magic in the universe. Happy Birthday! 🎂✨",
    "accentColor": "#ff6da8",
    "templatePath": "templates/cute-pastel-birthday/index.html",
    "previewPath": "templates/cute-pastel-birthday/preview.html",
    "builderPath": "templates/cute-pastel-birthday/builder.html",
    "themeConfig": {
      "accent": "#ff6da8",
      "gradient": "linear-gradient(135deg, #ff2a7a 0%, #ff659c 50%, #ff8cb4 100%)",
      "glow": "rgba(255, 42, 122, 0.28)",
      "light": "#fff0f6",
      "badge": "🎂 Birthday Celebration",
      "ambientType": "confetti"
    },
    "experienceType": "candle-cake",
    "customizerProfile": "birthday",
    "discount": "81% off",
    "isLuxury": false,
    "tagline": "A wax-sealed envelope opening with soft music and pickable wishes.",
    "rating": "4.9",
    "reviewsCount": 547
  },
  {
    "id": "birthday-3d-candle-surprise",
    "slug": "birthday-3d-candle-surprise",
    "sku": "VM-B03",
    "name": "Aurelia 3D Candle & Memory Atelier",
    "aliases": [
      "birthday-3d-candle-surprise",
      "birthday-3d-candle",
      "bday-candle-3d",
      "birthday-glow-3d",
      "happybirthday-liart",
      "3d-candle-surprise"
    ],

    "category": "Birthday",
    "categorySlug": "birthday",
    "categoryName": "Birthday Celebrations",
    "price": 0,
    "originalPrice": 599,
    "isFree": true,
    "tier": "100% Free Forever",
    "badge": "✦ Signature 3D Atelier · Free to publish",
    "type": "3D Candle & Scratch Experience",
    "icon": "🕯️",
    "thumbnail": "assets/templates/vanvi-birthday-vibrant.jpg",
    "soundtrack": "Birthday Acoustic Melody",
    "tags": [
      "3D Candle",
      "Birthday",
      "Interactive",
      "Polaroid Stack",
      "Scratch Card",
      "Surprise",
      "Premium",
      "Trending"
    ],
    "description": "An extraordinary multi-stage birthday celebration featuring 3D gift box opening, interactive candle blow-out with smoke physics, swipeable polaroid memory stack, and gold luxury scratch vouchers.",
    "features": [
      "Interactive Gift Box Opening Animation",
      "Floating Balloons & Rose Petal Atmosphere",
      "Animated Wax Envelope & Heart SVG Letter",
      "Typewriter Emotional Birthday Letter",
      "3D Cake with Interactive Candle Flame & Smoke",
      "Swipeable Polaroid Photo Deck (Up to 4 Photos)",
      "3 Mystery Scratch Cards with Gold Foil Reveal",
      "Grand Finale with Fireworks Confetti & Ambient Audio",
      "WhatsApp & Direct QR Sharing"
    ],
    "customizableFields": [
      "Recipient Name",
      "Sender Name",
      "Heartfelt Birthday Letter",
      "4 Custom Photos with Captions",
      "3 Scratch Coupon Wishes",
      "Music Soundtrack"
    ],
    "previewOccasion": "Birthday",
    "previewRecipient": "Beautiful",
    "previewSender": "With all my love ❤️",
    "previewMessage": "To the most wonderful person in my life. Thank you for always being my source of encouragement, my strong support, and the joy in my life. I wish you to always be beautiful, happy, and successful in everything. Happy Birthday! 💕",
    "accentColor": "#ff477e",
    "templatePath": "templates/birthday-3d-candle-surprise/index.html",
    "previewPath": "templates/birthday-3d-candle-surprise/index.html",
    "builderPath": "templates/birthday-3d-candle-surprise/builder.html",

    "themeConfig": {
      "accent": "#ff477e",
      "gradient": "linear-gradient(135deg, #ff2a7a 0%, #ff659c 50%, #ff8cb4 100%)",
      "glow": "rgba(255, 42, 122, 0.28)",
      "light": "#fff0f6",
      "badge": "🎂 Birthday Celebration",
      "ambientType": "confetti"
    },
    "experienceType": "candle-cake",
    "customizerProfile": "birthday",
    "discount": "100% Free",
    "isLuxury": false,
    "tagline": "A cinematic 3D candle-and-memory reveal, finished with a personal letter and soundtrack.",
    "rating": "4.7",
    "reviewsCount": 1169
  },
{
  "id": "hey-birthday",
  "slug": "hey-birthday",
  "sku": "VNV-BDAY-HEY-01",
  "name": "Hey Birthday — Amado Playful Surprise Experience",
  "aliases": [
    "hey-birthday",
    "Hey Birthday",
    "heybirthday",
    "amado-birthday",
    "birthday-portal",
    "amadowish-birthday"
  ],
  "category": "Birthday",
  "categorySlug": "birthday",
  "categoryName": "Birthday Magic",
  "price": 0,
  "originalPrice": 499,
  "isFree": true,
  "tier": "Signature",
  "badge": "🎂 Viral Playful Surprise / Interactive Portal",
  "type": "Interactive Multi-Screen Birthday Portal & Mini-Games",
  "icon": "🎂",
  "thumbnail": "templates/Hey Birthday/assets/photo1.jpg",
  "soundtrack": "Birthday Serenade Soundtrack (music.mp3)",
  "tags": [
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
  "description": "100% faithful interactive birthday surprise experience: Private verification checkpoint, adorable bunny mascot scene, breaking birthday news, 4 flip pastel stickers with 3D audio, 5 popping balloons mini-game with realistic pop audio, scientific Laugh-O-Meter mood machine with chime SFX, 5-photo museum spotlight Polaroid album, interactive 3D SVG cake with blow-out candles & smoke animation, and a heartfelt handwritten letter with emotional reactions.",
  "features": [
    "9-Screen Playful Interactive Flow with zero friction",
    "Realistic Audio Effects: Balloon pops, card flips, mood chimes, and birthday serenade",
    "Interactive 3D SVG Cake with blowable candles, smoke physics & heart confetti burst",
    "Five-balloon mini-game with randomized pitch sound effects and cheeky commentary",
    "Mood-O-Meter laugh certification machine with animated expressions",
    "Tilted Polaroid photo album with museum spotlight lightbox",
    "Heartfelt final letter with recipient & sender personalization and emotion reaction chips",
    "Full-featured Hey Birthday Studio customizer with real-time live preview and 1-click WhatsApp sharing"
  ],
  "customizableFields": [
    "Recipient Name",
    "Sender Name",
    "4 Flip Notes (Stickers)",
    "Final Letter Message (one paragraph per line)",
    "5 Polaroid Photos"
  ],
  "previewOccasion": "Birthday Celebration",
  "previewRecipient": "Emma",
  "previewSender": "Rahul",
  "previewMessage": "Happy Birthday Emma 🎂💗 — A playful surprise universe built with love, balloons, cake, and zero calories!",
  "accentColor": "#df679c",
  "templatePath": "templates/Hey Birthday/index.html",
  "previewPath": "templates/Hey Birthday/index.html",
  "builderPath": "templates/Hey Birthday/builder.html",
  "themeConfig": {
    "accent": "#df679c",
    "gradient": "linear-gradient(135deg, #ff8fbd 0%, #df679c 50%, #7c62a7 100%)",
    "glow": "rgba(223, 103, 156, 0.35)",
    "light": "#fff9fb",
    "badge": "🎂 Birthday Magic",
    "ambientType": "confetti"
  }
},
  {
    "id": "for-maa-01",
    "slug": "for-maa",
    "sku": "VM-MAA-01",
    "name": "For Maa — The Things She Always Says",
    "aliases": [
      "for-maa-01",
      "For Maa",
      "for-maa",
      "maa",
      "mothers-day",
      "mother",
      "mom",
      "for-mom"
    ],
    "category": "Family",
    "categorySlug": "family",
    "categoryName": "Family & Parents",
    "price": 0,
    "originalPrice": 499,
    "discount": "100% Free",
    "isFree": true,
    "tier": "100% Free Forever",
    "badge": "❤️ Emotional Keepsake",
    "type": "Emotional Digital Calling & Memory Flip Keepsake",
    "icon": "🌸",
    "thumbnail": "templates/For Maa/assets/images/card.jpg",
    "soundtrack": "Audio Synthesizer & Ringtone",
    "tags": [
      "free",
      "maa",
      "mother",
      "mom",
      "family",
      "parents",
      "emotional",
      "call",
      "gratitude",
      "bilingual",
      "hindi",
      "trending",
      "popular"
    ],
    "description": "An emotional tribute for your mother. Starts with an authentic incoming call screen from her child with photo avatar and ringtone, followed by 5 tactile 3D flipping cards of the things she always says vs. what she always meant, the unsaid gratitude you never said out loud, a soul letter parchment, and 3 loving replies she can send right back to you on WhatsApp. Complete with 10 heritage Indian colour palettes and bilingual English/Hindi support.",
    "features": [
      "Interactive incoming phone call screen with custom photo avatar & chime",
      "5 tactile 3D flipping phrase cards (What She Says vs. What She Meant)",
      "Audio chime synthesizer powered by Web Audio API on card flip & call answer",
      "Animated floating illustrations (Maa Portrait, Tiffin, Folded Hands, Door)",
      "The thing you never said out loud golden statement card",
      "Soul letter parchment with sequential paragraph reveal and custom signature",
      "Interactive mother reply picker with 1-click WhatsApp message feedback",
      "Confetti petal burst in matching theme colors",
      "10 Heritage Colour Themes: Haldi, Tulsi, Chandan, Rose, Sepia, Mint, Marigold, Ember, Indigo, Paper",
      "Full bilingual support with instant English and हिंदी switch button",
      "Split-screen real-time visual builder with responsive mobile dock",
      "Instant 100% Free publish flow with automatic watermark removal"
    ],
    "customizableFields": [
      "Recipient (Maa)",
      "Your Name",
      "Theme Palette",
      "Unsaid Thought",
      "Soul Note",
      "5 Things She Says & Meant"
    ],
    "previewOccasion": "Family & Mother Tribute",
    "previewRecipient": "Maa",
    "previewSender": "Your child",
    "previewMessage": "You never once asked me to notice. I noticed anyway.",
    "accentColor": "#d97706",
    "templatePath": "templates/For Maa/index.html",
    "previewPath": "templates/For Maa/index.html",
    "builderPath": "templates/For Maa/builder.html",
    "themeConfig": {
      "accent": "#d97706",
      "gradient": "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
      "glow": "rgba(249, 115, 22, 0.28)",
      "light": "#fff7ed",
      "badge": "🏡 Family & Gratitude",
      "ambientType": "gold-dust"
    },
    "experienceType": "wax-envelope",
    "customizerProfile": "love",
    "isLuxury": false,
    "tagline": "A warm homecoming celebrating roots, family bonds, and timeless memories.",
    "rating": "4.7",
    "reviewsCount": 1237
  },
  {
    "id": "cute-sorry",
    "slug": "cute-sorry",
    "sku": "VM-SORRY-01",
    "name": "Cute Sorry",
    "aliases": [
      "cute-sorry",
      "sorry-bubu",
      "sorry-bubu-01",
      "cute-bubu",
      "sorry",
      "bubu"
    ],
    "category": "Apology",
    "categorySlug": "apology",
    "categoryName": "Apology & Reconciliation",
    "price": 29,
    "originalPrice": 199,
    "isFree": false,
    "tier": "Special Deal",
    "badge": "💗 Romantic Apology",
    "type": "Interactive Multi-Chapter Love Microsite",
    "icon": "💌",
    "thumbnail": "assets/templates/vanvi-apology-luxe.jpg",
    "soundtrack": "I Love You (Acoustic)",
    "tags": [
      "sorry",
      "apology",
      "bubu",
      "cute",
      "love",
      "game",
      "music",
      "polaroid",
      "trending"
    ],
    "description": "A deeply heartfelt interactive apology microsite crafted to turn any frown into the sweetest smile. Features a magazine cover, playable Tic-Tac-Love game, 3D wax-sealed handwritten letter, vintage polaroid cards, and retro vinyl music player.",
    "features": [
      "Interactive Magazine Cover with dynamic name badges",
      "Playable Tic-Tac-Love mini game with confetti celebration",
      "3D Wax-Sealed Apology Letter with cursive signatures",
      "Tactile polaroid memory flipbook with custom photo uploads",
      "Nostalgic vinyl music player with real sound playback",
      "Direct ₹29 publishing with 100% watermark removal"
    ],
    "customizableFields": [
      "Recipient Nickname",
      "Apology Message",
      "Polaroid Photos",
      "Songs",
      "Signature"
    ],
    "previewOccasion": "Romantic Apology",
    "previewRecipient": "My Bubu",
    "previewSender": "Your Dudu",
    "previewMessage": "I know I upset you, and a sorry over text felt too small. So I made you this tiny website instead.",
    "accentColor": "#f472b6",
    "templatePath": "templates/sorry-bubu/index.html",
    "previewPath": "templates/sorry-bubu/index.html",
    "builderPath": "templates/sorry-bubu/builder.html",
    "themeConfig": {
      "accent": "#f472b6",
      "gradient": "linear-gradient(135deg, #64748b 0%, #8b5cf6 100%)",
      "glow": "rgba(100, 116, 139, 0.28)",
      "light": "#f8fafc",
      "badge": "🥺 Sincere Apology",
      "ambientType": "rain"
    },
    "experienceType": "apology-note",
    "customizerProfile": "apology",
    "discount": "85% off",
    "isLuxury": false,
    "tagline": "A wax-sealed envelope opening with soft music and pickable wishes.",
    "rating": "4.7",
    "reviewsCount": 523
  },
  {
    "id": "anniversary-eternal",
    "slug": "anniversary-eternal",
    "sku": "VNV-ANV-01",
    "name": "Anniversary Eternal — Interactive Milestones & Love Story",
    "aliases": [
      "anniversary-eternal",
      "Anniversary Eternal ❤️",
      "anniversary-love"
    ],
    "category": "Anniversary",
    "categorySlug": "anniversary",
    "categoryName": "Anniversary & Milestones",
    "price": 199,
    "originalPrice": 499,
    "isFree": false,
    "tier": "Signature",
    "badge": "🥂 Milestones / Love Story",
    "type": "Interactive Milestones & Love Story Timeline Keepsake",
    "icon": "🥂",
    "thumbnail": "assets/templates/vanvi-anniversary-eternal.jpg",
    "soundtrack": "Golden Vows & Piano Strings Symphony",
    "tags": [
      "anniversary",
      "milestones",
      "love",
      "timeline",
      "memories",
      "romantic",
      "bestseller"
    ],
    "description": "Celebrate every year written together with interactive milestone markers, then-and-now memory flipbook, wax-sealed love letter, and golden champagne sparkle effects.",
    "features": [
      "Then-and-Now Interactive Photo Slider",
      "Year-by-Year Memory Timeline with Photo Moments",
      "Romantic Background Soundtrack with Floating Player",
      "3D Wax-Sealed Anniversary Letter Reveal",
      "Live Relationship Counter (Days, Hours, Minutes Together)",
      "Instant WhatsApp & Social Share with QR Code"
    ],
    "templatePath": "templates/Anniversary Eternal ❤️/index.html",
    "previewPath": "templates/Anniversary Eternal ❤️/index.html",
    "builderPath": "templates/Anniversary Eternal ❤️/builder.html",
    "themeConfig": {
      "accent": "#d97706",
      "gradient": "linear-gradient(135deg, #451a03 0%, #1c0a00 100%)",
      "glow": "rgba(217, 119, 6, 0.35)",
      "light": "#fffdf5",
      "badge": "🥂 Anniversary & Milestones",
      "ambientType": "sparkles"
    },
    "experienceType": "timeline",
    "customizerProfile": "anniversary",
    "discount": "60% off",
    "isLuxury": true,
    "tagline": "A golden romantic journey celebrating every milestone together with photos, music, and love letter.",
    "rating": "4.9",
    "reviewsCount": 612
  },
  {
    "id": "golden-anniversary",
    "slug": "golden-anniversary",
    "sku": "VNV-ANV-02",
    "name": "Golden Anniversary — Royal Jubilee & Memories Odyssey",
    "aliases": [
      "golden-anniversary",
      "golden-anniversary-walk"
    ],
    "category": "Anniversary",
    "categorySlug": "anniversary",
    "categoryName": "Anniversary Celebrations",
    "price": 299,
    "originalPrice": 699,
    "isFree": false,
    "tier": "Signature",
    "badge": "👑 Royal Jubilee Edition",
    "type": "Luxury Royal Anniversary & Vows Keepsake",
    "icon": "💍",
    "thumbnail": "assets/templates/vanvi-anniversary-gold-luxe.jpg",
    "soundtrack": "Royal Symphony of Love",
    "tags": [
      "anniversary",
      "golden",
      "jubilee",
      "luxury",
      "vows",
      "parents",
      "royal"
    ],
    "description": "A tribute to lasting love. Crafted with 24K gold foil accents, full-screen archival memory cinema, heartfelt family audio notes, and permanent VIP keepsake hosting.",
    "features": [
      "24K Gold Foil Particle Aura & Luxury Typography",
      "Full-Screen Archival Memory Cinema & Photo Reel",
      "Audio Dedication Player for Voice Wishes",
      "Custom Monogram Crest with Couple Initials",
      "Permanent Lifetime Keepsake URL with QR Access"
    ],
    "templatePath": "templates/golden-anniversary/index.html",
    "previewPath": "templates/golden-anniversary/index.html",
    "builderPath": "templates/golden-anniversary/builder.html",
    "themeConfig": {
      "accent": "#d4af37",
      "gradient": "linear-gradient(135deg, #2b1800 0%, #170d00 100%)",
      "glow": "rgba(212, 175, 55, 0.35)",
      "light": "#fffdf5",
      "badge": "💍 Golden Jubilee",
      "ambientType": "gold-dust"
    },
    "experienceType": "cinematic",
    "customizerProfile": "anniversary",
    "discount": "57% off",
    "isLuxury": true,
    "tagline": "Regal 24K gold tribute celebrating enduring love with cinematic memory reels and voice wishes.",
    "rating": "5.0",
    "reviewsCount": 428
  },
  {
    "id": "love-in-clouds",
    "slug": "love-in-clouds",
    "sku": "VNV-LOVE-01",
    "name": "Love in Clouds — Dreamy Sky Romance & Floating Confessions",
    "aliases": [
      "love-in-clouds",
      "love-clouds"
    ],
    "category": "Love & Romance",
    "categorySlug": "love",
    "categoryName": "Love & Romance",
    "price": 0,
    "originalPrice": 199,
    "isFree": true,
    "tier": "100% Free Forever",
    "badge": "🎁 Free Romantic Keepsake",
    "type": "Dreamy Sky Romance & Floating Hearts Experience",
    "icon": "☁️",
    "thumbnail": "assets/templates/vanvi-love-in-clouds.jpg",
    "soundtrack": "Cloud Nine Melody",
    "tags": [
      "love",
      "romance",
      "clouds",
      "free",
      "couple",
      "confession",
      "sweet"
    ],
    "description": "Floating clouds, pastel sunsets, and fluttering love letters. A dreamy interactive sanctuary to confess your feelings or celebrate couple dates.",
    "features": [
      "Interactive Floating Cloud Animation & Starfall",
      "Tap-to-Open Flying Envelope with Love Note",
      "Custom Couple Photo Polaroid Gallery",
      "Soft Lo-Fi Romance Soundtrack",
      "100% Free Forever with Instant Sharing"
    ],
    "templatePath": "templates/love-in-clouds/index.html",
    "previewPath": "templates/love-in-clouds/index.html",
    "builderPath": "templates/love-in-clouds/builder.html",
    "themeConfig": {
      "accent": "#ec4899",
      "gradient": "linear-gradient(135deg, #500724 0%, #2e0817 100%)",
      "glow": "rgba(236, 72, 153, 0.32)",
      "light": "#fff5f8",
      "badge": "💖 Love & Romance",
      "ambientType": "floating-hearts"
    },
    "experienceType": "letter",
    "customizerProfile": "love",
    "discount": "100% off",
    "isLuxury": false,
    "tagline": "Drift into a dreamy pastel sky with floating clouds, romantic confessions, and couple polaroids.",
    "rating": "4.8",
    "reviewsCount": 890
  },
  {
    "id": "constellation-love",
    "slug": "constellation-love",
    "sku": "VNV-LOVE-02",
    "name": "Constellation Love — Written in the Stars Keepsake",
    "aliases": [
      "constellation-love",
      "star-love"
    ],
    "category": "Love & Romance",
    "categorySlug": "love",
    "categoryName": "Love & Romance",
    "price": 149,
    "originalPrice": 399,
    "isFree": false,
    "tier": "Signature",
    "badge": "✨ Cosmic Romance",
    "type": "Interactive Star Map & Celestial Love Story",
    "icon": "✨",
    "thumbnail": "assets/templates/vanvi-love-romance-showcase.jpg",
    "soundtrack": "Starlight Romance Acoustic",
    "tags": [
      "love",
      "romance",
      "stars",
      "constellation",
      "zodiac",
      "celestial",
      "valentines"
    ],
    "description": "An astronomical romance keepsake connecting the exact alignment of stars on the day you first met, with glowing zodiac trails and tap-to-reveal secret notes.",
    "features": [
      "Interactive 3D Celestial Star Sphere with Tap Controls",
      "Custom Anniversary Date Star Map Projection",
      "Glowing Constellation Love Path with Your Names",
      "Hidden Cosmic Message Cryptogram",
      "Direct WhatsApp & Instagram Share"
    ],
    "templatePath": "templates/constellation-love/index.html",
    "previewPath": "templates/constellation-love/index.html",
    "builderPath": "templates/constellation-love/builder.html",
    "themeConfig": {
      "accent": "#a855f7",
      "gradient": "linear-gradient(135deg, #2e0854 0%, #15022a 100%)",
      "glow": "rgba(168, 85, 247, 0.32)",
      "light": "#faf5ff",
      "badge": "✨ Celestial Love",
      "ambientType": "stars"
    },
    "experienceType": "interactive",
    "customizerProfile": "love",
    "discount": "62% off",
    "isLuxury": true,
    "tagline": "Gaze into a 3D celestial star sphere mapping the exact night sky when you fell in love.",
    "rating": "4.9",
    "reviewsCount": 744
  },
  {
    "id": "best-friend-day-01",
    "slug": "best-friend-day-01",
    "sku": "VNV-FRND-01",
    "name": "Best Friend Day — Chaos, Laughs & Lifelong Memories",
    "aliases": [
      "best-friend-day-01",
      "Best Friend Day 01",
      "bestie-friendship"
    ],
    "category": "Friendship",
    "categorySlug": "friendship",
    "categoryName": "Friendship & Besties",
    "price": 0,
    "originalPrice": 199,
    "isFree": true,
    "tier": "100% Free Forever",
    "badge": "🎁 Free Bestie Keepsake",
    "type": "Playful Best Friend Memory Book & Roasts",
    "icon": "👯",
    "thumbnail": "assets/templates/vanvi-friendship-showcase.jpg",
    "soundtrack": "Upbeat Indie Bestie Anthem",
    "tags": [
      "friendship",
      "bestie",
      "free",
      "fun",
      "photos",
      "roast",
      "memories",
      "bestseller"
    ],
    "description": "Celebrate your unshakeable friendship! Packed with funny superlatives, inside jokes vault, candid photo grid, friendship contract, and celebration confetti.",
    "features": [
      "Playful Inside Jokes & Nicknames Generator",
      "Funny Friendship Superlatives Awards Board",
      "Candid Photobooth Grid with Fun Stickers",
      "Official Best Friend For Life Digital Contract",
      "1-Click WhatsApp Delivery to your Bestie"
    ],
    "templatePath": "templates/Best Friend Day 01/index.html",
    "previewPath": "templates/Best Friend Day 01/index.html",
    "builderPath": "templates/Best Friend Day 01/builder.html",
    "themeConfig": {
      "accent": "#8b5cf6",
      "gradient": "linear-gradient(135deg, #2e1065 0%, #170733 100%)",
      "glow": "rgba(139, 92, 246, 0.32)",
      "light": "#faf5ff",
      "badge": "👯 Friendship & Besties",
      "ambientType": "confetti"
    },
    "experienceType": "interactive",
    "customizerProfile": "friendship",
    "discount": "100% off",
    "isLuxury": false,
    "tagline": "Superlative awards, inside joke vault, and candid photobooth celebrate your crazy bestie bond.",
    "rating": "4.9",
    "reviewsCount": 1120
  },
  {
    "id": "birthday-retro-polaroid",
    "slug": "birthday-retro-polaroid",
    "sku": "VNV-BDAY-06",
    "name": "Retro Polaroid Wall — Vintage Film Memories & Wishes",
    "aliases": [
      "birthday-retro-polaroid",
      "retro-polaroid-wall"
    ],
    "category": "Birthday",
    "categorySlug": "birthday",
    "categoryName": "Birthday Magic",
    "price": 0,
    "originalPrice": 199,
    "isFree": true,
    "tier": "100% Free Forever",
    "badge": "🎁 Free Polaroid Wall",
    "type": "Tactile Vintage Polaroid Photo Wall & Audio Tape",
    "icon": "📸",
    "thumbnail": "assets/templates/vanvi-retro-polaroid-luxe.jpg",
    "soundtrack": "Vintage Cassette Lo-Fi Melody",
    "tags": [
      "free",
      "birthday",
      "polaroid",
      "retro",
      "vintage",
      "photos",
      "cassette"
    ],
    "description": "A nostalgic celebration wall with pin-up polaroids, vintage cassette tape player, tap-to-shake photo development effect, and heartfelt birthday wishes.",
    "features": [
      "Tactile 3D Pin-Up Polaroids with Shake-to-Develop Effect",
      "Playable Retro Cassette Tape Audio Player",
      "Custom Handwritten Sticky Notes on Corkboard",
      "Flickering Fairy Lights & Vintage Ambient Glow",
      "Instant 100% Free Sharing with Live Link"
    ],
    "templatePath": "templates/birthday-retro-polaroid/index.html",
    "previewPath": "templates/birthday-retro-polaroid/index.html",
    "builderPath": "templates/birthday-retro-polaroid/builder.html",
    "themeConfig": {
      "accent": "#f59e0b",
      "gradient": "linear-gradient(135deg, #451a03 0%, #1c0a00 100%)",
      "glow": "rgba(245, 158, 11, 0.3)",
      "light": "#fffdf5",
      "badge": "📸 Retro Polaroid",
      "ambientType": "sparkles"
    },
    "experienceType": "photo",
    "customizerProfile": "birthday",
    "discount": "100% off",
    "isLuxury": false,
    "tagline": "Pin polaroid memories to a corkboard wall with a playable retro cassette tape player.",
    "rating": "4.8",
    "reviewsCount": 680
  },
  {
    "id": "golden-lake-collection",
    "slug": "golden-lake-collection",
    "sku": "VNV-WED-10",
    "name": "Golden Lake Collection — Udaipur Waterfront Vivah Suite",
    "aliases": [
      "golden-lake-collection",
      "royal-udaivilas-baithak"
    ],
    "category": "Wedding",
    "categorySlug": "wedding",
    "categoryName": "Wedding Celebrations",
    "price": 699,
    "originalPrice": 1499,
    "isFree": false,
    "tier": "Signature",
    "badge": "👑 Lake Palace Luxury",
    "type": "Ultra-Luxury Waterfront Palace Vivah Keepsake",
    "icon": "🏰",
    "thumbnail": "assets/templates/golden-lake-collection.jpg",
    "soundtrack": "Lakeside Sitar & Royal Jal Tarang",
    "tags": [
      "wedding",
      "udaipur",
      "lake-palace",
      "luxury",
      "gold",
      "signature",
      "royal"
    ],
    "description": "Inspired by Pichola's glowing waters and royal heritage palaces. Features rippling water reflections, candlelit boat reveal, royal invitations, and 4K venue map.",
    "features": [
      "Interactive Lakeside Twilight Palace Parallax",
      "Candlelit Floating Diya Wish Ceremony",
      "5-Day Heritage Wedding Itinerary with Google Maps Navigation",
      "Royal Guest Greeting Card Generator with Sanskrit Shlokas",
      "VIP Watermark-Free Lifetime Invitation Suite"
    ],
    "templatePath": "templates/golden-lake-collection/index.html",
    "previewPath": "templates/golden-lake-collection/index.html",
    "builderPath": "templates/golden-lake-collection/builder.html",
    "themeConfig": {
      "accent": "#d4af37",
      "gradient": "linear-gradient(135deg, #2b0b18 0%, #170813 100%)",
      "glow": "rgba(212, 175, 55, 0.35)",
      "light": "#fffaf5",
      "badge": "👑 Lake Palace Edition",
      "ambientType": "gold-dust"
    },
    "experienceType": "cinematic",
    "customizerProfile": "wedding",
    "discount": "53% off",
    "isLuxury": true,
    "tagline": "Rippling palace waters, candlelit floating diyas, and royal heritage wedding invitations.",
    "rating": "5.0",
    "reviewsCount": 840
  },
  {
    "id": "sacred-temple-edition",
    "slug": "sacred-temple-edition",
    "sku": "VNV-WED-11",
    "name": "Sacred Temple Edition — Auspicious Vedic Shubh Vivah",
    "aliases": [
      "sacred-temple-edition",
      "temple-royal-wedding"
    ],
    "category": "Wedding",
    "categorySlug": "wedding",
    "categoryName": "Wedding Celebrations",
    "price": 549,
    "originalPrice": 1199,
    "isFree": false,
    "tier": "Signature",
    "badge": "🛕 Vedic Tradition",
    "type": "Auspicious Traditional Vedic Vivah Keepsake",
    "icon": "🛕",
    "thumbnail": "assets/templates/sacred-temple-edition.jpg",
    "soundtrack": "Temple Bells, Conches & Auspicious Vedic Chants",
    "tags": [
      "wedding",
      "temple",
      "vedic",
      "traditional",
      "auspicious",
      "shubh-vivah",
      "gold"
    ],
    "description": "Deeply spiritual and heritage Vedic vivah invitation with brass bells sound, swinging floral garland entrance, Saptapadi vows story, and holy mantra blessings.",
    "features": [
      "Interactive Swirling Agni Kund & Saptapadi 7 Vows Scroll",
      "Real Auspicious Temple Bell Resonance Sound FX",
      "Traditional Sanskrit Shloka Calligraphy & Mangalashtak",
      "Complete Muhurat & Ritual Timeline with Venue Directions",
      "Elder Ashirwad Guestbook with WhatsApp Audio Delivery"
    ],
    "templatePath": "templates/sacred-temple-edition/index.html",
    "previewPath": "templates/sacred-temple-edition/index.html",
    "builderPath": "templates/sacred-temple-edition/builder.html",
    "themeConfig": {
      "accent": "#d4af37",
      "gradient": "linear-gradient(135deg, #3b1300 0%, #1c0900 100%)",
      "glow": "rgba(212, 175, 55, 0.35)",
      "light": "#fffaf5",
      "badge": "🛕 Vedic Shubh Vivah",
      "ambientType": "gold-dust"
    },
    "experienceType": "vows",
    "customizerProfile": "wedding",
    "discount": "54% off",
    "isLuxury": true,
    "tagline": "Sacred Vedic vivah with temple bell acoustics, Saptapadi 7 vows scroll, and elder ashirwad.",
    "rating": "4.9",
    "reviewsCount": 670
  },
  {
    "id": "retro-polaroid-wall",
    "slug": "retro-polaroid-wall",
    "sku": "VNV-MEM-01",
    "name": "Polaroid Memory Wall — Timeless Film Keepsake",
    "aliases": [
      "retro-polaroid-wall",
      "polaroid-wall",
      "polaroid-memories"
    ],
    "category": "Memories",
    "categorySlug": "memories",
    "categoryName": "Cherished Memories",
    "price": 0,
    "originalPrice": 199,
    "isFree": true,
    "tier": "100% Free Forever",
    "badge": "🎁 Free Polaroid Wall",
    "type": "Interactive Vintage Polaroid Memory Wall & Cassette",
    "icon": "📸",
    "thumbnail": "assets/templates/vanvi-retro-polaroid-showcase.jpg",
    "soundtrack": "Vintage Nostalgia Tape",
    "tags": [
      "memories",
      "polaroid",
      "timeline",
      "photos",
      "vintage",
      "free",
      "family",
      "bestseller"
    ],
    "description": "Pin up your dearest photographs on a tactile corkboard wall with shake-to-develop animations, handwritten notes, and vintage cassette soundtrack.",
    "features": [
      "Interactive 3D Pin-Up Polaroids with Photo Shake Effect",
      "Playable Vintage Cassette Tape Sound Player",
      "Custom Handwritten Sticky Notes",
      "Flickering Fairy Lights & Polaroid Aura",
      "100% Free Forever with Live Instant Link"
    ],
    "templatePath": "templates/retro-polaroid-wall/index.html",
    "previewPath": "templates/retro-polaroid-wall/index.html",
    "builderPath": "templates/retro-polaroid-wall/builder.html",
    "themeConfig": {
      "accent": "#a855f7",
      "gradient": "linear-gradient(135deg, #3b0764 0%, #1e0538 100%)",
      "glow": "rgba(168, 85, 247, 0.32)",
      "light": "#faf5ff",
      "badge": "📸 Cherished Memories",
      "ambientType": "polaroids"
    },
    "experienceType": "photo",
    "customizerProfile": "memories",
    "discount": "100% off",
    "isLuxury": false,
    "tagline": "Pin tactile vintage polaroid photos to a corkboard wall with shake effects and cassette tunes.",
    "rating": "4.9",
    "reviewsCount": 810
  }
,
{
  "id": "hues-whispers-luxe",
  "slug": "hues-whispers-luxe",
  "sku": "VNV-WED-12",
  "name": "Hues & Whispers — Contemporary Pastel Palace Vivah",
  "aliases": [
    "hues-whispers",
    "meera-arjun-wedding"
  ],
  "category": "Wedding",
  "categorySlug": "wedding",
  "categoryName": "Wedding Celebrations",
  "price": 499,
  "originalPrice": 1199,
  "isFree": false,
  "tier": "Signature",
  "badge": "👑 Pastel Palace",
  "type": "Modern Pastel Floral Royal Vivah Keepsake",
  "icon": "🌸",
  "thumbnail": "assets/templates/hues-whispers-luxe.jpg",
  "soundtrack": "Romantic Sitar & Flute Harmonies",
  "tags": [
    "wedding",
    "pastel",
    "palace",
    "luxury",
    "contemporary",
    "floral",
    "bestseller"
  ],
  "description": "An elegant contemporary wedding invitation celebrating the union of Meera and Arjun. Features pastel watercolor floral flourishes, interactive ceremonies itinerary, and heartfelt blessings.",
  "features": [
    "Subtle Pastel Petal Animations & Ethereal Soundscape",
    "Interactive 4-Stage Wedding Itinerary with Maps Link",
    "Royal Guest RSVP & Digital Shagun Envelope",
    "Family Tree & Blessing Vault with Audio Wishes",
    "VIP Watermark-Free Keepsake with Instant Share Link"
  ],
  "templatePath": "templates/hues-whispers-luxe/index.html",
  "previewPath": "templates/hues-whispers-luxe/index.html",
  "builderPath": "templates/hues-whispers-luxe/builder.html",
  "themeConfig": {
    "accent": "#ec4899",
    "gradient": "linear-gradient(135deg, #4c0519 0%, #2e0817 100%)",
    "glow": "rgba(236, 72, 153, 0.32)",
    "light": "#fff5f8",
    "badge": "🌸 Pastel Palace",
    "ambientType": "floating-hearts"
  },
  "experienceType": "cinematic",
  "customizerProfile": "wedding",
  "discount": "58% off",
  "isLuxury": true,
  "tagline": "Pastel watercolor florals, royal itinerary, and serene sitar harmonies.",
  "rating": "4.9",
  "reviewsCount": 520
},
{
  "id": "wedding-floating-lotus",
  "slug": "wedding-floating-lotus",
  "sku": "VNV-WED-13",
  "name": "Floating Lotus 3D Vivah — Sacred Kund Ceremony",
  "aliases": [
    "floating-lotus",
    "priya-vikram-wedding"
  ],
  "category": "Wedding",
  "categorySlug": "wedding",
  "categoryName": "Wedding Celebrations",
  "price": 399,
  "originalPrice": 899,
  "isFree": false,
  "tier": "Signature",
  "badge": "🪷 Sacred Lotus",
  "type": "Tactile Floating Lotus & Sacred Kund Keepsake",
  "icon": "🪷",
  "thumbnail": "assets/templates/marigold-garden-vivah.jpg",
  "soundtrack": "Temple Shehnai & Sacred Chants",
  "tags": [
    "wedding",
    "lotus",
    "kund",
    "traditional",
    "sacred",
    "3d",
    "shubh-vivah"
  ],
  "description": "Inspired by temple water kunds and sacred pink lotuses. Priya and Vikram's wedding invitation unfolds with floating lotuses, auspicious diyas, and authentic Vedic ceremony cards.",
  "features": [
    "Interactive 3D Water Kund with Floating Pink Lotuses",
    "Traditional Shehnai & Vedic Shubh Mangal Melodies",
    "Custom Multi-Day Muhurat & Venue Directions",
    "Elder Ashirwad Scroll with Handwritten Message Mode",
    "Instant WhatsApp & Instagram Story One-Click Share"
  ],
  "templatePath": "templates/wedding-floating-lotus/index.html",
  "previewPath": "templates/wedding-floating-lotus/index.html",
  "builderPath": "templates/wedding-floating-lotus/builder.html",
  "themeConfig": {
    "accent": "#d4af37",
    "gradient": "linear-gradient(135deg, #381200 0%, #1a0800 100%)",
    "glow": "rgba(212, 175, 55, 0.35)",
    "light": "#fffaf5",
    "badge": "🪷 Sacred Lotus",
    "ambientType": "gold-dust"
  },
  "experienceType": "vows",
  "customizerProfile": "wedding",
  "discount": "55% off",
  "isLuxury": true,
  "tagline": "Sacred floating lotuses, temple shehnai music, and traditional Vedic muhurat cards.",
  "rating": "4.9",
  "reviewsCount": 460
},
{
  "id": "royal-shaadi-invite",
  "slug": "royal-shaadi-invite",
  "sku": "VNV-WED-14",
  "name": "Royal Shaadi Vows — Grand Rajasthan Vivah Suite",
  "aliases": [
    "royal-shaadi",
    "shreya-aayush-wedding"
  ],
  "category": "Wedding",
  "categorySlug": "wedding",
  "categoryName": "Wedding Celebrations",
  "price": 599,
  "originalPrice": 1299,
  "isFree": false,
  "tier": "Signature",
  "badge": "👑 Royal Heritage",
  "type": "Grand Rajasthani Fort Vivah Keepsake & Scroll",
  "icon": "🏰",
  "thumbnail": "assets/templates/vanvi-royal-wedding-showcase.jpg",
  "soundtrack": "Rajasthani Royal Nagada & Sitar Symphony",
  "tags": [
    "wedding",
    "royal",
    "rajasthan",
    "heritage",
    "vows",
    "gold",
    "palace"
  ],
  "description": "Celebrate the majestic royal wedding of Shreya and Aayush with grand Rajasthani palace arches, traditional elephant procession art, and golden royal decrees.",
  "features": [
    "Royal Palace Arch Parallax & Golden Gate Reveal",
    "Complete 5-Day Heritage Event Schedule with Google Maps",
    "Interactive Shahi Farman Scroll & Royal Blessings Book",
    "Custom Royal Monogram & Personalized Audio Player",
    "Lifetime VIP Watermark-Free Keepsake Experience"
  ],
  "templatePath": "templates/royal-shaadi-invite/index.html",
  "previewPath": "templates/royal-shaadi-invite/index.html",
  "builderPath": "templates/royal-shaadi-invite/builder.html",
  "themeConfig": {
    "accent": "#d4af37",
    "gradient": "linear-gradient(135deg, #2b0b18 0%, #170813 100%)",
    "glow": "rgba(212, 175, 55, 0.38)",
    "light": "#fffaf5",
    "badge": "👑 Royal Heritage",
    "ambientType": "gold-dust"
  },
  "experienceType": "cinematic",
  "customizerProfile": "wedding",
  "discount": "54% off",
  "isLuxury": true,
  "tagline": "Grand Rajasthani palace arches, Shahi Farman scroll, and royal celebration itinerary.",
  "rating": "5.0",
  "reviewsCount": 790
},
{
  "id": "birthday-white-bloom",
  "slug": "birthday-white-bloom",
  "sku": "VNV-BDAY-07",
  "name": "White Bloom Garden — Minimal Floral Birthday Wishes",
  "aliases": [
    "birthday-white-bloom",
    "soft-birthday"
  ],
  "category": "Birthday",
  "categorySlug": "birthday",
  "categoryName": "Birthday Magic",
  "price": 0,
  "originalPrice": 199,
  "isFree": true,
  "tier": "100% Free Forever",
  "badge": "🎁 Free White Bloom",
  "type": "Serene Minimal Floral Garden Birthday Celebration",
  "icon": "🌼",
  "thumbnail": "assets/templates/vanvi-birthday-vibrant.jpg",
  "soundtrack": "Acoustic Soft Breeze Melody",
  "tags": [
    "birthday",
    "free",
    "floral",
    "minimal",
    "garden",
    "bloom",
    "bestseller"
  ],
  "description": "A gentle, aesthetic white floral birthday experience with blossoming petals, clean minimalist typography, photo polaroid cards, and warm personal birthday messages.",
  "features": [
    "Delicate Floating White Daisy & Rose Petals",
    "Interactive Polaroids with Heartfelt Captions",
    "Clean Aesthetic Typography & Peaceful Acoustic Melody",
    "Instant 1-Click WhatsApp & Social Media Sharing",
    "100% Free Forever with Zero Expiration"
  ],
  "templatePath": "templates/birthday-white-bloom/index.html",
  "previewPath": "templates/birthday-white-bloom/index.html",
  "builderPath": "templates/birthday-white-bloom/builder.html",
  "themeConfig": {
    "accent": "#10b981",
    "gradient": "linear-gradient(135deg, #064e3b 0%, #022c22 100%)",
    "glow": "rgba(16, 185, 129, 0.28)",
    "light": "#f0fdf4",
    "badge": "🌼 White Bloom",
    "ambientType": "confetti"
  },
  "experienceType": "photo",
  "customizerProfile": "birthday",
  "discount": "100% off",
  "isLuxury": false,
  "tagline": "Minimalist floral petals, aesthetic polaroids, and soothing acoustic tunes.",
  "rating": "4.8",
  "reviewsCount": 610
},
{
  "id": "birthday-wish-01",
  "slug": "birthday-wish-01",
  "sku": "VNV-BDAY-08",
  "name": "Birthday Joy Odyssey — Confetti Burst & Music Reel",
  "aliases": [
    "birthday-wish-01",
    "joy-odyssey"
  ],
  "category": "Birthday",
  "categorySlug": "birthday",
  "categoryName": "Birthday Magic",
  "price": 0,
  "originalPrice": 199,
  "isFree": true,
  "tier": "100% Free Forever",
  "badge": "🎁 Free Joy Odyssey",
  "type": "Vibrant Interactive Confetti & Birthday Music Reel",
  "icon": "🎉",
  "thumbnail": "assets/templates/vanvi-birthday-showcase.jpg",
  "soundtrack": "Upbeat Birthday Party Celebration Track",
  "tags": [
    "birthday",
    "free",
    "confetti",
    "music",
    "joy",
    "bestseller",
    "celebration"
  ],
  "description": "An energetic burst of confetti, high-vibe birthday beats, interactive gift unwrapping animation, and a celebratory photo gallery that makes anyone smile.",
  "features": [
    "Dynamic Exploding 3D Confetti Cannons",
    "Tap-to-Unwrap Digital Birthday Present Box",
    "Fun Audio Cake Candle Blowout Sound Effect",
    "Photo Slideshow with Personalized Memories",
    "100% Free Sharing with Custom Live Link"
  ],
  "templatePath": "templates/birthday-wish-01/index.html",
  "previewPath": "templates/birthday-wish-01/index.html",
  "builderPath": "templates/birthday-wish-01/builder.html",
  "themeConfig": {
    "accent": "#ff2a7a",
    "gradient": "linear-gradient(135deg, #ff2a7a 0%, #ff659c 100%)",
    "glow": "rgba(255, 42, 122, 0.32)",
    "light": "#fff0f6",
    "badge": "🎉 Birthday Joy",
    "ambientType": "confetti"
  },
  "experienceType": "cake",
  "customizerProfile": "birthday",
  "discount": "100% off",
  "isLuxury": false,
  "tagline": "Exploding confetti cannons, tap-to-unwrap gift box, and upbeat celebratory tunes.",
  "rating": "4.9",
  "reviewsCount": 1180
},
{
  "id": "birthday-wish-02",
  "slug": "birthday-wish-02",
  "sku": "VNV-BDAY-09",
  "name": "Birthday Cinema Gala — Candle Glow & Letter Keepsake",
  "aliases": [
    "birthday-wish-02",
    "cinema-gala"
  ],
  "category": "Birthday",
  "categorySlug": "birthday",
  "categoryName": "Birthday Magic",
  "price": 99,
  "originalPrice": 299,
  "isFree": false,
  "tier": "Standard",
  "badge": "✨ Cinema Gala",
  "type": "Cinematic Candle Glow & Heartfelt Birthday Letter",
  "icon": "🕯️",
  "thumbnail": "assets/templates/vanvi-cinema-story.jpg",
  "soundtrack": "Warm Piano & Ambient Strings",
  "tags": [
    "birthday",
    "cinema",
    "candles",
    "letter",
    "gala",
    "glow",
    "emotional"
  ],
  "description": "A deeply touching, cinematic birthday experience with warm candlelit ambiance, heartfelt letter reveal, memory reel, and soulful piano music.",
  "features": [
    "Warm Flickering Candle Flame with Blowout Interactive Sensor",
    "Cinematic Letter Reveal with Typewriter Emotion",
    "Curated 4K Photo Carousel with Subtle Vignette",
    "Custom Background Melody Selection",
    "High-Resolution Watermark-Free Sharing"
  ],
  "templatePath": "templates/birthday-wish-02/index.html",
  "previewPath": "templates/birthday-wish-02/index.html",
  "builderPath": "templates/birthday-wish-02/builder.html",
  "themeConfig": {
    "accent": "#f59e0b",
    "gradient": "linear-gradient(135deg, #451a03 0%, #1c0a00 100%)",
    "glow": "rgba(245, 158, 11, 0.35)",
    "light": "#fffdf5",
    "badge": "✨ Cinema Gala",
    "ambientType": "sparkles"
  },
  "experienceType": "letter",
  "customizerProfile": "birthday",
  "discount": "67% off",
  "isLuxury": false,
  "tagline": "Flickering candle ambiance, typewriter emotional letter, and warm piano melodies.",
  "rating": "4.9",
  "reviewsCount": 740
},
{
  "id": "vanvi-royal-wedding",
  "slug": "vanvi-royal-wedding",
  "sku": "VNV-WED-15",
  "name": "Royal Vows Heritage — Tanya & Rohan Regal Vivah Keepsake",
  "aliases": [
    "vanvi-royal-wedding",
    "tanya-rohan-wedding"
  ],
  "category": "Wedding",
  "categorySlug": "wedding",
  "categoryName": "Wedding Celebrations",
  "price": 699,
  "originalPrice": 1499,
  "isFree": false,
  "tier": "Signature",
  "badge": "👑 Regal Heritage",
  "type": "Regal Heritage Vivah Keepsake & Imperial Scroll",
  "icon": "🏰",
  "thumbnail": "assets/templates/vanvi-royal-wedding-showcase.jpg",
  "soundtrack": "Imperial Sitar & Royal Shehnai Ensemble",
  "tags": [
    "wedding",
    "regal",
    "royal",
    "vows",
    "heritage",
    "luxury",
    "gold",
    "signature"
  ],
  "description": "An imperial regal vivah invitation created for grand traditional celebrations. Features royal elephant crests, intricate Rajasthani jharokha borders, and comprehensive function details.",
  "features": [
    "Grand Jharokha Parallax Entrance with Gold Leaf Embellishments",
    "Interactive 5-Day Vivah Function Cards with Map Directions",
    "Traditional Sanskrit Shloka Audio Playback with English Meaning",
    "Custom Guest Blessing Guestbook with WhatsApp Delivery",
    "Lifetime VIP Watermark-Free Hosting & Custom Domain Ready"
  ],
  "templatePath": "templates/vanvi-royal-wedding/index.html",
  "previewPath": "templates/vanvi-royal-wedding/index.html",
  "builderPath": "templates/vanvi-royal-wedding/builder.html",
  "themeConfig": {
    "accent": "#d4af37",
    "gradient": "linear-gradient(135deg, #2b0b18 0%, #170813 100%)",
    "glow": "rgba(212, 175, 55, 0.38)",
    "light": "#fffaf5",
    "badge": "👑 Regal Heritage",
    "ambientType": "gold-dust"
  },
  "experienceType": "cinematic",
  "customizerProfile": "wedding",
  "discount": "53% off",
  "isLuxury": true,
  "tagline": "Imperial Rajasthani jharokha arches, gold leaf accents, and royal function schedule.",
  "rating": "5.0",
  "reviewsCount": 880
},
{
  "id": "royal-vivah-lagna",
  "slug": "royal-vivah-lagna",
  "sku": "VNV-WED-16",
  "name": "Royal Vivah Lagna Patrika — Auspicious Vedic Shubh Muhurat",
  "aliases": [
    "royal-vivah-lagna",
    "aarav-kriti-wedding"
  ],
  "category": "Wedding",
  "categorySlug": "wedding",
  "categoryName": "Wedding Celebrations",
  "price": 499,
  "originalPrice": 1099,
  "isFree": false,
  "tier": "Signature",
  "badge": "🪔 Vedic Shubh Lagna",
  "type": "Sacred Traditional Lagna Patrika & Vivah Muhurat Suite",
  "icon": "🪔",
  "thumbnail": "assets/templates/marigold-garden-vivah.jpg",
  "soundtrack": "Auspicious Mangal Vaadhyam & Vedic Hymns",
  "tags": [
    "wedding",
    "vedic",
    "lagna-patrika",
    "shubh-muhurat",
    "auspicious",
    "traditional",
    "gold"
  ],
  "description": "A deeply revered traditional Vedic Lagna Patrika invitation for Aarav and Kriti. Showcases auspicious Kalash, sacred Agni, and detailed astronomical muhurat timelines.",
  "features": [
    "Authentic Traditional Lagna Patrika Calligraphy & Shlokas",
    "Sacred Mangal Kund & Saptapadi Blessings Showcase",
    "Comprehensive Muhurat Timings with Google Maps Location",
    "Interactive RSVP & Elder Ashirwad Audio Record",
    "Lifetime Accessible Auspicious Digital Keepsake"
  ],
  "templatePath": "templates/royal-vivah-lagna/index.html",
  "previewPath": "templates/royal-vivah-lagna/index.html",
  "builderPath": "templates/royal-vivah-lagna/builder.html",
  "themeConfig": {
    "accent": "#d4af37",
    "gradient": "linear-gradient(135deg, #3b1300 0%, #1c0900 100%)",
    "glow": "rgba(212, 175, 55, 0.35)",
    "light": "#fffaf5",
    "badge": "🪔 Vedic Shubh Lagna",
    "ambientType": "gold-dust"
  },
  "experienceType": "vows",
  "customizerProfile": "wedding",
  "discount": "55% off",
  "isLuxury": true,
  "tagline": "Authentic traditional Lagna Patrika calligraphy, sacred Agni Kund, and Vedic muhurats.",
  "rating": "4.9",
  "reviewsCount": 630
}
];
;

  const VanviTemplatesData = {
    templates: VANVI_TEMPLATES,
    categories: VANVI_CATEGORIES,

    getTier(template) {
      if (!template || template.isFree || Number(template.price || 0) === 0) return 'Free';
      const price = Number(template.price || 0);
      if (price > 700) return 'Ultra Premium';
      if (price >= 149) return 'Premium';
      return 'Interactive';
    },

    getAll() {
      return VANVI_TEMPLATES;
    },

    getByCategory(categorySlug) {
      if (!categorySlug || categorySlug === 'all') return VANVI_TEMPLATES;
      if (categorySlug === 'free') return VANVI_TEMPLATES.filter(t => t.isFree || Number(t.price || 0) === 0);
      if (categorySlug === 'ultra-premium') return VANVI_TEMPLATES.filter(t => Number(t.price || 0) > 700 || t.isLuxury);
      if (categorySlug === 'premium') return VANVI_TEMPLATES.filter(t => !t.isFree && Number(t.price || 0) > 0);
      const lower = categorySlug.toLowerCase();
      if (lower === 'celebration' || lower === 'celebrations') {
        return VANVI_TEMPLATES.filter(t => 
          (t.categorySlug && (t.categorySlug === 'celebration' || t.categorySlug === 'wedding' || t.categorySlug === 'birthday')) ||
          (t.category && t.category.toLowerCase().includes('celebrat')) ||
          (t.tags && (t.tags.includes('celebration') || t.tags.includes('festive') || t.tags.includes('bestseller')))
        );
      }
      if (lower === 'memories' || lower === 'memory') {
        return VANVI_TEMPLATES.filter(t => 
          (t.categorySlug && (t.categorySlug === 'memories' || t.categorySlug === 'family')) ||
          (t.category && t.category.toLowerCase().includes('memor')) ||
          (t.tags && (t.tags.includes('memories') || t.tags.includes('polaroid') || t.tags.includes('timeline')))
        );
      }
      if (lower === 'love' || lower === 'romance') {
        return VANVI_TEMPLATES.filter(t => 
          (t.categorySlug && (t.categorySlug === 'love' || t.categorySlug === 'romance')) || 
          (t.category && (t.category.toLowerCase().includes('love') || t.category.toLowerCase().includes('romance')))
        );
      }
      if (lower === 'anniversary') {
        return VANVI_TEMPLATES.filter(t => 
          (t.categorySlug && t.categorySlug === 'anniversary') || 
          (t.category && t.category.toLowerCase().includes('anniversary'))
        );
      }
      if (lower === 'friendship' || lower === 'friends' || lower === 'friend') {
        return VANVI_TEMPLATES.filter(t => 
          (t.categorySlug && t.categorySlug === 'friendship') || 
          (t.category && t.category.toLowerCase().includes('friend'))
        );
      }
      return VANVI_TEMPLATES.filter(t => 
        (t.categorySlug && t.categorySlug.toLowerCase() === lower) || 
        (t.category && t.category.toLowerCase().includes(lower))
      );
    },

    getById(id) {
      if (!id) return null;
      return VANVI_TEMPLATES.find(t => 
        t.id === id || 
        t.slug === id || 
        (t.aliases && t.aliases.includes(id)) ||
        (id === 'soft-birthday' && t.id === 'birthday-white-bloom-001')
      ) || null;
    },

    escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    },

    // Unified Luxury Card Renderer (2-Column Mobile & Multi-Column Desktop)
    renderCard(t) {
      const escapeHtml = this.escapeHtml;
      if (!t) return '';
      const p = Number(t.price || 0);
      const orig = Number(t.originalPrice || (p > 0 ? Math.round(p * 2.8 / 10) * 10 - 1 : 0));
      const isFree = t.isFree || p === 0;
      const isLux = !!t.isLuxury || t.price >= 249;
      const safeId = encodeURIComponent(t.id);
      const safeOccasion = encodeURIComponent(t.category || 'Celebration');

      // Category label with emoji
      let catBadge = t.category || 'Moment';
      const cLower = catBadge.toLowerCase();
      if (cLower.includes('birthday')) catBadge = '🎂 Birthday';
      else if (cLower.includes('love') || cLower.includes('romance')) catBadge = '💖 Romance';
      else if (cLower.includes('anniversary') || cLower.includes('wedding')) catBadge = '💍 Anniversary';
      else if (cLower.includes('friend')) catBadge = '👯 Friendship';
      else if (cLower.includes('apology')) catBadge = '🕊️ Apology';
      else if (cLower.includes('family')) catBadge = '👨‍👩‍👦 Family';
      else if (cLower.includes('celebration')) catBadge = '🎉 Celebration';
      else if (cLower.includes('memory') || cLower.includes('milestone')) catBadge = '📸 Keepsake';
      else if (cLower.includes('miss')) catBadge = '🌙 Miss You';
      else if (cLower.includes('thank')) catBadge = '🙏 Gratitude';
      else if (cLower.includes('farewell')) catBadge = '✈️ Farewell';
      else if (cLower.includes('luck')) catBadge = '🍀 Good Luck';
      else if (cLower.includes('beginning')) catBadge = '🌅 New Dawn';

      // Experience hint
      let expHint = '✨ Keepsake';
      const allText = `${(t.name||'')} ${(t.type||'')} ${(t.description||'')} ${(t.tags||[]).join(' ')} ${(t.features||[]).join(' ')}`.toLowerCase();
      if (allText.includes('candle')) expHint = '🕯️ 3D Candle';
      else if (allText.includes('wax') || allText.includes('seal') || allText.includes('letter')) expHint = '💌 Wax Letter';
      else if (allText.includes('polaroid') || allText.includes('photo')) expHint = '📸 Photo Story';
      else if (allText.includes('soundtrack') || allText.includes('music') || allText.includes('song')) expHint = '🎵 Music';
      else if (allText.includes('vow') || allText.includes('wedding')) expHint = '💍 Vows & Story';
      else if (allText.includes('cinema') || allText.includes('film') || allText.includes('reel')) expHint = '🎬 Cinematic';
      else if (allText.includes('puzzle') || allText.includes('game') || allText.includes('runaway')) expHint = '✨ Interactive';
      else if (allText.includes('spark') || allText.includes('diwali') || allText.includes('confetti')) expHint = '🎉 Celebration';
      else if (allText.includes('timeline') || allText.includes('odyssey')) expHint = '⏳ Timeline';

      // Clean emotional tagline
      let tagline = (t.tagline || t.description || '').replace(/^Lifetime validity\s*\+?\s*Make it in just 30 seconds\s*\+?\s*live beautiful QR Code\.\s*/i, '').trim();
      if (!tagline || tagline.length < 10) {
        tagline = 'Tap-to-interact celebration keepsake with personal letter and soundtrack.';
      }

      const thumb = t.thumbnail || 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=700&auto=format&fit=crop&q=80';
      const discountText = t.discount || (orig > p ? `${Math.round(((orig - p) / orig) * 100)}% off` : '');
      const catSlug = (t.categorySlug || t.category || 'birthday').toLowerCase().replace(/[^a-z0-9]/g, '');
      const videoSrc = t.videoPreview || t.previewVideo || null;

      const isLocked = false;

      const directPreviewUrl = t.templatePath || (t.id ? `templates/${safeId}/index.html` : `preview.html?template=${safeId}`);
      const directBuilderUrl = t.builderPath || (t.id ? `templates/${safeId}/builder.html` : `builder.html?template=${safeId}&occasion=${safeOccasion}`);

      return `
        <article class="vanvi-card ${isLux ? 'is-luxury' : ''}" data-cat="${escapeHtml(catSlug)}" id="card-${t.id}">
          <div class="card-art-box" onclick="window.location.href='${directPreviewUrl}'" title="Experience ${escapeHtml(t.name)}">
            <div class="vanvi-brand-corner-badge" title="Vanvi Moments Original">
              <img src="assets/vanvi-moments-official-logo.png" alt="Vanvi Moments" class="brand-badge-img" loading="lazy">
            </div>
            <span class="card-badge-top-right ${isFree ? 'free' : (isLux ? 'luxury' : 'price')}">
              ${isFree ? '🎁 Free' : (isLux ? '✦ Signature' : `₹${p}`)}
            </span>
            <!-- Ambient blurred aura behind image so colors glow without letterbox -->
            <img class="card-art-backdrop" src="${thumb}" alt="" aria-hidden="true" loading="lazy">
            <!-- Centerpiece uncropped artwork: perfectly centered & framed -->
            <img class="card-art-img" src="${thumb}" alt="${escapeHtml(t.name)}" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1513151233558-d860c5398176?w=700&auto=format&fit=crop&q=80';">
            ${videoSrc ? `
              <video class="card-art-video" src="${escapeHtml(videoSrc)}" poster="${thumb}" muted loop playsinline preload="none" onmouseenter="this.play()" onmouseleave="this.pause()" aria-hidden="true"></video>
            ` : ''}
          </div>

          <div class="card-body">
            <div class="card-exp-hint">
              <span class="exp-hint-pill">${escapeHtml(expHint)}</span>
            </div>
            <div class="card-header-meta">
              <h3 class="card-title" title="${escapeHtml(t.name)}">${escapeHtml(t.name)}</h3>
            </div>
            <p class="card-tagline" title="${escapeHtml(tagline)}">${escapeHtml(tagline)}</p>

            <div class="card-meta-row">
              <div class="card-price-cluster">
                <span class="price-now ${isFree ? 'free' : (isLux ? 'luxury' : '')}">${isFree ? 'FREE' : `₹${p}`}</span>
                ${isFree ? '' : `<span class="price-orig">₹${orig}</span>`}
                ${discountText ? `<span class="discount-pill">${discountText}</span>` : ''}
              </div>
              <div class="card-status-subtle">
                <span class="status-dot">✦</span>
                <span class="status-txt">${isFree ? 'Forever Free' : 'Lifetime Access'}</span>
              </div>
            </div>

            <div class="card-actions-grid">
              <a href="${directPreviewUrl}" class="btn-take-look" title="Preview ${escapeHtml(t.name)}">
                <span>Preview</span>
              </a>
              <a href="${directBuilderUrl}" class="btn-make-yours" title="Create ${escapeHtml(t.name)}">
                <span>Create ✦</span>
              </a>
            </div>
          </div>
        </article>
      `;
    },

    // Get 2-3 recommended templates from other categories or popular picks
    getRecommended(excludeCategoryOrId, limit = 3) {
      const norm = (excludeCategoryOrId || '').toLowerCase();
      const all = this.getAll();
      let candidates = all.filter(t => {
        const c = (t.categorySlug || t.category || '').toLowerCase();
        const id = (t.id || '').toLowerCase();
        return !c.includes(norm) && id !== norm;
      });
      if (candidates.length < limit) candidates = all.filter(t => (t.id || '').toLowerCase() !== norm);
      // Prioritize VIP/bestsellers and diversity
      candidates.sort((a, b) => (b.isLuxury ? 1 : 0) - (a.isLuxury ? 1 : 0) || (b.badge ? 1 : 0) - (a.badge ? 1 : 0));
      return candidates.slice(0, limit);
    },

    // Populate recommendation container automatically
    renderRecommendations(targetElOrId, excludeCategoryOrId) {
      const el = typeof targetElOrId === 'string' ? document.getElementById(targetElOrId) : targetElOrId;
      if (!el) return;
      const list = this.getRecommended(excludeCategoryOrId, 3);
      el.innerHTML = list.map(t => this.renderCard(t)).join('');
    },

    THEME_PRESETS,

    getTheme(template) {
      if (!template) return THEME_PRESETS.birthday;
      if (template.themeConfig) return template.themeConfig;
      const slug = (template.categorySlug || 'birthday').toLowerCase();
      return THEME_PRESETS[slug] || THEME_PRESETS.birthday;
    },

    // Custom Templates Management (AI Ingestion & Admin Studio)
    getCustomTemplates() {
      try {
        if (typeof localStorage !== 'undefined') {
          const stored = localStorage.getItem('vanvi_custom_templates');
          if (stored) return JSON.parse(stored);
        }
      } catch(e) {}
      return [];
    },

    saveCustomTemplate(customT) {
      if (!customT || !customT.id) return false;
      try {
        if (typeof localStorage === 'undefined') return false;
        let list = this.getCustomTemplates();
        const idx = list.findIndex(t => t.id === customT.id || t.slug === customT.slug);
        if (idx >= 0) {
          list[idx] = customT;
        } else {
          list.unshift(customT);
        }
        localStorage.setItem('vanvi_custom_templates', JSON.stringify(list));

        // Update active in-memory list
        const memIdx = VANVI_TEMPLATES.findIndex(t => t.id === customT.id || t.slug === customT.slug);
        if (memIdx >= 0) {
          VANVI_TEMPLATES[memIdx] = customT;
        } else {
          VANVI_TEMPLATES.unshift(customT);
        }
        return true;
      } catch(e) {
        console.error('Failed to save custom template:', e);
        return false;
      }
    },

    deleteCustomTemplate(id) {
      try {
        if (typeof localStorage === 'undefined') return false;
        let list = this.getCustomTemplates();
        list = list.filter(t => t.id !== id && t.slug !== id);
        localStorage.setItem('vanvi_custom_templates', JSON.stringify(list));

        const memIdx = VANVI_TEMPLATES.findIndex(t => t.id === id || t.slug === id);
        if (memIdx >= 0) {
          VANVI_TEMPLATES.splice(memIdx, 1);
        }
        return true;
      } catch(e) {
        return false;
      }
    }
  };

  root.VanviTemplatesData = VanviTemplatesData;
  root.VANVI_TEMPLATES = VANVI_TEMPLATES;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = VanviTemplatesData;
  }

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
