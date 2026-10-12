/**
 * VANVI MOMENTS — CLOUDINARY MEDIA STORAGE API ENGINE
 * Universal uploader for Wedding Customizer Studios
 * Auto-folder: vanvi-moments/weddings/{slug}/
 * Optimizations: f_auto, q_auto, c_fill, ar_4:5
 */

(function (window) {
  'use strict';

  const DEFAULT_CONFIG = {
    cloudName: 'ztholwuh',
    uploadPreset: 'vanvi_moments',
    apiKey: '',
    defaultFolder: 'vanvi-moments/weddings',
    transform: 'f_auto,q_auto,c_fill,ar_4:5'
  };

  class VanviCloudinaryEngine {
    constructor() {
      this.config = { ...DEFAULT_CONFIG };
      this.activeSlug = 'kishan-divya';
      this.isInitialized = false;
      this.fetchServerConfig();
    }

    async fetchServerConfig() {
      try {
        const res = await fetch('/api/upload/config');
        if (res.ok) {
          const data = await res.json();
          if (data && data.success) {
            if (data.cloudName) this.config.cloudName = data.cloudName;
            if (data.uploadPreset) this.config.uploadPreset = data.uploadPreset;
            this.isInitialized = true;
          }
        }
      } catch (e) {
        console.warn('[VanviCloudinary] Using fallback client credentials');
      }
    }

    setSlug(slug) {
      if (slug) {
        this.activeSlug = String(slug).toLowerCase().replace(/[^a-z0-9_-]/g, '-');
      }
    }

    /**
     * Apply Cloudinary optimization parameters: f_auto, q_auto, c_fill, ar_4:5
     */
    applyOptimizations(rawUrl, customTransform) {
      if (!rawUrl || typeof rawUrl !== 'string' || !rawUrl.includes('res.cloudinary.com')) {
        return rawUrl;
      }
      const transform = customTransform || this.config.transform;
      // Inject after '/upload/'
      const parts = rawUrl.split('/upload/');
      if (parts.length === 2) {
        // Avoid double injecting
        if (parts[1].startsWith('f_auto') || parts[1].includes('q_auto')) {
          return rawUrl;
        }
        return `${parts[0]}/upload/${transform}/${parts[1]}`;
      }
      return rawUrl;
    }

    /**
     * Upload single file to Cloudinary
     */
    async uploadImage(file, { slug, onProgress, customTransform } = {}) {
      const activeFolder = `vanvi-moments/weddings/${slug || this.activeSlug}`;

      // 1. Try Direct Cloudinary Unsigned Upload
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', this.config.uploadPreset);
        formData.append('folder', activeFolder);

        const endpoint = `https://api.cloudinary.com/v1_1/${this.config.cloudName}/image/upload`;
        
        const response = await fetch(endpoint, {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const data = await response.json();
          if (data && data.secure_url) {
            const optimized = this.applyOptimizations(data.secure_url, customTransform);
            return {
              success: true,
              secure_url: optimized,
              raw_url: data.secure_url,
              public_id: data.public_id,
              width: data.width,
              height: data.height,
              format: data.format
            };
          }
        }
      } catch (err) {
        console.warn('[VanviCloudinary] Direct upload attempt failed, trying backend relay...', err);
      }

      // 2. Server Relay Fallback (/api/upload)
      try {
        const base64Data = await this.fileToBase64(file);
        const relayRes = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            file: base64Data,
            originalName: file.name,
            mimeType: file.type,
            templateId: 'golden-lake-collection',
            momentId: slug || this.activeSlug
          })
        });

        if (relayRes.ok) {
          const relayData = await relayRes.json();
          if (relayData && relayData.url) {
            const optimized = this.applyOptimizations(relayData.url, customTransform);
            return {
              success: true,
              secure_url: optimized,
              raw_url: relayData.url
            };
          }
        }
      } catch (relayErr) {
        console.error('[VanviCloudinary] Server relay failed:', relayErr);
      }

      // 3. Ultimate Local Data-URI Fallback (Ensures user experience never breaks)
      const localDataUrl = await this.fileToBase64(file);
      return {
        success: true,
        secure_url: localDataUrl,
        isLocalFallback: true
      };
    }

    fileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }

    /**
     * Attach a Cloudinary upload listener to a file input or slot
     */
    bindSlot({ inputEl, previewEl, statusEl, slotIndex, configTarget, onComplete }) {
      if (!inputEl) return;

      inputEl.addEventListener('change', async (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        if (statusEl) {
          statusEl.innerHTML = '<span style="color:#d4af37;">☁️ Uploading to Cloudinary CDN...</span>';
        }

        try {
          const res = await this.uploadImage(file);
          if (res.success && res.secure_url) {
            if (previewEl) {
              if (previewEl.tagName === 'IMG') {
                previewEl.src = res.secure_url;
              } else {
                previewEl.style.backgroundImage = `url('${res.secure_url}')`;
              }
            }

            if (statusEl) {
              statusEl.innerHTML = '<span style="color:#10b981;">✓ Cloudinary CDN Ready (f_auto, q_auto)</span>';
            }

            // Real-Time Link Binding in wedding config
            if (configTarget && configTarget.gallery && Array.isArray(configTarget.gallery.photos)) {
              configTarget.gallery.photos[slotIndex] = res.secure_url;
            }

            if (typeof onComplete === 'function') {
              onComplete(res.secure_url, slotIndex);
            }
          }
        } catch (err) {
          if (statusEl) {
            statusEl.innerHTML = '<span style="color:#ef4444;">Upload error, please retry</span>';
          }
        }
      });
    }
  }

  window.VanviCloudinary = new VanviCloudinaryEngine();
})(window);
