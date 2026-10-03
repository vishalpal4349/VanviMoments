const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const tplPath = path.join(ROOT, 'templates.html');

let content = fs.readFileSync(tplPath, 'utf8');

// 1. REFINED LUXURY CSS FOR COMPACT, COLORFUL, RESPONSIVE CARDS & SLIDERS
const upgradedMasterCss = `
  /* ─── VANVI ATELIER MASTER LUXURY CARD & SLIDER SYSTEM ─── */
  
  /* 1. Base Card Structure: Compact & Elegantly Proportioned */
  .tpl-luxury-card {
    background: #ffffff !important;
    border-radius: 18px !important;
    overflow: hidden !important;
    position: relative !important;
    display: flex !important;
    flex-direction: column !important;
    box-shadow: 0 4px 16px rgba(74, 41, 58, 0.06) !important;
    transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.22s ease, border-color 0.22s ease !important;
    cursor: pointer !important;
    height: 310px !important;
    width: 250px !important;
    flex-shrink: 0 !important;
    scroll-snap-align: start !important;
    border: 1px solid rgba(255, 120, 175, 0.28) !important;
  }
  .tpl-luxury-card:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 10px 26px rgba(74, 41, 58, 0.12) !important;
  }

  /* 2. Visual Tier Hierarchy (Jitna Mehenga, Utna Zyada Colorful & Premium) */
  /* Tier 1: Complimentary Keepsake (Free) */
  .tpl-luxury-card.tier-complimentary {
    border-color: rgba(16, 185, 129, 0.35) !important;
  }
  .tpl-luxury-card.tier-complimentary:hover {
    border-color: #10b981 !important;
    box-shadow: 0 10px 28px rgba(16, 185, 129, 0.2) !important;
  }

  /* Tier 2: Signature Keepsake (₹99 - ₹199) */
  .tpl-luxury-card.tier-signature {
    border-color: rgba(255, 42, 122, 0.35) !important;
  }
  .tpl-luxury-card.tier-signature:hover {
    border-color: #ff2a7a !important;
    box-shadow: 0 12px 30px rgba(255, 42, 122, 0.24) !important;
  }

  /* Tier 3: 24K Grand Atelier & Royale (₹249+) */
  .tpl-luxury-card.tier-24k-atelier {
    border: 1.5px solid rgba(245, 158, 11, 0.6) !important;
    box-shadow: 0 6px 20px rgba(245, 158, 11, 0.15) !important;
  }
  .tpl-luxury-card.tier-24k-atelier:hover {
    border-color: #f59e0b !important;
    box-shadow: 0 14px 36px rgba(245, 158, 11, 0.35), 0 0 20px rgba(236, 72, 153, 0.2) !important;
  }

  /* 3. Full-Bleed Cover Image with Ambient Dark Scrim */
  .tpl-cover-stage {
    position: absolute !important;
    inset: 0 !important;
    width: 100% !important;
    height: 100% !important;
    overflow: hidden !important;
    border-radius: 18px !important;
    background: #fff0f5 !important;
  }
  .tpl-cover-img {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
    object-position: center !important;
    display: block !important;
    transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1) !important;
  }
  .tpl-luxury-card:hover .tpl-cover-img {
    transform: scale(1.03) !important;
  }
  .tpl-cover-gradient {
    position: absolute !important;
    inset: 0 !important;
    background: linear-gradient(180deg, transparent 35%, rgba(18, 8, 16, 0.35) 60%, rgba(18, 8, 16, 0.88) 100%) !important;
    pointer-events: none !important;
    z-index: 2 !important;
  }

  /* 4. Luxury Top Badge (Pill on Top-Right of Image) */
  .tpl-tier-top-badge {
    position: absolute !important;
    top: 10px !important;
    right: 10px !important;
    font-size: 10px !important;
    font-weight: 850 !important;
    letter-spacing: 0.3px !important;
    padding: 3px 9px !important;
    border-radius: 99px !important;
    z-index: 4 !important;
    backdrop-filter: blur(10px) !important;
    -webkit-backdrop-filter: blur(10px) !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
  }
  .badge-complimentary {
    background: rgba(16, 185, 129, 0.9) !important;
    color: #ffffff !important;
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
  }
  .badge-signature {
    background: linear-gradient(135deg, #ff2a7a, #f43f5e) !important;
    color: #ffffff !important;
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
  }
  .badge-24k {
    background: linear-gradient(135deg, #f59e0b, #d97706) !important;
    color: #ffffff !important;
    border: 1px solid #fef08a !important;
    box-shadow: 0 0 10px rgba(245, 158, 11, 0.5) !important;
  }

  /* 5. Floating Frosted Glass Capsule (Docked inside image at bottom) */
  .tpl-floating-capsule {
    position: absolute !important;
    bottom: 8px !important;
    left: 8px !important;
    right: 8px !important;
    background: rgba(255, 255, 255, 0.9) !important;
    backdrop-filter: blur(20px) !important;
    -webkit-backdrop-filter: blur(20px) !important;
    border: 1px solid rgba(255, 255, 255, 0.8) !important;
    border-radius: 14px !important;
    padding: 8px 10px !important;
    box-shadow: 0 6px 20px rgba(44, 18, 36, 0.14) !important;
    z-index: 5 !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 3px !important;
    box-sizing: border-box !important;
    transition: all 0.2s ease !important;
  }
  .tpl-luxury-card:hover .tpl-floating-capsule {
    background: rgba(255, 255, 255, 0.96) !important;
    box-shadow: 0 8px 24px rgba(255, 42, 122, 0.18) !important;
  }

  /* 24K Atelier Deep Velvet Glass Capsule */
  .tpl-luxury-card.tier-24k-atelier .tpl-floating-capsule {
    background: rgba(26, 10, 30, 0.9) !important;
    border: 1.2px solid rgba(245, 158, 11, 0.55) !important;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35) !important;
  }
  .tpl-luxury-card.tier-24k-atelier:hover .tpl-floating-capsule {
    background: rgba(32, 12, 38, 0.95) !important;
    border-color: #fbbf24 !important;
  }

  /* Capsule Header Row: Title & Price */
  .capsule-header-row {
    display: flex !important;
    align-items: baseline !important;
    justify-content: space-between !important;
    gap: 6px !important;
  }
  .capsule-title {
    font-family: 'Cormorant Garamond', Georgia, serif !important;
    font-size: 15.5px !important;
    font-weight: 750 !important;
    color: #2c1224 !important;
    margin: 0 !important;
    line-height: 1.15 !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    flex: 1 !important;
  }
  .tpl-luxury-card.tier-24k-atelier .capsule-title {
    color: #fef08a !important;
    font-weight: 800 !important;
  }

  .capsule-price-val {
    font-family: 'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif !important;
    font-size: 13.5px !important;
    font-weight: 850 !important;
    color: #ff2a7a !important;
    white-space: nowrap !important;
  }
  .capsule-price-val.price-complimentary {
    color: #059669 !important;
  }
  .tpl-luxury-card.tier-24k-atelier .capsule-price-val {
    color: #fbbf24 !important;
  }

  /* Capsule Description Line */
  .capsule-desc {
    font-size: 10.5px !important;
    color: #724c65 !important;
    line-height: 1.25 !important;
    margin: 0 0 5px !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }
  .tpl-luxury-card.tier-24k-atelier .capsule-desc {
    color: #fce7f3 !important;
    opacity: 0.9 !important;
  }

  /* Dual Action Buttons Row */
  .capsule-actions-row {
    display: flex !important;
    gap: 6px !important;
    align-items: center !important;
  }
  .btn-capsule-preview {
    flex: 1 !important;
    box-sizing: border-box !important;
    padding: 6px 4px !important;
    border-radius: 99px !important;
    font-size: 11px !important;
    font-weight: 750 !important;
    text-align: center !important;
    text-decoration: none !important;
    background: rgba(255, 255, 255, 0.75) !important;
    border: 1px solid rgba(255, 120, 175, 0.35) !important;
    color: #2c1224 !important;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04) !important;
    transition: all 0.2s ease !important;
    display: block !important;
    line-height: 1.2 !important;
    white-space: nowrap !important;
  }
  .btn-capsule-preview:hover {
    background: #ffffff !important;
    border-color: #ff2a7a !important;
    color: #ff2a7a !important;
  }
  .tpl-luxury-card.tier-24k-atelier .btn-capsule-preview {
    background: rgba(255, 255, 255, 0.12) !important;
    border-color: rgba(245, 158, 11, 0.5) !important;
    color: #fef08a !important;
  }
  .tpl-luxury-card.tier-24k-atelier .btn-capsule-preview:hover {
    background: rgba(255, 255, 255, 0.22) !important;
    border-color: #fef08a !important;
  }

  .btn-capsule-make {
    flex: 1.2 !important;
    box-sizing: border-box !important;
    padding: 6.5px 6px !important;
    border-radius: 99px !important;
    font-size: 11px !important;
    font-weight: 800 !important;
    text-align: center !important;
    text-decoration: none !important;
    background: linear-gradient(135deg, #ff2a7a 0%, #d97706 100%) !important;
    color: #ffffff !important;
    border: none !important;
    box-shadow: 0 3px 8px rgba(255, 42, 122, 0.35) !important;
    transition: all 0.2s ease !important;
    display: block !important;
    line-height: 1.2 !important;
    white-space: nowrap !important;
  }
  .btn-capsule-make:hover {
    transform: translateY(-1px) !important;
    box-shadow: 0 5px 14px rgba(255, 42, 122, 0.5) !important;
    color: #ffffff !important;
  }
  .tpl-luxury-card.tier-24k-atelier .btn-capsule-make {
    background: linear-gradient(135deg, #f59e0b 0%, #e11d68 100%) !important;
    box-shadow: 0 3px 10px rgba(245, 158, 11, 0.45) !important;
  }

  /* 6. Slider Tracks & Control Arrows (Laptop & Mobile) */
  .slider-wrapper-relative {
    position: relative !important;
    width: 100% !important;
  }
  .template-slider-track {
    display: flex !important;
    gap: 16px !important;
    overflow-x: auto !important;
    scroll-snap-type: x mandatory !important;
    -webkit-overflow-scrolling: touch !important;
    scroll-behavior: smooth !important;
    padding: 6px 4px 14px !important;
    scrollbar-width: none !important;
  }
  .template-slider-track::-webkit-scrollbar {
    display: none !important;
  }

  /* Header compact arrow controls */
  .sec-slider-arrows {
    display: inline-flex !important;
    align-items: center !important;
    gap: 6px !important;
  }
  .btn-sec-arrow {
    background: rgba(255, 255, 255, 0.92) !important;
    border: 1px solid rgba(255, 120, 175, 0.35) !important;
    color: #2c1224 !important;
    width: 28px !important;
    height: 28px !important;
    border-radius: 50% !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    font-size: 13px !important;
    font-weight: 800 !important;
    cursor: pointer !important;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04) !important;
    transition: all 0.2s ease !important;
  }
  .btn-sec-arrow:hover {
    background: #ffffff !important;
    border-color: #ff2a7a !important;
    color: #ff2a7a !important;
    transform: scale(1.08) !important;
  }

  /* Floating side track arrows (for desktop) */
  .track-arrow {
    position: absolute !important;
    top: 50% !important;
    transform: translateY(-50%) !important;
    z-index: 20 !important;
    width: 38px !important;
    height: 38px !important;
    border-radius: 50% !important;
    background: rgba(255, 255, 255, 0.94) !important;
    backdrop-filter: blur(12px) !important;
    border: 1.5px solid rgba(255, 120, 175, 0.38) !important;
    color: #2c1224 !important;
    font-size: 18px !important;
    font-weight: 800 !important;
    cursor: pointer !important;
    box-shadow: 0 4px 14px rgba(44, 18, 36, 0.12) !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    transition: all 0.2s ease !important;
  }
  .track-arrow:hover {
    background: #ffffff !important;
    border-color: #ff2a7a !important;
    color: #ff2a7a !important;
    transform: translateY(-50%) scale(1.08) !important;
  }
  .track-arrow-prev { left: -16px !important; }
  .track-arrow-next { right: -16px !important; }

  /* 7. Grid for deep filtered views */
  .marketplace-grid {
    display: grid !important;
    grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)) !important;
    gap: 18px !important;
  }

  /* 8. Mobile Responsiveness */
  @media (max-width: 768px) {
    .track-arrow {
      display: none !important; /* Mobile uses swipe and header arrows */
    }
  }

  @media (max-width: 480px) {
    .tpl-luxury-card {
      height: 260px !important;
      width: 215px !important;
    }
    .tpl-floating-capsule {
      left: 6px !important;
      right: 6px !important;
      bottom: 6px !important;
      padding: 7px 8px !important;
      border-radius: 12px !important;
    }
    .capsule-title {
      font-size: 14.5px !important;
    }
    .capsule-price-val {
      font-size: 12px !important;
    }
    .capsule-desc {
      font-size: 10px !important;
      margin-bottom: 4px !important;
    }
    .btn-capsule-preview, .btn-capsule-make {
      font-size: 10.5px !important;
      padding: 5.5px 4px !important;
    }
    .marketplace-grid {
      grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)) !important;
      gap: 12px !important;
    }
  }

  @media (max-width: 360px) {
    .tpl-luxury-card {
      height: 245px !important;
      width: 195px !important;
    }
    .capsule-title {
      font-size: 13.5px !important;
    }
    .btn-capsule-preview, .btn-capsule-make {
      font-size: 10px !important;
      padding: 5px 3px !important;
    }
  }
`;

// Insert the CSS into templates.html
if (content.includes('/* ─── VANVI ATELIER MASTER LUXURY CARD & SLIDER SYSTEM')) {
  content = content.replace(/\/\* ─── VANVI ATELIER MASTER LUXURY CARD & SLIDER SYSTEM[\s\S]*?<\/style>/, upgradedMasterCss + '\n</style>');
} else if (content.includes('/* ─── OPTION 2: FLOATING ATELIER GLASS CAPSULE')) {
  content = content.replace(/\/\* ─── OPTION 2: FLOATING ATELIER GLASS CAPSULE[\s\S]*?<\/style>/, upgradedMasterCss + '\n</style>');
} else {
  content = content.replace('</style>', upgradedMasterCss + '\n</style>');
}

// 2. CURATED HIGH-DEFINITION UNSPLASH PHOTO MAP
const curatedPhotoMap = `
      // Curated High-Definition Occasion Photos on Unsplash
      const CURATED_UNSPLASH_MAP = {
        'birthday-3d-candle': 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80',
        'birthday-white-bloom': 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&auto=format&fit=crop&q=80',
        'birthday-wish-1': 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80',
        'birthday-wish-2': 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&auto=format&fit=crop&q=80',
        'constellation-love': 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&auto=format&fit=crop&q=80',
        'birthday-gf': 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&auto=format&fit=crop&q=80',
        'retro-polaroid-wall': 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&auto=format&fit=crop&q=80',
        'golden-anniversary': 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&auto=format&fit=crop&q=80',
        'sincere-letter': 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80',
        'apology-dashboard': 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80',
        'little-love': 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&auto=format&fit=crop&q=80',
        'forever-us': 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&auto=format&fit=crop&q=80',
        'best-friend-chaos': 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&auto=format&fit=crop&q=80',
        'maa-papa-tribute': 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&auto=format&fit=crop&q=80',
        'diwali-sparkler': 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80'
      };

      function getThumbnailUrl(t) {
        if (t.id && CURATED_UNSPLASH_MAP[t.id]) return CURATED_UNSPLASH_MAP[t.id];
        if (t.slug && CURATED_UNSPLASH_MAP[t.slug]) return CURATED_UNSPLASH_MAP[t.slug];
        if (t.thumbnail && t.thumbnail.includes('unsplash.com')) return t.thumbnail;
        const cat = (t.categorySlug || t.category || '').toLowerCase();
        if (cat.includes('love') || cat.includes('anniversary')) return 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&auto=format&fit=crop&q=80';
        if (cat.includes('friend')) return 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&auto=format&fit=crop&q=80';
        if (cat.includes('apology')) return 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80';
        return 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80';
      }
`;

// Replace getThumbnailUrl and CUTIEPAGE_THUMB_MAP
const oldThumbRegex = /\/\/ Authentic Cutiepage-inspired luxury covers[\s\S]*?function getThumbnailUrl\(t\) \{[\s\S]*?return 'https:\/\/cdn\.cutiepage\.in\/static\/products\/birthday-wish1\.jpg';\s*\}/;

if (oldThumbRegex.test(content)) {
  content = content.replace(oldThumbRegex, curatedPhotoMap);
  console.log('Replaced thumbnail map with high-definition Unsplash photos!');
}

// 3. ENHANCED getTierDetails WITH PRESTIGE LABELS & 3-TIER HIERARCHY
const upgradedTierDetails = `
      // Determine Tier Class, Prestige Label & Visual Accent
      function getTierDetails(t) {
        const p = Number(t.price || 0);
        if (t.isFree || p === 0) {
          return {
            tierClass: 'tier-complimentary',
            badgeClass: 'badge-complimentary',
            badgeText: '🌿 Complimentary',
            priceFormatted: 'Complimentary',
            origPriceFormatted: '',
            discountText: 'Free Gift'
          };
        }
        if (p >= 249) {
          return {
            tierClass: 'tier-24k-atelier',
            badgeClass: 'badge-24k',
            badgeText: '👑 24K Masterpiece',
            priceFormatted: \`₹\${p}\`,
            origPriceFormatted: \`₹\${Math.round(p * 1.5 / 10) * 10 - 1}\`,
            discountText: '35% OFF'
          };
        }
        return {
          tierClass: 'tier-signature',
          badgeClass: 'badge-signature',
          badgeText: t.badge || '✨ Signature',
          priceFormatted: \`₹\${p}\`,
          origPriceFormatted: \`₹\${Math.round(p * 1.45 / 10) * 10 - 1}\`,
          discountText: '30% OFF'
        };
      }
`;

const oldTierRegex = /\/\/ Determine Tier Class & Badge[\s\S]*?function getTierDetails\(t\) \{[\s\S]*?return \{[\s\S]*?\};\s*\}/;

if (oldTierRegex.test(content)) {
  content = content.replace(oldTierRegex, upgradedTierDetails);
  console.log('Upgraded getTierDetails with luxury prestige hierarchy!');
}

// 4. REFINED renderCardHtml WITH PRESTIGE BADGE ON IMAGE + COMPACT GLASS CAPSULE
const upgradedRenderCard = `// Render Single Template Card HTML (Master Vanvi Atelier System)
      function renderCardHtml(t, idx = 0) {
        const tier = getTierDetails(t);
        const thumbUrl = getThumbnailUrl(t);
        const safeId = encodeURIComponent(t.id);
        const safeOccasion = encodeURIComponent(t.category || 'Birthday');
        const isFree = (t.isFree || Number(t.price || 0) === 0);

        return \`
          <article class="tpl-luxury-card \${tier.tierClass}" id="card-\${t.id}" onclick="window.location.href='preview.html?template=\${safeId}'" title="Preview \${escapeHtml(t.name)}">
            <!-- Full-Bleed Cover Visual Stage -->
            <div class="tpl-cover-stage">
              <span class="tpl-tier-top-badge \${tier.badgeClass}">\${tier.badgeText}</span>
              <img class="tpl-cover-img" src="\${thumbUrl}" alt="\${escapeHtml(t.name)}" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80';">
              <div class="tpl-cover-gradient"></div>
            </div>

            <!-- Floating Frosted Glass Capsule (Docked inside image) -->
            <div class="tpl-floating-capsule" onclick="event.stopPropagation();">
              <div class="capsule-header-row">
                <h3 class="capsule-title" title="\${escapeHtml(t.name)}">\${escapeHtml(t.name)}</h3>
                <span class="capsule-price-val \${isFree ? 'price-complimentary' : ''}">\${tier.priceFormatted}</span>
              </div>
              <p class="capsule-desc">\${escapeHtml(t.description || 'A timeless digital celebration crafted to turn your moments into unforgettable memories.')}</p>
              <div class="capsule-actions-row">
                <a href="preview.html?template=\${safeId}" class="btn-capsule-preview" title="Live Preview">Preview ✦</a>
                <a href="builder.html?template=\${safeId}&occasion=\${safeOccasion}" class="btn-capsule-make" title="Personalize This Template">Make It Yours ✨</a>
              </div>
            </div>
          </article>
        \`;
      }`;

const oldRenderCardRegex = /\/\/ Render Single Template Card HTML[\s\S]*?function renderCardHtml\(t, idx = 0\) \{[\s\S]*?return `[\s\S]*?<\/article>\s*`;\s*\}/;

if (oldRenderCardRegex.test(content)) {
  content = content.replace(oldRenderCardRegex, upgradedRenderCard);
  console.log('Upgraded renderCardHtml with prestige badge & compact glass capsule!');
}

// 5. ADD CATEGORY HEADER SLIDER CONTROLS (ARROW BUTTONS IN HEADER FOR MOBILE & LAPTOP)
content = content.replace(
  `<div style="display:flex; align-items:center; gap:6px;">\n                    \${bespokeHeaderBtn}\n                    <a href="javascript:void(0)" class="btn-sec-viewall" onclick="selectCategoryDirect('\${cat.id}')">`,
  `<div style="display:flex; align-items:center; gap:6px;">
                    \${bespokeHeaderBtn}
                    <div class="sec-slider-arrows">
                      <button type="button" class="btn-sec-arrow" onclick="scrollSectionTrack('\${cat.id}', -1)" aria-label="Slide Left">‹</button>
                      <button type="button" class="btn-sec-arrow" onclick="scrollSectionTrack('\${cat.id}', 1)" aria-label="Slide Right">›</button>
                    </div>
                    <a href="javascript:void(0)" class="btn-sec-viewall" onclick="selectCategoryDirect('\${cat.id}')">`
);

fs.writeFileSync(tplPath, content, 'utf8');
console.log('templates.html successfully updated with the complete Master Luxury System!');
