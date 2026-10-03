/**
 * VANVI MOMENTS — STORAGE SERVICE (PHASE 4)
 * Multi-provider media pipeline: Cloudinary (primary cloud) with graceful Local Storage Fallback.
 * Preserves structured folders, multi-media support (images, audio, video),
 * and automatic linkage to Supabase/local moment_assets.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const cloudinaryService = require('./cloudinary.service');
const supabaseService = require('./supabase.service');

const UPLOADS_DIR = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Generous file size limits per media type
const MAX_LIMITS = {
  image: 15 * 1024 * 1024,  // 15 MB
  audio: 35 * 1024 * 1024,  // 35 MB
  video: 75 * 1024 * 1024   // 75 MB
};

const ALLOWED_MIME_TYPES = {
  // Images
  'image/jpeg': { ext: '.jpg', type: 'image' },
  'image/png': { ext: '.png', type: 'image' },
  'image/webp': { ext: '.webp', type: 'image' },
  'image/gif': { ext: '.gif', type: 'image' },
  'image/svg+xml': { ext: '.svg', type: 'image' },

  // Audio
  'audio/mpeg': { ext: '.mp3', type: 'audio' },
  'audio/mp3': { ext: '.mp3', type: 'audio' },
  'audio/wav': { ext: '.wav', type: 'audio' },
  'audio/x-wav': { ext: '.wav', type: 'audio' },
  'audio/m4a': { ext: '.m4a', type: 'audio' },
  'audio/x-m4a': { ext: '.m4a', type: 'audio' },
  'audio/ogg': { ext: '.ogg', type: 'audio' },
  'audio/aac': { ext: '.aac', type: 'audio' },

  // Video
  'video/mp4': { ext: '.mp4', type: 'video' },
  'video/webm': { ext: '.webm', type: 'video' },
  'video/quicktime': { ext: '.mov', type: 'video' }
};

/**
 * Validate media buffer by size and MIME type
 */
function validateMediaBuffer(buffer, mimeType) {
  if (!buffer || buffer.length === 0) {
    return { valid: false, error: 'Empty media file received.' };
  }

  const mimeInfo = ALLOWED_MIME_TYPES[mimeType];
  if (!mimeInfo) {
    return {
      valid: false,
      error: `Unsupported format (${mimeType}). Supported: JPEG, PNG, WEBP, GIF, SVG, MP3, WAV, M4A, OGG, MP4, WEBM.`
    };
  }

  const maxBytes = MAX_LIMITS[mimeInfo.type] || MAX_LIMITS.image;
  if (buffer.length > maxBytes) {
    return {
      valid: false,
      error: `File exceeds maximum allowed size of ${Math.round(maxBytes / (1024 * 1024))}MB for ${mimeInfo.type}.`
    };
  }

  // Magic bytes inspection where available
  if (mimeInfo.type === 'image' && mimeType !== 'image/svg+xml') {
    const header = buffer.slice(0, 4);
    const isJpeg = header[0] === 0xFF && header[1] === 0xD8 && header[2] === 0xFF;
    const isPng = header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4E && header[3] === 0x47;
    const isGif = header[0] === 0x47 && header[1] === 0x49 && header[2] === 0x46 && header[3] === 0x38;
    const isRiff = header[0] === 0x52 && header[1] === 0x49 && header[2] === 0x46 && header[3] === 0x46; // WEBP container

    if (!isJpeg && !isPng && !isGif && !isRiff) {
      return { valid: false, error: 'File content does not match genuine image signatures.' };
    }
  }

  return { valid: true, mediaType: mimeInfo.type, ext: mimeInfo.ext };
}

/**
 * Helper to parse Base64 Data URI into buffer & mimeType
 */
function parseDataUri(dataUri) {
  if (typeof dataUri !== 'string') return null;
  const match = dataUri.match(/^data:([a-zA-Z0-9_\-+/.]+);base64,(.*)$/s);
  if (!match) return null;
  return {
    mimeType: match[1],
    buffer: Buffer.from(match[2], 'base64')
  };
}

/**
 * Universal media uploader supporting Cloudinary with Local Fallback
 * Connects uploaded asset with moment_assets table
 */
async function uploadMedia(firstArg, secondArg = {}) {
  let buffer;
  let originalName = 'media';
  let mimeType = 'image/png';
  let templateId = null;
  let momentId = null;
  let assetType = null;

  if (typeof firstArg === 'string' && firstArg.startsWith('data:')) {
    const parsed = parseDataUri(firstArg);
    if (parsed) {
      buffer = parsed.buffer;
      mimeType = parsed.mimeType;
    }
    templateId = secondArg.templateId || null;
    momentId = secondArg.momentId || null;
    assetType = secondArg.assetType || null;
    originalName = secondArg.originalName || 'media';
  } else if (Buffer.isBuffer(firstArg)) {
    buffer = firstArg;
    templateId = secondArg.templateId || null;
    momentId = secondArg.momentId || null;
    assetType = secondArg.assetType || null;
    mimeType = secondArg.mimeType || 'image/png';
    originalName = secondArg.originalName || 'media';
  } else if (typeof firstArg === 'object' && firstArg !== null) {
    if (typeof firstArg.buffer === 'string' && firstArg.buffer.startsWith('data:')) {
      const parsed = parseDataUri(firstArg.buffer);
      if (parsed) {
        buffer = parsed.buffer;
        mimeType = parsed.mimeType;
      }
    } else {
      buffer = firstArg.buffer;
      mimeType = firstArg.mimeType || mimeType;
    }
    originalName = firstArg.originalName || originalName;
    templateId = firstArg.templateId || null;
    momentId = firstArg.momentId || null;
    assetType = firstArg.assetType || null;
  }

  const validation = validateMediaBuffer(buffer, mimeType);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  const detectedAssetType = assetType || validation.mediaType;

  // 1. Attempt Cloudinary upload if configured
  if (cloudinaryService.isConfigured) {
    try {
      const cloudResult = await cloudinaryService.upload({
        buffer,
        mimeType,
        filename: originalName,
        templateId,
        momentId,
        assetType: detectedAssetType
      });

      if (cloudResult && cloudResult.success) {
        // Link to Supabase / local moment_assets
        await supabaseService.createMomentAsset({
          moment_id: momentId || 'draft',
          asset_type: detectedAssetType,
          storage_path: cloudResult.public_id,
          public_url: cloudResult.secure_url,
          width: cloudResult.width,
          height: cloudResult.height,
          format: cloudResult.format,
          duration: cloudResult.duration,
          bytes: cloudResult.bytes,
          template_id: templateId,
          resource_type: cloudResult.resource_type,
          provider: 'cloudinary'
        });

        return cloudResult;
      }
    } catch (err) {
      console.warn('[StorageService] Cloudinary upload failed, falling back to local storage:', err.message);
    }
  }

  // 2. Local Fallback Provider
  try {
    const ext = validation.ext || path.extname(originalName) || '.bin';
    const safeHash = crypto.randomBytes(16).toString('hex');
    const safeFileName = `${detectedAssetType}_${safeHash}${ext}`;
    const targetPath = path.join(UPLOADS_DIR, safeFileName);

    fs.writeFileSync(targetPath, buffer);

    const publicUrl = `/uploads/${safeFileName}`;
    const localResult = {
      success: true,
      provider: 'local',
      public_id: safeFileName,
      secure_url: publicUrl,
      url: publicUrl,
      filename: safeFileName,
      resource_type: validation.mediaType,
      format: ext.replace('.', ''),
      bytes: buffer.length,
      moment_id: momentId || null,
      template_id: templateId || null,
      asset_type: detectedAssetType,
      created_at: new Date().toISOString()
    };

    // Link to Supabase / local moment_assets
    await supabaseService.createMomentAsset({
      moment_id: momentId || 'draft',
      asset_type: detectedAssetType,
      storage_path: safeFileName,
      public_url: publicUrl,
      format: ext.replace('.', ''),
      bytes: buffer.length,
      template_id: templateId,
      resource_type: validation.mediaType,
      provider: 'local'
    });

    return localResult;
  } catch (err) {
    console.error('[StorageService] Local save error:', err);
    return { success: false, error: 'Failed to write media to storage.' };
  }
}

// Backward compatibility alias for uploadImage
async function uploadImage(opts) {
  return await uploadMedia(opts);
}

module.exports = {
  uploadMedia,
  uploadImage,
  validateMediaBuffer,
  validateImageBuffer: validateMediaBuffer,
  cloudinaryService,
  MAX_LIMITS
};
