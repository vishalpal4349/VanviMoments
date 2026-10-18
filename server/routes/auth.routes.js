const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const https = require('https');
const { Users, CoinLedger, AuditLogs } = require('../db/database');
const { hashPassword, verifyPassword, createToken, requireAuth } = require('../middleware/auth');
const { authRateLimiter } = require('../middleware/security');
const {
  sendWelcomeEmail,
  sendPasswordResetOtp,
  isEmailConfigured
} = require('../services/email.service');

// DEBUG flag (include stack traces in responses when not in production)
const DEBUG = process.env.NODE_ENV !== 'production';

// In-Memory Password Reset OTP Vault (15-min TTL)
const resetOtpVault = new Map();

/**
 * Cryptographic Google Identity Services ID Token Verification
 * Checks claims (issuer, audience, expiry) and validates with Google tokeninfo
 */
function verifyGoogleIdToken(token) {
  return new Promise((resolve) => {
    if (!token || typeof token !== 'string') return resolve(null);

    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    if (!googleClientId) {
      console.warn('[Google Auth] GOOGLE_CLIENT_ID missing from env');
      return resolve(null);
    }

    // Verify token with Google public tokeninfo endpoint
    const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(token)}`;
    const req = https.get(url, { timeout: 3500 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          if (res.statusCode === 200) {
            const verified = JSON.parse(data);
            if (
              verified &&
              verified.aud === googleClientId &&
              (verified.email_verified === true || verified.email_verified === 'true') &&
              verified.email &&
              verified.sub
            ) {
              return resolve({
                email: verified.email.toLowerCase(),
                name: verified.name || verified.email.split('@')[0],
                picture: verified.picture || null,
                googleId: verified.sub,
                verifiedByGoogle: true
              });
            }
          }
        } catch (e) {
          console.warn('[Google Auth] Google token verification response was invalid.');
        }
        resolve(null);
      });
    });

    req.on('error', () => resolve(null));

    req.on('timeout', () => {
      req.destroy();
      resolve(null);
    });
  });
}

// Helper to reliably extract client IP and User Agent
function getClientMeta(req) {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = (forwarded ? String(forwarded).split(',')[0].trim() : (req.socket?.remoteAddress || req.ip || '127.0.0.1')).replace(/^::ffff:/, '');
  const ua = req.headers['user-agent'] || 'Browser Client';
  return { ip, ua };
}

// Input validation helpers
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}

function isValidPhone(phone) {
  const digits = String(phone).replace(/[^0-9]/g, '');
  return digits.length >= 10 && digits.length <= 15;
}

/**
 * POST /api/auth/signup
 */
router.post('/signup', authRateLimiter, async (req, res) => {
  try {
    const { name, password } = req.body;
    const rawId = (req.body.identifier || req.body.email || req.body.phone || '').trim();
    const { ip, ua } = getClientMeta(req);

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ success: false, error: 'Name must be at least 2 characters.' });
    }
    const isEmail = isValidEmail(rawId);
    const isPhone = isValidPhone(rawId);

    if (!isEmail && !isPhone) {
      return res.status(400).json({ success: false, error: 'Please provide a valid email or 10-digit mobile number.' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters.' });
    }

    const existing = await Users.findByIdentifier(rawId);
    if (existing) {
      return res.status(409).json({ success: false, error: 'An account with this email or mobile number already exists. Please login.' });
    }

    const digits = rawId.replace(/[^0-9]/g, '');
    const userEmail = isEmail ? rawId.toLowerCase() : (req.body.email ? req.body.email.toLowerCase() : `${digits.slice(-10)}@mobile.vanvimoments.shop`);
    const userPhone = isPhone ? digits.slice(-10) : (req.body.phone ? String(req.body.phone).trim() : null);

    const { salt, hash } = hashPassword(password);
    const user = await Users.create({
      name: name.trim(),
      email: userEmail,
      phone: userPhone,
      passwordHash: hash,
      salt: salt,
      provider: 'local',
      status: 'active',
      signupIp: ip,
      signupUa: ua,
      lastLoginIp: ip,
      lastLoginUa: ua,
      loginCount: 1,
      loginHistory: [{ timestamp: Date.now(), ip, ua, provider: 'local', status: 'success' }]
    });

    // Record signup in Audit Logs
    await AuditLogs.create({
      actorUserId: user.id,
      action: 'user.signup',
      targetEntity: 'user',
      targetId: user.id,
      metadata: { name: user.name, email: user.email, phone: user.phone, provider: 'local', ip, ua }
    }).catch(err => console.warn('[Audit Log Error]', err.message));

    const token = createToken(user);

    // Send a welcome email without implying an uncredited coin bonus.
    if (user.email && user.email.includes('@') && !user.email.includes('@mobile.')) {
      sendWelcomeEmail({
        toEmail: user.email,
        customerName: user.name
      }).catch(err => console.warn('[Welcome Email Notice]', err.message));
    }

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        tier: user.tier,
        coins: user.coins,
        templateCredits: user.templateCredits || 0,
        activePass: user.activePass || null,
        passExpiry: user.passExpiry || null,
        status: user.status || 'active',
        provider: user.provider || 'local'
      }
    });
  } catch (err) {
    console.error('[AUTH ERROR]', err && err.stack ? err.stack : err);
    if (DEBUG) {
      return res.status(500).json({ success: false, error: err.message || 'Internal server error during registration.', stack: err.stack || null });
    }
    return res.status(500).json({ success: false, error: 'Internal server error during registration.' });
  }
});

/**
 * POST /api/auth/login
 */
router.post('/login', authRateLimiter, async (req, res) => {
  try {
    const { password } = req.body;
    const rawId = (req.body.identifier || req.body.email || req.body.phone || '').trim();
    const { ip, ua } = getClientMeta(req);

    if (!rawId || !password) {
      return res.status(400).json({ success: false, error: 'Email or mobile number and password are required.' });
    }

    const user = await Users.findByIdentifier(rawId);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email/phone or password.' });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ success: false, error: 'Your account has been suspended by administration. Please contact support.' });
    }

    const valid = verifyPassword(password, user.salt, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ success: false, error: 'Invalid email/phone or password.' });
    }

    // Update login analytics & history
    const history = Array.isArray(user.loginHistory) ? user.loginHistory.slice(0, 19) : [];
    history.unshift({ timestamp: Date.now(), ip, ua, provider: user.provider || 'local', status: 'success' });

    const updatedUser = await Users.update(user.id, {
      lastLogin: Date.now(),
      lastLoginIp: ip,
      lastLoginUa: ua,
      loginCount: (user.loginCount || 0) + 1,
      loginHistory: history
    });

    // Audit log login
    await AuditLogs.create({
      actorUserId: user.id,
      action: 'user.login',
      targetEntity: 'user',
      targetId: user.id,
      metadata: { ip, ua, provider: user.provider || 'local' }
    }).catch(err => console.warn('[Audit Log Error]', err.message));

    const token = createToken(updatedUser || user);

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        tier: user.tier,
        coins: user.coins,
        templateCredits: user.templateCredits || 0,
        activePass: user.activePass || null,
        passExpiry: user.passExpiry || null,
        status: user.status || 'active',
        provider: user.provider || 'local',
        lastLogin: Date.now()
      }
    });
  } catch (err) {
    console.error('[AUTH ERROR]', err && err.stack ? err.stack : err);
    if (DEBUG) {
      return res.status(500).json({ success: false, error: err.message || 'Internal server error during login.', stack: err.stack || null });
    }
    return res.status(500).json({ success: false, error: 'Internal server error during login.' });
  }
});

/**
 * GET /api/auth/me
 */
router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = req.user;
    return res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        tier: user.tier,
        coins: user.coins,
        templateCredits: user.templateCredits || 0,
        activePass: user.activePass || null,
        passExpiry: user.passExpiry || null,
        status: user.status || 'active',
        provider: user.provider || 'local',
        lastLogin: user.lastLogin
      }
    });
  } catch (err) {
    console.error('[AUTH ERROR]', err && err.stack ? err.stack : err);
    if (DEBUG) {
      return res.status(500).json({ success: false, error: err.message || 'Failed to retrieve profile.', stack: err.stack || null });
    }
    return res.status(500).json({ success: false, error: 'Failed to retrieve profile.' });
  }
});

/**
 * POST /api/auth/google
 * Google Sign-In & Sign-Up endpoint
 */
router.post('/google', authRateLimiter, async (req, res) => {
  try {
    // Defensive env check
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      console.error('[AUTH ERROR] Missing Google OAuth config: GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET');
      return res.status(500).json({ success: false, error: 'Server misconfiguration: Google OAuth is not configured.' });
    }

    let { email, name, googleId, picture, credential, id_token } = req.body;
    const { ip, ua } = getClientMeta(req);

    // Google sign-in is accepted only after server-side token verification.
    const googleToken = credential || id_token;
    const verified = await verifyGoogleIdToken(googleToken);
    if (verified && verified.email) {
      email = verified.email;
      name = verified.name;
      googleId = verified.googleId;
      picture = verified.picture;
    } else {
      return res.status(401).json({
        success: false,
        error: 'Google authentication credential is invalid or has expired. Please select your Google account again.'
      });
    }

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ success: false, error: 'Valid Google email credential is required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    let user = await Users.findByEmail(cleanEmail);
    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      const userName = name && name.trim() ? name.trim() : cleanEmail.split('@')[0];
      const dummyPassword = crypto.randomBytes(32).toString('hex');
      const { salt, hash } = hashPassword(dummyPassword);

      user = await Users.create({
        name: userName,
        email: cleanEmail,
        googleId: googleId || null,
        picture: picture || null,
        provider: 'google',
        passwordHash: hash,
        salt: salt,
        role: 'user',
        tier: 'free',
        coins: 0,
        status: 'active',
        signupIp: ip,
        signupUa: ua,
        lastLoginIp: ip,
        lastLoginUa: ua,
        loginCount: 1,
        loginHistory: [{ timestamp: Date.now(), ip, ua, provider: 'google', status: 'success' }]
      });

      await AuditLogs.create({
        actorUserId: user.id,
        action: 'user.signup',
        targetEntity: 'user',
        targetId: user.id,
        metadata: { email: cleanEmail, name: userName, provider: 'google', ip, ua }
      }).catch(err => console.warn('[Audit Log Error]', err.message));
    } else {
      if (user.status === 'suspended') {
        return res.status(403).json({ success: false, error: 'Your account has been suspended by administration. Please contact support.' });
      }

      const history = Array.isArray(user.loginHistory) ? user.loginHistory.slice(0, 19) : [];
      history.unshift({ timestamp: Date.now(), ip, ua, provider: 'google', status: 'success' });

      // User exists: link googleId, update avatar, update lastLogin & count
      const updates = { 
        lastLogin: Date.now(),
        lastLoginIp: ip,
        lastLoginUa: ua,
        loginCount: (user.loginCount || 0) + 1,
        loginHistory: history
      };
      if (googleId && !user.googleId) updates.googleId = googleId;
      if (picture) updates.picture = picture;
      if (!user.provider) updates.provider = 'google';
      user = await Users.update(user.id, updates);

      await AuditLogs.create({
        actorUserId: user.id,
        action: 'user.login',
        targetEntity: 'user',
        targetId: user.id,
        metadata: { ip, ua, provider: 'google' }
      }).catch(err => console.warn('[Audit Log Error]', err.message));
    }

    const token = createToken(user);

    // Send automated welcome email for new Google signups
    if (isNewUser && user.email && user.email.includes('@')) {
      sendWelcomeEmail({
        toEmail: user.email,
        customerName: user.name
      }).catch(err => console.warn('[Google Welcome Email Notice]', err.message));
    }

    return res.json({
      success: true,
      token,
      isNewUser,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || null,
        picture: user.picture || null,
        googleId: user.googleId || null,
        provider: user.provider || 'google',
        role: user.role,
        tier: user.tier,
        coins: user.coins,
        templateCredits: user.templateCredits || 0,
        activePass: user.activePass || null,
        passExpiry: user.passExpiry || null,
        status: user.status || 'active',
        lastLogin: Date.now()
      }
    });
  } catch (err) {
    console.error('[AUTH ERROR]', err && err.stack ? err.stack : err);
    if (DEBUG) {
      return res.status(500).json({ success: false, error: err.message || 'Failed to process Google sign-in.', stack: err.stack || null });
    }
    return res.status(500).json({ success: false, error: 'Failed to process Google sign-in.' });
  }
});

/**
 * POST /api/auth/whatsapp
 * WhatsApp 1-Tap & Verified Sign-In/Sign-Up endpoint
 */
router.post('/whatsapp', authRateLimiter, async (req, res) => {
  try {
    const rawPhone = (req.body.phone || req.body.identifier || '').trim();
    const cleanDigits = rawPhone.replace(/[^0-9]/g, '');

    if (cleanDigits.length < 10) {
      return res.status(400).json({ success: false, error: 'Please provide a valid 10-digit WhatsApp number.' });
    }

    const phone10 = cleanDigits.slice(-10);
    let user = await Users.findByPhone(phone10);
    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      const userName = req.body.name && req.body.name.trim() ? req.body.name.trim() : `WhatsApp User (+91 ${phone10})`;
      const dummyPassword = crypto.randomBytes(32).toString('hex');
      const { salt, hash } = hashPassword(dummyPassword);

      user = await Users.create({
        name: userName,
        email: `${phone10}@whatsapp.vanvimoments.shop`,
        phone: phone10,
        passwordHash: hash,
        salt: salt,
        role: 'user',
        tier: 'free',
        coins: 0
      });
    }

    const token = createToken(user);

    return res.json({
      success: true,
      token,
      isNewUser,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        tier: user.tier,
        coins: user.coins,
        templateCredits: user.templateCredits || 0,
        activePass: user.activePass || null,
        passExpiry: user.passExpiry || null
      }
    });
  } catch (err) {
    console.error('[AUTH ERROR]', err && err.stack ? err.stack : err);
    if (DEBUG) {
      return res.status(500).json({ success: false, error: err.message || 'Failed to process WhatsApp sign-in.', stack: err.stack || null });
    }
    return res.status(500).json({ success: false, error: 'Failed to process WhatsApp sign-in.' });
  }
});

/**
 * POST /api/auth/forgot-password
 * Generates 6-digit OTP and dispatches real-time email notification
 */
router.post('/forgot-password', authRateLimiter, async (req, res) => {
  try {
    const rawId = (req.body.identifier || req.body.email || req.body.phone || '').trim();
    if (!rawId) {
      return res.status(400).json({ success: false, error: 'Please enter your registered email or phone number.' });
    }

    const emailReady = isEmailConfigured();
    if (!emailReady && process.env.NODE_ENV === 'production') {
      return res.status(503).json({
        success: false,
        error: 'Email recovery is temporarily offline. Please login with Google or message our WhatsApp Concierge (+91 76314 42934).'
      });
    }

    const user = await Users.findByIdentifier(rawId);
    if (!user) {
      return res.json({
        success: true,
        message: 'If an account matches this identifier, a verification code will be sent to its registered email.'
      });
    }

    if (!user.email || /@(mobile|whatsapp)\.vanvimoments\.(shop|com)$/i.test(user.email)) {
      return res.status(400).json({
        success: false,
        error: 'This account has no recovery email. Please contact support to reset its password.'
      });
    }

    const emailKey = user.email.toLowerCase();
    const existingEntry = resetOtpVault.get(emailKey);
    const now = Date.now();

    // 1. Anti-spam: 60-second cooldown between requests
    if (existingEntry && existingEntry.lastRequestedAt && (now - existingEntry.lastRequestedAt < 60000)) {
      const remainingSecs = Math.ceil((60000 - (now - existingEntry.lastRequestedAt)) / 1000);
      return res.status(429).json({
        success: false,
        error: `Please wait ${remainingSecs}s before requesting another verification code.`,
        cooldownRemaining: remainingSecs
      });
    }

    // 2. Anti-spam: Max 3 OTP requests per 15-minute window
    if (existingEntry && existingEntry.requestCount >= 3 && now < existingEntry.expiresAt) {
      const waitMinutes = Math.ceil((existingEntry.expiresAt - now) / 60000);
      return res.status(429).json({
        success: false,
        error: `Security limit reached: Maximum 3 verification codes allowed per 15 minutes. Please wait ${waitMinutes}m or contact our WhatsApp Concierge for instant assistance.`,
        rateLimited: true
      });
    }

    const resetRef = 'VNV-' + crypto.randomBytes(4).toString('hex').toUpperCase();
    const otp = crypto.randomInt(100000, 1000000).toString();
    const currentRequestCount = (existingEntry && now < existingEntry.expiresAt) ? (existingEntry.requestCount || 1) + 1 : 1;

    const resetEntry = {
      otp,
      userId: user.id,
      resetRef,
      expiresAt: (existingEntry && existingEntry.expiresAt > now) ? existingEntry.expiresAt : now + 15 * 60 * 1000,
      lastRequestedAt: now,
      requestCount: currentRequestCount,
      attempts: 0
    };

    const delivery = await sendPasswordResetOtp({
      toEmail: user.email,
      customerName: user.name,
      otp,
      resetRef
    });
    if (!delivery || !delivery.success) {
      return res.status(503).json({
        success: false,
        error: 'We could not deliver the reset code. Please try again later or contact support.'
      });
    }

    resetOtpVault.set(emailKey, resetEntry);

    if (delivery.provider === 'simulation') {
      console.log(`[DEV OTP] Generated password reset code for ${user.email}: ${otp}`);
      return res.json({
        success: true,
        message: `Verification code generated! (Dev mode OTP: ${otp})`,
        devOtp: otp
      });
    }

    return res.json({
      success: true,
      message: 'If an account matches this identifier, a verification code will be sent to its registered email.'
    });
  } catch (err) {
    console.error('[AUTH ERROR]', err && err.stack ? err.stack : err);
    if (DEBUG) {
      return res.status(500).json({ success: false, error: err.message || 'Failed to process password recovery request.', stack: err.stack || null });
    }
    return res.status(500).json({ success: false, error: 'Failed to process password recovery request.' });
  }
});

/**
 * POST /api/auth/verify-reset-otp
 * Verifies entered 6-digit OTP before allowing password change
 */
router.post('/verify-reset-otp', authRateLimiter, async (req, res) => {
  try {
    const identifier = (req.body.email || req.body.identifier || '').trim();
    const otp = (req.body.otp || '').trim();

    if (!identifier || !otp) {
      return res.status(400).json({ success: false, error: 'Email or mobile number and 6-digit OTP code are required.' });
    }

    const user = await Users.findByIdentifier(identifier);
    const emailKey = user && user.email ? user.email.toLowerCase() : identifier.toLowerCase();
    const entry = resetOtpVault.get(emailKey);
    if (!entry) {
      return res.status(400).json({ success: false, error: 'No active OTP found. Please request a new code.' });
    }

    if (Date.now() > entry.expiresAt) {
      resetOtpVault.delete(emailKey);
      return res.status(400).json({ success: false, error: 'OTP has expired. Please request a new code.' });
    }

    if (entry.otp !== otp) {
      entry.attempts = (entry.attempts || 0) + 1;
      if (entry.attempts >= 5) {
        resetOtpVault.delete(emailKey);
        return res.status(429).json({ success: false, error: 'Too many incorrect attempts. Please request a new code.' });
      }
      return res.status(400).json({ success: false, error: 'Incorrect 6-digit code. Please check your inbox.' });
    }

    entry.verified = true;
    return res.json({ success: true, message: 'OTP verified successfully! You may now set a new password.' });
  } catch (err) {
    console.error('[AUTH ERROR]', err && err.stack ? err.stack : err);
    if (DEBUG) {
      return res.status(500).json({ success: false, error: err.message || 'OTP verification failed.', stack: err.stack || null });
    }
    return res.status(500).json({ success: false, error: 'OTP verification failed.' });
  }
});

/**
 * POST /api/auth/reset-password
 * Applies new password after OTP verification
 */
router.post('/reset-password', authRateLimiter, async (req, res) => {
  try {
    const identifier = (req.body.email || req.body.identifier || '').trim();
    const otp = (req.body.otp || '').trim();
    const newPassword = (req.body.newPassword || req.body.password || '').trim();

    if (!identifier || !otp || !newPassword) {
      return res.status(400).json({ success: false, error: 'Email or mobile number, OTP, and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, error: 'New password must be at least 6 characters long.' });
    }

    const user = await Users.findByIdentifier(identifier);
    const emailKey = user && user.email ? user.email.toLowerCase() : identifier.toLowerCase();
    const entry = resetOtpVault.get(emailKey);
    if (!entry || !entry.verified || entry.otp !== otp || Date.now() > entry.expiresAt) {
      return res.status(400).json({ success: false, error: 'Invalid or expired OTP code. Please request a new code.' });
    }

    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid or expired OTP code. Please request a new code.' });
    }

    const { salt, hash } = hashPassword(newPassword);
    await Users.update(user.id, { passwordHash: hash, salt });

    // Invalidate used OTP
    resetOtpVault.delete(emailKey);

    return res.json({
      success: true,
      message: 'Password successfully updated! You can now sign in with your new password.'
    });
  } catch (err) {
    console.error('[AUTH ERROR]', err && err.stack ? err.stack : err);
    if (DEBUG) {
      return res.status(500).json({ success: false, error: err.message || 'Failed to update password.', stack: err.stack || null });
    }
    return res.status(500).json({ success: false, error: 'Failed to update password.' });
  }
});

/**
 * POST /api/auth/logout
 */
router.post('/logout', (req, res) => {
  return res.json({ success: true, message: 'Logged out successfully.' });
});

module.exports = router;
module.exports.verifyGoogleIdToken = verifyGoogleIdToken;
