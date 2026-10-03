/**
 * VANVI MOMENTS — CONTACT & SUPPORT INQUIRIES API
 * Handles user contact form submissions with input validation and audit recording.
 */

const express = require('express');
const router = express.Router();
const database = require('../db/database');
const { rateLimiter } = require('../middleware/security');

// POST /api/contact/submit
// Handles contact inquiries from contact.html
router.post('/submit', rateLimiter(15 * 60 * 1000, 10), async (req, res) => {
  try {
    // Honeypot anti-spam trap (silent drop for automated bots)
    if (req.body._vanvi_hp && String(req.body._vanvi_hp).trim().length > 0) {
      return res.status(200).json({ success: true, ticketId: 'TICK-' + Date.now().toString(36).toUpperCase() });
    }

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ success: false, error: 'Please provide a valid full name.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      return res.status(400).json({ success: false, error: 'Please provide a valid email address.' });
    }

    if (!topic || typeof topic !== 'string') {
      return res.status(400).json({ success: false, error: 'Please select an inquiry topic.' });
    }

    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return res.status(400).json({ success: false, error: 'Message must be at least 10 characters long.' });
    }

    const ticketId = 'TICK-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(Math.random() * 900 + 100);
    const inquiry = {
      id: ticketId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      topic: topic.trim(),
      orderId: orderId ? String(orderId).trim() : null,
      message: message.trim(),
      createdAt: new Date().toISOString(),
      status: 'received'
    };

    // Store in database / JSON store
    const store = database.getStore();
    if (!store.inquiries) {
      store.inquiries = [];
    }
    store.inquiries.push(inquiry);
    database.saveStore(store);

    // Audit log
    database.recordAuditLog('INQUIRY_RECEIVED', inquiry.email, {
      ticketId,
      topic: inquiry.topic,
      orderId: inquiry.orderId
    });

    return res.status(200).json({
      success: true,
      ticketId,
      message: 'Your inquiry has been received. Our team typically responds within 2 to 4 business hours.'
    });
  } catch (err) {
    console.error('[Contact Error]', err);
    return res.status(500).json({
      success: false,
      error: 'An internal error occurred while submitting your message. Please try again or contact us directly via email.'
    });
  }
});

module.exports = router;

