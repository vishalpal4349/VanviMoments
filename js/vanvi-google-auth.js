/**
 * VANVI MOMENTS — REAL OFFICIAL GOOGLE IDENTITY SERVICES (GIS)
 * Direct official Google authentication without fake fallbacks or mock data.
 */

(function(window) {
  'use strict';

  let GOOGLE_CLIENT_ID = '';
  let googleClientIdPromise = null;
  let googleScriptPromise = null;
  let googleInitialized = false;

  function showGoogleUnavailable(message = 'Google sign-in is not configured. Add GOOGLE_CLIENT_ID in server settings to enable it.') {
    const container = document.getElementById('gsiButtonContainer');
    if (!container) return;
    container.textContent = message;
    container.setAttribute('role', 'status');
    container.classList.add('google-signin-status');
  }

  async function resolveGoogleClientId() {
    if (GOOGLE_CLIENT_ID) return GOOGLE_CLIENT_ID;
    if (!googleClientIdPromise) {
      googleClientIdPromise = fetch('/api/config/public', { cache: 'no-store' })
        .then(response => {
          if (!response.ok) throw new Error(`Public config returned ${response.status}`);
          return response.json();
        })
        .then(config => {
          const serverClientId = typeof config.googleClientId === 'string' ? config.googleClientId.trim() : '';
          GOOGLE_CLIENT_ID = serverClientId;
          return GOOGLE_CLIENT_ID;
        })
        .catch(error => {
          console.warn('[Google Auth] Could not load public OAuth configuration:', error.message);
          GOOGLE_CLIENT_ID = '';
          return '';
        });
    }
    return googleClientIdPromise;
  }

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

  // Real Backend Authentication via /api/auth/google
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
      throw new Error('Google credential is required.');
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

    const finalUser = apiResult.user;
    if (finalUser) {
      localStorage.setItem('vanvi_auth_user', JSON.stringify(finalUser));
      localStorage.setItem('vanvi_user', JSON.stringify(finalUser));
      if (finalUser.coins !== undefined) {
        localStorage.setItem('vanvi_user_coins', finalUser.coins);
      }
      if (finalUser.email) {
        localStorage.setItem('vanvi_last_email', finalUser.email);
      }
    }
    if (apiResult.token) {
      localStorage.setItem('vanvi_auth_token', apiResult.token);
    }

    window.dispatchEvent(new CustomEvent('vanvi:auth:success', { detail: { user: finalUser } }));

    return {
      success: true,
      user: finalUser,
      token: apiResult.token || null,
      isNewUser: !!apiResult.isNewUser
    };
  }

  // Load Google Identity Services script
  async function loadGoogleIdentityScript() {
    if (!await resolveGoogleClientId()) {
      showGoogleUnavailable();
      return false;
    }

    if (window.google?.accounts?.id) {
      initGoogleOneTap();
      return true;
    }

    if (!googleScriptPromise) {
      googleScriptPromise = new Promise(resolve => {
        const script = document.createElement('script');
        script.id = 'google-jssdk';
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.head.appendChild(script);
      });
    }
    const loaded = await googleScriptPromise;
    if (!loaded || !window.google?.accounts?.id) {
      showGoogleUnavailable('Google sign-in could not load. Check the connection and OAuth configuration.');
      return false;
    }
    initGoogleOneTap();
    return true;
  }

  function initGoogleOneTap() {
    if (!GOOGLE_CLIENT_ID || !window.google?.accounts?.id || googleInitialized) return;
    try {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response) => {
          if (response && response.credential) {
            try {
              const res = await handleGoogleCredential(response.credential);
              const requestedRedirect = new URLSearchParams(location.search).get('redirect');
              const redirectUrl = window.vanviSafeRedirect
                ? window.vanviSafeRedirect(requestedRedirect)
                : 'dashboard.html';
              if (typeof window.triggerAuthSuccessCelebration === 'function') {
                window.triggerAuthSuccessCelebration(redirectUrl);
              } else {
                window.location.href = redirectUrl;
              }
            } catch (err) {
              console.error('[Google GIS Error]', err.message);
              alert(err.message || 'Google authentication failed.');
            }
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true
      });
      googleInitialized = true;
    } catch (e) {
      console.warn('Google Identity initialization notice:', e.message);
    }
  }

  // Public Vanvi Google Auth API
  window.VanviGoogleAuth = {
    isConfigured() {
      return Boolean(GOOGLE_CLIENT_ID);
    },

    async init() {
      await loadGoogleIdentityScript();
    },

    async renderButton(targetElementId, options = {}) {
      if (!await loadGoogleIdentityScript()) return;
      const el = document.getElementById(targetElementId);
      if (!el) return;

      try {
        el.innerHTML = '';
        window.google.accounts.id.renderButton(el, {
          theme: options.theme || 'outline',
          size: options.size || 'large',
          shape: options.shape || 'pill',
          text: options.text || 'continue_with',
          width: options.width || 310,
          logo_alignment: 'left'
        });
        el.style.display = 'flex';
      } catch (e) {
        console.warn('GIS renderButton notice:', e.message);
      }
    },

    async signIn(options = {}) {
      if (!await loadGoogleIdentityScript()) {
        if (options.onError) options.onError(new Error('Google sign-in is not configured yet.'));
        return;
      }
      if (window.google && window.google.accounts && window.google.accounts.id) {
        try {
          window.google.accounts.id.prompt((notification) => {
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
              if (options.onError) {
                options.onError(new Error('Google One-Tap is not available in this browser context. Please use the Google sign-in button.'));
              }
            }
          });
          return;
        } catch (e) {
          if (options.onError) options.onError(e);
        }
      }
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
