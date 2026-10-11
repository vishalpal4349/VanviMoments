/**
 * VANVI MOMENTS — MASTER TEMPLATES CATALOG & REGISTRY
 * Unified single source of truth for all templates, categories, previews, and metadata.
 */

(function(root) {
  'use strict';

  const VANVI_TEMPLATES = [
    // -------------------------------------------------------------
    // Bestie Friendship & Keepsake Special
    // -------------------------------------------------------------
    {
      id: 'bestie-friendship',
      slug: 'bestie-friendship',
      sku: 'VM-FRIEND-01',
      name: 'Bestie Friendship Celebration',
      aliases: ['bestie-friendship', 'Bestie Friendship😘', 'friendship-special'],
      category: 'Friendship',
      categorySlug: 'friendship',
      categoryName: 'Friendship & Besties',
      price: 99,
      originalPrice: 399,
      isFree: false,
      tier: 'Special Launch',
      badge: '👥 Most Popular Bestie',
      type: 'Hot-Air Balloon & Wrapped Memory Keepsake',
      icon: '👥',
      thumbnail: 'https://cdn.cutiepage.in/template-seeds/girlfriends-day/gallery1.jpeg',
      soundtrack: 'Our Song Acoustic Melody',
      tags: ['friendship', 'bestie', 'polaroids', 'scratch-cards', 'wrapped', 'memories'],
      description: 'Celebrate your best friend with hot-air balloon surprise, wrapped friendship stats, 3D polaroid flips, scratch cards, lifetime certificate, and handwritten letter.',
      features: [
        'Hot-Air Balloon Reveal Curtain Animation',
        'Friendship Wrapped 2026 Metrics & Stats',
        '3D Polaroid Memory Wall with Flippable Notes',
        'Interactive Canvas Scratch Cards with Secret Messages',
        'Official Best Friendship Lifetime Certificate',
        'Cloudinary Media CDN Storage & Instant ₹99 Razorpay Unlock'
      ],
      customizableFields: ['Bestie Name', 'Wrapped Stats', 'Memory Photos', 'Pinky Promises', 'Handwritten Note', 'Music Song'],
      previewOccasion: 'Bestie Celebration',
      previewRecipient: 'My Best Friend',
      previewSender: 'Your Person Forever',
      previewMessage: 'Every year this day comes around and I think the same thing: I got so lucky with you.',
      accentColor: '#14907f',
      templatePath: 'Bestie Friendship😘/index.html',
      builderPath: 'Bestie Friendship😘/builder.html'
    },
    // -------------------------------------------------------------
    // Ivory Arch Minimal Luxe Wedding
    // -------------------------------------------------------------
    {
      id: 'ivory-arch-wedding',
      slug: 'ivory-arch-wedding',
      sku: 'VM-IVORY-01',
      name: 'Ivory Arch Wedding',
      aliases: ['ivory-arch-wedding', 'ivory-arch-collection', 'ivory-arch'],
      category: 'Wedding',
      categorySlug: 'wedding',
      categoryName: 'Wedding & Engagement',
      price: 499,
      originalPrice: 999,
      isFree: false,
      tier: 'Minimal Luxe',
      badge: '✨ Minimal Luxe',
      type: 'Layered Arches & Champagne Gold Celebration',
      icon: '🏛️',
      thumbnail: 'templates/ivory-arch-wedding/assets/backgrounds/Background 4.webp',
      soundtrack: 'Temple Santoor & Minimal Classical Sitar',
      tags: ['wedding', 'ivory-arch', 'minimal-luxe', 'gold', 'shaadi', 'rsvp', '3d'],
      description: 'Minimal Luxe Ivory & Soft Champagne Gold wedding celebration website. Layered architectural arches, floating floral petals, elegant curtain reveal, live countdown timer, couple narrative, multi-event ceremony itinerary, and personalized guest link generator.',
      features: [
        'Minimal Luxe Architectural Arches & Ivory Gold Palette',
        'Ambient Golden Dust & Delicate Rose Petal Canvas',
        'Smooth Interactive Curtain Unboxing',
        'Live Auspicious Muhurat Countdown Timer',
        'Full Multi-Event Itinerary with Google Maps Integration',
        'Curated Music Player with Raag Yaman & Sitar Synth',
        'Personalized VIP Relative Link Generator',
        'Instant RSVP & Attendance Confirmation via WhatsApp',
        'Real-Time Studio Builder with Mobile & Desktop Simulator'
      ],
      customizableFields: ['Groom & Bride Names', 'Muhurat & Date', 'Family Honors', 'Ceremonies Itinerary', 'Dress Code', 'VIP Guest Links'],
      previewOccasion: 'Shubh Vivah',
      previewRecipient: 'Kishan & Divya',
      previewSender: 'Sharma & Verma Families',
      previewMessage: 'With the divine blessings of our elders, join us for our wedding celebration.',
      accentColor: '#C8A870',
      templatePath: 'templates/ivory-arch-wedding/index.html',
      previewPath: 'templates/ivory-arch-wedding/preview.html',
      builderPath: 'templates/ivory-arch-wedding/builder.html'
    },
    // -------------------------------------------------------------
    // Royal Vows Haute Indian Wedding
    // -------------------------------------------------------------
    {
      id: 'royal-vows-indian-wedding',
      slug: 'royal-vows-indian-wedding',
      sku: 'VM-VOWS-01',
      name: 'Royal Vows Indian Wedding',
      aliases: ['royal-vows-indian-wedding', 'royal-vows', 'shubh-vivah-royal-vows'],
      category: 'Wedding',
      categorySlug: 'wedding',
      categoryName: 'Wedding & Engagement',
      price: 1499,
      originalPrice: 2499,
      isFree: false,
      tier: 'Haute Vivah',
      badge: '👑 Haute Vivah',
      type: 'Cinematic 3D Mandap & Shahi Patrika Celebration',
      icon: '🏛️',
      thumbnail: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=700&auto=format&fit=crop',
      soundtrack: 'Auspicious Royal Shehnai & Santoor Melodies',
      tags: ['wedding', 'royal-vows', 'palace-gates', '3d', 'mandap', 'shehnai', 'shahi-patrika', 'luxury', 'jodhpur'],
      description: 'Haute Royal Indian Vivah celebration website with 3D Palace Gates mandap unboxing, falling rose petals & golden dust canvas, live auspicious muhurat countdown, bride & groom introduction, shahi patrika, 6-event ceremony itinerary, and interactive blessings.',
      features: [
        'Cinematic 3D Palace Gates Mandap Unboxing Ceremony',
        'Falling Rose Petals & Golden Shimmer Particle Canvas',
        'Synthesized Classical Shehnai & Santoor Soundscape',
        'Live Auspicious Muhurat Countdown Timer Ribbon',
        'Bride & Groom Royal Introduction Cards',
        'Authentic Shahi Patrika Digital Invitation Card',
        'Complete 6-Event Sacred Ceremonies Grid with Maps Integration',
        'Interactive Flower Shower & Haldi Blessings Button',
        'RSVP Form with Direct WhatsApp Confirmation Dispatch',
        'Integrated Live Studio Builder with Mobile & Desktop Simulator'
      ],
      customizableFields: ['Bride & Groom Names', 'Wedding Date & Muhurat', 'Family Details', '6 Ceremonies Itinerary', 'Couple Portraits', 'Velvet & Gold Colors'],
      previewOccasion: 'Shubh Vivah Celebration',
      previewRecipient: 'Tanya & Rohan',
      previewSender: 'Kapoor & Sharma Families',
      previewMessage: 'With hearts full of joy and the grace of the divine, we invite you to bless our sacred union under the grand skies of Jodhpur.',
      accentColor: '#D4AF37',
      templatePath: 'templates/royal-vows-indian-wedding/index.html',
      previewPath: 'templates/royal-vows-indian-wedding/preview.html',
      builderPath: 'templates/royal-vows-indian-wedding/builder.html'
    },
    // -------------------------------------------------------------
    // 0. Flagship Royal Palace Wedding & Heritage Keepsakes
    // -------------------------------------------------------------
    {
      id: 'the-grand-royal-palace-wedding',
      slug: 'the-grand-royal-palace-wedding',
      sku: 'VM-ROYAL-01',
      name: 'The Grand Royal Palace Vivah',
      aliases: ['royal-udaipur', 'royal-palace-wedding', 'taj-lake-palace-vivah', 'udaipur-royal-wedding'],
      category: 'Celebration',
      categorySlug: 'celebration',
      categoryName: 'Royal Wedding & Celebration',
      price: 999,
      originalPrice: 1499,
      isFree: false,
      tier: 'Royal VIP',
      badge: '👑 Royal Heritage',
      type: 'Palace Heritage Wedding Invitation',
      icon: '👑',
      thumbnail: 'assets/templates/royal-palace-wedding.jpg',
      soundtrack: 'Royal Shehnai Harmony & Sitar Symphony',
      tags: ['bestseller', 'wedding', 'royal', 'udaipur', 'lake-palace', 'heritage', 'luxury', 'shaadi'],
      description: 'India\'s most regal digital wedding invitation experience. Inspired by the majestic Taj Lake Palace Udaipur with animated palace gates, multi-ceremony schedule, sacred vows love note, royal photo gallery, interactive RSVP, and shehnai music.',
      features: [
        'Majestic Lake Pichola Palace Gateway Animation',
        'Multi-Ceremony Royal Event Itinerary (Mehendi, Sangeet, Vivah, Reception)',
        'Sacred Seven Vows & Handwritten Love Note',
        'Royal Palace Photo Gallery with Ambient Starlight',
        'Interactive Guest RSVP via WhatsApp & Calendar Sync',
        'Authentic Shehnai & Sitar Harmony Soundtrack Player',
        'Dedicated Royal Wedding Builder Studio'
      ],
      customizableFields: ['Bride & Groom Names', 'Ceremony Schedule', 'Palace Venue', 'Family Lineage', 'Love Letter', 'Photos', 'RSVP WhatsApp'],
      previewOccasion: 'Wedding Celebration',
      previewRecipient: 'Honoured Guests & Family',
      previewSender: 'With Royal Blessings, Virat & Anushka',
      previewMessage: 'As we take our sacred seven pheras under the starlit sky of Lake Pichola, having your presence and heartfelt blessings means the entire world to us. Join us for our royal union! ✨👑',
      accentColor: '#d4af37',
      templatePath: 'templates/royal-palace-wedding/index.html'
    },
    {
      id: 'vanvi-royal-wedding',
      slug: 'vanvi-royal-wedding',
      sku: 'VNV-FREE-01',
      name: 'Royal Vows — The Free Wedding Experience',
      aliases: ['royal-vows', 'the-wedding-experience', 'vanvi-royal', 'royal-wedding-flagship'],
      category: 'Celebration',
      categorySlug: 'celebration',
      categoryName: 'Royal Wedding & Celebration',
      price: 0,
      originalPrice: 2499,
      isFree: true,
      tier: 'Community Gift',
      badge: '🎁 100% Free Vivah Gift',
      type: 'Ultra-Luxury 33-Section Digital Wedding Keepsake',
      icon: '🎁',
      thumbnail: 'assets/templates/royal-palace-wedding.jpg',
      soundtrack: 'Imperial Festive Shehnai & Sitar Courtyard Symphony',
      tags: ['free', 'wedding', 'royal', 'udaipur', 'flagship', '33-sections', 'bestseller'],
      description: 'Vanvi Moments Free Community Gift: Complete 33-section cinematic wedding celebration with royal curtain reveal, screen bloom, falling rose petals, auspicious Ganesha decree, couple bios, 3-part love story, 5-event timeline with maps & calendar sync, guest concierge, photo gallery, wax seal reveal, interactive wishes wall, and 1-click WhatsApp RSVP.',
      features: [
        'Complete 33-Section Cinematic Wedding Experience',
        'Tap-to-Enter Royal Curtain Unboxing with Screen Bloom',
        'Falling Rose Petals Interactive Canvas Physics',
        'Shree Ganesh Auspicious Farman & Parental Decree',
        '5-Ceremony Itinerary with Google Maps Navigation',
        '3-Part Love Story & Prewedding Photo Gallery',
        'Real-Time Live Wedding Muhurtham Countdown',
        'Digital Wax Seal Reveal & Guest Wishes Wall',
        '1-Click WhatsApp Direct RSVP & Calendar Sync',
        '13-Step Guided Studio Customizer (100% Free)'
      ],
      customizableFields: ['Bride & Groom Names', 'Wedding Date', 'Palace Venue', 'Ceremony Schedule', 'Love Story', 'Photos', 'WhatsApp RSVP'],
      previewOccasion: 'Royal Wedding Celebration',
      previewRecipient: 'Honoured Guests & Loved Ones',
      previewSender: 'With Love & Blessings, Tanya & Rohan',
      previewMessage: 'You are cordially invited to celebrate the holy union of Tanya & Rohan under the starlit skies of Lake Pichola. 100% Free digital wedding keepsake! 🎁👑',
      accentColor: '#c4985a',
      templatePath: 'templates/vanvi-royal-wedding/index.html',
      previewPath: 'templates/vanvi-royal-wedding/preview.html',
      builderPath: 'templates/vanvi-royal-wedding/builder.html'
    },
    {
      id: 'royal-udaivilas-baithak',
      slug: 'royal-udaivilas-baithak',
      sku: 'VNV-LUX-05',
      name: 'The Royal Udaivilas Baithak — Grand Vivah Suite',
      aliases: ['udaivilas-baithak', 'royal-baithak-wedding', 'shaadipath-baithak', 'udaivilas-palace'],
      category: 'Celebration',
      categorySlug: 'celebration',
      categoryName: 'Royal Wedding & Celebration',
      price: 999,
      originalPrice: 1999,
      isFree: false,
      tier: 'Signature',
      badge: '👑 Imperial Palace (50% OFF)',
      type: 'Imperial Royal Baithak Wedding Keepsake',
      icon: '👑',
      thumbnail: 'assets/templates/royal-palace-wedding.jpg',
      soundtrack: 'Imperial Sitar & Shehnai Courtyard Melody',
      tags: ['bestseller', 'wedding', 'royal', 'udaivilas', 'baithak', 'palace', 'luxury', 'shaadi'],
      description: 'Ultra-luxury cinematic palace wedding invitation suite featuring 13 interactive chapters: Sacred Gold Mandala Preloader, 3D Palace Parallax Hero Stage (220vh) with swinging brass diyas & celestial moon, Mewar Elephant Confetti & Flower Shower Cannons, 1200px Gold Toran SVG Garland & Lineage Parchment, 6 Auspicious Ceremonies Itinerary, Theatrical Ruby Velvet Curtain Pull, Editorial Photo Mosaic with Fullscreen Lightbox, Digital Shagun Envelope with crackable wax seal, Interactive Real-Time Guestbook Wall, VIP WhatsApp RSVP with petal burst, Floating Royal Audio Dock, and 3 Heritage Mood Presets.',
      features: [
        'Sacred Gold Mandala SVG Trace Preloader with Vanvi Royal Seal',
        '220vh 3D Palace Parallax Hero Stage with swinging brass diyas & live countdown',
        'Dual Mewar Elephant Confetti & Pushpa Vrishti Cannons with tap triggers',
        '1200px Gold Toran SVG Garland, pulsating Ganesha crest & Lineage Parchment',
        'Celebration Itinerary with 6 Ceremonies (Haldi, Mehendi, Sangeet, Sagan, Vivah, Reception)',
        'Theatrical Ruby Velvet Curtain Pull with rotating celestial mandala & couple romance verse',
        'Editorial Moments Gallery with interactive Fullscreen Lightbox',
        'Digital Shagun Envelope with tap-to-crack authentic red wax seal & UPI QR',
        'Interactive Real-Time Guest Blessings Wall with LocalStorage persistence',
        'VIP WhatsApp RSVP with dynamic guest personalization & petal burst physics',
        'Floating Royal Audio Dock with Shehnai soundscape & background tab detection',
        '3 Heritage Mood Presets (Royal Mewar, Udaipur Pearl, Jaipur Sunset)',
        'Bespoke Split-Screen Customizer Studio with Bulk WhatsApp Link Generator'
      ],
      customizableFields: ['Bride & Groom Names', 'Wedding Date', 'Palace Venue', 'Family Lineage', '6 Ceremonies', 'Digital Shagun UPI', 'WhatsApp RSVP'],
      previewOccasion: 'Royal Wedding Celebration',
      previewRecipient: 'Honoured Guests & Loved Ones',
      previewSender: 'With Royal Blessings, Tanya & Rohan',
      previewMessage: 'Cordially invite you to celebrate our sacred union and holy matrimony under the majestic starlit skies of Lake Pichola at The Oberoi Udaivilas! 🪷👑',
      accentColor: '#c4985a',
      templatePath: 'templates/royal-udaivilas-baithak/index.html',
      previewPath: 'templates/royal-udaivilas-baithak/preview.html',
      builderPath: 'templates/royal-udaivilas-baithak/builder.html'
    },
    {
      id: 'floral-mehendi-story',
      slug: 'floral-mehendi-story',
      sku: 'VNV-FEST-01',
      name: 'Floral Mehendi Story — Luxury Festive Vivah Suite',
      aliases: ['floral-mehendi', 'mehendi-story', 'phoolon-ki-haldi', 'festive-floral-wedding'],
      category: 'Celebration',
      categorySlug: 'wedding',
      categoryName: 'Festive / Mehendi / Haldi Ceremony',
      price: 499,
      originalPrice: 999,
      isFree: false,
      tier: 'Signature',
      badge: '🌿 Most Popular / Luxury Floral',
      type: 'Luxury Festive Floral Mehendi & Sangeet Keepsake',
      icon: '🌸',
      thumbnail: 'assets/templates/floral-mehendi-story.jpg',
      soundtrack: 'Imperial Shehnai, Flute & Festive Sitar Symphony',
      tags: ['bestseller', 'mehendi', 'haldi', 'sangeet', 'floral', 'festive', 'luxury', 'wedding', 'sage-green'],
      description: 'Ultra-luxury floral and sage festive celebration keepsake: 3D Palace Parallax with swinging brass lanterns, Sage Curtains Reveal Animation, Auspicious 5-Ceremony Festive Itinerary, Interactive Ashirwad & Blessings Box with instant WhatsApp delivery, VIP Personalized Guest Greeting Generator (?guest=Name), and Floating Royal Shehnai Soundscape.',
      features: [
        '3D Palace Parallax & Sage Silk Curtains Reveal Animation',
        'Floating Wedding Shehnai & Sitar Music Switcher with ambient soundscape',
        'VIP Personalized Invite Link Generator (?guest=Name)',
        'Interactive Ashirwad & Blessings Box with instant WhatsApp delivery & petal burst',
        'Live Astronomical Wedding Countdown with festive marigold glow',
        'Auspicious Itinerary (Mehendi Ki Raat, Phoolon Ki Haldi, Sangeet Dhamaka, Shubh Vivah, Reception)',
        'Direct Google Maps venue navigation and 1-Click WhatsApp RSVP',
        'Bespoke Studio Customizer with live side-by-side preview and mobile segmented switcher'
      ],
      customizableFields: ['Bride & Groom Names', 'Wedding & Ceremony Dates', 'Palace Venue', 'Love Note & Hashtag', 'WhatsApp RSVP', 'Digital Shagun UPI'],
      previewOccasion: 'Festive Mehendi & Vivah Celebration',
      previewRecipient: 'Honoured Guests & Loved Ones',
      previewSender: 'With Festive Blessings, Avani & Kabir',
      previewMessage: 'Cordially invite you to celebrate our sacred Mehendi, Phoolon Ki Haldi & Vivah with joyful songs, fragrant henna and eternal love! 🌸🌿',
      accentColor: '#c89b3c',
      templatePath: 'templates/floral-mehendi-story/index.html',
      previewPath: 'templates/floral-mehendi-story/index.html',
      builderPath: 'templates/floral-mehendi-story/builder.html'
    },
    {
      id: 'sacred-temple-edition',
      slug: 'sacred-temple-edition',
      sku: 'VNV-TMPL-02',
      name: 'Sacred Temple Edition — Traditional Dravidian & Vedic Wedding',
      aliases: ['sacred-temple', 'temple-edition', 'south-indian-sacred', 'traditional-temple-wedding', 'kerala-kasavu-vivah'],
      category: 'Wedding',
      categorySlug: 'wedding',
      categoryName: 'Traditional / South Indian / Temple Architecture',
      price: 999,
      originalPrice: 2499,
      isFree: false,
      tier: 'Signature',
      badge: '🛕 Traditional Temple Luxury',
      type: 'Traditional South Indian & Vedic Temple Architecture Keepsake',
      icon: '🛕',
      thumbnail: 'assets/templates/sacred-temple-edition.jpg',
      soundtrack: 'Sacred Nadaswaram, Temple Bells & Vedic Sitar Melody',
      demoCouple: {
        groom: 'Kishan',
        bride: 'Divya'
      },
      tags: ['traditional', 'temple', 'south-indian', 'vedic', 'kerala-kasavu', 'backwaters', 'nilavilakku', 'luxury', 'wedding', 'bestseller'],
      description: 'Ultra-luxury traditional South Indian & Vedic temple wedding suite featuring 3D Houseboat Backwaters Parallax, Floating Fireflies, Scroll-Triggered Nilavilakku Lamp Lighting Ceremony, Kasavu Curtains Story Reveal, VIP Personalized Guest Links (?guest=Name), and Interactive Sacred Ashirwad WhatsApp Delivery.',
      features: [
        '3D Houseboat Backwaters Parallax & Floating Fireflies',
        'Scroll-Triggered Nilavilakku Lamp Lighting Ceremony with warm radial glows',
        'Traditional Kerala Kasavu Silk Curtains Story Reveal',
        'VIP Personalized Guest Invite Link Generator (?guest=Name)',
        'Interactive Sacred Ashirwad & Blessings WhatsApp Delivery Box with jasmine petals burst',
        'Auspicious 4-Phase Vedic Muhurtham Timeline (Mangala Snanam, Kanyadaanam, Mangalasutra, Sadya Feast)',
        'Sacred Nadaswaram, Veena & Temple Bells Audio Dock',
        'Google Maps Mandapam Navigation & 1-Click WhatsApp RSVP',
        'Bespoke 7-Step Customizer Studio with Pay ₹999 & Publish Site integration'
      ],
      customizableFields: ['Groom & Bride Names', 'Wedding Date & Muhurtham Timing', 'Temple Mandapam Venue', 'Parental Slokas & Blessings', 'Ceremonial Schedule', 'Pre-Wedding Temple Story', 'Photo Gallery', 'Host WhatsApp Number'],
      previewOccasion: 'Traditional Temple Wedding',
      previewRecipient: 'Honoured Relatives & Sacred Well-Wishers',
      previewSender: 'With Divine Blessings, Kishan & Divya',
      previewMessage: 'Join us under the sacred temple gopuram and peaceful backwaters as Kishan & Divya tie the auspicious sacred knot. 🛕🪷',
      accentColor: '#d4af37',
      templatePath: 'templates/sacred-temple-edition/index.html',
      previewPath: 'templates/sacred-temple-edition/preview.html',
      builderPath: 'templates/sacred-temple-edition/builder.html'
    },
    {
      id: 'golden-lake-collection',
      slug: 'golden-lake-collection',
      sku: 'VNV-LAKE-01',
      name: 'Golden Lake Collection — Lake Palace Sunset Luxury',
      aliases: ['golden-lake', 'lake-palace-sunset', 'waterfront-royal', 'udaipur-lake-palace', 'swan-river-vivah'],
      category: 'Wedding',
      categorySlug: 'wedding',
      categoryName: 'Waterfront Royal / Lake Palace Sunset',
      price: 999,
      originalPrice: 2499,
      isFree: false,
      tier: 'Signature',
      badge: '🌅 Waterfront Royal Signature',
      type: 'Waterfront Royal Lake Palace Sunset Keepsake',
      icon: '🌅',
      thumbnail: 'assets/templates/golden-lake-collection.jpg',
      soundtrack: 'Imperial Sitar & Lake Ripples Symphony with Royal Dhol Beats',
      demoCouple: {
        groom: 'Kishan',
        bride: 'Divya',
        venue: 'Udaipur Lake Palace & Jagmandir Island'
      },
      tags: ['waterfront', 'lake-palace', 'sunset', 'udaipur', 'royal', 'luxury', 'wedding', 'dhol', 'swan-bridge', 'bestseller'],
      description: 'Ultra-luxury waterfront royal wedding keepsake set amidst the golden sunset of Lake Pichola: 3D Lake Palace Sunset Parallax with Swan River Bridge, Curtains Love Story Reveal, Interactive Festive Dhol Celebrations, VIP Personalized Guest Links (?guest=Name), Waterfront Ashirwad WhatsApp Delivery Box, and Cloudinary Media Storage CDN.',
      features: [
        '3D Lake Palace Sunset Parallax with Swan River Bridge & Golden Ripples',
        'Curtains Love Story Reveal with Royal Golden Swan Wax Seal',
        'Interactive Dhol Celebrations with Festive Beats & Sparks Physics',
        'VIP Personalized Guest Invite Link Generator (?guest=Name)',
        'Interactive Waterfront Ashirwad & Blessings WhatsApp Delivery Box',
        'Integrated Cloudinary Media Storage CDN with auto-cropping (f_auto, q_auto, ar_4:5)',
        'Live Sunset Wedding Muhurtham Countdown',
        'Lake Pichola Venue Directions & 1-Click WhatsApp RSVP',
        'Bespoke Studio Customizer with Pay ₹999 & Publish Site Integration'
      ],
      customizableFields: ['Groom & Bride Names', 'Sunset Wedding Date', 'Lake Palace Venue', 'Ceremonial Schedule', 'Gallery Photos (Cloudinary CDN Powered)', 'Love Story Chapters', 'Host WhatsApp Number'],
      previewOccasion: 'Waterfront Royal Wedding',
      previewRecipient: 'Honoured Dignitaries & Cherished Guests',
      previewSender: 'With Royal Warmth, Kishan & Divya',
      previewMessage: 'You are cordially invited to witness Kishan & Divya celebrate their holy union overlooking the golden waters of Lake Pichola. 🌅🏰',
      accentColor: '#f59e0b',
      templatePath: 'templates/golden-lake-collection/index.html',
      previewPath: 'templates/golden-lake-collection/preview.html',
      builderPath: 'templates/golden-lake-collection/builder.html'
    },
    {
      id: 'royal-vivah-lagna',
      slug: 'royal-vivah-lagna',
      sku: 'VM-ROYAL-04',
      name: 'Aarav & Kriti — Royal Vivah & Vedic Lagna Patrika',
      aliases: ['royal-vedic-vivah', 'aarav-kriti-wedding', 'save-the-date-royal', 'vedic-vivah-lagna'],
      category: 'Celebration',
      categorySlug: 'celebration',
      categoryName: 'Royal Wedding & Celebration',
      price: 199,
      originalPrice: 799,
      isFree: false,
      tier: 'Ultra Luxury',
      badge: '🐘 Royal Vivah',
      type: 'Royal Save the Date & Vedic Vivah Patrika',
      icon: '🪔',
      thumbnail: 'assets/templates/royal-palace-wedding.jpg',
      soundtrack: 'Royal Shehnai & Vedic Hymns Symphony',
      tags: ['bestseller', 'wedding', 'royal', 'vedic', 'patrika', 'scratch-reveal', 'pushpa-vrishti', 'guestbook', 'shaadi'],
      description: 'Ultra-luxury Vedic wedding celebration engine with fullscreen video intro, Shree Ganesh Shloka, interactive sand scratch-to-reveal countdown, Vedic Lagna Patrika 5-ceremony itinerary, Polaroid gallery, live Pushpa Vrishti petal shower simulator, virtual wax-sealed guestbook with DJ request box, and floating royal audio dock.',
      features: [
        'Fullscreen Cinematic Video Intro with 3D Scroll Cue',
        'Royal Welcome Crest & Shree Ganesh Shloka',
        'Interactive Sand Scratch-to-Reveal Live Countdown',
        'Vedic Lagna Patrika 5 Ceremonies with Google Calendar Sync',
        'Heritage Polaroid Gallery with Wax Seals & Lightbox Zoom',
        'Pushpa Vrishti Petal Shower Simulator with Live Counter',
        'Virtual Wax-Sealed Guestbook & DJ Song Request Box',
        'Floating Royal Jukebox Audio Dock'
      ],
      customizableFields: ['Bride & Groom Names', 'Wedding Date', 'Palace Venue', 'Ceremony Schedule', 'WhatsApp RSVP'],
      previewOccasion: 'Royal Vedic Wedding',
      previewRecipient: 'Honoured Families & Cherished Guests',
      previewSender: 'Aarav & Kriti',
      previewMessage: 'With the divine blessings of Lord Ganesha, we cordially invite you to celebrate our sacred union under the starlit canopy of royal heritage! 🐘🪔✨',
      accentColor: '#0a4a56',
      templatePath: 'templates/royal-vivah-lagna/index.html'
    },
    // -------------------------------------------------------------
    // 1. Featured Birthday & Surprise Experiences
    // -------------------------------------------------------------
    {
      id: 'birthday-wish-1',
      slug: 'birthday-wish-1',
      sku: 'VM-B01',
      name: 'Birthday Wish 01',
      aliases: ['bday-wish-1', 'birthday-wish-01'],
      category: 'Birthday',
      categorySlug: 'birthday',
      categoryName: 'Birthday',
      price: 149,
      originalPrice: 429,
      isFree: false,
      tier: 'Premium',
      badge: '🔥 Bestseller',
      type: 'Multi-Step Birthday Microsite',
      icon: '🎂',
      thumbnail: 'https://cdn.cutiepage.in/static/products/birthday-wish1.jpg',
      soundtrack: 'Birthday Celebration Melody',
      tags: ['bestseller', 'birthday', 'interactive', 'candles', 'polaroid', 'letter'],
      description: 'Lifetime validity + Make it in just 30 seconds + live beautiful QR Code. A playful multi-step birthday microsite with an intro, interactive celebration scene, flip cards, and final heartfelt letter.',
      features: [
        'Interactive Gift Opening Scene',
        'Tap-to-Blow Birthday Candles',
        'Swipeable Polaroid Memory Deck',
        'Handwritten Letter on Cream Paper',
        'Audio Dedication Player',
        'Instant WhatsApp & QR Share',
        'Lifetime Validity & Unlimited Edits'
      ],
      customizableFields: ['Recipient Name', 'Sender Name', 'Personal Letter', 'Photo Memories', 'Audio Dedication'],
      previewOccasion: 'Birthday',
      previewRecipient: 'Aarav',
      previewSender: 'With all my love, Sneha',
      previewMessage: 'Wishing you another 365 days of laughter, golden sunsets, and big dreams. May your year be as bright and beautiful as your smile. Happy Birthday! 🎂✨',
      accentColor: '#ff4d6d',
      templatePath: 'templates/birthday-wish-01/index.html'
    },
    {
      id: 'birthday-wish-2',
      slug: 'birthday-wish-2',
      sku: 'VM-B02',
      name: 'Birthday Wish 02',
      aliases: ['birthday-wish-02', 'bday-wish-2'],
      category: 'Birthday',
      categorySlug: 'birthday',
      categoryName: 'Birthday',
      price: 149,
      originalPrice: 429,
      isFree: false,
      tier: 'Premium',
      badge: '✨ Popular Choice',
      type: 'Wax Seal & Wishes Bouquet',
      icon: '💌',
      thumbnail: 'https://cdn.cutiepage.in/static/products/birthday-wish2.jpg',
      soundtrack: 'Warm Acoustic Dedication',
      tags: ['wax seal', 'birthday', 'luxury', 'polaroids', 'wishes bouquet', 'trending'],
      description: 'Lifetime validity + Make it in just 30 seconds + live beautiful QR Code. A refined birthday microsite — wax-sealed envelope, a warm greeting card with playable music dedication, a polaroid photo album, a bouquet of three pickable birthday wishes, and a handwritten letter on cream paper.',
      features: [
        'Wax-Sealed Envelope Animation',
        'Playable Music Dedication',
        'Polaroid Memory Album Stack',
        'Bouquet of 3 Pickable Birthday Wishes',
        'Handwritten Letter on Cream Paper',
        'Password Protected Link',
        'Lifetime Validity & Unlimited Edits'
      ],
      customizableFields: ['Recipient Name', 'Sender Name', '3 Pickable Wishes', 'Polaroid Photos', 'Heartfelt Letter'],
      previewOccasion: 'Birthday',
      previewRecipient: 'Aarav',
      previewSender: 'Sneha',
      previewMessage: 'Today is a quiet reminder of how grateful I am to have you in my life. Through all the ordinary Tuesdays and extraordinary adventures, your smile makes everything feel right. Happy Birthday! 🎂✨',
      accentColor: '#9e1a38',
      templatePath: 'templates/birthday-wish-02/index.html'
    },
    {
      id: 'birthday-gf',
      slug: 'birthday-gf',
      sku: 'VM-L03',
      name: 'Birthday Gift for Girlfriend',
      aliases: ['girlfriends-day', 'birthday-gift-gf'],
      category: 'Love & Romance',
      categorySlug: 'love',
      categoryName: 'Love & Romance',
      price: 149,
      originalPrice: 429,
      isFree: false,
      tier: 'Premium',
      badge: '💖 Most Loved',
      type: 'Romantic Girlfriend Dedication',
      icon: '💖',
      thumbnail: 'https://cdn.cutiepage.in/template-seeds/girlfriends-day/cover.png',
      soundtrack: 'Soft Romantic Melody',
      tags: ['girlfriend', 'birthday', 'love', 'romantic', 'polaroid', 'reasons why'],
      description: 'A deeply romantic birthday gift for your girlfriend — floating petals atmosphere, reasons why I love you, polaroid memory cards, music player, and handwritten love letter.',
      features: [
        'Floating Petals & Heart Rain Animation',
        'Interactive "Reasons Why I Adore You"',
        'Polaroid Keepsake Photo Frame',
        'Blush Pink Handwritten Stationery',
        'Playable Dedication Track',
        'Secret PIN Protection Option'
      ],
      customizableFields: ['Girlfriend Name', 'Sender Name', 'Reasons You Love Her', 'Photos', 'Secret Message'],
      previewOccasion: 'Birthday',
      previewRecipient: 'My Girl',
      previewSender: 'Forever Yours, Karan',
      previewMessage: 'On your birthday, I just want to pause and say thank you for choosing me every single day. You deserve a lifetime filled with sunflowers, soft breezes, and pure joy. Happy Birthday baby! 💕🎂',
      accentColor: '#ff2a7a',
      templatePath: 'templates/birthday-gf/index.html'
    },
    {
      id: 'apology-dashboard',
      slug: 'apology-dashboard',
      sku: 'VM-S01',
      name: 'Apology Dashboard',
      aliases: ['sorry-dashboard', 'cute-apology-website'],
      category: 'Heartfelt Apology',
      categorySlug: 'apology',
      categoryName: 'Heartfelt Apology',
      price: 149,
      originalPrice: 429,
      isFree: false,
      tier: 'Interactive',
      badge: '🥺 Viral Cute',
      type: 'Interactive Sorry Dashboard',
      icon: '🥺',
      thumbnail: 'https://cdn.cutiepage.in/static/special-apology.webp',
      soundtrack: 'Gentle Calming Melody',
      tags: ['apology', 'sorry', 'cute', 'runaway button', 'coupons', 'interactive'],
      description: 'A cute interactive sorry dashboard with a runaway "No" button, redeemable peace coupons, heart-rain effect, and sincere apology note.',
      features: [
        'Runaway "No" Button Animation',
        '4 Redeemable Apology Vouchers',
        'Crying to Happy Character Transition',
        'Rain of Hearts & Floating Confetti',
        'Personal Sincere Apology Letter',
        'Instant WhatsApp Sharing'
      ],
      customizableFields: ['Recipient Name', 'Sender Name', 'Apology Note', 'Custom Coupons'],
      previewOccasion: 'Apology',
      previewRecipient: 'Sneha',
      previewSender: 'Sincerely Yours, Aarav',
      previewMessage: 'I am so sorry for hurting you. You mean the absolute world to me, and nothing is worth losing your smile. Please forgive me? 💕',
      accentColor: '#e63946',
      templatePath: 'templates/apology-dashboard/index.html'
    },
    {
      id: 'birthday-white-bloom-001',
      slug: 'birthday-white-bloom-001',
      sku: 'VM-B00',
      name: 'Birthday White Bloom',
      aliases: ['soft-birthday'],
      category: 'Birthday',
      categorySlug: 'birthday',
      categoryName: 'Birthday',
      price: 0,
      isFree: true,
      tier: 'Free',
      badge: '100% Free',
      type: 'Interactive Bloom Garden',
      icon: '🌸',
      thumbnail: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=700&auto=format&fit=crop&q=80',
      soundtrack: 'Birthday Melody',
      tags: ['cute', 'birthday', 'light luxury', 'emotional', 'free', 'soft'],
      description: 'A pure light luxury birthday celebration featuring soft floating petals, 8-photo memory gallery, wax-sealed letter, live countdown, and interactive tap-to-blow cake candles.',
      features: [
        '8 Photo Memory Gallery',
        'Animated Wax Envelope',
        'Live Birthday Countdown',
        'Interactive 5-Candle Cake',
        'Story Memory Timeline',
        'Secret Reveal Drawer',
        'Real QR & WhatsApp Share'
      ],
      customizableFields: ['Recipient Name', 'Sender Name', 'Birthday Wish', '8 Photos & Captions', 'Story Timeline', 'Birthday Date', 'Soundtrack'],
      previewOccasion: 'Birthday',
      previewRecipient: 'Aarav',
      previewSender: 'Sneha',
      previewMessage: 'Wishing you another 365 days of laughter, golden sunsets, and big dreams. May your year be as bright and beautiful as your smile. Happy Birthday! 🎂✨',
      accentColor: '#b95a73',
      templatePath: 'templates/birthday-white-bloom-001/index.html'
    },
    {
      id: 'birthday-3d-candle-surprise',
      slug: 'birthday-3d-candle-surprise',
      sku: 'VM-B03',
      name: 'Midnight 3D Candle & Polaroid Magic',
      aliases: ['birthday-glow-3d', 'happybirthday-liart', '3d-candle-surprise'],
      category: 'Birthday',
      categorySlug: 'birthday',
      categoryName: 'Birthday',
      price: 0,
      originalPrice: 599,
      isFree: true,
      tier: 'Free',
      badge: '100% Free Keepsake',
      type: '3D Candle & Scratch Experience',
      icon: '🕯️',
      thumbnail: 'https://cdn.cutiepage.in/template-previews/birthday-surprise/cover-msvjd9ve.jpg',
      soundtrack: 'Birthday Acoustic Melody',
      tags: ['3D Candle', 'Birthday', 'Interactive', 'Polaroid Stack', 'Scratch Card', 'Surprise', 'Premium', 'Trending'],
      description: 'An extraordinary multi-stage birthday celebration featuring 3D gift box opening, interactive candle blow-out with smoke physics, swipeable polaroid memory stack, and gold luxury scratch vouchers.',
      features: [
        'Interactive Gift Box Opening Animation',
        'Floating Balloons & Rose Petal Atmosphere',
        'Animated Wax Envelope & Heart SVG Letter',
        'Typewriter Emotional Birthday Letter',
        '3D Cake with Interactive Candle Flame & Smoke',
        'Swipeable Polaroid Photo Deck (Up to 4 Photos)',
        '3 Mystery Scratch Cards with Gold Foil Reveal',
        'Grand Finale with Fireworks Confetti & Ambient Audio',
        'WhatsApp & Direct QR Sharing'
      ],
      customizableFields: [
        'Recipient Name',
        'Sender Name',
        'Heartfelt Birthday Letter',
        '4 Custom Photos with Captions',
        '3 Scratch Coupon Wishes',
        'Music Soundtrack'
      ],
      previewOccasion: 'Birthday',
      previewRecipient: 'Beautiful',
      previewSender: 'With all my love ❤️',
      previewMessage: 'To the most wonderful person in my life. Thank you for always being my source of encouragement, my strong support, and the joy in my life. I wish you to always be beautiful, happy, and successful in everything. Happy Birthday! 💕',
      accentColor: '#ff477e',
      templatePath: 'templates/birthday-3d-candle-surprise/index.html'
    },
    {
      id: 'birthday-bloom',
      slug: 'birthday-bloom',
      sku: 'VM-B04',
      name: 'Birthday Bloom',
      category: 'Birthday',
      categorySlug: 'birthday',
      categoryName: 'Birthday',
      price: 99,
      originalPrice: 299,
      isFree: false,
      badge: 'Most Popular',
      type: 'Interactive Cinema',
      icon: '🌸',
      thumbnail: 'https://cdn.cutiepage.in/static/sweet-birthday.webp',
      soundtrack: 'Acoustic Floral Waltz',
      tags: ['premium', 'birthday', 'floral', 'popular'],
      description: 'Spring blossom petal animation that blooms as they swipe through your memories, accompanied by gentle acoustic melody.',
      features: ['Blooming Flower Animation', 'Up to 5 Photos', 'Audio Soundtrack', 'Secret PIN Protection'],
      previewOccasion: 'Birthday',
      previewRecipient: 'Vanvi',
      previewSender: 'Rohan',
      previewMessage: 'May your year bloom with endless joy, unforgettable memories, and happiness in every step. Happy Birthday! 🌸🎂',
      accentColor: '#ec4899',
      templatePath: 'templates/birthday-wish-01/index.html'
    },
    {
      id: 'birthday-cinema',
      slug: 'birthday-cinema',
      sku: 'VM-B05',
      name: 'Birthday Cinema',
      category: 'Birthday',
      categorySlug: 'birthday',
      categoryName: 'Birthday',
      price: 149,
      originalPrice: 429,
      isFree: false,
      badge: 'VIP Cinema',
      type: 'Full Screen Reel',
      icon: '🎬',
      thumbnail: 'https://cdn.cutiepage.in/template-seeds/netflix-story/cover.webp',
      soundtrack: 'Cinematic Orchestral Strings',
      tags: ['premium', 'birthday', 'cinema', 'trending'],
      description: 'A cinematic movie experience with letterbox visual framing, dramatic spotlight transitions, and orchestral background music.',
      features: ['Cinematic Letterbox Reel', 'Up to 10 Photos with Ken Burns', 'Dramatic Reveal Soundtrack', 'Full Screen Responsive'],
      previewOccasion: 'Birthday',
      previewRecipient: 'Kabir',
      previewSender: 'Pooja',
      previewMessage: 'To the main character of our story. May your next chapter be your biggest blockbuster yet. Happy Birthday! 🍿✨',
      accentColor: '#f59e0b',
      templatePath: 'templates/birthday-wish-01/index.html'
    },
    {
      id: 'midnight-cake-surprise',
      slug: 'midnight-cake-surprise',
      sku: 'VM-B06',
      name: 'Midnight Cake Surprise',
      category: 'Birthday',
      categorySlug: 'birthday',
      categoryName: 'Birthday',
      price: 0,
      originalPrice: 349,
      isFree: true,
      tier: 'Free',
      badge: '100% Free Keepsake',
      type: '3D Candle Blow',
      icon: '🕯️',
      thumbnail: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=700&auto=format&fit=crop&q=80',
      soundtrack: 'Celebration Confetti Fanfare',
      tags: ['premium', 'birthday', 'interactive', 'fun'],
      description: 'An interactive 3D birthday cake where the recipient taps to blow out the virtual candles, triggering a burst of golden confetti.',
      features: ['Interactive Candle Blow', 'Golden Confetti Cannon', 'Secret Birthday Wish Box', 'Audio-reactive celebration'],
      previewOccasion: 'Birthday',
      previewRecipient: 'Simran',
      previewSender: 'Arjun',
      previewMessage: 'Make a wish and tap to blow the candles! May every dream you whispered come true this year. 🎂💖',
      accentColor: '#a855f7',
      templatePath: 'templates/birthday-3d-candle-surprise/index.html'
    },
    {
      id: 'retro-birthday-polaroid',
      slug: 'retro-birthday-polaroid',
      sku: 'VM-B07',
      name: 'Retro Polaroid Wall',
      category: 'Birthday',
      categorySlug: 'birthday',
      categoryName: 'Birthday',
      price: 0,
      originalPrice: 199,
      isFree: true,
      badge: 'Free Classic',
      type: 'Nostalgic Collage',
      icon: '📷',
      thumbnail: 'https://cdn.cutiepage.in/static/birthday-wish4-v2.png',
      soundtrack: 'Vintage Lofi Chords',
      tags: ['free', 'birthday', 'nostalgia', 'photos'],
      description: 'Charming vintage polaroid photo prints pinned to a corkboard with handwritten sticky notes and nostalgic tape.',
      features: ['Retro Polaroid Frames', 'Handwritten Font Styling', 'Custom Date Stamps', 'Instant WhatsApp Share'],
      previewOccasion: 'Birthday',
      previewRecipient: 'Vikram',
      previewSender: 'Besties',
      previewMessage: 'Looking back at all the chaos and laughs we shared. Cheers to another crazy year ahead! Happy Birthday brother!',
      accentColor: '#38bdf8',
      templatePath: 'templates/birthday-wish-01/index.html'
    },
    {
      id: 'cute-pastel-birthday',
      slug: 'cute-pastel-birthday',
      sku: 'VM-B00',
      name: 'Cute Pastel Birthday',
      aliases: ['cute-pastel-bday', 'pastel-birthday', 'cute-birthday-01', 'cute-pastel'],
      category: 'Birthday',
      categorySlug: 'birthday',
      categoryName: 'Birthday',
      price: 29,
      originalPrice: 149,
      isFree: false,
      tier: 'Premium',
      badge: '✨ #1 Bestseller',
      type: 'Dreamy Pastel Celebration & 15 Interactive Chapters',
      icon: '🎂',
      thumbnail: 'assets/cute-pastel-birthday-thumb.jpg',
      soundtrack: 'Sweet Celebration Melodies',
      tags: ['bestseller', 'birthday', 'cute', 'pastel', 'dreamy', '3d cake', 'gift reveal', 'polaroid', 'timeline', 'letter', 'music player', 'qr code'],
      description: 'An ultra-premium, emotional, cinematic birthday experience with 3D gift reveal, interactive cake wish, memory timeline, wax letter, music player, photo gallery, and celebratory confetti.',
      features: [
        'Cinematic Pastel Sky Hero & Floating Balloons',
        'Interactive 3D Gift Box Reveal & Confetti',
        'Live Birthday Countdown Timer',
        'Interactive 3D Cake & Tap-to-Blow Candles',
        'Little Moments Big Memories Photo Intro',
        'Cinematic Photo Gallery with Fullscreen Lightbox',
        'Our Beautiful Journey Scroll Timeline',
        'Royal Wax-Sealed Birthday Letter Reveal',
        '3D Special Memories Cards Deck',
        'Mystery Surprise Reveal Card',
        'Floating Cute Vinyl Record Music Player',
        'Ambient Floating Petals & Sparkle Canvas',
        'May Your Next Chapter Be Beautiful Final Chapter',
        'Celebrate Again Confetti & Balloon Burst',
        'Instant WhatsApp Share & High-Res QR Code'
      ],
      customizableFields: ['Recipient Name', 'Sender Name', 'Birthday Date', 'Main Hero Message', 'Heartfelt Letter', 'Surprise Message', 'Photo Memories (5-15 Photos)', '6 Pastel Color Themes', 'Soundtrack Dedication', 'Memory Timeline Milestones'],
      previewOccasion: 'Birthday',
      previewRecipient: 'Aaradhya',
      previewSender: 'From Riya',
      previewMessage: 'May your special day be filled with warm sunshine, endless laughter, and all the sweet magic in the universe. Happy Birthday! 🎂✨',
      accentColor: '#ff6da8',
      templatePath: 'templates/cute-pastel-birthday/index.html',
      previewPath: 'templates/cute-pastel-birthday/preview.html',
      builderPath: 'templates/cute-pastel-birthday/builder.html'
    },

    // -------------------------------------------------------------
    // 2. Love & Romance Collection
    // -------------------------------------------------------------
    {
      id: 'little-love',
      slug: 'little-love',
      sku: 'VM-L01',
      name: 'Little Love',
      category: 'Love',
      categorySlug: 'love',
      categoryName: 'Love & Romance',
      price: 0,
      originalPrice: 199,
      isFree: true,
      badge: '100% Free',
      type: 'Romantic Scroll Story',
      icon: '💌',
      thumbnail: 'https://cdn.cutiepage.in/template-seeds/couples-day/cover.webp',
      soundtrack: 'Soft Acoustic Guitar',
      templatePath: 'templates/birthday-gf/index.html',
      tags: ['free', 'love', 'romantic', 'minimalist'],
      description: 'A minimalist, deeply touching scroll story that gently reveals your feelings line by line against a velvet night background.',
      features: ['Typewriter Letter Reveal', 'Velvet Glow Aesthetic', 'Romantic Ambient Audio', 'Completely Free'],
      previewOccasion: 'Love',
      previewRecipient: 'My Love',
      previewSender: 'You',
      previewMessage: 'In a world moving too fast, being with you is the only time everything feels still and right. Forever yours. 💕',
      accentColor: '#ff007a'
    },
    {
      id: 'forever-us',
      slug: 'forever-us',
      name: 'Forever Us',
      category: 'Love',
      categorySlug: 'love',
      categoryName: 'Love & Romance',
      price: 149,
      isFree: false,
      badge: 'Best Seller',
      type: 'Interactive Wax Letter',
      icon: '💌',
      soundtrack: 'Lofi Heartbeat Symphony',
      thumbnail: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=700&auto=format&fit=crop&q=80',
      tags: ['premium', 'love', 'romantic', 'bestseller'],
      description: 'An ultra-romantic bespoke letter sealed with a 3D crimson wax crest and protected with a private couple passcode PIN.',
      features: ['3D Wax Seal Animation', 'Private 4-Digit Passcode PIN', 'Romantic Photo Storyboard', 'WhatsApp Reply Handoff'],
      previewOccasion: 'Love',
      previewRecipient: 'Sneha',
      previewSender: 'Karan',
      previewMessage: 'Every ordinary day feels like poetry when I am with you. Here is to all our unspoken smiles and infinite tomorrows.',
      accentColor: '#f43f5e'
    },
    {
      id: 'moonlight-story',
      slug: 'moonlight-story',
      name: 'Moonlight Constellation',
      category: 'Love',
      categorySlug: 'love',
      categoryName: 'Love & Romance',
      price: 199,
      isFree: false,
      badge: 'Ultra Luxury',
      type: 'Celestial Night Sky',
      icon: '🌙',
      soundtrack: 'Deep Space Romantic Ambient',
      thumbnail: 'https://cdn.cutiepage.in/template-previews/couples-day-v2/cover-msw1f6yw.png',
      tags: ['premium', 'love', 'celestial', 'luxury'],
      description: 'Interactive starry night sky where stars connect into constellations spelling your names and unveiling shared memory chapters.',
      features: ['Interactive Star Constellations', 'Dynamic Starlight Glow', 'Unlimited Memory Chapters', 'VIP Audio Experience'],
      previewOccasion: 'Love',
      previewRecipient: 'Diya',
      previewSender: 'Aditya',
      previewMessage: 'If I had a star for every time you made me smile, the whole night sky would be blindingly bright. I love you. ✨',
      accentColor: '#c084fc'
    },
    {
      id: 'secret-wax-letter',
      slug: 'secret-wax-letter',
      name: 'Secret Wax Seal Letter',
      category: 'Love',
      categorySlug: 'love',
      categoryName: 'Love & Romance',
      price: 99,
      isFree: false,
      badge: 'Trending',
      type: 'Vintage Parchment',
      icon: '🔐',
      soundtrack: 'Old Romance Violin',
      thumbnail: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=700&auto=format&fit=crop&q=80',
      tags: ['premium', 'love', 'secret', 'letter'],
      description: 'Old-world aged parchment scroll with gold leaf trim, custom wax seal crack animation, and elegant calligraphic typography.',
      features: ['Realistic Wax Seal Breaking', 'Aged Parchment Texture', 'Calligraphy Script', 'Private Recipient URL'],
      previewOccasion: 'Love',
      previewRecipient: 'Meera',
      previewSender: 'Dev',
      previewMessage: 'Some feelings are too precious to be sent in a plain chat. This letter belongs only to you. Always. 💌',
      accentColor: '#d97706'
    },
    {
      id: 'the-proposal-reel',
      slug: 'the-proposal-reel',
      name: 'The Proposal Reel',
      category: 'Love',
      categorySlug: 'love',
      categoryName: 'Love & Romance',
      price: 249,
      isFree: false,
      badge: 'VIP Exclusive',
      type: 'Interactive Proposal',
      icon: '💍',
      soundtrack: 'Grand Romance Crescendo',
      thumbnail: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=700&auto=format&fit=crop&q=80',
      tags: ['premium', 'love', 'proposal', 'vip'],
      description: 'Designed for the biggest question of your life. A cinematic journey culminating in an interactive ring reveal with "Yes" confetti explosion.',
      features: ['Interactive Ring Box Opening', 'Yes/Forever Big Button', 'Realtime Celebration Sparks', 'Direct WhatsApp Alert'],
      previewOccasion: 'Proposal',
      previewRecipient: 'Tanvi',
      previewSender: 'Aman',
      previewMessage: 'From the first coffee to every dream we ever built together. Will you spend the rest of your life with me? 💍',
      accentColor: '#e11d48'
    },
    {
      id: 'vogue-love-magazine',
      slug: 'vogue-love-magazine',
      name: 'Vogue Romance E-Magazine',
      category: 'Love & Romance',
      categorySlug: 'love',
      categoryName: 'Love & Romance',
      price: 249,
      originalPrice: 599,
      isFree: false,
      badge: '📖 Vogue Edition',
      type: 'Editorial Couples E-Magazine',
      icon: '📖',
      soundtrack: 'Chic Parisian Melody',
      tags: ['magazine', 'e-magazine', 'vogue', 'editorial', 'love', 'anniversary', 'trending'],
      description: 'A glossy high-fashion editorial magazine designed around your love story. Features cover shoot layout, romantic interview columns, polaroid spreads, and heartfelt letters.',
      features: ['Glossy Magazine Flip Layout', 'Interview Q&A Spreads', 'Cover Story Photo Hero', 'Playable Acoustic Soundtrack', 'WhatsApp & Social Share'],
      previewOccasion: 'Love',
      previewRecipient: 'My Muse',
      previewSender: 'Forever Yours',
      previewMessage: 'The definitive edition of our greatest chapters together. From our first coffee to endless sunsets. 📖✨',
      thumbnail: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=700&auto=format&fit=crop&q=80',
      accentColor: '#e11d48'
    },

    // -------------------------------------------------------------
    // 3. Anniversary & Wedding Collection
    // -------------------------------------------------------------
    {
      id: 'golden-anniversary-walk',
      slug: 'golden-anniversary-walk',
      name: 'Golden Anniversary Walk',
      category: 'Anniversary',
      categorySlug: 'anniversary',
      categoryName: 'Anniversary & Wedding',
      price: 199,
      isFree: false,
      badge: 'Champagne Gold',
      type: 'Milestone Timeline',
      icon: '🥂',
      soundtrack: 'Golden Years Piano Waltz',
      tags: ['premium', 'anniversary', 'wedding', 'milestones'],
      description: 'A timeline of your journey from Year 1 to today. Features dual photo comparisons, milestone counters, and gold ribbon reveals.',
      features: ['Year-by-Year Milestone Timeline', 'Dual Then & Now Photos', 'Champagne Bubble Particles', 'Downloadable Keepsake Link'],
      previewOccasion: 'Anniversary',
      previewRecipient: 'Mom & Dad',
      previewSender: 'Children',
      previewMessage: '25 years of love, sacrifice, and showing us what true togetherness looks like. Happy 25th Anniversary! 🥂✨',
      thumbnail: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=700&auto=format&fit=crop&q=80',
      accentColor: '#f59e0b'
    },
    {
      id: 'everlasting-vows',
      slug: 'everlasting-vows',
      name: 'Everlasting Vows',
      category: 'Anniversary',
      categorySlug: 'anniversary',
      categoryName: 'Anniversary & Wedding',
      price: 0,
      isFree: true,
      badge: '100% Free',
      type: 'Couple Letter',
      icon: '🕊️',
      soundtrack: 'Gentle Wedding Chords',
      tags: ['free', 'anniversary', 'vows', 'elegant'],
      description: 'An understated luxury wedding anniversary letter with delicate floral frame accents and heartfelt promise renewal cards.',
      features: ['Promise Renewal Cards', 'Photo Memory Frame', 'Smooth Elegant Typography', 'Completely Free'],
      previewOccasion: 'Anniversary',
      previewRecipient: 'Rhea',
      previewSender: 'Kunal',
      previewMessage: '3 years of marriage, 1095 days of choosing you every single morning. Happy Anniversary my love!',
      thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=700&auto=format&fit=crop&q=80',
      accentColor: '#10b981'
    },
    {
      id: 'royal-wedding-story',
      slug: 'royal-wedding-story',
      name: 'Royal Wedding Invite & Story',
      category: 'Anniversary',
      categorySlug: 'anniversary',
      categoryName: 'Anniversary & Wedding',
      price: 299,
      isFree: false,
      badge: 'Ultra VIP',
      type: 'Royal Scroll Invite',
      icon: '👑',
      soundtrack: 'Royal Indian Shehnai Fusion',
      tags: ['premium', 'wedding', 'invitation', 'royal'],
      description: 'Regal Indian palace aesthetic with gold foil borders, RSVP calendar integration, venue map link, and family blessings section.',
      features: ['Royal Gold Foil Scroll', 'One-Tap Google Calendar Add', 'Google Maps Venue Link', 'Interactive Blessing Box'],
      previewOccasion: 'Wedding',
      previewRecipient: 'Honored Guests',
      previewSender: 'Sharma Family',
      previewMessage: 'With the blessings of our elders, we invite you to celebrate the wedding of Priya & Arjun in Udaipur.',
      thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=700&auto=format&fit=crop&q=80',
      accentColor: '#d97706'
    },

    // -------------------------------------------------------------
    // 4. Friendship & Besties Collection
    // -------------------------------------------------------------
    {
      id: 'best-friend-chaos',
      slug: 'best-friend-chaos',
      name: 'Best Friend Chaos & Cheers',
      category: 'Friendship',
      categorySlug: 'friendship',
      categoryName: 'Friendship & Besties',
      price: 0,
      isFree: true,
      badge: '100% Free',
      type: 'Meme & Photo Roast',
      icon: '🤪',
      soundtrack: 'Upbeat Funky Groove',
      thumbnail: 'https://cdn.cutiepage.in/template-seeds/friendship-day/cover.webp',
      tags: ['free', 'friendship', 'fun', 'memes'],
      description: 'Perfect for roasting and toasting your best friend. Comic book bubbles, polaroid tilt animations, and inside joke counters.',
      features: ['Inside Joke Counter', 'Meme Bubble Dialogues', 'Funny Photo Stickers', 'Instant WhatsApp Share'],
      previewOccasion: 'Friendship',
      previewRecipient: 'Bunty',
      previewSender: 'Yaar',
      previewMessage: 'Thanks for being the friend who never judges my terrible decisions and joins in instead! Happy Friendship Day! 😂',
      accentColor: '#06b6d4'
    },
    {
      id: 'memory-puzzle',
      slug: 'memory-puzzle',
      name: 'Memory Puzzle Game',
      category: 'Friendship',
      categorySlug: 'friendship',
      categoryName: 'Friendship & Besties',
      price: 99,
      isFree: false,
      badge: 'Interactive Game',
      type: 'Mini Sliding Game',
      icon: '🧩',
      soundtrack: 'Playful Chiptune Beats',
      thumbnail: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=700&auto=format&fit=crop&q=80',
      tags: ['premium', 'friendship', 'game', 'interactive'],
      description: 'A fun 3x3 photo puzzle that the friend must slide to solve before your secret tribute message and photos unlock!',
      features: ['Playable 3x3 Photo Puzzle', 'Hint Button if Stuck', 'Grand Win Celebration', 'Custom Trophy Badge'],
      previewOccasion: 'Friendship',
      previewRecipient: 'Isha',
      previewSender: 'Siddharth',
      previewMessage: 'You solved it! Just like you always solve my problems. Lucky to have a best friend like you! 🧩🎉',
      accentColor: '#8b5cf6'
    },

    // -------------------------------------------------------------
    // 5. Memories & Milestones Collection
    // -------------------------------------------------------------
    {
      id: 'memory-note',
      slug: 'memory-note',
      name: 'Memory Note',
      category: 'Memory',
      categorySlug: 'memories',
      categoryName: 'Memories & Milestones',
      price: 0,
      isFree: true,
      badge: '100% Free',
      type: 'Clean Scrapbook',
      icon: '📸',
      soundtrack: 'Acoustic Memories Theme',
      tags: ['free', 'memory', 'scrapbook', 'clean'],
      description: 'Clean modern scrapbook layout focusing on photographic memories, thoughtful dates, and heartfelt annotations.',
      features: ['Clean Photo Gallery', 'Date Markers', 'Thoughtful Captions', 'Mobile Responsive'],
      previewOccasion: 'Memory',
      previewRecipient: 'Priya',
      previewSender: 'Sameer',
      previewMessage: 'A little reminder of that unforgettable summer trip. Every photo tells our story.',
      thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=700&auto=format&fit=crop&q=80',
      accentColor: '#6366f1'
    },
    {
      id: 'timeline-odyssey',
      slug: 'timeline-odyssey',
      name: 'Timeline Odyssey',
      category: 'Memory',
      categorySlug: 'memories',
      categoryName: 'Memories & Milestones',
      price: 149,
      isFree: false,
      badge: 'Trending',
      type: '3D Journey Map',
      icon: '🗺️',
      soundtrack: 'Inspirational Strings',
      tags: ['premium', 'memory', 'timeline', 'journey'],
      description: 'Travel through time and locations with animated route pins, photos at each milestone, and soundtrack crescendo.',
      features: ['Interactive Map Pins', 'Audio Narration Support', 'High-Res Photo Carousel', 'Keepsake Download'],
      previewOccasion: 'Memory',
      previewRecipient: 'College Gang',
      previewSender: 'Alumni',
      previewMessage: 'From Room 302 to across the world. Here is where it all started.',
      thumbnail: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=700&auto=format&fit=crop&q=80',
      accentColor: '#0ea5e9'
    },

    // -------------------------------------------------------------
    // 6. Apology & Feelings Collection
    // -------------------------------------------------------------
    {
      id: 'maaf-kar-do',
      slug: 'maaf-kar-do',
      name: 'A Million Apologies (Maaf Kar Do)',
      category: 'Apology',
      categorySlug: 'apology',
      categoryName: 'Apology & Reconciliation',
      price: 99,
      isFree: false,
      badge: 'Deep Emotion',
      type: 'Heartstring Letter',
      icon: '🥺',
      soundtrack: 'Melancholic Healing Piano',
      tags: ['premium', 'apology', 'emotional', 'healing'],
      description: 'A genuine, heartfelt peace-offering. Soft rain aesthetic, sincere apology prompts, and a "Forgive Me" interactive heart button.',
      features: ['Rain Ambient Atmosphere', 'Interactive "Forgive Me" Button', 'Sincere Letter Template', 'WhatsApp Private Handoff'],
      previewOccasion: 'Apology',
      previewRecipient: 'Bacha',
      previewSender: 'Me',
      previewMessage: 'I know I messed up and I hurt you. My words fell short, but my regret is real. Please give us another chance. Maaf kar do na? 🥺❤️',
      thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=700&auto=format&fit=crop&q=80',
      accentColor: '#64748b'
    },

    // -------------------------------------------------------------
    // 7. Family & Parents Collection
    // -------------------------------------------------------------
    {
      id: 'maa-papa-tribute',
      slug: 'maa-papa-tribute',
      name: 'Maa & Papa Golden Tribute',
      category: 'Family',
      categorySlug: 'family',
      categoryName: 'Family & Parents',
      price: 0,
      isFree: true,
      badge: '100% Free',
      type: 'Reverent Thank You',
      icon: '🏡',
      soundtrack: 'Warm Indian Instrumental',
      tags: ['free', 'family', 'parents', 'tribute'],
      description: 'A deeply respectful and loving tribute to parents. Golden sunset glow, blessings section, and gratitude letter.',
      features: ['Family Photo Memory Frame', 'Gratitude Poem Generator', 'Warm Golden Lighting', '100% Free Forever'],
      previewOccasion: 'Family',
      previewRecipient: 'Maa & Papa',
      previewSender: 'Beta / Beti',
      previewMessage: 'For every sacrifice you made without ever complaining. Thank you for being our world. Pranaam. 🙏❤️',
      thumbnail: 'https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?w=700&auto=format&fit=crop&q=80',
      accentColor: '#f97316'
    },

    // -------------------------------------------------------------
    // 8. Celebrations & Festivals Collection
    // -------------------------------------------------------------
    {
      id: 'diwali-sparkler',
      slug: 'diwali-sparkler',
      name: 'Festive Diya & Sparklers',
      category: 'Celebration',
      categorySlug: 'celebration',
      categoryName: 'Celebrations & Festivals',
      price: 0,
      isFree: true,
      badge: '100% Free',
      type: 'Interactive Diya Light',
      icon: '🪔',
      soundtrack: 'Festive Sitar & Tabla Melodies',
      thumbnail: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=700&auto=format&fit=crop&q=80',
      tags: ['free', 'celebration', 'festival', 'diwali'],
      description: 'Tap to light the virtual diya and watch the screen glow with festive sparklers, Rangoli animations, and family blessings.',
      features: ['Tap to Light Diya', 'Sparkler Particles', 'Festive Greetings', 'Instant Social Sharing'],
      previewOccasion: 'Celebration',
      previewRecipient: 'Everyone',
      previewSender: 'Vanvi Family',
      previewMessage: 'May the divine light illuminate your home with wealth, prosperity, and radiant joy. Happy Festivities! ✨',
      accentColor: '#eab308'
    },
    {
      id: 'graduation-victory',
      slug: 'graduation-victory',
      name: 'Graduation & Milestone Victory',
      category: 'Celebration',
      categorySlug: 'celebration',
      categoryName: 'Celebrations & Festivals',
      price: 149,
      isFree: false,
      badge: 'Victory Gold',
      type: 'Cap Toss Cinema',
      icon: '🎓',
      soundtrack: 'Triumphant Brass & Timpani',
      thumbnail: 'https://images.unsplash.com/photo-1525921429624-479b6a26d84d?w=700&auto=format&fit=crop&q=80',
      tags: ['premium', 'celebration', 'graduation', 'success'],
      description: 'Celebrates academic and career achievements with animated mortarboard cap toss, certificate presentation, and confetti fireworks.',
      features: ['Cap Toss Animation', 'Certificate Mockup Frame', 'Victory Fireworks', 'Congratulations Sound FX'],
      previewOccasion: 'Celebration',
      previewRecipient: 'Dr. Tanya',
      previewSender: 'Proud Family',
      previewMessage: 'You worked through late nights, doubts, and hurdles. Today you conquered it all. So proud of you! 🎓🎉',
      accentColor: '#14b8a6',
      customizableFields: ['Graduate Name', 'Sender Name', 'Personal Message', 'Achievement Photos', 'Soundtrack']
    },

    // -------------------------------------------------------------
    // 9. Ultra Premium Masterpieces (Price > ₹700)
    // -------------------------------------------------------------
    {
      id: 'royal-heritage-cinema',
      slug: 'royal-heritage-cinema',
      name: 'Royal Heritage Cinema',
      category: 'Celebration',
      categorySlug: 'celebration',
      categoryName: 'Celebrations & Festivals',
      price: 999,
      isFree: false,
      badge: 'Ultra Premium ✦',
      tier: 'Ultra Premium',
      type: 'Masterpiece Cinema',
      icon: '👑',
      soundtrack: 'Royal Symphonic Grandeur',
      thumbnail: 'https://cdn.cutiepage.in/template-previews/wife-day/cover-mu8umzzl.jpg',
      tags: ['ultra-premium', 'cinema', 'royal', 'celebration', 'exclusive'],
      description: 'An opulent, full-scale cinematic journey featuring bespoke orchestral music, animated velvet curtains, gilded typography, and multi-chapter memory galleries.',
      features: ['Orchestral Symphony Soundtrack', 'Multi-Chapter Storyline', 'Up to 25 High-Res Photos', 'Private Gold Key PIN Access', 'Priority 4K Cloud Streaming'],
      previewOccasion: 'Royal Celebration',
      previewRecipient: 'Maharani Alisha',
      previewSender: 'Devendra',
      previewMessage: 'To the queen of my universe. May our legacy shine brighter than all the stars in the midnight sky. 👑✨',
      accentColor: '#d97706',
      customizableFields: ['Recipient Name', 'Sender Name', 'Prologue Message', '25 Story Photos', 'Background Symphony', 'Secret Royal PIN']
    },
    {
      id: 'golden-dynasty-celebration',
      slug: 'golden-dynasty-celebration',
      name: 'Golden Dynasty Milestone',
      category: 'Anniversary',
      categorySlug: 'anniversary',
      categoryName: 'Anniversary',
      price: 1499,
      isFree: false,
      badge: 'Ultra Premium ✦',
      tier: 'Ultra Premium',
      type: '3D Interactive Palace',
      icon: '🏛️',
      soundtrack: 'Golden Harp & Strings',
      tags: ['ultra-premium', 'anniversary', 'golden', 'luxury', 'bespoke'],
      description: 'A 3D royal gallery palace experience with floating gold foil particles, interactive promise scrolls, timeline milestones, and heirloom audio recording.',
      features: ['3D Gilded Gallery Architecture', 'Voice Note & Heirloom Audio Player', 'Interactive Scroll Unfurling', 'Unlimited Photo Memories', 'Bespoke Wax Seal Animation'],
      previewOccasion: 'Anniversary',
      previewRecipient: 'Rhea & Neil',
      previewSender: 'With Eternal Love',
      previewMessage: 'Decades of devotion, laughter, and unbreakable bonds. Here is to a golden lifetime together. 🥂💍',
      thumbnail: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=700&auto=format&fit=crop&q=80',
      accentColor: '#b45309',
      customizableFields: ['Couples Names', 'Anniversary Date', 'Vow Text', 'Heirloom Voice Note', 'Photo Timeline', 'Seal Monogram']
    },
    {
      id: 'celestial-galaxy-3d',
      slug: 'celestial-galaxy-3d',
      name: '3D Cosmic Starmap & Letter',
      category: 'Love',
      categorySlug: 'love',
      categoryName: 'Love & Romance',
      price: 599,
      originalPrice: 1299,
      isFree: false,
      badge: '👑 VIP 3D',
      tier: 'Ultra Premium',
      type: '3D Spatial Starmap',
      icon: '🌌',
      soundtrack: 'Interstellar Dreams & Ambient Pad',
      tags: ['ultra-premium', '3d', 'starmap', 'space', 'galaxy', 'love'],
      description: 'Explore an interactive 3D starry galaxy with customized coordinates of your special date, constellations, and private secret letter.',
      features: ['3D Interactive Starfield', 'Real Planetary Alignments', 'Secret Letter Reveal', 'Floating Starlight FX', 'High-Res Music Player'],
      previewOccasion: 'Special Date',
      previewRecipient: 'My Whole World',
      previewSender: 'Always Yours',
      previewMessage: 'The universe aligned the exact day you entered my life. To infinity and beyond. 🌌💫',
      thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=700&auto=format&fit=crop&q=80',
      accentColor: '#8b5cf6',
      customizableFields: ['Recipient Name', 'Special Date & City', 'Constellation Names', 'Personal Love Letter', 'Starlight Colors']
    },
    {
      id: 'valentine-constellation',
      slug: 'valentine-constellation',
      name: 'Eternal Constellation & Lock',
      category: 'Love',
      categorySlug: 'love',
      categoryName: 'Love & Romance',
      price: 799,
      originalPrice: 1599,
      isFree: false,
      badge: '👑 VIP Romance',
      tier: 'Ultra Premium',
      type: 'Private Vault Experience',
      icon: '✨',
      soundtrack: 'Warm Romantic Piano & Strings',
      tags: ['ultra-premium', 'love', 'secret-pin', 'wax-seal', 'romance'],
      description: 'Wax-sealed digital love vault with secret passcode, 15 photo memory chamber, and personalized romantic musical score.',
      features: ['Secret Wax Seal PIN Lock', '15 Polaroid Slideshow', 'Custom Background Score', 'Full Screen Heart Particles', 'Lifetime Cloud Vault'],
      previewOccasion: 'Love Milestone',
      previewRecipient: 'Sweetheart',
      previewSender: 'Forever Yours',
      previewMessage: 'Some secrets are worth keeping forever. You are my favorite mystery and my safest home. ❤️🔒',
      thumbnail: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=700&auto=format&fit=crop&q=80',
      accentColor: '#ff2a7a',
      customizableFields: ['Recipient Name', 'Secret 4-Digit Passcode', '15 Romantic Photos', 'Heartfelt Letter', 'Music Selection']
    },
    {
      id: 'royal-wedding-grand-palace',
      slug: 'royal-wedding-grand-palace',
      name: 'Royal Wedding Grand Palace',
      category: 'Anniversary',
      categorySlug: 'anniversary',
      categoryName: 'Wedding & Anniversary',
      price: 2499,
      originalPrice: 4999,
      isFree: false,
      badge: '👑 Royal Grand',
      tier: 'Ultra Premium',
      type: 'Grand 3D Virtual Mandap',
      icon: '🏰',
      soundtrack: 'Royal Shehnai & Sitar Harmony',
      tags: ['ultra-premium', 'wedding', 'palace', 'mandap', 'grand', 'royal'],
      description: 'Full virtual 3D wedding palace with multi-event schedule (Mehendi, Sangeet, Pheras), live guest blessing wall, and 4K video reel embeds.',
      features: ['Virtual 3D Mandap Tour', 'Live Guest Wishes Wall', 'Multi-day Event Itinerary', 'High-Res Photo & Video Gallery', 'VIP RSVP Manager'],
      previewOccasion: 'Royal Wedding',
      previewRecipient: 'Ananya & Kabir',
      previewSender: 'The Royal Family',
      previewMessage: 'Two souls, one sacred fire, eternal promises. Welcome to our royal wedding celebration. 💍✨',
      thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=700&auto=format&fit=crop&q=80',
      accentColor: '#e11d48',
      customizableFields: ['Bride & Groom Names', 'Wedding Functions & Timings', 'Photo & Video Reels', 'Guest Wishes Feed', 'Live Stream Link']
    },
    {
      id: 'eternal-love-constellation',
      slug: 'eternal-love-constellation',
      name: 'Celestial Infinity Love Universe',
      category: 'Love',
      categorySlug: 'love',
      categoryName: 'Love & Romance',
      price: 3499,
      originalPrice: 6999,
      isFree: false,
      badge: '👑 3D Universe',
      tier: 'Ultra Premium',
      type: '360° Spatial Universe',
      icon: '🪐',
      soundtrack: 'Cinematic Ethereal Galaxy Symphony',
      tags: ['ultra-premium', 'universe', '3d', 'celestial', 'bespoke', 'spatial'],
      description: 'A fully interactive 360° celestial sphere holding your audio vows, animated flying memory orbs, and bespoke studio music mix.',
      features: ['360° Spatial Gyroscope View', 'Interactive Flying Memory Orbs', 'Custom Studio Soundtrack', 'Secret Message Time Capsule', '4K Ultra Streaming'],
      previewOccasion: 'Anniversary & Vows',
      previewRecipient: 'My Soulmate',
      previewSender: 'Devoted Always',
      previewMessage: 'Across every parallel world and timeline, I would still search the cosmos and choose you every single time. 🪐✨',
      thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=700&auto=format&fit=crop&q=80',
      accentColor: '#6366f1',
      customizableFields: ['Couple Names', 'Audio Vow Recording', 'Memory Orbit Spheres', 'Custom Starlight Colors', 'Permanent Private Link']
    },
    {
      id: 'dynasty-family-heritage',
      slug: 'dynasty-family-heritage',
      name: 'Imperial Family Heritage Chronicle',
      category: 'Celebration',
      categorySlug: 'celebration',
      categoryName: 'Celebrations & Festivals',
      price: 4999,
      originalPrice: 9999,
      isFree: false,
      badge: '👑 Dynasty Gold',
      tier: 'Ultra Premium',
      type: 'Interactive 3D Family Tree',
      icon: '👑',
      soundtrack: 'Regal Orchestral Anthem',
      tags: ['ultra-premium', 'family', 'dynasty', 'heritage', 'generations'],
      description: 'A museum-grade 3D archival book chronicling generational family history with elder voice notes, ancestral timeline, and gold foil animations.',
      features: ['Generational 3D Family Tree', 'Elder Audio Blessings Archive', 'Gilded Archival Leather Book UI', 'Unlimited Photo Memories', 'Family Tree Export to PDF'],
      previewOccasion: 'Family Milestone',
      previewRecipient: 'The Singhania Family',
      previewSender: 'Generations of Love',
      previewMessage: 'Rooted in heritage, growing in honor, united in eternal love. Our family story preserved forever. 🌳🏛️',
      thumbnail: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=700&auto=format&fit=crop&q=80',
      accentColor: '#d97706',
      customizableFields: ['Family Name & Motto', '3-Generation Family Tree', 'Elder Voice Recordings', 'Historic Photos Archive', 'Gold Foil Monogram']
    },
    {
      id: 'bespoke-custom-atelier',
      slug: 'bespoke-custom-atelier',
      name: '100% Bespoke Studio Commission',
      category: 'Bespoke',
      categorySlug: 'ultra',
      categoryName: 'Bespoke Atelier',
      price: 9999,
      originalPrice: 19999,
      isFree: false,
      badge: '👑 Flagship Bespoke',
      tier: 'Ultra Premium',
      type: 'Handcrafted From Scratch',
      icon: '💎',
      soundtrack: 'Bespoke Original Studio Composition',
      tags: ['ultra-premium', 'bespoke', 'custom', 'handcrafted', 'atelier', 'vip'],
      description: 'Complete one-of-a-kind digital universe handcrafted by our creative director & 3D artists. Custom 3D modeling, private audio score, and lifetime VIP concierge.',
      features: ['100% Custom Coded & Modeled', 'Original Music Score Composition', '1-on-1 Dedicated Director & Artist', 'Custom Domain & Permanent Cloud Vault', 'Gift Box with Wax-Sealed NFC Card'],
      previewOccasion: 'Ultimate Milestone',
      previewRecipient: 'VIP Client',
      previewSender: 'Vanvi Atelier Direct',
      previewMessage: 'Designed exclusively for you. No templates. No boundaries. Pure handcrafted digital magic. 👑💫',
      thumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=700&auto=format&fit=crop&q=80',
      accentColor: '#f59e0b',
      customizableFields: ['Any Custom Concept', 'Original Music Direction', 'Full 3D Environments', 'Personalized Voiceover', 'Custom Domain Name']
    },
    // -------------------------------------------------------------
    // 9. Miss You & Distance Collection
    // -------------------------------------------------------------
    {
      id: 'miss-you-constellation',
      slug: 'miss-you-constellation',
      name: 'Miles & Constellations',
      category: 'Miss You',
      categorySlug: 'miss-you',
      categoryName: 'Miss You',
      price: 0,
      isFree: true,
      badge: 'Free Keepsake',
      type: 'Card & Letter',
      icon: '💭',
      soundtrack: 'Midnight Rain & Piano',
      tags: ['free', 'miss-you', 'distance', 'romantic', 'emotional'],
      description: 'A starlit night sky where shining constellations connect your two cities, revealing a private handwritten note.',
      features: ['Two-City Distance Starmap', 'Handwritten Letter', 'Wax Seal Reveal', 'WhatsApp Instant Delivery'],
      previewOccasion: 'Miss You',
      previewRecipient: 'My Person',
      previewSender: 'Miles Away',
      previewMessage: 'The miles between us mean nothing compared to the space you hold in my heart. Counting the days until I see you. 🌙✨',
      thumbnail: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=700&auto=format&fit=crop&q=80',
      accentColor: '#ec4899'
    },
    {
      id: 'midnight-thoughts-letter',
      slug: 'midnight-thoughts-letter',
      name: 'Midnight Longing Letter',
      category: 'Miss You',
      categorySlug: 'miss-you',
      categoryName: 'Miss You',
      price: 99,
      isFree: false,
      badge: 'Most Popular',
      type: 'Interactive Cinema',
      icon: '🌙',
      soundtrack: 'Acoustic Longing Melody',
      tags: ['premium', 'miss-you', 'emotional', 'cinema'],
      description: 'Wax-sealed envelope with dynamic distance counter, personal polaroid carousel, and ambient audio note.',
      features: ['Live Distance Indicator', 'Polaroid Memories Carousel', 'Secret PIN Passcode', 'Audio Voice Note Player'],
      previewOccasion: 'Miss You',
      previewRecipient: 'Kavya',
      previewSender: 'Aditya',
      previewMessage: 'Late nights always feel quieter without your laughter. Sending you a pocket full of warm hugs from across the miles. 🤍',
      thumbnail: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=700&auto=format&fit=crop&q=80',
      accentColor: '#38bdf8'
    },
    // -------------------------------------------------------------
    // 10. Just Because Collection
    // -------------------------------------------------------------
    {
      id: 'just-because-spark',
      slug: 'just-because-spark',
      name: 'Spontaneous Joy Box',
      category: 'Just Because',
      categorySlug: 'just-because',
      categoryName: 'Just Because',
      price: 0,
      isFree: true,
      badge: 'Free Surprise',
      type: 'Card & Note',
      icon: '✨',
      soundtrack: 'Morning Sunshine Ukulele',
      thumbnail: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=700&auto=format&fit=crop&q=80',
      tags: ['free', 'just-because', 'cute', 'spontaneous'],
      description: 'A charming pop-up gift card filled with spontaneous compliments, cheerful sparkles, and warm love without needing any reason.',
      features: ['Spontaneous Compliment Cards', 'Floating Heart Confetti', 'Custom Cute Note', 'Instant Share Link'],
      previewOccasion: 'Just Because',
      previewRecipient: 'Sunshine',
      previewSender: 'Someone Who Cares',
      previewMessage: 'No birthday. No anniversary. Just wanted to remind you that you are incredible and I am grateful for you every day! 🌸💖',
      accentColor: '#f59e0b'
    },
    {
      id: 'random-act-of-love',
      slug: 'random-act-of-love',
      name: 'Thinking Of You Cinema',
      category: 'Just Because',
      categorySlug: 'just-because',
      categoryName: 'Just Because',
      price: 99,
      isFree: false,
      badge: 'Sweet Surprise',
      type: 'Interactive Cinema',
      icon: '🌸',
      soundtrack: 'Sweet Day Lofi',
      thumbnail: 'https://cdn.cutiepage.in/template-seeds/girlfriends-day/cover.png',
      tags: ['premium', 'just-because', 'love', 'cinema'],
      description: '3-Scene photo reel celebrating ordinary beautiful days, shared coffee, laughter, and everyday magic.',
      features: ['Everyday Moments Film', '3 Photo Polaroids', 'Secret Wax Seal', 'Personal Love Note'],
      previewOccasion: 'Just Because',
      previewRecipient: 'Pooja',
      previewSender: 'Sameer',
      previewMessage: 'Saw this and immediately thought of you. You make everyday ordinary moments feel like warm golden poetry. ✨',
      accentColor: '#ff2a7a'
    },
    // -------------------------------------------------------------
    // 11. Thank You Collection
    // -------------------------------------------------------------
    {
      id: 'thank-you-golden-sunset',
      slug: 'thank-you-golden-sunset',
      name: 'Golden Gratitude Scroll',
      category: 'Thank You',
      categorySlug: 'thank-you',
      categoryName: 'Thank You',
      price: 0,
      isFree: true,
      badge: 'Free Tribute',
      type: 'Scroll & Letter',
      icon: '🙏',
      soundtrack: 'Gentle Harp & Cello',
      thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&auto=format&fit=crop&q=80',
      tags: ['free', 'thank-you', 'gratitude', 'gold'],
      description: 'An unrolling golden parchment expressing heartfelt gratitude for their guidance, kindness, and unwavering support.',
      features: ['Parchment Scroll Animation', 'Heartfelt Thank You Letter', 'Golden Sparkle Dust', 'Digital Keepsake Link'],
      previewOccasion: 'Thank You',
      previewRecipient: 'Dear Mentor',
      previewSender: 'Gratefully Yours',
      previewMessage: 'Thank you for standing by me, believing in me when I doubted myself, and being my biggest strength. Forever grateful. 🙏✨',
      accentColor: '#d97706'
    },
    {
      id: 'appreciation-tribute-reel',
      slug: 'appreciation-tribute-reel',
      name: 'Honor & Tribute Reel',
      category: 'Thank You',
      categorySlug: 'thank-you',
      categoryName: 'Thank You',
      price: 99,
      isFree: false,
      badge: 'Deep Honor',
      type: 'Interactive Cinema',
      icon: '🏆',
      soundtrack: 'Orchestral Warmth',
      thumbnail: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=700&auto=format&fit=crop&q=80',
      tags: ['premium', 'thank-you', 'tribute', 'cinema'],
      description: 'A cinematic tribute showcasing photos and words of appreciation for mentors, family, team members, or partners.',
      features: ['Milestone Appreciation Reel', 'Photo Tribute Gallery', 'Custom Gratitude Speech', 'Exclusive Keepsake Link'],
      previewOccasion: 'Thank You',
      previewRecipient: 'Papa & Mumma',
      previewSender: 'Your Child',
      previewMessage: 'For every sacrifice you made without ever saying a word. This little token is with all my love and endless respect. ❤️🙏',
      accentColor: '#059669'
    },
    // -------------------------------------------------------------
    // 12. Farewell & Goodbye Collection
    // -------------------------------------------------------------
    {
      id: 'farewell-memory-lane',
      slug: 'farewell-memory-lane',
      name: 'Safe Travels & Memory Lane',
      category: 'Farewell',
      categorySlug: 'farewell',
      categoryName: 'Farewell',
      price: 0,
      isFree: true,
      badge: 'Free Farewell',
      type: 'Card & Note',
      icon: '👋',
      soundtrack: 'Nostalgic Acoustic Guitar',
      thumbnail: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=700&auto=format&fit=crop&q=80',
      tags: ['free', 'farewell', 'goodbye', 'nostalgic'],
      description: 'A nostalgic postcard keepsake with best wishes for their upcoming travels, college journey, or new chapter.',
      features: ['Vintage Postcard Reveal', 'Warm Goodbye Wishes', '1 Polaroid Photo', 'Instant WhatsApp Share'],
      previewOccasion: 'Farewell',
      previewRecipient: 'Dev',
      previewSender: 'The Squad',
      previewMessage: 'It won’t be the same here without you, but we know you are going to do wonders. Go shine, brother! ✈️👋',
      accentColor: '#0284c7'
    },
    {
      id: 'farewell-golden-horizon',
      slug: 'farewell-golden-horizon',
      name: 'Until We Meet Again',
      category: 'Farewell',
      categorySlug: 'farewell',
      categoryName: 'Farewell',
      price: 149,
      isFree: false,
      badge: 'Group Keepsake',
      type: 'Interactive Cinema',
      icon: '✈️',
      soundtrack: 'Cinematic Farewell Waltz',
      thumbnail: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=700&auto=format&fit=crop&q=80',
      tags: ['premium', 'farewell', 'group', 'keepsake'],
      description: 'Interactive scrapbook featuring group polaroids, shared messages, and heartfelt goodbyes from the whole gang.',
      features: ['Multi-Photo Collage Reel', 'Group Messages Section', 'Flight & Journey Map', 'PIN Secret Reveal'],
      previewOccasion: 'Farewell',
      previewRecipient: 'Roshni',
      previewSender: 'Your Team',
      previewMessage: 'Thank you for the laughter, late nights, and golden memories. May your new horizon bring everything you dreamed of! 🌟✈️',
      accentColor: '#a855f7'
    },
    // -------------------------------------------------------------
    // 13. Good Luck & Wishes Collection
    // -------------------------------------------------------------
    {
      id: 'good-luck-lucky-clover',
      slug: 'good-luck-lucky-clover',
      name: 'Four-Leaf Clover Charm',
      category: 'Good Luck',
      categorySlug: 'good-luck',
      categoryName: 'Good Luck',
      price: 0,
      isFree: true,
      badge: 'Free Lucky Charm',
      type: 'Card & Game',
      icon: '🍀',
      soundtrack: 'Inspiring Piano Chords',
      thumbnail: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=700&auto=format&fit=crop&q=80',
      tags: ['free', 'good-luck', 'exams', 'cheering'],
      description: 'An interactive scratch-to-reveal four-leaf clover with uplifting words of encouragement for exams, interviews, and big days.',
      features: ['Interactive Scratch-Off Charm', 'Confidence Boosting Message', 'Lucky Sparkles', 'WhatsApp Deliver'],
      previewOccasion: 'Good Luck',
      previewRecipient: 'Rockstar',
      previewSender: 'Rooting For You',
      previewMessage: 'You have prepared hard, you have the talent, and you are ready. Take a deep breath and go crush it! 🍀⚡',
      accentColor: '#10b981'
    },
    {
      id: 'good-luck-champion',
      slug: 'good-luck-champion',
      name: 'Go Conquer The World',
      category: 'Good Luck',
      categorySlug: 'good-luck',
      categoryName: 'Good Luck',
      price: 99,
      isFree: false,
      badge: 'Confidence Booster',
      type: 'Interactive Cinema',
      icon: '⚡',
      soundtrack: 'Uplifting Cinematic Beats',
      thumbnail: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=700&auto=format&fit=crop&q=80',
      tags: ['premium', 'good-luck', 'dreams', 'interview'],
      description: 'High-energy countdown celebration with personalized power words for exams, jobs, and life competitions.',
      features: ['Power Countdown Reel', 'Hype Polaroid Slideshow', 'Gold Trophy Confetti', 'Secret Motivational PIN'],
      previewOccasion: 'Good Luck',
      previewRecipient: 'Meera',
      previewSender: 'Rahul',
      previewMessage: 'This moment is yours. Walk in with your chin up and show them what you are made of. I am so proud of you already! 🏆💪',
      accentColor: '#f59e0b'
    },
    // -------------------------------------------------------------
    // 14. New Beginning Collection
    // -------------------------------------------------------------
    {
      id: 'new-beginning-sunrise',
      slug: 'new-beginning-sunrise',
      name: 'Fresh Dawn & New Horizons',
      category: 'New Beginning',
      categorySlug: 'new-beginning',
      categoryName: 'New Beginning',
      price: 0,
      isFree: true,
      badge: 'Free Milestone',
      type: 'Card & Envelope',
      icon: '🌱',
      soundtrack: 'Morning Breeze & Flute',
      thumbnail: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?w=700&auto=format&fit=crop&q=80',
      tags: ['free', 'new-beginning', 'milestone', 'fresh'],
      description: 'A sunrise animation marking their bold new chapter, housewarming, or life milestone with hope and warmth.',
      features: ['Sunrise Unfolding Animation', 'Inspirational Blessing', '1 Memory Photo', 'Instant Share Link'],
      previewOccasion: 'New Beginning',
      previewRecipient: 'Simran',
      previewSender: 'Warmest Wishes',
      previewMessage: 'Every ending is the beautiful doorstep to a brand new adventure. May this fresh chapter be your happiest yet! 🌱🌅',
      accentColor: '#f97316'
    },
    {
      id: 'new-beginning-milestone-film',
      slug: 'new-beginning-milestone-film',
      name: 'The Next Great Adventure',
      category: 'New Beginning',
      categorySlug: 'new-beginning',
      categoryName: 'New Beginning',
      price: 149,
      isFree: false,
      badge: 'Milestone Cinema',
      type: 'Interactive Cinema',
      icon: '🏡',
      soundtrack: 'Joyful Cinematic Symphony',
      thumbnail: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?w=700&auto=format&fit=crop&q=80',
      tags: ['premium', 'new-beginning', 'housewarming', 'baby', 'job'],
      description: 'An inspiring audio-visual reel celebrating a new house, new baby, promotion, or brand-new journey in life.',
      features: ['Milestone Cinematic Journey', 'Up to 5 Photos', 'Celebration Fireworks', 'Personal Audio Soundtrack'],
      previewOccasion: 'New Beginning',
      previewRecipient: 'The Sharma Family',
      previewSender: 'Friends & Family',
      previewMessage: 'Congratulations on your gorgeous new home! May these four walls be filled with decades of laughter, blessings, and sweet memories. 🏡✨',
      accentColor: '#a855f7'
    },
    {
      id: 'golden-anniversary',
      slug: 'golden-anniversary',
      name: 'Golden Anniversary',
      category: 'Anniversary',
      categorySlug: 'anniversary',
      categoryName: 'Anniversary',
      price: 999,
      isFree: false,
      badge: 'Ultra Limited',
      type: 'Timeline Storybook',
      icon: '🕰️',
      soundtrack: 'Orchestral Waltz',
      thumbnail: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=700&auto=format&fit=crop&q=80',
      tags: ['ultra-premium', 'anniversary', 'luxury', 'timeline'],
      description: 'A golden-trimmed interactive timeline highlighting your decades together with parallax photo reveals and engraved brass page navigation.',
      features: ['Scrollable Golden Timeline', '10+ Photo Memories', 'Interactive Page-Turning', 'Animated Brass Filigree'],
      previewOccasion: '50th Anniversary',
      previewRecipient: 'Spouses',
      previewSender: 'Your Lifetime Partner',
      previewMessage: 'Reviewing our golden years together, every moment was worth the journey. Here\'s to forever after.',
      accentColor: '#d4af37'
    },
    {
      id: 'valentine-constellation',
      slug: 'valentine-constellation',
      name: 'Valentine Constellation',
      category: 'Love',
      categorySlug: 'love',
      categoryName: 'Love Letters',
      price: 799,
      isFree: false,
      badge: 'Ultra ROMANTIC',
      type: 'Interactive Sky Map',
      icon: '✨',
      soundtrack: 'Celestial Harp & Piano',
      thumbnail: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=700&auto=format&fit=crop&q=80',
      tags: ['ultra-premium', 'romantic', 'interactive', 'astronomy'],
      description: 'A personalized night sky recreation of your first date or special moment, with constellations forming meaningful shapes when touched.',
      features: ['Dynamic Constellation Map', '3D Star Selection', 'Personalized Celestial Coordinates', 'Animated Meteor Showers'],
      previewOccasion: 'Valentine\'s Day',
      previewRecipient: 'My Universe',
      previewSender: 'Your Stargazer',
      previewMessage: 'Our love mapped across the heavens—every star bears witness to what we share.',
      accentColor: '#4b79cf'
    },
    {
      id: 'royal-shaadi-invite',
      slug: 'royal-shaadi-invite',
      sku: 'VM-W01',
      name: 'Royal Shaadi Invite',
      aliases: ['royal-shaadi', 'shaadipath-royal-invite', 'wedding-envelope-seal'],
      category: 'Anniversary',
      categorySlug: 'anniversary',
      categoryName: 'Wedding & Engagement',
      price: 299,
      originalPrice: 2499,
      isFree: false,
      tier: 'Signature',
      badge: '👑 Ultra Luxury',
      isLuxury: true,
      type: 'Ultra-Luxury Engagement & Wedding Interactive Invite',
      icon: '👑',
      thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=700&auto=format&fit=crop&q=80',
      soundtrack: 'Royal Courtyard Sitar & Shehnai Symphony',
      tags: ['ultra-premium', 'wedding', 'royal', 'shaadi', 'envelope', 'wax-seal', 'scratch-date', 'storyboard', 'guest-links', 'itinerary', 'bestseller'],
      description: 'Shaadipath-inspired ultra-luxury wedding celebration: Dynamic personalized guest greeting, 3D royal wax seal envelope, golden sparkle bursts, interactive storyboard polaroids with 3D tilt, gold scratch-to-reveal wedding date with confetti cannon, evening itinerary timeline, action suite with calendar sync (.ics), and 1-click personalized guest link generator.',
      features: [
        'Personalized Guest Greeting (?guest=Name)',
        '3D Royal Wax Seal Opening & Slide-Up Letter',
        'Canvas Golden Sparkle & Confetti Cannon',
        'Storyboard Polaroids with 3D Gyro/Tilt',
        'Gold Scratch-to-Reveal Date Card',
        'Evening Itinerary & Time Schedule',
        'Action Suite (.ics Calendar, WhatsApp, Maps)',
        '1-Click Relative Guest Link Generator'
      ],
      customizableFields: ['Bride Name', 'Groom Name', 'Monogram (#Shaya)', 'Wedding Date', 'Venue Name', 'Evening Itinerary', 'Guest Links'],
      previewOccasion: 'Wedding',
      previewRecipient: 'Honored Guest',
      previewSender: 'Shreya & Aayush',
      previewMessage: 'Two souls, two families, united under the palace moonlight. We request your presence and blessings.',
      accentColor: '#d4af37',
      templatePath: 'templates/royal-shaadi-invite/index.html',
      previewPath: 'templates/royal-shaadi-invite/preview.html',
      builderPath: 'templates/royal-shaadi-invite/builder.html'
    },
    {
      id: 'wedding-floating-lotus',
      slug: 'wedding-floating-lotus',
      sku: 'VM-W02',
      name: 'Floating Lotus 3D Wedding Invitation',
      aliases: ['floating-lotus', 'lotus-wedding', 'shaadipath-lotus', 'std-04-lotus'],
      category: 'Anniversary',
      categorySlug: 'anniversary',
      categoryName: 'Wedding & Engagement',
      price: 499,
      originalPrice: 1499,
      isFree: false,
      tier: 'Signature',
      badge: '👑 Wedding Bestseller',
      isBestseller: true,
      isLuxury: true,
      type: 'Ultra-Luxury 3D Floating Lotus Wedding Invite',
      icon: '🪷',
      thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=700&auto=format&fit=crop&q=80',
      soundtrack: 'Sacred Raag Yaman Bansuri & Santoor Symphony',
      tags: ['ultra-premium', 'wedding', 'lotus', 'floating-lotus', '3d', 'scratch-date', 'countdown', 'itinerary', 'bestseller', 'royal'],
      description: 'Shaadipath-inspired ultra-luxury 3D Floating Lotus wedding invitation. Multi-layered rippling sacred water, ambient fluttering lotus petals, glowing diyas, live countdown timer, 3D polaroid storyboard, gold scratch-to-reveal wedding date with confetti cannon, multi-event horizontal itinerary carousel, and calendar sync.',
      features: [
        'Parallax 3D Sacred Water & Floating Lotus Canvas',
        'Ambient Fluttering Petals & Glowing Diya Particles',
        'Cinematic Wax Seal Medallion Unboxing',
        'Live Glassmorphic Countdown Timer (Days, Hours, Mins, Secs)',
        'Vintage Polaroid Storyboard with 3D Gyro Tilt',
        'Gold-Foil Canvas Scratch-to-Reveal Date & Muhurat',
        'Horizontal Multi-Event Itinerary Carousel (Mehendi to Reception)',
        'Interactive Action Suite (.ics Calendar, WhatsApp, Maps)',
        'Live Blessings Wall & RSVP Guestbook',
        'Equalizer Music Player with Web Audio Bansuri/Santoor Synth',
        'Bespoke Real-time Builder with Personalized Guest Link Generator'
      ],
      customizableFields: ['Bride Name', 'Groom Name', 'Monogram (#PriVik)', 'Wedding Date', 'Muhurat', 'Venue Name', 'Itinerary Events', 'Guest Links'],
      previewOccasion: 'Wedding',
      previewRecipient: 'Honored Guest',
      previewSender: 'Priya & Vikram',
      previewMessage: 'Two souls destined to walk together across lifetimes. With the sacred fragrance of fresh lotuses, we invite you to celebrate our union.',
      accentColor: '#f4aab8',
      templatePath: 'templates/wedding-floating-lotus/index.html',
      previewPath: 'templates/wedding-floating-lotus/preview.html',
      builderPath: 'templates/wedding-floating-lotus/builder.html'
    },
    {
      id: 'royal-vivah-palace',
      slug: 'royal-vivah-palace',
      sku: 'VM-W03',
      name: 'Royal Vivah — Palace & Heritage',
      aliases: ['royal-vivah', 'shaadipath-template01', 'vanvi-royal-vivah-01', 'royal-palace-heritage', 'template01'],
      category: 'Anniversary',
      categorySlug: 'anniversary',
      categoryName: 'Wedding & Engagement',
      price: 1499,
      originalPrice: 3999,
      isFree: false,
      tier: 'Signature',
      badge: '👑 Ultra Luxury',
      isBestseller: true,
      isLuxury: true,
      type: 'Ultra-Luxury Heritage Palace Wedding Invitation & Celebration Hub',
      icon: '👑',
      thumbnail: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=700&auto=format&fit=crop&q=80',
      soundtrack: 'Royal Mewar Palace Shehnai & Sitar Raga Symphony',
      tags: ['ultra-premium', 'wedding', 'palace', 'heritage', 'curtains', 'mandala', 'udaipur', 'lake-pichola', 'love-letter', 'gallery', 'rsvp', 'bestseller'],
      description: 'Shaadipath-inspired ultra-luxury royal wedding celebration: Sacred Mandala curtain opening reveal, 3D Lake Pichola palace parallax, interactive silk curtains with tassel pull, royal lineage and family tree, imperial love note with wax seal, multi-event imperial itinerary timeline, blessings guestbook wall with celebratory confetti shower, photo gallery lightbox, and personalized guest greeting generator.',
      features: [
        'Sacred Mandala & Silk Curtain Pull Reveal Animation',
        '3D Lake Pichola Heritage Palace Parallax Canvas',
        'Royal Lineage & Grandparents Ancestral Blessing Tree',
        'Imperial Parchment Love Note with 3D Wax Seal',
        'Multi-Event Palace Itinerary (Mehendi, Haldi, Sangeet, Vivah, Reception)',
        'Blessings Wall with Live RSVP Guestbook & Confetti Shower',
        'Photo Gallery Lightbox with Editorial Zoom',
        '1-Click Calendar Sync (.ics) & Google Maps Venue Navigation',
        'Digital Shagun UPI Integration with 1-Tap Copy',
        'Interactive Theme Atmosphere Switcher (Mewar, Pearl, Sunset)',
        'Bespoke Builder Studio with Real-time Multi-Device Preview'
      ],
      customizableFields: ['Bride Name', 'Groom Name', 'Monogram (V&A)', 'Wedding Date', 'Venue & City', 'Hashtag', 'Family Lineage', 'Love Note', 'Events Itinerary', 'Gallery Photos', 'Theme Palette'],
      previewOccasion: 'Wedding',
      previewRecipient: 'Honored Guest',
      previewSender: 'Vannu & Ananya',
      previewMessage: 'Two souls, sacred vows under the Udaipur starlight, an eternity together. With the divine blessings of our ancestors, we request the honor of your presence.',
      accentColor: '#c8860a',
      templatePath: 'templates/royal-vivah-palace/index.html',
      previewPath: 'templates/royal-vivah-palace/preview.html',
      builderPath: 'templates/royal-vivah-palace/builder.html'
    },
  ];

  // Category Metadata dictionary
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
    'birthday': {
      id: 'birthday',
      name: 'Birthday',
      icon: '🎂',
      badge: 'Celebrations',
      title: 'Make Their Birthday Truly Unforgettable',
      subtitle: 'Balloons, birthday candle blowouts, cinematic video stories, and heartfelt letters for their special day.',
      bannerGrad: 'linear-gradient(135deg, rgba(255, 0, 122, 0.25), rgba(245, 158, 11, 0.25))'
    },
    'love': {
      id: 'love',
      name: 'Love',
      icon: '❤️',
      badge: 'Romance',
      title: 'Poetry, Passion & Forever Promises',
      subtitle: 'For the one who holds your heart. Secret PIN-locked envelopes, wax seals, and constellation memories.',
      bannerGrad: 'linear-gradient(135deg, rgba(244, 63, 94, 0.3), rgba(192, 132, 252, 0.25))'
    },
    'anniversary': {
      id: 'anniversary',
      name: 'Anniversary',
      icon: '💍',
      badge: 'Milestones',
      title: 'Milestones Worth Celebrating Forever',
      subtitle: 'From your first anniversary to golden jubilees. Timelines, promise renewals, and royal celebration invites.',
      bannerGrad: 'linear-gradient(135deg, rgba(245, 158, 11, 0.3), rgba(254, 240, 138, 0.2))'
    },
    'friendship': {
      id: 'friendship',
      name: 'Friendship',
      icon: '👥',
      badge: 'Memories',
      title: 'Because Best Friends Deserve More Than A Plain Text',
      subtitle: 'Funny photo memories, sliding mini puzzle games, polaroid collages, and chaotic inside jokes.',
      bannerGrad: 'linear-gradient(135deg, rgba(6, 182, 212, 0.25), rgba(168, 85, 247, 0.25))'
    },
    'memories': {
      id: 'memories',
      name: 'Memories',
      icon: '📸',
      badge: 'Timeless',
      title: 'Hold Onto The Moments That Made You',
      subtitle: 'Photo scrapbooks, journey maps, travel timelines, and timeless polaroids preserved forever.',
      bannerGrad: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(56, 189, 248, 0.25))'
    },
    'apology': {
      id: 'apology',
      name: 'Apology & Reconciliation',
      icon: '💌',
      badge: 'Dil Se',
      title: 'When Words Need To Heal',
      subtitle: 'A gentle, sincere peace offering with soft rain aesthetics and heartfelt letters to bridge the distance.',
      bannerGrad: 'linear-gradient(135deg, rgba(100, 116, 139, 0.3), rgba(244, 63, 94, 0.2))'
    },
    'family': {
      id: 'family',
      name: 'Family & Parents',
      icon: '🏡',
      badge: 'Special Tribute',
      title: 'Tributes for Maa, Papa & Family',
      subtitle: 'Show parents and siblings how deeply their love is felt with golden sunset cards and gratitude letters.',
      bannerGrad: 'linear-gradient(135deg, rgba(249, 115, 22, 0.25), rgba(245, 158, 11, 0.25))'
    },
    'celebration': {
      id: 'celebration',
      name: 'Celebrations & Festivals',
      icon: '✦',
      badge: 'Festive & Big Wins',
      title: 'Sparklers, Fireworks & Big Wins',
      subtitle: 'Graduation caps, Diwali diyas, job promotions, and new beginnings celebrated with dazzling joy.',
      bannerGrad: 'linear-gradient(135deg, rgba(234, 179, 8, 0.3), rgba(20, 184, 166, 0.25))'
    },
    'miss-you': {
      id: 'miss-you',
      name: 'Miss You & Distance',
      icon: '💭',
      badge: 'Across Miles',
      title: 'Across Distance, Closer Than Ever',
      subtitle: 'Constellation skies, letterbox countdowns, and midnight thoughts to remind them you are always there.',
      bannerGrad: 'linear-gradient(135deg, rgba(236, 72, 153, 0.25), rgba(56, 189, 248, 0.25))'
    },
    'just-because': {
      id: 'just-because',
      name: 'Just Because',
      icon: '✨',
      badge: 'Little Sparks',
      title: 'No Occasion Needed, Just Pure Love',
      subtitle: 'Spontaneous little moments, warm morning notes, and heartfelt reminders that they make your world brighter.',
      bannerGrad: 'linear-gradient(135deg, rgba(244, 63, 94, 0.25), rgba(251, 191, 36, 0.25))'
    },
    'thank-you': {
      id: 'thank-you',
      name: 'Thank You',
      icon: '🙏',
      badge: 'Gratitude',
      title: 'Heartfelt Gratitude & Warm Appreciation',
      subtitle: 'Say thank you in a way they will never forget. Golden sunset cards, floral appreciation, and personal tributes.',
      bannerGrad: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(16, 185, 129, 0.25))'
    },
    'farewell': {
      id: 'farewell',
      name: 'Farewell & Goodbyes',
      icon: '👋',
      badge: 'Until We Meet',
      title: 'Warm Goodbyes & Golden Memories',
      subtitle: 'For friends, roommates, and colleagues starting a new journey. Moving tributes, photo reels, and safe travel wishes.',
      bannerGrad: 'linear-gradient(135deg, rgba(56, 189, 248, 0.25), rgba(168, 85, 247, 0.25))'
    },
    'good-luck': {
      id: 'good-luck',
      name: 'Good Luck & Wishes',
      icon: '🍀',
      badge: 'Rooting For You',
      title: 'Cheering You On To Greatness',
      subtitle: 'Exams, interviews, dream launches, and big milestones. Give them an extra spark of confidence and lucky charms.',
      bannerGrad: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(245, 158, 11, 0.25))'
    },
    'new-beginning': {
      id: 'new-beginning',
      name: 'New Beginnings',
      icon: '🌱',
      badge: 'Fresh Chapters',
      title: 'To Fresh Starts & Unwritten Stories',
      subtitle: 'New city, new home, new job, or a fresh life chapter. Celebrate every bold new step with inspiring keepsake cards.',
      bannerGrad: 'linear-gradient(135deg, rgba(249, 115, 22, 0.25), rgba(168, 85, 247, 0.25))'
    }
  };

  // Theme & Experience archetypes catalog
  const THEME_PRESETS = {
    birthday: {
      accent: '#ff2a7a',
      gradient: 'linear-gradient(135deg, #ff2a7a 0%, #ff659c 50%, #ff8cb4 100%)',
      glow: 'rgba(255, 42, 122, 0.28)',
      light: '#fff0f6',
      badge: '🎂 Birthday Celebration',
      ambientType: 'confetti',
      experienceType: 'candle-cake',
      customizerProfile: 'birthday'
    },
    love: {
      accent: '#e11d48',
      gradient: 'linear-gradient(135deg, #e11d48 0%, #be123c 60%, #9f1239 100%)',
      glow: 'rgba(225, 29, 72, 0.30)',
      light: '#fff1f2',
      badge: '💌 Romantic Keepsake',
      ambientType: 'hearts',
      experienceType: 'wax-envelope',
      customizerProfile: 'love'
    },
    anniversary: {
      accent: '#d97706',
      gradient: 'linear-gradient(135deg, #d97706 0%, #b45309 60%, #92400e 100%)',
      glow: 'rgba(217, 119, 6, 0.28)',
      light: '#fffbeb',
      badge: '💍 Royal Vows & Milestone',
      ambientType: 'gold-dust',
      experienceType: 'wedding-vows',
      customizerProfile: 'wedding'
    },
    friendship: {
      accent: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
      glow: 'rgba(139, 92, 246, 0.28)',
      light: '#f5f3ff',
      badge: '🤪 Besties & Roast Wall',
      ambientType: 'stars',
      experienceType: 'polaroid-wall',
      customizerProfile: 'friendship'
    },
    memories: {
      accent: '#0ea5e9',
      gradient: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
      glow: 'rgba(14, 165, 233, 0.28)',
      light: '#f0f9ff',
      badge: '📸 Memory Scrapbook',
      ambientType: 'stars',
      experienceType: 'polaroid-wall',
      customizerProfile: 'friendship'
    },
    apology: {
      accent: '#64748b',
      gradient: 'linear-gradient(135deg, #64748b 0%, #8b5cf6 100%)',
      glow: 'rgba(100, 116, 139, 0.28)',
      light: '#f8fafc',
      badge: '🥺 Sincere Apology',
      ambientType: 'rain',
      experienceType: 'apology-note',
      customizerProfile: 'apology'
    },
    family: {
      accent: '#f97316',
      gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
      glow: 'rgba(249, 115, 22, 0.28)',
      light: '#fff7ed',
      badge: '🏡 Family & Gratitude',
      ambientType: 'gold-dust',
      experienceType: 'wax-envelope',
      customizerProfile: 'love'
    },
    celebration: {
      accent: '#eab308',
      gradient: 'linear-gradient(135deg, #eab308 0%, #f97316 100%)',
      glow: 'rgba(234, 179, 8, 0.28)',
      light: '#fefce8',
      badge: '🪔 Festive Celebration',
      ambientType: 'sparklers',
      experienceType: 'festive-spark',
      customizerProfile: 'festival'
    },
    'miss-you': {
      accent: '#c084fc',
      gradient: 'linear-gradient(135deg, #c084fc 0%, #38bdf8 100%)',
      glow: 'rgba(192, 132, 252, 0.28)',
      light: '#faf5ff',
      badge: '🌙 Distance & Longing',
      ambientType: 'stars',
      experienceType: 'wax-envelope',
      customizerProfile: 'love'
    },
    'just-because': {
      accent: '#ec4899',
      gradient: 'linear-gradient(135deg, #ec4899 0%, #f59e0b 100%)',
      glow: 'rgba(236, 72, 153, 0.28)',
      light: '#fdf2f8',
      badge: '✨ Spontaneous Surprise',
      ambientType: 'hearts',
      experienceType: 'wax-envelope',
      customizerProfile: 'love'
    }
  };

  // Normalize template records with rich experience metadata
  VANVI_TEMPLATES.forEach(t => {
    const slug = (t.categorySlug || 'birthday').toLowerCase();
    const preset = THEME_PRESETS[slug] || THEME_PRESETS.birthday;

    // Attach themeConfig
    t.themeConfig = {
      accent: t.accentColor || preset.accent,
      gradient: preset.gradient,
      glow: preset.glow,
      light: preset.light,
      badge: preset.badge,
      ambientType: preset.ambientType
    };

    // Specific overrides for experience types
    if (!t.experienceType) {
      if (t.id === 'diwali-sparkler') {
        t.experienceType = 'festive-spark';
      } else if (t.id === 'maaf-kar-do') {
        t.experienceType = 'apology-note';
      } else if (t.id === 'best-friend-chaos' || t.id === 'retro-birthday-polaroid' || t.id === 'memory-puzzle') {
        t.experienceType = 'polaroid-wall';
      } else if (t.id === 'royal-wedding-story' || t.id === 'golden-anniversary-walk' || t.id === 'everlasting-vows' || t.id === 'golden-dynasty-celebration') {
        t.experienceType = 'wedding-vows';
      } else if (slug === 'birthday') {
        t.experienceType = 'candle-cake';
      } else {
        t.experienceType = preset.experienceType || 'wax-envelope';
      }
    }

    // Attach customizer profile
    if (!t.customizerProfile) {
      if (slug === 'birthday') {
        t.customizerProfile = 'birthday';
      } else if (slug === 'love' || slug === 'miss-you' || slug === 'just-because' || slug === 'family') {
        t.customizerProfile = 'love';
      } else if (slug === 'anniversary') {
        t.customizerProfile = 'wedding';
      } else if (slug === 'friendship' || slug === 'memories') {
        t.customizerProfile = 'friendship';
      } else if (slug === 'apology') {
        t.customizerProfile = 'apology';
      } else if (slug === 'celebration') {
        t.customizerProfile = 'festival';
      } else {
        t.customizerProfile = preset.customizerProfile || 'birthday';
      }
    }

    if (!t.customizableFields || !t.customizableFields.length) {
      if (t.customizerProfile === 'birthday') {
        t.customizableFields = ['Recipient Name', 'Turning Age', 'Birthday Date', 'Birthday Wishes', 'Sender Name', 'Cake Theme', 'Soundtrack', 'Surprise Reveal'];
      } else if (t.customizerProfile === 'love') {
        t.customizableFields = ['Partner Name', 'Your Name', 'Relationship Date', 'Secret Love Letter', 'Couple Photos', 'Romantic Soundtrack', 'Wax Seal PIN'];
      } else if (t.customizerProfile === 'wedding') {
        t.customizableFields = ['Couple Names', 'Milestone Year', 'Wedding Date & Venue', 'Vows Renewal Note', 'Wedding Soundtrack', 'RSVP & Blessings'];
      } else if (t.customizerProfile === 'friendship') {
        t.customizableFields = ['Bestie Name', 'Squad Nickname', 'Inside Joke & Roast', 'Polaroid Memories', 'Soundtrack'];
      } else if (t.customizerProfile === 'apology') {
        t.customizableFields = ['Recipient Name', 'Sincere Apology Note', 'Why You Mean Everything', 'Acoustic Melody', 'Forgive Me Heart'];
      } else if (t.customizerProfile === 'festival') {
        t.customizableFields = ['Recipient / Family Name', 'Festive Greeting', 'Blessings Note', 'Soundtrack', 'Diya Sparks'];
      } else {
        t.customizableFields = ['Recipient Name', 'Sender Name', 'Heartfelt Message', 'Photo Memory', 'Soundtrack'];
      }
    }

    if (!t.tier) {
      const p = Number(t.price || 0);
      t.tier = p === 0 ? 'Free' : (p > 700 ? 'Ultra Premium' : (p >= 199 ? 'VIP Signature' : 'Premium'));
    }

    // 1. Calculate discount & original price
    const p = Number(t.price || 0);
    const orig = Number(t.originalPrice || (p > 0 ? Math.round(p * 2.8 / 10) * 10 - 1 : 0));
    t.originalPrice = orig;
    if (p === 0) {
      t.discount = '100% Free';
    } else if (orig > p) {
      const pct = Math.round(((orig - p) / orig) * 100);
      t.discount = `${pct}% off`;
    } else {
      t.discount = 'Special Offer';
    }

    // 2. Set luxury / VIP status for expensive templates
    t.isLuxury = p >= 199 || t.tier === 'Signature' || t.tier === 'VIP Signature' || t.tier === 'Ultra Premium';
    if (t.isLuxury && (!t.badge || t.badge.includes('Premium'))) {
      t.badge = '✦ Luxury VIP';
    }

    // 3. Generate clean, short, emotional tagline (Authentic VanviMoments tone)
    if (!t.tagline) {
      const cat = (t.category || 'Celebration').toLowerCase();
      const desc = (t.description || '').toLowerCase();
      if (desc.includes('candle') || desc.includes('blow')) {
        t.tagline = 'Interactive 3D candle flame, golden confetti bursts, and personal letter.';
      } else if (desc.includes('wax') || desc.includes('envelope')) {
        t.tagline = 'A wax-sealed envelope opening with soft music and pickable wishes.';
      } else if (desc.includes('polaroid') || desc.includes('corkboard')) {
        t.tagline = 'Nostalgic polaroid memory reel with handwritten notes and soft melodies.';
      } else if (desc.includes('cinema') || desc.includes('netflix') || desc.includes('film')) {
        t.tagline = 'Widescreen cinematic story reel with spotlight moments and orchestral strings.';
      } else if (desc.includes('apology') || cat.includes('apology')) {
        t.tagline = 'A playful runaway button, cute peace vouchers, and sincere amends.';
      } else if (cat.includes('birthday')) {
        t.tagline = 'Interactive celebration scene with photos, background music, and heartfelt wishes.';
      } else if (cat.includes('love') || cat.includes('romance')) {
        t.tagline = 'An intimate digital keepsake with floating petals and your secret love letter.';
      } else if (cat.includes('anniversary')) {
        t.tagline = 'A golden timeline celebrating your love story, cherished photos, and melody.';
      } else if (cat.includes('friend')) {
        t.tagline = 'Laughter, inside jokes, and shared snapshots of your journey together.';
      } else if (cat.includes('family')) {
        t.tagline = 'A warm homecoming celebrating roots, family bonds, and timeless memories.';
      } else {
        t.tagline = 'Tap-to-interact celebration keepsake with personal letters and soundtrack.';
      }
    }

    // 4. Star rating & review counts
    if (!t.rating) {
      const seed = (t.id || 'vm').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
      t.rating = (4.6 + (seed % 4) * 0.1).toFixed(1);
    }
    if (!t.reviewsCount) {
      const seed = (t.id || 'vm').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
      t.reviewsCount = 420 + (seed % 950);
    }
  });

  // Helper for safe HTML escaping
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Merge custom templates from localStorage (saved via AI Studio or Admin)
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const stored = localStorage.getItem('vanvi_custom_templates');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          parsed.forEach(customT => {
            if (!customT || !customT.id) return;
            const exists = VANVI_TEMPLATES.findIndex(t => t.id === customT.id || t.slug === customT.slug);
            if (exists >= 0) {
              VANVI_TEMPLATES[exists] = customT;
            } else {
              VANVI_TEMPLATES.unshift(customT);
            }
          });
        }
      }
    } catch(e) {}
  }

  // Expose globally and for CommonJS / Node
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

    // Unified Luxury Card Renderer (2-Column Mobile & Multi-Column Desktop)
    renderCard(t) {
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
