const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { Users, CoinLedger } = require('../db/database');
const { hashPassword, verifyPassword, createToken, requireAuth } = require('../middleware/auth');
const { authRateLimiter } = require('../middleware/security');

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

    const resetRef = 'VNV-' + crypto.randomBytes(4).toString('hex').toUpperCase();
    return res.json({
      success: true,
      message: `Account located for ${user.name || user.email}! Password reset ticket #${resetRef} has been initiated.`,
      resetRef,
      email: user.email,
      name: user.name
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ success: false, error: 'Failed to process password recovery request.' });
  }
});

/**
 * POST /api/auth/logout
 */
router.post('/logout', (req, res) => {
  return res.json({ success: true, message: 'Logged out successfully.' });
});

module.exports = router;


