(function (root) {
  'use strict';

  function renderTemplate(template, target, options = {}) {
    if (!template || !target) return false;

    const context = {
      title: template.name || 'Vanvi Moment',
      category: template.category || 'General',
      price: template.price || 0,
      isFree: Boolean(template.isFree),
      badge: template.badge || 'Template',
      ...options
    };

    target.innerHTML = `
      <div class="vanvi-template-shell" data-template-id="${template.id || ''}">
        <div class="vanvi-template-badge">${context.badge}</div>
        <h3>${context.title}</h3>
        <p>${context.category} · ${context.isFree ? 'Free' : '₹' + context.price}</p>
      </div>
    `;

    return true;
  }

  const api = { renderTemplate };
  root.VANVI_TEMPLATE_RENDERER = api;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
