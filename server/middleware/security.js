/**
 * VANVI MOMENTS — PRODUCTION SECURITY & SANITIZATION MIDDLEWARE
 * Enforces security headers (HSTS, CSP, XSS), recursive input sanitization,
 * route-specific rate limiters, timing-safe crypto, and role-based authorization.
 */

const crypto = require('crypto');

// In-memory rate-limiter map: key -> { count, resetTime }
const rateLimitMap = new Map();

// Periodic cleanup of stale rate-limit records every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 10 * 60 * 1000).unref();

function rateLimiter(windowMs = 60 * 1000, maxRequests = 60, message = 'Too many requests. Please slow down.') {
  return (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress || '127.0.0.1';
    const key = `${req.baseUrl || req.path}_${ip}`;
    const now = Date.now();

    let record = rateLimitMap.get(key);
    if (!record || now > record.resetTime) {
      record = { count: 1, resetTime: now + windowMs };
      rateLimitMap.set(key, record);
      return next();
    }

    if (record.count >= maxRequests) {
      res.setHeader('Retry-After', Math.ceil((record.resetTime - now) / 1000));
      return res.status(429).json({ success: false, error: message });
    }

    record.count++;
    next();
  };
}

// Specialized Rate Limiters
const authRateLimiter = rateLimiter(15 * 60 * 1000, 15, 'Too many authentication attempts. Please try again after 15 minutes.');
const pinRateLimiter = rateLimiter(15 * 60 * 1000, 10, 'Too many PIN verification attempts. Please wait 15 minutes.');
const aiRateLimiter = rateLimiter(60 * 1000, 12, 'AI generation limit reached for this minute. Please wait a moment.');
const contactRateLimiter = rateLimiter(10 * 60 * 1000, 5, 'Message limit reached. Please wait before submitting another inquiry.');
const ordersRateLimiter = rateLimiter(60 * 1000, 25, 'Too many checkout requests. Please wait.');

/**
 * Timing-safe string comparison to mitigate timing attacks on secrets/hashes
 */
function timingSafeStringEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Strips script tags, onerror, and HTML injection
 */
function sanitizeString(val) {
  if (typeof val !== 'string') return val;
  return val
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/javascript:/gi, '');
}

function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }
  const clean = {};
  for (const key of Object.keys(obj)) {
    clean[key] = typeof obj[key] === 'string' ? sanitizeString(obj[key]) : sanitizeObject(obj[key]);
  }
  return clean;
}

function sanitizeBody(req, res, next) {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }
  next();
}

/**
 * Production Security Headers: HSTS, CSP, MIME-sniffing, Framing
 */
function securityHeaders(req, res, next) {
  // Core security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', "geolocation=(), microphone=(), camera=(), payment=()");

  // HSTS when behind HTTPS or in production
  if (process.env.NODE_ENV === 'production' || req.secure || req.headers['x-forwarded-proto'] === 'https') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  // Dynamic CSP based on environment
  const googleAuthDomains = process.env.NODE_ENV === 'production' 
    ? 'https://accounts.google.com' 
    : 'https://accounts.google.com';

  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://accounts.google.com/gsi/client https://fonts.googleapis.com https://checkout.razorpay.com https://*.razorpay.com https://cdn.razorpay.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://ajax.googleapis.com; " +
    "style-src 'self' 'unsafe-inline' https://accounts.google.com/gsi/style https://fonts.googleapis.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net; " +
    "font-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com https://cdnjs.cloudflare.com data:; " +
    "img-src 'self' data: blob: https: res.cloudinary.com https://lh3.googleusercontent.com https://images.unsplash.com https://m.media-amazon.com; " +
    "media-src 'self' data: blob: https:; " +
    `connect-src 'self' ${googleAuthDomains} https://oauth2.googleapis.com https://api.razorpay.com https://*.razorpay.com https://sandbox.cashfree.com https://api.cashfree.com; ` +
    "frame-src 'self' https://accounts.google.com/gsi/ https://api.razorpay.com https://*.razorpay.com; " +
    "base-uri 'self';"
  );

  next();
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Access denied. Administrator privileges required.'
    });
  }
  next();
}

function enforceHttps(req, res, next) {
  if (process.env.NODE_ENV === 'production') {
    const isHttps = req.secure || req.headers['x-forwarded-proto'] === 'https';
    if (!isHttps && req.headers.host && !req.headers.host.includes('localhost') && !req.headers.host.includes('127.0.0.1')) {
      return res.redirect(301, `https://${req.headers.host}${req.originalUrl}`);
    }
  }
  next();
}

module.exports = {
  rateLimiter,
  authRateLimiter,
  pinRateLimiter,
  aiRateLimiter,
  contactRateLimiter,
  ordersRateLimiter,
  timingSafeStringEqual,
  sanitizeBody,
  securityHeaders,
  enforceHttps,
  requireAdmin
};
