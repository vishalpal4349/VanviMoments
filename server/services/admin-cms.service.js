/**
 * VANVI MOMENTS — ADMIN CMS & CONTROL CENTER SERVICE
 * Production engine for Templates, Presets, Content, Version Control, Media & Health.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const vm = require('vm');
const { getStore, saveStore, AuditLogs } = require('../db/database');

// Helper to safely load standard template catalog from vanvi-templates-data.js
function loadSeedTemplates() {
  try {
    const VanviTemplatesData = require('../../js/vanvi-templates-data.js');
    const raw = (VanviTemplatesData && typeof VanviTemplatesData.getAll === 'function') 
      ? VanviTemplatesData.getAll() 
      : [];
    return raw.map(t => ({
        id: t.id || t.slug,
        slug: t.slug || t.id,
        sku: t.sku || (t.id ? t.id.toUpperCase() : 'VM-001'),
        name: t.name || 'Untitled Template',
        category: t.category || 'Celebration',
        categorySlug: t.categorySlug || 'celebration',
        categoryName: t.categoryName || t.category || 'Celebration',
        subcategory: t.subcategory || '',
        price: Number(t.price !== undefined ? t.price : 149),
        originalPrice: Number(t.originalPrice || 429),
        discount: t.discount || '65% OFF',
        isFree: !!(t.isFree || t.price === 0),
        tier: t.tier || (t.price === 0 ? 'Free' : 'Premium'),
        badge: t.badge || '✨ Popular',
        type: t.type || 'Interactive Microsite',
        icon: t.icon || '🎁',
        thumbnail: t.thumbnail || 'assets/favicon.svg',
        coverImage: t.coverImage || t.thumbnail || 'assets/favicon.svg',
        soundtrack: t.soundtrack || 'Celebration Melody',
        previewVideo: t.previewVideo || '',
        gallery: Array.isArray(t.gallery) ? t.gallery : [],
        description: t.description || '',
        shortDescription: t.shortDescription || (t.description ? t.description.slice(0, 120) + '...' : ''),
        tags: Array.isArray(t.tags) ? t.tags : ['bestseller', 'celebration'],
        featured: !!(t.featured || (t.badge && t.badge.includes('Bestseller'))),
        trending: !!(t.trending || (t.badge && t.badge.includes('Trending'))),
        popular: !!(t.popular || (t.badge && t.badge.includes('Popular'))),
        isNew: !!t.isNew,
        visibility: t.visibility || 'public',
        sortOrder: Number(t.sortOrder || 10),
        accentColor: t.accentColor || '#ff2a7a',
        templatePath: t.templatePath || `templates/${t.id}/index.html`,
        builderFields: Array.isArray(t.customizableFields) ? t.customizableFields.map(f => ({
          name: f,
          key: f.toLowerCase().replace(/[^a-z0-9]/g, '_'),
          type: f.toLowerCase().includes('photo') ? 'media' : (f.toLowerCase().includes('letter') ? 'textarea' : 'text'),
          required: true,
          defaultValue: ''
        })) : [
          { name: 'Recipient Name', key: 'recipient_name', type: 'text', required: true, defaultValue: 'Aarav' },
          { name: 'Sender Name', key: 'sender_name', type: 'text', required: true, defaultValue: 'Sneha' },
          { name: 'Personal Letter', key: 'personal_letter', type: 'textarea', required: false, defaultValue: '' }
        ],
        sections: [
          { id: 'sec_intro', title: 'Intro & Welcome Scene', subtitle: 'Warm Opening', text: 'Touch to unlock your special surprise', visible: true, order: 1 },
          { id: 'sec_memories', title: 'Polaroid Memory Gallery', subtitle: 'Unforgettable Moments', text: 'Swipeable cards with our favorite captures', visible: true, order: 2 },
          { id: 'sec_letter', title: 'Handwritten Letter', subtitle: 'Words from the Heart', text: 'Personal keepsake letter sealed with love', visible: true, order: 3 },
          { id: 'sec_music', title: 'Music Dedication', subtitle: 'Soundtrack of Our Story', text: 'Ambient melody curated for this moment', visible: true, order: 4 }
        ],
        buttons: [
          { id: 'btn_open', text: 'Open Celebration', destination: '#memories', variant: 'primary', visible: true },
          { id: 'btn_share', text: 'Share with Loved Ones', destination: '#share', variant: 'secondary', visible: true }
        ],
        colors: {
          primary: t.accentColor || '#ff2a7a',
          secondary: '#ffd166',
          background: '#fff7fa',
          card: '#ffffff',
          text: '#1e0d19'
        },
        fonts: {
          heading: 'Outfit',
          body: 'Plus Jakarta Sans',
          serif: 'Cormorant Garamond'
        },
        seo: {
          title: `${t.name} — Interactive Celebration Experience | Vanvi Moments`,
          description: t.shortDescription || t.description || 'Personalized interactive celebratory microsite.',
          socialImage: t.thumbnail || 'assets/favicon.svg'
        },
        status: 'published',
        version: '1.0.0',
        versionHistory: [
          {
            version: '1.0.0',
            date: new Date().toISOString(),
            author: 'Master Catalog Seed',
            changes: 'Initial production template registration'
          }
        ],
        createdAt: Date.now(),
        updatedAt: Date.now()
      }));
  } catch (err) {
    console.error('Error loading seed templates:', err);
  }
  return [];
}

// Helper to seed starter presets
function loadSeedPresets() {
  return [
    {
      id: 'preset_royal_velvet_bday',
      name: 'Royal Velvet Birthday Suite',
      category: 'Birthday',
      price: 199,
      colors: { primary: '#9e1a38', secondary: '#f59e0b', background: '#fff0f5' },
      sections: [
        { id: 's1', title: 'Golden Envelope Scene', visible: true, order: 1 },
        { id: 's2', title: 'Wax Seal Flip', visible: true, order: 2 },
        { id: 's3', title: 'Polaroid Stack', visible: true, order: 3 },
        { id: 's4', title: 'Celebration Waltz Melody', visible: true, order: 4 }
      ],
      tags: ['luxury', 'wax seal', 'birthday'],
      status: 'published',
      updatedAt: Date.now()
    },
    {
      id: 'preset_neon_cyber_anniv',
      name: 'Neon Glow Romance',
      category: 'Love & Romance',
      price: 149,
      colors: { primary: '#ff007f', secondary: '#00f0ff', background: '#0a0512' },
      sections: [
        { id: 's1', title: 'Cyber Heart Intro', visible: true, order: 1 },
        { id: 's2', title: 'Timeline of Us', visible: true, order: 2 },
        { id: 's3', title: 'Private Starlit Letter', visible: true, order: 3 }
      ],
      tags: ['neon', 'modern', 'romance'],
      status: 'published',
      updatedAt: Date.now()
    },
    {
      id: 'preset_minimal_ivory_wedding',
      name: 'Minimal Ivory Wedding & Save-the-Date',
      category: 'Wedding',
      price: 249,
      colors: { primary: '#b45309', secondary: '#e2e8f0', background: '#fdfbf7' },
      sections: [
        { id: 's1', title: 'Formal Monogram Invitation', visible: true, order: 1 },
        { id: 's2', title: 'Wedding Timeline & Schedule', visible: true, order: 2 },
        { id: 's3', title: 'Venue Map & Live Directions', visible: true, order: 3 },
        { id: 's4', title: 'RSVP & Guestbook Wishes', visible: true, order: 4 }
      ],
      tags: ['wedding', 'luxury', 'minimalist'],
      status: 'published',
      updatedAt: Date.now()
    }
  ];
}

// Helper to seed default site content
function loadSeedSiteContent() {
  return {
    hero: {
      headline: 'Give More Than Words. Gift An Unforgettable Digital Moment.',
      subtitle: 'Personalized interactive celebration microsites crafted in seconds. Tap-to-blow candles, wax-sealed letters, swipeable polaroids, and music dedications.',
      ctaText: 'Explore Templates ✨',
      ctaSecondaryText: 'Try Vanvi AI Matcher',
      bannerBadge: '🔥 OVER 10,000+ CELEBRATIONS CRAFTED IN INDIA'
    },
    announcement: {
      enabled: true,
      text: '🎉 FESTIVE SPECIAL: Use code FESTIVE50 for Flat ₹50 OFF on all Premium Experiences!',
      link: '#templates'
    },
    offers: [
      { id: 'off_1', title: 'Buy 1 Get 1 Free', code: 'BOGO2026', discountText: '100% OFF on 2nd Template', active: true },
      { id: 'off_2', title: 'Celebration VIP Pass', code: 'VIPPASS', discountText: 'Unlimited templates for 1 Year', active: true }
    ],
    featuredTemplateIds: ['birthday-wish-1', 'birthday-wish-2', 'birthday-gf'],
    trendingTemplateIds: ['birthday-wish-2', 'birthday-wish-1'],
    faq: [
      { q: 'How does Vanvi Moments work?', a: 'Choose any aesthetic template, enter your recipient\'s name, memories, and photos, and receive an instant private interactive link and QR code to share on WhatsApp.' },
      { q: 'Can I edit the moment after sharing it?', a: 'Yes! All Vanvi Moments come with lifetime validity and unlimited real-time edits from your dashboard.' },
      { q: 'Do recipients need an app to open it?', a: 'Never. Vanvi Moments work seamlessly in any mobile browser on iOS and Android with smooth 60fps animations.' }
    ],
    contactInfo: {
      whatsappNumber: '+91 76314 42934',
      supportEmail: 'celebrate@vanvimoments.shop',
      hours: 'Mon-Sun: 9:00 AM – 10:00 PM IST',
      address: 'Vanvi Moments Creative Atelier, Bangalore, India'
    },
    footer: {
      tagline: 'Vanvi Moments — Luxury Digital Keepsakes & Celebratory Microsites.',
      copyright: '© 2026 Vanvi Moments Atelier. All rights reserved.',
      socialLinks: {
        instagram: 'https://instagram.com/vanvimoments',
        whatsapp: 'https://wa.me/917631442934',
        youtube: 'https://youtube.com/@vanvimoments'
      }
    },
    version: '1.0.0',
    updatedAt: Date.now()
  };
}

// Helper to seed default media assets
function loadSeedMedia() {
  return [
    {
      id: 'med_candle_glow',
      name: 'Birthday Candle Glow Animation',
      type: 'image',
      url: 'https://cdn.cutiepage.in/static/products/birthday-wish1.jpg',
      sizeBytes: 184500,
      format: 'jpg',
      tags: ['birthday', 'candle', 'cover'],
      uploadedAt: Date.now() - 86400000
    },
    {
      id: 'med_wax_seal',
      name: 'Wax Seal Envelope Asset',
      type: 'image',
      url: 'https://cdn.cutiepage.in/static/products/birthday-wish2.jpg',
      sizeBytes: 215000,
      format: 'jpg',
      tags: ['wax seal', 'envelope', 'luxury'],
      uploadedAt: Date.now() - 43200000
    },
    {
      id: 'med_acoustic_dedication',
      name: 'Warm Acoustic Celebration Track',
      type: 'audio',
      url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3',
      sizeBytes: 2450000,
      format: 'mp3',
      tags: ['soundtrack', 'acoustic', 'melody'],
      uploadedAt: Date.now() - 172800000
    }
  ];
}

class AdminCmsService {
  constructor() {
    this._ensureStoreCollections();
  }

  _ensureStoreCollections() {
    const store = getStore();
    if (!Array.isArray(store.templates) || store.templates.length === 0) {
      store.templates = loadSeedTemplates();
      saveStore();
    }
    if (!Array.isArray(store.presets) || store.presets.length === 0) {
      store.presets = loadSeedPresets();
      saveStore();
    }
    if (!store.siteContent) {
      store.siteContent = loadSeedSiteContent();
      saveStore();
    }
    if (!Array.isArray(store.mediaAssets) || store.mediaAssets.length === 0) {
      store.mediaAssets = loadSeedMedia();
      saveStore();
    }
    if (!store.settings) {
      store.settings = {
        siteName: 'Vanvi Moments',
        siteTagline: 'Luxury Interactive Celebration Experiences',
        currency: 'INR',
        currencySymbol: '₹',
        defaultTemplatePrice: 149,
        maintenanceMode: false,
        featureFlags: {
          enableVanviCoins: true,
          enableFortuneWheel: true,
          enableGames: true,
          enableAiMatcher: true,
          enableGuestCheckout: true
        },
        seoDefaults: {
          title: 'Vanvi Moments — Luxury Digital Celebrations & Keepsakes',
          description: 'Craft personalized celebratory microsites in 30 seconds. Tap-to-blow candles, flip cards, wax-sealed letters, and instant WhatsApp QR share.',
          keywords: 'birthday surprise website, personalized digital gifts, vanvi moments, anniversary keepsake'
        },
        updatedAt: Date.now()
      };
      saveStore();
    }
    if (!Array.isArray(store.contentVersions)) {
      store.contentVersions = [];
      saveStore();
    }
  }

  // =========================================================================
  // 1. TEMPLATES CATALOG & LIFECYCLE (CRUD, DRAFT, PUBLISH, ROLLBACK)
  // =========================================================================

  listTemplates({ search = '', category = 'all', status = 'all', limit = 100, offset = 0 } = {}) {
    this._ensureStoreCollections();
    const store = getStore();
    let list = (store.templates || []).slice();

    if (status && status !== 'all') {
      list = list.filter(t => (t.status || 'published').toLowerCase() === status.toLowerCase());
    }

    if (category && category !== 'all') {
      const catLower = category.toLowerCase();
      list = list.filter(t =>
        (t.categorySlug && t.categorySlug.toLowerCase() === catLower) ||
        (t.category && t.category.toLowerCase().includes(catLower))
      );
    }

    if (search) {
      const q = search.toLowerCase().trim();
      list = list.filter(t =>
        (t.name && t.name.toLowerCase().includes(q)) ||
        (t.id && t.id.toLowerCase().includes(q)) ||
        (t.slug && t.slug.toLowerCase().includes(q)) ||
        (t.description && t.description.toLowerCase().includes(q)) ||
        (Array.isArray(t.tags) && t.tags.some(tag => tag.toLowerCase().includes(q)))
      );
    }

    // Sort order: featured first, then sortOrder asc, then newest
    list.sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      const orderA = a.sortOrder !== undefined ? a.sortOrder : 10;
      const orderB = b.sortOrder !== undefined ? b.sortOrder : 10;
      if (orderA !== orderB) return orderA - orderB;
      return (b.updatedAt || 0) - (a.updatedAt || 0);
    });

    const total = list.length;
    const paginated = list.slice(offset, offset + limit);

    return {
      total,
      limit,
      offset,
      templates: paginated,
      counts: {
        total: (store.templates || []).length,
        published: (store.templates || []).filter(t => (t.status || 'published') === 'published').length,
        draft: (store.templates || []).filter(t => t.status === 'draft').length
      }
    };
  }

  getTemplate(idOrSlug) {
    this._ensureStoreCollections();
    const store = getStore();
    const tpl = (store.templates || []).find(t => t.id === idOrSlug || t.slug === idOrSlug);
    if (!tpl) return null;
    return JSON.parse(JSON.stringify(tpl));
  }

  async createTemplate(data, actorId = 'admin') {
    this._ensureStoreCollections();
    const store = getStore();

    const rawSlug = (data.slug || data.id || data.name || 'new-template')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const slug = rawSlug || ('tpl-' + crypto.randomBytes(3).toString('hex'));

    // Check duplicate slug
    const exists = store.templates.some(t => t.slug === slug || t.id === slug);
    if (exists) {
      throw new Error(`Template with slug or ID "${slug}" already exists.`);
    }

    const price = Number(data.price !== undefined ? data.price : 149);
    const newTemplate = {
      id: slug,
      slug,
      sku: (data.sku || slug).toUpperCase(),
      name: (data.name || 'Untitled Template').trim(),
      category: data.category || 'Birthday',
      categorySlug: (data.categorySlug || data.category || 'birthday').toLowerCase(),
      categoryName: data.categoryName || data.category || 'Birthday',
      subcategory: data.subcategory || '',
      price,
      originalPrice: Number(data.originalPrice || (price > 0 ? price * 3 : 299)),
      discount: data.discount || '65% OFF',
      isFree: price === 0,
      tier: price === 0 ? 'Free' : (data.tier || 'Premium'),
      badge: data.badge || (price === 0 ? '🆓 Free Experience' : '✨ New Atelier Launch'),
      type: data.type || 'Interactive Celebration Microsite',
      icon: data.icon || '🎂',
      thumbnail: data.thumbnail || 'assets/favicon.svg',
      coverImage: data.coverImage || data.thumbnail || 'assets/favicon.svg',
      soundtrack: data.soundtrack || 'Celebration Melody',
      previewVideo: data.previewVideo || '',
      gallery: Array.isArray(data.gallery) ? data.gallery : [],
      description: data.description || 'Personalized celebratory microsite with interactive moments.',
      shortDescription: data.shortDescription || (data.description ? data.description.slice(0, 120) : 'Personalized celebratory microsite.'),
      tags: Array.isArray(data.tags) ? data.tags : ['new', 'celebration'],
      featured: !!data.featured,
      trending: !!data.trending,
      popular: !!data.popular,
      isNew: true,
      visibility: data.visibility || 'public',
      sortOrder: Number(data.sortOrder || 10),
      accentColor: data.accentColor || '#ff2a7a',
      templatePath: data.templatePath || `templates/${slug}/index.html`,
      builderFields: Array.isArray(data.builderFields) && data.builderFields.length > 0 ? data.builderFields : [
        { name: 'Recipient Name', key: 'recipient_name', type: 'text', required: true, defaultValue: '' },
        { name: 'Sender Name', key: 'sender_name', type: 'text', required: true, defaultValue: '' },
        { name: 'Personal Letter', key: 'personal_letter', type: 'textarea', required: false, defaultValue: '' },
        { name: 'Memories Photo', key: 'memory_photo', type: 'media', required: false, defaultValue: '' }
      ],
      sections: Array.isArray(data.sections) && data.sections.length > 0 ? data.sections : [
        { id: 'sec_1', title: 'Opening Welcome Scene', subtitle: 'Tap to Begin', text: 'Touch to unlock your special surprise', visible: true, order: 1 },
        { id: 'sec_2', title: 'Interactive Moment', subtitle: 'Heartfelt Memory', text: 'Swipeable polaroids and dedicated wishes', visible: true, order: 2 },
        { id: 'sec_3', title: 'Keepsake Letter', subtitle: 'Personal Letter', text: 'A handwritten note for your special day', visible: true, order: 3 }
      ],
      buttons: Array.isArray(data.buttons) && data.buttons.length > 0 ? data.buttons : [
        { id: 'btn_1', text: 'Open Celebration', destination: '#celebrate', variant: 'primary', visible: true }
      ],
      colors: data.colors || {
        primary: '#ff2a7a',
        secondary: '#ffd166',
        background: '#fff7fa',
        card: '#ffffff',
        text: '#1e0d19'
      },
      fonts: data.fonts || {
        heading: 'Outfit',
        body: 'Plus Jakarta Sans',
        serif: 'Cormorant Garamond'
      },
      seo: data.seo || {
        title: `${data.name || 'Template'} — Vanvi Moments`,
        description: data.shortDescription || 'Celebratory interactive microsite.',
        socialImage: data.thumbnail || 'assets/favicon.svg'
      },
      status: data.status === 'published' ? 'published' : 'draft',
      version: '1.0.0',
      versionHistory: [
        {
          version: '1.0.0',
          date: new Date().toISOString(),
          author: actorId,
          changes: 'Created template via Template Creator Wizard'
        }
      ],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    store.templates.unshift(newTemplate);
    saveStore();

    await AuditLogs.create({
      actorUserId: actorId,
      action: 'template.created',
      targetEntity: 'template',
      targetId: slug,
      metadata: { name: newTemplate.name, price: newTemplate.price, status: newTemplate.status }
    });

    return newTemplate;
  }

  async updateTemplate(idOrSlug, updates, actorId = 'admin') {
    this._ensureStoreCollections();
    const store = getStore();
    const idx = store.templates.findIndex(t => t.id === idOrSlug || t.slug === idOrSlug);
    if (idx === -1) {
      throw new Error(`Template "${idOrSlug}" not found.`);
    }

    const current = store.templates[idx];

    // Build diff for version history
    const changes = [];
    if (updates.price !== undefined && Number(updates.price) !== Number(current.price)) {
      changes.push(`Price changed from ₹${current.price} to ₹${updates.price}`);
    }
    if (updates.name && updates.name !== current.name) {
      changes.push(`Name changed from "${current.name}" to "${updates.name}"`);
    }
    if (updates.category && updates.category !== current.category) {
      changes.push(`Category changed to "${updates.category}"`);
    }
    if (updates.status && updates.status !== current.status) {
      changes.push(`Status changed from ${current.status} to ${updates.status}`);
    }
    if (updates.sections) {
      changes.push(`Sections modified (${updates.sections.length} total)`);
    }
    if (updates.colors) {
      changes.push('Color palette updated');
    }

    // Bump minor version if significant changes
    let nextVersion = current.version || '1.0.0';
    if (changes.length > 0) {
      const parts = (current.version || '1.0.0').split('.').map(Number);
      parts[2] = (parts[2] || 0) + 1;
      nextVersion = parts.join('.');
    }

    const historyEntry = {
      version: nextVersion,
      date: new Date().toISOString(),
      author: actorId,
      changes: changes.length > 0 ? changes.join('; ') : 'General updates',
      snapshot: {
        price: current.price,
        name: current.name,
        sections: current.sections,
        colors: current.colors,
        status: current.status
      }
    };

    const versionHistory = Array.isArray(current.versionHistory) ? current.versionHistory.slice() : [];
    versionHistory.unshift(historyEntry);
    if (versionHistory.length > 25) versionHistory.pop();

    const merged = {
      ...current,
      ...updates,
      version: nextVersion,
      versionHistory,
      updatedAt: Date.now()
    };

    // Keep ID immutable
    merged.id = current.id;
    if (updates.price !== undefined) {
      merged.price = Number(updates.price);
      merged.isFree = merged.price === 0;
      if (merged.isFree) merged.tier = 'Free';
    }

    store.templates[idx] = merged;
    saveStore();

    await AuditLogs.create({
      actorUserId: actorId,
      action: 'template.updated',
      targetEntity: 'template',
      targetId: current.id,
      metadata: { changes }
    });

    return merged;
  }

  async saveTemplateDraft(idOrSlug, draftData, actorId = 'admin') {
    this._ensureStoreCollections();
    const store = getStore();
    const idx = store.templates.findIndex(t => t.id === idOrSlug || t.slug === idOrSlug);
    if (idx === -1) throw new Error(`Template "${idOrSlug}" not found.`);

    const current = store.templates[idx];
    current.status = 'draft';
    current.draftState = {
      ...draftData,
      savedAt: Date.now(),
      savedBy: actorId
    };
    current.updatedAt = Date.now();

    saveStore();
    return { success: true, message: 'Draft saved successfully', draftState: current.draftState, template: current };
  }

  async publishTemplate(idOrSlug, actorId = 'admin') {
    this._ensureStoreCollections();
    const store = getStore();
    const idx = store.templates.findIndex(t => t.id === idOrSlug || t.slug === idOrSlug);
    if (idx === -1) throw new Error(`Template "${idOrSlug}" not found.`);

    const current = store.templates[idx];

    // Validation checklist before publish
    const errors = [];
    if (!current.name || current.name.trim().length < 2) errors.push('Template name is required.');
    if (!current.id) errors.push('Template identifier is missing.');
    if (current.price < 0 || isNaN(current.price)) errors.push('Valid price is required.');
    if (!Array.isArray(current.sections) || current.sections.length === 0) errors.push('At least one section must be configured.');

    if (errors.length > 0) {
      return { success: false, validationErrors: errors, error: 'Cannot publish template: validation failed.' };
    }

    // Apply any pending draft state into live fields
    if (current.draftState) {
      Object.assign(current, current.draftState);
      delete current.draftState;
    }

    // Bump release version
    const parts = (current.version || '1.0.0').split('.').map(Number);
    parts[1] = (parts[1] || 0) + 1;
    parts[2] = 0;
    const publishedVersion = parts.join('.');

    current.status = 'published';
    current.version = publishedVersion;
    current.lastPublishedAt = Date.now();
    current.updatedAt = Date.now();

    const historyEntry = {
      version: publishedVersion,
      date: new Date().toISOString(),
      author: actorId,
      changes: 'Template published to live storefront catalog',
      snapshot: {
        price: current.price,
        name: current.name,
        sections: current.sections,
        colors: current.colors,
        status: current.status
      }
    };

    if (!Array.isArray(current.versionHistory)) current.versionHistory = [];
    current.versionHistory.unshift(historyEntry);

    saveStore();

    await AuditLogs.create({
      actorUserId: actorId,
      action: 'template.published',
      targetEntity: 'template',
      targetId: current.id,
      metadata: { version: publishedVersion }
    });

    return { success: true, template: current, version: publishedVersion, message: `Template "${current.name}" published successfully (v${publishedVersion}).` };
  }

  async unpublishTemplate(idOrSlug, actorId = 'admin') {
    this._ensureStoreCollections();
    const store = getStore();
    const idx = store.templates.findIndex(t => t.id === idOrSlug || t.slug === idOrSlug);
    if (idx === -1) throw new Error(`Template "${idOrSlug}" not found.`);

    store.templates[idx].status = 'draft';
    store.templates[idx].updatedAt = Date.now();
    saveStore();

    await AuditLogs.create({
      actorUserId: actorId,
      action: 'template.unpublished',
      targetEntity: 'template',
      targetId: idOrSlug,
      metadata: { status: 'draft' }
    });

    return { success: true, template: store.templates[idx], message: 'Template unpublished and moved to draft.' };
  }

  async rollbackTemplate(idOrSlug, targetVersion, actorId = 'admin') {
    this._ensureStoreCollections();
    const store = getStore();
    const idx = store.templates.findIndex(t => t.id === idOrSlug || t.slug === idOrSlug);
    if (idx === -1) throw new Error(`Template "${idOrSlug}" not found.`);

    const current = store.templates[idx];
    const history = current.versionHistory || [];
    const entry = history.find(h => h.version === targetVersion || h.versionId === targetVersion || h.id === targetVersion) || history[0];

    if (!entry) {
      throw new Error(`Version "${targetVersion}" not found.`);
    }

    if (entry.snapshot) {
      Object.assign(current, entry.snapshot);
    }

    const parts = (current.version || '1.0.0').split('.').map(Number);
    parts[2] = (parts[2] || 0) + 1;
    const newVersion = parts.join('.');

    current.version = newVersion;
    current.updatedAt = Date.now();
    current.versionHistory.unshift({
      version: newVersion,
      date: new Date().toISOString(),
      author: actorId,
      changes: `Restored from version ${targetVersion}`
    });

    saveStore();

    await AuditLogs.create({
      actorUserId: actorId,
      action: 'template.rollback',
      targetEntity: 'template',
      targetId: current.id,
      metadata: { restoredFrom: targetVersion, newVersion }
    });

    return { success: true, template: current, message: `Successfully rolled back to version ${targetVersion} (now v${newVersion}).` };
  }

  async deleteTemplate(idOrSlug, actorId = 'admin') {
    this._ensureStoreCollections();
    const store = getStore();
    const idx = store.templates.findIndex(t => t.id === idOrSlug || t.slug === idOrSlug);
    if (idx === -1) throw new Error(`Template "${idOrSlug}" not found.`);

    const removed = store.templates.splice(idx, 1)[0];
    saveStore();

    await AuditLogs.create({
      actorUserId: actorId,
      action: 'template.deleted',
      targetEntity: 'template',
      targetId: removed.id,
      metadata: { name: removed.name }
    });

    return { success: true, message: `Template "${removed.name}" deleted from catalog.` };
  }

  // =========================================================================
  // 2. PRESETS MANAGER (CREATE, DUPLICATE, EDIT, CLONE-TO-TEMPLATE)
  // =========================================================================

  listPresets() {
    this._ensureStoreCollections();
    const store = getStore();
    return (store.presets || []).slice();
  }

  getPreset(id) {
    this._ensureStoreCollections();
    const store = getStore();
    return (store.presets || []).find(p => p.id === id) || null;
  }

  async savePreset(presetData, actorId = 'admin') {
    this._ensureStoreCollections();
    const store = getStore();

    if (!presetData.name) throw new Error('Preset name is required.');
    const id = presetData.id || ('preset_' + crypto.randomBytes(4).toString('hex'));

    const existingIdx = store.presets.findIndex(p => p.id === id);
    const item = {
      id,
      name: presetData.name.trim(),
      category: presetData.category || 'Birthday',
      price: Number(presetData.price !== undefined ? presetData.price : 149),
      colors: presetData.colors || { primary: '#ff2a7a', secondary: '#ffd166', background: '#fff7fa' },
      sections: Array.isArray(presetData.sections) ? presetData.sections : [],
      tags: Array.isArray(presetData.tags) ? presetData.tags : ['preset'],
      status: presetData.status || 'published',
      updatedAt: Date.now()
    };

    if (existingIdx !== -1) {
      store.presets[existingIdx] = Object.assign({}, store.presets[existingIdx], item);
    } else {
      item.createdAt = Date.now();
      store.presets.unshift(item);
    }

    saveStore();

    await AuditLogs.create({
      actorUserId: actorId,
      action: existingIdx !== -1 ? 'preset.updated' : 'preset.created',
      targetEntity: 'preset',
      targetId: id,
      metadata: { name: item.name }
    });

    return item;
  }

  async duplicatePreset(id, actorId = 'admin') {
    this._ensureStoreCollections();
    const store = getStore();
    const preset = store.presets.find(p => p.id === id);
    if (!preset) throw new Error(`Preset "${id}" not found.`);

    const newId = 'preset_' + crypto.randomBytes(4).toString('hex');
    const duplicated = JSON.parse(JSON.stringify(preset));
    duplicated.id = newId;
    duplicated.name = `${preset.name} (Copy)`;
    duplicated.createdAt = Date.now();
    duplicated.updatedAt = Date.now();

    store.presets.unshift(duplicated);
    saveStore();

    await AuditLogs.create({
      actorUserId: actorId,
      action: 'preset.duplicated',
      targetEntity: 'preset',
      targetId: newId,
      metadata: { originalId: id, name: duplicated.name }
    });

    return duplicated;
  }

  async clonePresetToTemplate(presetId, overrides = {}, actorId = 'admin') {
    this._ensureStoreCollections();
    const store = getStore();
    const preset = store.presets.find(p => p.id === presetId);
    if (!preset) throw new Error(`Preset "${presetId}" not found.`);

    const tplName = (overrides.name || `${preset.name} Template`).trim();
    const tplSlug = (overrides.slug || tplName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')) + '-' + crypto.randomBytes(2).toString('hex');

    const templateData = {
      name: tplName,
      slug: tplSlug,
      category: overrides.category || preset.category || 'Birthday',
      price: overrides.price !== undefined ? Number(overrides.price) : preset.price,
      colors: preset.colors,
      sections: preset.sections.length > 0 ? preset.sections : [
        { id: 's1', title: 'Preset Welcome Scene', subtitle: 'Greeting', text: 'Celebration Begins', visible: true, order: 1 }
      ],
      tags: preset.tags,
      badge: overrides.badge || '✨ Preset Cloned Experience',
      status: 'draft'
    };

    const newTemplate = await this.createTemplate(templateData, actorId);

    await AuditLogs.create({
      actorUserId: actorId,
      action: 'preset.cloned_to_template',
      targetEntity: 'template',
      targetId: newTemplate.id,
      metadata: { sourcePresetId: presetId }
    });

    return newTemplate;
  }

  async deletePreset(id, actorId = 'admin') {
    this._ensureStoreCollections();
    const store = getStore();
    const idx = store.presets.findIndex(p => p.id === id);
    if (idx === -1) throw new Error(`Preset "${id}" not found.`);

    const removed = store.presets.splice(idx, 1)[0];
    saveStore();

    await AuditLogs.create({
      actorUserId: actorId,
      action: 'preset.deleted',
      targetEntity: 'preset',
      targetId: id,
      metadata: { name: removed.name }
    });

    return { success: true, message: `Preset "${removed.name}" deleted.` };
  }

  // =========================================================================
  // 3. PAGE & STOREFRONT CONTENT MANAGER (HERO, FAQ, LEGAL, OFFERS)
  // =========================================================================

  getSiteContent() {
    this._ensureStoreCollections();
    const store = getStore();
    return store.siteContent || loadSeedSiteContent();
  }

  async updateSiteContent(contentUpdates, actorId = 'admin') {
    this._ensureStoreCollections();
    const store = getStore();

    const previous = JSON.parse(JSON.stringify(store.siteContent || {}));

    // Record snapshot in contentVersions
    const versionNum = 'v' + (Date.now().toString(36));
    if (!Array.isArray(store.contentVersions)) store.contentVersions = [];
    store.contentVersions.unshift({
      versionId: versionNum,
      timestamp: Date.now(),
      author: actorId,
      snapshot: previous
    });
    if (store.contentVersions.length > 15) store.contentVersions.pop();

    let merged = { ...previous };
    if (contentUpdates && contentUpdates.section && contentUpdates.data) {
      merged[contentUpdates.section] = {
        ...(merged[contentUpdates.section] || {}),
        ...contentUpdates.data
      };
    } else {
      merged = {
        ...merged,
        ...contentUpdates
      };
    }

    store.siteContent = {
      ...merged,
      updatedAt: Date.now()
    };

    saveStore();

    await AuditLogs.create({
      actorUserId: actorId,
      action: 'content.updated',
      targetEntity: 'siteContent',
      targetId: 'storefront',
      metadata: { version: versionNum }
    });

    return store.siteContent;
  }

  async rollbackSiteContent(versionId, actorId = 'admin') {
    this._ensureStoreCollections();
    const store = getStore();
    const entry = (store.contentVersions || []).find(v => v.versionId === versionId);
    if (!entry || !entry.snapshot) throw new Error(`Content version "${versionId}" not found.`);

    store.siteContent = {
      ...entry.snapshot,
      updatedAt: Date.now()
    };
    saveStore();

    await AuditLogs.create({
      actorUserId: actorId,
      action: 'content.rollback',
      targetEntity: 'siteContent',
      targetId: 'storefront',
      metadata: { restoredVersion: versionId }
    });

    return store.siteContent;
  }

  // =========================================================================
  // 4. MEDIA MANAGER WITH CLOUDINARY INTEGRATION & USAGE DETECTION
  // =========================================================================

  listMedia({ type = 'all', search = '', limit = 50, offset = 0 } = {}) {
    this._ensureStoreCollections();
    const store = getStore();
    let list = (store.mediaAssets || []).slice();

    if (type && type !== 'all') {
      list = list.filter(m => m.type === type);
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(m =>
        (m.name && m.name.toLowerCase().includes(q)) ||
        (m.url && m.url.toLowerCase().includes(q)) ||
        (Array.isArray(m.tags) && m.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    list.sort((a, b) => (b.uploadedAt || 0) - (a.uploadedAt || 0));

    // Annotate with live usage flag
    const annotated = list.map(item => {
      const usage = this.checkMediaUsage(item.url);
      return {
        ...item,
        usageCount: usage.totalUsages,
        usedIn: usage.places
      };
    });

    return {
      total: annotated.length,
      media: annotated.slice(offset, offset + limit)
    };
  }

  checkMediaUsage(assetUrl) {
    if (!assetUrl) return { totalUsages: 0, places: [] };
    this._ensureStoreCollections();
    const store = getStore();
    const places = [];

    // Scan templates
    (store.templates || []).forEach(t => {
      if (t.thumbnail === assetUrl || t.coverImage === assetUrl || (t.gallery && t.gallery.includes(assetUrl))) {
        places.push({ entity: 'Template', id: t.id, name: t.name });
      }
    });

    // Scan moments
    (store.moments || []).forEach(m => {
      const payloadStr = JSON.stringify(m.payload || {});
      if (payloadStr.includes(assetUrl)) {
        places.push({ entity: 'Moment', id: m.id, title: m.title || m.slug });
      }
    });

    return {
      totalUsages: places.length,
      places
    };
  }

  async uploadMedia(assetData, actorId = 'admin') {
    this._ensureStoreCollections();
    const store = getStore();

    if (!assetData.url) throw new Error('Asset URL is required.');

    const id = 'med_' + crypto.randomBytes(4).toString('hex');
    const asset = {
      id,
      name: (assetData.name || 'Cloud Asset').trim(),
      type: assetData.type || (assetData.url.match(/\.(mp3|wav|ogg)$/i) ? 'audio' : (assetData.url.match(/\.(mp4|webm)$/i) ? 'video' : 'image')),
      url: assetData.url.trim(),
      format: assetData.format || 'jpg',
      sizeBytes: Number(assetData.sizeBytes || 150000),
      tags: Array.isArray(assetData.tags) ? assetData.tags : ['cloudinary'],
      uploadedAt: Date.now()
    };

    store.mediaAssets.unshift(asset);
    saveStore();

    await AuditLogs.create({
      actorUserId: actorId,
      action: 'media.uploaded',
      targetEntity: 'media',
      targetId: id,
      metadata: { name: asset.name, url: asset.url }
    });

    return asset;
  }

  async deleteMedia(id, force = false, actorId = 'admin') {
    this._ensureStoreCollections();
    const store = getStore();
    const idx = store.mediaAssets.findIndex(m => m.id === id);
    if (idx === -1) throw new Error(`Media asset "${id}" not found.`);

    const asset = store.mediaAssets[idx];
    const usage = this.checkMediaUsage(asset.url);

    if (usage.totalUsages > 0 && !force) {
      return {
        success: false,
        error: `Asset is currently in use across ${usage.totalUsages} item(s). Use force=true if you really wish to delete it.`,
        inUse: true,
        usedIn: usage.places
      };
    }

    const removed = store.mediaAssets.splice(idx, 1)[0];
    saveStore();

    await AuditLogs.create({
      actorUserId: actorId,
      action: 'media.deleted',
      targetEntity: 'media',
      targetId: id,
      metadata: { name: removed.name }
    });

    return { success: true, message: `Media asset "${removed.name}" deleted successfully.` };
  }

  // =========================================================================
  // 5. SYSTEM SETTINGS & HEALTH
  // =========================================================================

  getSettings() {
    this._ensureStoreCollections();
    const store = getStore();
    const settings = store.settings || {};
    // Return sanitized settings (no secrets)
    const { razorpayKeySecret, supabaseServiceRoleKey, ...safe } = settings;
    return safe;
  }

  async updateSettings(updates, actorId = 'admin') {
    this._ensureStoreCollections();
    const store = getStore();

    // Prevent storing sensitive keys directly in store.settings if passed from UI
    const { razorpayKeySecret, supabaseServiceRoleKey, ...safeUpdates } = updates;

    store.settings = {
      ...store.settings,
      ...safeUpdates,
      updatedAt: Date.now()
    };

    saveStore();

    await AuditLogs.create({
      actorUserId: actorId,
      action: 'settings.updated',
      targetEntity: 'settings',
      targetId: 'global',
      metadata: { updatedKeys: Object.keys(safeUpdates) }
    });

    return this.getSettings();
  }

  async getHealthStatus() {
    this._ensureStoreCollections();
    const store = getStore();

    const isSupabaseConfigured = !!(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY);
    const isCloudinaryConfigured = !!(process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_URL);
    const isRazorpayConfigured = !!(process.env.RAZORPAY_KEY_ID);

    return {
      status: 'operational',
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: Date.now(),
      services: {
        database: {
          engine: isSupabaseConfigured ? 'Supabase PostgreSQL' : 'Atomic JSON Store',
          status: 'healthy',
          totalUsers: (store.users || []).length,
          totalMoments: (store.moments || []).length,
          totalOrders: (store.orders || []).length,
          totalTemplates: (store.templates || []).length
        },
        cloudinary: {
          configured: isCloudinaryConfigured,
          status: isCloudinaryConfigured ? 'connected' : 'simulation_active',
          cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'vanvi-moments'
        },
        razorpay: {
          configured: isRazorpayConfigured,
          status: isRazorpayConfigured ? 'live' : 'sandbox_test_mode',
          keyId: process.env.RAZORPAY_KEY_ID ? (process.env.RAZORPAY_KEY_ID.slice(0, 8) + '...') : 'rzp_test_sim'
        }
      },
      metrics: {
        memoryMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        nodeVersion: process.version
      }
    };
  }
}

const adminCmsService = new AdminCmsService();

module.exports = {
  adminCmsService,
  AdminCmsService
};
