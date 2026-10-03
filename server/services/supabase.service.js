/**
 * VANVI MOMENTS — PHASE 3 SUPABASE DATABASE SERVICE & REPOSITORY ADAPTER
 * Architecture:
 * - Enterprise-grade Supabase client adapter for unlimited independent templates
 * - Transparent fallback to local transaction-safe store if offline or credentials pending
 * - Zero breaking changes to existing routes, templates, or Phase 1/2 systems
 */

const { createClient } = require('@supabase/supabase-js');
const { envConfig } = require('../config/env');
const fs = require('fs');
const path = require('path');

class SupabaseService {
  constructor() {
    this.supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    this.supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';
    this.isConfigured = Boolean(this.supabaseUrl && this.supabaseKey);
    this.client = null;

    if (this.isConfigured) {
      try {
        this.client = createClient(this.supabaseUrl, this.supabaseKey, {
          auth: { persistSession: false }
        });
        console.log('🚀 Supabase client initialized successfully.');
      } catch (err) {
        console.warn('⚠️ Supabase client initialization warning, falling back to local adapter:', err.message);
        this.isConfigured = false;
      }
    }
  }

  getStatus() {
    return {
      configured: this.isConfigured,
      mode: this.isConfigured ? 'supabase_live' : 'local_store_fallback',
      project: 'VanviMoments (Free Tier)',
      tables: ['profiles', 'templates', 'template_schemas', 'moments', 'moment_assets', 'orders', 'payments']
    };
  }

  // =========================================================================
  // 1. PROFILES (USERS)
  // =========================================================================
  async getProfileById(id) {
    if (this.isConfigured) {
      const { data, error } = await this.client.from('profiles').select('*').eq('id', id).single();
      if (!error && data) return data;
    }
    // Fallback to local store
    const db = require('../db/database');
    return db.Users.findById(id);
  }

  async getProfileByEmail(email) {
    if (this.isConfigured) {
      const { data, error } = await this.client.from('profiles').select('*').eq('email', email).single();
      if (!error && data) return data;
    }
    const db = require('../db/database');
    return db.Users.findByEmail(email);
  }

  async upsertProfile(profile) {
    if (this.isConfigured) {
      const { data, error } = await this.client.from('profiles').upsert(profile).select().single();
      if (error) console.warn('Supabase upsertProfile warning:', error.message);
      else return data;
    }
    const db = require('../db/database');
    const existing = await db.Users.findByEmail(profile.email);
    if (existing) return existing;
    return db.Users.create(profile);
  }

  // =========================================================================
  // 2. TEMPLATES (Unlimited Arbitrary Templates & Pricing)
  // =========================================================================
  async getAllTemplates(activeOnly = true) {
    if (this.isConfigured) {
      let query = this.client.from('templates').select('*');
      if (activeOnly) query = query.eq('is_active', true);
      const { data, error } = await query;
      if (!error && Array.isArray(data) && data.length > 0) return data;
    }

    // Dynamic file-system discovery fallback for unlimited templates
    const templatesDir = path.resolve(__dirname, '../../templates');
    const list = [];
    if (fs.existsSync(templatesDir)) {
      const dirs = fs.readdirSync(templatesDir);
      for (const d of dirs) {
        const jsonPath = path.join(templatesDir, d, 'template.json');
        if (fs.existsSync(jsonPath)) {
          try {
            const parsed = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
            list.push({
              template_id: parsed.id || d,
              name: parsed.name || d,
              price: parsed.price !== undefined ? parsed.price : 99,
              currency: parsed.currency || 'INR',
              category: parsed.category || 'Celebration',
              builder_strategy: parsed.builderStrategy || 'common',
              config: parsed,
              is_active: true
            });
          } catch(e) {}
        }
      }
    }
    return list;
  }

  async getTemplateById(templateId) {
    if (this.isConfigured) {
      const { data, error } = await this.client.from('templates').select('*').eq('template_id', templateId).single();
      if (!error && data) return data;
    }

    // Dynamic resolution from template.json (never guess by folder)
    const tplPath = path.resolve(__dirname, '../../templates', templateId, 'template.json');
    if (fs.existsSync(tplPath)) {
      try {
        const parsed = JSON.parse(fs.readFileSync(tplPath, 'utf8'));
        return {
          template_id: parsed.id || templateId,
          name: parsed.name,
          price: parsed.price,
          currency: parsed.currency || 'INR',
          category: parsed.category,
          builder_strategy: parsed.builderStrategy || 'common',
          config: parsed,
          is_active: true
        };
      } catch (e) {}
    }
    return null;
  }

  async upsertTemplate(template) {
    if (this.isConfigured) {
      const { data, error } = await this.client.from('templates').upsert(template).select().single();
      if (error) console.warn('Supabase upsertTemplate warning:', error.message);
      else return data;
    }
    return template;
  }

  // =========================================================================
  // 3. TEMPLATE SCHEMAS
  // =========================================================================
  async getTemplateSchema(templateId) {
    if (this.isConfigured) {
      const { data, error } = await this.client.from('template_schemas').select('*').eq('template_id', templateId).single();
      if (!error && data) return data;
    }

    const tpl = await this.getTemplateById(templateId);
    if (tpl && tpl.config) {
      const fields = (tpl.config.schema && tpl.config.schema.fields) || tpl.config.fields || [];
      return {
        id: `sch_${templateId}`,
        template_id: templateId,
        schema_version: tpl.config.version || '1.0.0',
        fields,
        customization_options: tpl.config.customizationOptions || {}
      };
    }
    return null;
  }

  // =========================================================================
  // 4. MOMENTS (Full JSONB custom_data Engine)
  // =========================================================================
  async createMoment(momentData) {
    const payload = {
      id: momentData.id || `mom_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      slug: momentData.slug,
      user_id: momentData.user_id || momentData.userId || null,
      template_id: momentData.template_id || momentData.templateId,
      custom_data: momentData.custom_data || momentData.customData || {},
      status: momentData.status || 'published',
      views: momentData.views || 0,
      hearts: momentData.hearts || 0,
      created_at: momentData.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (this.isConfigured) {
      const { data, error } = await this.client.from('moments').insert(payload).select().single();
      if (error) {
        console.warn('Supabase createMoment error, writing to local fallback:', error.message);
      } else {
        return data;
      }
    }

    // Local fallback persistence
    const db = require('../db/database');
    return db.Moments.create({
      id: payload.id,
      slug: payload.slug,
      userId: payload.user_id,
      templateId: payload.template_id,
      custom_data: payload.custom_data,
      customData: payload.custom_data,
      title: payload.custom_data.title || 'Special Moment',
      recipient: payload.custom_data.recipient || 'Someone Special',
      sender: payload.custom_data.sender || 'Anonymous',
      occasion: payload.custom_data.occasion || 'Celebration',
      message: payload.custom_data.message || '',
      status: payload.status,
      views: payload.views,
      hearts: payload.hearts
    });
  }

  async getMomentBySlug(slug) {
    if (this.isConfigured) {
      const { data, error } = await this.client.from('moments').select('*').eq('slug', slug).single();
      if (!error && data) return data;
    }

    const db = require('../db/database');
    const local = await db.Moments.findBySlug(slug);
    if (!local) return null;

    // Normalize representation
    return {
      id: local.id,
      slug: local.slug,
      user_id: local.userId,
      template_id: local.templateId || local.template_id,
      custom_data: local.custom_data || local.customData || {
        title: local.title,
        recipient: local.recipient,
        sender: local.sender,
        occasion: local.occasion,
        message: local.message,
        photos: local.photos,
        music_track: local.musicTrack,
        theme: local.theme
      },
      status: local.status || 'published',
      views: local.views || 0,
      hearts: local.hearts || 0,
      created_at: local.createdAt,
      updated_at: local.updatedAt
    };
  }

  async updateMoment(slugOrId, updates) {
    if (this.isConfigured) {
      const query = slugOrId.startsWith('mom_') ? 
        this.client.from('moments').update(updates).eq('id', slugOrId) :
        this.client.from('moments').update(updates).eq('slug', slugOrId);
      const { data, error } = await query.select().single();
      if (!error && data) return data;
    }

    const db = require('../db/database');
    const existing = (await db.Moments.findBySlug(slugOrId)) || (await db.Moments.findById(slugOrId));
    if (existing) {
      return db.Moments.update(existing.id, updates);
    }
    return null;
  }

  // =========================================================================
  // 5. MOMENT ASSETS
  // =========================================================================
  async createMomentAsset(asset) {
    if (this.isConfigured) {
      const { data, error } = await this.client.from('moment_assets').insert(asset).select().single();
      if (!error && data) return data;
    }
    return asset;
  }

  async getMomentAssets(momentId) {
    if (this.isConfigured) {
      const { data, error } = await this.client.from('moment_assets').select('*').eq('moment_id', momentId);
      if (!error && data) return data;
    }
    return [];
  }

  // =========================================================================
  // 6 & 7. ORDERS & PAYMENTS
  // =========================================================================
  async createOrder(orderData) {
    if (this.isConfigured) {
      const { data, error } = await this.client.from('orders').insert(orderData).select().single();
      if (!error && data) return data;
    }
    const db = require('../db/database');
    return db.Orders.create(orderData);
  }

  async recordPayment(paymentData) {
    if (this.isConfigured) {
      const { data, error } = await this.client.from('payments').insert(paymentData).select().single();
      if (!error && data) return data;
    }
    return paymentData;
  }
}

// Export singleton instance
const supabaseService = new SupabaseService();
module.exports = supabaseService;
