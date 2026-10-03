const fs = require('fs');

let html = fs.readFileSync('templates.html', 'utf8');

// 1. UPDATE PAGE HERO CSS & REMOVE DUPLICATE OLD SEARCH/PILL STYLES
const oldHeroCss = `    /* ─── 3. PAGE HERO ─── */
    .page-hero {
      max-width: 1100px;
      margin: 0 auto;
      padding: 24px 16px 14px;
    }
    .hero-eyebrow {
      font-size: 11.5px;
      font-weight: 800;
      color: var(--rose-gold);
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 6px;
      display: block;
    }
    .hero-heading {
      font-family: var(--font-serif);
      font-size: clamp(2rem, 4.8vw, 3rem);
      font-weight: 700;
      line-height: 1.15;
      color: var(--text-dark);
      margin-bottom: 8px;
      letter-spacing: -0.3px;
    }
    .hero-heading em {
      font-style: italic;
      color: var(--rose-gold);
    }
    .hero-subtitle {
      font-size: 13.5px;
      color: var(--text-muted);
      line-height: 1.5;
      max-width: 580px;
      margin-bottom: 20px;
    }`;

const newHeroCss = `    /* ─── 3. PAGE HERO (COMPACT & AIRY) ─── */
    .page-hero {
      max-width: 1140px;
      margin: 0 auto;
      padding: 14px 16px 8px;
    }
    @media (min-width: 768px) {
      .page-hero {
        padding: 20px 20px 10px;
      }
    }
    .hero-eyebrow {
      font-size: 11px;
      font-weight: 800;
      color: var(--rose-gold);
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 4px;
      display: block;
    }
    .hero-heading {
      font-family: var(--font-serif);
      font-size: clamp(1.85rem, 4vw, 2.75rem);
      font-weight: 700;
      line-height: 1.15;
      color: var(--text-dark);
      margin-bottom: 6px;
      letter-spacing: -0.3px;
    }
    .hero-heading em {
      font-style: italic;
      color: var(--rose-gold);
    }
    .hero-subtitle {
      font-size: 12.5px;
      color: var(--text-muted);
      line-height: 1.45;
      max-width: 600px;
      margin-bottom: 12px;
    }`;

if (html.includes(oldHeroCss)) {
  html = html.replace(oldHeroCss, newHeroCss);
  console.log('Updated page-hero CSS');
} else {
  console.log('Could not find exact oldHeroCss, trying regex');
}

// 2. REMOVE OLD DUPLICATE SEARCH, FILTER & PILL STYLES THAT WERE HARDCODING 1.5px BORDERS
const oldSearchCssRegex = /\/\* ─── 4\. SEARCH & FILTER TRIGGER BAR ─── \*\/[\s\S]*?\.active-filters-row \{/m;
const newSearchBridgeCss = `/* ─── 4. SEARCH & FILTER CONTROLS ─── */
    /* Base styles loaded from css/vanvi-template-cards.css */
    .search-clear-btn {
      background: transparent;
      border: none;
      color: var(--text-light);
      font-size: 14px;
      cursor: pointer;
      padding: 4px;
      display: none;
    }

    .active-filters-row {`;

if (oldSearchCssRegex.test(html)) {
  html = html.replace(oldSearchCssRegex, newSearchBridgeCss);
  console.log('Replaced old search and pill duplicate styles');
} else {
  console.log('Search CSS regex mismatch');
}

// 3. UPDATE CARDS-RAIL AND RAIL-CARD-WRAPPER TO COMPACT SIZING & EDGE FADE
const oldRailCssRegex = /\/\* Rail Carousel \(Smooth Horizontal Swipe with Peek\) \*\/[\s\S]*?\.filter-results-grid \{/m;
const newRailCss = `/* Rail Carousel (Smooth Horizontal Swipe with Subtle Peek & Edge Mask) */
    .cards-rail {
      display: flex;
      gap: 10px;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      -webkit-overflow-scrolling: touch;
      padding: 4px 2px 14px;
      scrollbar-width: none;
      mask-image: linear-gradient(to right, black 88%, transparent 100%);
      -webkit-mask-image: linear-gradient(to right, black 88%, transparent 100%);
    }
    .cards-rail::-webkit-scrollbar {
      display: none;
    }
    @media (min-width: 768px) {
      .cards-rail {
        gap: 14px;
        mask-image: linear-gradient(to right, black 95%, transparent 100%);
        -webkit-mask-image: linear-gradient(to right, black 95%, transparent 100%);
      }
    }
    .rail-card-wrapper {
      flex: 0 0 205px;
      width: 205px;
      scroll-snap-align: start;
    }
    @media (min-width: 768px) {
      .rail-card-wrapper {
        flex: 0 0 236px;
        width: 236px;
      }
    }

    /* Filter Grid Mode (Shown when searching/filtering) */
    .filter-results-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      padding-bottom: 24px;
    }
    @media (min-width: 640px) {
      .filter-results-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 14px;
      }
    }
    @media (min-width: 1024px) {
      .filter-results-grid {
        grid-template-columns: repeat(4, 1fr);
        gap: 18px;
      }
    }`;

// Look for lines 414-458
const oldRailBlock = `    /* Rail Carousel (Smooth Horizontal Swipe with Peek) */
    .cards-rail {
      display: flex;
      gap: 14px;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      -webkit-overflow-scrolling: touch;
      padding: 4px 2px 14px;
      scrollbar-width: none;
    }
    .cards-rail::-webkit-scrollbar {
      display: none;
    }
    .rail-card-wrapper {
      flex: 0 0 248px;
      width: 248px;
      scroll-snap-align: start;
    }
    @media (min-width: 768px) {
      .rail-card-wrapper {
        flex: 0 0 268px;
        width: 268px;
      }
    }

    /* Filter Grid Mode (Shown when searching/filtering) */
    .filter-results-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      padding-bottom: 24px;
    }
    @media (min-width: 768px) {
      .filter-results-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 18px;
      }
    }
    @media (min-width: 1024px) {
      .filter-results-grid {
        grid-template-columns: repeat(4, 1fr);
        gap: 22px;
      }
    }`;

if (html.includes(oldRailBlock)) {
  html = html.replace(oldRailBlock, newRailCss);
  console.log('Replaced old rail and grid CSS with compact boutique styles');
} else {
  console.log('Could not match exact oldRailBlock, checking regex');
}

// 4. REMOVE OLD DUPLICATE CARD STYLES (LINES 459-688) THAT OVERRODE VANVI-TEMPLATE-CARDS.CSS
const oldCardDuplicateRegex = /\/\* ─── 6\. MASTER TEMPLATE CARD ARCHITECTURE ─── \*\/[\s\S]*?\/\* ─── 8\. SMART FILTER DRAWER/m;
const newDrawerOnlyTransition = `/* Master card styles loaded from css/vanvi-template-cards.css */

    /* ─── 8. SMART FILTER DRAWER`;

if (oldCardDuplicateRegex.test(html)) {
  html = html.replace(oldCardDuplicateRegex, newDrawerOnlyTransition);
  console.log('Successfully removed old duplicate card CSS block!');
} else {
  console.log('Could not match oldCardDuplicateRegex');
}

// 5. UPDATE HTML TO USE THE NEW ATELIER FILTER HUB WITH CLEAN SEGMENT TABS
const oldHtmlFilterStrips = `    <!-- Quick Occasions Horizontal Scroll Strip -->
    <nav class="quick-occasions-strip" id="quickOccasionsStrip" aria-label="Quick Categories">
      <button type="button" id="quick-cat-all" class="quick-cat-pill active" data-cat="all" onclick="selectQuickCategory('all')">✨ All Moments</button>
      <button type="button" id="quick-cat-birthday" class="quick-cat-pill" data-cat="birthday" onclick="selectQuickCategory('birthday')">🎂 Birthday</button>
      <button type="button" id="quick-cat-love" class="quick-cat-pill" data-cat="love" onclick="selectQuickCategory('love')">💖 Love</button>
      <button type="button" id="quick-cat-anniversary" class="quick-cat-pill" data-cat="anniversary" onclick="selectQuickCategory('anniversary')">💍 Anniversary</button>
      <button type="button" id="quick-cat-friendship" class="quick-cat-pill" data-cat="friendship" onclick="selectQuickCategory('friendship')">👯 Friendship</button>
      <button type="button" id="quick-cat-apology" class="quick-cat-pill" data-cat="apology" onclick="selectQuickCategory('apology')">🕊️ Apology</button>
      <button type="button" id="quick-cat-family" class="quick-cat-pill" data-cat="family" onclick="selectQuickCategory('family')">👨‍👩‍👦 Family</button>
      <button type="button" id="quick-cat-memories" class="quick-cat-pill" data-cat="memories" onclick="selectQuickCategory('memories')">📸 Memories</button>
      <button type="button" id="quick-cat-free" class="quick-cat-pill" data-cat="free" onclick="selectQuickCategory('free')">🎁 100% Free</button>
      <button type="button" id="quick-cat-premium" class="quick-cat-pill" data-cat="premium" onclick="selectQuickCategory('premium')">👑 VIP Signature</button>
    </nav>

    <!-- Secondary Compact Price / Budget Filter Strip -->
    <div class="quick-price-strip" id="quickPriceStrip" aria-label="Budget Filters">
      <button type="button" class="quick-price-chip active" data-price="all" onclick="selectFilter('price', 'all')">✨ All Budgets</button>
      <button type="button" class="quick-price-chip" data-price="free" onclick="selectFilter('price', 'free')">🎁 Free (₹0)</button>
      <button type="button" class="quick-price-chip" data-price="under99" onclick="selectFilter('price', 'under99')">⚡ Under ₹99</button>
      <button type="button" class="quick-price-chip" data-price="99to299" onclick="selectFilter('price', '99to299')">🔥 Popular (₹99–₹299)</button>
      <button type="button" class="quick-price-chip" data-price="499plus" onclick="selectFilter('price', '499plus')">👑 VIP Signature (₹499+)</button>
    </div>`;

const newHtmlFilterStrips = `    <!-- Smart Segmented Filter Tabs: Occasions vs Price -->
    <div class="atelier-filter-hub">
      <div class="filter-segment-tabs">
        <button type="button" class="filter-segment-btn active" id="tabOccasions" onclick="switchFilterSegment('occasions')">
          <span>✨ Curated Occasions</span>
        </button>
        <button type="button" class="filter-segment-btn" id="tabBudgets" onclick="switchFilterSegment('budgets')">
          <span>💎 Filter by Budget</span>
          <span class="segment-active-dot" id="budgetActiveDot" style="display:none; width:6px; height:6px; background:#ff2a7a; border-radius:50%; margin-left:3px;"></span>
        </button>
      </div>

      <!-- Quick Occasions Horizontal Scroll Strip -->
      <nav class="quick-occasions-strip" id="quickOccasionsStrip" aria-label="Quick Categories">
        <button type="button" id="quick-cat-all" class="quick-cat-pill active" data-cat="all" onclick="selectQuickCategory('all')">✨ All Moments</button>
        <button type="button" id="quick-cat-birthday" class="quick-cat-pill" data-cat="birthday" onclick="selectQuickCategory('birthday')">🎂 Birthday</button>
        <button type="button" id="quick-cat-love" class="quick-cat-pill" data-cat="love" onclick="selectQuickCategory('love')">💖 Love</button>
        <button type="button" id="quick-cat-anniversary" class="quick-cat-pill" data-cat="anniversary" onclick="selectQuickCategory('anniversary')">💍 Anniversary</button>
        <button type="button" id="quick-cat-friendship" class="quick-cat-pill" data-cat="friendship" onclick="selectQuickCategory('friendship')">👯 Friendship</button>
        <button type="button" id="quick-cat-apology" class="quick-cat-pill" data-cat="apology" onclick="selectQuickCategory('apology')">🕊️ Apology</button>
        <button type="button" id="quick-cat-family" class="quick-cat-pill" data-cat="family" onclick="selectQuickCategory('family')">👨‍👩‍👦 Family</button>
        <button type="button" id="quick-cat-memories" class="quick-cat-pill" data-cat="memories" onclick="selectQuickCategory('memories')">📸 Memories</button>
        <button type="button" id="quick-cat-free" class="quick-cat-pill" data-cat="free" onclick="selectQuickCategory('free')">🎁 100% Free</button>
        <button type="button" id="quick-cat-premium" class="quick-cat-pill" data-cat="premium" onclick="selectQuickCategory('premium')">👑 VIP Signature</button>
      </nav>

      <!-- Secondary Compact Price / Budget Filter Strip (Cleanly Toggled) -->
      <div class="quick-price-strip" id="quickPriceStrip" aria-label="Budget Filters" style="display:none;">
        <button type="button" class="quick-price-chip active" data-price="all" onclick="selectFilter('price', 'all')">✨ All Budgets</button>
        <button type="button" class="quick-price-chip" data-price="free" onclick="selectFilter('price', 'free')">🎁 Free (₹0)</button>
        <button type="button" class="quick-price-chip" data-price="under99" onclick="selectFilter('price', 'under99')">⚡ Under ₹99</button>
        <button type="button" class="quick-price-chip" data-price="99to299" onclick="selectFilter('price', '99to299')">🔥 Popular (₹99–₹299)</button>
        <button type="button" class="quick-price-chip" data-price="499plus" onclick="selectFilter('price', '499plus')">👑 VIP Signature (₹499+)</button>
      </div>
    </div>`;

if (html.includes(oldHtmlFilterStrips)) {
  html = html.replace(oldHtmlFilterStrips, newHtmlFilterStrips);
  console.log('Replaced filter markup with clean atelier segmented hub');
} else {
  console.log('Could not find oldHtmlFilterStrips');
}

// 6. ADD switchFilterSegment FUNCTION TO JS IN TEMPLATES.HTML
const jsTarget = `      window.selectQuickCategory = function (catId) {`;
const newJsBlock = `      window.switchFilterSegment = function (seg) {
        const occasionsStrip = document.getElementById('quickOccasionsStrip');
        const priceStrip = document.getElementById('quickPriceStrip');
        const tabOccasions = document.getElementById('tabOccasions');
        const tabBudgets = document.getElementById('tabBudgets');

        if (seg === 'budgets') {
          if (occasionsStrip) occasionsStrip.style.display = 'none';
          if (priceStrip) priceStrip.style.display = 'flex';
          if (tabOccasions) tabOccasions.classList.remove('active');
          if (tabBudgets) tabBudgets.classList.add('active');
        } else {
          if (occasionsStrip) occasionsStrip.style.display = 'flex';
          if (priceStrip) priceStrip.style.display = 'none';
          if (tabOccasions) tabOccasions.classList.add('active');
          if (tabBudgets) tabBudgets.classList.remove('active');
        }
      };

      window.selectQuickCategory = function (catId) {`;

if (html.includes(jsTarget)) {
  html = html.replace(jsTarget, newJsBlock);
  console.log('Added switchFilterSegment to templates.html script');
} else {
  console.log('Could not find jsTarget');
}

fs.writeFileSync('templates.html', html, 'utf8');
console.log('templates.html written successfully.');
