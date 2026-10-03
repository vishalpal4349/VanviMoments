const express = require('express');
const router = express.Router();
const { Moments } = require('../db/database');
const { optionalAuth, requireAuth, hashPin, verifyPin } = require('../middleware/auth');

// In-memory rate limiting map for PIN attempts: { [key: string]: { count: number, resetAt: number } }
const pinAttempts = new Map();

function checkPinRateLimit(ip, slug) {
  const key = `${ip}_${slug}`;
  const now = Date.now();
  const entry = pinAttempts.get(key);

  if (entry) {
    if (now > entry.resetAt) {
      pinAttempts.set(key, { count: 1, resetAt: now + (15 * 60 * 1000) });
      return true;
    }
    if (entry.count >= 5) {
      return false; // Exceeded 5 attempts in 15 mins
    }
    entry.count++;
    return true;
  } else {
    pinAttempts.set(key, { count: 1, resetAt: now + (15 * 60 * 1000) });
    return true;
  }
}

/**
 * GET /api/moments (Authenticated User's Moments)
 */
router.get('/', requireAuth, async (req, res) => {
  try {
    const list = await Moments.findByUserId(req.user.id);
    return res.json({ success: true, moments: list });
  } catch (err) {
    console.error('Fetch moments error:', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve moments.' });
  }
});

/**
 * POST /api/moments and POST /api/moments/draft (Create or Update Moment)
 */
router.post(['/', '/draft'], optionalAuth, async (req, res) => {
  try {
    const { id, title, recipient, sender, occasion, message, photos, musicTrack, lockMode, pin, pinHint, theme, templateId, template_id, custom_data, customData } = req.body;
    const userId = req.user ? req.user.id : null;
    const resolvedTemplateId = templateId || template_id || 'birthday-3d-candle';
    const resolvedCustomData = custom_data || customData || {};

    let pinHash = null;
    if (lockMode === 'pin' && pin) {
      pinHash = hashPin(pin);
    }

    if (id) {
      const existing = await Moments.findById(id);
      const ownsExisting = existing && (
        (req.user && existing.userId === req.user.id) ||
        (!req.user && !existing.userId)
      );
      if (ownsExisting) {
        const updated = await Moments.update(id, {
          title,
          recipient,
          sender,
          occasion,
          message,
          photos: photos || [],
          musicTrack,
          lockMode: lockMode || 'envelope',
          pinHash: pinHash || existing.pinHash,
          pinHint: pinHint || existing.pinHint,
          theme,
          templateId: resolvedTemplateId,
          custom_data: resolvedCustomData
        });
        return res.json({ success: true, moment: updated });
      }
      if (existing) {
        return res.status(403).json({ success: false, error: 'You do not have permission to update this moment.' });
      }
    }

    const created = await Moments.create({
      userId,
      title,
      recipient,
      sender,
      occasion,
      message,
      photos: photos || [],
      musicTrack,
      lockMode: lockMode || 'envelope',
      pinHash,
      pinHint,
      theme,
      templateId: resolvedTemplateId,
      custom_data: resolvedCustomData,
      status: 'draft'
    });

    return res.status(201).json({ success: true, moment: created });
  } catch (err) {
    console.error('Save draft error:', err);
    return res.status(500).json({ success: false, error: 'Failed to save moment draft.' });
  }
});

/**
 * GET /api/moments/public/:slug (Recipient Experience Fetch)
 * CRUCIAL SECURITY: Does NOT expose message or photos if PIN locked!
 */
router.get('/public/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const moment = await Moments.findBySlug(slug);

    if (!moment || moment.status === 'revoked') {
      return res.status(404).json({ success: false, error: 'Moment not found or link has expired.' });
    }

    // Increment view count
    await Moments.incrementStats(moment.id, { views: 1 });

    const isPinLocked = moment.lockMode === 'pin';

    const publicResponse = {
      id: moment.id,
      slug: moment.slug,
      title: moment.title,
      recipient: moment.recipient,
      sender: moment.sender,
      occasion: moment.occasion,
      lockMode: moment.lockMode,
      pinHint: moment.pinHint,
      theme: moment.theme,
      templateId: moment.templateId || moment.template_id || 'birthday-3d-candle',
      musicTrack: moment.musicTrack,
      locked: isPinLocked,
      createdAt: moment.createdAt
    };

    if (!isPinLocked) {
      // Envelope mode: message, photos & custom_data can be delivered directly
      publicResponse.message = moment.message;
      publicResponse.photos = moment.photos;
      publicResponse.custom_data = moment.custom_data || moment.customData || {};
    }

    return res.json({ success: true, moment: publicResponse });
  } catch (err) {
    console.error('Public moment fetch error:', err);
    return res.status(500).json({ success: false, error: 'Failed to load moment.' });
  }
});

/**
 * POST /api/moments/public/:slug/verify-pin (Server-Side PIN Verification)
 */
router.post('/public/:slug/verify-pin', async (req, res) => {
  try {
    const { slug } = req.params;
    const { pin } = req.body;
    const clientIp = req.ip || req.connection.remoteAddress || 'unknown';

    if (!checkPinRateLimit(clientIp, slug)) {
      return res.status(429).json({
        success: false,
        error: 'Too many incorrect attempts. Please wait 15 minutes before trying again.'
      });
    }

    const moment = await Moments.findBySlug(slug);
    if (!moment) {
      return res.status(404).json({ success: false, error: 'Moment not found.' });
    }

    if (moment.lockMode !== 'pin') {
      return res.json({
        success: true,
        message: moment.message,
        photos: moment.photos
      });
    }

    const isValid = verifyPin(pin, moment.pinHash);
    if (!isValid) {
      return res.status(401).json({ success: false, error: 'Incorrect Passcode. Try again.' });
    }

    // PIN matched! Release secret letter and photo memory reel
    return res.json({
      success: true,
      unlocked: true,
      message: moment.message,
      photos: moment.photos
    });
  } catch (err) {
    console.error('Verify PIN error:', err);
    return res.status(500).json({ success: false, error: 'Failed to verify passcode.' });
  }
});

/**
 * POST /api/moments/public/:slug/react (Love Heart Taps)
 */
router.post('/public/:slug/react', async (req, res) => {
  try {
    const { slug } = req.params;
    const moment = await Moments.findBySlug(slug);
    if (!moment) return res.status(404).json({ success: false, error: 'Moment not found.' });

    await Moments.incrementStats(moment.id, { hearts: 1 });
    return res.json({ success: true, hearts: (moment.hearts || 0) + 1 });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to record reaction.' });
  }
});

/**
 * DELETE /api/moments/:id (Delete Moment)
 */
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Moments.delete(id, req.user.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Moment not found or unauthorized.' });
    }
    return res.json({ success: true, message: 'Moment deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to delete moment.' });
  }
});

module.exports = router;

