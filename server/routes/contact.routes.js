/**
 * VANVI MOMENTS — CONTACT, CONCIERGE & ISSUE REPORTING API
 * Handles:
 * 1. Contact inquiries from contact.html (dispatches to vanvimoments@gmail.com & acknowledges user)
 * 2. Website issue / bug reports (alerts owner & logs diagnostics)
 */

const express = require('express');
const router = express.Router();
const database = require('../db/database');
const { rateLimiter } = require('../middleware/security');
const {
  sendContactNotification,
  sendIssueReportAlert
} = require('../services/email.service');

// POST /api/contact/submit
// Handles contact inquiries from contact.html
router.post('/submit', rateLimiter(15 * 60 * 1000, 10), async (req, res) => {
  try {
    const { name, email, phone, topic, orderId, message, _vanvi_hp } = req.body || {};

    // Honeypot anti-spam trap (silent drop for automated bots)
    if (_vanvi_hp && String(_vanvi_hp).trim().length > 0) {
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

    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      return res.status(400).json({ success: false, error: 'Please enter a message explaining how we can assist.' });
    }

    const ticketId = 'TICK-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(Math.random() * 900 + 100);
    const inquiry = {
      id: ticketId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? String(phone).trim() : null,
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

    // Send real-time notification to vanvimoments@gmail.com & user acknowledgment
    sendContactNotification({
      fromName: inquiry.name,
      fromEmail: inquiry.email,
      fromPhone: inquiry.phone,
      topic: inquiry.topic,
      orderId: inquiry.orderId,
      message: inquiry.message,
      ticketId
    }).catch(err => {
      console.warn('[Contact Email Notice]', err.message);
    });

    return res.status(200).json({
      success: true,
      ticketId,
      message: 'Your inquiry has been received. Our concierge team typically responds within 2 to 4 business hours.'
    });
  } catch (err) {
    console.error('[Contact Error]', err);
    return res.status(500).json({
      success: false,
      error: 'An internal error occurred while submitting your message. Please try again or contact us directly via email.'
    });
  }
});

// POST /api/contact/report-issue
// Handles website glitches, broken links, payment problems reported by visitors
router.post('/report-issue', rateLimiter(15 * 60 * 1000, 10), async (req, res) => {
  try {
    const { name, email, phone, category, pageUrl, description, deviceInfo, _vanvi_hp } = req.body || {};

    if (_vanvi_hp && String(_vanvi_hp).trim().length > 0) {
      return res.status(200).json({ success: true, reportId: 'BUG-' + Date.now().toString(36).toUpperCase() });
    }

    if (!description || String(description).trim().length < 5) {
      return res.status(400).json({ success: false, error: 'Please describe what went wrong so we can fix it.' });
    }

    const reportId = 'BUG-' + Date.now().toString(36).toUpperCase();
    const issueRecord = {
      id: reportId,
      reporterName: name ? String(name).trim() : 'Anonymous Visitor',
      reporterEmail: email ? String(email).trim().toLowerCase() : null,
      reporterPhone: phone ? String(phone).trim() : null,
      category: category ? String(category).trim() : 'Website Glitch',
      pageUrl: pageUrl ? String(pageUrl).trim() : null,
      description: String(description).trim(),
      deviceInfo: deviceInfo ? String(deviceInfo).trim() : req.headers['user-agent'] || 'Unknown',
      createdAt: new Date().toISOString(),
      status: 'open'
    };

    // Store in JSON database
    const store = database.getStore();
    store.reportedIssues = store.reportedIssues || [];
    store.reportedIssues.push(issueRecord);
    database.saveStore(store);

    database.recordAuditLog('ISSUE_REPORTED', issueRecord.reporterEmail || 'anonymous', {
      reportId,
      category: issueRecord.category
    });

    // Alert owner at vanvimoments@gmail.com
    sendIssueReportAlert({
      reportId,
      reporterName: issueRecord.reporterName,
      reporterEmail: issueRecord.reporterEmail,
      reporterPhone: issueRecord.reporterPhone,
      category: issueRecord.category,
      pageUrl: issueRecord.pageUrl,
      description: issueRecord.description,
      deviceInfo: issueRecord.deviceInfo
    }).catch(err => {
      console.warn('[Issue Report Email Notice]', err.message);
    });

    return res.status(200).json({
      success: true,
      reportId,
      message: 'Thank you for notifying us! Our technical desk has received your report and is resolving it right away.'
    });
  } catch (err) {
    console.error('[Report Issue Error]', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to record issue report. Please contact vanvimoments@gmail.com directly.'
    });
  }
});

module.exports = router;
