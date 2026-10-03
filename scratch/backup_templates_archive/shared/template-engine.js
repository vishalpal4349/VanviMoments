(function (root) {
  'use strict';

  function resolveTemplateRegistry() {
    if (root.VANVI_TEMPLATE_REGISTRY) {
      return root.VANVI_TEMPLATE_REGISTRY;
    }

    if (typeof window !== 'undefined' && window.VANVI_TEMPLATE_REGISTRY) {
      return window.VANVI_TEMPLATE_REGISTRY;
    }

    return null;
  }

  function getTemplateById(id) {
    const registry = resolveTemplateRegistry();
    return registry ? registry.getTemplateById(id) : null;
  }

  function getTemplateBySlug(slug) {
    const registry = resolveTemplateRegistry();
    return registry ? registry.getTemplateBySlug(slug) : null;
  }

  function getTemplatesByCategory(categorySlug) {
    const registry = resolveTemplateRegistry();
    return registry ? registry.getTemplatesByCategory(categorySlug) : [];
  }

  function buildTemplateContext(templateId, overrides = {}) {
    const template = getTemplateById(templateId) || getTemplateBySlug(templateId);
    if (!template) {
      return null;
    }

    return {
      ...template,
      ...overrides,
      supports: template.supportedCustomization || ['name', 'message', 'photos', 'music', 'pin'],
      renderer: 'shared-template-engine'
    };
  }

  const api = {
    getTemplateById,
    getTemplateBySlug,
    getTemplatesByCategory,
    buildTemplateContext
  };

  root.VANVI_TEMPLATE_ENGINE = api;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
