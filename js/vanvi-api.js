/**
 * VANVI MOMENTS — UNIFIED CLIENT API ADAPTER
 * Connects all frontend pages to the production backend with resilient offline fallback.
 */

(function(window) {
  'use strict';

  // Global Safe Back Navigation
  if (!window.vanviGoBack) {
    window.vanviGoBack = function(fallback) {
      if (window.history && window.history.length > 1) {
        window.history.back();
        return false;
      }
      window.location.href = fallback || 'index.html';
      return false;
    };
  }
  if (!window.safeGoBack) {
    window.safeGoBack = function(fallback) {
      if (window.history && window.history.length > 1) {
        window.history.back();
        return false;
      }
      window.location.href = fallback || 'index.html';
      return false;
    };
  }

  // Target backend server: use relative URL on production domains; on localhost dev server proxy to :3000
  let API_BASE = '';
  if (typeof window !== 'undefined' && window.location) {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:';
    if (isLocal && window.location.port !== '3000') {
      API_BASE = 'http://127.0.0.1:3000';
    } else {
      API_BASE = '';
    }
  }

  const STORAGE_KEY_TOKEN = 'vanvi_auth_token';
  const STORAGE_KEY_USER = 'vanvi_auth_user';

  let cachedToken = localStorage.getItem(STORAGE_KEY_TOKEN) || null;
  let cachedUser = null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USER);
    if (raw) cachedUser = JSON.parse(raw);
  } catch(e) {}

  const authListeners = [];

  function notifyAuth() {
    authListeners.forEach(cb => {
      try { cb(cachedUser); } catch(e) {}
    });
  }

  function syncWalletCache(user) {
    localStorage.setItem('vanvi_user_coins', Math.max(0, Number(user && user.coins) || 0));
    localStorage.setItem('vanvi_template_credits', Math.max(0, Number(user && user.templateCredits) || 0));
    if (user && user.activePass) localStorage.setItem('vanvi_active_pass', user.activePass);
    else localStorage.removeItem('vanvi_active_pass');
    if (user && user.passExpiry) localStorage.setItem('vanvi_pass_expiry', user.passExpiry);
    else localStorage.removeItem('vanvi_pass_expiry');
  }

  async function request(endpoint, options = {}) {
    let url = `${API_BASE}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(cachedToken ? { 'Authorization': `Bearer ${cachedToken}` } : {}),
      ...options.headers
    };

    try {
      let response = await fetch(url, {
        method: options.method || 'GET',
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined
      });

      // If static dev server (like Live Server) returned 405 Method Not Allowed or 404,
      // automatically retry against backend server at http://localhost:3000!
      if ((response.status === 405 || response.status === 404) && API_BASE !== 'http://localhost:3000') {
        try {
          const fallbackRes = await fetch(`http://localhost:3000${endpoint}`, {
            method: options.method || 'GET',
            headers,
            body: options.body ? JSON.stringify(options.body) : undefined
          });
          if (fallbackRes.ok || fallbackRes.status === 400 || fallbackRes.status === 401) {
            response = fallbackRes;
            API_BASE = 'http://localhost:3000';
          }
        } catch (e) {}
      }

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        return {
          success: false,
          status: response.status,
          error: data.error || `Request failed with status ${response.status}`
        };
      }

      return { success: true, status: response.status, ...data };
    } catch (err) {
      // Direct network retry against http://localhost:3000 if not already tried
      if (API_BASE !== 'http://localhost:3000') {
        try {
          const retryRes = await fetch(`http://localhost:3000${endpoint}`, {
            method: options.method || 'GET',
            headers,
            body: options.body ? JSON.stringify(options.body) : undefined
          });
          const retryData = await retryRes.json().catch(() => ({}));
          if (retryRes.ok || retryRes.status === 400 || retryRes.status === 401) {
            API_BASE = 'http://localhost:3000';
            return { success: retryRes.ok, status: retryRes.status, ...retryData };
          }
        } catch (e) {}
      }
      return {
        success: false,
        offline: true,
        error: 'Backend API is currently unreachable.'
      };
    }
  }

  const VanviAPI = {
    // 1. Health & Status
    async isOnline() {
      try {
        const res = await fetch(`${API_BASE}/api/health`, { method: 'GET' });
        return res.ok;
      } catch (e) {
        return false;
      }
    },

    // 2. Authentication
    auth: {
      getToken() {
        return cachedToken;
      },
      getUser() {
        return cachedUser;
      },
      isAuthenticated() {
        return !!cachedToken;
      },
      onAuthChange(cb) {
        if (typeof cb === 'function') authListeners.push(cb);
      },

      async signup({ name, email, password, phone, identifier }) {
        const idVal = identifier || email || phone;
        const res = await request('/api/auth/signup', {
          method: 'POST',
          body: { name, identifier: idVal, email, password, phone }
        });

        if (res.success && res.token) {
          cachedToken = res.token;
          cachedUser = res.user;
          localStorage.setItem(STORAGE_KEY_TOKEN, res.token);
          localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(res.user));
          syncWalletCache(res.user);
          notifyAuth();
        }
        return res;
      },

      async login({ email, password, identifier, phone }) {
        const idVal = identifier || email || phone;
        const res = await request('/api/auth/login', {
          method: 'POST',
          body: { identifier: idVal, email, phone, password }
        });

        if (res.success && res.token) {
          cachedToken = res.token;
          cachedUser = res.user;
          localStorage.setItem(STORAGE_KEY_TOKEN, res.token);
          localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(res.user));
          syncWalletCache(res.user);
          notifyAuth();
        }
        return res;
      },

      async googleAuth({ email, name, googleId, picture, credential, id_token } = {}) {
        const res = await request('/api/auth/google', {
          method: 'POST',
          body: { email, name, googleId, picture, credential, id_token }
        });

        if (res.success && res.token) {
          cachedToken = res.token;
          cachedUser = res.user;
          localStorage.setItem(STORAGE_KEY_TOKEN, res.token);
          localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(res.user));
          syncWalletCache(res.user);
          notifyAuth();
        }
        return res;
      },

      async forgotPassword({ identifier, email, phone } = {}) {
        const idVal = identifier || email || phone;
        return await request('/api/auth/forgot-password', {
          method: 'POST',
          body: { identifier: idVal, email, phone }
        });
      },

      async verifyResetOtp({ email, identifier, otp } = {}) {
        const idVal = email || identifier;
        return await request('/api/auth/verify-reset-otp', {
          method: 'POST',
          body: { email: idVal, otp }
        });
      },

      async resetPassword({ email, identifier, otp, newPassword, password } = {}) {
        const idVal = email || identifier;
        const passVal = newPassword || password;
        return await request('/api/auth/reset-password', {
          method: 'POST',
          body: { email: idVal, otp, newPassword: passVal }
        });
      },

      logout() {
        cachedToken = null;
        cachedUser = null;
        localStorage.removeItem(STORAGE_KEY_TOKEN);
        localStorage.removeItem(STORAGE_KEY_USER);
        localStorage.removeItem('vanvi_user_coins');
        localStorage.removeItem('vanvi_template_credits');
        localStorage.removeItem('vanvi_active_pass');
        localStorage.removeItem('vanvi_pass_expiry');
        notifyAuth();
        return { success: true };
      }
    },

    // 3. Moments Management
    moments: {
      async list() {
        const res = await request('/api/moments');
        if (res.success) return res.moments || [];

        // Offline / Guest Fallback to localStorage
        try {
          const raw = localStorage.getItem('vanvi_user_moments') || '[]';
          return JSON.parse(raw);
        } catch(e) {
          return [];
        }
      },

      async saveDraft(momentData) {
        const res = await request('/api/moments/draft', {
          method: 'POST',
          body: momentData
        });

        // Also keep local fallback synced
        try {
          const raw = localStorage.getItem('vanvi_user_moments') || '[]';
          const list = JSON.parse(raw);
          const moment = (res.success && res.moment) ? res.moment : {
            id: 'vm_' + Date.now(),
            ...momentData,
            status: 'draft',
            createdAt: Date.now()
          };
          const idx = list.findIndex(m => m.id === moment.id || (m.recipient === moment.recipient && m.occasion === moment.occasion));
          if (idx >= 0) list[idx] = moment;
          else list.unshift(moment);
          localStorage.setItem('vanvi_user_moments', JSON.stringify(list));
        } catch(e) {}

        return res;
      },

      async getPublic(slug) {
        return await request(`/api/moments/public/${encodeURIComponent(slug)}`);
      },

      async verifyPin(slug, pin) {
        return await request(`/api/moments/public/${encodeURIComponent(slug)}/verify-pin`, {
          method: 'POST',
          body: { pin }
        });
      },

      async react(slug) {
        return await request(`/api/moments/public/${encodeURIComponent(slug)}/react`, {
          method: 'POST'
        });
      },

      async delete(id) {
        const res = await request(`/api/moments/${encodeURIComponent(id)}`, {
          method: 'DELETE'
        });

        // Sync local
        try {
          const raw = localStorage.getItem('vanvi_user_moments') || '[]';
          let list = JSON.parse(raw);
          list = list.filter(m => m.id !== id);
          localStorage.setItem('vanvi_user_moments', JSON.stringify(list));
        } catch(e) {}

        return res;
      }
    },

    // 4. Coins & Loyalty Ledger
    coins: {
      async getBalance() {
        const res = await request('/api/coins/balance');
        if (res.success) {
          localStorage.setItem('vanvi_user_coins', res.coins);
          return res;
        }

        const cachedCoins = Number(cachedUser && cachedUser.coins);
        const coins = Number.isFinite(cachedCoins) ? Math.max(0, cachedCoins) : 0;
        return {
          success: false,
          offline: true,
          error: res.error || 'Unable to refresh your coin balance.',
          coins,
          rupeeValue: (coins / 10).toFixed(2),
          canSpin: false,
          nextSpinInHours: null,
          ledger: []
        };
      },

      async spin() {
        const res = await request('/api/coins/spin', { method: 'POST' });
        if (res.success && res.newCoinBalance !== undefined) {
          localStorage.setItem('vanvi_user_coins', res.newCoinBalance);
          localStorage.setItem('vanvi_last_spin_time', Date.now());
        }
        return res;
      },

      async calculateEligibility({ orderAmountINR, userCoins, tier, templateId }) {
        return await request('/api/coins/calculate-eligibility', {
          method: 'POST',
          body: { orderAmountINR, userCoins, tier, templateId }
        });
      },

      async convertToCredits(coins) {
        const res = await request('/api/coins/convert-to-credits', {
          method: 'POST',
          body: { coins }
        });
        if (res.success) {
          if (res.newCoins !== undefined) localStorage.setItem('vanvi_user_coins', res.newCoins);
          if (res.newCredits !== undefined) localStorage.setItem('vanvi_template_credits', res.newCredits);
        }
        return res;
      }
    },

    // 5. Orders & Payments
    orders: {
      async create({ momentId, templateName, templatePrice, templateId, applyCoins, applyPassCredits }) {
        return await request('/api/orders/create', {
          method: 'POST',
          body: { momentId, templateName, templatePrice, templateId, applyCoins, applyPassCredits }
        });
      },

      async verifyPayment({ orderId, paymentId, signature, momentData }) {
        const res = await request('/api/payments/verify', {
          method: 'POST',
          body: { orderId, paymentId, signature, momentData }
        });

        // On success, sync local storage as well
        if (res.success) {
          try {
            const raw = localStorage.getItem('vanvi_user_moments') || '[]';
            const list = JSON.parse(raw);
            list.unshift({
              id: res.momentId || ('vm_' + Date.now()),
              title: momentData ? momentData.title : 'Celebration Moment',
              recipient: momentData ? momentData.recipient : 'Someone Special',
              sender: momentData ? momentData.sender : 'You',
              occasion: momentData ? momentData.occasion : 'Celebration',
              message: momentData ? momentData.message : '',
              photos: momentData ? momentData.photos : [],
              status: 'published',
              slug: res.momentSlug,
              views: 1,
              hearts: 0,
              createdAt: Date.now()
            });
            localStorage.setItem('vanvi_user_moments', JSON.stringify(list));
          } catch(e) {}
        }

        return res;
      }
    },

    // 6. AI Generation
    ai: {
      async generate({ prompt, occasion, recipient, style }) {
        return await request('/api/ai/generate', {
          method: 'POST',
          body: { prompt, occasion, recipient, style }
        });
      },

      async chat({ message, history, userContext }) {
        return await request('/api/ai/chat', {
          method: 'POST',
          body: { message, history, userContext }
        });
      }
    },

    // 7. Secure Media Upload (Cloudinary with Local Fallback)
    upload: {
      async getConfig() {
        return await request('/api/upload/config');
      },

      async photo(base64Data, originalName, options = {}) {
        return await this.media({
          base64Data,
          originalName,
          assetType: 'image',
          templateId: options.templateId || options.template_id,
          momentId: options.momentId || options.moment_id
        });
      },

      async media({ file, base64Data, originalName, templateId, momentId, assetType = 'image', onProgress }) {
        // If we have base64Data, use standard /api/upload endpoint
        const payload = {
          file: base64Data,
          originalName: originalName || (file ? file.name : `asset_${Date.now()}`),
          templateId: templateId || null,
          momentId: momentId || null,
          assetType: assetType || 'image'
        };

        return await request('/api/upload', {
          method: 'POST',
          body: payload
        });
      },

      async getAssets(momentId) {
        return await request(`/api/upload/assets/${encodeURIComponent(momentId)}`);
      }
    },

    // 8. Memberships
    membership: {
      async getPlans() {
        return await request('/api/membership/plans');
      },

      async getStatus() {
        return await request('/api/membership/status');
      },

      async subscribe(planId) {
        const res = await request('/api/membership/subscribe', {
          method: 'POST',
          body: { planId }
        });
        if (res.success && res.user) {
          cachedUser = res.user;
          localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(res.user));
          if (res.user.coins !== undefined) {
            localStorage.setItem('vanvi_user_coins', res.user.coins);
          }
          notifyAuth();
        }
        return res;
      },

      async buyPass(passId) {
        const res = await request('/api/membership/buy-pass', {
          method: 'POST',
          body: { passId }
        });
        if (res.success) {
          if (res.user) {
            cachedUser = res.user;
            localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(res.user));
          }
          if (res.totalCredits !== undefined) {
            localStorage.setItem('vanvi_template_credits', res.totalCredits);
            localStorage.setItem('vanvi_active_pass', res.pass ? res.pass.name : 'Celebration Pass');
            if (res.passExpiry) localStorage.setItem('vanvi_pass_expiry', res.passExpiry);
          }
          notifyAuth();
        }
        return res;
      }
    },

    // 8b. Template Celebration Passes & Credit Economy (1 Credit = ₹1)
    passes: {
      getCredits() {
        return parseInt(localStorage.getItem('vanvi_template_credits') || '0', 10);
      },
      getActivePass() {
        return localStorage.getItem('vanvi_active_pass') || null;
      },
      getExpiry() {
        return localStorage.getItem('vanvi_pass_expiry') || null;
      },
      async buy(passId) {
        return await VanviAPI.membership.buyPass(passId);
      },
      deductCreditsLocally(creditsUsed) {
        const current = parseInt(localStorage.getItem('vanvi_template_credits') || '0', 10);
        const updated = Math.max(0, current - creditsUsed);
        localStorage.setItem('vanvi_template_credits', updated);
        return updated;
      }
    },

    // 9. Analytics
    analytics: {
      async track(eventName, properties = {}) {
        return await request('/api/analytics/event', {
          method: 'POST',
          body: { eventName, properties }
        });
      }
    },

    // 9. Contact & Inquiries
    contact: {
      async submit({ name, email, topic, orderId, message }) {
        return await request('/api/contact/submit', {
          method: 'POST',
          body: { name, email, topic, orderId, message }
        });
      }
    },

    // 10. Admin Services
    admin: {
      async getOverview() {
        return await request('/api/admin/overview');
      },

      async getUsers(query) {
        const q = query ? `?query=${encodeURIComponent(query)}` : '';
        return await request(`/api/admin/users${q}`);
      },

      async adjustCoins({ userId, amount, reason, type = 'credit' }) {
        return await request(`/api/admin/users/${encodeURIComponent(userId)}/coins`, {
          method: 'POST',
          body: { amount, reason, type }
        });
      },

      async updateUser(id, updates) {
        return await request(`/api/admin/users/${encodeURIComponent(id)}`, {
          method: 'PUT',
          body: updates
        });
      },

      async deleteUser(id) {
        return await request(`/api/admin/users/${encodeURIComponent(id)}`, {
          method: 'DELETE'
        });
      },

      async getMoments(query, status) {
        const params = new URLSearchParams();
        if (query) params.append('query', query);
        if (status) params.append('status', status);
        const q = params.toString() ? `?${params.toString()}` : '';
        return await request(`/api/admin/moments${q}`);
      },

      async setMomentStatus(id, status) {
        return await request(`/api/admin/moments/${encodeURIComponent(id)}/status`, {
          method: 'POST',
          body: { status }
        });
      },

      async getOrders() {
        return await request('/api/admin/orders');
      },

      async refundOrder(id, reason) {
        return await request(`/api/admin/orders/${encodeURIComponent(id)}/refund`, {
          method: 'POST',
          body: { reason }
        });
      },

      async getAuditLogs() {
        return await request('/api/admin/audit-logs');
      },

      async getCustomRequests() {
        return await request('/api/admin/custom-requests');
      },

      async updateCustomRequestStatus(id, status) {
        return await request(`/api/admin/custom-requests/${encodeURIComponent(id)}/status`, {
          method: 'POST',
          body: { status }
        });
      },

      async chatCopilot({ message, history, apiKey, confirmed, pendingAction }) {
        return await request('/api/admin/copilot', {
          method: 'POST',
          headers: apiKey ? { 'x-openai-key': apiKey } : {},
          body: { message, history, apiKey, confirmed, pendingAction }
        });
      },

      async chatAdminAi(payload) {
        return await request('/api/admin/ai/command', {
          method: 'POST',
          headers: payload.apiKey ? { 'x-openai-key': payload.apiKey } : {},
          body: payload
        });
      },

      // Templates CMS
      async getTemplates(params = {}) {
        const qs = new URLSearchParams();
        if (params.search) qs.append('search', params.search);
        if (params.category) qs.append('category', params.category);
        if (params.status) qs.append('status', params.status);
        if (params.limit) qs.append('limit', params.limit);
        if (params.offset) qs.append('offset', params.offset);
        const qStr = qs.toString() ? `?${qs.toString()}` : '';
        return await request(`/api/admin/templates${qStr}`);
      },

      async getTemplate(id) {
        return await request(`/api/admin/templates/${encodeURIComponent(id)}`);
      },

      async createTemplate(data) {
        return await request('/api/admin/templates', {
          method: 'POST',
          body: data
        });
      },

      async updateTemplate(id, updates) {
        return await request(`/api/admin/templates/${encodeURIComponent(id)}`, {
          method: 'PUT',
          body: updates
        });
      },

      async saveTemplateDraft(id, draftData) {
        return await request(`/api/admin/templates/${encodeURIComponent(id)}/draft`, {
          method: 'POST',
          body: draftData
        });
      },

      async publishTemplate(id) {
        return await request(`/api/admin/templates/${encodeURIComponent(id)}/publish`, {
          method: 'POST'
        });
      },

      async unpublishTemplate(id) {
        return await request(`/api/admin/templates/${encodeURIComponent(id)}/unpublish`, {
          method: 'POST'
        });
      },

      async deleteTemplate(id) {
        return await request(`/api/admin/templates/${encodeURIComponent(id)}`, {
          method: 'DELETE'
        });
      },

      async getTemplateVersions(id) {
        return await request(`/api/admin/templates/${encodeURIComponent(id)}/versions`);
      },

      async rollbackTemplate(id, version) {
        return await request(`/api/admin/templates/${encodeURIComponent(id)}/rollback`, {
          method: 'POST',
          body: { version }
        });
      },

      // Presets
      async getPresets() {
        return await request('/api/admin/presets');
      },

      async savePreset(data) {
        return await request('/api/admin/presets', {
          method: 'POST',
          body: data
        });
      },

      async duplicatePreset(id) {
        return await request(`/api/admin/presets/${encodeURIComponent(id)}/duplicate`, {
          method: 'POST'
        });
      },

      async clonePresetToTemplate(id, overrides = {}) {
        return await request(`/api/admin/presets/${encodeURIComponent(id)}/clone-to-template`, {
          method: 'POST',
          body: overrides
        });
      },

      async deletePreset(id) {
        return await request(`/api/admin/presets/${encodeURIComponent(id)}`, {
          method: 'DELETE'
        });
      },

      // Site Content
      async getSiteContent() {
        return await request('/api/admin/content');
      },

      async updateSiteContent(content) {
        return await request('/api/admin/content', {
          method: 'POST',
          body: content
        });
      },

      async rollbackSiteContent(versionId) {
        return await request('/api/admin/content/rollback', {
          method: 'POST',
          body: { versionId }
        });
      },

      // Media
      async getMedia(params = {}) {
        const qs = new URLSearchParams();
        if (params.type) qs.append('type', params.type);
        if (params.search) qs.append('search', params.search);
        if (params.limit) qs.append('limit', params.limit);
        const qStr = qs.toString() ? `?${qs.toString()}` : '';
        return await request(`/api/admin/media${qStr}`);
      },

      async uploadMedia(data) {
        return await request('/api/admin/media/upload', {
          method: 'POST',
          body: data
        });
      },

      async checkMediaUsage(url) {
        return await request('/api/admin/media/check-usage', {
          method: 'POST',
          body: { url }
        });
      },

      async deleteMedia(id, force = false) {
        return await request(`/api/admin/media/${encodeURIComponent(id)}?force=${force ? 'true' : 'false'}`, {
          method: 'DELETE'
        });
      },

      // Settings & Health
      async getSettings() {
        return await request('/api/admin/settings');
      },

      async updateSettings(settings) {
        return await request('/api/admin/settings', {
          method: 'PUT',
          body: settings
        });
      },

      async getHealth() {
        return await request('/api/admin/health');
      }
    },

    ai: {
      async chat({ message, history, userContext }) {
        return await request('/api/ai/chat', {
          method: 'POST',
          body: { message, history, userContext }
        });
      },
      async generate(data) {
        return await request('/api/ai/generate', {
          method: 'POST',
          body: data
        });
      }
    },

    contact: {
      async submit({ name, email, phone, topic, orderId, message, _vanvi_hp }) {
        return await request('/api/contact/submit', {
          method: 'POST',
          body: { name, email, phone, topic, orderId, message, _vanvi_hp }
        });
      },
      async reportIssue({ name, email, phone, category, pageUrl, description, deviceInfo, _vanvi_hp }) {
        return await request('/api/contact/report-issue', {
          method: 'POST',
          body: { name, email, phone, category, pageUrl, description, deviceInfo, _vanvi_hp }
        });
      }
    },

    request: request
  };

  window.VanviAPI = VanviAPI;

})(window);
