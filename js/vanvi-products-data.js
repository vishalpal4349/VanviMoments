/**
 * VANVI MOMENTS — CURATED GIFT PRODUCTS CATALOG
 * Centralized product registry for the Gift Store showcase.
 * External affiliate links only — VanviMoments does NOT sell/ship these products.
 *
 * HOW TO EDIT:
 * - Add/remove/reorder products in the VANVI_PRODUCTS array below.
 * - Each product needs: id, name, description, image, category, store, storeUrl
 * - Optional: price, badge, featured, order
 * - badge options: 'Featured', 'Popular', 'New', 'Best Seller', 'Top Pick', null
 * - store options: 'Amazon', 'Flipkart', 'Meesho', 'Myntra', 'Brand Store'
 */

(function(root) {
  'use strict';

  const VANVI_PRODUCTS = [

    // ─── Birthday Gifts ───────────────────────────────────────────
    {
      id: 'bp-001',
      name: 'Personalized Wooden Photo Frame',
      description: 'Laser-engraved name & date on premium mango wood. Perfect keepsake for birthdays.',
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
      category: 'Birthday Gifts',
      price: '₹499',
      badge: 'Popular',
      store: 'Amazon',
      storeUrl: 'https://www.amazon.in/s?k=personalized+birthday+photo+frame',
      featured: true,
      order: 1
    },
    {
      id: 'bp-002',
      name: 'LED Birthday Marquee Light',
      description: 'Warm-glow LED letter lights spelling HAPPY BIRTHDAY. Battery powered, reusable.',
      image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80',
      category: 'Birthday Gifts',
      price: '₹349',
      badge: null,
      store: 'Amazon',
      storeUrl: 'https://www.amazon.in/s?k=happy+birthday+led+light',
      featured: false,
      order: 2
    },
    {
      id: 'bp-003',
      name: 'Birthday Explosion Gift Box',
      description: 'Handmade multi-layer surprise box with photos, messages & confetti reveal.',
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
      category: 'Birthday Gifts',
      price: '₹599',
      badge: 'Best Seller',
      store: 'Flipkart',
      storeUrl: 'https://www.flipkart.com/search?q=birthday+explosion+box',
      featured: true,
      order: 3
    },

    // ─── Couple Gifts ─────────────────────────────────────────────
    {
      id: 'cg-001',
      name: 'King & Queen Couple Bracelets',
      description: 'Matching magnetic titanium bracelets with crown charms. Adjustable fit.',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
      category: 'Couple Gifts',
      price: '₹399',
      badge: 'Popular',
      store: 'Amazon',
      storeUrl: 'https://www.amazon.in/s?k=couple+bracelets+king+queen',
      featured: true,
      order: 1
    },
    {
      id: 'cg-002',
      name: 'Couple Photo Collage Heart Frame',
      description: 'Heart-shaped wooden frame holding 12 photos. Romantic wall décor.',
      image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80',
      category: 'Couple Gifts',
      price: '₹649',
      badge: null,
      store: 'Flipkart',
      storeUrl: 'https://www.flipkart.com/search?q=couple+heart+photo+frame',
      featured: false,
      order: 2
    },
    {
      id: 'cg-003',
      name: 'Love Scrapbook DIY Kit',
      description: 'Complete scrapbook kit with stickers, washi tape & photo corners. 40-page journal.',
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
      category: 'Couple Gifts',
      price: '₹449',
      badge: 'New',
      store: 'Meesho',
      storeUrl: 'https://www.meesho.com/search?q=love+scrapbook+kit',
      featured: false,
      order: 3
    },

    // ─── Personalized Gifts ───────────────────────────────────────
    {
      id: 'pg-001',
      name: 'Custom Name Neon LED Sign',
      description: 'Acrylic base LED sign with any name. Warm white / pink glow options.',
      image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
      category: 'Personalized Gifts',
      price: '₹799',
      badge: 'Featured',
      store: 'Amazon',
      storeUrl: 'https://www.amazon.in/s?k=custom+name+neon+led+sign',
      featured: true,
      order: 1
    },
    {
      id: 'pg-002',
      name: 'Photo Printed Magic Mug',
      description: 'Color-changing mug reveals your photo when hot liquid is poured. Ceramic, 350ml.',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
      category: 'Personalized Gifts',
      price: '₹299',
      badge: 'Popular',
      store: 'Flipkart',
      storeUrl: 'https://www.flipkart.com/search?q=photo+magic+mug',
      featured: true,
      order: 2
    },
    {
      id: 'pg-003',
      name: 'Engraved Wooden Music Box',
      description: 'Wind-up music box with custom engraved message on lid. Plays your chosen melody.',
      image: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=800&q=80',
      category: 'Personalized Gifts',
      price: '₹899',
      badge: null,
      store: 'Amazon',
      storeUrl: 'https://www.amazon.in/s?k=engraved+wooden+music+box',
      featured: false,
      order: 3
    },

    // ─── Flowers ──────────────────────────────────────────────────
    {
      id: 'fl-001',
      name: 'Preserved Rose in Glass Dome',
      description: 'Real rose preserved forever under elegant glass dome with LED fairy lights.',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      category: 'Flowers',
      price: '₹699',
      badge: 'Featured',
      store: 'Amazon',
      storeUrl: 'https://www.amazon.in/s?k=preserved+rose+glass+dome',
      featured: true,
      order: 1
    },
    {
      id: 'fl-002',
      name: 'Soap Rose Bouquet Gift Box',
      description: '18-piece fragrant soap roses in luxury gift box. Lasts months without wilting.',
      image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80',
      category: 'Flowers',
      price: '₹399',
      badge: 'Popular',
      store: 'Meesho',
      storeUrl: 'https://www.meesho.com/search?q=soap+rose+bouquet+gift+box',
      featured: false,
      order: 2
    },

    // ─── Photo Gifts ──────────────────────────────────────────────
    {
      id: 'ph-001',
      name: 'Acrylic LED Photo Lamp',
      description: '3D crystal-clear acrylic photo with wooden LED base. Glows beautifully at night.',
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
      category: 'Photo Gifts',
      price: '₹549',
      badge: 'Best Seller',
      store: 'Amazon',
      storeUrl: 'https://www.amazon.in/s?k=acrylic+led+photo+lamp',
      featured: true,
      order: 1
    },
    {
      id: 'ph-002',
      name: 'Photo String Lights Clips',
      description: '20 LED clip lights to hang your favorite photos. Fairy light warm glow, USB powered.',
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
      category: 'Photo Gifts',
      price: '₹249',
      badge: null,
      store: 'Flipkart',
      storeUrl: 'https://www.flipkart.com/search?q=photo+string+lights+clips',
      featured: false,
      order: 2
    },
    {
      id: 'ph-003',
      name: 'Rotating Photo Cube',
      description: 'Magnetic spin cube displaying 6 photos. Desktop décor that delights.',
      image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=800&q=80',
      category: 'Photo Gifts',
      price: '₹349',
      badge: 'New',
      store: 'Amazon',
      storeUrl: 'https://www.amazon.in/s?k=rotating+photo+cube',
      featured: false,
      order: 3
    },

    // ─── Jewellery ────────────────────────────────────────────────
    {
      id: 'jw-001',
      name: 'Heart Locket Pendant Necklace',
      description: 'Sterling silver heart locket that opens to hold a tiny photo. Timeless elegance.',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
      category: 'Jewellery',
      price: '₹899',
      badge: 'Featured',
      store: 'Amazon',
      storeUrl: 'https://www.amazon.in/s?k=heart+locket+pendant+necklace',
      featured: true,
      order: 1
    },
    {
      id: 'jw-002',
      name: 'Infinity Charm Bracelet',
      description: 'Rose-gold infinity symbol bracelet with adjustable chain. Gift-boxed.',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
      category: 'Jewellery',
      price: '₹449',
      badge: 'Popular',
      store: 'Meesho',
      storeUrl: 'https://www.meesho.com/search?q=infinity+charm+bracelet',
      featured: false,
      order: 2
    },

    // ─── Cute Gifts ───────────────────────────────────────────────
    {
      id: 'cu-001',
      name: 'Squishy Kawaii Plush Bear',
      description: 'Ultra-soft 30cm teddy with embroidered heart. Comes in pastel pink, lavender, mint.',
      image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=800&q=80',
      category: 'Cute Gifts',
      price: '₹399',
      badge: 'Popular',
      store: 'Amazon',
      storeUrl: 'https://www.amazon.in/s?k=kawaii+plush+teddy+bear',
      featured: true,
      order: 1
    },
    {
      id: 'cu-002',
      name: 'Miniature Love Coupons Book',
      description: '30 tear-out love coupons — breakfast in bed, movie night, one free hug & more.',
      image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80',
      category: 'Cute Gifts',
      price: '₹199',
      badge: null,
      store: 'Flipkart',
      storeUrl: 'https://www.flipkart.com/search?q=love+coupons+book',
      featured: false,
      order: 2
    },
    {
      id: 'cu-003',
      name: 'Cat Paw Desk Lamp',
      description: 'Silicone cat paw night light with 3 brightness levels. USB rechargeable, touch control.',
      image: 'https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?auto=format&fit=crop&w=800&q=80',
      category: 'Cute Gifts',
      price: '₹349',
      badge: 'New',
      store: 'Meesho',
      storeUrl: 'https://www.meesho.com/search?q=cat+paw+lamp',
      featured: false,
      order: 3
    },

    // ─── Room Decor ───────────────────────────────────────────────
    {
      id: 'rd-001',
      name: 'Galaxy Projector Night Light',
      description: 'Starry sky projector with 15 color modes & bluetooth speaker. Transforms any room.',
      image: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
      category: 'Room Decor',
      price: '₹999',
      badge: 'Featured',
      store: 'Amazon',
      storeUrl: 'https://www.amazon.in/s?k=galaxy+projector+night+light',
      featured: true,
      order: 1
    },
    {
      id: 'rd-002',
      name: 'Macramé Wall Hanging',
      description: 'Hand-knotted cotton macramé. Boho-chic décor, 90cm length. Natural ivory color.',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
      category: 'Room Decor',
      price: '₹549',
      badge: null,
      store: 'Flipkart',
      storeUrl: 'https://www.flipkart.com/search?q=macrame+wall+hanging',
      featured: false,
      order: 2
    },

    // ─── Toys ─────────────────────────────────────────────────────
    {
      id: 'ty-001',
      name: 'Building Blocks Bouquet Set',
      description: 'Build-your-own flower bouquet from colorful blocks. 500+ pieces, display vase included.',
      image: 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&w=800&q=80',
      category: 'Toys',
      price: '₹799',
      badge: 'Popular',
      store: 'Amazon',
      storeUrl: 'https://www.amazon.in/s?k=building+blocks+flower+bouquet',
      featured: true,
      order: 1
    },
    {
      id: 'ty-002',
      name: 'DIY Miniature Dollhouse Kit',
      description: 'Tiny furniture, LED lights & dust cover. Relaxing craft project, beautiful result.',
      image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80',
      category: 'Toys',
      price: '₹1,299',
      badge: 'New',
      store: 'Flipkart',
      storeUrl: 'https://www.flipkart.com/search?q=miniature+dollhouse+kit',
      featured: false,
      order: 2
    },

    // ─── Baby Gifts ───────────────────────────────────────────────
    {
      id: 'bb-001',
      name: 'Baby Milestone Blanket',
      description: 'Monthly milestone photo blanket with floral wreath markers. Soft organic cotton.',
      image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80',
      category: 'Baby Gifts',
      price: '₹599',
      badge: 'Popular',
      store: 'Amazon',
      storeUrl: 'https://www.amazon.in/s?k=baby+milestone+blanket',
      featured: true,
      order: 1
    },
    {
      id: 'bb-002',
      name: 'Handprint & Footprint Clay Kit',
      description: 'Non-toxic clay frame kit to capture tiny hands & feet forever. Includes wooden frame.',
      image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=800&q=80',
      category: 'Baby Gifts',
      price: '₹449',
      badge: null,
      store: 'Flipkart',
      storeUrl: 'https://www.flipkart.com/search?q=baby+handprint+footprint+kit',
      featured: false,
      order: 2
    },

    // ─── Wedding Gifts ────────────────────────────────────────────
    {
      id: 'wg-001',
      name: 'Crystal Couple Figurine',
      description: 'Hand-blown crystal bride & groom figurine. Elegant wedding table or shelf décor.',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      category: 'Wedding Gifts',
      price: '₹1,499',
      badge: 'Featured',
      store: 'Amazon',
      storeUrl: 'https://www.amazon.in/s?k=crystal+couple+figurine+wedding',
      featured: true,
      order: 1
    },
    {
      id: 'wg-002',
      name: 'Personalized Wedding Photo Album',
      description: 'Premium leather-bound album with laser-cut cover. Holds 200 photos. Gift-boxed.',
      image: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=800&q=80',
      category: 'Wedding Gifts',
      price: '₹1,199',
      badge: null,
      store: 'Flipkart',
      storeUrl: 'https://www.flipkart.com/search?q=personalized+wedding+photo+album',
      featured: false,
      order: 2
    },

    // ─── Anniversary Gifts ────────────────────────────────────────
    {
      id: 'ag-001',
      name: '3D Crystal Photo Cube',
      description: 'Your photo laser-engraved inside a crystal cube. LED base illuminates the image.',
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
      category: 'Anniversary Gifts',
      price: '₹1,299',
      badge: 'Best Seller',
      store: 'Amazon',
      storeUrl: 'https://www.amazon.in/s?k=3d+crystal+photo+cube',
      featured: true,
      order: 1
    },
    {
      id: 'ag-002',
      name: 'Couple Caricature Portrait',
      description: 'Digital artist creates a fun caricature from your photo. Printed on canvas.',
      image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
      category: 'Anniversary Gifts',
      price: '₹799',
      badge: 'New',
      store: 'Meesho',
      storeUrl: 'https://www.meesho.com/search?q=couple+caricature+portrait',
      featured: false,
      order: 2
    },

    // ─── Budget Gifts (Under ₹300) ───────────────────────────────
    {
      id: 'bg-001',
      name: 'Message In A Bottle Kit',
      description: '50 tiny scrolls inside a glass bottle. Write secret wishes, love notes, memories.',
      image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80',
      category: 'Budget Gifts',
      price: '₹149',
      badge: 'Top Pick',
      store: 'Amazon',
      storeUrl: 'https://www.amazon.in/s?k=message+in+a+bottle+gift',
      featured: true,
      order: 1
    },
    {
      id: 'bg-002',
      name: 'Gratitude Journal Pocket Edition',
      description: 'A5 guided journal with prompts for 90 days of mindful reflection. Pastel cover.',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      category: 'Budget Gifts',
      price: '₹199',
      badge: null,
      store: 'Flipkart',
      storeUrl: 'https://www.flipkart.com/search?q=gratitude+journal',
      featured: false,
      order: 2
    },
    {
      id: 'bg-003',
      name: 'Handmade Friendship Band Set',
      description: 'Set of 5 woven friendship bands in rainbow colors. Adjustable, waterproof.',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
      category: 'Budget Gifts',
      price: '₹99',
      badge: null,
      store: 'Meesho',
      storeUrl: 'https://www.meesho.com/search?q=friendship+band+set',
      featured: false,
      order: 3
    },

    // ─── Premium Gifts (₹1000+) ──────────────────────────────────
    {
      id: 'pr-001',
      name: 'Smart Digital Photo Frame 10"',
      description: 'WiFi-enabled touchscreen frame. Upload photos via app from anywhere. Auto slideshow.',
      image: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80',
      category: 'Premium Gifts',
      price: '₹4,999',
      badge: 'Featured',
      store: 'Amazon',
      storeUrl: 'https://www.amazon.in/s?k=smart+digital+photo+frame+wifi',
      featured: true,
      order: 1
    },
    {
      id: 'pr-002',
      name: 'Luxury Perfume Gift Set',
      description: 'Collection of 4 mini designer fragrances in a velvet-lined box. Unisex.',
      image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
      category: 'Premium Gifts',
      price: '₹2,499',
      badge: 'Popular',
      store: 'Flipkart',
      storeUrl: 'https://www.flipkart.com/search?q=luxury+perfume+gift+set',
      featured: true,
      order: 2
    },
    {
      id: 'pr-003',
      name: 'Bluetooth Vinyl Record Player',
      description: 'Retro turntable with built-in speakers & bluetooth. Plays 33/45/78 RPM vinyls.',
      image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80',
      category: 'Premium Gifts',
      price: '₹3,999',
      badge: null,
      store: 'Amazon',
      storeUrl: 'https://www.amazon.in/s?k=bluetooth+vinyl+record+player',
      featured: false,
      order: 3
    }
  ];

  // ─── CATEGORY DEFINITIONS ──────────────────────────────────────
  const VANVI_PRODUCT_CATEGORIES = [
    { id: 'all', name: 'All Gifts', icon: '🎁', color: '#ff2a7a' },
    { id: 'Birthday Gifts', name: 'Birthday Gifts', icon: '🎂', color: '#ff2a7a' },
    { id: 'Couple Gifts', name: 'Couple Gifts', icon: '💑', color: '#ec4899' },
    { id: 'Personalized Gifts', name: 'Personalized Gifts', icon: '✨', color: '#9a61ff' },
    { id: 'Flowers', name: 'Flowers', icon: '🌹', color: '#f43f5e' },
    { id: 'Photo Gifts', name: 'Photo Gifts', icon: '📸', color: '#0284c7' },
    { id: 'Jewellery', name: 'Jewellery', icon: '💎', color: '#d97706' },
    { id: 'Cute Gifts', name: 'Cute Gifts', icon: '🧸', color: '#f472b6' },
    { id: 'Room Decor', name: 'Room Decor', icon: '🏠', color: '#10b981' },
    { id: 'Toys', name: 'Toys', icon: '🧩', color: '#8b5cf6' },
    { id: 'Baby Gifts', name: 'Baby Gifts', icon: '👶', color: '#06b6d4' },
    { id: 'Wedding Gifts', name: 'Wedding Gifts', icon: '💒', color: '#d97706' },
    { id: 'Anniversary Gifts', name: 'Anniversary Gifts', icon: '💕', color: '#be185d' },
    { id: 'Budget Gifts', name: 'Budget Gifts', icon: '🏷️', color: '#10b981' },
    { id: 'Premium Gifts', name: 'Premium Gifts', icon: '👑', color: '#b45309' }
  ];

  // ─── STORE THEME MAP ───────────────────────────────────────────
  const VANVI_STORE_THEMES = {
    'Amazon':      { color: '#ff9900', bg: 'rgba(255,153,0,0.08)', icon: '🛒', label: 'View on Amazon' },
    'Flipkart':    { color: '#2874f0', bg: 'rgba(40,116,240,0.08)', icon: '🛍️', label: 'View on Flipkart' },
    'Meesho':      { color: '#f43397', bg: 'rgba(244,51,151,0.08)', icon: '🎀', label: 'View on Meesho' },
    'Myntra':      { color: '#ff3f6c', bg: 'rgba(255,63,108,0.08)', icon: '👗', label: 'View on Myntra' },
    'Brand Store': { color: '#9a61ff', bg: 'rgba(154,97,255,0.08)', icon: '🏪', label: 'Visit Store' }
  };

  // ─── HELPER: DETECT STORE FROM AFFILIATE URL ──────────────────
  function detectStoreFromUrl(url) {
    if (!url) return 'Brand Store';
    const lower = String(url).toLowerCase();
    if (lower.includes('meesho.com') || lower.includes('meesho')) return 'Meesho';
    if (lower.includes('amazon.') || lower.includes('amzn.')) return 'Amazon';
    if (lower.includes('flipkart.com') || lower.includes('fkrt.')) return 'Flipkart';
    if (lower.includes('myntra.com')) return 'Myntra';
    return 'Brand Store';
  }

  // ─── DYNAMIC STORAGE HELPERS ───────────────────────────────────
  function getVanviProducts() {
    try {
      const custom = localStorage.getItem('vanvi_custom_products');
      if (custom) {
        const parsed = JSON.parse(custom);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch(e) {}
    return VANVI_PRODUCTS;
  }

  function saveVanviProducts(list) {
    try {
      localStorage.setItem('vanvi_custom_products', JSON.stringify(list));
    } catch(e) {}
  }

  // ─── EXPORTS ───────────────────────────────────────────────────
  root.VANVI_PRODUCTS = VANVI_PRODUCTS;
  root.VANVI_PRODUCT_CATEGORIES = VANVI_PRODUCT_CATEGORIES;
  root.VANVI_STORE_THEMES = VANVI_STORE_THEMES;
  root.getVanviProducts = getVanviProducts;
  root.saveVanviProducts = saveVanviProducts;
  root.detectStoreFromUrl = detectStoreFromUrl;

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
