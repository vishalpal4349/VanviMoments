const express = require('express');
const router = express.Router();
const { uploadMedia } = require('../services/storage.service');
const cloudinaryService = require('../services/cloudinary.service');
const supabaseService = require('../services/supabase.service');
const { rateLimiter } = require('../middleware/security');

/**
 * GET /api/upload/config
 * Public upload configuration for frontend client flows (no secrets exposed)
 */
router.get('/config', (req, res) => {
  return res.json({
    success: true,
    isConfigured: cloudinaryService.isConfigured,
    cloudName: cloudinaryService.cloudName || null,
    uploadPreset: cloudinaryService.uploadPreset || 'vanvi_moments',
    defaultFolder: 'vanvi_moments/moments'
  });
});

/**
 * POST /api/upload/sign
 * Generate a secure signature for direct client-to-Cloudinary uploads
 */
router.post('/sign', rateLimiter(60 * 1000, 60, 'Signature rate limit reached.'), (req, res) => {
  try {
    const { templateId, momentId, tags, transformation } = req.body || {};
    const folder = cloudinaryService.getStructuredFolder({ templateId, momentId });

    const signResult = cloudinaryService.generateClientSignature({
      folder,
      tags,
      transformation
    });

    if (!signResult.configured) {
      return res.status(200).json({
        success: false,
        configured: false,
        message: 'Cloudinary not configured on server. Use /api/upload server relay or local fallback.'
      });
    }

    return res.json({
      success: true,
      ...signResult
    });
  } catch (err) {
    console.error('[UploadRoutes] Sign error:', err);
    return res.status(500).json({ success: false, error: 'Failed to generate upload signature.' });
  }
});

/**
 * POST /api/upload
 * Server-side media upload supporting base64 Data URIs and raw payloads
 * Handles images, audio, video with template_id and moment_id preservation
 */
router.post('/', rateLimiter(60 * 1000, 60, 'Upload rate limit reached.'), async (req, res) => {
  try {
    const {
      image,
      file,
      originalName,
      template_id,
      templateId,
      moment_id,
      momentId,
      asset_type,
      assetType
    } = req.body || {};

    const rawData = file || image;
    if (!rawData) {
      return res.status(400).json({ success: false, error: 'No media data provided.' });
    }

    let mimeType = 'image/png';
    let buffer;

    // Check for Data URI format: data:[<mediatype>];base64,<data>
    const matches = rawData.match(/^data:([A-Za-z0-9\/+.-]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      mimeType = matches[1];
      buffer = Buffer.from(matches[2], 'base64');
    } else {
      // Raw base64 string
      buffer = Buffer.from(rawData, 'base64');
      if (req.body.mimeType) mimeType = req.body.mimeType;
    }

    const result = await uploadMedia({
      buffer,
      originalName: originalName || `media_${Date.now()}`,
      mimeType,
      templateId: template_id || templateId || null,
      momentId: moment_id || momentId || null,
      assetType: asset_type || assetType || null
    });

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(201).json(result);
  } catch (err) {
    console.error('[UploadRoutes] Upload error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error during upload.' });
  }
});

/**
 * GET /api/upload/assets/:momentId
 * Retrieve all assets recorded for a given moment
 */
router.get('/assets/:momentId', async (req, res) => {
  try {
    const { momentId } = req.params;
    const assets = await supabaseService.getMomentAssets(momentId);
    return res.json({ success: true, count: assets.length, assets });
  } catch (err) {
    console.error('[UploadRoutes] Get assets error:', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve moment assets.' });
  }
});

/**
 * POST /api/upload/assets/register
 * Record a direct-uploaded Cloudinary asset into Supabase / local registry
 */
router.post('/assets/register', async (req, res) => {
  try {
    const { momentId, templateId, assetType, publicId, secureUrl, url, bytes, format, width, height } = req.body || {};
    const recorded = await supabaseService.createMomentAsset({
      moment_id: momentId || 'draft',
      template_id: templateId || null,
      asset_type: assetType || 'image',
      storage_path: publicId || '',
      public_url: secureUrl || url || '',
      width,
      height,
      format,
      bytes,
      provider: 'cloudinary'
    });
    return res.json({ success: true, asset: recorded });
  } catch (err) {
    console.warn('[UploadRoutes] Register asset warning:', err.message);
    return res.status(200).json({ success: true, registered: false });
  }
});

module.exports = router;
