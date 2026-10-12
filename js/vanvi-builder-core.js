/**
 * VANVI MOMENTS — PHASE 5 BUILDER CORE INFRASTRUCTURE
 * Common reusable layer for all template-specific builders.
 * Provides Supabase persistence, Cloudinary upload, live preview sync, and VanviQR sharing.
 */

(function (window) {
  'use strict';

  class VanviBuilderCore {
    constructor() {
      this.templateId = null;
      this.momentId = null;
      this.templateConfig = null;
      this.customData = {};
      this.isSaving = false;
      this.listeners = {
        change: [],
        saveSuccess: [],
        saveError: []
      };
    }

    /**
     * Initialize builder with template ID and optional existing moment ID
     */
    async init({ templateId, momentId, onDataChange } = {}) {
      const urlParams = new URLSearchParams(window.location.search);
      this.templateId = templateId || urlParams.get('template') || urlParams.get('t') || 'birthday-3d-candle';
      this.momentId = momentId || urlParams.get('id') || urlParams.get('moment') || null;

      if (typeof onDataChange === 'function') {
        this.listeners.change.push(onDataChange);
      }

      // 1. Fetch template config
      try {
        const resp = await fetch(`/templates/${encodeURIComponent(this.templateId)}/template.json`);
        if (resp.ok) {
          this.templateConfig = await resp.json();
          this.customData = Object.assign({}, this.templateConfig.custom_data_defaults || {});
        }
      } catch (e) {
        console.warn('[VanviBuilderCore] Could not fetch template.json directly, trying fallback:', e);
      }

      // Fallback to VanviTemplatesData if available
      if (!this.templateConfig && window.VanviTemplatesData && window.VanviTemplatesData.templates) {
        const found = window.VanviTemplatesData.templates.find(t => t.id === this.templateId || (t.aliases && t.aliases.includes(this.templateId)));
        if (found) {
          this.templateConfig = found;
          this.customData = Object.assign({}, found.custom_data_defaults || {});
        }
      }

      // 2. If editing existing moment, fetch and populate
      if (this.momentId) {
        await this.loadExistingMoment(this.momentId);
      }

      return {
        templateId: this.templateId,
        templateConfig: this.templateConfig,
        customData: this.customData,
        momentId: this.momentId
      };
    }

    /**
     * Load existing moment from Supabase/API or local storage
     */
    async loadExistingMoment(momentId) {
      try {
        if (window.VanviAPI && window.VanviAPI.moments) {
          const m = await window.VanviAPI.moments.getById(momentId);
          if (m && (m.custom_data || m.customData)) {
            this.customData = Object.assign({}, this.customData, m.custom_data || m.customData);
            this.notifyChange();
            return;
          }
        }
      } catch (err) {
        console.warn('[VanviBuilderCore] API load error:', err);
      }

      // Fallback local storage
      try {
        const raw = localStorage.getItem('vanvi_user_moments') || '[]';
        const list = JSON.parse(raw);
        const found = list.find(m => m.id === momentId || m.slug === momentId);
        if (found) {
          this.customData = Object.assign({}, this.customData, found.custom_data || found.customData || found);
          this.notifyChange();
        }
      } catch (e) {}
    }

    /**
     * Update custom data key-value
     */
    set(key, value) {
      this.customData[key] = value;
      this.notifyChange();
    }

    /**
     * Batch update custom data
     */
    update(newData) {
      Object.assign(this.customData, newData);
      this.notifyChange();
    }

    get(key) {
      return this.customData[key];
    }

    notifyChange() {
      this.listeners.change.forEach(fn => {
        try { fn(this.customData); } catch (e) { console.error(e); }
      });

      // Dispatch custom window event
      window.dispatchEvent(new CustomEvent('vanvi:builderDataChange', {
        detail: {
          templateId: this.templateId,
          customData: this.customData
        }
      }));
    }

    /**
     * Upload media using Cloudinary / local storage fallback pipeline
     */
    async uploadMedia(fileOrBase64, { assetType = 'photo', onProgress } = {}) {
      if (typeof onProgress === 'function') onProgress(15, 'Preparing media...');

      let payload = fileOrBase64;
      if (fileOrBase64 instanceof File || fileOrBase64 instanceof Blob) {
        payload = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(fileOrBase64);
        });
      }

      if (typeof onProgress === 'function') onProgress(35, 'Uploading direct to Cloudinary storage...');

      // 0. Direct Cloudinary Client-Side Upload (Unsigned preset vanvi_moments)
      try {
        const cloudName = window.VITE_CLOUDINARY_CLOUD_NAME || 'ztholwuh';
        const uploadPreset = window.VITE_CLOUDINARY_UPLOAD_PRESET || 'vanvi_moments';
        if (cloudName && uploadPreset) {
          const directForm = new FormData();
          directForm.append('file', payload);
          directForm.append('upload_preset', uploadPreset);
          directForm.append('folder', `vanvi_moments/moments/${this.momentId || 'draft'}`);

          const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
            method: 'POST',
            body: directForm
          });

          if (cloudRes.ok) {
            const cloudData = await cloudRes.json();
            if (cloudData && cloudData.secure_url) {
              if (typeof onProgress === 'function') onProgress(100, 'Cloudinary upload complete!');
              return {
                url: cloudData.secure_url,
                secure_url: cloudData.secure_url,
                public_id: cloudData.public_id,
                provider: 'cloudinary'
              };
            }
          }
        }
      } catch (err) {
        console.warn('[VanviBuilderCore] Direct Cloudinary upload fallback to backend relay:', err);
      }

      // 1. Try unified VanviAPI upload if available
      if (window.VanviAPI && window.VanviAPI.upload) {
        try {
          const res = await window.VanviAPI.upload.photo(payload, `asset_${Date.now()}.png`, {
            templateId: this.templateId,
            assetType
          });
          if (res && res.success && (res.secure_url || res.url)) {
            if (typeof onProgress === 'function') onProgress(100, 'Upload complete!');
            return {
              url: res.secure_url || res.url,
              public_id: res.public_id,
              provider: res.provider || 'cloudinary'
            };
          }
        } catch (e) {
          console.warn('[VanviBuilderCore] VanviAPI upload fallback:', e);
        }
      }

      // 2. Try POST /api/upload
      try {
        const resp = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            file: payload,
            template_id: this.templateId,
            moment_id: this.momentId || `draft_${Date.now()}`,
            asset_type: assetType
          })
        });

        if (resp.ok) {
          const result = await resp.json();
          if (result && result.success) {
            if (typeof onProgress === 'function') onProgress(100, 'Upload complete!');
            return result.asset || result;
          }
        }
      } catch (e) {
        console.warn('[VanviBuilderCore] Backend /api/upload unavailable, retaining asset payload');
      }

      // 3. Graceful fallback: return the original payload
      if (typeof onProgress === 'function') onProgress(100, 'Ready!');
      return { url: payload, provider: 'local' };
    }

    /**
     * Save the moment into Supabase / local database
     */
    async saveMoment({ title, recipientName, occasion, status = 'published' } = {}) {
      if (this.isSaving) return;
      this.isSaving = true;

      try {
        const rec = recipientName || this.customData.recipientName || this.customData.recipient || this.customData.coupleNames || this.customData.wallTitle || 'Celebrant';
        const occ = occasion || this.customData.occasion || this.templateConfig?.category || 'Celebration';
        const momentTitle = title || `${occ} Keepsake for ${rec}`;

        const payload = {
          id: this.momentId || undefined,
          template_id: this.templateId,
          templateId: this.templateId,
          title: momentTitle,
          recipient: rec,
          recipient_name: rec,
          sender: this.customData.senderName || this.customData.sender || 'With Love',
          occasion: occ,
          message: this.customData.message || this.customData.letterBodyText || this.customData.heroCopy || '',
          date: this.customData.celebrationDate || this.customData.birthdayDate || this.customData.date || '',
          photos: this.customData.photos || [],
          soundtrack: this.customData.soundtrack || 'default',
          custom_data: this.customData,
          status
        };

        let savedMoment = null;

        // Primary: VanviAPI
        if (window.VanviAPI && window.VanviAPI.moments && typeof window.VanviAPI.moments.create === 'function') {
          try {
            const result = await window.VanviAPI.moments.create(payload);
            if (result && (result.moment || result.data)) {
              savedMoment = result.moment || result.data;
            }
          } catch (e) {
            console.warn('[VanviBuilderCore] VanviAPI create error, trying direct endpoint:', e);
          }
        }

        // Secondary: Direct POST /api/moments
        if (!savedMoment) {
          try {
            const resp = await fetch('/api/moments', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });
            if (resp.ok) {
              const resData = await resp.json();
              if (resData && (resData.moment || resData.data)) {
                savedMoment = resData.moment || resData.data;
              }
            }
          } catch (e) {}
        }

        // Resilient Offline Local Fallback
        if (!savedMoment) {
          const generatedId = this.momentId || 'vm_' + Math.random().toString(36).substring(2, 10);
          const generatedSlug = 'm_' + Math.random().toString(36).substring(2, 10);
          savedMoment = {
            id: generatedId,
            slug: generatedSlug,
            ...payload,
            createdAt: Date.now()
          };
          try {
            const list = JSON.parse(localStorage.getItem('vanvi_user_moments') || '[]');
            const existingIdx = list.findIndex(m => m.id === generatedId);
            if (existingIdx >= 0) {
              list[existingIdx] = savedMoment;
            } else {
              list.unshift(savedMoment);
            }
            localStorage.setItem('vanvi_user_moments', JSON.stringify(list));
          } catch (e) {}
        }

        this.momentId = savedMoment.id;

        // Construct canonical URLs
        const origin = window.location.origin || '';
        const isFree = this.isTemplateFree();
        const price = this.getTemplatePrice();
        const paidQuery = isFree || new URLSearchParams(window.location.search).get('paid') === 'true' ? '&paid=true&purchased=true&status=published' : '';

        const directTemplateUrl = `${origin}/templates/${encodeURIComponent(this.templateId)}/index.html?id=${encodeURIComponent(savedMoment.id)}${paidQuery}`;
        const momentUrl = savedMoment.slug ? `${origin}/m/${encodeURIComponent(savedMoment.slug)}` : directTemplateUrl;

        savedMoment.experienceUrl = directTemplateUrl;
        savedMoment.directTemplateUrl = directTemplateUrl;
        savedMoment.shareUrl = directTemplateUrl;
        savedMoment.isFree = isFree;
        savedMoment.price = price;
        savedMoment.checkoutUrl = this.getCheckoutUrl({ recipient: rec, occasion: occ });

        this.listeners.saveSuccess.forEach(fn => fn(savedMoment));
        return savedMoment;
      } catch (err) {
        this.listeners.saveError.forEach(fn => fn(err));
        throw err;
      } finally {
        this.isSaving = false;
      }
    }

    /**
     * Get Template Metadata from Registry
     */
    getTemplateMeta() {
      if (this.templateConfig && typeof this.templateConfig.price === 'number') {
        return this.templateConfig;
      }
      if (window.VanviTemplatesData && typeof window.VanviTemplatesData.getAll === 'function') {
        const list = window.VanviTemplatesData.getAll();
        const found = list.find(t => 
          t.id === this.templateId || 
          t.slug === this.templateId || 
          (t.aliases && t.aliases.includes(this.templateId))
        );
        if (found) return found;
      }
      return null;
    }

    getTemplatePrice() {
      const meta = this.getTemplateMeta();
      if (meta && typeof meta.price === 'number') return meta.price;
      return 0;
    }

    isTemplateFree() {
      const meta = this.getTemplateMeta();
      if (meta) {
        if (meta.isFree === true || meta.price === 0) return true;
        return false;
      }
      // If template ID starts with birthday-wish-01 or free catalog
      if (this.templateId === 'birthday-wish-01' || this.templateId === 'birthday-white-bloom') return true;
      return false;
    }

    getCheckoutUrl({ recipient, occasion } = {}) {
      const price = this.getTemplatePrice();
      const rec = recipient || this.customData.recipientName || this.customData.recipient || this.customData.coupleNames || 'Special Someone';
      const occ = occasion || this.customData.occasion || 'Celebration';
      return `../../checkout.html?templateId=${encodeURIComponent(this.templateId)}&amount=${price}&recipient=${encodeURIComponent(rec)}&occasion=${encodeURIComponent(occ)}`;
    }

    /**
     * Automatically bind form inputs for real-time live preview synchronization
     */
    bindInputs(container) {
      const root = container || document;
      const inputs = root.querySelectorAll('input:not([type="hidden"]):not([type="file"]), textarea, select');
      inputs.forEach(inp => {
        if (inp.__vanviBound) return;
        inp.__vanviBound = true;
        inp.addEventListener('input', () => {
          const rawId = inp.id || inp.name || '';
          const key = rawId.replace(/^(inp|input|txt)_?/, '');
          const val = inp.value;
          if (!key) return;

          const updateObj = {};
          updateObj[key] = val;
          const kLower = key.toLowerCase();

          if (kLower.includes('recipient') || kLower === 'name') {
            updateObj.recipientName = val;
            updateObj.recipient = val;
          } else if (kLower.includes('sender')) {
            updateObj.senderName = val;
            updateObj.sender = val;
          } else if (kLower.includes('message') || kLower.includes('body')) {
            updateObj.message = val;
          } else if (kLower.includes('date')) {
            updateObj.date = val;
          } else if (kLower.includes('couple')) {
            updateObj.coupleNames = val;
            updateObj.recipientName = val;
          } else if (kLower.includes('bride')) {
            updateObj.bride = val;
          } else if (kLower.includes('groom')) {
            updateObj.groom = val;
          }

          this.update(updateObj);
        });
      });
    }

    /**
     * Connect Live Preview iframe and dispatch real-time keystroke broadcasts
     */
    attachPreview(iframeElement) {
      if (!iframeElement) return;

      const sync = () => {
        try {
          if (iframeElement.contentWindow) {
            const rec = this.customData.recipientName || this.customData.recipient || this.customData.coupleNames || this.customData.bride || this.customData.wallTitle || '';
            const snd = this.customData.senderName || this.customData.sender || '';
            const msg = this.customData.message || this.customData.letterBodyText || '';
            const dt = this.customData.date || this.customData.celebrationDate || this.customData.anniversaryDate || '';
            const pts = this.customData.photos || this.customData.gallery || [];

            const syncPayload = {
              type: 'VANVI_LIVE_PREVIEW_SYNC',
              customData: this.customData,
              recipient: rec,
              recipientName: rec,
              bride: this.customData.bride || '',
              groom: this.customData.groom || '',
              sender: snd,
              senderName: snd,
              message: msg,
              date: dt,
              photos: pts
            };

            // Broadcast multi-protocol formats for universal backward/forward template compatibility
            iframeElement.contentWindow.postMessage(syncPayload, '*');
            iframeElement.contentWindow.postMessage({
              type: 'VANVI_UPDATE_CUSTOM_DATA',
              customData: this.customData
            }, '*');
            iframeElement.contentWindow.postMessage({
              type: 'UPDATE_CONFIG',
              config: this.customData
            }, '*');
          }
        } catch (e) {}
      };

      this.listeners.change.push(sync);
      iframeElement.addEventListener('load', sync);

      // Auto-bind input listeners across the active builder form
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.bindInputs());
      } else {
        setTimeout(() => this.bindInputs(), 100);
      }
    }
  }

  window.VanviBuilderCore = new VanviBuilderCore();
})(window);
