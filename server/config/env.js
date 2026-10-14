const fs = require('fs');
const path = require('path');

// Automatically load .env file if present
try {
  const envPath = path.resolve(__dirname, '../../.env');
  if (fs.existsSync(envPath)) {
    const raw = fs.readFileSync(envPath, 'utf8');
    raw.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const k = trimmed.substring(0, eqIdx).trim();
        const v = trimmed.substring(eqIdx + 1).trim();
        if (k && !process.env[k]) {
          process.env[k] = v;
        }
      }
    });
  }
} catch (e) {}

const envConfig = {
  // Core Server
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.VANVI_JWT_SECRET || process.env.JWT_SECRET || 'vanvi_secret_jwt_key_development_only_change_in_prod',
  BASE_URL: process.env.BASE_URL || 'http://localhost:3000',
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim()) : ['*'],

  // Database
  DATABASE_URL: process.env.DATABASE_URL || process.env.SUPABASE_DB_URL || '',

  // Payment Gateways (Razorpay & Cashfree)
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || '',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || '',
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || '',
  CASHFREE_APP_ID: process.env.CASHFREE_APP_ID || '',
  CASHFREE_SECRET_KEY: process.env.CASHFREE_SECRET_KEY || '',
  CASHFREE_API_VERSION: process.env.CASHFREE_API_VERSION || '2023-08-01',

  // Cloud Storage (Cloudinary & S3)
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
  CLOUDINARY_URL: process.env.CLOUDINARY_URL || '',
  AWS_S3_BUCKET: process.env.AWS_S3_BUCKET || '',
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || '',
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
  AWS_REGION: process.env.AWS_REGION || 'ap-south-1',

  // AI Providers (Gemini, OpenAI, Anthropic)
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  ADMIN_OPENAI_API_KEY: process.env.ADMIN_OPENAI_API_KEY || process.env.OPENAI_API_KEY || '',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || '',

  // Email / Notifications
  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  EMAIL_FROM: process.env.EMAIL_FROM || 'Vanvi Moments <celebrate@vanvimoments.shop>',
  RESEND_API_KEY: process.env.RESEND_API_KEY || '',

  // Monitoring
  SENTRY_DSN: process.env.SENTRY_DSN || ''
};

/**
 * Validate and inspect environment status
 */
function validateEnv() {
  const isProd = envConfig.NODE_ENV === 'production';
  const warnings = [];

  if (isProd) {
    if (envConfig.JWT_SECRET.includes('development_only')) {
      warnings.push('CRITICAL: JWT_SECRET is using the development default. Set a strong secret in production!');
    }
    if (!envConfig.DATABASE_URL) {
      warnings.push('NOTICE: DATABASE_URL not set. Running on local transactional JSON store.');
    }
    if (!envConfig.RAZORPAY_KEY_ID && !envConfig.CASHFREE_APP_ID) {
      warnings.push('CRITICAL: No live payment gateway is configured. Checkout is disabled.');
    }
  }

  const integrationStatus = {
    database: envConfig.DATABASE_URL ? 'PostgreSQL / Supabase (Connected)' : 'Transactional JSON Store (Active)',
    payments: (envConfig.RAZORPAY_KEY_ID || envConfig.CASHFREE_APP_ID)
      ? 'Live Gateway Configured'
      : (isProd ? 'Unavailable (checkout disabled)' : 'Development Simulation'),
    storage: (envConfig.CLOUDINARY_CLOUD_NAME || envConfig.CLOUDINARY_URL || envConfig.AWS_S3_BUCKET) ? 'Cloud Storage Active' : 'Local Storage with Magic-Byte Validation',
    ai: (envConfig.GEMINI_API_KEY ? 'Google Gemini' : envConfig.OPENAI_API_KEY ? 'OpenAI GPT' : envConfig.ANTHROPIC_API_KEY ? 'Anthropic Claude' : 'Vanvi Emotional Poetry Engine'),
    email: (envConfig.SMTP_HOST || envConfig.RESEND_API_KEY) ? 'SMTP / Resend Configured' : 'Console Notification Simulation',
    monitoring: envConfig.SENTRY_DSN ? 'Sentry Active' : 'Internal Structured Latency & Error Logger'
  };

  return {
    isProduction: isProd,
    warnings,
    integrations: integrationStatus
  };
}

module.exports = {
  envConfig,
  validateEnv
};
