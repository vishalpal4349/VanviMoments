/**
 * VANVI MOMENTS — PHASE 4 CLOUDINARY MEDIA SERVICE
 * Production media-storage layer with structured folders, secure client signing,
 * multi-resource type support (images, audio, video), and URL transformations.
 */

const crypto = require('crypto');

class CloudinaryService {
  constructor() {
    this.reloadConfig();
  }

  reloadConfig() {
    // 1. Direct environment variables
    this.cloudName = process.env.CLOUDINARY_CLOUD_NAME || '';
    this.apiKey = process.env.CLOUDINARY_API_KEY || '';
    this.apiSecret = process.env.CLOUDINARY_API_SECRET || '';
    this.uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || 'vanvi_moments';

    // 2. Parse CLOUDINARY_URL if provided: cloudinary://api_key:api_secret@cloud_name
    if (process.env.CLOUDINARY_URL && (!this.cloudName || !this.apiKey || !this.apiSecret)) {
      try {
        const parsed = new URL(process.env.CLOUDINARY_URL);
        this.apiKey = parsed.username || this.apiKey;
        this.apiSecret = parsed.password || this.apiSecret;
        this.cloudName = parsed.hostname || this.cloudName;
      } catch (e) {
        console.warn('[CloudinaryService] Failed to parse CLOUDINARY_URL:', e.message);
      }
    }

    this._isConfigured = Boolean(this.cloudName && (this.uploadPreset || (this.apiKey && this.apiSecret)));
  }

  get isConfigured() {
    this.reloadConfig();
    return Boolean(this.cloudName && (this.uploadPreset || (this.apiKey && this.apiSecret)));
  }

  isConfiguredFn() {
    return this.isConfigured;
  }

  /**
   * Safe public configuration
   */
  getSafeConfig() {
    this.reloadConfig();
    return {
      cloudName: this.cloudName || null,
      uploadPreset: this.uploadPreset,
      isConfigured: this.isConfigured
    };
  }

  /**
   * Resolve structured folder according to VanviMoments architecture:
   * - vanvi_moments/templates/{template_id}/
   * - vanvi_moments/moments/{moment_id}/
   * - vanvi_moments/branding/
   */
  getFolderPath(type, id) {
    if (type === 'moment') return `vanvi_moments/moments/${String(id).replace(/[^a-zA-Z0-9_-]/g, '_')}`;
    if (type === 'template') return `vanvi_moments/templates/${String(id).replace(/[^a-zA-Z0-9_-]/g, '_')}`;
    if (type === 'branding') return 'vanvi_moments/branding';
    return 'vanvi_moments/moments/drafts';
  }

  getStructuredFolder({ templateId, momentId, category = 'moments' }) {
    if (momentId) {
      return this.getFolderPath('moment', momentId);
    }
    if (templateId) {
      return this.getFolderPath('template', templateId);
    }
    if (category === 'branding') {
      return this.getFolderPath('branding');
    }
    return 'vanvi_moments/moments/drafts';
  }

  /**
   * Determine Cloudinary resource_type from MIME type
   */
  getResourceType(mimeType) {
    if (!mimeType) return 'auto';
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'video'; // Cloudinary handles audio files under the 'video' resource type
    return 'auto';
  }

  /**
   * Generate secure signature for client-side uploads (never exposes API secret)
   */
  generateClientSignature({ folder, timestamp, tags, transformation, publicId }) {
    if (!this.isConfigured) {
      return {
        configured: false,
        error: 'Cloudinary credentials not configured in server environment.'
      };
    }

    const ts = timestamp || Math.round(Date.now() / 1000);
    const paramsToSign = {};

    if (folder) paramsToSign.folder = folder;
    if (publicId) paramsToSign.public_id = publicId;
    if (tags) paramsToSign.tags = Array.isArray(tags) ? tags.join(',') : tags;
    if (transformation) paramsToSign.transformation = transformation;
    paramsToSign.timestamp = ts;

    // Cloudinary signature rule: sort alphabetically and join as k1=v1&k2=v2... + apiSecret
    const sortedKeys = Object.keys(paramsToSign).sort();
    const toSignString = sortedKeys.map(k => `${k}=${paramsToSign[k]}`).join('&') + this.apiSecret;
    const signature = crypto.createHash('sha1').update(toSignString).digest('hex');

    return {
      configured: true,
      cloudName: this.cloudName,
      apiKey: this.apiKey,
      timestamp: ts,
      folder,
      signature,
      uploadPreset: this.uploadPreset
    };
  }

  /**
   * Direct REST API upload from server using native fetch
   */
  async upload({ buffer, mimeType, filename, templateId, momentId, assetType = 'image', tags = [] }) {
    if (!this.isConfigured) {
      return {
        success: false,
        provider: 'none',
        error: 'Cloudinary credentials are not configured.'
      };
    }

    const folder = this.getStructuredFolder({ templateId, momentId });
    const resourceType = this.getResourceType(mimeType);
    const base64Data = buffer ? `data:${mimeType || 'image/png'};base64,${buffer.toString('base64')}` : '';
    const bodyParams = new URLSearchParams();
    bodyParams.set('file', base64Data);

    if (this.uploadPreset) {
      bodyParams.set('upload_preset', this.uploadPreset);
      if (folder) bodyParams.set('folder', folder);
    } else if (this.apiKey && this.apiSecret) {
      const timestamp = Math.round(Date.now() / 1000);
      const paramsToSign = { folder, timestamp };
      if (tags && tags.length) paramsToSign.tags = Array.isArray(tags) ? tags.join(',') : tags;
      const sortedKeys = Object.keys(paramsToSign).sort();
      const toSign = sortedKeys.map(k => `${k}=${paramsToSign[k]}`).join('&') + this.apiSecret;
      const signature = crypto.createHash('sha1').update(toSign).digest('hex');

      bodyParams.set('api_key', this.apiKey);
      bodyParams.set('timestamp', String(timestamp));
      bodyParams.set('folder', folder);
      bodyParams.set('signature', signature);
      if (paramsToSign.tags) bodyParams.set('tags', paramsToSign.tags);
    }

    const uploadUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/${resourceType}/upload`;

    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: bodyParams.toString()
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Cloudinary API error (${response.status}): ${errText}`);
    }

    const data = await response.json();

    return {
      success: true,
      provider: 'cloudinary',
      public_id: data.public_id,
      secure_url: data.secure_url,
      url: data.secure_url,
      resource_type: data.resource_type || resourceType,
      format: data.format || (filename ? filename.split('.').pop() : 'png'),
      width: data.width || null,
      height: data.height || null,
      duration: data.duration || null,
      bytes: data.bytes || buffer.length,
      moment_id: momentId || null,
      template_id: templateId || null,
      asset_type: assetType,
      created_at: data.created_at || new Date().toISOString()
    };
  }

  /**
   * Helper to generate automatic optimization URL (f_auto, q_auto)
   */
  getOptimizedUrl(url, { width, height, quality = 'auto', format = 'auto', crop = 'limit' } = {}) {
    if (!url || typeof url !== 'string' || !url.includes('res.cloudinary.com')) {
      return url;
    }
    const parts = url.split('/upload/');
    if (parts.length !== 2) return url;

    const transforms = [`f_${format}`, `q_${quality}`];
    if (width) transforms.push(`w_${width}`);
    if (height) transforms.push(`h_${height}`);
    if (crop) transforms.push(`c_${crop}`);

    return `${parts[0]}/upload/${transforms.join(',')}/${parts[1]}`;
  }
}

module.exports = new CloudinaryService();
