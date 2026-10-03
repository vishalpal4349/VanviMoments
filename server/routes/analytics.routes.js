const express = require('express');
const router = express.Router();
const { AnalyticsEvents } = require('../db/database');
const { optionalAuth } = require('../middleware/auth');

/**
 * POST /api/analytics/event
 * Ingest privacy-preserving analytics events
 */
router.post('/event', optionalAuth, async (req, res) => {
  try {
    const { eventName, properties } = req.body;

    if (!eventName || typeof eventName !== 'string') {
      return res.status(400).json({ success: false, error: 'Event name is required.' });
    }

    const userId = req.user ? req.user.id : null;
    const clientIp = req.ip || req.connection.remoteAddress || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || '';

    await AnalyticsEvents.create({
      userId,
      eventName,
      properties: typeof properties === 'object' ? properties : {},
      ip: clientIp,
      userAgent
    });

    return res.status(202).json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to record event.' });
  }
});

module.exports = router;

