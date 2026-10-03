/**
 * VANVI MOMENTS — CANVA AI TEMPLATE ADAPTER PIPELINE
 * Adapter to ingest, normalize, and interpolate external Canva / HTML5 templates
 * into the Vanvi Moments recipient runtime and Builder engine.
 */

(function(root) {
  'use strict';

  const DEFAULT_TOKENS = {
    recipientName: 'Special Someone',
    senderName: 'With Love',
    message: 'Wishing you all the joy, love, and wonder today and always.',
    photo1: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&q=80',
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
    occasion: 'Celebration',
    accentColor: '#ff2a7a',
    musicUrl: ''
  };

  class VanviTemplateAdapter {
    /**
     * Extract all unique {{token}} occurrences from an HTML string
     * @param {string} html 
     * @returns {string[]} Array of token names without curly braces
     */
    static extractTokens(html) {
      if (!html || typeof html !== 'string') return [];
      const tokenRegex = /\{\{\s*([a-zA-Z0-9_-]+)\s*\}\}/g;
      const tokens = new Set();
      let match;
      while ((match = tokenRegex.exec(html)) !== null) {
        tokens.add(match[1]);
      }
      return Array.from(tokens);
    }

    /**
     * Replaces tokens {{key}} with provided data values
     * @param {string} htmlTemplate 
     * @param {Object} data 
     * @returns {string} Compiled HTML
     */
    static render(htmlTemplate, data = {}) {
      if (!htmlTemplate || typeof htmlTemplate !== 'string') return '';
      const merged = Object.assign({}, DEFAULT_TOKENS, data);

      return htmlTemplate.replace(/\{\{\s*([a-zA-Z0-9_-]+)\s*\}\}/g, (match, key) => {
        if (merged[key] !== undefined && merged[key] !== null) {
          return String(merged[key]);
        }
        return match;
      });
    }

    /**
     * Validates if a template contains acceptable structure
     * @param {string} html 
     * @returns {{ valid: boolean, errors: string[], tokens: string[] }}
     */
    static validateTemplate(html) {
      const errors = [];
      if (!html || typeof html !== 'string') {
        errors.push('Template content is empty or invalid.');
        return { valid: false, errors, tokens: [] };
      }

      const tokens = this.extractTokens(html);
      if (!tokens.includes('recipientName') && !tokens.includes('message')) {
        errors.push('Warning: Template does not include core tokens ({{recipientName}} or {{message}}).');
      }

      return {
        valid: errors.length === 0,
        errors,
        tokens
      };
    }

    /**
     * Packages an ingested Canva / external template into a Vanvi template manifest
     * @param {Object} meta 
     * @param {string} htmlTemplate 
     * @param {string} cssContent 
     * @returns {Object} Vanvi Template Manifest
     */
    static packageTemplate(meta = {}, htmlTemplate = '', cssContent = '') {
      const id = meta.id || ('canva-' + Math.random().toString(36).substring(2, 9));
      const name = meta.name || 'Bespoke Canva Moment';
      const category = meta.category || 'Celebration';
      const price = Number(meta.price || 0);
      const isFree = price === 0;

      const tokens = this.extractTokens(htmlTemplate);
      const customizableFields = tokens.map(t => {
        if (t === 'recipientName') return 'Recipient Name';
        if (t === 'senderName') return 'Sender Name';
        if (t === 'message') return 'Personal Message';
        if (t === 'date') return 'Event Date';
        if (t.startsWith('photo')) return 'Photo ' + t.replace('photo', '');
        return t.charAt(0).toUpperCase() + t.slice(1);
      });

      return {
        id,
        slug: id,
        name,
        category,
        categorySlug: category.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        categoryName: category,
        price,
        isFree,
        badge: meta.badge || (isFree ? '100% Free' : (price > 700 ? 'Ultra Premium ✦' : 'Custom Craft')),
        tier: isFree ? 'Free' : (price > 700 ? 'Ultra Premium' : 'Premium'),
        type: meta.type || 'Canva Bespoke',
        icon: meta.icon || '🎨',
        soundtrack: meta.soundtrack || 'Gentle Piano & Acoustic',
        tags: meta.tags || ['canva', 'custom', category.toLowerCase()],
        description: meta.description || 'Imported bespoke digital experience powered by Vanvi Template Adapter.',
        features: meta.features || ['Interactive Reveal', 'Full Mobile Responsive', 'Permanent Link'],
        previewOccasion: category,
        previewRecipient: meta.previewRecipient || 'Recipient',
        previewSender: meta.previewSender || 'Sender',
        previewMessage: meta.previewMessage || 'May this moment bring you boundless joy.',
        accentColor: meta.accentColor || '#ff2a7a',
        customizableFields: customizableFields.length ? customizableFields : ['Recipient Name', 'Sender Name', 'Message', 'Photos'],
        rawHtml: htmlTemplate,
        rawCss: cssContent
      };
    }
  }

  // Export globally and for Node.js
  root.VanviTemplateAdapter = VanviTemplateAdapter;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = VanviTemplateAdapter;
  }

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));

