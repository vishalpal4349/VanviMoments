/**
 * VANVI MOMENTS — GLOBAL PREMIUM WEB EXPERIENCE RUNTIME
 * Mobile-First Viewport Engine, Fluid Scaling, and Universal Visual System
 */
(function(window, document) {
  'use strict';

  // 1. Precise Mobile Viewport Height Calculation (--vanvi-vh)
  function setRealViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vanvi-vh', `${vh}px`);
    document.documentElement.style.setProperty('--vanvi-real-height', `${window.innerHeight}px`);
  }

  setRealViewportHeight();
  window.addEventListener('resize', setRealViewportHeight, { passive: true });
  window.addEventListener('orientationchange', () => {
    setTimeout(setRealViewportHeight, 100);
  }, { passive: true });

  // 2. Auto-Inject Global Premium Stylesheet if Missing
  function ensureGlobalStylesheet() {
    if (document.getElementById('vanvi-global-experience-css')) return;

    // Calculate relative path to root based on pathname
    const pathname = window.location.pathname.replace(/\\/g, '/');
    let prefix = '';
    if (pathname.includes('/templates/')) {
      const parts = pathname.split('/templates/')[1].split('/').filter(Boolean);
      prefix = '../'.repeat(parts.length);
    }

    const link = document.createElement('link');
    link.id = 'vanvi-global-experience-css';
    link.rel = 'stylesheet';
    link.href = prefix + 'css/vanvi-global-experience.css';
    document.head.appendChild(link);
  }

  ensureGlobalStylesheet();

  // 3. Smooth Intersection Reveal for Elements
  function initScrollReveals() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('vanvi-reveal');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.08
    });

    document.querySelectorAll('.scroll-animate, .vanvi-card, .template-card, .catalog-card').forEach(el => {
      observer.observe(el);
    });
  }

  // 4. Safe Image Lazy-Loading Fallback
  function initLazyImages() {
    if ('loading' in HTMLImageElement.prototype) {
      document.querySelectorAll('img:not([loading])').forEach(img => {
        // Exclude critical logos or icons
        if (!img.classList.contains('brand-logo-img') && !img.closest('.nav-brand-static') && !img.closest('.brand-luxury-polish')) {
          img.setAttribute('loading', 'lazy');
        }
      });
    }
  }

  // 5. Initialize on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initScrollReveals();
      initLazyImages();
    });
  } else {
    initScrollReveals();
    initLazyImages();
  }

  // Expose API
  window.VanviGlobalExperience = {
    version: '1.6.0',
    recalculateViewport: setRealViewportHeight
  };

})(window, document);
