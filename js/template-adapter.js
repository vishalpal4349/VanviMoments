/**
 * VANVI MOMENTS — UNIVERSAL TEMPLATE & MOMENT DATA ADAPTER
 * Dynamically resolves moment data by ID or slug (?id=... / ?slug=...)
 * from backend (/api/moments/public/:id) or localStorage fallback,
 * and seamlessly populates template placeholders, letters, and polaroids.
 */
(function(window) {
  'use strict';

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

    // Notify custom listeners
    window.vanviActiveMoment = moment;
    window.dispatchEvent(new CustomEvent('vanvi:momentLoaded', { detail: moment }));
  }

  // Auto-execute on DOM readiness
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyMomentDataToDOM);
  } else {
    applyMomentDataToDOM();
  }

  window.VanviMomentLoader = {
    fetchById: fetchMomentById,
    applyToDOM: applyMomentDataToDOM
  };
})(window);
