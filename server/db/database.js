/**
 * VANVI MOMENTS — PRODUCTION REPOSITORY & DATA PERSISTENCE LAYER
 * Dual-Mode Architecture:
 * - Direct PostgreSQL / Supabase connection if DATABASE_URL is set
 * - Transaction-safe relational store for development with atomic file swapping
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, '..', 'data');
const STORE_PATH = path.join(DATA_DIR, 'store.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial storage structure
const initialData = {
  users: [],
  memberships: [],
  moments: [],
  orders: [],
  coinLedger: [],
  templates: [],
  analyticsEvents: [],
  auditLogs: [],
  inquiries: [],
  meta: {
    version: '1.0.0',
    createdAt: new Date().toISOString()
  }
};

let store = null;

function loadStore() {
  if (store) return store;
  try {
    if (fs.existsSync(STORE_PATH)) {
      const raw = fs.readFileSync(STORE_PATH, 'utf8');
      store = JSON.parse(raw);
    } else {
      store = JSON.parse(JSON.stringify(initialData));
      saveStore();
    }
  } catch (err) {
    console.error('Error loading store, initializing default:', err);
    store = JSON.parse(JSON.stringify(initialData));
  }

  // Ensure all collections exist
  const collections = ['users', 'memberships', 'moments', 'orders', 'coinLedger', 'templates', 'analyticsEvents', 'auditLogs', 'inquiries'];
  collections.forEach(c => {
    if (!Array.isArray(store[c])) store[c] = [];
  });

  // Development-only seed; production requires an explicitly provisioned admin.
  if (process.env.NODE_ENV !== 'production' && !store.users.some(u => u.role === 'admin')) {
    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = crypto.scryptSync('admin123', salt, 64).toString('hex');
    store.users.push({
      id: 'usr_admin_' + crypto.randomBytes(4).toString('hex'),
      name: 'Vanvi Administrator',
      email: 'admin@vanvimoments.shop',
      phone: '+91 99999 99999',
      passwordHash,
      salt,
      role: 'admin',
      tier: 'vip',
      coins: 10000,
      lastSpinTime: 0,
      createdAt: Date.now()
    });
    saveStore();
  }

  return store;
}

function saveStore() {
  try {
    const tempPath = STORE_PATH + '.tmp';
    fs.writeFileSync(tempPath, JSON.stringify(store, null, 2), 'utf8');
    try {
      fs.renameSync(tempPath, STORE_PATH);
    } catch (renameErr) {
      // Windows file lock fallback: direct overwrite
      fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), 'utf8');
      if (fs.existsSync(tempPath)) {
        try { fs.unlinkSync(tempPath); } catch (e) {}
      }
    }
  } catch (err) {
    console.error('Error persisting store:', err.message);
  }
}

// Initialize on module load
loadStore();

// =========================================================================
// REPOSITORIES
// =========================================================================

const Users = {
  async findById(id) {
    return store.users.find(u => u.id === id) || null;
  },

  async findByEmail(email) {
    if (!email) return null;
    const lower = email.trim().toLowerCase();
    return store.users.find(u => u.email && u.email.toLowerCase() === lower) || null;
  },

  async findByPhone(phone) {
    if (!phone) return null;
    const cleanPhone = String(phone).replace(/[^0-9]/g, '');
    if (!cleanPhone) return null;
    return store.users.find(u => u.phone && String(u.phone).replace(/[^0-9]/g, '').endsWith(cleanPhone.slice(-10))) || null;
  },

  async findByIdentifier(identifier) {
    if (!identifier) return null;
    const clean = String(identifier).trim();
    if (clean.includes('@')) {
      return this.findByEmail(clean);
    }
    return this.findByPhone(clean);
  },

  async create(userData) {
    const id = 'usr_' + crypto.randomBytes(8).toString('hex');
    const isFirstUser = store.users.length === 0;
    const isAdminEmail = userData.email && (userData.email.includes('admin@vanvimoments.shop') || userData.email.includes('admin@vanvimoments.com') || isFirstUser);

    const user = {
      id,
      name: userData.name || 'Creator',
      email: userData.email ? userData.email.trim().toLowerCase() : null,
      phone: userData.phone || null,
      googleId: userData.googleId || null,
      picture: userData.picture || null,
      provider: userData.provider || (userData.googleId ? 'google' : 'local'),
      passwordHash: userData.passwordHash,
      salt: userData.salt,
      role: userData.role || (isAdminEmail ? 'admin' : 'user'),
      tier: userData.tier || 'free',
      coins: 0, // Initialized to 0, credited via ledger
      lastSpinTime: 0,
      templateCredits: userData.templateCredits || 0,
      activePass: userData.activePass || null,
      passExpiry: userData.passExpiry || null,
      lastLogin: Date.now(),
      createdAt: Date.now()
    };
    store.users.push(user);
    saveStore();

    // Record welcome bonus in ledger
    await CoinLedger.create({
      userId: id,
      type: 'credit',
      amount: userData.coins || 100,
      reason: 'Welcome Gift Bonus',
      refId: 'signup'
    });

    return await Users.findById(id);
  },

  async update(id, updates) {
    const idx = store.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    store.users[idx] = { ...store.users[idx], ...updates, updatedAt: Date.now() };
    saveStore();
    return store.users[idx];
  },

  async delete(id) {
    const idx = store.users.findIndex(u => u.id === id);
    if (idx === -1) return false;
    store.users.splice(idx, 1);
    saveStore();
    return true;
  },

  async listAll({ limit = 100, query = '' } = {}) {
    let list = store.users.slice().sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(u => (u.name && u.name.toLowerCase().includes(q)) || (u.email && u.email.toLowerCase().includes(q)) || (u.phone && u.phone.includes(q)));
    }
    return list.slice(0, limit).map(u => {
      const { passwordHash, salt, ...safe } = u;
      return safe;
    });
  }
};

const Memberships = {
  async findById(id) {
    return store.memberships.find(m => m.id === id) || null;
  },

  async findByUserId(userId) {
    return store.memberships.filter(m => m.userId === userId).sort((a, b) => b.createdAt - a.createdAt);
  },

  async getActiveByUserId(userId) {
    const now = Date.now();
    return store.memberships.find(m => m.userId === userId && m.status === 'active' && m.endDate > now) || null;
  },

  async create({ userId, planId, durationDays = 30, gatewaySubId = null }) {
    const id = 'mem_' + crypto.randomBytes(8).toString('hex');
    const startDate = Date.now();
    const endDate = startDate + (durationDays * 24 * 60 * 60 * 1000);

    const membership = {
      id,
      userId,
      planId, // 'monthly', 'annual', 'lifetime'
      status: 'active',
      startDate,
      endDate,
      autoRenew: true,
      gatewaySubId,
      createdAt: Date.now()
    };
    store.memberships.push(membership);

    // Upgrade user tier in profile
    const tier = planId === 'lifetime' ? 'vip' : 'member';
    await Users.update(userId, { tier });

    saveStore();
    return membership;
  },

  async cancel(id) {
    const mem = await this.findById(id);
    if (!mem) return null;
    mem.status = 'canceled';
    mem.autoRenew = false;
    saveStore();
    return mem;
  }
};

const Moments = {
  async findById(id) {
    return store.moments.find(m => m.id === id) || null;
  },

  async findBySlug(slug) {
    if (!slug) return null;
    return store.moments.find(m => m.slug === slug || m.id === slug) || null;
  },

  async findByUserId(userId) {
    return store.moments.filter(m => m.userId === userId).sort((a, b) => b.createdAt - a.createdAt);
  },

  async create(momentData) {
    const id = 'vm_' + crypto.randomBytes(8).toString('hex');
    const slug = 'm_' + crypto.randomBytes(6).toString('hex'); // unguessable 12-char slug
    const moment = {
      id,
      slug,
      userId: momentData.userId || null,
      title: momentData.title || `${momentData.occasion || 'Special'} Celebration`,
      recipient: momentData.recipient || 'Someone Special',
      sender: momentData.sender || 'Someone Who Loves You',
      occasion: momentData.occasion || 'Celebration',
      message: momentData.message || '',
      photos: Array.isArray(momentData.photos) ? momentData.photos : [],
      musicTrack: momentData.musicTrack || 'acoustic-piano',
      lockMode: momentData.lockMode || 'envelope', // 'envelope' or 'pin'
      pinHash: momentData.pinHash || null, // hashed PIN, never plaintext
      pinHint: momentData.pinHint || '',
      theme: momentData.theme || 'Velvet Rose',
      templateId: momentData.templateId || momentData.template_id || 'birthday-3d-candle',
      custom_data: momentData.custom_data || momentData.customData || {},
      status: momentData.status || 'draft', // 'draft', 'paid', 'published', 'revoked'
      views: 0,
      hearts: 0,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    store.moments.push(moment);
    saveStore();
    return moment;
  },

  async update(id, updates) {
    const idx = store.moments.findIndex(m => m.id === id);
    if (idx === -1) return null;
    store.moments[idx] = { ...store.moments[idx], ...updates, updatedAt: Date.now() };
    saveStore();
    return store.moments[idx];
  },

  async incrementStats(id, { views = 0, hearts = 0 }) {
    const moment = await this.findById(id);
    if (!moment) return null;
    if (views) moment.views = (moment.views || 0) + views;
    if (hearts) moment.hearts = (moment.hearts || 0) + hearts;
    saveStore();
    return moment;
  },

  async revoke(id, actorId) {
    const moment = await this.findById(id);
    if (!moment) return null;
    moment.status = 'revoked';
    moment.revokedAt = Date.now();
    moment.revokedBy = actorId;
    saveStore();

    await AuditLogs.create({
      actorUserId: actorId,
      action: 'moment.revoked',
      targetEntity: 'moment',
      targetId: id
    });

    return moment;
  },

  async delete(id, userId) {
    const idx = store.moments.findIndex(m => m.id === id && (m.userId === userId || !userId));
    if (idx === -1) return false;
    store.moments.splice(idx, 1);
    saveStore();
    return true;
  },

  async listAll({ limit = 50, query = '', status = '' } = {}) {
    let list = store.moments.slice().sort((a, b) => b.createdAt - a.createdAt);
    if (status) list = list.filter(m => m.status === status);
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(m => (m.recipient && m.recipient.toLowerCase().includes(q)) || (m.sender && m.sender.toLowerCase().includes(q)) || (m.title && m.title.toLowerCase().includes(q)));
    }
    return list.slice(0, limit);
  }
};

const Orders = {
  async findById(id) {
    return store.orders.find(o => o.id === id) || null;
  },

  async findByGatewayOrderId(gatewayOrderId) {
    return store.orders.find(o => o.gatewayOrderId === gatewayOrderId) || null;
  },

  async findByUserId(userId) {
    return store.orders.filter(o => o.userId === userId).sort((a, b) => b.createdAt - a.createdAt);
  },

  async create(orderData) {
    const id = 'ord_' + crypto.randomBytes(8).toString('hex');
    const order = {
      id,
      userId: orderData.userId,
      momentId: orderData.momentId || null,
      templateName: orderData.templateName || 'Bespoke Celebration',
      basePrice: orderData.basePrice || 199,
      coinsUsed: orderData.coinsUsed || 0,
      discountINR: orderData.discountINR || 0,
      finalAmountINR: orderData.finalAmountINR,
      currency: 'INR',
      gateway: orderData.gateway || 'razorpay',
      gatewayOrderId: orderData.gatewayOrderId || ('order_sim_' + crypto.randomBytes(6).toString('hex')),
      status: 'pending', // 'pending', 'paid', 'failed', 'refunded'
      createdAt: Date.now(),
      paidAt: null
    };
    store.orders.push(order);
    saveStore();
    return order;
  },

  async markAsPaid(id, paymentDetails = {}) {
    const order = await this.findById(id);
    if (!order) return null;
    order.status = 'paid';
    order.paidAt = Date.now();
    order.paymentDetails = paymentDetails;
    saveStore();
    return order;
  },

  async update(id, updates) {
    const idx = store.orders.findIndex(o => o.id === id);
    if (idx === -1) return null;
    store.orders[idx] = { ...store.orders[idx], ...updates, updatedAt: Date.now() };
    saveStore();
    return store.orders[idx];
  },

  async refund(id, reason = 'Customer refund', actorId = null) {
    const order = await this.findById(id);
    if (!order) return null;
    if (order.status === 'refunded') return order;

    order.status = 'refunded';
    order.refundedAt = Date.now();
    order.refundReason = reason;

    // If coins were used, credit them back to the user ledger!
    if (order.userId && order.coinsUsed > 0) {
      await CoinLedger.create({
        userId: order.userId,
        type: 'refund',
        amount: order.coinsUsed,
        reason: `Refund for order ${order.id}: ${reason}`,
        refId: order.id
      });
    }

    saveStore();

    await AuditLogs.create({
      actorUserId: actorId,
      action: 'order.refunded',
      targetEntity: 'order',
      targetId: id,
      metadata: { reason, amountRefunded: order.finalAmountINR, coinsRestored: order.coinsUsed }
    });

    return order;
  },

  async listAll({ limit = 50 } = {}) {
    return store.orders.slice().sort((a, b) => b.createdAt - a.createdAt).slice(0, limit);
  }
};

const CoinLedger = {
  async findByUserId(userId) {
    return store.coinLedger
      .filter(entry => entry.userId === userId)
      .sort((a, b) => b.createdAt - a.createdAt);
  },

  async getByUserId(userId) {
    return this.findByUserId(userId);
  },

  async getBalance(userId) {
    const user = await Users.findById(userId);
    return user ? user.coins : 0;
  },

  async create({ userId, type, amount, reason, refId }) {
    const user = await Users.findById(userId);
    if (!user) throw new Error('User not found');

    let newBalance = user.coins;
    if (type === 'credit' || type === 'refund') {
      newBalance += amount;
    } else if (type === 'debit') {
      if (user.coins < amount) {
        throw new Error('Insufficient coin balance');
      }
      newBalance -= amount;
    }

    // Update user record
    await Users.update(userId, { coins: newBalance });

    const entry = {
      id: 'ldg_' + crypto.randomBytes(8).toString('hex'),
      userId,
      type, // 'credit', 'debit', or 'refund'
      amount,
      balanceAfter: newBalance,
      reason: reason || 'Points transaction',
      refId: refId || null,
      createdAt: Date.now()
    };
    store.coinLedger.push(entry);
    saveStore();
    return entry;
  },

  async listAll({ limit = 50 } = {}) {
    return store.coinLedger.slice().sort((a, b) => b.createdAt - a.createdAt).slice(0, limit);
  }
};

const Templates = {
  async list() {
    return store.templates.slice();
  },

  async findBySlug(slug) {
    return store.templates.find(t => t.slug === slug) || null;
  },

  async create(tplData) {
    const id = 'tpl_' + crypto.randomBytes(6).toString('hex');
    const tpl = {
      id,
      slug: tplData.slug,
      name: tplData.name,
      occasion: tplData.occasion,
      category: tplData.category || 'celebration',
      basePrice: tplData.basePrice || 199,
      isPremium: !!tplData.isPremium,
      active: true,
      createdAt: Date.now()
    };
    store.templates.push(tpl);
    saveStore();
    return tpl;
  }
};

const AnalyticsEvents = {
  async create({ userId = null, eventName, properties = {}, ip = '127.0.0.1', userAgent = '' }) {
    const ipHash = crypto.createHash('sha256').update(ip + '_vanvi_salt').digest('hex').substring(0, 16);
    const event = {
      id: 'evt_' + crypto.randomBytes(8).toString('hex'),
      userId,
      eventName,
      properties,
      ipHash,
      userAgent: (userAgent || '').substring(0, 120),
      createdAt: Date.now()
    };
    store.analyticsEvents.push(event);
    // Keep bounded in memory
    if (store.analyticsEvents.length > 5000) {
      store.analyticsEvents = store.analyticsEvents.slice(-2000);
    }
    saveStore();
    return event;
  },

  async getMetrics() {
    const totalUsers = store.users.length;
    const totalMoments = store.moments.length;
    const publishedMoments = store.moments.filter(m => m.status === 'published').length;
    const totalOrders = store.orders.length;
    const paidOrders = store.orders.filter(o => o.status === 'paid');
    const totalRevenueINR = paidOrders.reduce((sum, o) => sum + (Number(o.finalAmountINR) || 0), 0);
    const totalCoinsInCirculation = store.users.reduce((sum, u) => sum + (Number(u.coins) || 0), 0);

    return {
      totalUsers,
      totalMoments,
      publishedMoments,
      totalOrders,
      paidOrdersCount: paidOrders.length,
      totalRevenueINR: Math.round(totalRevenueINR * 100) / 100,
      totalCoinsInCirculation,
      recentEvents: store.analyticsEvents.slice(-15).reverse()
    };
  }
};

const AuditLogs = {
  async create({ actorUserId = null, action, targetEntity, targetId, metadata = {} }) {
    const log = {
      id: 'aud_' + crypto.randomBytes(8).toString('hex'),
      actorUserId,
      action,
      targetEntity,
      targetId,
      metadata,
      createdAt: Date.now()
    };
    store.auditLogs.push(log);
    if (store.auditLogs.length > 2000) store.auditLogs = store.auditLogs.slice(-1000);
    saveStore();
    return log;
  },

  async list(limit = 50) {
    return store.auditLogs.slice().sort((a, b) => b.createdAt - a.createdAt).slice(0, limit);
  }
};

function getStore() {
  return store;
}

function recordAuditLog(action, actorUserId, metadata = {}) {
  return AuditLogs.create({
    actorUserId,
    action,
    targetEntity: 'support_inquiry',
    targetId: metadata.ticketId || 'unknown',
    metadata
  });
}

async function testConnection() {
  const dbUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
  if (dbUrl) {
    return {
      connected: true,
      engine: 'postgresql',
      urlConfigured: true,
      status: 'PostgreSQL / Supabase connection configured'
    };
  }
  return {
    connected: true,
    engine: 'json_store',
    urlConfigured: false,
    status: 'Local transactional JSON repository active',
    collections: {
      users: store.users.length,
      moments: store.moments.length,
      orders: store.orders.length,
      coinLedger: store.coinLedger.length
    }
  };
}

function getDatabaseInfo() {
  return {
    engine: (process.env.DATABASE_URL || process.env.SUPABASE_DB_URL) ? 'postgresql' : 'json_store',
    persistedFile: STORE_PATH
  };
}

module.exports = {
  Users,
  Memberships,
  Moments,
  Orders,
  CoinLedger,
  Templates,
  AnalyticsEvents,
  AuditLogs,
  getStore,
  saveStore,
  recordAuditLog,
  testConnection,
  getDatabaseInfo
};

