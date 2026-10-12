/**
 * VANVI MOMENTS — LUXURY VAULT LOCK & CURIOSITY SYSTEM
 * Locks upcoming templates & features behind golden padlocks with
 * an ultra-curiosity-generating private atelier modal.
 */
(function(window) {
  'use strict';

  // 1. UNLOCKED TEMPLATES WHITELIST
  // (Top 5 Wedding, Top 5 Birthday, Top 2 Anniversary/Keepsake)
  const UNLOCKED_IDS = new Set([
    // Top Wedding
    'royal-vows-indian-wedding',
    'the-grand-royal-palace-wedding',
    'royal-palace-wedding',
    'sacred-temple-edition',
    'floral-mehendi-story',
    'ivory-arch-wedding',
    'wedding-floating-lotus',
    'vanvi-royal-wedding',

    // Top 5 Birthday
    'birthday-3d-candle-surprise',
    'cute-pastel-birthday',
    'birthday-retro-polaroid',
    'retro-birthday-polaroid',
    'birthday-white-bloom-001',
    'birthday-white-bloom',
    'birthday-wish-1',
    'birthday-wish-01',

    // Top 2 Anniversary & Keepsakes
    'golden-anniversary',
    'constellation-love'
  ]);

  const VanviVault = {
    unlockedIds: UNLOCKED_IDS,

    isUnlocked: function(idOrSlug) {
      if (!idOrSlug) return false;
      const clean = String(idOrSlug).toLowerCase().trim();
      return UNLOCKED_IDS.has(clean);
    },

    init: function() {
      this.injectStylesIfNeeded();
      this.injectModalDom();
      this.bindEvents();
      this.scanAndLockCards();
    },

    injectStylesIfNeeded: function() {
      if (!document.querySelector('link[href*="vanvi-vault-lock.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'css/vanvi-vault-lock.css';
        document.head.appendChild(link);
      }
    },

    injectModalDom: function() {
      if (document.getElementById('vanviVaultModal')) return;

      const modalHtml = `
        <div class="vanvi-vault-modal-backdrop" id="vanviVaultModal" role="dialog" aria-modal="true" aria-hidden="true">
          <div class="vanvi-vault-modal-window">
            <div class="modal-gold-aura"></div>
            <button class="modal-close-cross" id="closeVaultModalBtn" aria-label="Close modal">✕</button>

            <!-- Floating 3D Padlock Display -->
            <div class="vault-anim-badge">
              <span class="padlock-big">🔒</span>
              <span class="sparkle-orbit">✨</span>
            </div>

            <div class="vault-pill-tag">✦ VANVI PRIVATE ATELIER · DROP SOON ✦</div>
            <h2 class="vault-modal-title">
              Private Vault Locked
              <span class="vault-template-highlight" id="vaultModalTemplateName">Exclusive Couture Edition</span>
            </h2>

            <p class="vault-modal-desc">
              Shh... Ye exclusive experience abhi hamari private design atelier mein handcraft ho raha hai! 
              <strong>24K gold foil physics</strong>, <strong>bespoke shehnai &amp; 3D spatial sound</strong> aur 
              <strong>cinematic reveal animations</strong> par kaam chal raha hai. Launch hotey hi limited collectors ke liye release hoga!
            </p>

            <div class="vault-features-dock">
              <span class="vault-feat-chip">💎 24K Gold Detailing</span>
              <span class="vault-feat-chip">✨ 3D Spatial Effects</span>
              <span class="vault-feat-chip">🎵 Bespoke Symphony</span>
              <span class="vault-feat-chip">📜 Royal Wax Seal</span>
            </div>

            <!-- VIP Early Access Input Box -->
            <div class="vault-vip-card">
              <div class="vault-vip-title">
                <span>👑</span> VIP Priority Access List Join Karein
              </div>
              <div class="vault-input-group" id="vaultInputGroup">
                <input type="text" class="vault-email-input" id="vaultVipInput" placeholder="WhatsApp / Email no..." autocomplete="off">
                <button class="vault-submit-btn" id="vaultVipSubmitBtn">Get Secret Invite ✦</button>
              </div>
              <div class="vault-success-msg" id="vaultSuccessMsg">
                🎉 <strong>Aap VIP Priority List mein jud gaye hain!</strong><br>
                Release hotey hi secret early access pass sabse pehle aapko milega.
              </div>
            </div>

            <!-- Explore Active Templates Link -->
            <button class="btn-explore-live" id="vaultExploreLiveBtn">
              <span>Explore Currently Live Collections (12+) →</span>
            </button>
          </div>
        </div>
      `;

      document.body.insertAdjacentHTML('beforeend', modalHtml);
    },

    bindEvents: function() {
      document.addEventListener('click', (e) => {
        // Close modal button
        if (e.target.closest('#closeVaultModalBtn')) {
          this.closeModal();
          return;
        }

        // Close on backdrop click outside window
        const backdrop = document.getElementById('vanviVaultModal');
        if (backdrop && e.target === backdrop) {
          this.closeModal();
          return;
        }

        // VIP Early Access submit button
        if (e.target.closest('#vaultVipSubmitBtn')) {
          this.handleVipSubmit();
          return;
        }

        // Explore Live button
        if (e.target.closest('#vaultExploreLiveBtn')) {
          this.closeModal();
          const target = document.getElementById('weddingGrid') || document.getElementById('templatesGrid') || document.querySelector('.templates-grid');
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            window.location.href = 'templates.html';
          }
          return;
        }

        // Trigger on any locked element click
        const lockedCard = e.target.closest('.is-vault-locked, [data-vault-locked="true"]');
        if (lockedCard) {
          e.preventDefault();
          e.stopPropagation();
          const title = lockedCard.getAttribute('data-vault-title') || 
                        lockedCard.querySelector('.tpl-title, .card-title, h3')?.textContent || 
                        'Exclusive Couture Edition';
          this.openModal(title.trim());
        }
      });

      // Escape key to close
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this.closeModal();
      });
    },

    openModal: function(title) {
      this.injectModalDom();
      const modal = document.getElementById('vanviVaultModal');
      const nameEl = document.getElementById('vaultModalTemplateName');
      const successMsg = document.getElementById('vaultSuccessMsg');
      const inputGrp = document.getElementById('vaultInputGroup');
      const input = document.getElementById('vaultVipInput');

      if (nameEl) nameEl.textContent = title ? `— “${title}”` : '— Exclusive Couture Edition';
      if (successMsg) successMsg.style.display = 'none';
      if (inputGrp) inputGrp.style.display = 'flex';
      if (input) input.value = '';

      if (modal) {
        modal.classList.add('is-active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    },

    closeModal: function() {
      const modal = document.getElementById('vanviVaultModal');
      if (modal) {
        modal.classList.remove('is-active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    },

    handleVipSubmit: function() {
      const input = document.getElementById('vaultVipInput');
      const val = input ? input.value.trim() : '';
      if (!val || val.length < 4) {
        if (input) {
          input.style.borderColor = '#ff2a7a';
          input.focus();
        }
        return;
      }

      try {
        const list = JSON.parse(localStorage.getItem('vanvi_vip_vault_waitlist') || '[]');
        list.push({ contact: val, timestamp: new Date().toISOString() });
        localStorage.setItem('vanvi_vip_vault_waitlist', JSON.stringify(list));
      } catch(e) {}

      const inputGrp = document.getElementById('vaultInputGroup');
      const successMsg = document.getElementById('vaultSuccessMsg');
      if (inputGrp) inputGrp.style.display = 'none';
      if (successMsg) successMsg.style.display = 'block';
    },

    scanAndLockCards: function() {
      // 1. In wedding.html: Lock all cards except the top 5 flagship wedding templates
      const weddingCards = document.querySelectorAll('#weddingGrid .tpl-card');
      if (weddingCards && weddingCards.length > 0) {
        weddingCards.forEach((card, idx) => {
          // Keep first 5 cards unlocked (Grand Royal Palace, Vedic Temple, Botanical, etc.)
          if (idx >= 5) {
            this.applyLockToCard(card);
          }
        });
      }
    },

    applyLockToCard: function(card) {
      if (!card || card.classList.contains('is-vault-locked')) return;
      card.classList.add('is-vault-locked');
      card.setAttribute('data-vault-locked', 'true');

      // Update badge
      const badge = card.querySelector('.badge-pill, .card-badge-top-right');
      if (badge) {
        badge.className = 'vault-lock-badge';
        badge.innerHTML = '🔒 VAULT DROP';
      }

      // Add center emblem to stage / art box
      const stage = card.querySelector('.card-stage, .card-art-box');
      if (stage && !stage.querySelector('.vault-overlay-center')) {
        const center = document.createElement('div');
        center.className = 'vault-overlay-center';
        center.innerHTML = '<span class="vault-lock-icon">🔒</span>';
        stage.appendChild(center);
      }

      // Update action buttons
      const buttons = card.querySelectorAll('a, button');
      buttons.forEach(btn => {
        btn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          const title = card.querySelector('.tpl-title, .card-title, h3')?.textContent || 'Exclusive Edition';
          VanviVault.openModal(title.trim());
        };
      });
    }
  };

  window.VanviVault = VanviVault;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => VanviVault.init());
  } else {
    VanviVault.init();
  }
})(typeof window !== 'undefined' ? window : this);
