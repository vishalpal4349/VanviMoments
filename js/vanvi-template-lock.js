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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      lockTemplateStage();
      purgeWatermarksAndPopups();
    });
  } else {
    lockTemplateStage();
    purgeWatermarksAndPopups();
  }

  window.addEventListener('resize', lockTemplateStage);
  window.addEventListener('orientationchange', lockTemplateStage);
})();
