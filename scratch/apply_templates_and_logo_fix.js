const fs = require('fs');
const path = require('path');

function log(msg) {
  console.log('[FIX]', msg);
}

// -------------------------------------------------------------
// 1. UPDATE templates.html
// -------------------------------------------------------------
let tplPath = path.resolve('templates.html');
let tpl = fs.readFileSync(tplPath, 'utf8');

// A. Restore pure SVG & Cormorant Garamond typography logo in navbar and remove ‹ Back & Choose Template
const oldNavBrandAndActionsRegex = /<a href="index\.html" class="nav-brand-static"[\s\S]*?<\/div>\s*<\/div>/;
const newNavBrandAndActions = `<a href="index.html" class="nav-brand-static" title="Vanvi Moments Keepsake Atelier" style="display:inline-flex; align-items:center; gap:9px; text-decoration:none;">
        <svg viewBox="0 0 26 26" fill="none" style="width:24px; height:24px; flex-shrink:0;">
          <defs>
            <linearGradient id="tplLogoSpark" x1="0%" x2="100%" y1="0%" x2="100%">
              <stop offset="0%" stop-color="#ff2a7a"/>
              <stop offset="50%" stop-color="#ff7ea5"/>
              <stop offset="100%" stop-color="#9333ea"/>
            </linearGradient>
          </defs>
          <path d="M13 2 C13 7.8 15.2 10 21 13 C15.2 16 13 18.2 13 24 C13 18.2 10.8 16 5 13 C10.8 10 13 7.8 13 2 Z" fill="url(#tplLogoSpark)"/>
          <circle cx="13" cy="13" r="2.8" fill="#ffffff"/>
          <circle cx="13" cy="13" r="1.5" fill="#ff2a7a"/>
        </svg>
        <span style="font-family:'Cormorant Garamond', Georgia, serif; font-size:19px; font-weight:800; letter-spacing:-0.2px; background:linear-gradient(135deg, #2c1224 0%, #ff2a7a 60%, #9333ea 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; filter:drop-shadow(0 1px 1px rgba(0,0,0,0.05));">Vanvi Moments<span style="color:#ff2a7a; -webkit-text-fill-color:#ff2a7a; font-family:'Plus Jakarta Sans',sans-serif; font-size:11px; vertical-align:super; margin-left:3px;">✦</span></span>
      </a>
      <div class="nav-pill-actions">
        <a href="index.html" class="nav-link-item">Home</a>
        <a href="custom-experience.html" class="nav-link-item">Bespoke</a>
      </div>
    </div>`;

if (oldNavBrandAndActionsRegex.test(tpl)) {
  tpl = tpl.replace(oldNavBrandAndActionsRegex, newNavBrandAndActions);
  log('Replaced templates.html navbar logo & actions cleanly');
} else {
  console.warn('Could not match navbar in templates.html');
}

// B. Search & filter markup update
const oldSearchFilterRowRegex = /<!-- 3\. Smart Search & Filter Controls -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
const newSearchFilterRow = `<!-- 3. Smart Search & Filter Controls -->
    <div class="search-filter-row">
      <div class="search-box-wrap">
        <div class="search-box" id="searchBoxContainer">
          <span class="search-icon">🔍</span>
          <input type="search" id="searchInput" class="search-input" placeholder="Search candles, love letters, songs, birthday, magazine..." aria-label="Search celebration templates" autocomplete="off" />
          <span id="searchResultPill" style="display:none; font-size:11px; font-weight:800; background:rgba(255,42,122,0.12); color:#ff2a7a; padding:2px 8px; border-radius:99px; white-space:nowrap; margin-right:4px;"></span>
          <button type="button" id="searchClear" class="search-clear-btn" aria-label="Clear search">✕</button>
        </div>

        <!-- Smart Instant Quick Searches (Fast, 1-tap shortcuts) -->
        <div class="quick-search-tags-row" id="quickSearchTagsRow">
          <span style="font-size:10.5px; font-weight:800; color:var(--text-muted); white-space:nowrap;">⚡ Quick Search:</span>
          <button type="button" class="quick-tag-chip" onclick="applySearchTag('birthday')">🎂 Birthday</button>
          <button type="button" class="quick-tag-chip" onclick="applySearchTag('love')">💌 Love Letter</button>
          <button type="button" class="quick-tag-chip" onclick="applySearchTag('candle')">🕯️ Candle Cake</button>
          <button type="button" class="quick-tag-chip" onclick="applySearchTag('magazine')">📖 E-Magazine</button>
          <button type="button" class="quick-tag-chip" onclick="applySearchTag('anniversary')">💍 Anniversary</button>
          <button type="button" class="quick-tag-chip" onclick="applySearchTag('vip')">👑 ₹700+ VIP</button>
        </div>
      </div>

      <!-- Controls Group (Smart Filter + Sort + View Mode) -->
      <div class="filter-controls-group">
        <!-- Premium Smart Filter Trigger Button -->
        <button type="button" class="btn-smart-filter-trigger" id="btnSmartFilterTrigger" onclick="openFilterDrawer()" title="Open Smart Filters">
          <span class="sf-icon">🎛️</span>
          <span class="sf-label">Filter</span>
          <span class="sf-badge">✦</span>
          <span id="activeFilterBadge" style="display:none; background:#ffffff; color:#ff2a7a; font-size:10px; font-weight:900; border-radius:99px; padding:0 6px; margin-left:2px;"></span>
        </button>

        <!-- Smart Sort Dropdown -->
        <div class="sort-select-box">
          <select id="quickSortSelect" class="btn-sort-select" onchange="selectFilter('sort', this.value)" title="Sort templates" aria-label="Sort templates">
            <option value="recommended">✦ Recommended</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low (₹700+ first)</option>
            <option value="popular">Most Popular 🔥</option>
            <option value="newest">Newest Releases</option>
          </select>
        </div>

        <!-- View Mode Toggle -->
        <div class="view-mode-toggle" id="viewModeToggle" role="group" aria-label="Card View Layout">
          <button type="button" class="btn-view-mode active" id="btnViewGrid" onclick="switchCardViewMode('grid')" title="2-Column Boutique Grid View">
            <span>⊞</span>
          </button>
          <button type="button" class="btn-view-mode" id="btnViewMag" onclick="switchCardViewMode('magazine')" title="1-Column Full Magazine View">
            <span>▯</span>
          </button>
        </div>
      </div>
    </div>`;

if (oldSearchFilterRowRegex.test(tpl)) {
  tpl = tpl.replace(oldSearchFilterRowRegex, newSearchFilterRow);
  log('Replaced templates.html search & filter row markup cleanly');
} else {
  console.warn('Could not match search filter row in templates.html');
}

// C. Quick Occasions Strip - remove atelier-filter-hub wrapper if present
if (tpl.includes('<div class="atelier-filter-hub">')) {
  tpl = tpl.replace('<div class="atelier-filter-hub">\n      <nav class="quick-occasions-strip"', '<nav class="quick-occasions-strip"');
  tpl = tpl.replace('</nav>\n    </div>\n\n    <!-- Active Filters', '</nav>\n\n    <!-- Active Filters');
  log('Unwrapped quickOccasionsStrip from atelier-filter-hub');
}

// D. CSS refinement for search-filter-row, filter-controls-group, buttons, and quick-occasions-strip
const oldCssBlockRegex = /\.search-filter-row\s*\{[\s\S]*?\.quick-occasions-strip\s*\{[\s\S]*?overflow-x:\s*auto;[\s\S]*?\}/;
const newCssBlock = `.search-filter-row {
      display: flex;
      gap: 12px;
      align-items: flex-start;
      flex-wrap: wrap;
      margin-bottom: 12px;
      width: 100%;
    }
    .search-box-wrap {
      flex: 1 1 320px;
      min-width: 250px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .search-box {
      width: 100%;
      min-width: 0;
      display: flex;
      align-items: center;
      background: #ffffff;
      border: 1.5px solid rgba(255, 120, 175, 0.35);
      border-radius: 99px;
      padding: 0 14px;
      height: 40px;
      box-shadow: 0 3px 12px rgba(44, 18, 36, 0.04);
      transition: all 0.22s ease;
    }
    .search-box:focus-within {
      border-color: #ff2a7a;
      box-shadow: 0 5px 18px rgba(255, 42, 122, 0.2);
    }
    .search-icon {
      font-size: 14px;
      margin-right: 8px;
      color: #ff2a7a;
      display: flex;
      align-items: center;
      flex-shrink: 0;
    }
    .search-input {
      flex: 1;
      min-width: 0;
      border: none;
      background: transparent;
      outline: none;
      font-size: 13px;
      font-family: inherit;
      color: var(--text-dark);
    }
    .search-clear-btn {
      background: rgba(255, 42, 122, 0.1);
      border: none;
      color: #ff2a7a;
      font-size: 11px;
      font-weight: 800;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      cursor: pointer;
      display: none;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      flex-shrink: 0;
    }
    .search-clear-btn:hover {
      background: #ff2a7a;
      color: #ffffff;
    }
    .quick-search-tags-row {
      display: flex;
      align-items: center;
      gap: 6px;
      overflow-x: auto;
      padding: 2px 2px;
      scrollbar-width: none;
      -webkit-overflow-scrolling: touch;
      scroll-behavior: smooth;
    }
    .quick-search-tags-row::-webkit-scrollbar {
      display: none;
    }
    .quick-tag-chip {
      background: #fff5f8;
      border: 1px solid rgba(255, 120, 175, 0.25);
      border-radius: 99px;
      padding: 3px 10px;
      font-size: 11px;
      font-weight: 750;
      color: #5c2443;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s;
      flex-shrink: 0;
    }
    .quick-tag-chip:hover {
      background: #ff2a7a;
      color: #ffffff;
      border-color: #ff2a7a;
      transform: translateY(-1px);
    }

    /* ─── Controls Group (Smart Filter + Sort + View Mode) ─── */
    .filter-controls-group {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      flex-wrap: nowrap;
      flex-shrink: 0;
    }
    @media (max-width: 640px) {
      .filter-controls-group {
        width: 100%;
        display: flex;
        justify-content: space-between;
      }
      .filter-controls-group .btn-smart-filter-trigger {
        flex: 1 1 auto;
        justify-content: center;
      }
      .filter-controls-group .sort-select-box {
        flex: 1.2 1 auto;
      }
      .filter-controls-group .btn-sort-select {
        width: 100%;
      }
    }

    /* ─── Premium Smart Filter Button (3D Clay Tactile) ─── */
    .btn-smart-filter-trigger {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      background: linear-gradient(135deg, #ff2a7a 0%, #e11d68 45%, #9333ea 100%);
      color: #ffffff !important;
      border: 1.5px solid rgba(255, 255, 255, 0.7);
      border-radius: 99px;
      height: 40px;
      padding: 0 16px;
      font-size: 12.5px;
      font-weight: 850;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(255, 42, 122, 0.32), inset 0 2px 2px rgba(255, 255, 255, 0.65), inset 0 -2px 3px rgba(0, 0, 0, 0.15);
      transition: filter 0.2s ease, box-shadow 0.2s ease;
      white-space: nowrap;
      user-select: none;
      flex-shrink: 0;
    }
    .btn-smart-filter-trigger:hover {
      filter: brightness(1.08);
      box-shadow: 0 8px 22px rgba(255, 42, 122, 0.46), inset 0 2px 2px rgba(255, 255, 255, 0.85);
      transform: none !important;
    }
    .btn-smart-filter-trigger:active {
      opacity: 0.94;
      box-shadow: 0 2px 8px rgba(255, 42, 122, 0.3), inset 0 2px 4px rgba(0, 0, 0, 0.2);
    }
    .btn-smart-filter-trigger .sf-badge {
      font-size: 10px;
      color: #fde047;
    }

    .sort-select-box {
      flex-shrink: 0;
    }
    .btn-sort-select {
      background: #ffffff;
      border: 1.5px solid rgba(255, 120, 175, 0.35);
      border-radius: 99px;
      height: 40px;
      padding: 0 14px;
      font-size: 12px;
      font-weight: 800;
      color: #2c1224;
      outline: none;
      cursor: pointer;
      box-shadow: 0 3px 10px rgba(44, 18, 36, 0.04), inset 0 1px 0 #ffffff;
      transition: all 0.2s ease;
      font-family: inherit;
    }
    .btn-sort-select:hover, .btn-sort-select:focus {
      border-color: #ff2a7a;
      box-shadow: 0 5px 16px rgba(255, 42, 122, 0.18);
    }

    /* ─── Colorful Luxury Category Filter Pills (Smooth Horizontal Touch Strip) ─── */
    .quick-occasions-strip {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding: 6px 2px 14px;
      scrollbar-width: none;
      -webkit-overflow-scrolling: touch;
      scroll-behavior: smooth;
      width: 100%;
    }`;

if (oldCssBlockRegex.test(tpl)) {
  tpl = tpl.replace(oldCssBlockRegex, newCssBlock);
  log('Updated search filter and quick occasions CSS in templates.html');
} else {
  console.warn('Could not match CSS block in templates.html');
}

// E. In renderTemplateCard: remove vanvi-brand-corner-badge and restore card-badge-top-left
const oldCardCornerBadgeRegex = /<div class="vanvi-brand-corner-badge" title="Vanvi Moments Original">\s*<img src="assets\/vanvi-moments-official-logo\.png" alt="Vanvi Moments" class="brand-badge-img" loading="lazy">\s*<\/div>/g;
tpl = tpl.replace(oldCardCornerBadgeRegex, '<span class="card-badge-top-left">${escapeHtml(catBadge)}</span>');

// F. In card-actions-grid: ensure clean Preview and Create buttons
const oldCardActionsRegex = /<div class="card-actions-grid">\s*<a href="templates\/\$\{t\.id\}\/preview\.html" class="btn-take-look"[\s\S]*?<\/div>/;
const newCardActions = `<div class="card-actions-grid">
                <a href="preview.html?template=\${safeId}" class="btn-take-look" title="Preview \${escapeHtml(t.name)}">
                  <span>Preview</span>
                </a>
                <a href="builder.html?template=\${safeId}&occasion=\${safeOccasion}" class="btn-make-yours" title="Create \${escapeHtml(t.name)}">
                  <span class="btn-text-full">Create Moment ✦</span>
                  <span class="btn-text-short">Create ✦</span>
                </a>
              </div>`;
if (oldCardActionsRegex.test(tpl)) {
  tpl = tpl.replace(oldCardActionsRegex, newCardActions);
  log('Updated card-actions-grid in templates.html to use safeId and standard paths');
}

// G. Remove trailing safeGoBack script at bottom
const trailingSafeGoBackRegex = /<script>\s*function safeGoBack\(\)[\s\S]*?<\/script>\s*<\/body>/;
if (trailingSafeGoBackRegex.test(tpl)) {
  tpl = tpl.replace(trailingSafeGoBackRegex, '</body>');
  log('Removed trailing safeGoBack script from templates.html');
}

fs.writeFileSync(tplPath, tpl, 'utf8');
log('templates.html saved successfully');

// -------------------------------------------------------------
// 2. UPDATE js/vanvi-templates-data.js
// -------------------------------------------------------------
let jsDataPath = path.resolve('js/vanvi-templates-data.js');
let jsData = fs.readFileSync(jsDataPath, 'utf8');
if (jsData.includes('assets/vanvi-moments-official-logo.png')) {
  jsData = jsData.replace(
    /<div class="vanvi-brand-corner-badge" title="Vanvi Moments Original">\s*<img src="assets\/vanvi-moments-official-logo\.png" alt="Vanvi Moments" class="brand-badge-img" loading="lazy">\s*<\/div>/g,
    '<span class="card-badge-top-left">${escapeHtml(catBadge)}</span>'
  );
  fs.writeFileSync(jsDataPath, jsData, 'utf8');
  log('vanvi-templates-data.js updated: replaced logo badge with category badge');
}

// -------------------------------------------------------------
// 3. UPDATE index.html
// -------------------------------------------------------------
let indexPath = path.resolve('index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');
if (indexHtml.includes('assets/vanvi-moments-official-logo.png')) {
  indexHtml = indexHtml.replace(
    /\s*<div class="vanvi-brand-corner-badge" title="Vanvi Moments Original">\s*<img src="assets\/vanvi-moments-official-logo\.png" alt="Vanvi Moments" class="brand-badge-img" loading="lazy">\s*<\/div>/g,
    ''
  );
  fs.writeFileSync(indexPath, indexHtml, 'utf8');
  log('index.html updated: removed all vanvi-brand-corner-badge image logo badges');
}

// -------------------------------------------------------------
// 4. UPDATE dashboard.html
// -------------------------------------------------------------
let dashPath = path.resolve('dashboard.html');
let dashHtml = fs.readFileSync(dashPath, 'utf8');
if (dashHtml.includes('assets/vanvi-moments-official-logo.png')) {
  dashHtml = dashHtml.replace(
    /<div style="width:34px; height:34px; border-radius:11px; background:linear-gradient\(135deg, #ffffff 0%, #fff0f5 100%\); border:1\.5px solid rgba\(255,120,175,0\.45\); box-shadow:0 3px 10px rgba\(255,42,122,0\.18\), inset 0 1px 1px #fff; display:flex; align-items:center; justify-content:center; overflow:hidden; padding:2px; flex-shrink:0;">\s*<img src="assets\/vanvi-moments-official-logo\.png" alt="Vanvi Moments" style="width:100%; height:100%; object-fit:contain; filter:drop-shadow\(0 1px 3px rgba\(0,0,0,0\.06\)\);" \/>\s*<\/div>/,
    `<svg viewBox="0 0 26 26" fill="none" class="brand-spark" style="width:26px; height:26px; flex-shrink:0;">
      <defs>
        <linearGradient id="navSparkGrad" x1="0%" x2="100%" y1="0%" x2="100%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="35%" stop-color="#ff6bb5"/>
          <stop offset="70%" stop-color="#c084fc"/>
          <stop offset="100%" stop-color="#38bdf8"/>
        </linearGradient>
      </defs>
      <path d="M13 2 C13 7.8 15.2 10 21 13 C15.2 16 13 18.2 13 24 C13 18.2 10.8 16 5 13 C10.8 10 13 7.8 13 2 Z" fill="url(#navSparkGrad)"/>
      <circle cx="13" cy="13" r="2.8" fill="#ffffff"/>
      <circle cx="13" cy="13" r="1.5" fill="#ff007a"/>
    </svg>`
  );
  fs.writeFileSync(dashPath, dashHtml, 'utf8');
  log('dashboard.html updated: restored brand-spark SVG');
}

// -------------------------------------------------------------
// 5. UPDATE profile.html
// -------------------------------------------------------------
let profPath = path.resolve('profile.html');
let profHtml = fs.readFileSync(profPath, 'utf8');
if (profHtml.includes('assets/vanvi-moments-official-logo.png')) {
  profHtml = profHtml.replace(
    /<div style="width:36px; height:36px; border-radius:12px; background:linear-gradient\(135deg, #ffffff 0%, #fff0f5 100%\); border:1\.5px solid var\(--border-pink\); box-shadow:0 3px 10px rgba\(255,42,122,0\.18\), inset 0 1px 1px #fff; display:flex; align-items:center; justify-content:center; overflow:hidden; padding:3px; flex-shrink:0;">\s*<img src="assets\/vanvi-moments-official-logo\.png" alt="Vanvi Moments" style="width:100%; height:100%; object-fit:contain; filter:drop-shadow\(0 1px 3px rgba\(0,0,0,0\.06\)\);">\s*<\/div>/,
    `<svg class="brand-spark" fill="none" viewBox="0 0 26 26" style="width:26px; height:26px; flex-shrink:0;">
        <defs>
          <linearGradient id="profSpark" x1="0%" x2="100%" y1="0%" x2="100%">
            <stop offset="0%" stop-color="#ff2a7a"/>
            <stop offset="50%" stop-color="#ff7ea5"/>
            <stop offset="100%" stop-color="#d97706"/>
          </linearGradient>
        </defs>
        <path d="M13 2 C13 7.8 15.2 10 21 13 C15.2 16 13 18.2 13 24 C13 18.2 10.8 16 5 13 C10.8 10 13 7.8 13 2 Z" fill="url(#profSpark)"/>
        <circle cx="13" cy="13" fill="#ffffff" r="2.8"/>
        <circle cx="13" cy="13" fill="#ff2a7a" r="1.5"/>
      </svg>`
  );
  fs.writeFileSync(profPath, profHtml, 'utf8');
  log('profile.html updated: restored brand-spark SVG');
}

// -------------------------------------------------------------
// 6. UPDATE refer.html
// -------------------------------------------------------------
let refPath = path.resolve('refer.html');
let refHtml = fs.readFileSync(refPath, 'utf8');
if (refHtml.includes('assets/vanvi-moments-official-logo.png')) {
  refHtml = refHtml.replace(
    /<div style="width:34px; height:34px; border-radius:11px; background:linear-gradient\(135deg, #ffffff 0%, #fff0f5 100%\); border:1\.5px solid rgba\(255,120,175,0\.45\); box-shadow:0 3px 10px rgba\(255,42,122,0\.18\), inset 0 1px 1px #fff; display:flex; align-items:center; justify-content:center; overflow:hidden; padding:2px; flex-shrink:0;">\s*<img src="assets\/vanvi-moments-official-logo\.png" alt="Vanvi Moments" style="width:100%; height:100%; object-fit:contain; filter:drop-shadow\(0 1px 3px rgba\(0,0,0,0\.06\)\);" \/>\s*<\/div>/,
    `<svg class="brand-spark" fill="none" viewBox="0 0 26 26" style="width:26px; height:26px; flex-shrink:0;">
        <defs>
          <linearGradient id="refSpark" x1="0%" x2="100%" y1="0%" x2="100%">
            <stop offset="0%" stop-color="#ff2a7a"/>
            <stop offset="50%" stop-color="#ff7ea5"/>
            <stop offset="100%" stop-color="#d97706"/>
          </linearGradient>
        </defs>
        <path d="M13 2 C13 7.8 15.2 10 21 13 C15.2 16 13 18.2 13 24 C13 18.2 10.8 16 5 13 C10.8 10 13 7.8 13 2 Z" fill="url(#refSpark)"/>
        <circle cx="13" cy="13" fill="#ffffff" r="2.8"/>
        <circle cx="13" cy="13" fill="#ff2a7a" r="1.5"/>
      </svg>`
  );
  fs.writeFileSync(refPath, refHtml, 'utf8');
  log('refer.html updated: restored brand-spark SVG');
}

// -------------------------------------------------------------
// 7. UPDATE login.html, signup.html, forgot-password.html
// -------------------------------------------------------------
const authImgRegex = /<img src="assets\/vanvi-moments-official-logo\.png" alt="Vanvi Moments" style="width:24px; height:24px; object-fit:contain; border-radius:6px;" \/>/;
const authSvgReplacement = `<svg viewBox="0 0 26 26" fill="none" style="width:22px; height:22px; flex-shrink:0;">
        <defs>
          <linearGradient id="authSparkGrad" x1="0%" x2="100%" y1="0%" x2="100%">
            <stop offset="0%" stop-color="#ff2a7a"/>
            <stop offset="50%" stop-color="#ff7ea5"/>
            <stop offset="100%" stop-color="#9333ea"/>
          </linearGradient>
        </defs>
        <path d="M13 2 C13 7.8 15.2 10 21 13 C15.2 16 13 18.2 13 24 C13 18.2 10.8 16 5 13 C10.8 10 13 7.8 13 2 Z" fill="url(#authSparkGrad)"/>
        <circle cx="13" cy="13" r="2.8" fill="#ffffff"/>
        <circle cx="13" cy="13" r="1.5" fill="#ff2a7a"/>
      </svg>`;

['login.html', 'signup.html', 'forgot-password.html'].forEach(f => {
  let fp = path.resolve(f);
  if (fs.existsSync(fp)) {
    let content = fs.readFileSync(fp, 'utf8');
    if (content.includes('assets/vanvi-moments-official-logo.png')) {
      content = content.replace(authImgRegex, authSvgReplacement);
      fs.writeFileSync(fp, content, 'utf8');
      log(`${f} updated: replaced image logo with authSparkGrad SVG`);
    }
  }
});

log('ALL UPDATES COMPLETE!');
