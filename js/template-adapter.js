/**
 * VANVI MOMENTS — UNIVERSAL TEMPLATE & MOMENT DATA ADAPTER
 * Dynamically resolves moment data by ID or slug (?id=... / ?slug=...)
 * from backend (/api/moments/public/:id) or localStorage fallback,
 * and seamlessly populates template placeholders, letters, and polaroids.
 */
(function(window) {
  'use strict';

  // Automatically inherit Global Premium Web Experience
  (function ensureGlobalExperience() {
    if (typeof document === 'undefined') return;
    if (document.getElementById('vanvi-global-experience-css')) return;
    const pathname = window.location.pathname.replace(/\\/g, '/');
    let prefix = '../../';
    if (pathname.includes('/templates/')) {
      const parts = pathname.split('/templates/')[1].split('/').filter(Boolean);
      prefix = '../'.repeat(parts.length);
    }
    const link = document.createElement('link');
    link.id = 'vanvi-global-experience-css';
    link.rel = 'stylesheet';
    link.href = prefix + 'css/vanvi-global-experience.css';
    document.head.appendChild(link);
  })();

  // Get current API base
  function getApiBase() {
    if (typeof window !== 'undefined' && window.location) {
      if (window.location.port === '3000') return '';
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return `http://${window.location.hostname}:3000`;
      }
    }
    return '';
  }

  async function fetchMomentById(idOrSlug) {
    if (!idOrSlug) return null;

    // 1. Try unified VanviAPI SDK if available
    if (window.VanviAPI && window.VanviAPI.moments && typeof window.VanviAPI.moments.getPublic === 'function') {
      try {
        const res = await window.VanviAPI.moments.getPublic(idOrSlug);
        if (res && res.success && res.moment) {
          return res.moment;
        }
      } catch (e) {}
    }

    // 2. Direct fetch to local/remote server endpoints
    const apiBase = getApiBase();
    const tryUrls = [
      `${apiBase}/api/moments/public/${encodeURIComponent(idOrSlug)}`,
      `/api/moments/public/${encodeURIComponent(idOrSlug)}`
    ];

    for (const url of tryUrls) {
      try {
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data && data.success && data.moment) {
            return data.moment;
          }
        }
      } catch (e) {}
    }

    // 3. Resilient guest/offline fallback to localStorage
    try {
      const raw = localStorage.getItem('vanvi_user_moments') || '[]';
      const list = JSON.parse(raw);
      const found = list.find(m => m.id === idOrSlug || m.slug === idOrSlug);
      if (found) return found;
    } catch (e) {}

    return null;
  }

  async function applyMomentDataToDOM() {
    const params = new URLSearchParams(window.location.search);

    // Purge any watermark badge unconditionally
    const wm = document.getElementById('demoWatermarkBadge');
    if (wm) {
      try { wm.remove(); } catch(e) {}
    }

    const momentId = params.get('id') || params.get('slug');
    let moment = null;
    if (momentId) {
      moment = await fetchMomentById(momentId);
    }

    const recipient = (moment && moment.recipient) || params.get('recipient') || params.get('name') || '';
    const sender = (moment && moment.sender) || params.get('sender') || '';
    const occasion = (moment && moment.occasion) || params.get('occasion') || 'Celebration';
    const message = (moment && (moment.message || moment.text)) || params.get('message') || '';
    const date = (moment && moment.date) || params.get('date') || '';
    let photos = (moment && moment.photos) || [];
    if (!photos.length && params.get('photos')) {
      try { photos = JSON.parse(params.get('photos')); } catch(e){}
    }

    // If neither moment nor URL query data is present, still setup watermark system and return
    if (!moment && !recipient && !sender && !message) {
      setupUniversalWatermarkSystem();
      return;
    }

    // Document Title
    if (recipient) {
      document.title = `${recipient} · A Special ${occasion} Keepsake | Vanvi Moments`;
    }

    // Recipient elements
    if (recipient) {
      const recipientSelectors = [
        '#recipientName', '#txtRecipientHero', '#celebrantTitle',
        '.recipient-name', '.celebrant-name', '#lockHeadline', '#titleName',
        '.hero-title-name', '#displayRecipient', '.recipient-display',
        '#txtCertRecipient', '#txtLetterHeading', '#recipient'
      ];
      recipientSelectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
          if (el.id === 'celebrantTitle') {
            el.innerHTML = `Happy ${occasion}, <span class="highlight-name">${recipient}</span> ✨`;
          } else if (el.id === 'txtRecipientHero') {
            el.textContent = `Happy ${occasion}, ${recipient}!`;
          } else if (el.id === 'txtLetterHeading') {
            el.textContent = `Dearest ${recipient},`;
          } else if (el.id === 'lockHeadline') {
            el.textContent = `For ${recipient}`;
          } else {
            el.textContent = recipient;
          }
        });
      });
    }

    // Sender elements
    if (sender) {
      const senderSelectors = [
        '#senderName', '#txtLetterSign', '#letterSenderName',
        '.sender-name', '.letter-sender', '#displaySender', '#signName', '#sender'
      ];
      senderSelectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
          if (el.id === 'txtLetterSign') el.textContent = `— ${sender}`;
          else if (el.id === 'letterSenderName') el.textContent = `${sender} ♡`;
          else el.textContent = sender;
        });
      });
    }

    // Message elements
    const messageSelectors = [
      '#letterBodyText', '#txtLetterBody', '#letterContentText',
      '.letter-body-text', '.message-text', '#messageText', '#displayMessage', '#letterBody', '#message'
    ];
    if (message) {
      messageSelectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
          el.textContent = message;
        });
      });
    }

    // Date elements
    if (date) {
      document.querySelectorAll('#letterDate, .letter-date, #displayDate, #weddingDate, #muhuratDate, .date-badge, #date').forEach(el => {
        el.textContent = date;
      });
    }

    // Occasion elements
    const occasionSelectors = [
      '#climaxOccasionWord', '#letterOccasionRibbon', '.occasion-badge', '.celebration-type'
    ];
    occasionSelectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        el.textContent = occasion;
      });
    });

    // Photos / Polaroids elements
    if (photos && photos.length > 0) {
      const apiBase = getApiBase();
      const imgElements = document.querySelectorAll(
        '.polaroid-img, .polaroid-card img, .memory-polaroid img, .photo-slide img, #polaroidDeck img, #photoGrid img, .gallery-img, .photo-card img'
      );
      imgElements.forEach((img, idx) => {
        const photo = photos[idx % photos.length];
        let src = typeof photo === 'string' ? photo : (photo.url || photo.src);
        if (src) {
          if (src.startsWith('/uploads/')) {
            src = `${apiBase}${src}`;
          }
          img.src = src;
        }
      });
    }

    // Dynamic custom_data Engine (Unlimited & Independent Template Architecture)
    const customData = (moment && (moment.custom_data || moment.customData)) || {};
    if (typeof customData === 'object' && customData !== null) {
      const apiBase = getApiBase();
      Object.keys(customData).forEach(key => {
        const val = customData[key];
        if (val === undefined || val === null) return;

        // Try direct ID, prefixed IDs, or data attributes
        const directEls = document.querySelectorAll(
          `#${key}, [data-field="${key}"], .field-${key}, #txt_${key}, #inp_${key}`
        );
        directEls.forEach(el => {
          if (el.tagName === 'IMG') {
            let src = typeof val === 'string' ? val : (val.url || val.src);
            if (src) {
              if (src.startsWith('/uploads/')) src = `${apiBase}${src}`;
              el.src = src;
            }
          } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.value = val;
          } else if (typeof val === 'string' || typeof val === 'number') {
            el.textContent = val;
          }
        });

        // Dynamic photo arrays
        if (Array.isArray(val) && (key.toLowerCase().includes('photo') || key.toLowerCase().includes('polaroid') || key.toLowerCase().includes('image'))) {
          const targetImgs = document.querySelectorAll(
            `.${key}-img, #${key}List img, [data-array="${key}"] img, .memory-polaroid img, .polaroid-deck img`
          );
          targetImgs.forEach((img, idx) => {
            if (val[idx % val.length]) {
              const item = val[idx % val.length];
              let src = typeof item === 'string' ? item : (item.url || item.src);
              if (src) {
                if (src.startsWith('/uploads/')) src = `${apiBase}${src}`;
                img.src = src;
              }
            }
          });
        }
      });
    }

    // Setup Watermark System
    setupUniversalWatermarkSystem();

    // Attach custom_data to window.vanviActiveMoment
    window.vanviActiveMoment = Object.assign({}, moment || {}, {
      custom_data: {
        recipient,
        sender,
        message,
        occasion,
        date,
        photos,
        ...customData
      }
    });

    // Notify custom listeners
    window.dispatchEvent(new CustomEvent('vanvi:momentLoaded', { detail: window.vanviActiveMoment }));
  }

  // Universal Live Preview Sync Engine (Receives Keystroke Updates from Builder Studio)
  function applyLiveSyncPayload(data) {
    if (!data || typeof data !== 'object') return;
    const custom = data.customData || data.config || {};
    const rec = data.recipient || data.recipientName || data.name || custom.recipientName || custom.recipient || custom.name || '';
    const bride = data.bride || custom.bride || '';
    const groom = data.groom || custom.groom || '';
    const snd = data.sender || data.senderName || custom.senderName || custom.sender || '';
    const msg = data.message || custom.message || custom.letterBodyText || custom.letter || '';
    const date = data.date || custom.date || custom.celebrationDate || custom.weddingDate || '';
    const photos = data.photos || custom.photos || custom.gallery || [];

    // 1. Recipient
    if (rec) {
      const recEls = document.querySelectorAll(
        '#recipientName, #txtRecipientHero, #celebrantTitle, .recipient-name, .celebrant-name, #lockHeadline, #titleName, .couple-names, #displayRecipient, .hero-title-name, .recipient-display, #txtCertRecipient, #txtLetterHeading, #recipient'
      );
      recEls.forEach(el => {
        if (el.id === 'celebrantTitle') {
          el.innerHTML = `Happy Celebration, <span class="highlight-name">${rec}</span> ✨`;
        } else if (el.id === 'txtRecipientHero') {
          el.textContent = `Happy Birthday, ${rec}!`;
        } else if (el.id === 'txtLetterHeading') {
          el.textContent = `Dearest ${rec},`;
        } else if (el.id === 'lockHeadline') {
          el.textContent = `For ${rec}`;
        } else {
          el.textContent = rec;
        }
      });
    }

    // 2. Bride & Groom (Wedding templates)
    if (bride || groom) {
      if (bride) {
        document.querySelectorAll('#brideName, #txtBride, .bride-name, #displayBride, .hero-bride').forEach(el => el.textContent = bride);
      }
      if (groom) {
        document.querySelectorAll('#groomName, #txtGroom, .groom-name, #displayGroom, .hero-groom').forEach(el => el.textContent = groom);
      }
      if (bride && groom) {
        document.querySelectorAll('#coupleTitle, .couple-title, .couple-names, #coupleNames, .names-marquee').forEach(el => el.textContent = `${bride} & ${groom}`);
      }
    }

    // 3. Sender
    if (snd) {
      const sndEls = document.querySelectorAll(
        '#senderName, #txtLetterSign, #letterSenderName, .sender-name, .letter-sender, #displaySender, #signName, #sender'
      );
      sndEls.forEach(el => {
        if (el.id === 'txtLetterSign') el.textContent = `— ${snd}`;
        else if (el.id === 'letterSenderName') el.textContent = `${snd} ♡`;
        else el.textContent = snd;
      });
    }

    // 4. Message
    if (msg) {
      const msgEls = document.querySelectorAll(
        '#letterBodyText, #txtLetterBody, #letterContentText, .letter-body-text, .message-text, #messageText, #displayMessage, #letterBody, #message'
      );
      msgEls.forEach(el => el.textContent = msg);
    }

    // 5. Date
    if (date) {
      document.querySelectorAll('#letterDate, .letter-date, #displayDate, #weddingDate, #muhuratDate, .date-badge, #date').forEach(el => {
        el.textContent = date;
      });
    }

    // 6. Photos
    if (Array.isArray(photos) && photos.length > 0) {
      const imgElements = document.querySelectorAll(
        '.polaroid-img, .polaroid-card img, .memory-polaroid img, .photo-slide img, #polaroidDeck img, #photoGrid img, .gallery-img, .photo-card img'
      );
      imgElements.forEach((img, idx) => {
        const item = photos[idx % photos.length];
        const src = typeof item === 'string' ? item : (item.url || item.src);
        if (src) img.src = src;
      });
    }

    // 7. Custom Data dictionary keys
    const merged = Object.assign({}, custom, data);
    Object.keys(merged).forEach(key => {
      const val = merged[key];
      if (val === undefined || val === null || typeof val === 'object') return;
      document.querySelectorAll(`#${key}, [data-field="${key}"], .field-${key}, #txt_${key}, #inp_${key}`).forEach(el => {
        if (el.tagName === 'IMG') {
          if (typeof val === 'string') el.src = val;
        } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.value = val;
        } else {
          el.textContent = val;
        }
      });
    });

    // 8. Nested Custom Data (e.g. birthday wishes, timeline chapters, certificate)
    if (custom.wishes) {
      if (custom.wishes.wish1) {
        const el = document.getElementById('txtStarDesc1') || document.getElementById('wish1');
        if (el) el.textContent = custom.wishes.wish1;
      }
      if (custom.wishes.wish2) {
        const el = document.getElementById('txtStarDesc2') || document.getElementById('wish2');
        if (el) el.textContent = custom.wishes.wish2;
      }
      if (custom.wishes.wish3) {
        const el = document.getElementById('txtStarDesc3') || document.getElementById('wish3');
        if (el) el.textContent = custom.wishes.wish3;
      }
    }

    if (custom.timeline) {
      const tl = custom.timeline;
      if (tl.t1) { const el = document.getElementById('txtTimelineTitle1'); if (el) el.textContent = tl.t1; }
      if (tl.d1) { const el = document.getElementById('txtTimelineDesc1'); if (el) el.textContent = tl.d1; }
      if (tl.t2) { const el = document.getElementById('txtTimelineTitle2'); if (el) el.textContent = tl.t2; }
      if (tl.d2) { const el = document.getElementById('txtTimelineDesc2'); if (el) el.textContent = tl.d2; }
      if (tl.t3) { const el = document.getElementById('txtTimelineTitle3'); if (el) el.textContent = tl.t3; }
      if (tl.d3) { const el = document.getElementById('txtTimelineDesc3'); if (el) el.textContent = tl.d3; }
    }

    if (custom.certificate) {
      const cert = custom.certificate;
      if (cert.headline) {
        const el = document.querySelector('.cert-headline') || document.getElementById('certHeadline');
        if (el) el.textContent = cert.headline;
      }
      if (cert.citation) {
        const el = document.getElementById('txtCertCitation') || document.getElementById('certCitation');
        if (el) el.textContent = `"${cert.citation}"`;
      }
    }
  }

  // Universal message event listener for Live Builder Sync
  window.addEventListener('message', function(event) {
    if (!event.data) return;
    const d = event.data;
    if (
      d.type === 'VANVI_LIVE_PREVIEW_SYNC' ||
      d.type === 'VANVI_UPDATE_CUSTOM_DATA' ||
      d.type === 'UPDATE_CONFIG' ||
      d.type === 'VANVI_PREVIEW_UPDATE' ||
      d.type === 'SYNC_DATA' ||
      d.customData ||
      d.config
    ) {
      applyLiveSyncPayload(d);
    }
  });

  // Universal Watermark Architecture (Unpublished Preview vs Published Keepsake)
  function setupUniversalWatermarkSystem() {
    if (typeof document === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const isInIframe = (function() {
      try { return window.self !== window.top; } catch(e) { return true; }
    })();

    const isPaidOrPublished = Boolean(
      params.get('paid') === 'true' ||
      params.get('purchased') === 'true' ||
      params.get('status') === 'published' ||
      (window.vanviActiveMoment && (window.vanviActiveMoment.status === 'published' || window.vanviActiveMoment.isPurchased))
    );

    // Purge bulky/old demo watermark badges
    const oldWatermarks = document.querySelectorAll('#demoWatermarkBadge, .vanvi-draft-watermark, .draft-watermark, .demo-watermark-overlay');
    oldWatermarks.forEach(el => el.remove());

    // Inject Watermark CSS
    if (!document.getElementById('vanvi-watermark-styles')) {
      const style = document.createElement('style');
      style.id = 'vanvi-watermark-styles';
      style.textContent = `
        /* Premium Subtle Watermark (Post-Publish / Unlocked) */
        .vanvi-subtle-watermark {
          position: fixed !important;
          bottom: 14px !important;
          right: 14px !important;
          z-index: 99999 !important;
          display: inline-flex !important;
          align-items: center !important;
          gap: 6px !important;
          padding: 5px 12px !important;
          border-radius: 99px !important;
          background: rgba(255, 255, 255, 0.8) !important;
          backdrop-filter: blur(12px) !important;
          -webkit-backdrop-filter: blur(12px) !important;
          border: 1px solid rgba(255, 120, 175, 0.3) !important;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.9) !important;
          font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif !important;
          font-size: 11px !important;
          font-weight: 750 !important;
          color: #59354d !important;
          letter-spacing: 0.02em !important;
          text-decoration: none !important;
          opacity: 0.88 !important;
          pointer-events: auto !important;
          transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1) !important;
          user-select: none !important;
        }
        .vanvi-subtle-watermark:hover {
          opacity: 1 !important;
          transform: translateY(-1.5px) !important;
          background: rgba(255, 255, 255, 0.96) !important;
          border-color: #ff2a7a !important;
          color: #ff2a7a !important;
          box-shadow: 0 6px 20px rgba(255, 42, 122, 0.22) !important;
        }
        .vanvi-wm-sparkle {
          color: #d97706 !important;
          font-size: 10.5px !important;
          line-height: 1 !important;
          display: inline-block !important;
          animation: vanviSparkleGlow 2.8s infinite ease-in-out !important;
        }
        @keyframes vanviSparkleGlow {
          0%, 100% { transform: scale(1); opacity: 0.85; }
          50% { transform: scale(1.3); opacity: 1; filter: drop-shadow(0 0 4px #f59e0b); }
        }

        /* Studio Live Preview Badge (Inside Builder Iframe) */
        .vanvi-preview-live-badge {
          position: fixed !important;
          top: 12px !important;
          right: 12px !important;
          z-index: 99999 !important;
          display: inline-flex !important;
          align-items: center !important;
          gap: 5px !important;
          padding: 4px 10px !important;
          border-radius: 99px !important;
          background: rgba(26, 11, 22, 0.85) !important;
          backdrop-filter: blur(10px) !important;
          -webkit-backdrop-filter: blur(10px) !important;
          border: 1px solid rgba(212, 175, 55, 0.45) !important;
          color: #fef3c7 !important;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif !important;
          font-size: 10px !important;
          font-weight: 750 !important;
          letter-spacing: 0.04em !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2) !important;
          pointer-events: none !important;
          user-select: none !important;
        }
        .vanvi-preview-live-dot {
          width: 6px !important;
          height: 6px !important;
          border-radius: 50% !important;
          background: #10b981 !important;
          box-shadow: 0 0 6px #10b981 !important;
          animation: vanviLivePulse 1.8s infinite ease-in-out !important;
        }
        @keyframes vanviLivePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
      `;
      document.head.appendChild(style);
    }

    if (isInIframe && !isPaidOrPublished) {
      if (!document.getElementById('vanviPreviewLiveBadge')) {
        const badge = document.createElement('div');
        badge.id = 'vanviPreviewLiveBadge';
        badge.className = 'vanvi-preview-live-badge';
        badge.innerHTML = `<span class="vanvi-preview-live-dot"></span><span>Studio Live Sync</span>`;
        document.body.appendChild(badge);
      }
    } else {
      const prevBadge = document.getElementById('vanviPreviewLiveBadge');
      if (prevBadge) prevBadge.remove();

      if (!document.getElementById('vanviSubtleWatermark')) {
        const wm = document.createElement('a');
        wm.id = 'vanviSubtleWatermark';
        wm.className = 'vanvi-subtle-watermark';
        wm.href = '../../index.html';
        wm.title = 'Crafted with Vanvi Moments';
        wm.target = '_blank';
        wm.innerHTML = `<span class="vanvi-wm-sparkle">✦</span><span class="vanvi-wm-text">Vanvi Moments</span>`;
        document.body.appendChild(wm);
      }
    }
  }

  // Universal Luxury Customize CTA at end of all templates A to Z
  function injectUniversalCustomizeCta() {
    if (typeof document === 'undefined') return;
    try {
      if (window.self !== window.top) return; // Skip inside builder preview iframes
    } catch(e) {}

    const pathname = window.location.pathname.replace(/\\/g, '/');
    if (!pathname.includes('/templates/')) return;

    // Suppress universal injection if template manages its own finale customize CTA (e.g. birthday-wish-01 multi-scene flow)
    if (
      pathname.includes('birthday-wish-01') ||
      pathname.includes('birthday-wish-1') ||
      pathname.includes('birthday-3d-candle') ||
      pathname.includes('birthday-3d-candle-surprise') ||
      document.getElementById('scene7') ||
      document.querySelector('[data-has-custom-cta]') ||
      document.querySelector('.vanvi-luxe-finale-panel') ||
      document.querySelector('.finale-customize-box')
    ) {
      const stray = document.getElementById('vanviUniversalEndCta');
      if (stray) stray.remove();
      return;
    }


    if (document.getElementById('vanviUniversalEndCta') || document.querySelector('.vanvi-template-end-cta')) {
      return;
    }

    let builderUrl = './builder.html';
    let homeUrl = '../../index.html#template-world';

    if (!document.getElementById('vanvi-universal-cta-style')) {
      const style = document.createElement('style');
      style.id = 'vanvi-universal-cta-style';
      style.textContent = `
        .vanvi-universal-end-cta {
          margin: 60px auto 40px !important;
          padding: 0 16px !important;
          max-width: 660px !important;
          width: 100% !important;
          box-sizing: border-box !important;
          position: relative !important;
          z-index: 100 !important;
          clear: both !important;
        }
        .vanvi-universal-cta-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 245, 250, 0.96) 100%) !important;
          border: 1.5px solid rgba(255, 120, 175, 0.4) !important;
          border-radius: 24px !important;
          padding: 28px 22px !important;
          box-shadow: 
            0 18px 45px rgba(255, 42, 122, 0.12),
            0 4px 16px rgba(217, 119, 6, 0.08),
            inset 0 2px 2px #ffffff !important;
          text-align: center !important;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif !important;
        }
        .vanvi-universal-badge {
          display: inline-block !important;
          font-size: 11px !important;
          font-weight: 850 !important;
          letter-spacing: 0.8px !important;
          text-transform: uppercase !important;
          color: #ff2a7a !important;
          background: rgba(255, 42, 122, 0.1) !important;
          padding: 4px 14px !important;
          border-radius: 99px !important;
          margin-bottom: 12px !important;
        }
        .vanvi-universal-title {
          font-size: clamp(1.3rem, 3.5vw, 1.7rem) !important;
          font-weight: 750 !important;
          color: #2c1224 !important;
          margin: 0 0 8px !important;
          line-height: 1.25 !important;
        }
        .vanvi-universal-desc {
          font-size: 13.5px !important;
          color: #724c65 !important;
          max-width: 480px !important;
          margin: 0 auto 20px !important;
          line-height: 1.5 !important;
        }
        .vanvi-universal-actions {
          display: flex !important;
          flex-wrap: wrap !important;
          gap: 12px !important;
          justify-content: center !important;
          align-items: center !important;
        }
        .vanvi-btn-universal-builder {
          background: linear-gradient(135deg, #ff2a7a 0%, #ff4d94 50%, #9353d3 100%) !important;
          color: #ffffff !important;
          text-decoration: none !important;
          font-size: 13.5px !important;
          font-weight: 800 !important;
          padding: 12px 24px !important;
          border-radius: 99px !important;
          display: inline-flex !important;
          align-items: center !important;
          gap: 8px !important;
          box-shadow: 0 8px 24px rgba(255, 42, 122, 0.35) !important;
          transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        .vanvi-btn-universal-builder:hover {
          transform: translateY(-2px) scale(1.02) !important;
          box-shadow: 0 12px 30px rgba(255, 42, 122, 0.45) !important;
        }
        .vanvi-universal-chip-free {
          background: #ffffff !important;
          color: #ff2a7a !important;
          font-size: 10px !important;
          font-weight: 850 !important;
          padding: 2px 7px !important;
          border-radius: 99px !important;
        }
        .vanvi-btn-universal-explore {
          background: #ffffff !important;
          border: 1.2px solid rgba(255, 120, 175, 0.35) !important;
          color: #2c1224 !important;
          text-decoration: none !important;
          font-size: 13px !important;
          font-weight: 750 !important;
          padding: 12px 20px !important;
          border-radius: 99px !important;
          display: inline-flex !important;
          align-items: center !important;
          gap: 6px !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.04) !important;
          transition: all 0.2s ease !important;
        }
        .vanvi-btn-universal-explore:hover {
          background: #fff5f8 !important;
          border-color: #ff2a7a !important;
          color: #ff2a7a !important;
        }
      `;
      document.head.appendChild(style);
    }

    const cta = document.createElement('section');
    cta.className = 'vanvi-universal-end-cta';
    cta.id = 'vanviUniversalEndCta';
    cta.innerHTML = `
      <div class="vanvi-universal-cta-card">
        <span class="vanvi-universal-badge">✨ Bespoke Keepsake Experience</span>
        <h3 class="vanvi-universal-title">Loved this celebration? Make it yours!</h3>
        <p class="vanvi-universal-desc">Personalize with your photos, music, secret wax seal &amp; heartfelt words in seconds.</p>
        <div class="vanvi-universal-actions">
          <a href="${builderUrl}" class="vanvi-btn-universal-builder">
            <span>🎨 Customize in Studio</span>
            <span class="vanvi-universal-chip-free">Free VIP Studio</span>
          </a>
          <a href="${homeUrl}" class="vanvi-btn-universal-explore">
            <span>🌸 Explore All Templates</span>
          </a>
        </div>
      </div>
    `;

    const footer = document.querySelector('footer') || document.querySelector('.template-footer') || document.querySelector('.grand-footer');
    if (footer && footer.parentNode) {
      footer.parentNode.insertBefore(cta, footer);
    } else {
      document.body.appendChild(cta);
    }
  }

  // Auto-execute on DOM readiness
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      applyMomentDataToDOM();
      injectUniversalCustomizeCta();
    });
  } else {
    applyMomentDataToDOM();
    injectUniversalCustomizeCta();
  }

  window.VanviMomentLoader = {
    fetchById: fetchMomentById,
    applyToDOM: applyMomentDataToDOM
  };
})(window);
