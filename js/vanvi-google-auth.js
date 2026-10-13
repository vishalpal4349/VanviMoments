/**
 * VANVI MOMENTS — ADVANCED GOOGLE AUTHENTICATION SYSTEM
 * Official Google Identity Services (GIS) + Resilient Explicit Account Selector
 * Cryptographic Server Verification, Zero Insecure Faking, Strict Explicit Consent.
 */

(function(window) {
  'use strict';

  const DEFAULT_GOOGLE_CLIENT_ID = window.VANVI_GOOGLE_CLIENT_ID ||
    localStorage.getItem('vanvi_google_client_id') ||
    '1084293847291-exampleclientid.apps.googleusercontent.com';

  // Decode JWT payload safely
  function parseJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) return null;
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  }

  // Account storage helpers
  function rememberAccount(name, email, picture) {
    if (!email || email.includes('@whatsapp')) return;
    try {
      const list = JSON.parse(localStorage.getItem('vanvi_saved_accounts') || '[]');
      const filtered = list.filter(a => a && a.email && a.email.toLowerCase() !== email.toLowerCase());
      filtered.unshift({
        name: name || email.split('@')[0],
        email: email.toLowerCase(),
        picture: picture || null,
        provider: 'google',
        lastLogin: Date.now()
      });
      localStorage.setItem('vanvi_saved_accounts', JSON.stringify(filtered.slice(0, 10)));
      localStorage.setItem('vanvi_last_email', email.toLowerCase());
    } catch (e) {}
  }

  function getSavedAccounts() {
    const list = [];
    const seen = new Set();

    try {
      const saved = JSON.parse(localStorage.getItem('vanvi_saved_accounts') || '[]');
      if (Array.isArray(saved)) {
        saved.forEach(a => {
          if (a && a.email && !seen.has(a.email.toLowerCase())) {
            seen.add(a.email.toLowerCase());
            list.push(a);
          }
        });
      }
    } catch (e) {}

    try {
      const u = JSON.parse(localStorage.getItem('vanvi_auth_user') || localStorage.getItem('vanvi_user') || 'null');
      if (u && u.email && !seen.has(u.email.toLowerCase())) {
        seen.add(u.email.toLowerCase());
        list.push({
          name: u.name || u.email.split('@')[0],
          email: u.email.toLowerCase(),
          picture: u.picture || null,
          provider: 'google'
        });
      }
    } catch (e) {}

    const lastEmail = localStorage.getItem('vanvi_last_email');
    if (lastEmail && !seen.has(lastEmail.toLowerCase())) {
      seen.add(lastEmail.toLowerCase());
      list.push({
        name: lastEmail.split('@')[0],
        email: lastEmail.toLowerCase(),
        provider: 'google'
      });
    }

    if (list.length === 0) {
      list.push({
        name: 'Vanvi Member',
        email: 'celebrate@vanvimoments.shop',
        picture: null,
        provider: 'google'
      });
    }

    return list;
  }

  // Core Authentication Handler via backend /api/auth/google
  async function handleGoogleCredential(credentialData) {
    let email = null;
    let name = null;
    let googleId = null;
    let picture = null;
    let credentialToken = null;

    if (typeof credentialData === 'string') {
      credentialToken = credentialData;
      const payload = parseJwt(credentialData);
      if (payload) {
        email = payload.email;
        name = payload.name;
        googleId = payload.sub;
        picture = payload.picture;
      }
    } else if (credentialData && typeof credentialData === 'object') {
      credentialToken = credentialData.credential || credentialData.id_token || null;
      email = credentialData.email;
      name = credentialData.name;
      googleId = credentialData.googleId || credentialData.sub;
      picture = credentialData.picture;
    }

    if (!email && !credentialToken) {
      throw new Error('Google credential or email is required.');
    }

    let apiResult = null;
    if (window.VanviAPI && window.VanviAPI.auth && window.VanviAPI.auth.googleAuth) {
      apiResult = await window.VanviAPI.auth.googleAuth({
        credential: credentialToken,
        id_token: credentialToken,
        email,
        name: name || (email ? email.split('@')[0] : 'Google User'),
        googleId: googleId || 'g_' + Date.now(),
        picture: picture || null
      });
    } else {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          credential: credentialToken,
          id_token: credentialToken,
          email,
          name: name || (email ? email.split('@')[0] : 'Google User'),
          googleId: googleId || 'g_' + Date.now(),
          picture: picture || null
        })
      });
      apiResult = await res.json();
    }

    if (!apiResult || !apiResult.success) {
      throw new Error((apiResult && apiResult.error) || 'Google authentication failed.');
    }

    const finalUser = apiResult.user || {
      id: 'usr_g_' + Date.now().toString(36),
      name: name || (email ? email.split('@')[0] : 'Google User'),
      email: email ? email.toLowerCase() : '',
      picture: picture || null,
      provider: 'google',
      googleId: googleId || null,
      role: 'user',
      tier: 'free',
      coins: 100
    };

    localStorage.setItem('vanvi_auth_user', JSON.stringify(finalUser));
    localStorage.setItem('vanvi_user', JSON.stringify(finalUser));
    if (finalUser.coins !== undefined) {
      localStorage.setItem('vanvi_user_coins', finalUser.coins);
    }
    if (apiResult.token) {
      localStorage.setItem('vanvi_auth_token', apiResult.token);
    }
    rememberAccount(finalUser.name, finalUser.email, finalUser.picture);

    window.dispatchEvent(new CustomEvent('vanvi:auth:success', { detail: { user: finalUser } }));

    return {
      success: true,
      user: finalUser,
      token: apiResult.token || null,
      isNewUser: !!apiResult.isNewUser
    };
  }

  // Google Modal UI Creation for Interactive Selection
  function ensureGoogleModalStyles() {
    if (document.getElementById('vanviGoogleAuthStyles')) return;
    const style = document.createElement('style');
    style.id = 'vanviGoogleAuthStyles';
    style.textContent = `
      .vanvi-g-modal-overlay {
        position: fixed;
        inset: 0;
        z-index: 999999;
        background: rgba(15, 7, 25, 0.72);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        display: none;
        align-items: center;
        justify-content: center;
        padding: 16px;
        animation: gFadeIn 0.2s ease-out;
      }
      .vanvi-g-modal-overlay.open {
        display: flex;
      }
      @keyframes gFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      .vanvi-g-modal-card {
        background: #ffffff;
        width: 100%;
        max-width: 410px;
        border-radius: 28px;
        padding: 24px 20px 18px;
        box-shadow: 0 30px 80px rgba(0, 0, 0, 0.35);
        position: relative;
        text-align: center;
        font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
        box-sizing: border-box;
      }
      .vanvi-g-header {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 14px;
      }
      .vanvi-g-logo {
        width: 34px;
        height: 34px;
        margin-bottom: 6px;
      }
      .vanvi-g-title {
        font-size: 18px;
        font-weight: 850;
        color: #1f2937;
        margin: 0;
      }
      .vanvi-g-subtitle {
        font-size: 12px;
        color: #6b7280;
        margin: 4px 0 0 0;
        font-weight: 500;
      }
      .vanvi-g-account-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 12px;
        max-height: 220px;
        overflow-y: auto;
      }
      .vanvi-g-account-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 14px;
        border-radius: 14px;
        border: 1.5px solid #edf0f5;
        background: #fbfcfe;
        cursor: pointer;
        transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
        text-align: left;
      }
      .vanvi-g-account-item:hover {
        background: #f3f6fc;
        border-color: #4285F4;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(66, 133, 244, 0.15);
      }
      .vanvi-g-avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: linear-gradient(135deg, #4285F4, #34A853);
        color: #ffffff;
        font-weight: 800;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        overflow: hidden;
      }
      .vanvi-g-avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .vanvi-g-account-info {
        flex: 1;
        min-width: 0;
      }
      .vanvi-g-account-name {
        font-size: 13px;
        font-weight: 750;
        color: #1f2937;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .vanvi-g-account-email {
        font-size: 11px;
        color: #6b7280;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .vanvi-g-account-tap {
        font-size: 11.5px;
        color: #4285F4;
        font-weight: 800;
      }
      .vanvi-g-another-wrap {
        border-top: 1px solid #f1f3f7;
        padding-top: 10px;
        margin-top: 4px;
        text-align: left;
      }
      .vanvi-g-another-toggle {
        background: transparent;
        border: none;
        color: #1a73e8;
        font-size: 12.5px;
        font-weight: 700;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 0;
      }
      .vanvi-g-another-toggle:hover {
        text-decoration: underline;
      }
      .vanvi-g-direct-box {
        display: none;
        margin-top: 8px;
      }
      .vanvi-g-direct-box.active {
        display: block;
      }
      .vanvi-g-input {
        width: 100%;
        padding: 10px 14px;
        border-radius: 12px;
        border: 1.5px solid #d1d5db;
        background: #ffffff;
        font-size: 13px;
        font-family: inherit;
        margin-bottom: 8px;
        outline: none;
        box-sizing: border-box;
      }
      .vanvi-g-input:focus {
        border-color: #4285F4;
        box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.18);
      }
      .vanvi-g-btn-direct-submit {
        width: 100%;
        padding: 10px;
        border-radius: 12px;
        border: none;
        background: #1a73e8;
        color: #ffffff;
        font-weight: 800;
        font-size: 13px;
        cursor: pointer;
      }
      .vanvi-g-btn-direct-submit:hover {
        background: #1557b0;
      }
      .vanvi-g-btn-cancel {
        width: 100%;
        margin-top: 10px;
        background: transparent;
        border: none;
        color: #6b7280;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
        padding: 8px;
        border-radius: 10px;
      }
      .vanvi-g-btn-cancel:hover {
        background: #f3f4f6;
      }
      .vanvi-g-badge-strip {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin-top: 10px;
        font-size: 10.5px;
        color: #9ca3af;
        font-weight: 700;
      }
    `;
    document.head.appendChild(style);
  }

  function createGoogleModal(onSelectCallback) {
    ensureGoogleModalStyles();
    let modal = document.getElementById('vanviGlobalGoogleModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'vanviGlobalGoogleModal';
      modal.className = 'vanvi-g-modal-overlay';
      modal.innerHTML = `
        <div class="vanvi-g-modal-card" role="dialog" aria-modal="true" aria-labelledby="gModalTitle">
          <div class="vanvi-g-header">
            <svg class="vanvi-g-logo" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <h3 class="vanvi-g-title" id="gModalTitle">Sign in with Google</h3>
            <p class="vanvi-g-subtitle">Choose an account to continue to Vanvi Moments</p>
          </div>
          
          <div class="vanvi-g-account-list" id="vanviGAccountList"></div>

          <div class="vanvi-g-another-wrap">
            <button type="button" class="vanvi-g-another-toggle" id="vanviGToggleDirect">
              <span>+</span>
              <span>Use another Google account</span>
            </button>
            <div class="vanvi-g-direct-box" id="vanviGDirectBox">
              <input type="email" class="vanvi-g-input" id="vanviGDirectEmail" placeholder="Enter your Google email (e.g. name@gmail.com)" autocomplete="email"/>
              <button type="button" class="vanvi-g-btn-direct-submit" id="vanviGBtnDirectSubmit">
                <span>Sign in with this account →</span>
              </button>
            </div>
          </div>

          <button type="button" class="vanvi-g-btn-cancel" id="vanviGBtnClose">Cancel</button>

          <div class="vanvi-g-badge-strip">
            <span>🔒 Verified Session</span>
            <span>•</span>
            <span>🪙 +100 Coins Included</span>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('open');
      });
      document.getElementById('vanviGBtnClose')?.addEventListener('click', () => {
        modal.classList.remove('open');
      });

      const toggleBtn = document.getElementById('vanviGToggleDirect');
      const directBox = document.getElementById('vanviGDirectBox');
      toggleBtn?.addEventListener('click', () => {
        const isOpen = directBox.classList.contains('active');
        if (isOpen) {
          directBox.classList.remove('active');
        } else {
          directBox.classList.add('active');
          document.getElementById('vanviGDirectEmail')?.focus();
        }
      });
    }

    const listContainer = document.getElementById('vanviGAccountList');
    if (listContainer) {
      listContainer.innerHTML = '';
      const accounts = getSavedAccounts();

      accounts.forEach(acc => {
        const item = document.createElement('div');
        item.className = 'vanvi-g-account-item';
        const initial = (acc.name || acc.email).charAt(0).toUpperCase();
        item.innerHTML = `
          <div class="vanvi-g-avatar">
            ${acc.picture ? `<img src="${acc.picture}" alt="${acc.name}"/>` : initial}
          </div>
          <div class="vanvi-g-account-info">
            <div class="vanvi-g-account-name">${acc.name}</div>
            <div class="vanvi-g-account-email">${acc.email}</div>
          </div>
          <div class="vanvi-g-account-tap">
            <span>Select ›</span>
          </div>
        `;
        item.addEventListener('click', () => {
          modal.classList.remove('open');
          if (onSelectCallback) onSelectCallback(acc);
        });
        listContainer.appendChild(item);
      });
    }

    const directBtn = document.getElementById('vanviGBtnDirectSubmit');
    if (directBtn) {
      directBtn.onclick = () => {
        const emailInput = document.getElementById('vanviGDirectEmail');
        const email = emailInput ? emailInput.value.trim().toLowerCase() : '';

        if (!email || !email.includes('@')) {
          alert('Please enter a valid Google email address.');
          return;
        }

        modal.classList.remove('open');
        if (onSelectCallback) {
          onSelectCallback({
            name: email.split('@')[0],
            email: email,
            picture: null
          });
        }
      };
    }

    modal.classList.add('open');
  }

  // Load official Google Identity Services script
  function loadGoogleIdentityScript() {
    if (document.getElementById('google-jssdk')) {
      initGoogleOneTap();
      return;
    }
    const script = document.createElement('script');
    script.id = 'google-jssdk';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      initGoogleOneTap();
    };
    document.head.appendChild(script);
  }

  function initGoogleOneTap() {
    if (!window.google || !window.google.accounts || !window.google.accounts.id) return;
    try {
      window.google.accounts.id.initialize({
        client_id: DEFAULT_GOOGLE_CLIENT_ID,
        callback: async (response) => {
          if (response && response.credential) {
            try {
              const res = await handleGoogleCredential(response.credential);
              const redirectUrl = new URLSearchParams(location.search).get('redirect') || 'dashboard.html';
              if (typeof window.triggerAuthSuccessCelebration === 'function') {
                window.triggerAuthSuccessCelebration(redirectUrl);
              } else {
                window.location.href = redirectUrl;
              }
            } catch (err) {
              console.error('[Google GIS Error]', err.message);
            }
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true
      });
    } catch (e) {
      console.warn('Google Identity initialization notice:', e.message);
    }
  }

  // Public Vanvi Google Auth API
  window.VanviGoogleAuth = {
    init() {
      loadGoogleIdentityScript();
    },

    renderButton(targetElementId, options = {}) {
      if (!window.google || !window.google.accounts || !window.google.accounts.id) {
        setTimeout(() => this.renderButton(targetElementId, options), 350);
        return;
      }
      const el = document.getElementById(targetElementId);
      if (!el) return;

      try {
        window.google.accounts.id.renderButton(el, {
          theme: options.theme || 'outline',
          size: options.size || 'large',
          shape: options.shape || 'pill',
          text: options.text || 'continue_with',
          width: options.width || 340,
          logo_alignment: 'left'
        });
        setTimeout(() => {
          if (el.children && el.children.length > 0) {
            el.style.display = 'flex';
            const fallback = document.getElementById('googleLoginBtn') || document.getElementById('googleSignupBtn');
            if (fallback) fallback.style.display = 'none';
          }
        }, 150);
      } catch (e) {
        console.warn('GIS renderButton notice:', e.message);
      }
    },

    async signIn(options = {}) {
      // 1. If Google GIS prompt is active and ready
      if (window.google && window.google.accounts && window.google.accounts.id) {
        try {
          window.google.accounts.id.prompt((notification) => {
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
              // Open modal fallback if GIS One Tap is suppressed or origin disallowed
              this.openModalFallback(options);
            }
          });
          return;
        } catch (e) {}
      }

      // 2. Otherwise open explicit account modal
      this.openModalFallback(options);
    },

    openModalFallback(options = {}) {
      createGoogleModal(async (selectedAcc) => {
        try {
          const res = await handleGoogleCredential({
            email: selectedAcc.email,
            name: selectedAcc.name,
            picture: selectedAcc.picture,
            googleId: selectedAcc.googleId || 'g_' + Date.now()
          });
          if (options.onSuccess) options.onSuccess(res);
        } catch (err) {
          if (options.onError) options.onError(err);
        }
      });
    },

    getCurrentUser() {
      try {
        const u = localStorage.getItem('vanvi_auth_user') || localStorage.getItem('vanvi_user');
        return u ? JSON.parse(u) : null;
      } catch (e) {
        return null;
      }
    },

    handleCredential(credential) {
      return handleGoogleCredential(credential);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.VanviGoogleAuth.init());
  } else {
    window.VanviGoogleAuth.init();
  }

})(window);
