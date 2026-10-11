const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { Users, CoinLedger } = require('../db/database');
const { hashPassword, verifyPassword, createToken, requireAuth } = require('../middleware/auth');
const { authRateLimiter } = require('../middleware/security');
const { sendWelcomeEmail, sendPasswordResetOtp } = require('../services/email.service');

// In-Memory Password Reset OTP Vault (15-min TTL)
const resetOtpVault = new Map();

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
      salt: salt
    });

    const token = createToken(user);

    // Send automated welcome email with +100 bonus coins
    if (user.email && user.email.includes('@') && !user.email.includes('@mobile.')) {
      sendWelcomeEmail({
        toEmail: user.email,
        customerName: user.name,
        coins: user.coins || 100
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
        coins: user.coins
      }
    });
  } catch (err) {
    console.error('Signup error:', err);
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

    if (!rawId || !password) {
      return res.status(400).json({ success: false, error: 'Email or mobile number and password are required.' });
    }

    const user = await Users.findByIdentifier(rawId);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email/phone or password.' });
    }

    const valid = verifyPassword(password, user.salt, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ success: false, error: 'Invalid email/phone or password.' });
    }

    const token = createToken(user);

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
        coins: user.coins
      }
    });
  } catch (err) {
    console.error('Login error:', err);
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
        role: user.role,
        tier: user.tier,
        coins: user.coins
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to retrieve profile.' });
  }
});

/**
 * POST /api/auth/google
 * Google Sign-In & Sign-Up endpoint
 */
router.post('/google', authRateLimiter, async (req, res) => {
  try {
    const { email, name, googleId, picture } = req.body;

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ success: false, error: 'Valid Google email is required.' });
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
        coins: 100
      });
    } else {
      // User exists: link googleId, update avatar if provided, update lastLogin
      const updates = { lastLogin: Date.now() };
      if (googleId && !user.googleId) updates.googleId = googleId;
      if (picture) updates.picture = picture;
      if (!user.provider) updates.provider = 'google';
      user = await Users.update(user.id, updates);
    }

    const token = createToken(user);

    // Send automated welcome email for new Google signups
    if (isNewUser && user.email && user.email.includes('@')) {
      sendWelcomeEmail({
        toEmail: user.email,
        customerName: user.name,
        coins: user.coins || 100
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
        coins: user.coins
      }
    });
  } catch (err) {
    console.error('Google auth error:', err);
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
        coins: 100
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
        coins: user.coins
      }
    });
  } catch (err) {
    console.error('WhatsApp auth error:', err);
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

    const user = await Users.findByIdentifier(rawId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'No account found matching this identifier. Please verify or create an account.' });
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
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const currentRequestCount = (existingEntry && now < existingEntry.expiresAt) ? (existingEntry.requestCount || 1) + 1 : 1;

    // Store in vault (15-min TTL)
    resetOtpVault.set(emailKey, {
      otp,
      userId: user.id,
      resetRef,
      expiresAt: (existingEntry && existingEntry.expiresAt > now) ? existingEntry.expiresAt : now + 15 * 60 * 1000,
      lastRequestedAt: now,
      requestCount: currentRequestCount,
      attempts: 0
    });

    // Dispatch real-time OTP email
    if (user.email && user.email.includes('@') && !user.email.includes('@mobile.')) {
      sendPasswordResetOtp({
        toEmail: user.email,
        customerName: user.name,
        otp,
        resetRef
      }).catch(err => console.warn('[OTP Email Notice]', err.message));
    }

    return res.json({
      success: true,
      message: `A 6-digit security code has been dispatched to ${user.email}. Reference: #${resetRef}.`,
      resetRef,
      email: user.email,
      name: user.name,
      otpSent: true
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ success: false, error: 'Failed to process password recovery request.' });
  }
});

/**
 * POST /api/auth/verify-reset-otp
 * Verifies entered 6-digit OTP before allowing password change
 */
router.post('/verify-reset-otp', authRateLimiter, async (req, res) => {
  try {
    const email = (req.body.email || req.body.identifier || '').trim().toLowerCase();
    const otp = (req.body.otp || '').trim();

    if (!email || !otp) {
      return res.status(400).json({ success: false, error: 'Email and 6-digit OTP code are required.' });
    }

    const entry = resetOtpVault.get(email);
    if (!entry) {
      return res.status(400).json({ success: false, error: 'No active OTP found. Please request a new code.' });
    }

    if (Date.now() > entry.expiresAt) {
      resetOtpVault.delete(email);
      return res.status(400).json({ success: false, error: 'OTP has expired. Please request a new code.' });
    }

    if (entry.otp !== otp) {
      entry.attempts = (entry.attempts || 0) + 1;
      if (entry.attempts >= 5) {
        resetOtpVault.delete(email);
        return res.status(429).json({ success: false, error: 'Too many incorrect attempts. Please request a new code.' });
      }
      return res.status(400).json({ success: false, error: 'Incorrect 6-digit code. Please check your inbox.' });
    }

    entry.verified = true;
    return res.json({ success: true, message: 'OTP verified successfully! You may now set a new password.' });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'OTP verification failed.' });
  }
});

/**
 * POST /api/auth/reset-password
 * Applies new password after OTP verification
 */
router.post('/reset-password', authRateLimiter, async (req, res) => {
  try {
    const email = (req.body.email || req.body.identifier || '').trim().toLowerCase();
    const otp = (req.body.otp || '').trim();
    const newPassword = (req.body.newPassword || req.body.password || '').trim();

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, error: 'Email, OTP, and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, error: 'New password must be at least 6 characters long.' });
    }

    const entry = resetOtpVault.get(email);
    if (!entry || entry.otp !== otp || Date.now() > entry.expiresAt) {
      return res.status(400).json({ success: false, error: 'Invalid or expired OTP code. Please request a new code.' });
    }

    const user = await Users.findByEmail(email);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User account not found.' });
    }

    const { salt, hash } = hashPassword(newPassword);
    await Users.update(user.id, { passwordHash: hash, salt });

    // Invalidate used OTP
    resetOtpVault.delete(email);

    return res.json({
      success: true,
      message: 'Password successfully updated! You can now sign in with your new password.'
    });
  } catch (err) {
    console.error('Password reset error:', err);
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


