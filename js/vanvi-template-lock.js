/**
 * VANVI MOMENTS — UNIVERSAL TEMPLATE VIEWPORT & STAGE LOCK SCRIPT
 * Automatically locks templates to centered canvas, disables zoom gestures & distortions,
 * and ensures flawless adaptation on all mobile and desktop viewports.
 * Reusable rule automatically applied to current and future templates.
 */
(function initVanviTemplateLock() {
  'use strict';

  // 1. Lock Viewport Meta Tag (Prevent pinch zoom, double-tap zoom distortion)
  let vp = document.querySelector('meta[name="viewport"]');
  if (!vp) {
    vp = document.createElement('meta');
    vp.name = 'viewport';
    document.head.appendChild(vp);
  }
  vp.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';

  // 2. Prevent multi-finger pinch-zoom on touch devices
  document.addEventListener('touchstart', function (e) {
    if (e.touches && e.touches.length > 1) {
      e.preventDefault();
    }
  }, { passive: false });

  // Prevent gesture zoom on mobile safari / iOS / Chrome
  document.addEventListener('gesturestart', function (e) {
    e.preventDefault();
  }, { passive: false });

  document.addEventListener('gesturechange', function (e) {
    e.preventDefault();
  }, { passive: false });

  document.addEventListener('gestureend', function (e) {
    e.preventDefault();
  }, { passive: false });

  // 3. Prevent rapid double-tap zoom
  let lastTouchEnd = 0;
  document.addEventListener('touchend', function (event) {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, { passive: false });

  // 4. Ensure Template Container is Centered & Sized
  const stageSelectors = [
    '#device',
    '#device-frame',
    '.device-container',
    '.experience-container',
    '.experience-stage',
    '.gift-app-container',
    '.polaroid-stage',
    '.envelope-showcase-container',
    '.hero-celestial-stage',
    '.main-wrapper',
    '.page-container',
    '.template-stage',
    '.template-wrapper',
    '.wedding-stage',
    '.canvas-wrapper',
    '.main-stage',
    '.grand-palace-stage',
    '.temple-stage-container',
    '.stage-container',
    '.vows-card',
    '.voucher-card',
    '.invite-card',
    '.container:not(.website-container):not(.navbar-container):not(.footer-container)',
    'main:not(.website-main)'
  ].join(', ');

  function lockTemplateStage() {
    const isMobile = window.innerWidth <= 540;
    const stage = document.querySelector(stageSelectors);
    if (stage) {
      if (!isMobile) {
        stage.style.maxWidth = '480px';
        stage.style.marginLeft = 'auto';
        stage.style.marginRight = 'auto';
      }
      stage.style.position = 'relative';
      stage.style.boxSizing = 'border-box';
    }
  }

  // 5. Purge any bulky demo watermarks, cookie banners and top corner popups completely across templates
  function purgeWatermarksAndPopups() {
    const toRemove = document.querySelectorAll('#demoWatermarkBadge, .vanvi-draft-watermark, .draft-watermark, .top-nav-bar, .nav-builder-pill, .vanvi-cookie-banner, .cookie-banner');
    toRemove.forEach(el => el.remove());

    // If template-adapter isn't already managing the watermark, ensure subtle luxury watermark is active
    if (!document.getElementById('vanviSubtleWatermark') && typeof window.VanviMomentLoader === 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const isPaidOrPublished = Boolean(
        params.get('paid') === 'true' ||
        params.get('purchased') === 'true' ||
        params.get('status') === 'published'
      );
      const isInIframe = (function() {
        try { return window.self !== window.top; } catch(e) { return false; }
      })();

      if (isPaidOrPublished || (!isInIframe && (params.get('recipient') || params.get('name')))) {
        const wm = document.createElement('a');
        wm.id = 'vanviSubtleWatermark';
        wm.className = 'vanvi-subtle-watermark';
        wm.href = '../../index.html';
        wm.title = 'Crafted with Vanvi Moments';
        wm.target = '_blank';
        wm.style.cssText = 'position:fixed!important;bottom:14px!important;right:14px!important;z-index:99999!important;display:inline-flex!important;align-items:center!important;gap:6px!important;padding:5px 12px!important;border-radius:99px!important;background:rgba(255,255,255,0.85)!important;backdrop-filter:blur(10px)!important;border:1px solid rgba(255,120,175,0.3)!important;box-shadow:0 4px 14px rgba(0,0,0,0.08)!important;font-family:system-ui,sans-serif!important;font-size:11px!important;font-weight:750!important;color:#59354d!important;text-decoration:none!important;user-select:none!important;opacity:0.9!important;';
        wm.innerHTML = `<span style="color:#d97706;font-size:11px;">✦</span><span>Vanvi Moments</span>`;
        document.body.appendChild(wm);
      }
    }
  }

  // 6. Smart Builder Link & Make It Yours Protection
  // Prevents preview iframes from recursively opening builder.html inside themselves.
  // Instead, switches parent builder to edit mode or navigates top window.
  function setupSmartBuilderCtaLinks() {
    const isInIframe = (function() {
      try { return window.self !== window.top; } catch(e) { return true; }
    })();

    const builderSelectors = [
      'a[href*="builder.html"]',
      'a[href*="builder"]',
      '.vanvi-btn-cta-builder',
      '.btn-customize-cta',
      '#customizeCtaBtn',
      '#btnCustomizeAgain',
      '.btn-luxe-studio',
      '#btnFinaleCustomize',
      '.top-customize-pill',
      '.watermark-unlock-btn',
      '.vanvi-studio-pill',
      '.vanvi-top-badge',
      '.brand-watermark',
      '.brand-badge',
      '.icon-btn[href*="builder"]'
    ].join(', ');

    const triggerEditInParent = function(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();
      }

      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'VANVI_SWITCH_TO_EDIT' }, '*');
        try {
          if (typeof window.parent.setMobileView === 'function') {
            window.parent.setMobileView('edit');
          }
          if (typeof window.parent.switchMobileTab === 'function') {
            window.parent.switchMobileTab('form');
          }
          if (typeof window.parent.switchTab === 'function') {
            window.parent.switchTab('edit');
          }
          const pSidebar = window.parent.document.querySelector('.builder-sidebar, .builder-form-pane, #builderSidebar');
          if (pSidebar && typeof pSidebar.scrollTo === 'function') {
            pSidebar.scrollTo({ top: 0, behavior: 'smooth' });
          }
        } catch(err) {}
      }
    };

    if (isInIframe) {
      document.querySelectorAll(builderSelectors).forEach(el => {
        const text = (el.textContent || '').trim();
        if (text && (text.includes('Make it yours') || text.includes('Create Yours') || text.includes('Customize') || text.includes('Edit in Wedding Builder') || text.includes('Studio Builder') || text.includes('Edit'))) {
          el.setAttribute('title', 'Return to Studio Edit Panel');
          const span = el.querySelector('span:not(.vanvi-cta-free-chip)') || el;
          if (span && !span.dataset.smartUpdated) {
            span.dataset.smartUpdated = 'true';
            span.innerHTML = '✏️ Edit This Moment';
          }
        }
        el.addEventListener('click', triggerEditInParent, true);
      });
    } else {
      document.querySelectorAll('a[href*="builder.html"]').forEach(el => {
        el.setAttribute('target', '_top');
      });
    }
  }

  // Global Capturing Click Interceptor for any builder links inside iframes
  document.addEventListener('click', function (e) {
    const target = e.target && e.target.closest('a[href*="builder.html"], a[href*="builder"], .vanvi-btn-cta-builder, #btnCustomizeAgain, #customizeCtaBtn, .btn-customize-cta');
    if (target) {
      const isInIframe = (function() {
        try { return window.self !== window.top; } catch(err) { return true; }
      })();
      if (isInIframe) {
        e.preventDefault();
        e.stopPropagation();
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();

        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ type: 'VANVI_SWITCH_TO_EDIT' }, '*');
          try {
            if (typeof window.parent.setMobileView === 'function') window.parent.setMobileView('edit');
            if (typeof window.parent.switchMobileTab === 'function') window.parent.switchMobileTab('form');
            if (typeof window.parent.switchTab === 'function') window.parent.switchTab('edit');
            const pSidebar = window.parent.document.querySelector('.builder-sidebar, .builder-form-pane, #builderSidebar');
            if (pSidebar && typeof pSidebar.scrollTo === 'function') {
              pSidebar.scrollTo({ top: 0, behavior: 'smooth' });
            }
          } catch(err) {}
        }
      }
    }
  }, true);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      lockTemplateStage();
      purgeWatermarksAndPopups();
      setupSmartBuilderCtaLinks();
    });
  } else {
    lockTemplateStage();
    purgeWatermarksAndPopups();
    setupSmartBuilderCtaLinks();
  }

  // Builder-side listener: switches builder to edit mode when requested by child preview iframe
  window.addEventListener('message', function (e) {
    if (e.data && e.data.type === 'VANVI_SWITCH_TO_EDIT') {
      try {
        if (typeof window.setMobileView === 'function') window.setMobileView('edit');
        if (typeof window.switchMobileTab === 'function') window.switchMobileTab('form');
        if (typeof window.switchTab === 'function') window.switchTab('edit');
        
        document.body.classList.remove('show-preview-mode', 'mobile-view-preview', 'tab-preview');
        document.body.classList.add('show-form-mode', 'mobile-view-edit', 'tab-edit');

        const editBtn = document.querySelector('#tabBtnForm, [data-tab="edit"], [data-tab="form"], #dockBtnEdit, .tab-btn-form');
        if (editBtn) editBtn.click();

        const sidebar = document.querySelector('.builder-sidebar, .builder-form-pane, #builderSidebar, aside');
        if (sidebar && typeof sidebar.scrollTo === 'function') {
          sidebar.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } catch (err) {}
    }
  });

  window.addEventListener('resize', lockTemplateStage);
  window.addEventListener('orientationchange', lockTemplateStage);
})();
