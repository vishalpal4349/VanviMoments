const express = require('express');
const router = express.Router();
const database = require('../db/database');
const { rateLimiter } = require('../middleware/security');

router.post('/submit', rateLimiter(15 * 60 * 1000, 6), (req, res) => {
  const { _vanvi_hp, name, email, contact, occasion, recipient, budget, style, idea, references, details } = req.body || {};
  if (_vanvi_hp && String(_vanvi_hp).trim().length > 0) {
    return res.status(201).json({ success: true, requestId: 'CX-' + Date.now().toString(36).toUpperCase(), status: 'Submitted' });
  }
  if (!name || String(name).trim().length < 2) return res.status(400).json({ success: false, error: 'Please provide your name.' });
  if (!email && !contact) return res.status(400).json({ success: false, error: 'Please provide an email or contact number.' });
  if (!occasion || !idea || String(idea).trim().length < 10) return res.status(400).json({ success: false, error: 'Please add the occasion and a little more detail.' });

  const requestId = 'CX-' + Date.now().toString(36).toUpperCase();
  const request = {
    id: requestId,
    name: String(name).trim(),
    email: email ? String(email).trim().toLowerCase() : null,
    contact: contact ? String(contact).trim() : null,
    occasion: String(occasion).trim(),
    recipient: recipient ? String(recipient).trim() : null,
    budget: budget ? String(budget).trim() : null,
    style: style ? String(style).trim() : null,
    idea: String(idea).trim(),
    references: references ? String(references).trim() : null,
    details: details ? String(details).trim() : null,
    status: 'Submitted',
    createdAt: new Date().toISOString()
  };

  const store = database.getStore();
  store.customRequests = store.customRequests || [];
  store.customRequests.push(request);
  database.saveStore(store);
  database.recordAuditLog('CUSTOM_REQUEST_SUBMITTED', request.email || request.contact, { requestId, status: request.status });
  return res.status(201).json({ success: true, requestId, status: request.status });
});

module.exports = router;
