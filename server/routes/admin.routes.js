const express = require('express');
const router = express.Router();
const { Users, Moments, Orders, CoinLedger, AnalyticsEvents, AuditLogs } = require('../db/database');
const { requireAuth } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/security');

// Protect all admin routes with authentication and admin role
router.use(requireAuth, requireAdmin);

/**
 * GET /api/admin/overview
 * KPI metrics & recent activity
 */
router.get('/overview', async (req, res) => {
  try {
    const metrics = await AnalyticsEvents.getMetrics();
    return res.json({ success: true, metrics });
  } catch (err) {
    console.error('Admin overview error:', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve admin overview.' });
  }
});

/**
 * GET /api/admin/users
 */
router.get('/users', async (req, res) => {
  try {
    const { query } = req.query;
    const users = await Users.listAll({ query });
    return res.json({ success: true, users });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to retrieve users.' });
  }
});

/**
 * POST /api/admin/users/:id/coins
 * Adjust coins with audit logging
 */
router.post('/users/:id/coins', async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, reason, type } = req.body; // type: 'credit' or 'debit'

    const user = await Users.findById(id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found.' });

    const entry = await CoinLedger.create({
      userId: id,
      type: type === 'debit' ? 'debit' : 'credit',
      amount: Math.abs(parseInt(amount, 10)),
      reason: reason || `Admin adjustment by ${req.user.name}`,
      refId: `admin_${req.user.id}`
    });

    await AuditLogs.create({
      actorUserId: req.user.id,
      action: 'coins.adjusted',
      targetEntity: 'user',
      targetId: id,
      metadata: { amount, type, reason }
    });

    const updatedUser = await Users.findById(id);
    return res.json({ success: true, user: updatedUser, entry });
  } catch (err) {
    console.error('Admin coin adjustment error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Failed to adjust coins.' });
  }
});

/**
 * PUT /api/admin/users/:id
 * Update user details (tier, role, templateCredits, name, phone, etc.)
 */
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, tier, role, templateCredits, coins } = req.body;
    const user = await Users.findById(id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found.' });

    const updates = {};
    if (name !== undefined) updates.name = name.trim();
    if (phone !== undefined) updates.phone = phone.trim();
    if (tier !== undefined) updates.tier = tier;
    if (role !== undefined) updates.role = role;
    if (templateCredits !== undefined) updates.templateCredits = parseInt(templateCredits, 10) || 0;
    if (coins !== undefined) updates.coins = parseInt(coins, 10) || 0;

    const updated = await Users.update(id, updates);
    return res.json({ success: true, user: updated });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to update user.' });
  }
});

/**
 * DELETE /api/admin/users/:id
 */
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (id === req.user.id) {
      return res.status(400).json({ success: false, error: 'Cannot delete current logged in admin account.' });
    }
    const success = await Users.delete(id);
    if (!success) return res.status(404).json({ success: false, error: 'User not found.' });
    return res.json({ success: true, message: 'User account removed.' });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to delete user.' });
  }
});

/**
 * GET /api/admin/moments
 */
router.get('/moments', async (req, res) => {
  try {
    const { query, status } = req.query;
    const moments = await Moments.listAll({ query, status });
    return res.json({ success: true, moments });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to retrieve moments.' });
  }
});

/**
 * POST /api/admin/moments/:id/status
 * Revoke / Publish moment moderation
 */
router.post('/moments/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'published' or 'revoked'

    let moment = null;
    if (status === 'revoked') {
      moment = await Moments.revoke(id, req.user.id);
    } else {
      moment = await Moments.update(id, { status });
    }

    if (!moment) return res.status(404).json({ success: false, error: 'Moment not found.' });

    return res.json({ success: true, moment, message: `Moment status updated to ${status}.` });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to update moment status.' });
  }
});

/**
 * GET /api/admin/orders
 */
router.get('/orders', async (req, res) => {
  try {
    const orders = await Orders.listAll({ limit: 100 });
    return res.json({ success: true, orders });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to retrieve orders.' });
  }
});

/**
 * POST /api/admin/orders/:id/refund
 * Refund order & restore coins
 */
router.post('/orders/:id/refund', async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const order = await Orders.refund(id, reason || 'Admin processed refund', req.user.id);
    if (!order) return res.status(404).json({ success: false, error: 'Order not found.' });

    return res.json({ success: true, order, message: 'Order refunded and coins restored successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to refund order.' });
  }
});

/**
 * GET /api/admin/audit-logs
 */
router.get('/audit-logs', async (req, res) => {
  try {
    const logs = await AuditLogs.list(50);
    return res.json({ success: true, logs });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to retrieve audit logs.' });
  }
});

/**
 * GET /api/admin/custom-requests
 * Fetch all bespoke custom requests from backend store
 */
router.get('/custom-requests', async (req, res) => {
  try {
    const { Users, Moments, Orders, CoinLedger, AnalyticsEvents, AuditLogs } = require('../db/database');
    const store = require('../db/database').getStore();
    const requests = store.customRequests || [];
    return res.json({ success: true, requests });
  } catch (err) {
    console.error('Admin custom-requests error:', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve custom requests.' });
  }
});

/**
 * POST /api/admin/custom-requests/:id/status
 * Update bespoke request status (PENDING_REVIEW, IN_PROGRESS, COMPLETED, REJECTED)
 */
router.post('/custom-requests/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const store = require('../db/database').getStore();
    if (!store.customRequests) store.customRequests = [];
    const reqIdx = store.customRequests.findIndex(r => r.id === id || r.requestId === id);
    if (reqIdx === -1) return res.status(404).json({ success: false, error: 'Custom request not found.' });
    store.customRequests[reqIdx].status = status;
    store.customRequests[reqIdx].updatedAt = new Date().toISOString();
    require('../db/database').saveStore(store);
    return res.json({ success: true, request: store.customRequests[reqIdx] });
  } catch (err) {
    console.error('Admin custom-request status error:', err);
    return res.status(500).json({ success: false, error: 'Failed to update request status.' });
  }
});

/**
 * POST /api/admin/copilot
 * Autonomous Admin Copilot powered by OpenAI GPT
 */
router.post('/copilot', async (req, res) => {
  try {
    const { message, history, apiKey } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, error: 'Message is required.' });
    }

    const { chatAdminCopilot } = require('../services/admin-copilot.service');
    const result = await chatAdminCopilot({
      message,
      history,
      apiKey: apiKey || req.headers['x-openai-key']
    });

    return res.json(result);
  } catch (err) {
    console.error('Admin Copilot error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Copilot execution failed' });
  }
});

module.exports = router;

