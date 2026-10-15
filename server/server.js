/**
 * VANVI MOMENTS — PRODUCTION BACKEND SERVER
 * Express + REST API + Static Asset Server
 */

const express = require('express');
const cors = require('cors');
const path = require('path');

const { securityHeaders, sanitizeBody, enforceHttps } = require('./middleware/security');
const { optionalAuth } = require('./middleware/auth');
const { requestTracker, captureError, getMetricsSummary } = require('./middleware/monitoring');
const { validateEnv, envConfig } = require('./config/env');
const { testConnection } = require('./db/database');

const authRoutes = require('./routes/auth.routes');
const momentsRoutes = require('./routes/moments.routes');
const coinsRoutes = require('./routes/coins.routes');
const ordersRoutes = require('./routes/orders.routes');
const paymentsRoutes = require('./routes/payments.routes');
const aiRoutes = require('./routes/ai.routes');
const uploadRoutes = require('./routes/upload.routes');
const membershipRoutes = require('./routes/membership.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const adminRoutes = require('./routes/admin.routes');
const contactRoutes = require('./routes/contact.routes');
const customRequestRoutes = require('./routes/custom-requests.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Reverse Proxy & Domain Trust (Cloudflare, Nginx, Render, Heroku)
app.set('trust proxy', 1);

// Security & Observability Middlewares
app.use(enforceHttps);
app.use(securityHeaders);
app.use(requestTracker);
app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    const allowedOrigins = envConfig.ALLOWED_ORIGINS;
    const wildcardAllowed = envConfig.NODE_ENV !== 'production' && allowedOrigins.includes('*');
    if (wildcardAllowed || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Origin is not allowed by CORS.'));
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(sanitizeBody);

// Auto-heal Windows local path URLs (e.g., /c:/Users/RISHU%20KUMARI/VanviMoments/... or /c%3A/...)
app.use((req, res, next) => {
  try {
    if (req.path.startsWith('/api/')) return next();
    const rawUrl = req.url;
    const decoded = decodeURIComponent(rawUrl);
    const isMangled = /^\/?[a-zA-Z]:[\\\/]/i.test(decoded) || 
                      /(?:^|\/)[a-zA-Z]:(?:\/|\\)/i.test(decoded) ||
                      /(?:^|\/)users[\/\\]/i.test(decoded) ||
                      /vanvimoments[\/\\]/i.test(decoded);

    const aliasMap = {
      'account': '/profile.html',
      'my-account': '/profile.html',
      'settings': '/profile.html',
      'orders': '/dashboard.html',
      'order': '/dashboard.html',
      'my-orders': '/dashboard.html',
      'moments': '/dashboard.html',
      'wallet': '/plans.html',
      'explore': '/templates.html',
      'shop': '/products.html',
      'store': '/products.html'
    };

    if (isMangled) {
      let clean = '';
      const vmMatch = decoded.match(/(?:vanvimoments)[\/\\](.*)/i);
      if (vmMatch && vmMatch[1]) {
        clean = '/' + vmMatch[1].replace(/\\/g, '/');
      } else {
        const tplMatch = decoded.match(/((?:templates|assets|css|js|uploads)[\/\\].*)/i);
        if (tplMatch && tplMatch[1]) {
          clean = '/' + tplMatch[1].replace(/\\/g, '/');
        } else {
          const htmlMatch = decoded.match(/([a-zA-Z0-9_\-]+\.html)/i);
          if (htmlMatch && htmlMatch[1]) {
            clean = '/' + htmlMatch[1];
          } else {
            clean = '/index.html';
          }
        }
      }
      clean = clean.replace(/\/+/g, '/');
      const cleanSlug = (clean.split('/').filter(Boolean).pop() || '').replace(/\.html$/i, '').toLowerCase();
      if (aliasMap[cleanSlug]) {
        clean = aliasMap[cleanSlug];
      }
      if (clean && clean !== rawUrl) {
        return res.redirect(302, clean);
      }
    } else {
      const slug = (req.path.split('/').filter(Boolean).pop() || '').replace(/\.html$/i, '').toLowerCase();
      if (aliasMap[slug]) {
        return res.redirect(302, aliasMap[slug]);
      }
    }
  } catch (err) {}
  next();
});

// Health check endpoint with deep service status
app.get('/api/health', async (req, res) => {
  const envStatus = validateEnv();
  const dbStatus = await testConnection();
  const metrics = getMetricsSummary();

  res.json({
    status: 'healthy',
    service: 'vanvi-moments-api',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: Date.now(),
    database: dbStatus,
    integrations: envStatus.integrations,
    metrics
  });
});

app.get('/api/config/public', (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.json({
    googleClientId: process.env.GOOGLE_CLIENT_ID || '',
    razorpayKeyId: process.env.RAZORPAY_KEY_ID || ''
  });
});

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/moments', momentsRoutes);
app.use('/api/coins', coinsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/membership', membershipRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/custom-requests', customRequestRoutes);

// Razorpay Standard Checkout Endpoints (Direct Mounts)
app.post('/api/create-order', optionalAuth, paymentsRoutes.createOrderHandler);
app.post('/api/verify-payment', optionalAuth, paymentsRoutes.verifyPaymentHandler);
app.get('/api/payment-config', paymentsRoutes.getConfigHandler);
app.post('/api/setup-razorpay', (req, res) => {
  return res.status(410).json({
    success: false,
    error: 'Payment credentials must be configured as server environment variables.'
  });
});

// Canonical Moment Dynamic Router: /m/:slug (Resolves: slug -> moment -> template_id -> template)
const supabaseService = require('./services/supabase.service');
const fs = require('fs');

// Friendship Microsites API Endpoints & Short-link Router: /f/:slug
app.post('/api/friendship/save', async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.status(503).json({
        success: false,
        error: 'Friendship publishing is unavailable until verified checkout is configured.'
      });
    }
    const { payment_id, order_id, signature, config, friendName, slug: reqSlug } = req.body;
    
    // Auto-generate clean friendly slug if not given
    let slug = reqSlug;
    if (!slug) {
      const cleanName = friendName ? friendName.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'bestie';
      const randStr = Math.random().toString(36).substring(2, 7);
      slug = `${cleanName}-${randStr}`;
    }

    const saved = await supabaseService.createFriendshipMicrosite({
      slug,
      config: config || {},
      payment_id: payment_id || 'pay_sim_' + Date.now(),
      order_id: order_id || 'order_sim_' + Date.now(),
      amount: 99,
      status: 'paid'
    });

    const shortUrl = `https://vanvimoments.com/f/${encodeURIComponent(saved.slug)}`;
    return res.json({
      success: true,
      slug: saved.slug,
      shortUrl,
      localUrl: `/Bestie%20Friendship%F0%9F%98%98/index.html?f=${encodeURIComponent(saved.slug)}`,
      data: saved
    });
  } catch (err) {
    console.error('Save friendship microsite error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Failed to save friendship microsite' });
  }
});

app.get('/api/friendship/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    if (!slug) return res.status(400).json({ success: false, error: 'Slug is required' });

    const site = await supabaseService.getFriendshipMicrositeBySlug(slug);
    if (!site) {
      return res.status(404).json({ success: false, error: 'Friendship microsite not found' });
    }
    return res.json({ success: true, data: site });
  } catch (err) {
    console.error('Fetch friendship microsite error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
});

app.get(['/f/:slug', '/f/:slug/'], async (req, res, next) => {
  try {
    const { slug } = req.params;
    if (!slug) return res.redirect('/category-friendship.html');
    return res.redirect(`/Bestie%20Friendship%F0%9F%98%98/index.html?f=${encodeURIComponent(slug)}`);
  } catch (err) {
    next(err);
  }
});

app.get('/m/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    if (!slug) return res.redirect('/templates.html');

    const moment = await supabaseService.getMomentBySlug(slug);
    if (moment) {
      const templateId = moment.template_id || moment.templateId;
      if (templateId) {
        const templateHtmlPath = path.join(path.join(__dirname, '..'), 'templates', templateId, 'index.html');
        if (fs.existsSync(templateHtmlPath)) {
          return res.redirect(`/templates/${encodeURIComponent(templateId)}/index.html?id=${encodeURIComponent(moment.id)}&slug=${encodeURIComponent(moment.slug || slug)}`);
        }
      }
      return res.redirect(`/moment.html?id=${encodeURIComponent(moment.id)}&slug=${encodeURIComponent(moment.slug || slug)}`);
    }

    // Client-side fallback for offline/guest moments
    return res.redirect(`/moment.html?slug=${encodeURIComponent(slug)}`);
  } catch (err) {
    next(err);
  }
});


// Legacy 301 Redirects for Decommissioned Pages (experience.html & ai.html)
app.get(['/experience.html', '/experience'], (req, res) => {
  const query = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
  return res.redirect(301, `/moment.html${query}`);
});
app.get(['/ai.html', '/ai'], (req, res) => {
  const query = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
  return res.redirect(301, `/ai-matcher.html${query}`);
});
app.get(['/constellation-of-love.html', '/constellation-of-love'], (req, res) => {
  return res.redirect(301, '/games.html');
});
app.get(['/floral-mehendi-story', '/floral-mehendi-story/'], (req, res) => {
  const query = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
  return res.redirect(301, `/templates/floral-mehendi-story/index.html${query}`);
});
app.get(['/sacred-temple-edition', '/sacred-temple-edition/'], (req, res) => {
  const query = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
  return res.redirect(301, `/templates/sacred-temple-edition/index.html${query}`);
});
app.get(['/golden-lake-collection', '/golden-lake-collection/'], (req, res) => {
  const query = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
  return res.redirect(301, `/templates/golden-lake-collection/index.html${query}`);
});

// Serve static uploads & frontend files from project root
const ROOT_DIR = path.join(__dirname, '..');
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
app.get('/favicon.ico', (req, res) => res.sendFile(path.join(ROOT_DIR, 'assets', 'favicon.svg')));
app.use('/uploads', express.static(UPLOADS_DIR, { maxAge: '7d', etag: true }));
app.use(express.static(ROOT_DIR, {
  maxAge: process.env.NODE_ENV === 'production' ? '1d' : '1h',
  etag: true
}));

// Fallback to index.html for unknown non-API routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, error: 'Endpoint not found' });
  }
  res.status(404).sendFile(path.join(ROOT_DIR, '404.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
  captureError(err, req);
  res.status(500).json({
    success: false,
    error: 'An internal server error occurred.',
    requestId: req.id || null
  });
});

// Export app for testing, start if executed directly
if (require.main === module) {
  const envStatus = validateEnv();

  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`✨ VANVI MOMENTS — PRODUCTION BACKEND LAUNCHED`);
    console.log(`======================================================`);
    console.log(`🌐 Server URL:   http://localhost:${PORT}`);
    console.log(`📁 Static UI:    http://localhost:${PORT}/index.html`);
    console.log(`🔒 API Health:   http://localhost:${PORT}/api/health`);
    console.log(`⚡ Environment:  ${process.env.NODE_ENV || 'development'}`);
    console.log(`------------------------------------------------------`);
    console.log(`🗄️  Database:    ${envStatus.integrations.database}`);
    console.log(`💳 Payments:    ${envStatus.integrations.payments}`);
    console.log(`📸 Storage:     ${envStatus.integrations.storage}`);
    console.log(`🤖 AI Engine:   ${envStatus.integrations.ai}`);
    console.log(`📧 Email Desk:  ${envStatus.integrations.email}`);
    console.log(`======================================================\n`);
  });
}

module.exports = app;
