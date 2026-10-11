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
    if (!momentId) return;

    const moment = await fetchMomentById(momentId);
    if (!moment) return;

    const recipient = moment.recipient || 'My Favorite Person';
    const sender = moment.sender || 'With all my love';
    const occasion = moment.occasion || 'Celebration';
    const message = moment.message || moment.text || '';
    const date = moment.date || '';
    const photos = moment.photos || [];

    // Document Title
    document.title = `${recipient} · A Special ${occasion} Keepsake | Vanvi Moments`;

    // Recipient elements
    const recipientSelectors = [
      '#recipientName', '#txtRecipientHero', '#celebrantTitle',
      '.recipient-name', '.celebrant-name', '#lockHeadline'
    ];
    recipientSelectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        if (el.id === 'celebrantTitle') {
          el.innerHTML = `Happy ${occasion}, <span class="highlight-name">${recipient}</span> ✨`;
        } else if (el.id === 'txtRecipientHero') {
          el.textContent = `Happy ${occasion}, ${recipient}!`;
        } else if (el.id === 'lockHeadline') {
          el.textContent = `For ${recipient}`;
        } else {
          el.textContent = recipient;
        }
      });
    });

    // Sender elements
    const senderSelectors = [
      '#senderName', '#txtLetterSign', '#letterSenderName',
      '.sender-name', '.letter-sender'
    ];
    senderSelectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        if (el.id === 'txtLetterSign') el.textContent = `— ${sender}`;
        else if (el.id === 'letterSenderName') el.textContent = `${sender} ♡`;
        else el.textContent = sender;
      });
    });

    // Message elements
    const messageSelectors = [
      '#letterBodyText', '#txtLetterBody', '#letterContentText',
      '.letter-body-text', '.message-text', '#messageText'
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
      document.querySelectorAll('#letterDate, .letter-date').forEach(el => {
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
        '.polaroid-img, .polaroid-card img, .memory-polaroid img, .photo-slide img'
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
    const customData = moment.custom_data || moment.customData || {};
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

    // Automatic Watermark Control (Vanvi Verified Purchase Entitlement)
    const isPurchased = Boolean(
      moment.status === 'published' || 
      moment.status === 'paid' || 
      moment.isPurchased === true ||
      params.get('purchased') === 'true'
    );
    if (isPurchased) {
      const wm = document.getElementById('demoWatermarkBadge');
      if (wm) {
        wm.hidden = true;
        wm.style.display = 'none';
        try { wm.remove(); } catch(e) {}
      }
    }

    // Attach custom_data to window.vanviActiveMoment
    moment.custom_data = {
      recipient,
      sender,
      message,
      occasion,
      date,
      photos,
      ...customData
    };

    // Notify custom listeners
    window.vanviActiveMoment = moment;
    window.dispatchEvent(new CustomEvent('vanvi:momentLoaded', { detail: moment }));
  }

  // Universal Luxury Customize CTA at end of all templates A to Z
  function injectUniversalCustomizeCta() {
    if (typeof document === 'undefined') return;
    try {
      if (window.self !== window.top) return; // Skip inside builder preview iframes
    } catch(e) {}

    if (document.getElementById('vanviUniversalEndCta') || document.querySelector('.vanvi-template-end-cta')) {
      return;
    }

    const pathname = window.location.pathname.replace(/\\/g, '/');
    if (!pathname.includes('/templates/')) return;

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
