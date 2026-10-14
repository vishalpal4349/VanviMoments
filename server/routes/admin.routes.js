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
    const { adminCmsService } = require('../services/admin-cms.service');
    const health = await adminCmsService.getHealthStatus();
    const tplSummary = adminCmsService.listTemplates({ limit: 1000 });
    const presets = adminCmsService.listPresets();

    metrics.templatesCount = tplSummary.counts.total;
    metrics.publishedTemplatesCount = tplSummary.counts.published;
    metrics.draftTemplatesCount = tplSummary.counts.draft;
    metrics.presetsCount = presets.length;
    metrics.systemHealth = health;

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
    const { query, tier, provider, status, role } = req.query;
    const users = await Users.listAll({ query, tier, provider, status, role });
    
    // Overview statistics for dashboard
    const allUsers = await Users.listAll({ limit: 10000 });
    const stats = {
      totalUsers: allUsers.length,
      activeUsers: allUsers.filter(u => (u.status || 'active') === 'active').length,
      suspendedUsers: allUsers.filter(u => u.status === 'suspended').length,
      vipUsers: allUsers.filter(u => u.tier === 'vip' || u.tier === 'member').length,
      googleUsers: allUsers.filter(u => u.provider === 'google').length,
      localUsers: allUsers.filter(u => (u.provider || 'local') === 'local').length,
      totalCoins: allUsers.reduce((s, u) => s + (Number(u.coins) || 0), 0)
    };

    return res.json({ success: true, users, stats });
  } catch (err) {
    console.error('Admin users fetch error:', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve users.' });
  }
});

/**
 * GET /api/admin/users/:id/dossier
 * Full A-to-Z control dossier: profile, activity, login history, coin transactions, moments, orders
 */
router.get('/users/:id/dossier', async (req, res) => {
  try {
    const { id } = req.params;
    const dossier = await Users.getUserDossier(id);
    if (!dossier) return res.status(404).json({ success: false, error: 'User dossier not found.' });

    return res.json({ success: true, dossier });
  } catch (err) {
    console.error('Admin user dossier error:', err);
    return res.status(500).json({ success: false, error: 'Failed to load user dossier.' });
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

    const numAmount = Math.abs(parseInt(amount, 10));
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ success: false, error: 'Valid coin amount is required.' });
    }

    const entry = await CoinLedger.create({
      userId: id,
      type: type === 'debit' ? 'debit' : 'credit',
      amount: numAmount,
      reason: reason || `Admin adjustment by ${req.user.name}`,
      refId: `admin_${req.user.id}`
    });

    await AuditLogs.create({
      actorUserId: req.user.id,
      action: 'coins.adjusted',
      targetEntity: 'user',
      targetId: id,
      metadata: { amount: numAmount, type, reason }
    });

    const updatedUser = await Users.findById(id);
    return res.json({ success: true, user: updatedUser, entry });
  } catch (err) {
    console.error('Admin coin adjustment error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Failed to adjust coins.' });
  }
});

/**
 * POST /api/admin/users/:id/status
 * Toggle or set status (active / suspended)
 */
router.post('/users/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'active' or 'suspended'

    if (id === req.user.id) {
      return res.status(400).json({ success: false, error: 'Cannot modify status of your own admin account.' });
    }

    const user = await Users.findById(id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found.' });

    const newStatus = status === 'suspended' ? 'suspended' : 'active';
    const updated = await Users.update(id, { status: newStatus });

    await AuditLogs.create({
      actorUserId: req.user.id,
      action: newStatus === 'suspended' ? 'user.suspended' : 'user.reactivated',
      targetEntity: 'user',
      targetId: id,
      metadata: { previousStatus: user.status, newStatus }
    });

    return res.json({ success: true, user: updated, message: `User marked as ${newStatus}.` });
  } catch (err) {
    console.error('User status toggle error:', err);
    return res.status(500).json({ success: false, error: 'Failed to update user status.' });
  }
});

/**
 * PUT /api/admin/users/:id
 * Full control: update tier, role, status, activePass, templateCredits, name, phone, email, coins
 */
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, email, tier, role, templateCredits, coins, status, activePass, passExpiry } = req.body;
    const user = await Users.findById(id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found.' });

    const updates = {};
    if (name !== undefined) updates.name = name.trim();
    if (phone !== undefined) updates.phone = phone.trim();
    if (email !== undefined && email.includes('@')) updates.email = email.trim().toLowerCase();
    if (tier !== undefined) updates.tier = tier;
    if (role !== undefined) updates.role = role;
    if (status !== undefined) updates.status = status;
    if (activePass !== undefined) updates.activePass = activePass;
    if (passExpiry !== undefined) updates.passExpiry = passExpiry;
    if (templateCredits !== undefined) updates.templateCredits = parseInt(templateCredits, 10) || 0;
    if (coins !== undefined) updates.coins = parseInt(coins, 10) || 0;

    const updated = await Users.update(id, updates);

    await AuditLogs.create({
      actorUserId: req.user.id,
      action: 'user.updated',
      targetEntity: 'user',
      targetId: id,
      metadata: updates
    });

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

    await AuditLogs.create({
      actorUserId: req.user.id,
      action: 'user.deleted',
      targetEntity: 'user',
      targetId: id
    });

    return res.json({ success: true, message: 'User account permanently removed.' });
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
    const orders = await Promise.all((await Orders.listAll({ limit: 100 })).map(async order => {
      const customer = order.userId ? await Users.findById(order.userId) : null;
      return {
        ...order,
        customerName: customer ? customer.name : null,
        customerEmail: customer ? customer.email : null,
        customerPhone: customer ? customer.phone : null
      };
    }));
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
 * POST /api/admin/copilot & POST /api/admin/ai/command
 * Vanvi Admin AI Executive Operations
 */
const copilotHandler = async (req, res) => {
  try {
    const { message, history, apiKey, confirmed, pendingAction } = req.body;
    if (!message && !pendingAction) {
      return res.status(400).json({ success: false, error: 'Message or pendingAction is required.' });
    }

    const { chatAdminCopilot } = require('../services/admin-copilot.service');
    const result = await chatAdminCopilot({
      message: message || '',
      history,
      apiKey: apiKey || req.headers['x-openai-key'],
      confirmed: !!confirmed,
      pendingAction: pendingAction || null
    });

    return res.json(result);
  } catch (err) {
    console.error('Admin AI command error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Vanvi Admin AI execution failed' });
  }
};

router.post('/copilot', copilotHandler);
router.post('/ai/command', copilotHandler);

// =========================================================================
// TEMPLATE MANAGER & CREATOR WIZARD
// =========================================================================

const { adminCmsService } = require('../services/admin-cms.service');

router.get('/templates', (req, res) => {
  try {
    const result = adminCmsService.listTemplates({
      search: req.query.search,
      category: req.query.category,
      status: req.query.status,
      limit: parseInt(req.query.limit, 10) || 100,
      offset: parseInt(req.query.offset, 10) || 0
    });
    return res.json({ success: true, ...result });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/templates/:id', (req, res) => {
  try {
    const template = adminCmsService.getTemplate(req.params.id);
    if (!template) return res.status(404).json({ success: false, error: 'Template not found.' });
    return res.json({ success: true, template });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/templates', async (req, res) => {
  try {
    const created = await adminCmsService.createTemplate(req.body, req.user.id);
    return res.status(201).json({ success: true, template: created });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

router.put('/templates/:id', async (req, res) => {
  try {
    const updated = await adminCmsService.updateTemplate(req.params.id, req.body, req.user.id);
    return res.json({ success: true, template: updated });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

router.post('/templates/:id/draft', async (req, res) => {
  try {
    const draftPayload = req.body && req.body.draftData !== undefined ? req.body.draftData : req.body;
    const result = await adminCmsService.saveTemplateDraft(req.params.id, draftPayload, req.user.id);
    return res.json({ success: true, ...result });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

router.post('/templates/:id/publish', async (req, res) => {
  try {
    const result = await adminCmsService.publishTemplate(req.params.id, req.user.id);
    if (!result.success) return res.status(422).json(result);
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

router.post('/templates/:id/unpublish', async (req, res) => {
  try {
    const result = await adminCmsService.unpublishTemplate(req.params.id, req.user.id);
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

router.delete('/templates/:id', async (req, res) => {
  try {
    const result = await adminCmsService.deleteTemplate(req.params.id, req.user.id);
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

router.get('/templates/:id/versions', (req, res) => {
  try {
    const template = adminCmsService.getTemplate(req.params.id);
    if (!template) return res.status(404).json({ success: false, error: 'Template not found.' });
    return res.json({ success: true, versions: template.versionHistory || [] });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/templates/:id/rollback', async (req, res) => {
  try {
    const version = req.body.version || req.body.versionId;
    if (!version) return res.status(400).json({ success: false, error: 'Target version required.' });
    const result = await adminCmsService.rollbackTemplate(req.params.id, version, req.user.id);
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

// =========================================================================
// PRESET MANAGER
// =========================================================================

router.get('/presets', (req, res) => {
  try {
    const presets = adminCmsService.listPresets();
    return res.json({ success: true, presets });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/presets', async (req, res) => {
  try {
    const preset = await adminCmsService.savePreset(req.body, req.user.id);
    return res.status(201).json({ success: true, preset });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

router.post('/presets/:id/duplicate', async (req, res) => {
  try {
    const duplicated = await adminCmsService.duplicatePreset(req.params.id, req.user.id);
    return res.json({ success: true, preset: duplicated });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

const handleClonePreset = async (req, res) => {
  try {
    const overrides = { ...req.body };
    if (overrides.newTemplateName && !overrides.name) {
      overrides.name = overrides.newTemplateName;
    }
    const template = await adminCmsService.clonePresetToTemplate(req.params.id, overrides, req.user.id);
    return res.json({ success: true, template });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};
router.post('/presets/:id/clone-to-template', handleClonePreset);
router.post('/presets/:id/clone-template', handleClonePreset);

router.delete('/presets/:id', async (req, res) => {
  try {
    const result = await adminCmsService.deletePreset(req.params.id, req.user.id);
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

// =========================================================================
// CONTENT & PAGE MANAGER
// =========================================================================

router.get('/content', (req, res) => {
  try {
    const content = adminCmsService.getSiteContent();
    return res.json({ success: true, content });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

const handleUpdateContent = async (req, res) => {
  try {
    const content = await adminCmsService.updateSiteContent(req.body, req.user.id);
    return res.json({ success: true, content, message: 'Storefront content updated & live!' });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

router.post('/content', handleUpdateContent);
router.put('/content', handleUpdateContent);

router.post('/content/rollback', async (req, res) => {
  try {
    const { versionId } = req.body;
    if (!versionId) return res.status(400).json({ success: false, error: 'Version ID required.' });
    const content = await adminCmsService.rollbackSiteContent(versionId, req.user.id);
    return res.json({ success: true, content, message: 'Storefront content restored.' });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

// =========================================================================
// MEDIA MANAGER (CLOUDINARY & USAGE CHECK)
// =========================================================================

router.get('/media', (req, res) => {
  try {
    const result = adminCmsService.listMedia({
      type: req.query.type,
      search: req.query.search,
      limit: parseInt(req.query.limit, 10) || 50,
      offset: parseInt(req.query.offset, 10) || 0
    });
    return res.json({ success: true, ...result });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/media/upload', async (req, res) => {
  try {
    const asset = await adminCmsService.uploadMedia(req.body, req.user.id);
    return res.status(201).json({ success: true, asset });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

router.post('/media/check-usage', (req, res) => {
  try {
    const { url } = req.body;
    const usage = adminCmsService.checkMediaUsage(url);
    return res.json({ success: true, usage });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/media/:id', async (req, res) => {
  try {
    const force = req.query.force === 'true';
    const result = await adminCmsService.deleteMedia(req.params.id, force, req.user.id);
    if (!result.success) return res.status(409).json(result);
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

// =========================================================================
// SETTINGS & SYSTEM HEALTH
// =========================================================================

router.get('/settings', (req, res) => {
  try {
    const settings = adminCmsService.getSettings();
    return res.json({ success: true, settings });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

const handleUpdateSettings = async (req, res) => {
  try {
    const settings = await adminCmsService.updateSettings(req.body, req.user.id);
    return res.json({ success: true, settings, message: 'Settings saved.' });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

router.post('/settings', handleUpdateSettings);
router.put('/settings', handleUpdateSettings);

router.get('/health', async (req, res) => {
  try {
    const health = await adminCmsService.getHealthStatus();
    return res.json({ success: true, health });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
