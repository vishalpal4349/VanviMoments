const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const tplPath = path.join(ROOT, 'templates.html');

let content = fs.readFileSync(tplPath, 'utf8');

// 1. NEW CARD CSS
const newCardCss = `
  /* ─── ULTRA-CLEAN MINIMAL LUXURY TEMPLATE CARDS (COVER-FOCUSED) ─── */
  .tpl-luxury-card {
    background: #ffffff !important;
    border: 1px solid rgba(255, 120, 175, 0.24) !important;
    border-radius: 18px !important;
    overflow: hidden !important;
    display: flex !important;
    flex-direction: column !important;
    box-shadow: 0 4px 18px rgba(74, 41, 58, 0.05) !important;
    transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.22s ease, border-color 0.22s ease !important;
    position: relative !important;
    width: 100% !important;
    max-width: 100% !important;
    transform: none !important;
  }
  .tpl-luxury-card::before, .tpl-luxury-card::after {
    display: none !important;
  }
  .tpl-luxury-card:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 10px 28px rgba(74, 41, 58, 0.12) !important;
    border-color: rgba(255, 42, 122, 0.42) !important;
  }

  /* Template Cover (Main Focus) */
  .tpl-cover-stage {
    position: relative !important;
    width: 100% !important;
    height: 280px !important;
    overflow: hidden !important;
    background: #fff0f5 !important;
    cursor: pointer !important;
    border-radius: 18px 18px 0 0 !important;
  }
  .tpl-cover-img {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
    display: block !important;
    transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1) !important;
  }
  .tpl-luxury-card:hover .tpl-cover-img {
    transform: scale(1.03) !important;
  }

  /* Subtle bottom dark/blur gradient inside the image */
  .tpl-cover-gradient {
    position: absolute !important;
    inset: 0 !important;
    background: linear-gradient(180deg, transparent 35%, rgba(18, 8, 16, 0.4) 60%, rgba(18, 8, 16, 0.88) 100%) !important;
    pointer-events: none !important;
    z-index: 2 !important;
  }

  /* Exactly 2 Buttons inside image, fixed bottom-center */
  .tpl-cover-actions {
    position: absolute !important;
    bottom: 12px !important;
    left: 14px !important;
    right: 14px !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 6px !important;
    align-items: center !important;
    z-index: 5 !important;
    box-sizing: border-box !important;
  }

  .btn-cover-preview {
    width: 100% !important;
    box-sizing: border-box !important;
    padding: 8px 12px !important;
    border-radius: 99px !important;
    font-size: 12.5px !important;
    font-weight: 750 !important;
    text-align: center !important;
    text-decoration: none !important;
    background: rgba(255, 255, 255, 0.22) !important;
    backdrop-filter: blur(12px) !important;
    -webkit-backdrop-filter: blur(12px) !important;
    border: 1px solid rgba(255, 255, 255, 0.6) !important;
    color: #ffffff !important;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.45) !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
    transition: all 0.2s ease !important;
    display: block !important;
    line-height: 1.2 !important;
    cursor: pointer !important;
  }
  .btn-cover-preview:hover {
    background: rgba(255, 255, 255, 0.38) !important;
    border-color: #ffffff !important;
    color: #ffffff !important;
    transform: translateY(-1px) !important;
  }

  .btn-cover-make {
    width: 100% !important;
    box-sizing: border-box !important;
    padding: 9px 12px !important;
    border-radius: 99px !important;
    font-size: 12.5px !important;
    font-weight: 800 !important;
    text-align: center !important;
    text-decoration: none !important;
    background: linear-gradient(135deg, #ff2a7a 0%, #d97706 100%) !important;
    color: #ffffff !important;
    border: none !important;
    box-shadow: 0 4px 14px rgba(255, 42, 122, 0.4) !important;
    transition: all 0.2s ease !important;
    display: block !important;
    line-height: 1.2 !important;
    cursor: pointer !important;
  }
  .btn-cover-make:hover {
    transform: translateY(-1px) !important;
    box-shadow: 0 6px 18px rgba(255, 42, 122, 0.55) !important;
    color: #ffffff !important;
  }

  /* Below Image: ONLY Template Name + 1-Line Description + Price */
  .tpl-card-minimal-body {
    padding: 14px 16px 16px !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 4px !important;
    background: #ffffff !important;
    box-sizing: border-box !important;
  }

  .tpl-minimal-title {
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif !important;
    font-size: 16px !important;
    font-weight: 750 !important;
    color: #2c1224 !important;
    margin: 0 !important;
    line-height: 1.3 !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }

  .tpl-minimal-desc {
    font-size: 12.5px !important;
    color: #724c65 !important;
    line-height: 1.45 !important;
    margin: 0 !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }

  .tpl-minimal-price-row {
    display: flex !important;
    align-items: baseline !important;
    gap: 8px !important;
    margin-top: 4px !important;
  }

  .tpl-minimal-price {
    font-size: 1.15rem !important;
    font-weight: 850 !important;
    color: #ff2a7a !important;
  }

  .tpl-minimal-orig-price {
    font-size: 12px !important;
    color: #94a3b8 !important;
    text-decoration: line-through !important;
  }

  /* Slider track width */
  .template-slider-track .tpl-luxury-card {
    width: 280px !important;
    flex-shrink: 0 !important;
  }

  /* Mobile responsiveness & safe widths */
  @media (max-width: 480px) {
    .tpl-cover-stage {
      height: 250px !important;
    }
    .tpl-cover-actions {
      left: 10px !important;
      right: 10px !important;
      bottom: 10px !important;
      gap: 5px !important;
    }
    .btn-cover-preview {
      padding: 7px 10px !important;
      font-size: 11.5px !important;
    }
    .btn-cover-make {
      padding: 8px 10px !important;
      font-size: 12px !important;
    }
    .tpl-card-minimal-body {
      padding: 12px 14px 14px !important;
    }
    .template-slider-track .tpl-luxury-card {
      width: 250px !important;
    }
  }
  @media (max-width: 360px) {
    .template-slider-track .tpl-luxury-card {
      width: 230px !important;
    }
    .tpl-cover-stage {
      height: 220px !important;
    }
    .tpl-minimal-title {
      font-size: 14.5px !important;
    }
  }
`;

// Insert the new Card CSS into templates.html
if (content.includes('/* ─── ULTRA-CLEAN MINIMAL LUXURY TEMPLATE CARDS')) {
  content = content.replace(/\/\* ─── ULTRA-CLEAN MINIMAL LUXURY TEMPLATE CARDS[\s\S]*?<\/style>/, newCardCss + '\n</style>');
} else {
  content = content.replace('</style>', newCardCss + '\n</style>');
}

// 2. REPLACE renderCardHtml FUNCTION
const oldRenderCardRegex = /\/\/ Render Single Template Card HTML[\s\S]*?function renderCardHtml\(t, idx = 0\) \{[\s\S]*?return `[\s\S]*?<\/article>\s*`;\s*\}/;

const newRenderCardHtml = `// Render Single Template Card HTML (Ultra-Clean, Minimal, Mobile-First)
      function renderCardHtml(t, idx = 0) {
        const tier = getTierDetails(t);
        const thumbUrl = getThumbnailUrl(t);
        const safeId = encodeURIComponent(t.id);
        const safeOccasion = encodeURIComponent(t.category || 'Birthday');

        return \`
          <article class="tpl-luxury-card \${tier.tierClass}" id="card-\${t.id}">
            <!-- Cover Stage with Inner Gradient & Centered Bottom Action Buttons -->
            <div class="tpl-cover-stage" onclick="window.location.href='preview.html?template=\${safeId}'" title="Preview \${escapeHtml(t.name)}">
              <img class="tpl-cover-img" src="\${thumbUrl}" alt="\${escapeHtml(t.name)}" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80';">
              <div class="tpl-cover-gradient"></div>
              <div class="tpl-cover-actions" onclick="event.stopPropagation();">
                <a href="preview.html?template=\${safeId}" class="btn-cover-preview" title="Live Preview">Preview</a>
                <a href="builder.html?template=\${safeId}&occasion=\${safeOccasion}" class="btn-cover-make" title="Personalize This Template">Make It Yours ✨</a>
              </div>
            </div>

            <!-- Below Image: ONLY Template Name + 1-Line Description + Price -->
            <div class="tpl-card-minimal-body">
              <h3 class="tpl-minimal-title" title="\${escapeHtml(t.name)}">\${escapeHtml(t.name)}</h3>
              <p class="tpl-minimal-desc">\${escapeHtml(t.description || 'A timeless digital celebration crafted to turn your moments into unforgettable memories.')}</p>
              <div class="tpl-minimal-price-row">
                <span class="tpl-minimal-price">\${tier.priceFormatted}</span>
                \${tier.origPriceFormatted ? \`<span class="tpl-minimal-orig-price">\${tier.origPriceFormatted}</span>\` : ''}
              </div>
            </div>
          </article>
        \`;
      }`;

if (oldRenderCardRegex.test(content)) {
  content = content.replace(oldRenderCardRegex, newRenderCardHtml);
  console.log('Successfully replaced renderCardHtml with the ultra-clean layout!');
} else {
  console.error('Could not find old renderCardHtml function with regex');
}

fs.writeFileSync(tplPath, content, 'utf8');
console.log('templates.html successfully updated with cover-focused cards!');
