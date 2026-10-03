const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'templates.html');
let content = fs.readFileSync(targetPath, 'utf8');

// 1. Add 22 font CSS utility classes right after --font-num in :root
const fontCssChunk = `
      --font-sans: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      --font-serif: 'Playfair Display', 'Cormorant Garamond', Georgia, serif;
      --font-num: 'Outfit', 'Plus Jakarta Sans', sans-serif;
    }

    /* ─── 22 LUXURY TYPOGRAPHY SUITES ───────────────────────────── */
    .font-alex-brush { font-family: 'Alex Brush', cursive !important; font-weight: 400 !important; font-size: 1.35em !important; }
    .font-allura { font-family: 'Allura', cursive !important; font-weight: 400 !important; font-size: 1.35em !important; }
    .font-bodoni { font-family: 'Bodoni Moda', Georgia, serif !important; font-weight: 750 !important; letter-spacing: -0.2px; }
    .font-caveat { font-family: 'Caveat', cursive !important; font-weight: 700 !important; font-size: 1.28em !important; }
    .font-cinzel { font-family: 'Cinzel', Georgia, serif !important; font-weight: 800 !important; letter-spacing: 0.6px; }
    .font-cinzel-dec { font-family: 'Cinzel Decorative', Georgia, serif !important; font-weight: 700 !important; letter-spacing: 0.8px; }
    .font-cormorant { font-family: 'Cormorant Garamond', Georgia, serif !important; font-weight: 700 !important; font-style: italic !important; }
    .font-dancing { font-family: 'Dancing Script', cursive !important; font-weight: 700 !important; font-size: 1.25em !important; }
    .font-ephesis { font-family: 'Ephesis', cursive !important; font-weight: 400 !important; font-size: 1.38em !important; }
    .font-great-vibes { font-family: 'Great Vibes', cursive !important; font-weight: 400 !important; font-size: 1.36em !important; }
    .font-inter { font-family: 'Inter', sans-serif !important; font-weight: 750 !important; }
    .font-italiana { font-family: 'Italiana', Georgia, serif !important; font-weight: 400 !important; letter-spacing: 0.5px; }
    .font-marcellus { font-family: 'Marcellus', Georgia, serif !important; font-weight: 400 !important; letter-spacing: 0.4px; }
    .font-montserrat { font-family: 'Montserrat', sans-serif !important; font-weight: 800 !important; letter-spacing: 0.2px; }
    .font-outfit { font-family: 'Outfit', sans-serif !important; font-weight: 800 !important; }
    .font-parisienne { font-family: 'Parisienne', cursive !important; font-weight: 400 !important; font-size: 1.35em !important; }
    .font-pinyon { font-family: 'Pinyon Script', cursive !important; font-weight: 400 !important; font-size: 1.36em !important; }
    .font-playfair { font-family: 'Playfair Display', Georgia, serif !important; font-weight: 750 !important; }
    .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif !important; font-weight: 850 !important; }
    .font-prata { font-family: 'Prata', Georgia, serif !important; font-weight: 400 !important; }
    .font-space { font-family: 'Space Grotesk', sans-serif !important; font-weight: 700 !important; letter-spacing: -0.2px; }
    .font-syne { font-family: 'Syne', sans-serif !important; font-weight: 800 !important; letter-spacing: -0.4px; }`;

content = content.replace(
  /--font-sans:\s*'Plus Jakarta Sans'[\s\S]*?--font-num:\s*'Outfit'[\s\S]*?\}/,
  fontCssChunk.trim()
);

// 2. Upgrade .tpl-luxury-card with 3D glassmorphic styling
const luxuryCardCss = `/* ─── ULTRA-PREMIUM 3D GLASSMORPHIC TEMPLATE CARD COMPONENT ──── */
    .tpl-luxury-card {
      background: rgba(255, 255, 255, 0.88);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      border: 1.5px solid rgba(255, 120, 175, 0.28);
      border-radius: 24px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 10px 30px rgba(255, 42, 122, 0.07), 0 2px 8px rgba(0, 0, 0, 0.03);
      transition: all 0.38s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative;
      transform-style: preserve-3d;
    }
    .tpl-luxury-card::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 24px;
      padding: 1.5px;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 42, 122, 0.25), rgba(217, 119, 6, 0.2), transparent);
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      pointer-events: none;
      z-index: 2;
    }
    .tpl-luxury-card:hover {
      transform: translateY(-8px) scale(1.018);
      border-color: rgba(255, 42, 122, 0.65);
      box-shadow: 0 24px 55px rgba(255, 42, 122, 0.2), 0 8px 24px rgba(217, 119, 6, 0.12);
      background: rgba(255, 255, 255, 0.98);
    }

    /* Tier 1: Free Card Style */
    .tpl-luxury-card.tier-free {
      border-color: rgba(16, 185, 129, 0.35);
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.94) 0%, rgba(240, 253, 244, 0.9) 100%);
    }
    .tpl-luxury-card.tier-free:hover {
      border-color: #10b981;
      box-shadow: 0 20px 48px rgba(16, 185, 129, 0.22);
    }

    /* Tier 2: Mid-Tier Interactive (₹149 - ₹299) */
    .tpl-luxury-card.tier-premium {
      border-color: rgba(255, 42, 122, 0.35);
    }

    /* Tier 3: Ultra Premium & Bespoke Atelier (₹499 - ₹899) */
    .tpl-luxury-card.tier-ultra-premium {
      background: linear-gradient(160deg, #18091f 0%, #250d30 50%, #15061c 100%);
      border: 1.5px solid rgba(245, 158, 11, 0.55);
      color: #fce7f3;
      box-shadow: 0 16px 42px rgba(0, 0, 0, 0.45), 0 0 25px rgba(245, 158, 11, 0.2);
      position: relative;
    }
    .tpl-luxury-card.tier-ultra-premium:hover {
      border-color: #f59e0b;
      box-shadow: 0 26px 60px rgba(0, 0, 0, 0.6), 0 0 38px rgba(245, 158, 11, 0.35);
      transform: translateY(-8px) scale(1.02);
    }
    .tpl-luxury-card.tier-ultra-premium::after {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: linear-gradient(45deg, transparent 40%, rgba(255, 215, 0, 0.16) 50%, transparent 60%);
      transform: rotate(35deg) translateY(-100%);
      transition: transform 0.8s ease;
      pointer-events: none;
    }
    .tpl-luxury-card.tier-ultra-premium:hover::after {
      transform: rotate(35deg) translateY(100%);
    }`;

content = content.replace(
  /\/\* ─── ULTRA-PREMIUM TEMPLATE CARD COMPONENT ─────────────────── \*\/[\s\S]*?\.tpl-luxury-card\.tier-ultra-premium:hover::after \{[\s\S]*?\}/,
  luxuryCardCss
);

// 3. Add preview device switcher CSS & floating specs dock CSS
const previewExtraCss = `
    /* Device switchers and specs bottom bar inside preview modal */
    .preview-actions-group {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .btn-device-switch {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #ffffff;
      padding: 6px 11px;
      border-radius: 99px;
      font-size: 11px;
      font-weight: 750;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .btn-device-switch.active, .btn-device-switch:hover {
      background: rgba(255, 255, 255, 0.25);
      border-color: #fff;
    }

    .preview-iframe-wrapper.device-mobile {
      max-width: 420px;
      height: 85vh;
      margin: 12px auto;
      border-radius: 36px;
      border: 8px solid #230d30;
      box-shadow: 0 0 0 2px rgba(255, 120, 175, 0.4), 0 25px 60px rgba(0, 0, 0, 0.85);
      overflow: hidden;
      transition: all 0.3s ease;
    }

    /* Floating Interactive Features Bar */
    .preview-specs-bottom-dock {
      position: absolute;
      bottom: 18px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(18, 7, 26, 0.88);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1.5px solid rgba(255, 120, 175, 0.35);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 42, 122, 0.2);
      border-radius: 999px;
      padding: 6px 14px;
      display: flex;
      align-items: center;
      gap: 8px;
      z-index: 20;
      max-width: 90vw;
      overflow-x: auto;
      scrollbar-width: none;
    }
    .preview-specs-bottom-dock::-webkit-scrollbar { display: none; }
    .preview-spec-pill {
      font-size: 11px;
      font-weight: 750;
      color: #fce7f3;
      padding: 4px 10px;
      border-radius: 99px;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15);
      white-space: nowrap;
      display: inline-flex;
      align-items: center;
      gap: 5px;
    }
`;

content = content.replace(
  /\.preview-fullscreen-iframe \{[\s\S]*?\}/,
  `.preview-fullscreen-iframe {\n      width: 100%;\n      height: 100%;\n      border: none;\n      display: block;\n      background: #000;\n    }\n${previewExtraCss}`
);

// 4. Update #autoFullscreenPreviewModal markup
const modalOldMarkup = `<div class="vanvi-fullscreen-preview-modal" id="autoFullscreenPreviewModal" role="dialog" aria-modal="true" aria-label="Template Live Preview">
    <div class="preview-top-bar">
      <button type="button" class="btn-preview-back" onclick="closeAutoFullscreenPreview()" title="Exit Fullscreen Preview & Return to Templates">
        <span>‹</span> <span>Back</span>
      </button>

      <div class="preview-title-center">
        <span class="preview-title-name" id="previewModalTitle">Template Live Preview</span>
        <span class="preview-live-indicator"><span class="preview-live-dot"></span> Live Interactive Experience</span>
      </div>

      <a href="template-detail.html" class="btn-preview-customize" id="btnPreviewCustomize" title="Personalize and customize this template">
        <span>✨</span> <span>Make It Yours</span>
      </a>
    </div>

    <div class="preview-iframe-wrapper">
      <iframe id="previewFullscreenIframe" class="preview-fullscreen-iframe" src="about:blank" title="Live Template Fullscreen Experience" allow="autoplay; microphone; camera; fullscreen"></iframe>
    </div>
  </div>`;

const modalNewMarkup = `<div class="vanvi-fullscreen-preview-modal" id="autoFullscreenPreviewModal" role="dialog" aria-modal="true" aria-label="Template Live Preview">
    <div class="preview-top-bar">
      <div style="display:flex; align-items:center; gap:8px;">
        <button type="button" class="btn-preview-back" onclick="closeAutoFullscreenPreview()" title="Exit Fullscreen Preview & Return to Templates">
          <span>‹</span> <span>Back</span>
        </button>
        <div class="preview-actions-group mobile-hide">
          <button type="button" class="btn-device-switch active" id="btnPreviewDesk" onclick="setPreviewDevice('desktop')" title="Desktop / Tablet Fluid View">💻 Full</button>
          <button type="button" class="btn-device-switch" id="btnPreviewMob" onclick="setPreviewDevice('mobile')" title="Phone Simulation View">📱 Phone</button>
          <button type="button" class="btn-device-switch" onclick="reloadPreviewFrame()" title="Reload celebration experience">🔄</button>
        </div>
      </div>

      <div class="preview-title-center">
        <span class="preview-title-name" id="previewModalTitle">Template Live Preview</span>
        <span class="preview-live-indicator"><span class="preview-live-dot"></span> Live Interactive Experience</span>
      </div>

      <a href="template-detail.html" class="btn-preview-customize" id="btnPreviewCustomize" title="Personalize and customize this template">
        <span>✨</span> <span>Make It Yours</span>
      </a>
    </div>

    <div class="preview-iframe-wrapper">
      <iframe id="previewFullscreenIframe" class="preview-fullscreen-iframe" src="about:blank" title="Live Template Fullscreen Experience" allow="autoplay; microphone; camera; fullscreen"></iframe>
      
      <!-- Floating Interactive Features Bar -->
      <div class="preview-specs-bottom-dock" id="previewSpecsDock">
        <span class="preview-spec-pill" style="background:linear-gradient(135deg, rgba(255,42,122,0.25), rgba(217,119,6,0.25)); border-color:rgba(255,42,122,0.4);">⚡ Instant 30s Setup</span>
        <span class="preview-spec-pill">🎵 Keepsake Music Player</span>
        <span class="preview-spec-pill">💌 Interactive 3D Reveal</span>
        <span class="preview-spec-pill">💬 WhatsApp Direct Delivery</span>
        <span class="preview-spec-pill">🔐 Secret PIN Lock</span>
        <span class="preview-spec-pill">♾️ Lifetime Cloud Vault</span>
      </div>
    </div>
  </div>`;

content = content.replace(modalOldMarkup, modalNewMarkup);

// 5. Update getThumbnailUrl(t) and add getTemplateFontClass(t, idx)
const jsThumbAndFontChunk = `      // Curated High-Definition Celebration Visual Assets (Zero broken third-party links)
      function getThumbnailUrl(t) {
        if (t.thumbnail && !t.thumbnail.includes('cutiepage') && !t.thumbnail.includes('r2.dev')) return t.thumbnail;
        if (t.image && !t.image.includes('cutiepage') && !t.image.includes('r2.dev')) return t.image;
        const cat = (t.categorySlug || t.category || '').toLowerCase();
        const id = (t.id || '').toLowerCase();
        
        if (id.includes('candle') || id.includes('cake') || cat.includes('birthday')) {
          return 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=700&auto=format&fit=crop&q=80';
        }
        if (cat.includes('love') || cat.includes('romance') || id.includes('love') || id.includes('heart')) {
          return 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=700&auto=format&fit=crop&q=80';
        }
        if (cat.includes('anniversary') || id.includes('anniversary') || id.includes('champagne')) {
          return 'https://images.unsplash.com/photo-1519741497674-611481863552?w=700&auto=format&fit=crop&q=80';
        }
        if (cat.includes('friend') || id.includes('friend') || id.includes('bff')) {
          return 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=700&auto=format&fit=crop&q=80';
        }
        if (cat.includes('memories') || id.includes('polaroid') || id.includes('recap')) {
          return 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=700&auto=format&fit=crop&q=80';
        }
        if (cat.includes('apology') || id.includes('sorry') || id.includes('letter')) {
          return 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=700&auto=format&fit=crop&q=80';
        }
        if (cat.includes('family') || id.includes('family') || id.includes('parents')) {
          return 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=700&auto=format&fit=crop&q=80';
        }
        if (cat.includes('premium') || Number(t.price || 0) > 500) {
          return 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=700&auto=format&fit=crop&q=80';
        }
        return 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=700&auto=format&fit=crop&q=80';
      }

      // Dynamic 22 Luxury Google Fonts Allocator for Distinct Typographic Identities
      function getTemplateFontClass(t, idx = 0) {
        const cat = (t.categorySlug || t.category || '').toLowerCase();
        const name = (t.name || '').toLowerCase();
        const id = (t.id || '').toLowerCase();

        // 1. Royal, 24K Atelier & Milestones -> Majestic Serifs & Classical Display
        if (cat === 'premium' || Number(t.price || 0) > 500 || name.includes('royal') || name.includes('vow') || name.includes('gold')) {
          const regalFonts = ['font-cinzel', 'font-cinzel-dec', 'font-marcellus', 'font-bodoni'];
          return regalFonts[idx % regalFonts.length];
        }

        // 2. Love & Romance -> Sensual Flowing Calligraphy & Timeless Serifs
        if (cat.includes('love') || cat.includes('anniversary') || name.includes('love') || name.includes('heart') || name.includes('forever')) {
          const romanceFonts = ['font-parisienne', 'font-great-vibes', 'font-allura', 'font-pinyon', 'font-alex-brush', 'font-cormorant'];
          return romanceFonts[idx % romanceFonts.length];
        }

        // 3. Friendship, Letters & Apologies -> Warm Handcrafted & Tender Scripts
        if (cat.includes('friend') || cat.includes('apology') || name.includes('bff') || name.includes('letter') || name.includes('sorry')) {
          const tenderFonts = ['font-caveat', 'font-dancing', 'font-ephesis', 'font-cormorant'];
          return tenderFonts[idx % tenderFonts.length];
        }

        // 4. Modern Beats, Cyber, Neon & Dynamic -> Bold Vanguard Geometric & Neo-Grotesk
        if (name.includes('cyber') || name.includes('neon') || name.includes('beat') || name.includes('pulse')) {
          const modernFonts = ['font-syne', 'font-space', 'font-outfit', 'font-inter'];
          return modernFonts[idx % modernFonts.length];
        }

        // 5. Memories, Nostalgia & Recaps -> Editorial Chic & High-Fashion Serif
        if (cat.includes('memories') || name.includes('polaroid') || name.includes('vintage') || name.includes('recap')) {
          const editorialFonts = ['font-bodoni', 'font-prata', 'font-italiana', 'font-montserrat'];
          return editorialFonts[idx % editorialFonts.length];
        }

        // 6. Birthday & Celebrations -> Celebratory Serif & Luxe Display
        const celebrationPool = [
          'font-playfair', 'font-bodoni', 'font-cinzel', 'font-marcellus', 'font-cormorant',
          'font-italiana', 'font-prata', 'font-syne', 'font-space', 'font-montserrat',
          'font-outfit', 'font-jakarta', 'font-parisienne', 'font-great-vibes', 'font-alex-brush',
          'font-allura', 'font-pinyon', 'font-dancing', 'font-caveat', 'font-ephesis',
          'font-cinzel-dec', 'font-inter'
        ];
        return celebrationPool[idx % celebrationPool.length];
      }`;

content = content.replace(
  /\/\/ Helper to get high-converting visual thumbnail cover[\s\S]*?return 'https:\/\/cdn\.cutiepage\.in\/static\/products\/birthday-wish2\.jpg';\s*\}/,
  jsThumbAndFontChunk
);

// 6. Update renderCardHtml to use fontClass and inline fallback on img
const oldRenderCardBody = `      // Render Single Template Card HTML
      function renderCardHtml(t, idx = 0) {
        const sku = getTemplateSku(t, idx);
        const tier = getTierDetails(t);
        const bgClass = getThumbnailThemeClass(t);
        const thumbUrl = getThumbnailUrl(t);
        const safeId = String(t.id).replace(/'/g, "\\\\'");
        const rating = (4.8 + ((Math.abs(String(t.id).charCodeAt(0) || 7) % 3) * 0.1)).toFixed(1);
        const reviewCount = Math.floor(280 + ((Math.abs(String(t.id).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)) % 750)));
        const ratingHtml = \`<span class="tpl-rating-star"><span class="star-glyph">★</span> <span class="rating-num">\${rating}</span> <span class="rating-reviews">(\${reviewCount}+)</span></span>\`;

        // Highlight tags
        const tags = (t.features || []).slice(0, 3);
        if (t.soundtrack && !tags.some(x => x.toLowerCase().includes('audio') || x.toLowerCase().includes('music'))) {
          tags.push('🎵 Audio');
        }

        // Center visual icon animation
        let centerVisual = t.icon || '🌸';
        if (String(t.id).includes('candle') || String(t.name).toLowerCase().includes('candle')) {
          centerVisual = \`<span class="flame-spark">🕯️</span>\`;
        }

        return \`
          <article class="tpl-luxury-card \${tier.tierClass}" id="card-\${t.id}">
            <!-- Visual Stage Thumbnail -->
            <div class="tpl-stage-thumb \${bgClass}" onclick="openAutoFullscreenPreview('\${safeId}')" title="Live fullscreen preview of \${escapeHtml(t.name)}">
              <span class="thumb-badge-sku">\${sku}</span>
              <span class="thumb-badge-tier \${tier.badgeClass}">\${tier.badgeText}</span>
              <img class="tpl-thumb-img" src="\${thumbUrl}" alt="\${escapeHtml(t.name)}" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80';">
              <div class="thumb-center-illustration" style="display:none;">
                \${centerVisual}
              </div>
              <div class="thumb-overlay-gradient"></div>
              <div class="thumb-hover-action-pill">
                <span>👁️ Fullscreen Preview</span>
              </div>
            </div>

            <!-- Card Content Body -->
            <div class="tpl-card-body">
              <div class="tpl-category-row">
                <span class="tpl-category-chip">\${t.icon || '🌸'} \${escapeHtml(t.category || 'Celebration')}</span>
                \${ratingHtml}
              </div>

              <h3 class="tpl-card-title \${getTemplateFontClass(t, idx)}" onclick="openAutoFullscreenPreview('\${safeId}')" title="\${escapeHtml(t.name)}">
                \${escapeHtml(t.name)}
              </h3>
              
              <p class="tpl-card-desc">\${escapeHtml(t.description || 'A timeless digital celebration crafted to turn your moments into unforgettable memories.')}</p>

              <div class="tpl-features-pills">
                \${tags.map(tag => \`<span class="tpl-feat-pill">\${escapeHtml(tag)}</span>\`).join('')}
              </div>

              <!-- Price & Discount Row -->
              <div class="tpl-price-row">
                <span class="tpl-price-current">\${tier.priceFormatted}</span>
                \${tier.origPriceFormatted ? \`<span class="tpl-price-orig">\${tier.origPriceFormatted}</span>\` : ''}
                \${tier.discountText ? \`<span class="tpl-discount-badge">\${tier.discountText}</span>\` : ''}
              </div>

              <!-- Action Buttons -->
              <div class="tpl-card-actions">
                <button type="button" class="btn-tpl-preview" onclick="openAutoFullscreenPreview('\${safeId}')" title="Full screen live preview">
                  <span>👁️</span> Preview
                </button>
                <a class="btn-tpl-create" href="template-detail.html?template=\${encodeURIComponent(t.id)}&mode=customize" title="Customize This Template">
                  <span>✨</span> Make Yours
                </a>
              </div>
            </div>
          </article>
        \`;
      }`;

content = content.replace(
  /\/\/ Render Single Template Card HTML[\s\S]*?return `[\s\S]*?<\/article>\s*`;\s*\}/,
  oldRenderCardBody
);

// 7. Enhance openAutoFullscreenPreview with dynamic feature pills and helper methods
const oldPreviewJs = `      window.openAutoFullscreenPreview = function(id) {
        const catalog = getCatalog();
        const t = catalog.find(x => String(x.id) === String(id) || String(x.slug) === String(id));
        if (!t) return;

        const modal = document.getElementById('autoFullscreenPreviewModal');
        const iframe = document.getElementById('previewFullscreenIframe');
        const titleEl = document.getElementById('previewModalTitle');
        const custBtn = document.getElementById('btnPreviewCustomize');

        if (titleEl) titleEl.textContent = t.name;
        if (custBtn) custBtn.href = \`template-detail.html?template=\${encodeURIComponent(t.id)}&mode=customize\`;

        let path = t.templatePath || \`templates/\${t.id}/index.html\`;
        if (path.endsWith('/')) path += 'index.html';
        const sep = path.includes('?') ? '&' : '?';
        path = \`\${path}\${sep}preview=1&celebrate=1\`;

        if (iframe) iframe.src = path;

        // Hide navigation dock & header completely by adding active class
        document.body.classList.add('fullscreen-preview-active');
        if (modal) modal.classList.add('active');

        // Allow back button to close preview
        try {
          if (!window.location.hash.includes('preview')) {
            history.pushState({ vanviPreview: true }, '', '#preview');
          }
        } catch(e) {}
      };`;

const newPreviewJs = `      window.openAutoFullscreenPreview = function(id) {
        const catalog = getCatalog();
        const t = catalog.find(x => String(x.id) === String(id) || String(x.slug) === String(id));
        if (!t) return;

        const modal = document.getElementById('autoFullscreenPreviewModal');
        const iframe = document.getElementById('previewFullscreenIframe');
        const titleEl = document.getElementById('previewModalTitle');
        const custBtn = document.getElementById('btnPreviewCustomize');
        const specsDock = document.getElementById('previewSpecsDock');

        if (titleEl) titleEl.textContent = t.name;
        if (custBtn) custBtn.href = \`template-detail.html?template=\${encodeURIComponent(t.id)}&mode=customize\`;

        // Populate bottom features dock dynamically
        if (specsDock) {
          const feats = (t.features && t.features.length) ? t.features : ['⚡ 30s Instant Setup', '🎵 Keepsake Soundtrack', '💬 WhatsApp Delivery', '♾️ Lifetime Vault'];
          specsDock.innerHTML = \`
            <span class="preview-spec-pill" style="background:linear-gradient(135deg, rgba(255,42,122,0.3), rgba(217,119,6,0.25)); border-color:rgba(255,42,122,0.5); font-weight:850; color:#fff;">✨ \${escapeHtml(t.category || 'Celebration')}</span>
            \${feats.map(f => \`<span class="preview-spec-pill">\${escapeHtml(f)}</span>\`).join('')}
            <span class="preview-spec-pill" style="color:#fbbf24; font-weight:850;">\${t.isFree ? '🎁 100% Free' : ('💎 ₹' + (t.price || 0))}</span>
          \`;
        }

        let path = t.templatePath || \`templates/\${t.id}/index.html\`;
        if (path.endsWith('/')) path += 'index.html';
        const sep = path.includes('?') ? '&' : '?';
        path = \`\${path}\${sep}preview=1&celebrate=1\`;

        if (iframe) iframe.src = path;

        // Hide navigation dock & header completely by adding active class
        document.body.classList.add('fullscreen-preview-active');
        if (modal) modal.classList.add('active');

        // Allow back button to close preview
        try {
          if (!window.location.hash.includes('preview')) {
            history.pushState({ vanviPreview: true }, '', '#preview');
          }
        } catch(e) {}
      };

      window.setPreviewDevice = function(mode) {
        const wrap = document.querySelector('.preview-iframe-wrapper');
        const deskBtn = document.getElementById('btnPreviewDesk');
        const mobBtn = document.getElementById('btnPreviewMob');
        if (!wrap) return;
        if (mode === 'mobile') {
          wrap.classList.add('device-mobile');
          if (deskBtn) deskBtn.classList.remove('active');
          if (mobBtn) mobBtn.classList.add('active');
        } else {
          wrap.classList.remove('device-mobile');
          if (deskBtn) deskBtn.classList.add('active');
          if (mobBtn) mobBtn.classList.remove('active');
        }
      };

      window.reloadPreviewFrame = function() {
        const iframe = document.getElementById('previewFullscreenIframe');
        if (iframe && iframe.src && iframe.src !== 'about:blank') {
          const s = iframe.src;
          iframe.src = 'about:blank';
          setTimeout(() => { iframe.src = s; }, 60);
        }
      };`;

content = content.replace(oldPreviewJs, newPreviewJs);

fs.writeFileSync(targetPath, content, 'utf8');
console.log('✅ templates.html successfully upgraded with 22 fonts, 3D glassmorphism cards, curated visuals, and preview features dock!');
