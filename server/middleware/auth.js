/**
 * VANVI MOMENTS — AUTHENTICATION & SECURITY UTILITIES
 * Real native crypto password hashing (scrypt) & secure HMAC-SHA256 session tokens.
 */

const crypto = require('crypto');
const { Users } = require('../db/database');

const isProduction = process.env.NODE_ENV === 'production';
const configuredJwtSecret = process.env.VANVI_JWT_SECRET || process.env.JWT_SECRET || '';
const isPlaceholderSecret = value => /replace_with|change_in_prod|development_only|placeholder|your[_-]?secret/i.test(value);
if (isProduction && (
  configuredJwtSecret.length < 32 ||
  isPlaceholderSecret(configuredJwtSecret)
)) {
  throw new Error('Configure a non-placeholder JWT_SECRET or VANVI_JWT_SECRET of at least 32 characters in production.');
}
const JWT_SECRET = configuredJwtSecret || (isProduction ? '' : 'vanvi_dev_secret_change_before_deploy');
const configuredAdminKey = process.env.ADMIN_SECRET_KEY || '';
if (isProduction && (configuredAdminKey.length < 32 || isPlaceholderSecret(configuredAdminKey))) {
  throw new Error('Configure a non-placeholder ADMIN_SECRET_KEY of at least 32 characters in production.');
}
const TOKEN_EXPIRY_MS = 30 * 24 * 60 * 60 * 1000; // 30 Days

/**
 * Hash a password using scrypt with a unique salt
 */
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { salt, hash };
}

/**
 * Verify a plain password against stored salt and hash
 */
function safeTimingEqual(a, b) {
  if (!a || !b) return false;
  const bufferA = Buffer.isBuffer(a) ? a : Buffer.from(a);
  const bufferB = Buffer.isBuffer(b) ? b : Buffer.from(b);
  if (bufferA.length !== bufferB.length) return false;
  try {
    return crypto.timingSafeEqual(bufferA, bufferB);
  } catch (err) {
    return false;
  }
}

function verifyPassword(password, salt, hash) {
  if (!password || !salt || !hash) return false;
  const testHash = crypto.scryptSync(password, salt, 64).toString('hex');
  return safeTimingEqual(Buffer.from(testHash, 'hex'), Buffer.from(hash, 'hex'));
}

/**
 * Hash a 4-digit PIN for moments (secure storage, no plaintext)
 */
function hashPin(pin) {
  if (!pin) return null;
  return crypto.createHmac('sha256', JWT_SECRET).update(String(pin).trim()).digest('hex');
}

/**
 * Verify a 4-digit PIN
 */
function verifyPin(pin, hashedPin) {
  if (!pin || !hashedPin) return false;
  const testHash = crypto.createHmac('sha256', JWT_SECRET).update(String(pin).trim()).digest('hex');
  return safeTimingEqual(Buffer.from(testHash), Buffer.from(hashedPin));
}

/**
 * Generate a signed session token
 */
function createToken(user) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    uid: user.id,
    email: user.email,
    name: user.name,
    tier: user.tier,
    exp: Date.now() + TOKEN_EXPIRY_MS
  })).toString('base64url');

  const signature = crypto.createHmac('sha256', JWT_SECRET)
    .update(`${header}.${payload}`)
    .digest('base64url');

  return `${header}.${payload}.${signature}`;
}

/**
 * Verify a session token
 */
function verifyToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [header, payload, signature] = parts;
  const expectedSig = crypto.createHmac('sha256', JWT_SECRET)
    .update(`${header}.${payload}`)
    .digest('base64url');

  if (signature !== expectedSig) return null;

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (Date.now() > data.exp) return null; // Expired
    return data;
  } catch (err) {
    return null;
  }
}

/**
 * Express Middleware: Requires Valid Authentication
 */
async function requireAuth(req, res, next) {
  // Support master admin API key for backend integrations, control center tests, and CLI tasks
  const adminKey = req.headers['x-admin-key'];
  const providedAdminKey = typeof adminKey === 'string' ? Buffer.from(adminKey, 'utf8') : null;
  const expectedAdminKey = Buffer.from(configuredAdminKey, 'utf8');
  if (
    providedAdminKey &&
    configuredAdminKey.length >= 32 &&
    !isPlaceholderSecret(configuredAdminKey) &&
    providedAdminKey.length === expectedAdminKey.length &&
    crypto.timingSafeEqual(providedAdminKey, expectedAdminKey)
  ) {
    req.user = {
      id: 'admin_master',
      name: 'System Administrator',
      email: 'admin@vanvimoments.com',
      role: 'admin',
      tier: 'VIP'
    };
    return next();
  }

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.slice(7).trim()
    : (req.cookies && req.cookies.vanvi_token);

  if (!token) {
    return res.status(401).json({ success: false, error: 'Authentication required. Please login.' });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ success: false, error: 'Session expired or invalid. Please login again.' });
  }

  const user = await Users.findById(payload.uid);
  if (!user) {
    return res.status(401).json({ success: false, error: 'User account not found.' });
  }

  req.user = user;
  next();
}

/**
 * Express Middleware: Optional Authentication (guest allowed)
 */
async function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.slice(7).trim()
    : (req.cookies && req.cookies.vanvi_token);

  if (token) {
    const payload = verifyToken(token);
    if (payload) {
      req.user = await Users.findById(payload.uid);
    }
  }
  next();
}

module.exports = {
  hashPassword,
  verifyPassword,
  hashPin,
  verifyPin,
  createToken,
  verifyToken,
  requireAuth,
  optionalAuth
};
