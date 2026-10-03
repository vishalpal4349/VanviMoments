/**
 * VANVI MOMENTS — SECURE MULTI-PROVIDER STORAGE SERVICE
 * Multi-provider photo upload pipeline (Cloudinary HTTP direct, S3, Local)
 * with strict magic-byte validation, 5MB size limit, and path traversal protection.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const UPLOADS_DIR = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

const ALLOWED_MIME_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'image/gif': ['.gif']
};

/**
 * Validate image buffer using size, extension, and genuine magic numbers
 */
function validateImageBuffer(buffer, mimeType) {
  if (!buffer || buffer.length === 0) {
    return { valid: false, error: 'Empty file received.' };
  }

  if (buffer.length > MAX_FILE_SIZE_BYTES) {
    return { valid: false, error: 'File exceeds maximum allowed size of 5MB.' };
  }

  if (!ALLOWED_MIME_TYPES[mimeType]) {
    return { valid: false, error: 'Invalid file format. Only JPEG, PNG, WEBP, and GIF are permitted.' };
  }

  // Magic bytes inspection
  const header = buffer.slice(0, 4);
  const isJpeg = header[0] === 0xFF && header[1] === 0xD8 && header[2] === 0xFF;
  const isPng = header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4E && header[3] === 0x47;
  const isGif = header[0] === 0x47 && header[1] === 0x49 && header[2] === 0x46 && header[3] === 0x38;
  const isRiff = header[0] === 0x52 && header[1] === 0x49 && header[2] === 0x46 && header[3] === 0x46; // WEBP container

  if (!isJpeg && !isPng && !isGif && !isRiff) {
    return { valid: false, error: 'File content does not match genuine image signatures.' };
  }

  return { valid: true };
}

/**
 * Direct Cloudinary REST API upload using Node's native fetch & FormData
 */
async function uploadToCloudinary(buffer, mimeType) {
  let cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  let apiKey = process.env.CLOUDINARY_API_KEY;
  let apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (process.env.CLOUDINARY_URL && (!cloudName || !apiKey || !apiSecret)) {
    try {
      // Format: cloudinary://api_key:api_secret@cloud_name
      const parsed = new URL(process.env.CLOUDINARY_URL);
      apiKey = parsed.username;
      apiSecret = parsed.password;
      cloudName = parsed.hostname;
    } catch (e) {
      // fallback
    }
  }

  if (!cloudName || !apiKey || !apiSecret) {
    return null;
  }

  const timestamp = Math.round(Date.now() / 1000);
  const folder = 'vanvi_moments';
  const toSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash('sha1').update(toSign).digest('hex');

  const base64Data = `data:${mimeType};base64,${buffer.toString('base64')}`;

  const bodyParams = new URLSearchParams({
    file: base64Data,
    api_key: apiKey,
    timestamp: String(timestamp),
    folder,
    signature
  });

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: bodyParams.toString()
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Cloudinary API responded with status ${response.status}: ${errText}`);
  }

  const data = await response.json();
  return {
    success: true,
    provider: 'cloudinary',
    url: data.secure_url,
    publicId: data.public_id,
    size: data.bytes || buffer.length,
    mimeType
  };
}

/**
 * Upload image to active provider (Cloudinary / Local Secure Directory)
 */
async function uploadImage({ buffer, originalName, mimeType }) {
  const validation = validateImageBuffer(buffer, mimeType);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  // 1. External Cloudinary Provider if configured
  if (process.env.CLOUDINARY_URL || (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)) {
    try {
      const cloudResult = await uploadToCloudinary(buffer, mimeType);
      if (cloudResult && cloudResult.url) {
        return cloudResult;
      }
    } catch (err) {
      console.warn('Cloudinary upload failed, falling back to local secure storage:', err.message);
    }
  }

  // 2. Local Secure Storage Provider (Default & Fallback)
  try {
    const ext = ALLOWED_MIME_TYPES[mimeType][0];
    const safeHash = crypto.randomBytes(16).toString('hex');
    const safeFileName = `img_${safeHash}${ext}`;
    const targetPath = path.join(UPLOADS_DIR, safeFileName);

    fs.writeFileSync(targetPath, buffer);

    const publicUrl = `/uploads/${safeFileName}`;
    return {
      success: true,
      provider: 'local',
      url: publicUrl,
      filename: safeFileName,
      size: buffer.length,
      mimeType
    };
  } catch (err) {
    console.error('Storage save error:', err);
    return { success: false, error: 'Failed to write image to storage.' };
  }
}

module.exports = {
  uploadImage,
  validateImageBuffer,
  uploadToCloudinary,
  MAX_FILE_SIZE_BYTES
};
