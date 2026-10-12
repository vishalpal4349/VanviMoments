/**
 * VANVI MOMENTS — UNIVERSAL BUILDER SMART RESPONSIVE ENGINE (v2.0)
 * 
 * Provides:
 * 1. Automatic Mobile Viewport Detection & 1-Tap Toggle between Edit Mode & Fullscreen Preview.
 * 2. Syncs updates from form fields into preview frame seamlessly.
 * 3. Eliminates all 50%/50% half-screen cutoffs on mobile devices.
 */

(function () {
  'use strict';

  function initSmartBuilder() {
    // Check if already initialized
    if (document.getElementById('vanviBuilderMobileBar')) return;

    // Detect if page is a builder studio page
    const hasLayout = document.querySelector(
      '.builder-layout, .shaadi-builder-container, .studio-main, .studio-body, .builder-form-pane, .builder-sidebar, .editor-pane'
    );
    if (!hasLayout) return;

    // 0. Ensure Standard Top-Left Back Button in Builder Header
    const headerEl = document.querySelector('.studio-header, .builder-header, .shaadi-builder-header, .header-bar, .app-header, header');
    if (headerEl && !headerEl.querySelector('.vanvi-builder-back-btn, .vanvi-btn-back, .btn-back')) {
      const backBtn = document.createElement('a');
      backBtn.href = '../../templates.html';
      backBtn.className = 'vanvi-builder-back-btn';
      backBtn.title = 'Back to All Templates';
      backBtn.innerHTML = '<span class="back-arrow">‹</span> <span>Templates</span>';
      headerEl.prepend(backBtn);
    }

    // Detect Checkout/Publish button link & text
    let checkoutHref = '#';
    let checkoutText = '👑 Publish';
    const mainCheckoutBtn = document.querySelector(
      '#proceedCheckoutBtn, #btnProceedCheckout, #btnSavePublish, .btn-save-publish, .builder-save-btn, .btn-checkout'
    );

    if (mainCheckoutBtn) {
      checkoutHref = mainCheckoutBtn.getAttribute('href') || '#';
      if (mainCheckoutBtn.textContent && mainCheckoutBtn.textContent.trim()) {
        const txt = mainCheckoutBtn.textContent.trim();
        if (txt.includes('Publish') || txt.includes('Activate') || txt.includes('Checkout')) {
          checkoutText = '👑 Publish';
        }
      }
    }

    // Create Mobile Dock Bar
    const mobileBar = document.createElement('div');
    mobileBar.id = 'vanviBuilderMobileBar';
    mobileBar.className = 'vanvi-builder-mobile-bar';
    mobileBar.innerHTML = `
      <div class="vanvi-mobile-switch-group" role="tablist" aria-label="Builder View Switcher">
        <button type="button" class="vanvi-mobile-switch-btn active" id="vanviMobileTabEdit" role="tab" aria-selected="true">
          <span>✏️</span> <span>Customize</span>
        </button>
        <button type="button" class="vanvi-mobile-switch-btn" id="vanviMobileTabPreview" role="tab" aria-selected="false">
          <span>👁️</span> <span>Full Preview</span>
        </button>
      </div>
      <button type="button" class="vanvi-mobile-action-btn" id="vanviMobileActionBtn">
        ${checkoutText}
      </button>
    `;
    document.body.appendChild(mobileBar);

    const tabEdit = document.getElementById('vanviMobileTabEdit');
    const tabPreview = document.getElementById('vanviMobileTabPreview');
    const actionBtn = document.getElementById('vanviMobileActionBtn');

    // Switch to Edit Mode
    function setEditMode() {
      document.body.classList.remove('vanvi-builder-preview-active');
      tabEdit.classList.add('active');
      tabPreview.classList.remove('active');
      tabEdit.setAttribute('aria-selected', 'true');
      tabPreview.setAttribute('aria-selected', 'false');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Switch to Full Preview Mode
    function setPreviewMode() {
      // Trigger any active preview updater in the page before displaying
      if (typeof window.updatePreview === 'function') {
        try { window.updatePreview(); } catch (e) {}
      }
      if (typeof window.applyPreview === 'function') {
        try { window.applyPreview(); } catch (e) {}
      }
      if (typeof window.syncBuilderToPreview === 'function') {
        try { window.syncBuilderToPreview(); } catch (e) {}
      }
      const applyBtn = document.getElementById('btnApplyPreview');
      if (applyBtn) {
        try { applyBtn.click(); } catch(e) {}
      }

      document.body.classList.add('vanvi-builder-preview-active');
      tabPreview.classList.add('active');
      tabEdit.classList.remove('active');
      tabPreview.setAttribute('aria-selected', 'true');
      tabEdit.setAttribute('aria-selected', 'false');
    }

    tabEdit.addEventListener('click', setEditMode);
    tabPreview.addEventListener('click', setPreviewMode);

    // Forward click from floating action button to original checkout / save button
    actionBtn.addEventListener('click', function (e) {
      if (mainCheckoutBtn) {
        if (mainCheckoutBtn.tagName.toLowerCase() === 'a' && mainCheckoutBtn.href) {
          window.location.href = mainCheckoutBtn.href;
        } else {
          mainCheckoutBtn.click();
        }
      } else {
        const saveBtn = document.querySelector('.btn-save-primary, .builder-save-btn');
        if (saveBtn) saveBtn.click();
      }
    });

    // Also support any existing in-page preview buttons (e.g. #saveAndLaunchBtn, #btnApplyPreview, #tabBtnPreview)
    const existingPreviewToggles = document.querySelectorAll(
      '#tabBtnPreview, [data-action="preview"], .btn-test-fullscreen'
    );
    existingPreviewToggles.forEach(btn => {
      btn.addEventListener('click', function (e) {
        if (window.innerWidth <= 960) {
          e.preventDefault();
          setPreviewMode();
        }
      });
    });

    const existingCustomizeToggles = document.querySelectorAll('#tabBtnCustomize');
    existingCustomizeToggles.forEach(btn => {
      btn.addEventListener('click', function (e) {
        if (window.innerWidth <= 960) {
          e.preventDefault();
          setEditMode();
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSmartBuilder);
  } else {
    initSmartBuilder();
  }
})();
