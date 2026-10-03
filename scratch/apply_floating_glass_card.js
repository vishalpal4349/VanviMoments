const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const tplPath = path.join(ROOT, 'templates.html');

let content = fs.readFileSync(tplPath, 'utf8');

// 1. REFINED LUXURY CSS FOR FLOATING GLASS CAPSULE CARD
const capsuleCss = `
  /* ─── OPTION 2: FLOATING ATELIER GLASS CAPSULE (PINNACLE LUXURY) ─── */
  .tpl-luxury-card {
    background: #fff0f5 !important;
    border: 1px solid rgba(255, 120, 175, 0.22) !important;
    border-radius: 22px !important;
    overflow: hidden !important;
    position: relative !important;
    width: 100% !important;
    max-width: 100% !important;
    height: 380px !important;
    box-shadow: 0 6px 20px rgba(74, 41, 58, 0.06) !important;
    transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease, border-color 0.25s ease !important;
    cursor: pointer !important;
  }
  .tpl-luxury-card:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 14px 36px rgba(74, 41, 58, 0.14) !important;
    border-color: rgba(255, 42, 122, 0.45) !important;
  }

  /* Full-bleed Cover Visual Stage */
  .tpl-cover-stage {
    position: absolute !important;
    inset: 0 !important;
    width: 100% !important;
    height: 100% !important;
    overflow: hidden !important;
    border-radius: 22px !important;
  }
  .tpl-cover-img {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
    display: block !important;
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
  }
  .tpl-luxury-card:hover .tpl-cover-img {
    transform: scale(1.03) !important;
  }

  /* Deep Atmospheric Scrim behind capsule */
  .tpl-cover-gradient {
    position: absolute !important;
    inset: 0 !important;
    background: linear-gradient(180deg, transparent 40%, rgba(20, 8, 16, 0.25) 65%, rgba(20, 8, 16, 0.75) 100%) !important;
    pointer-events: none !important;
    z-index: 2 !important;
  }

  /* Floating Frosted Glass Capsule (Docked inside image) */
  .tpl-floating-capsule {
    position: absolute !important;
    bottom: 12px !important;
    left: 12px !important;
    right: 12px !important;
    background: rgba(255, 255, 255, 0.88) !important;
    backdrop-filter: blur(20px) !important;
    -webkit-backdrop-filter: blur(20px) !important;
    border: 1px solid rgba(255, 255, 255, 0.75) !important;
    border-radius: 16px !important;
    padding: 12px 14px !important;
    box-shadow: 0 8px 24px rgba(44, 18, 36, 0.15) !important;
    z-index: 5 !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 4px !important;
    box-sizing: border-box !important;
    transition: transform 0.2s ease, box-shadow 0.2s ease !important;
  }
  .tpl-luxury-card:hover .tpl-floating-capsule {
    background: rgba(255, 255, 255, 0.94) !important;
    box-shadow: 0 12px 30px rgba(255, 42, 122, 0.2) !important;
  }

  /* Capsule Header Row: Title on Left, Price on Right */
  .capsule-header-row {
    display: flex !important;
    align-items: baseline !important;
    justify-content: space-between !important;
    gap: 8px !important;
  }
  .capsule-title {
    font-family: 'Cormorant Garamond', Georgia, serif !important;
    font-size: 17.5px !important;
    font-weight: 700 !important;
    color: #2c1224 !important;
    margin: 0 !important;
    line-height: 1.2 !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    flex: 1 !important;
  }
  .capsule-price-val {
    font-family: 'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif !important;
    font-size: 15.5px !important;
    font-weight: 850 !important;
    color: #ff2a7a !important;
    white-space: nowrap !important;
  }
  .capsule-price-val.price-free {
    color: #059669 !important;
  }

  /* Capsule Description Line */
  .capsule-desc {
    font-size: 11.5px !important;
    color: #724c65 !important;
    line-height: 1.4 !important;
    margin: 0 0 8px !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }

  /* Dual Actions Row inside Capsule */
  .capsule-actions-row {
    display: flex !important;
    gap: 8px !important;
    align-items: center !important;
  }
  .btn-capsule-preview {
    flex: 1 !important;
    box-sizing: border-box !important;
    padding: 7px 10px !important;
    border-radius: 99px !important;
    font-size: 11.5px !important;
    font-weight: 750 !important;
    text-align: center !important;
    text-decoration: none !important;
    background: rgba(255, 255, 255, 0.75) !important;
    border: 1px solid rgba(255, 120, 175, 0.35) !important;
    color: #2c1224 !important;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03) !important;
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

  .btn-capsule-make {
    flex: 1.15 !important;
    box-sizing: border-box !important;
    padding: 8px 12px !important;
    border-radius: 99px !important;
    font-size: 11.5px !important;
    font-weight: 800 !important;
    text-align: center !important;
    text-decoration: none !important;
    background: linear-gradient(135deg, #ff2a7a 0%, #d97706 100%) !important;
    color: #ffffff !important;
    border: none !important;
    box-shadow: 0 3px 10px rgba(255, 42, 122, 0.32) !important;
    transition: all 0.2s ease !important;
    display: block !important;
    line-height: 1.2 !important;
    white-space: nowrap !important;
  }
  .btn-capsule-make:hover {
    transform: translateY(-1px) !important;
    box-shadow: 0 5px 16px rgba(255, 42, 122, 0.48) !important;
    color: #ffffff !important;
  }

  /* Slider track card width */
  .template-slider-track .tpl-luxury-card {
    width: 290px !important;
    flex-shrink: 0 !important;
  }

  /* Mobile responsiveness */
  @media (max-width: 480px) {
    .tpl-luxury-card {
      height: 350px !important;
    }
    .tpl-floating-capsule {
      left: 10px !important;
      right: 10px !important;
      bottom: 10px !important;
      padding: 10px 12px !important;
    }
    .capsule-title {
      font-size: 16px !important;
    }
    .btn-capsule-preview, .btn-capsule-make {
      font-size: 11px !important;
      padding: 7px 6px !important;
    }
    .template-slider-track .tpl-luxury-card {
      width: 260px !important;
    }
  }
  @media (max-width: 360px) {
    .tpl-luxury-card {
      height: 330px !important;
    }
    .template-slider-track .tpl-luxury-card {
      width: 240px !important;
    }
    .capsule-title {
      font-size: 15px !important;
    }
  }
`;

// Replace CSS
if (content.includes('/* ─── OPTION 2: FLOATING ATELIER GLASS CAPSULE')) {
  content = content.replace(/\/\* ─── OPTION 2: FLOATING ATELIER GLASS CAPSULE[\s\S]*?<\/style>/, capsuleCss + '\n</style>');
} else if (content.includes('/* ─── ULTRA-CLEAN MINIMAL LUXURY TEMPLATE CARDS')) {
  content = content.replace(/\/\* ─── ULTRA-CLEAN MINIMAL LUXURY TEMPLATE CARDS[\s\S]*?<\/style>/, capsuleCss + '\n</style>');
} else {
  content = content.replace('</style>', capsuleCss + '\n</style>');
}

// 2. REVISE renderCardHtml TO MATCH OPTION 2 CAPSULE MARKUP
const oldRenderCardRegex = /\/\/ Render Single Template Card HTML[\s\S]*?function renderCardHtml\(t, idx = 0\) \{[\s\S]*?return `[\s\S]*?<\/article>\s*`;\s*\}/;

const newCapsuleRenderCardHtml = `// Render Single Template Card HTML (Option 2: Floating Atelier Glass Capsule)
      function renderCardHtml(t, idx = 0) {
        const tier = getTierDetails(t);
        const thumbUrl = getThumbnailUrl(t);
        const safeId = encodeURIComponent(t.id);
        const safeOccasion = encodeURIComponent(t.category || 'Birthday');
        const isFree = (t.isFree || Number(t.price || 0) === 0);
        const priceDisplay = isFree ? 'FREE' : (tier.priceFormatted || '₹149');

        return \`
          <article class="tpl-luxury-card \${tier.tierClass}" id="card-\${t.id}" onclick="window.location.href='preview.html?template=\${safeId}'" title="Preview \${escapeHtml(t.name)}">
            <!-- Full-Bleed Cover Visual Stage -->
            <div class="tpl-cover-stage">
              <img class="tpl-cover-img" src="\${thumbUrl}" alt="\${escapeHtml(t.name)}" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80';">
              <div class="tpl-cover-gradient"></div>
            </div>

            <!-- Floating Frosted Glass Capsule (Docked inside image) -->
            <div class="tpl-floating-capsule" onclick="event.stopPropagation();">
              <div class="capsule-header-row">
                <h3 class="capsule-title" title="\${escapeHtml(t.name)}">\${escapeHtml(t.name)}</h3>
                <span class="capsule-price-val \${isFree ? 'price-free' : ''}">\${priceDisplay}</span>
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

if (oldRenderCardRegex.test(content)) {
  content = content.replace(oldRenderCardRegex, newCapsuleRenderCardHtml);
  console.log('Successfully replaced renderCardHtml with Option 2 Floating Capsule layout!');
} else {
  console.error('Could not match old renderCardHtml regex');
}

fs.writeFileSync(tplPath, content, 'utf8');
console.log('Option 2 Floating Capsule card redesign successfully written to templates.html!');
