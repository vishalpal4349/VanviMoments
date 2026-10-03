const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const tplPath = path.join(ROOT, 'templates.html');

let content = fs.readFileSync(tplPath, 'utf8');

// 1. UPDATE getTierDetails TO USE "FREE" INSTEAD OF "COMPLIMENTARY"
content = content.replace(
  `tierClass: 'tier-complimentary',
            badgeClass: 'badge-complimentary',
            badgeText: '🌿 Complimentary',
            priceFormatted: 'Complimentary',
            origPriceFormatted: '',
            discountText: 'Free Gift'`,
  `tierClass: 'tier-free',
            badgeClass: 'badge-free',
            badgeText: '🎁 100% FREE',
            priceFormatted: 'FREE',
            origPriceFormatted: '',
            discountText: '100% Free'`
);

// 2. REVISE renderCardHtml TO CLEANLY RENDER "FREE" AND PROPER BADGES
content = content.replace(
  `<span class="capsule-price-val \${isFree ? 'price-complimentary' : ''}">\${tier.priceFormatted}</span>`,
  `<span class="capsule-price-val \${isFree ? 'price-free' : ''}">\${isFree ? 'FREE' : tier.priceFormatted}</span>`
);

// 3. CSS ENHANCEMENTS FOR CLEAN AIRY DOCK & CARD BUTTONS FIT
const cleanUiCss = `
  /* ─── ULTRA-CLEAN COMPACT DOCK & FIXED MOBILE BUTTONS FIT ─── */
  
  /* 1. Header & Hero: Clean, Spacious & Compact */
  .templates-top-dock {
    max-width: 1280px;
    margin: 0 auto;
    padding: 16px 20px 8px;
  }
  .top-title-lockup {
    margin-bottom: 12px;
  }
  .top-kicker {
    font-size: 10.5px;
    font-weight: 850;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--rose-primary);
    display: block;
    margin-bottom: 3px;
  }
  .top-hero-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(1.75rem, 3.5vw, 2.4rem);
    font-weight: 750;
    color: var(--text-dark);
    margin: 0;
    line-height: 1.15;
    display: flex;
    align-items: baseline;
    gap: 10px;
    flex-wrap: wrap;
  }
  .badge-count-pill {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 11px;
    font-weight: 800;
    background: rgba(255, 42, 122, 0.1);
    color: var(--rose-primary);
    border: 1px solid rgba(255, 42, 122, 0.25);
    padding: 3px 10px;
    border-radius: 99px;
  }

  /* 2. Top Controls Bar: Search + Filter Toggle + Sort */
  .top-controls-bar {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
    flex-wrap: wrap;
  }
  .dock-search-box {
    flex: 1;
    min-width: 220px;
    position: relative;
    background: #ffffff;
    border: 1.5px solid rgba(255, 120, 175, 0.35);
    border-radius: 99px;
    display: flex;
    align-items: center;
    padding: 0 14px;
    box-shadow: 0 2px 10px rgba(255, 42, 122, 0.05);
    transition: all 0.2s ease;
  }
  .dock-search-box:focus-within {
    border-color: var(--rose-primary);
    box-shadow: 0 4px 16px rgba(255, 42, 122, 0.16);
  }
  .dock-search-icon {
    font-size: 16px;
    color: #8b7286;
    margin-right: 6px;
  }
  .dock-search-input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    padding: 10px 0;
    font-size: 13.5px;
    color: var(--text-dark);
    font-family: var(--font-sans);
  }
  .dock-search-clear {
    border: none;
    background: transparent;
    color: #94a3b8;
    font-size: 14px;
    cursor: pointer;
    padding: 4px;
  }
  .dock-btn-group {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .btn-dock-toggle-filter {
    background: #ffffff;
    border: 1.5px solid rgba(255, 120, 175, 0.35);
    border-radius: 99px;
    padding: 9px 16px;
    font-size: 12.5px;
    font-weight: 750;
    color: var(--text-dark);
    display: inline-flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
    transition: all 0.2s ease;
  }
  .btn-dock-toggle-filter:hover, .btn-dock-toggle-filter.active {
    border-color: var(--rose-primary);
    color: var(--rose-primary);
    background: #fff5f8;
  }
  .dock-sort-select {
    background: #ffffff;
    border: 1.5px solid rgba(255, 120, 175, 0.35);
    border-radius: 99px;
    padding: 9px 14px;
    font-size: 12.5px;
    font-weight: 750;
    color: var(--text-dark);
    outline: none;
    cursor: pointer;
  }

  /* 3. Expandable Drawer for Budget & Features */
  .dock-filter-drawer {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 120, 175, 0.3);
    border-radius: 16px;
    padding: 12px 16px;
    margin-bottom: 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    box-shadow: 0 8px 24px rgba(44, 18, 36, 0.08);
  }
  .drawer-chips-group {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
  .drawer-label {
    font-size: 11.5px;
    font-weight: 800;
    color: #724c65;
    min-width: 65px;
  }
  .chip-free-highlight {
    color: #059669 !important;
    border-color: rgba(16, 185, 129, 0.4) !important;
    font-weight: 800 !important;
  }

  /* 4. Streamlined Category Nav Ribbon */
  .category-nav-wrapper {
    position: relative;
    width: 100%;
    margin-bottom: 14px;
  }
  .category-nav-scroll {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding: 4px 2px 8px;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }
  .category-nav-scroll::-webkit-scrollbar {
    display: none;
  }
  .cat-tab-btn {
    flex-shrink: 0;
    background: #ffffff;
    border: 1px solid rgba(255, 120, 175, 0.3);
    color: var(--text-dark);
    font-size: 12.5px;
    font-weight: 750;
    padding: 7px 15px;
    border-radius: 99px;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
  }
  .cat-tab-btn:hover {
    border-color: var(--rose-primary);
    color: var(--rose-primary);
  }
  .cat-tab-btn.active {
    background: linear-gradient(135deg, #ff2a7a, #d97706);
    color: #ffffff !important;
    border-color: transparent;
    box-shadow: 0 4px 12px rgba(255, 42, 122, 0.35);
  }

  /* 5. FIX BUTTONS INSIDE CAPSULE (ZERO OVERFLOW ON ANY MOBILE SCREEN) */
  .tpl-luxury-card {
    height: 310px !important;
    width: 250px !important;
    box-sizing: border-box !important;
  }
  .tpl-floating-capsule {
    left: 8px !important;
    right: 8px !important;
    bottom: 8px !important;
    padding: 9px 10px !important;
    box-sizing: border-box !important;
    width: calc(100% - 16px) !important;
    max-width: calc(100% - 16px) !important;
  }
  .capsule-actions-row {
    display: flex !important;
    gap: 6px !important;
    width: 100% !important;
    box-sizing: border-box !important;
  }
  .btn-capsule-preview {
    flex: 1 !important;
    min-width: 0 !important;
    box-sizing: border-box !important;
    padding: 6.5px 4px !important;
    font-size: 11px !important;
    font-weight: 750 !important;
    text-align: center !important;
    border-radius: 99px !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    display: block !important;
  }
  .btn-capsule-make {
    flex: 1.25 !important;
    min-width: 0 !important;
    box-sizing: border-box !important;
    padding: 6.5px 6px !important;
    font-size: 11px !important;
    font-weight: 800 !important;
    text-align: center !important;
    border-radius: 99px !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    display: block !important;
  }

  /* Free Badge Styles */
  .badge-free {
    background: #10b981 !important;
    color: #ffffff !important;
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
  }
  .price-free {
    color: #059669 !important;
    font-weight: 850 !important;
  }

  /* Mobile Tuning */
  @media (max-width: 480px) {
    .templates-top-dock {
      padding: 10px 12px 4px;
    }
    .top-hero-title {
      font-size: 1.4rem;
    }
    .dock-search-box {
      min-width: 100%;
    }
    .dock-btn-group {
      width: 100%;
      justify-content: space-between;
    }
    .btn-dock-toggle-filter {
      flex: 1;
      justify-content: center;
      padding: 8px 12px;
      font-size: 12px;
    }
    .dock-sort-select {
      flex: 1;
      padding: 8px 10px;
      font-size: 12px;
    }
    .tpl-luxury-card {
      height: 275px !important;
      width: 230px !important;
    }
    .tpl-floating-capsule {
      padding: 8px 8px !important;
    }
    .capsule-title {
      font-size: 14px !important;
    }
    .capsule-price-val {
      font-size: 12px !important;
    }
    .btn-capsule-preview, .btn-capsule-make {
      font-size: 10.5px !important;
      padding: 6px 3px !important;
    }
  }
  @media (max-width: 360px) {
    .tpl-luxury-card {
      height: 260px !important;
      width: 210px !important;
    }
  }
`;

content = content.replace('</style>', cleanUiCss + '\n</style>');

// 4. REPLACE BULKY TOP SECTIONS (BREADCRUMB + HERO + FILTERS) WITH CLEAN ATELIER DOCK
const oldTopSectionRegex = /<!-- Navigation Back & Breadcrumb -->[\s\S]*?<!-- Main Marketplace Content Area -->/;

const cleanTopSectionHtml = `<!-- ─── ULTRA-CLEAN ATELIER TOP DOCK & COMPACT FILTERS ─── -->
  <section class="templates-top-dock">
    <div class="top-title-lockup">
      <span class="top-kicker">✦ BESPOKE CELEBRATION ATELIER</span>
      <h1 class="top-hero-title">
        Curated Templates <span class="badge-count-pill" id="headerCatalogCountBadge">40+ Designs</span>
      </h1>
    </div>

    <!-- Top Controls: Single-line Search + Filter Drawer Toggle + Sort -->
    <div class="top-controls-bar">
      <div class="dock-search-box">
        <span class="dock-search-icon">⌕</span>
        <input type="search" id="templateSearchInput" class="dock-search-input" placeholder="Search Birthday, Love, Candle, Free..." aria-label="Search templates" />
        <button type="button" id="btnSearchClear" class="dock-search-clear" aria-label="Clear search">✕</button>
      </div>

      <div class="dock-btn-group">
        <button type="button" class="btn-dock-toggle-filter" id="btnToggleSmartFilter" aria-expanded="false" onclick="toggleFilterDrawer()">
          <span>🏷️</span> <span class="filter-btn-text">Filters</span> <span class="filter-arrow-chevron" id="filterChevron">▾</span>
        </button>

        <select class="dock-sort-select" id="sortSelect" aria-label="Sort templates">
          <option value="popular">🔥 Trending</option>
          <option value="price-asc">🏷️ Price: Low</option>
          <option value="price-desc">👑 Price: High</option>
          <option value="newest">✨ Newest</option>
        </select>
      </div>
    </div>

    <!-- Expandable Filter Drawer (Collapsed by default on mobile to save 250px) -->
    <div class="dock-filter-drawer" id="dockFilterDrawer" style="display: none;">
      <div class="drawer-chips-group">
        <span class="drawer-label">💰 Budget:</span>
        <div class="filter-chips-list" id="budgetChipsContainer">
          <div class="smart-chip active" data-budget="all">All Budgets</div>
          <div class="smart-chip chip-free-highlight" data-budget="free">🎁 100% Free</div>
          <div class="smart-chip" data-budget="under199">Under ₹199</div>
          <div class="smart-chip" data-budget="200to499">₹200 – ₹499</div>
          <div class="smart-chip" data-budget="above500">Luxury ₹500+</div>
        </div>
      </div>
      <div class="drawer-chips-group">
        <span class="drawer-label">✨ Features:</span>
        <div class="filter-chips-list" id="featureChipsContainer">
          <div class="smart-chip active" data-feature="all">All Features</div>
          <div class="smart-chip" data-feature="candle">🕯️ 3D Candle</div>
          <div class="smart-chip" data-feature="wax">💌 Wax Seal</div>
          <div class="smart-chip" data-feature="polaroid">📸 Polaroid Reel</div>
          <div class="smart-chip" data-feature="audio">🎵 Soundtrack</div>
          <div class="smart-chip" data-feature="scratch">🎟️ Scratch Card</div>
          <div class="smart-chip" data-feature="pin">🔐 PIN Lock</div>
        </div>
      </div>
    </div>

    <!-- Clean Category Navigation Ribbon -->
    <nav class="category-nav-wrapper">
      <div class="category-nav-scroll" id="categoryTabsNav">
        <button type="button" class="cat-tab-btn active" data-cat="all">✨ All</button>
        <button type="button" class="cat-tab-btn" data-cat="birthday">🎂 Birthday</button>
        <button type="button" class="cat-tab-btn" data-cat="love">❤️ Romantic</button>
        <button type="button" class="cat-tab-btn" data-cat="anniversary">💍 Anniversary</button>
        <button type="button" class="cat-tab-btn" data-cat="friendship">👥 Friends</button>
        <button type="button" class="cat-tab-btn" data-cat="memories">📸 Memories</button>
        <button type="button" class="cat-tab-btn" data-cat="apology">💌 Apology</button>
        <button type="button" class="cat-tab-btn" data-cat="free" style="color:#059669; font-weight:800;">🎁 100% Free</button>
        <button type="button" class="cat-tab-btn" data-cat="premium" style="color:#b45309; font-weight:800;">👑 24K Atelier</button>
      </div>
    </nav>
  </section>

  <!-- Live Results Meta Bar -->
  <div class="results-meta-bar" style="max-width:1280px; margin:0 auto; padding:0 20px 8px; font-size:11.5px; color:#88627b;">
    <span id="resultsCountLabel">Showing all templates</span>
  </div>

  <!-- Main Marketplace Content Area -->`;

if (oldTopSectionRegex.test(content)) {
  content = content.replace(oldTopSectionRegex, cleanTopSectionHtml);
  console.log('Replaced bulky top section with clean, compact Atelier dock!');
} else {
  console.error('Could not match old top section regex');
}

// 5. ADD toggleFilterDrawer GLOBAL FUNCTION
const toggleDrawerJs = `
    window.toggleFilterDrawer = function() {
      const drawer = document.getElementById('dockFilterDrawer');
      const btn = document.getElementById('btnToggleSmartFilter');
      const chevron = document.getElementById('filterChevron');
      if (!drawer) return;
      const isOpen = drawer.style.display !== 'none';
      if (isOpen) {
        drawer.style.display = 'none';
        btn.classList.remove('active');
        if (chevron) chevron.textContent = '▾';
      } else {
        drawer.style.display = 'flex';
        btn.classList.add('active');
        if (chevron) chevron.textContent = '▴';
      }
    };
`;

content = content.replace('window.scrollSectionTrack =', toggleDrawerJs + '\n    window.scrollSectionTrack =');

fs.writeFileSync(tplPath, content, 'utf8');
console.log('templates.html successfully updated with ultra-clean UI and 100% FREE labels!');
