/**
 * VANVI MOMENTS — PHYSICAL GIFT BOUTIQUE & AFFILIATE RESELLING ENGINE
 * Curated physical celebration treasures with direct 1-tap affiliate and
 * reselling links across Meesho, Amazon India, Flipkart, and Myntra.
 */

(function(root) {
  'use strict';

  const VANVI_BOUTIQUE_PRODUCTS = [
    {
      id: 'vnv-nfc-velvet-card',
      name: 'Vanvi Velvet NFC Smart Keepsake Card',
      tagline: 'Tap phone on card to instantly launch your surprise moment',
      description: 'Handcrafted luxury velvet touch greeting card with embedded NTAG215 NFC smart chip and QR backup. Gold-foiled calligraphy, envelope with royal wax seal.',
      price: 249,
      originalPrice: 499,
      category: 'nfc',
      badge: 'Bestseller 🌟',
      rating: 4.9,
      reviewCount: 342,
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=900&q=80',
      primaryStore: 'meesho',
      primaryStoreName: 'Meesho Resell',
      primaryStoreBadge: '🛍️ Meesho Resell Best Price',
      primaryAffiliateLink: 'https://www.meesho.com/search?q=nfc+smart+greeting+cards+velvet',
      stores: [
        { id: 'meesho', name: 'Meesho', icon: '🛍️', badge: 'Best Resell Price', price: 249, link: 'https://www.meesho.com/search?q=nfc+smart+greeting+cards+velvet' },
        { id: 'amazon', name: 'Amazon Prime', icon: '📦', badge: 'Prime Fast Delivery', price: 299, link: 'https://www.amazon.in/s?k=nfc+greeting+cards+smart&tag=vanvi-21' },
        { id: 'flipkart', name: 'Flipkart', icon: '⚡', badge: 'Flipkart Assured', price: 289, link: 'https://www.flipkart.com/search?q=nfc+cards+keepsake' },
        { id: 'myntra', name: 'Myntra', icon: '✨', badge: 'Luxury Gift Box', price: 349, link: 'https://www.myntra.com/gifts' }
      ],
      specs: ['Embedded NTAG215 Smart Chip', 'Burgundy Velvet Stock', 'Real Gold Foil Calligraphy', 'Wax-Sealed Envelope Included'],
      pairsWith: 'Compatible with all 40+ Vanvi celebration templates'
    },
    {
      id: 'vnv-acrylic-song-plaque',
      name: 'Holographic Song & Moment Acrylic Plaque',
      tagline: 'Custom photo plaque with audio waveform & instant tap-to-play NFC',
      description: 'Crystal-clear 4mm cast acrylic plaque featuring your favorite couple/family photo, scannable celebration QR, custom song title, and solid beechwood base.',
      price: 399,
      originalPrice: 899,
      category: 'acrylic',
      badge: 'Viral Favorite 🔥',
      rating: 5.0,
      reviewCount: 518,
      image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=900&q=80',
      primaryStore: 'amazon',
      primaryStoreName: 'Amazon Prime',
      primaryStoreBadge: '📦 Amazon Prime Choice',
      primaryAffiliateLink: 'https://www.amazon.in/s?k=acrylic+song+photo+plaque+custom&tag=vanvi-21',
      stores: [
        { id: 'amazon', name: 'Amazon Prime', icon: '📦', badge: '1-Day Prime Delivery', price: 399, link: 'https://www.amazon.in/s?k=acrylic+song+photo+plaque+custom&tag=vanvi-21' },
        { id: 'meesho', name: 'Meesho', icon: '🛍️', badge: 'Wholesale Resell Rate', price: 349, link: 'https://www.meesho.com/search?q=acrylic+photo+frame+song+plaque' },
        { id: 'flipkart', name: 'Flipkart', icon: '⚡', badge: 'Assured Best Seller', price: 429, link: 'https://www.flipkart.com/search?q=custom+acrylic+song+frame' },
        { id: 'myntra', name: 'Myntra Luxe', icon: '✨', badge: 'Curated Keepsake', price: 499, link: 'https://www.myntra.com/gifts' }
      ],
      specs: ['High-Gloss 4mm Acrylic', 'Solid Beechwood Base Stand', 'Scratch-Proof UV Print', 'Scannable Audio Waveform'],
      pairsWith: 'Pairs with Midnight Wish, Temple Royale, or Polaroid Love'
    },
    {
      id: 'vnv-led-ring-box',
      name: 'Royal Velvet 3D Proposal Ring Box with LED Beam',
      tagline: 'Opens with a focused warm starlight beam illuminating the jewelry',
      description: 'Midnight blue and ruby red velvet jewelry gift box with an automatic micro-LED spotlight that turns on upon opening, casting an ethereal diamond glow.',
      price: 299,
      originalPrice: 699,
      category: 'proposals',
      badge: 'Proposal Special 💍',
      rating: 4.9,
      reviewCount: 219,
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80',
      primaryStore: 'meesho',
      primaryStoreName: 'Meesho Resell',
      primaryStoreBadge: '🛍️ Meesho Resell Best Price',
      primaryAffiliateLink: 'https://www.meesho.com/search?q=led+ring+box+velvet+proposal',
      stores: [
        { id: 'meesho', name: 'Meesho', icon: '🛍️', badge: 'Direct Reseller Price', price: 299, link: 'https://www.meesho.com/search?q=led+ring+box+velvet+proposal' },
        { id: 'amazon', name: 'Amazon Prime', icon: '📦', badge: 'Top Rated Proposal Box', price: 349, link: 'https://www.amazon.in/s?k=led+light+velvet+ring+box&tag=vanvi-21' },
        { id: 'flipkart', name: 'Flipkart', icon: '⚡', badge: 'SuperCoins Special', price: 329, link: 'https://www.flipkart.com/search?q=led+velvet+ring+box' },
        { id: 'myntra', name: 'Myntra', icon: '✨', badge: 'Jewelry Accessory', price: 399, link: 'https://www.myntra.com/gifts' }
      ],
      specs: ['Micro-LED Spotlight', 'Deep Crimson Velvet Interior', 'Magnetic Smooth Hinge', 'Protective Gift Sleeve'],
      pairsWith: 'Pairs with The Velvet Ring Box Proposal 3D experience'
    },
    {
      id: 'vnv-wax-sealed-scroll',
      name: 'Handcrafted Wax-Sealed Vintage Love Parchment',
      tagline: 'Burned edge antique parchment scroll stamped with genuine royal wax',
      description: 'Your personalized romantic letter or vows hand-printed on 180 GSM aged parchment paper with burned organic edges and sealed with scented crimson wax stamp.',
      price: 199,
      originalPrice: 449,
      category: 'keepsake',
      badge: 'Atelier Classic 📜',
      rating: 4.8,
      reviewCount: 184,
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80',
      primaryStore: 'amazon',
      primaryStoreName: 'Amazon Prime',
      primaryStoreBadge: '📦 Amazon Handcrafted',
      primaryAffiliateLink: 'https://www.amazon.in/s?k=vintage+parchment+paper+wax+seal+scroll&tag=vanvi-21',
      stores: [
        { id: 'amazon', name: 'Amazon India', icon: '📦', badge: 'Prime Fast Dispatch', price: 199, link: 'https://www.amazon.in/s?k=vintage+parchment+paper+wax+seal+scroll&tag=vanvi-21' },
        { id: 'meesho', name: 'Meesho', icon: '🛍️', badge: 'Reselling Pack', price: 179, link: 'https://www.meesho.com/search?q=wax+seal+scroll+letter' },
        { id: 'flipkart', name: 'Flipkart', icon: '⚡', badge: 'Gift Scrolls', price: 219, link: 'https://www.flipkart.com/search?q=parchment+scroll+wax+seal' }
      ],
      specs: ['180 GSM Textured Parchment', 'Genuine Wax Seal Stamp', 'Jute Ribbon Tie', 'Protective Cylindrical Gift Tube'],
      pairsWith: 'Pairs with Sincere Love Letter & Retro Polaroid Journey'
    },
    {
      id: 'vnv-eternal-rose-dome',
      name: 'Eternal Preserved Rose Glass Cloche with LED Lights',
      tagline: '100% real natural rose preserved to last 3+ years in glass cloche',
      description: 'Grade-A fresh Ecuadorian rose preserved with organic glycerin, enclosed in a borosilicate glass cloche dome with warm fairy starlight garland.',
      price: 599,
      originalPrice: 1299,
      category: 'romantic',
      badge: 'Forever Rose 🌹',
      rating: 4.9,
      reviewCount: 395,
      image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=900&q=80',
      primaryStore: 'meesho',
      primaryStoreName: 'Meesho Resell',
      primaryStoreBadge: '🛍️ Meesho Resell Best Price',
      primaryAffiliateLink: 'https://www.meesho.com/search?q=preserved+rose+glass+dome+led',
      stores: [
        { id: 'meesho', name: 'Meesho', icon: '🛍️', badge: 'Direct Supplier Rate', price: 599, link: 'https://www.meesho.com/search?q=preserved+rose+glass+dome+led' },
        { id: 'amazon', name: 'Amazon Prime', icon: '📦', badge: 'Amazon Choice Galaxy Rose', price: 699, link: 'https://www.amazon.in/s?k=eternal+rose+glass+dome+led&tag=vanvi-21' },
        { id: 'flipkart', name: 'Flipkart', icon: '⚡', badge: 'Flipkart Assured', price: 649, link: 'https://www.flipkart.com/search?q=preserved+forever+rose+dome' },
        { id: 'myntra', name: 'Myntra Luxe', icon: '✨', badge: 'Luxury Decor Gift', price: 799, link: 'https://www.myntra.com/gifts' }
      ],
      specs: ['3+ Year Preserved Natural Rose', 'Borosilicate Glass Dome', 'Warm White LED Garland', 'Natural Wooden Base with Switch'],
      pairsWith: 'Pairs with Romantic Starlight & Valentine 3D Universe'
    },
    {
      id: 'vnv-3d-crystal-cube',
      name: '3D Laser-Etched Optical Crystal Memory Cube',
      tagline: 'Your photo converted into a floating 3D holographic cloud inside crystal',
      description: 'K9 optical glass laser-engraved internally with point-cloud precision. Includes a multi-color LED rotating pedestal that illuminates the 3D memory.',
      price: 699,
      originalPrice: 1499,
      category: 'keepsake',
      badge: 'Luxury Crystal 💎',
      rating: 5.0,
      reviewCount: 167,
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80',
      primaryStore: 'amazon',
      primaryStoreName: 'Amazon Prime',
      primaryStoreBadge: '📦 Amazon Prime Choice',
      primaryAffiliateLink: 'https://www.amazon.in/s?k=3d+crystal+photo+cube+personalized+led&tag=vanvi-21',
      stores: [
        { id: 'amazon', name: 'Amazon Prime', icon: '📦', badge: 'Personalized Crystal Prime', price: 699, link: 'https://www.amazon.in/s?k=3d+crystal+photo+cube+personalized+led&tag=vanvi-21' },
        { id: 'meesho', name: 'Meesho', icon: '🛍️', badge: 'Reseller Price', price: 629, link: 'https://www.meesho.com/search?q=3d+crystal+photo+frame+led' },
        { id: 'flipkart', name: 'Flipkart', icon: '⚡', badge: 'Flipkart Assured', price: 749, link: 'https://www.flipkart.com/search?q=custom+3d+crystal+cube' }
      ],
      specs: ['K9 Pure Optical Crystal', 'Subsurface Laser Etching', 'RGB Multi-Color Light Base', 'Silk-Lined Presentation Box'],
      pairsWith: 'Pairs with Memory Vault & Milestone Anniversary'
    },
    {
      id: 'vnv-belgian-chocolates',
      name: 'Artisanal Belgian Celebration Truffles (Box of 8)',
      tagline: 'Handmade dark & milk chocolate truffles in celebration gift box',
      description: '8 assorted handcrafted Belgian couverture pralines (Roasted Hazelnut, Raspberry Ganache, Sea Salt Caramel) packaged in an embossed gift box.',
      price: 299,
      originalPrice: 599,
      category: 'chocolates',
      badge: 'Sweet Delight 🍫',
      rating: 4.8,
      reviewCount: 289,
      image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=900&q=80',
      primaryStore: 'amazon',
      primaryStoreName: 'Amazon Prime',
      primaryStoreBadge: '📦 Amazon Gourmet',
      primaryAffiliateLink: 'https://www.amazon.in/s?k=belgian+truffles+gift+box&tag=vanvi-21',
      stores: [
        { id: 'amazon', name: 'Amazon India', icon: '📦', badge: 'Amazon Gourmet Choice', price: 299, link: 'https://www.amazon.in/s?k=belgian+truffles+gift+box&tag=vanvi-21' },
        { id: 'meesho', name: 'Meesho', icon: '🛍️', badge: 'Sweet Gift Packs', price: 269, link: 'https://www.meesho.com/search?q=chocolate+gift+box' },
        { id: 'flipkart', name: 'Flipkart', icon: '⚡', badge: 'SuperCoins Eligible', price: 319, link: 'https://www.flipkart.com/search?q=belgian+chocolate+box' },
        { id: 'myntra', name: 'Myntra Luxe', icon: '✨', badge: 'Gourmet Treats', price: 349, link: 'https://www.myntra.com/gifts' }
      ],
      specs: ['Pure Couverture Chocolate', 'Assorted 8 Pralines', 'Celebration Gift Sleeve', 'Cold-Pack Thermal Shipping'],
      pairsWith: 'Pairs with Birthday Candle Surprise & Sweet Wishes'
    },
    {
      id: 'vnv-magnetic-levitating-frame',
      name: 'Floating Magnetic Anti-Gravity Photo Frame',
      tagline: 'Zero-gravity floating heart frame that hovers in mid-air',
      description: 'Electro-magnetic levitation photo frame that spins endlessly in mid-air inside a starlight LED halo arch. Shows 2 double-sided photos with zero friction.',
      price: 799,
      originalPrice: 1599,
      category: 'keepsake',
      badge: 'Magic Levitation ✨',
      rating: 4.9,
      reviewCount: 142,
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80',
      primaryStore: 'meesho',
      primaryStoreName: 'Meesho Resell',
      primaryStoreBadge: '🛍️ Meesho Resell Best Price',
      primaryAffiliateLink: 'https://www.meesho.com/search?q=magnetic+levitating+photo+frame',
      stores: [
        { id: 'meesho', name: 'Meesho', icon: '🛍️', badge: 'Direct Reseller Rate', price: 799, link: 'https://www.meesho.com/search?q=magnetic+levitating+photo+frame' },
        { id: 'amazon', name: 'Amazon Prime', icon: '📦', badge: 'Prime Anti-Gravity', price: 899, link: 'https://www.amazon.in/s?k=magnetic+levitation+floating+photo+frame&tag=vanvi-21' },
        { id: 'flipkart', name: 'Flipkart', icon: '⚡', badge: 'Flipkart Assured', price: 849, link: 'https://www.flipkart.com/search?q=magnetic+floating+frame' }
      ],
      specs: ['Magnetic Levitation Technology', 'Ambient LED Halo Light', 'Double-Sided Photo Insert', 'Continuous Smooth Rotation'],
      pairsWith: 'Pairs with Constellation of Love & Cyber Neon Vows'
    }
  ];

  const VANVI_PRODUCT_CATEGORIES = [
    { id: 'all', name: 'All Keepsakes', icon: '🎁' },
    { id: 'nfc', name: 'NFC Smart Cards', icon: '📱' },
    { id: 'acrylic', name: 'Acrylic Song Plaques', icon: '🎵' },
    { id: 'proposals', name: 'Velvet Ring Boxes', icon: '💍' },
    { id: 'keepsake', name: 'Wax Scrolls & Crystals', icon: '📜' },
    { id: 'romantic', name: 'Eternal Preserved Roses', icon: '🌹' },
    { id: 'chocolates', name: 'Artisanal Chocolates', icon: '🍫' }
  ];

  // ─── AFFILIATE & RESELLING ENGINE ──────────────────────────────────────
  const VanviAffiliate = {
    getAll() {
      return VANVI_BOUTIQUE_PRODUCTS;
    },

    getById(id) {
      return VANVI_BOUTIQUE_PRODUCTS.find(p => p.id === id) || null;
    },

    openStore(productId, storeId) {
      const prod = this.getById(productId);
      if (!prod) return;

      let targetUrl = prod.primaryAffiliateLink;
      let storeName = prod.primaryStoreName;

      if (storeId && prod.stores) {
        const found = prod.stores.find(s => s.id === storeId);
        if (found) {
          targetUrl = found.link;
          storeName = found.name;
        }
      }

      // Smooth click notification toast
      if (typeof window !== 'undefined' && window.showToast) {
        window.showToast(`Opening official ${storeName} storefront... 🛍️`);
      }

      // Open affiliate store safely in new tab
      window.open(targetUrl, '_blank', 'noopener,noreferrer,sponsored');
    }
  };

  // Backwards-compatible dummy cart (prevents legacy reference errors)
  const VanviCart = {
    getCart() { return []; },
    addItem(p) { VanviAffiliate.openStore(p.id); return []; },
    updateQty() { return []; },
    removeItem() { return []; },
    clear() { return []; },
    getCount() { return 0; },
    getTotal() { return 0; }
  };

  // ─── EXPORTS ─────────────────────────────────────────────────────────
  root.VANVI_BOUTIQUE_PRODUCTS = VANVI_BOUTIQUE_PRODUCTS;
  root.VANVI_PRODUCTS = VANVI_BOUTIQUE_PRODUCTS;
  root.VANVI_PRODUCT_CATEGORIES = VANVI_PRODUCT_CATEGORIES;
  root.VanviAffiliate = VanviAffiliate;
  root.VanviCart = VanviCart;

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
