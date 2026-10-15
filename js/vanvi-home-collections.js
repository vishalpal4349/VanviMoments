(function() {
  'use strict';

  const escapeHtml = (value) => String(value || '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));

  async function templatePageExists(template) {
    if (!template.templatePath || !/\.html(?:$|[?#])/i.test(template.templatePath)) return false;

    try {
      const response = await fetch(template.templatePath, { method: 'HEAD' });
      if (response.ok) return true;
    } catch (error) {
      // Some static hosts do not support HEAD for HTML pages.
    }

    try {
      const response = await fetch(template.templatePath);
      return response.ok;
    } catch (error) {
      console.warn(`Could not verify homepage template "${template.id}".`, error);
      return false;
    }
  }

  function ensureCollectionSection(sectionId, sliderId, title, subtitle, link, cta) {
    let section = document.getElementById(sectionId);
    if (!section) {
      section = document.createElement('section');
      section.id = sectionId;
      section.className = 'home-collection-section';
      section.innerHTML = `
        <div class="home-collection-heading">
          <div><h2>${title}</h2><p>${subtitle}</p></div>
        </div>
        <div class="home-collection-grid" id="${sliderId}" aria-live="polite"></div>
        <a class="home-collection-all" href="${link}">${cta}</a>`;

      const insertAfter = sectionId === 'premiumCollectionSection'
        ? document.getElementById('freeCollectionSection')
        : document.querySelector('.hero');
      if (insertAfter) {
        insertAfter.insertAdjacentElement('afterend', section);
      } else {
        document.body.appendChild(section);
      }
    }
    return document.getElementById(sliderId);
  }

  function renderTemplateCard(template, isFree) {
    const price = Number(template.price) || 0;
    const category = escapeHtml(template.category || 'Celebration');
    const name = escapeHtml(template.name || 'Celebration template');
    const id = encodeURIComponent(template.id);
    const previewPath = template.templatePath;
    const builderPath = `builder.html?template=${id}&occasion=${encodeURIComponent(template.category || 'Celebration')}`;
    const thumb = escapeHtml(template.thumbnail || 'assets/favicon.svg');
    const badge = escapeHtml(template.badge || (isFree ? 'Free to create' : 'Premium design'));
    const description = escapeHtml(template.tagline || template.type || template.description || 'A handcrafted celebration experience.');
    const priceLabel = isFree ? 'Free' : `₹${price.toLocaleString('en-IN')}`;

    return `
      <article class="template home-live-template" data-id="${id}" data-category="${category}" data-price="${price}">
        <a class="thumb home-live-thumb" href="${escapeHtml(previewPath)}" aria-label="Preview ${name}">
          <span class="template-tier-badge ${isFree ? 'badge-free' : 'badge-premium'}">${badge}</span>
          <img class="template-real-thumb" src="${thumb}" alt="${name}" loading="lazy" onerror="this.onerror=null;this.src='assets/favicon.svg';">
        </a>
        <div class="template-info">
          <b title="${name}">${name}</b>
          <small>${description}</small>
          <div class="template-rating-pill">${isFree ? '🎁 Free to create' : '✦ Premium'} · ${priceLabel}</div>
          <div class="home-tpl-action-row">
            <a href="${escapeHtml(previewPath)}" class="home-btn-explore">✦ Preview</a>
            <a href="${builderPath}" class="home-btn-make-yours">Create ✨</a>
          </div>
        </div>
      </article>`;
  }

  function renderEmptyState(isFree) {
    const collection = isFree ? 'free' : 'premium';
    return `<p class="home-collection-empty" role="status">No verified ${collection} templates are available right now. Please check back soon.</p>`;
  }

  async function renderCollections() {
    const registry = window.VanviTemplatesData;
    const freeSlider = ensureCollectionSection(
      'freeCollectionSection',
      'freeTemplateSlider',
      'Free Collection',
      'Start creating with these real, available templates.',
      'templates.html?category=free',
      'Explore all free templates →'
    );
    const premiumSlider = ensureCollectionSection(
      'premiumCollectionSection',
      'premiumTemplateSlider',
      'Premium Collection',
      'Explore handcrafted designs available to create today.',
      'templates.html?category=premium',
      'Explore all premium templates →'
    );
    if (!freeSlider || !premiumSlider) return;

    if (!registry || typeof registry.getAll !== 'function') {
      console.error('Homepage template registry is unavailable.');
      freeSlider.innerHTML = '<p class="home-collection-empty" role="status">Live templates could not be loaded. Please refresh the page.</p>';
      premiumSlider.innerHTML = '<p class="home-collection-empty" role="status">Live templates could not be loaded. Please refresh the page.</p>';
      freeSlider.dataset.ready = 'true';
      premiumSlider.dataset.ready = 'true';
      return;
    }

    freeSlider.innerHTML = '<p class="home-collection-loading">Loading available templates…</p>';
    premiumSlider.innerHTML = '<p class="home-collection-loading">Loading available templates…</p>';

    try {
      const availableTemplates = await Promise.all(
        registry.getAll().map(async (template) => (await templatePageExists(template)) ? template : null)
      );
      const verified = availableTemplates.filter(Boolean);
      const freeTemplates = verified.filter((template) => Number(template.price) <= 0);
      const premiumTemplates = verified.filter((template) => Number(template.price) > 0);

      freeSlider.innerHTML = freeTemplates.length
        ? freeTemplates.slice(0, 4).map((template) => renderTemplateCard(template, true)).join('')
        : renderEmptyState(true);
      premiumSlider.innerHTML = premiumTemplates.length
        ? premiumTemplates.slice(0, 4).map((template) => renderTemplateCard(template, false)).join('')
        : renderEmptyState(false);
      freeSlider.dataset.ready = 'true';
      premiumSlider.dataset.ready = 'true';

      document.querySelectorAll('.slider-arrow-btn[data-target]').forEach((button) => {
        const slider = document.getElementById(button.dataset.target);
        if (!slider) return;
        button.addEventListener('click', () => {
          slider.scrollBy({
            left: (button.dataset.slide === 'prev' ? -1 : 1) * Math.max(220, slider.clientWidth * 0.8),
            behavior: 'smooth'
          });
        });
      });
    } catch (error) {
      console.error('Failed to refresh homepage template collections.', error);
      freeSlider.innerHTML = renderEmptyState(true);
      premiumSlider.innerHTML = renderEmptyState(false);
      freeSlider.dataset.ready = 'true';
      premiumSlider.dataset.ready = 'true';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderCollections, { once: true });
  } else {
    renderCollections();
  }
})();
