const express = require('express');
const router = express.Router();
const { uploadImage, validateImageBuffer } = require('../services/storage.service');
const { rateLimiter } = require('../middleware/security');

/**
 * POST /api/upload
 * Secure image upload endpoint supporting base64 data URIs
 */
router.post('/', rateLimiter(60 * 1000, 30, 'Upload rate limit reached.'), async (req, res) => {
  try {
    const { image, originalName } = req.body;

    if (!image) {
      return res.status(400).json({ success: false, error: 'No image data provided.' });
    }

    // Match base64 data URI: data:image/png;base64,...
    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ success: false, error: 'Invalid image format. Expected base64 data URI.' });
    }

    const mimeType = matches[1];
    const buffer = Buffer.from(matches[2], 'base64');

    const result = await uploadImage({
      buffer,
      originalName: originalName || 'photo',
      mimeType
    });

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(201).json(result);
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error during upload.' });
  }
});

module.exports = router;

