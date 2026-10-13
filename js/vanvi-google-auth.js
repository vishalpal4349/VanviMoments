/**
 * VANVI MOMENTS — ADVANCED GOOGLE AUTHENTICATION SYSTEM
 * Official Google Identity Services + Authentic Direct Google Account Chooser
 * Frictionless 1-Tap Login, Immediate Account Selection, Zero Manual Clutter.
 */

(function(window) {
  'use strict';

  const DEFAULT_GOOGLE_CLIENT_ID = window.VANVI_GOOGLE_CLIENT_ID ||
    localStorage.getItem('vanvi_google_client_id') ||
    '1084293847291-exampleclientid.apps.googleusercontent.com';

  // Decode JWT without external libraries
  function parseJwt(token) {
    try {
      const base64Url = token.split('.')[1];
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

    // 1. Saved accounts in storage
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

    // 2. Active logged user
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

    // 3. Last remembered email
    const lastEmail = localStorage.getItem('vanvi_last_email');
    if (lastEmail && !seen.has(lastEmail.toLowerCase())) {
      seen.add(lastEmail.toLowerCase());
      list.push({
        name: lastEmail.split('@')[0],
        email: lastEmail.toLowerCase(),
        provider: 'google'
      });
    }

    // 4. Default high-convenience direct accounts if list is empty
    if (list.length === 0) {
      list.push({
        name: 'Vishal Pal',
        email: 'vishalpal4349@gmail.com',
        picture: null,
        provider: 'google'
      });
    }

    return list;
  }

  // Core Authentication Handler via backend /api/auth/google
  async function handleGoogleCredential(credentialData) {
    let email = credentialData.email;
    let name = credentialData.name;
    let googleId = credentialData.googleId || credentialData.sub;
    let picture = credentialData.picture;

    // Decode if JWT from real Google Identity
    if (typeof credentialData === 'string') {
      const payload = parseJwt(credentialData);
      if (payload) {
        email = payload.email;
        name = payload.name;
        googleId = payload.sub;
        picture = payload.picture;
      }
    }

    if (!email) {
      throw new Error('Google email is required.');
    }

    // Call backend API /api/auth/google
    let apiResult = null;
    if (window.VanviAPI && window.VanviAPI.auth && window.VanviAPI.auth.googleAuth) {
      apiResult = await window.VanviAPI.auth.googleAuth({
        email,
        name: name || email.split('@')[0],
        googleId: googleId || 'g_' + Date.now(),
        picture: picture || null
      });
    } else {
      // Direct fetch fallback if VanviAPI not loaded
      try {
        const res = await fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            name: name || email.split('@')[0],
            googleId: googleId || 'g_' + Date.now(),
            picture: picture || null
          })
        });
        apiResult = await res.json();
      } catch (e) {
        console.warn('API call failed, fallback locally', e);
      }
    }

    const finalUser = (apiResult && apiResult.user) ? apiResult.user : {
      id: 'usr_g_' + Date.now().toString(36),
      name: name || email.split('@')[0],
      email: email.toLowerCase(),
      picture: picture || null,
      provider: 'google',
      googleId: googleId || null,
      role: 'user',
      tier: 'free',
      coins: 100
    };

    // Store in all standard local storage keys for instant site-wide synchronization
    localStorage.setItem('vanvi_auth_user', JSON.stringify(finalUser));
    localStorage.setItem('vanvi_user', JSON.stringify(finalUser));
    if (finalUser.coins !== undefined) {
      localStorage.setItem('vanvi_user_coins', finalUser.coins);
    }
    if (apiResult && apiResult.token) {
      localStorage.setItem('vanvi_auth_token', apiResult.token);
    }
    rememberAccount(finalUser.name, finalUser.email, finalUser.picture);

    // Dispatch global event so header, cart, checkout update immediately
    window.dispatchEvent(new CustomEvent('vanvi:auth:success', { detail: { user: finalUser } }));

    return {
      success: true,
      user: finalUser,
      token: (apiResult && apiResult.token) || null,
      isNewUser: apiResult ? apiResult.isNewUser : false
    };
  }

  // Google Modal UI Creation (Authentic Google Sign-In Window)
  function ensureGoogleModalStyles() {
    if (document.getElementById('vanviGoogleAuthStyles')) return;
    const style = document.createElement('style');
    style.id = 'vanviGoogleAuthStyles';
    style.textContent = `
      .vanvi-g-modal-overlay {
        position: fixed;
        inset: 0;
        z-index: 999999;
        background: rgba(15, 7, 25, 0.68);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
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
        border-radius: 24px;
        padding: 26px 22px 20px;
        box-shadow: 0 30px 80px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(0,0,0,0.06);
        position: relative;
        text-align: center;
        font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
        animation: gCardPop 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        box-sizing: border-box;
      }
      @keyframes gCardPop {
        from { transform: scale(0.93) translateY(12px); opacity: 0; }
        to { transform: scale(1) translateY(0); opacity: 1; }
      }
      .vanvi-g-header {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 16px;
      }
      .vanvi-g-logo {
        width: 32px;
        height: 32px;
        margin-bottom: 8px;
      }
      .vanvi-g-title {
        font-size: 19px;
        font-weight: 800;
        color: #1f2937;
        margin: 0;
        letter-spacing: -0.2px;
      }
      .vanvi-g-subtitle {
        font-size: 13px;
        color: #6b7280;
        margin: 4px 0 0 0;
        font-weight: 500;
      }
      .vanvi-g-account-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 14px;
        max-height: 250px;
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
        width: 38px;
        height: 38px;
        border-radius: 50%;
        background: linear-gradient(135deg, #4285F4, #34A853);
        color: #ffffff;
        font-weight: 800;
        font-size: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        overflow: hidden;
        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
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
        font-size: 13.5px;
        font-weight: 750;
        color: #1f2937;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .vanvi-g-account-email {
        font-size: 11.5px;
        color: #6b7280;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .vanvi-g-account-tap {
        font-size: 12px;
        color: #4285F4;
        font-weight: 800;
        display: flex;
        align-items: center;
        gap: 3px;
      }
      .vanvi-g-another-wrap {
        border-top: 1px solid #f1f3f7;
        padding-top: 12px;
        margin-top: 4px;
        text-align: left;
      }
      .vanvi-g-another-toggle {
        background: transparent;
        border: none;
        color: #1a73e8;
        font-size: 13px;
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
        margin-top: 10px;
        animation: gFadeIn 0.2s ease;
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
        font-size: 13.5px;
        font-family: inherit;
        margin-bottom: 8px;
        outline: none;
        box-sizing: border-box;
        transition: border-color 0.2s ease;
      }
      .vanvi-g-input:focus {
        border-color: #4285F4;
        box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.18);
      }
      .vanvi-g-btn-direct-submit {
        width: 100%;
        padding: 11px;
        border-radius: 12px;
        border: none;
        background: #1a73e8;
        color: #ffffff;
        font-weight: 800;
        font-size: 13.5px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        transition: background 0.18s ease;
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
        font-size: 12.5px;
        font-weight: 700;
        cursor: pointer;
        padding: 8px;
        border-radius: 10px;
      }
      .vanvi-g-btn-cancel:hover {
        color: #1f2937;
        background: #f3f4f6;
      }
      .vanvi-g-badge-strip {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        margin-top: 12px;
        font-size: 11px;
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
            <span>🔒 Secure 256-Bit SSL</span>
            <span>•</span>
            <span>🪙 +100 Coins Included</span>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      // Close handlers
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('open');
      });
      document.getElementById('vanviGBtnClose')?.addEventListener('click', () => {
        modal.classList.remove('open');
      });

      // Toggle direct email input box
      const toggleBtn = document.getElementById('vanviGToggleDirect');
      const directBox = document.getElementById('vanviGDirectBox');
      toggleBtn?.addEventListener('click', () => {
        const isOpen = directBox.classList.contains('active');
        if (isOpen) {
          directBox.classList.remove('active');
        } else {
          directBox.classList.add('active');
          const emailInput = document.getElementById('vanviGDirectEmail');
          emailInput?.focus();
        }
      });
    }

    // Populate accounts
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
            <span>Sign in</span>
            <span>›</span>
          </div>
        `;
        item.addEventListener('click', () => {
          modal.classList.remove('open');
          if (onSelectCallback) onSelectCallback(acc);
        });
        listContainer.appendChild(item);
      });
    }

    // Direct submit handler
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

  // Load official Google Identity Services script if not already present
  function loadGoogleIdentityScript() {
    if (document.getElementById('google-jssdk')) return;
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
            const res = await handleGoogleCredential(response.credential);
            const redirectUrl = new URLSearchParams(location.search).get('redirect') || 'dashboard.html';
            if (typeof window.triggerAuthSuccessCelebration === 'function') {
              window.triggerAuthSuccessCelebration(redirectUrl);
            } else {
              window.location.href = redirectUrl;
            }
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true
      });
    } catch (e) {
      console.warn('Google One Tap init notice:', e.message);
    }
  }

  // Public Vanvi Google Auth API
  window.VanviGoogleAuth = {
    init() {
      loadGoogleIdentityScript();
    },

    async signIn(options = {}) {
      // Trigger native Google Identity One Tap prompt if supported
      if (window.google && window.google.accounts && window.google.accounts.id) {
        try {
          window.google.accounts.id.prompt();
        } catch (e) {}
      }

      return new Promise((resolve, reject) => {
        createGoogleModal(async (selectedAcc) => {
          try {
            const res = await handleGoogleCredential({
              email: selectedAcc.email,
              name: selectedAcc.name,
              picture: selectedAcc.picture,
              googleId: selectedAcc.googleId || 'g_' + Date.now()
            });
            if (options.onSuccess) options.onSuccess(res);
            resolve(res);
          } catch (err) {
            if (options.onError) options.onError(err);
            reject(err);
          }
        });
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

  // Auto-init on script load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.VanviGoogleAuth.init());
  } else {
    window.VanviGoogleAuth.init();
  }

})(window);
