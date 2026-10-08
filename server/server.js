/**
 * VANVI MOMENTS — PRODUCTION BACKEND SERVER
 * Express + REST API + Static Asset Server
 */

const express = require('express');
const cors = require('cors');
const path = require('path');

const { securityHeaders, sanitizeBody, enforceHttps } = require('./middleware/security');
const { requestTracker, captureError, getMetricsSummary } = require('./middleware/monitoring');
const { validateEnv } = require('./config/env');
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
  origin: true,
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(sanitizeBody);

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
app.post('/api/create-order', paymentsRoutes.createOrderHandler);
app.post('/api/verify-payment', paymentsRoutes.verifyPaymentHandler);
app.get('/api/payment-config', paymentsRoutes.getConfigHandler);

// Canonical Moment Dynamic Router: /m/:slug (Resolves: slug -> moment -> template_id -> template)
const supabaseService = require('./services/supabase.service');
const fs = require('fs');

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
