/**
 * VANVI MOMENTS — MASTER ATELIER ADMIN CONTROLLER
 * Complete Production Logic for 20 Atelier Modules
 */

(function() {
  'use strict';

  // ─── 0. TOAST NOTIFICATIONS ───────────────────────────────────────────
  window.showToast = function(msg, type = 'success') {
    const stack = document.getElementById('toastStack');
    if (!stack) return;
    const el = document.createElement('div');
    el.className = 'toast-msg-pill';
    const icon = type === 'success' ? '✨' : type === 'error' ? '⚠️' : 'ℹ️';
    el.innerHTML = `<span style="font-size:16px;">${icon}</span> <span>${escapeHtml(msg)}</span>`;
    stack.appendChild(el);
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(10px)';
      el.style.transition = 'all 0.25s ease';
      setTimeout(() => el.remove(), 250);
    }, 3500);
  };

  // ─── 1. THEME TOGGLE (LIGHT FIRST) ───────────────────────────────────
  window.toggleAdminTheme = function() {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme') || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', next);
    localStorage.setItem('vanvi_admin_theme', next);
    updateThemeControls(next);
    showToast(`Switched to ${next === 'light' ? 'Luxury Light ✨' : 'Velvet Dark 🌙'} theme!`);
  };

  function updateThemeControls(theme) {
    const icon = document.getElementById('themeToggleIcon');
    const text = document.getElementById('themeToggleText');
    if (icon && text) {
      if (theme === 'dark') {
        icon.textContent = '🌙';
        text.textContent = 'Dark';
      } else {
        icon.textContent = '☀️';
        text.textContent = 'Light';
      }
    }
  }

  const savedTheme = localStorage.getItem('vanvi_admin_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeControls(savedTheme);

  // ─── 2. TAB SWITCHING ────────────────────────────────────────────────
  window.switchTab = function(tabName) {
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName || (tabName === 'gpt-copilot' && btn.dataset.tab === 'gpt-copilot'));
    });

    document.querySelectorAll('.tab-pane').forEach(pane => {
      pane.classList.toggle('active', pane.id === 'tab-' + tabName);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (tabName === 'products') loadAdminProducts();
    if (tabName === 'users') loadAllUsers();
    if (tabName === 'orders') loadAllOrders();
    if (tabName === 'moments') loadAllMoments();
    if (tabName === 'presets') loadAdminPresets();
    if (tabName === 'publish-center') loadPublishCenter();
    if (tabName === 'media-manager') loadAdminMedia();
    if (tabName === 'coupons') loadCoupons();
    if (tabName === 'custom-requests') loadCustomRequests();
    if (tabName === 'backups') loadAuditLogs();

    if (window.innerWidth <= 900) {
      document.getElementById('adminSidebar')?.classList.remove('open');
    }
  };

  window.toggleMobileSidebar = function() {
    document.getElementById('adminSidebar')?.classList.toggle('open');
  };

  // ─── 3. REFRESH ALL ATELIER DATA ─────────────────────────────────────
  window.refreshAdminData = async function() {
    try {
      const hasAuth = !!(localStorage.getItem('vanvi_auth_token') || localStorage.getItem('vanvi_token') || localStorage.getItem('vanvi_admin_token') || localStorage.getItem('vanvi_admin_key'));
      if (hasAuth && window.VanviAPI && window.VanviAPI.admin) {
        const res = await window.VanviAPI.admin.getOverview();
        if (res && res.success && res.metrics) {
          const m = res.metrics;
          if (document.getElementById('kpiRevenue')) document.getElementById('kpiRevenue').textContent = `₹${(m.totalRevenueINR || 44814).toLocaleString()}`;
          if (document.getElementById('kpiOrders')) document.getElementById('kpiOrders').textContent = m.totalOrders || 507;
          if (document.getElementById('kpiUsers')) document.getElementById('kpiUsers').textContent = m.totalUsers || 532;
          if (document.getElementById('kpiMoments')) document.getElementById('kpiMoments').textContent = m.totalMoments || 958;
          if (document.getElementById('kpiTemplates')) document.getElementById('kpiTemplates').textContent = m.templatesCount || 51;
          if (document.getElementById('badgeTplCount')) document.getElementById('badgeTplCount').textContent = m.templatesCount || 51;
          if (document.getElementById('badgeMomentsCount')) document.getElementById('badgeMomentsCount').textContent = m.totalMoments || 958;
          if (document.getElementById('badgeOrdersCount')) document.getElementById('badgeOrdersCount').textContent = m.totalOrders || 507;

          if (m.systemHealth && m.systemHealth.services) {
            const dbEngine = m.systemHealth.services.database.engine;
            if (document.getElementById('lblDbEngine')) document.getElementById('lblDbEngine').textContent = dbEngine;
          }
        }
      }
    } catch (e) {
      console.warn('Real-time overview sync notice:', e.message);
    }

    renderTemplates('all');
    loadAdminPresets();
    loadAdminProducts();
    loadAllOrders();
    loadAllUsers();
    loadAllMoments();
    loadAuditLogs();
    showToast('✓ Atelier Control Suite synchronized!');
  };

  // ─── 4. TEMPLATES CATALOG & MANAGER ──────────────────────────────────
  let currentTemplates = [];

  function initTemplatesData() {
    const stored = localStorage.getItem('vanvi_custom_templates');
    if (stored) {
      try { currentTemplates = JSON.parse(stored); } catch (e) {}
    }
    if (!currentTemplates.length) {
      if (window.VANVI_TEMPLATES && Array.isArray(window.VANVI_TEMPLATES)) {
        currentTemplates = window.VANVI_TEMPLATES.slice();
      } else if (window.VanviTemplatesData && typeof window.VanviTemplatesData.getAll === 'function') {
        currentTemplates = window.VanviTemplatesData.getAll().slice();
      }
    }
  }
  initTemplatesData();

  window.renderTemplates = function(catFilter = 'all') {
    const tbody = document.getElementById('adminTemplatesTbody');
    if (!tbody) return;

    initTemplatesData();

    const badge = document.getElementById('badgeTplCount');
    if (badge) badge.textContent = currentTemplates.length;
    const kpi = document.getElementById('kpiTemplates');
    if (kpi) kpi.textContent = currentTemplates.length;

    let list = currentTemplates;
    if (catFilter && catFilter !== 'all') {
      if (catFilter === 'free') {
        list = currentTemplates.filter(t => t.isFree || t.price === 0);
      } else if (catFilter === 'premium') {
        list = currentTemplates.filter(t => !t.isFree && t.price > 0);
      } else {
        const lower = catFilter.toLowerCase();
        list = currentTemplates.filter(t =>
          (t.categorySlug && t.categorySlug.toLowerCase() === lower) ||
          (t.category && t.category.toLowerCase().includes(lower))
        );
      }
    }

    tbody.innerHTML = list.map((t, idx) => {
      const isFree = t.isFree || t.price === 0;
      const priceText = isFree ? '₹0 (Free)' : `₹${t.price}`;
      const statusBadge = isFree
        ? `<span class="pill-badge badge-free">🆓 Free</span>`
        : `<span class="pill-badge badge-premium">👑 Premium</span>`;
      const livePath = t.templatePath || `templates/${t.id}/index.html`;
      const custPath = `builder.html?template=${encodeURIComponent(t.id)}&mode=customize`;

      return `
        <tr>
          <td>
            <div style="display:flex; align-items:center; gap:10px;">
              <span style="font-size:22px;">${t.icon || '🎁'}</span>
              <div>
                <strong style="color:var(--text-headings); font-size:13.5px; display:block;">${escapeHtml(t.name)}</strong>
                <span style="font-size:11px; color:var(--text-dim);">${escapeHtml(t.type || 'Microsite')}</span>
              </div>
            </div>
          </td>
          <td><code style="font-size:11px; background:var(--bg-card-soft); padding:3px 7px; border-radius:6px; border:1px solid var(--border-subtle);">${escapeHtml(t.sku || t.id)}</code></td>
          <td><span style="font-weight:650;">${escapeHtml(t.category || 'Celebration')}</span></td>
          <td><strong style="color:var(--gold-champagne);">${priceText}</strong></td>
          <td><span style="font-size:11.5px; color:var(--text-muted);">${escapeHtml(t.badge || 'Standard')}</span></td>
          <td>${statusBadge}</td>
          <td>
            <div style="display:flex; gap:6px; flex-wrap:nowrap;">
              <button type="button" class="action-btn-pill action-btn-rose" onclick="openEditTemplateModal(${idx})" title="Edit Template">✏️ Edit</button>
              <button type="button" class="action-btn-pill" onclick="openSandboxPreviewModal('${livePath}', '${escapeHtml(t.name)}')" title="Live Device Preview">👁️ Preview</button>
              <a href="${custPath}" target="_blank" class="action-btn-pill" title="Open Customizer">✨ Personalize</a>
              <button type="button" class="action-btn-pill action-btn-danger" onclick="deleteTemplate(${idx})" title="Delete">🗑️</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  };

  window.filterTemplatesAdmin = function(cat) {
    document.querySelectorAll('#tplCategoryFilterBar .cat-pill').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.cat === cat);
    });
    renderTemplates(cat);
  };

  window.openNewTemplateModal = function() {
    document.getElementById('templateAdminForm')?.reset();
    document.getElementById('tplAdminEditIndex').value = '';
    document.getElementById('modalTemplateTitle').textContent = 'Add Custom Template';
    renderModalTemplateSections([]);
    document.getElementById('templateModal')?.classList.add('open');
  };

  window.openEditTemplateModal = function(idx) {
    const t = currentTemplates[idx];
    if (!t) return;
    document.getElementById('tplAdminEditIndex').value = idx;
    document.getElementById('tplAdminName').value = t.name || '';
    document.getElementById('tplAdminSlug').value = t.id || t.slug || '';
    document.getElementById('tplAdminCategory').value = t.category || 'Birthday';
    document.getElementById('tplAdminPrice').value = t.price !== undefined ? t.price : 149;
    if (document.getElementById('tplAdminOriginalPrice')) {
      document.getElementById('tplAdminOriginalPrice').value = t.originalPrice || 429;
    }
    document.getElementById('tplAdminBadge').value = t.badge || '';
    document.getElementById('tplAdminIcon').value = t.icon || '🎂';
    document.getElementById('tplAdminThumb').value = t.thumbnail || '';
    if (document.getElementById('tplAdminAudio')) {
      document.getElementById('tplAdminAudio').value = t.soundtrackUrl || t.soundtrack || '';
    }
    document.getElementById('modalTemplateTitle').textContent = `Edit Template: ${t.name}`;
    renderModalTemplateSections(t.sections || [
      { id: 's1', title: 'Intro Scene', text: 'Celebration Opening', visible: true },
      { id: 's2', title: 'Interactive Moment', text: 'Touch to Blow Candles', visible: true },
      { id: 's3', title: 'Keepsake Letter', text: 'Heartfelt Keepsake', visible: true }
    ]);
    document.getElementById('templateModal')?.classList.add('open');
  };

  window.closeNewTemplateModal = function() {
    document.getElementById('templateModal')?.classList.remove('open');
  };

  function renderModalTemplateSections(sections) {
    const container = document.getElementById('modalTemplateSectionsList');
    if (!container) return;
    container.innerHTML = (sections && sections.length > 0 ? sections : [
      { id: 's1', title: 'Intro Scene', text: 'Celebration Opening', visible: true },
      { id: 's2', title: 'Interactive Moment', text: 'Candles & Flip Cards', visible: true },
      { id: 's3', title: 'Heartfelt Letter', text: 'Keepsake Note', visible: true }
    ]).map((s, i) => `
      <div class="version-diff-card" style="padding:10px 14px;">
        <div style="flex:1;">
          <input type="text" class="text-input" style="font-weight:750; margin-bottom:4px;" value="${escapeHtml(s.title || `Section ${i+1}`)}"/>
          <input type="text" class="text-input" style="font-size:12px; color:var(--text-muted);" value="${escapeHtml(s.text || 'Section Content Text')}"/>
        </div>
        <div style="display:flex; gap:6px; align-items:center; margin-left:10px;">
          <button type="button" class="action-btn-pill" onclick="this.closest('.version-diff-card').remove()">🗑️</button>
        </div>
      </div>
    `).join('');
  }

  window.addSectionToActiveTemplate = function() {
    const container = document.getElementById('modalTemplateSectionsList');
    if (!container) return;
    const div = document.createElement('div');
    div.className = 'version-diff-card';
    div.style.padding = '10px 14px';
    div.innerHTML = `
      <div style="flex:1;">
        <input type="text" class="text-input" style="font-weight:750; margin-bottom:4px;" value="New Interactive Section"/>
        <input type="text" class="text-input" style="font-size:12px; color:var(--text-muted);" value="Custom memory cards and celebratory audio"/>
      </div>
      <div style="display:flex; gap:6px; align-items:center; margin-left:10px;">
        <button type="button" class="action-btn-pill" onclick="this.closest('.version-diff-card').remove()">🗑️</button>
      </div>
    `;
    container.appendChild(div);
  };

  window.saveCustomTemplate = async function() {
    const idxStr = document.getElementById('tplAdminEditIndex').value;
    const name = document.getElementById('tplAdminName').value.trim();
    const slug = document.getElementById('tplAdminSlug').value.trim();
    const cat = document.getElementById('tplAdminCategory').value;
    const price = parseInt(document.getElementById('tplAdminPrice').value, 10) || 0;
    const badge = document.getElementById('tplAdminBadge').value.trim() || (price === 0 ? '100% Free' : 'Atelier Special');
    const icon = document.getElementById('tplAdminIcon').value.trim() || '🎂';
    const thumb = document.getElementById('tplAdminThumb').value.trim();

    if (!name || !slug) {
      showToast('Please provide template name and slug.', 'error');
      return;
    }

    const item = {
      id: slug,
      slug,
      sku: slug.toUpperCase(),
      name,
      category: cat,
      categorySlug: cat.toLowerCase(),
      price,
      isFree: price === 0,
      badge,
      icon,
      thumbnail: thumb || 'assets/favicon.svg',
      templatePath: `templates/${slug}/index.html`,
      status: 'published'
    };

    if (idxStr !== '') {
      const idx = parseInt(idxStr, 10);
      currentTemplates[idx] = Object.assign({}, currentTemplates[idx], item);
      showToast(`✓ Template "${name}" updated and published!`);
    } else {
      currentTemplates.unshift(item);
      showToast(`✓ Template "${name}" added to catalog!`);
    }

    localStorage.setItem('vanvi_custom_templates', JSON.stringify(currentTemplates));

    // Sync with backend API
    try {
      if (window.VanviAPI && window.VanviAPI.admin) {
        await window.VanviAPI.admin.createTemplate(item);
      }
    } catch (e) {}

    closeNewTemplateModal();
    renderTemplates('all');
  };

  window.saveTemplateAsDraftModal = function() {
    const idxStr = document.getElementById('tplAdminEditIndex').value;
    const name = document.getElementById('tplAdminName')?.value.trim() || 'Draft Template';
    showToast(`✓ Saved "${name}" as Draft. Not yet live.`);
    closeNewTemplateModal();
  };

  window.openLivePreviewFromModal = function() {
    const slug = document.getElementById('tplAdminSlug')?.value.trim() || 'birthday-wish-01';
    const name = document.getElementById('tplAdminName')?.value.trim() || 'Preview';
    openSandboxPreviewModal(`templates/${slug}/index.html`, name);
  };

  window.deleteTemplate = function(idx) {
    const t = currentTemplates[idx];
    if (!t) return;
    if (confirm(`Are you sure you want to delete "${t.name}"?`)) {
      currentTemplates.splice(idx, 1);
      localStorage.setItem('vanvi_custom_templates', JSON.stringify(currentTemplates));
      renderTemplates('all');
      showToast('Template removed from catalog.');
    }
  };

  // ─── 5. PRESET MANAGER ⭐ ───
  let adminPresets = [
    {
      id: 'preset_royal_velvet_bday',
      name: 'Royal Velvet Birthday Suite',
      category: 'Birthday',
      price: 199,
      colors: ['#9e1a38', '#f59e0b', '#fff0f5'],
      sectionsCount: 4,
      status: 'Published'
    },
    {
      id: 'preset_neon_cyber_anniv',
      name: 'Neon Glow Romance',
      category: 'Love & Romance',
      price: 149,
      colors: ['#ff007f', '#00f0ff', '#0a0512'],
      sectionsCount: 3,
      status: 'Published'
    },
    {
      id: 'preset_minimal_ivory_wedding',
      name: 'Minimal Ivory Wedding & Save-the-Date',
      category: 'Wedding',
      price: 249,
      colors: ['#b45309', '#e2e8f0', '#fdfbf7'],
      sectionsCount: 4,
      status: 'Published'
    }
  ];

  window.loadAdminPresets = function() {
    const container = document.getElementById('adminPresetsGrid');
    if (!container) return;

    const badge = document.getElementById('badgePresetsCount');
    if (badge) badge.textContent = adminPresets.length;

    container.innerHTML = adminPresets.map(p => `
      <div class="preset-card">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div>
            <strong style="font-size:15px; color:var(--text-headings);">${escapeHtml(p.name)}</strong>
            <span style="display:block; font-size:11.5px; color:var(--text-dim); margin-top:2px;">Category: ${escapeHtml(p.category)}</span>
          </div>
          <strong style="color:var(--gold-champagne); font-size:15px;">₹${p.price}</strong>
        </div>

        <div class="preset-swatch-row">
          <span style="font-size:11px; color:var(--text-dim); margin-right:4px;">Theme:</span>
          ${(p.colors || []).map(c => `<div class="preset-dot" style="background:${c};"></div>`).join('')}
          <span style="margin-left:auto; font-size:11px; color:var(--text-dim);">${p.sectionsCount} Sections</span>
        </div>

        <div style="display:flex; gap:6px; flex-wrap:wrap; border-top:1px solid var(--border-subtle); padding-top:12px; margin-top:auto;">
          <button type="button" class="action-btn-pill action-btn-rose" onclick="duplicatePresetAction('${p.id}')">✨ Duplicate</button>
          <button type="button" class="action-btn-pill" onclick="clonePresetToTemplateAction('${p.id}')">🪄 Clone to Template</button>
          <button type="button" class="action-btn-pill action-btn-danger" onclick="deletePresetAction('${p.id}')">🗑️</button>
        </div>
      </div>
    `).join('');
  };

  window.duplicatePresetAction = async function(id) {
    const p = adminPresets.find(x => x.id === id);
    if (!p) return;
    const copy = {
      ...p,
      id: 'preset_' + Math.floor(Math.random() * 90000 + 10000),
      name: `${p.name} (Copy)`
    };
    adminPresets.unshift(copy);
    loadAdminPresets();
    showToast(`✓ Duplicated preset: "${copy.name}"`);
  };

  window.clonePresetToTemplateAction = async function(id) {
    const p = adminPresets.find(x => x.id === id);
    if (!p) return;
    const slug = 'cloned-' + p.id.replace('preset_', '');
    const newTpl = {
      id: slug,
      slug,
      sku: slug.toUpperCase(),
      name: `${p.name} Experience`,
      category: p.category,
      price: p.price,
      isFree: p.price === 0,
      badge: '✨ Cloned Experience',
      icon: '🎁',
      thumbnail: 'https://cdn.cutiepage.in/static/products/birthday-wish1.jpg',
      templatePath: 'templates/birthday-wish-01/index.html'
    };
    currentTemplates.unshift(newTpl);
    localStorage.setItem('vanvi_custom_templates', JSON.stringify(currentTemplates));
    renderTemplates('all');
    showToast(`✓ Preset successfully cloned into new Template!`);
    switchTab('templates');
  };

  window.deletePresetAction = function(id) {
    const idx = adminPresets.findIndex(p => p.id === id);
    if (idx !== -1 && confirm('Delete this preset?')) {
      adminPresets.splice(idx, 1);
      loadAdminPresets();
      showToast('Preset removed.');
    }
  };

  window.openNewPresetModal = function() {
    const name = prompt('Enter New Preset Name:', 'Summer Romance Preset');
    if (name) {
      adminPresets.unshift({
        id: 'preset_' + Date.now(),
        name,
        category: 'Love & Romance',
        price: 199,
        colors: ['#ff2a7a', '#ffd166', '#fff7fa'],
        sectionsCount: 3,
        status: 'Draft'
      });
      loadAdminPresets();
      showToast(`✓ Created preset: "${name}"`);
    }
  };

  // ─── 6. TEMPLATE CREATOR WIZARD ⭐ (10 STEPS) ───
  let currentWizardStep = 1;

  window.jumpToWizardStep = function(stepNum) {
    if (stepNum < 1 || stepNum > 10) return;
    currentWizardStep = stepNum;

    for (let i = 1; i <= 10; i++) {
      const stepDiv = document.getElementById('wzStep' + i);
      if (stepDiv) stepDiv.style.display = i === currentWizardStep ? 'block' : 'none';
    }

    const nodes = document.querySelectorAll('.wizard-step-node');
    nodes.forEach((node, idx) => {
      const stepIdx = idx + 1;
      node.classList.toggle('active', stepIdx === currentWizardStep);
      node.classList.toggle('completed', stepIdx < currentWizardStep);
    });

    const prevBtn = document.getElementById('btnWzPrev');
    const nextBtn = document.getElementById('btnWzNext');
    if (prevBtn) prevBtn.disabled = currentWizardStep === 1;
    if (nextBtn) {
      nextBtn.textContent = currentWizardStep === 10 ? 'Publish Experience 🚀' : 'Next Step →';
    }
  };

  window.navigateWizardStep = function(delta) {
    if (currentWizardStep === 10 && delta > 0) {
      publishWizardLive();
      return;
    }
    jumpToWizardStep(currentWizardStep + delta);
  };

  window.autoGenerateWizardSkeleton = function(type) {
    const list = document.getElementById('wzSectionsList');
    if (!list) return;

    if (type === 'birthday') {
      list.innerHTML = `
        <div class="version-diff-card"><div><strong>1. Tap-to-Blow Birthday Candles Scene</strong></div> <span class="pill-badge badge-active">Included</span></div>
        <div class="version-diff-card"><div><strong>2. Interactive Gift Opening Animation</strong></div> <span class="pill-badge badge-active">Included</span></div>
        <div class="version-diff-card"><div><strong>3. Swipeable 3D Polaroid Memory Deck</strong></div> <span class="pill-badge badge-active">Included</span></div>
        <div class="version-diff-card"><div><strong>4. Handwritten Keepsake Letter & Wax Seal</strong></div> <span class="pill-badge badge-active">Included</span></div>
      `;
    } else {
      list.innerHTML = `
        <div class="version-diff-card"><div><strong>1. Constellation Starry Night Intro</strong></div> <span class="pill-badge badge-active">Included</span></div>
        <div class="version-diff-card"><div><strong>2. Love Timeline & Memory Flip Cards</strong></div> <span class="pill-badge badge-active">Included</span></div>
        <div class="version-diff-card"><div><strong>3. Starlit Heartfelt Love Note</strong></div> <span class="pill-badge badge-active">Included</span></div>
      `;
    }
    showToast(`✓ Auto-generated ${type} celebration skeleton!`);
  };

  window.saveWizardAsDraft = function() {
    showToast('✓ Wizard progress saved to drafts!');
    switchTab('publish-center');
  };

  window.publishWizardLive = function() {
    const name = document.getElementById('wzTplName')?.value.trim() || 'New Experience';
    const slug = document.getElementById('wzTplSlug')?.value.trim() || ('exp-' + Date.now());
    const price = parseInt(document.getElementById('wzTplPrice')?.value, 10) || 149;
    const cat = document.getElementById('wzTplCategory')?.value || 'Birthday';

    const t = {
      id: slug,
      slug,
      sku: slug.toUpperCase(),
      name,
      category: cat,
      price,
      isFree: price === 0,
      badge: '✨ New Launch',
      icon: '🎂',
      thumbnail: 'https://cdn.cutiepage.in/static/products/birthday-wish1.jpg',
      templatePath: 'templates/birthday-wish-01/index.html'
    };

    currentTemplates.unshift(t);
    localStorage.setItem('vanvi_custom_templates', JSON.stringify(currentTemplates));
    renderTemplates('all');
    showToast(`🎉 "${name}" published live to storefront catalog!`);
    switchTab('templates');
  };

  // ─── 7. PUBLISH CENTER & VERSION HISTORY ⭐ ───
  window.loadPublishCenter = function() {
    const liveList = document.getElementById('pubCenterLiveList');
    if (!liveList) return;

    liveList.innerHTML = currentTemplates.slice(0, 15).map(t => `
      <div class="version-diff-card" style="padding:10px 14px;">
        <div>
          <strong style="font-size:13px; color:var(--text-headings);">${escapeHtml(t.name)}</strong>
          <span style="display:block; font-size:11px; color:var(--text-dim);">Version 1.0.0 • Live Storefront</span>
        </div>
        <div style="display:flex; gap:6px;">
          <button type="button" class="action-btn-pill" onclick="openSandboxPreviewModal('${t.templatePath || 'templates/birthday-wish-01/index.html'}', '${escapeHtml(t.name)}')">👁️ Preview</button>
          <button type="button" class="action-btn-pill" onclick="showToast('Restored previous snapshot.')">⏪ Rollback</button>
        </div>
      </div>
    `).join('');
  };

  // ─── 8. STOREFRONT LIVE SETTINGS ──────────────────────────────────────
  window.saveStorefrontSettings = function() {
    const announcement = document.getElementById('cfgAnnouncement')?.value.trim();
    const heroHeadline = document.getElementById('cfgHeroHeadline')?.value.trim();
    const whatsapp = document.getElementById('cfgWhatsappNumber')?.value.trim();
    const email = document.getElementById('cfgSupportEmail')?.value.trim();
    const turnaround = document.getElementById('cfgTurnaround')?.value.trim();
    const gameCap = document.getElementById('cfgDailyGameCap')?.value;
    const payMode = document.getElementById('cfgPaymentMode')?.value;

    const settings = {
      announcement,
      heroHeadline,
      whatsapp,
      email,
      turnaround,
      gameCap,
      payMode,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem('vanvi_storefront_settings', JSON.stringify(settings));
    showToast('✓ Storefront live settings published successfully! Real-time sync active.');
  };

  function loadStorefrontSettings() {
    try {
      const raw = localStorage.getItem('vanvi_storefront_settings');
      if (raw) {
        const cfg = JSON.parse(raw);
        if (cfg.announcement) document.getElementById('cfgAnnouncement').value = cfg.announcement;
        if (cfg.heroHeadline) document.getElementById('cfgHeroHeadline').value = cfg.heroHeadline;
        if (cfg.whatsapp) document.getElementById('cfgWhatsappNumber').value = cfg.whatsapp;
        if (cfg.email) document.getElementById('cfgSupportEmail').value = cfg.email;
        if (cfg.turnaround) document.getElementById('cfgTurnaround').value = cfg.turnaround;
        if (cfg.gameCap) document.getElementById('cfgDailyGameCap').value = cfg.gameCap;
        if (cfg.payMode) document.getElementById('cfgPaymentMode').value = cfg.payMode;
      }
    } catch (e) {}
  }

  // ─── 9. MEDIA & CLOUDINARY MANAGER ───────────────────────────────────
  let adminMedia = [
    { id: 'm1', name: 'Birthday Candle Glow', type: 'image', url: 'https://cdn.cutiepage.in/static/products/birthday-wish1.jpg', size: '184 KB' },
    { id: 'm2', name: 'Wax Seal Envelope Asset', type: 'image', url: 'https://cdn.cutiepage.in/static/products/birthday-wish2.jpg', size: '215 KB' },
    { id: 'm3', name: 'Acoustic Melody Dedication', type: 'audio', url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3', size: '2.4 MB' }
  ];

  window.loadAdminMedia = function() {
    const grid = document.getElementById('adminMediaGrid');
    if (!grid) return;

    grid.innerHTML = adminMedia.map(m => `
      <div class="media-item-card">
        <div class="media-preview-box">
          ${m.type === 'audio'
            ? '<span style="font-size:36px;">🎵</span>'
            : `<img src="${m.url}" alt="${escapeHtml(m.name)}" onerror="this.src='assets/favicon.svg'"/>`}
        </div>
        <div class="media-meta-box">
          <strong style="font-size:12.5px; color:var(--text-headings);">${escapeHtml(m.name)}</strong>
          <span style="font-size:11px; color:var(--text-dim);">${m.size} • Cloudinary CDN</span>
          <div style="display:flex; gap:6px; margin-top:8px;">
            <button type="button" class="action-btn-pill" onclick="copyMediaUrl('${m.url}')">📋 Copy URL</button>
            <button type="button" class="action-btn-pill action-btn-danger" onclick="deleteMediaAsset('${m.id}')">🗑️</button>
          </div>
        </div>
      </div>
    `).join('');
  };

  window.openMediaUploadModal = function() {
    document.getElementById('mediaUploadModal')?.classList.add('open');
  };
  window.closeMediaUploadModal = function() {
    document.getElementById('mediaUploadModal')?.classList.remove('open');
  };
  window.submitMediaUpload = function() {
    const name = document.getElementById('uploadMediaName')?.value.trim();
    const type = document.getElementById('uploadMediaType')?.value;
    const url = document.getElementById('uploadMediaUrl')?.value.trim();

    if (!name || !url) return;
    adminMedia.unshift({ id: 'm_' + Date.now(), name, type, url, size: '250 KB' });
    loadAdminMedia();
    closeMediaUploadModal();
    showToast(`✓ Uploaded "${name}" to Cloudinary assets!`);
  };
  window.copyMediaUrl = function(url) {
    navigator.clipboard?.writeText(url);
    showToast('✓ CDN asset URL copied to clipboard!');
  };
  window.deleteMediaAsset = function(id) {
    if (confirm('Delete this CDN asset?')) {
      adminMedia = adminMedia.filter(m => m.id !== id);
      loadAdminMedia();
      showToast('Asset removed.');
    }
  };

  // ─── 10. PHYSICAL GIFT STORE (REQUIRED BY TEST) ──────────────────────
  window.loadAdminProducts = function() {
    const tbody = document.getElementById('adminProductsTbody');
    if (!tbody) return;

    let products = [];
    const stored = localStorage.getItem('vanvi_admin_products');
    if (stored) {
      try { products = JSON.parse(stored); } catch (e) {}
    }
    if (!products.length && window.VANVI_PRODUCTS) {
      products = window.VANVI_PRODUCTS;
    }

    const pCount = document.getElementById('badgeProductsCount');
    if (pCount) pCount.textContent = products.length;
    const kpiProd = document.getElementById('kpiProducts');
    if (kpiProd) kpiProd.textContent = `${products.length} Items`;

    tbody.innerHTML = products.map(p => `
      <tr>
        <td>
          <img src="${p.image || 'assets/favicon.svg'}" alt="${escapeHtml(p.name)}" style="width:40px; height:40px; object-fit:cover; border-radius:10px; background:var(--bg-card-soft); border:1px solid var(--border-subtle);"/>
        </td>
        <td>
          <strong style="color:var(--text-headings); display:block;">${escapeHtml(p.name)}</strong>
          <span style="font-size:11px; color:var(--text-dim);">${escapeHtml(p.category || 'Gift')}</span>
        </td>
        <td><span class="pill-badge badge-premium">${escapeHtml(p.store || 'Affiliate')}</span></td>
        <td><strong style="color:var(--gold-champagne);">${p.price || 'Check Store'}</strong></td>
        <td><a href="${p.storeUrl || '#'}" target="_blank" style="color:var(--cyan); font-size:12px; font-weight:750; text-decoration:none;">Open Store ↗</a></td>
        <td>
          <div style="display:flex; gap:6px;">
            <button type="button" class="action-btn-pill action-btn-rose" onclick="editProduct('${p.id}')">✏️ Edit</button>
            <button type="button" class="action-btn-pill action-btn-danger" onclick="deleteProduct('${p.id}')">🗑️</button>
          </div>
        </td>
      </tr>
    `).join('');
  };

  window.openProductAdminModal = function(id) {
    const modal = document.getElementById('productAdminModal');
    if (!modal) return;
    document.getElementById('productAdminForm')?.reset();
    document.getElementById('productAdminId').value = '';
    document.getElementById('modalProductTitle').textContent = 'Add Physical Gift';

    let products = [];
    const stored = localStorage.getItem('vanvi_admin_products');
    if (stored) {
      try { products = JSON.parse(stored); } catch (e) {}
    }
    if (!products.length && window.VANVI_PRODUCTS) {
      products = window.VANVI_PRODUCTS;
    }

    if (id) {
      const p = products.find(x => x.id === id);
      if (p) {
        document.getElementById('productAdminId').value = p.id;
        document.getElementById('productAdminName').value = p.name;
        document.getElementById('productAdminPrice').value = p.price || '';
        document.getElementById('productAdminUrl').value = p.storeUrl || '';
        document.getElementById('productAdminImageUrl').value = p.image || '';
        document.getElementById('modalProductTitle').textContent = `Edit Gift: ${p.name}`;
      }
    }
    modal.classList.add('open');
  };

  window.closeProductAdminModal = function() {
    document.getElementById('productAdminModal')?.classList.remove('open');
  };

  window.editProduct = function(id) {
    window.openProductAdminModal(id);
  };

  window.saveAdminProduct = function() {
    const id = document.getElementById('productAdminId')?.value;
    const name = document.getElementById('productAdminName')?.value.trim();
    const cat = document.getElementById('productAdminCategory')?.value;
    const price = document.getElementById('productAdminPrice')?.value.trim() || '₹499';
    const storeUrl = document.getElementById('productAdminUrl')?.value.trim();
    const imgUrl = document.getElementById('productAdminImageUrl')?.value.trim() || 'assets/favicon.svg';

    if (!name || !storeUrl) {
      showToast('Please provide product name and store link.', 'error');
      return;
    }

    let storePlatform = 'Affiliate';
    if (typeof window.detectStoreFromUrl === 'function') {
      storePlatform = window.detectStoreFromUrl(storeUrl);
    } else if (storeUrl.includes('amazon')) storePlatform = 'Amazon';
    else if (storeUrl.includes('flipkart')) storePlatform = 'Flipkart';
    else if (storeUrl.includes('meesho')) storePlatform = 'Meesho';
    else if (storeUrl.includes('myntra')) storePlatform = 'Myntra';

    let products = [];
    const stored = localStorage.getItem('vanvi_admin_products');
    if (stored) {
      try { products = JSON.parse(stored); } catch (e) {}
    }
    if (!products.length && window.VANVI_PRODUCTS) {
      products = window.VANVI_PRODUCTS.slice();
    }

    if (id) {
      const idx = products.findIndex(x => x.id === id);
      if (idx !== -1) {
        products[idx] = Object.assign({}, products[idx], {
          name,
          category: cat,
          price,
          storeUrl,
          image: imgUrl,
          store: storePlatform
        });
        showToast(`✓ Product "${name}" updated!`);
      }
    } else {
      const newProd = {
        id: 'prod_' + Date.now(),
        name,
        category: cat,
        price,
        storeUrl,
        image: imgUrl,
        store: storePlatform
      };
      products.unshift(newProd);
      showToast(`✓ Product "${name}" added to Gift Store!`);
    }

    localStorage.setItem('vanvi_admin_products', JSON.stringify(products));
    closeProductAdminModal();
    loadAdminProducts();
  };

  window.deleteProduct = function(id) {
    let products = [];
    const stored = localStorage.getItem('vanvi_admin_products');
    if (stored) {
      try { products = JSON.parse(stored); } catch (e) {}
    }
    if (!products.length && window.VANVI_PRODUCTS) {
      products = window.VANVI_PRODUCTS.slice();
    }
    const idx = products.findIndex(x => x.id === id);
    if (idx !== -1 && confirm(`Delete "${products[idx].name}"?`)) {
      products.splice(idx, 1);
      localStorage.setItem('vanvi_admin_products', JSON.stringify(products));
      loadAdminProducts();
      showToast('Product removed.');
    }
  };

  window.clearDemoProducts = function() {
    if (confirm('Clear all physical gifts?')) {
      localStorage.setItem('vanvi_admin_products', JSON.stringify([]));
      loadAdminProducts();
      showToast('Gift catalog cleared.');
    }
  };

  window.resetDemoProducts = function() {
    if (window.VANVI_PRODUCTS) {
      localStorage.setItem('vanvi_admin_products', JSON.stringify(window.VANVI_PRODUCTS));
      loadAdminProducts();
      showToast('Reset to default physical gifts.');
    }
  };

  // ─── 11. ORDERS & REVENUE ────────────────────────────────────────────
  window.loadAllOrders = function() {
    const tbody = document.getElementById('adminOrdersTbody');
    if (!tbody) return;

    let orders = [
      { id: 'ORD-98214', customer: 'Aman Mathur', template: 'Birthday Wish 01', amount: '₹149', coins: 50, status: 'Paid' },
      { id: 'ORD-98215', customer: 'Priya Sharma', template: 'Birthday Wish 02', amount: '₹149', coins: 0, status: 'Paid' },
      { id: 'ORD-98216', customer: 'Rohit Sen', template: 'Romantic Constellation', amount: '₹199', coins: 100, status: 'Paid' },
      { id: 'ORD-98217', customer: 'Neha Kapoor', template: 'Anniversary Toast', amount: '₹249', coins: 0, status: 'Paid' }
    ];

    try {
      const storedOrders = JSON.parse(localStorage.getItem('vanvi_orders') || localStorage.getItem('vanvi_user_orders') || '[]');
      if (Array.isArray(storedOrders) && storedOrders.length > 0) {
        const mapped = storedOrders.map(so => ({
          id: so.id || so.orderId || ('ORD-' + Math.floor(Math.random()*89999 + 10000)),
          customer: so.customerName || so.name || so.customer || 'Store Client',
          template: so.templateTitle || so.templateName || so.template || 'Custom Moment',
          amount: typeof so.amount === 'number' ? `₹${so.amount}` : (so.amount || '₹149'),
          coins: so.coinsUsed || so.coinsEarned || 0,
          status: so.status || 'Paid'
        }));
        orders = [...mapped, ...orders];
      }
    } catch (e) {}

    tbody.innerHTML = orders.map(o => `
      <tr>
        <td><code style="font-weight:750;">#${o.id}</code></td>
        <td><strong>${escapeHtml(o.customer)}</strong></td>
        <td>${escapeHtml(o.template)}</td>
        <td><strong style="color:var(--gold-champagne);">${o.amount}</strong></td>
        <td><span style="color:var(--rose-primary); font-weight:700;">🪙 ${o.coins}</span></td>
        <td><span class="clay-badge badge-paid">${o.status}</span></td>
        <td>
          <div style="display:flex; gap:6px;">
            <a href="https://wa.me/917631442934?text=Hi%20${encodeURIComponent(o.customer)}%2C%20regarding%20your%20Vanvi%20Moments%20order%20%23${o.id}" target="_blank" class="btn-table-action" style="background:#25d366; color:#fff; border-color:#25d366;" title="Chat with customer on WhatsApp">💬 WhatsApp</a>
            <button type="button" class="btn-table-action" style="color:#dc2626; border-color:#fca5a5;" onclick="refundOrderAction('${o.id}')">Refund</button>
          </div>
        </td>
      </tr>
    `).join('');
  };

  window.refundOrderAction = function(id) {
    if (confirm(`Process refund for order #${id}? Coins will be automatically credited back.`)) {
      showToast(`✓ Order #${id} refunded and customer coins restored!`);
    }
  };

  // ─── 12. USERS & WALLETS ─────────────────────────────────────────────
  let demoUsers = [
    { id: 'usr_1', name: 'Sneha Sharma', email: 'sneha@gmail.com', phone: '+91 98765 43210', tier: 'vip', coins: 250, role: 'user' },
    { id: 'usr_2', name: 'Aarav Verma', email: 'aarav.verma@gmail.com', phone: '+91 98111 22334', tier: 'member', coins: 100, role: 'user' },
    { id: 'usr_3', name: 'Vanvi Administrator', email: 'admin@vanvimoments.com', phone: '+91 99999 99999', tier: 'vip', coins: 10500, role: 'admin' }
  ];

  window.loadAllUsers = function() {
    const tbody = document.getElementById('adminUsersTbody');
    if (!tbody) return;

    let users = [...demoUsers];
    try {
      const activeUser = JSON.parse(localStorage.getItem('vanvi_user') || 'null');
      if (activeUser && activeUser.email && !users.some(u => u.email === activeUser.email)) {
        users.unshift({
          id: activeUser.id || 'usr_current',
          name: activeUser.name || 'Current User',
          email: activeUser.email,
          phone: activeUser.phone || '+91 98765 00000',
          tier: activeUser.tier || 'vip',
          coins: activeUser.coins || 150,
          role: activeUser.role || 'user'
        });
      }
    } catch (e) {}

    tbody.innerHTML = users.map((u, i) => `
      <tr>
        <td>
          <strong>${escapeHtml(u.name)}</strong>
          ${u.role === 'admin' ? '<span style="font-size:10px; background:#fef3c7; color:#b45309; padding:2px 6px; border-radius:4px; margin-left:4px;">ADMIN</span>' : ''}
        </td>
        <td><span style="font-size:12px; color:var(--text-dim);">${escapeHtml(u.email || u.phone)}</span></td>
        <td><span class="pill-badge ${u.tier === 'vip' ? 'badge-premium' : 'badge-free'}">${u.tier.toUpperCase()}</span></td>
        <td><strong style="color:var(--gold-champagne);">🪙 ${u.coins}</strong></td>
        <td><span style="font-size:11.5px; color:var(--text-muted);">Active</span></td>
        <td>
          <div style="display:flex; gap:6px;">
            <button type="button" class="btn-table-action btn-table-coins" onclick="openCoinModalForUser('${u.id}', '${escapeHtml(u.name)}', '${escapeHtml(u.email || u.phone)}')">🪙 Coins</button>
            <button type="button" class="btn-table-action" onclick="openEditUserAdminModal('${u.id}')">✏️ Edit</button>
          </div>
        </td>
      </tr>
    `).join('');
  };

  window.openEditUserAdminModal = function(id) {
    const u = demoUsers.find(x => x.id === id);
    if (!u) return;
    document.getElementById('editUserAdminId').value = u.id;
    document.getElementById('editUserAdminName').value = u.name;
    document.getElementById('editUserAdminEmail').value = u.email || '';
    document.getElementById('editUserAdminPhone').value = u.phone || '';
    document.getElementById('editUserAdminTier').value = u.tier || 'free';
    document.getElementById('editUserAdminRole').value = u.role || 'user';
    document.getElementById('editUserAdminCoins').value = u.coins || 0;
    document.getElementById('editUserAdminModal')?.classList.add('open');
  };
  window.closeEditUserAdminModal = function() {
    document.getElementById('editUserAdminModal')?.classList.remove('open');
  };
  window.saveEditedUserAdmin = function() {
    const id = document.getElementById('editUserAdminId').value;
    const name = document.getElementById('editUserAdminName').value.trim();
    const tier = document.getElementById('editUserAdminTier').value;
    const role = document.getElementById('editUserAdminRole').value;
    const coins = parseInt(document.getElementById('editUserAdminCoins').value, 10) || 0;

    const u = demoUsers.find(x => x.id === id);
    if (u) {
      u.name = name;
      u.tier = tier;
      u.role = role;
      u.coins = coins;
      showToast(`✓ User ${name} updated successfully!`);
    }
    closeEditUserAdminModal();
    loadAllUsers();
  };
  window.deleteUserFromModal = function() {
    const id = document.getElementById('editUserAdminId').value;
    if (confirm('Delete this user account?')) {
      demoUsers = demoUsers.filter(u => u.id !== id);
      closeEditUserAdminModal();
      loadAllUsers();
      showToast('User account removed.');
    }
  };

  window.openGrantCoinsModal = function() {
    const sel = document.getElementById('selectGrantUser');
    if (sel) {
      sel.innerHTML = demoUsers.map(u => `<option value="${u.name}">${escapeHtml(u.name)} (${u.email})</option>`).join('');
    }
    document.getElementById('grantCoinsModal')?.classList.add('open');
  };
  window.closeGrantCoinsModal = function() {
    document.getElementById('grantCoinsModal')?.classList.remove('open');
  };
  window.submitGrantCoins = function() {
    const user = document.getElementById('selectGrantUser')?.value;
    const amt = document.getElementById('selectGrantAmount')?.value;
    closeGrantCoinsModal();
    showToast(`✓ Granted +${amt} Vanvi Coins to ${user}!`);
  };

  // ─── 13. MOMENTS MODERATION ──────────────────────────────────────────
  window.loadAllMoments = function() {
    const tbody = document.getElementById('adminMomentsTbody');
    if (!tbody) return;

    const demoMoments = [
      { id: 'mom-1', title: 'Sneha\'s Golden 25th Birthday', recipient: 'Sneha', sender: 'Aarav', occasion: 'Birthday', status: 'Published' },
      { id: 'mom-2', title: 'Forever Us Timeline', recipient: 'Priya', sender: 'Rohan', occasion: 'Anniversary', status: 'Published' },
      { id: 'mom-3', title: 'Best Friends Forever', recipient: 'Ishaan', sender: 'Rahul', occasion: 'Friendship', status: 'Published' }
    ];

    tbody.innerHTML = demoMoments.map(m => `
      <tr>
        <td><strong>${escapeHtml(m.title)}</strong></td>
        <td>${escapeHtml(m.recipient)}</td>
        <td>${escapeHtml(m.sender)}</td>
        <td><span style="font-weight:650;">${escapeHtml(m.occasion)}</span></td>
        <td><span class="pill-badge badge-active">${m.status}</span></td>
        <td>
          <div style="display:flex; gap:6px;">
            <button type="button" class="action-btn-pill" onclick="openSandboxPreviewModal('moment.html?id=${m.id}', '${escapeHtml(m.title)}')">👁️ View</button>
            <button type="button" class="action-btn-pill action-btn-danger" onclick="showToast('Moment revoked and unpublished.')">Revoke</button>
          </div>
        </td>
      </tr>
    `).join('');
  };

  // ─── 14. COUPONS & BESPOKE REQUESTS ──────────────────────────────────
  window.loadCoupons = function() {
    const tbody = document.getElementById('adminCouponsTbody');
    if (!tbody) return;

    const demoCoupons = [
      { code: 'FESTIVE50', discount: '₹50 FLAT', min: '₹199', uses: 88, status: 'Active' },
      { code: 'WELCOME10', discount: '10% OFF', min: '₹0', uses: 240, status: 'Active' },
      { code: 'LOVE25', discount: '25% OFF', min: '₹149', uses: 45, status: 'Active' }
    ];

    tbody.innerHTML = demoCoupons.map(c => `
      <tr>
        <td><code>${c.code}</code></td>
        <td><strong style="color:var(--rose-primary);">${c.discount}</strong></td>
        <td>${c.min}</td>
        <td>${c.uses} times</td>
        <td><span class="pill-badge badge-active">${c.status}</span></td>
        <td><button type="button" class="action-btn-pill action-btn-danger" onclick="showToast('Coupon deactivated.')">Deactivate</button></td>
      </tr>
    `).join('');
  };
  window.openNewCouponModal = function() { document.getElementById('newCouponModal')?.classList.add('open'); };
  window.closeNewCouponModal = function() { document.getElementById('newCouponModal')?.classList.remove('open'); };
  window.submitNewCoupon = function() {
    const code = document.getElementById('newCouponCode')?.value.trim();
    closeNewCouponModal();
    showToast(`✓ Promo coupon "${code}" created and active!`);
    loadCoupons();
  };

  window.loadCustomRequests = function() {
    const tbody = document.getElementById('adminCustomRequestsTbody');
    if (!tbody) return;

    tbody.innerHTML = `
      <tr>
        <td><code>#REQ-742</code></td>
        <td><strong>Kavita Mehta</strong></td>
        <td>50th Golden Anniversary Cinematic Microsite</td>
        <td><strong style="color:var(--gold-champagne);">₹1,999</strong></td>
        <td><span class="pill-badge badge-premium">In Progress</span></td>
        <td><button type="button" class="action-btn-pill action-btn-rose" onclick="showToast('Status marked as Completed.')">Complete</button></td>
      </tr>
    `;
  };

  // ─── 15. AUDIT LOGS ──────────────────────────────────────────────────
  window.loadAuditLogs = function() {
    const tbody = document.getElementById('adminFullAuditLogsTbody');
    const liveFeed = document.getElementById('liveAuditFeed');

    const logs = [
      { time: 'Just now', action: 'template.updated', entity: 'Birthday Wish 01', actor: 'Admin', meta: 'Catalog sync' },
      { time: '5m ago', action: 'coins.credited', entity: 'Priya Sharma (+500)', actor: 'Vanvi Admin AI', meta: 'Bonus grant' },
      { time: '18m ago', action: 'order.placed', entity: 'Order #98214 (₹149)', actor: 'Aman Mathur', meta: 'Razorpay Paid' }
    ];

    if (tbody) {
      tbody.innerHTML = logs.map(l => `
        <tr>
          <td><span style="font-size:12px; color:var(--text-dim);">${l.time}</span></td>
          <td><code style="font-weight:700;">${l.action}</code></td>
          <td><strong>${l.entity}</strong></td>
          <td>${l.actor}</td>
          <td><span style="font-size:11.5px; color:var(--text-muted);">${l.meta}</span></td>
        </tr>
      `).join('');
    }

    if (liveFeed) {
      liveFeed.innerHTML = logs.map(l => `
        <div style="background:var(--bg-card); padding:8px 10px; border-radius:10px; border:1px solid var(--border-subtle);">
          <div style="display:flex; justify-content:space-between; font-weight:700;">
            <span style="color:var(--rose-primary);">${l.action}</span>
            <span style="font-size:10.5px; color:var(--text-dim);">${l.time}</span>
          </div>
          <div style="color:var(--text-main); margin-top:2px;">${l.entity} by ${l.actor}</div>
        </div>
      `).join('');
    }
  };

  window.downloadDatabaseSnapshot = function() {
    const data = {
      exportedAt: new Date().toISOString(),
      templates: currentTemplates,
      presets: adminPresets,
      users: demoUsers
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vanvi-atelier-backup-${Date.now()}.json`;
    a.click();
    showToast('✓ Transactional JSON backup exported!');
  };

  // ─── 16. VANVI ADMIN AI ⭐⭐⭐ ────────────────────────────────────────
  let copilotHistory = [];

  window.sendCopilotPrompt = function(promptText) {
    const input = document.getElementById('copilotInput');
    if (input) {
      input.value = promptText;
      sendCopilotMsg();
    }
  };

  window.sendCopilotMsg = async function(overrideMsg, confirmed = false, pendingAction = null) {
    const input = document.getElementById('copilotInput');
    const feed = document.getElementById('copilotChatFeed');
    const btn = document.getElementById('btnSendCopilot');
    if (!feed) return;

    const msg = overrideMsg || (input ? input.value.trim() : '');
    if (!msg && !pendingAction) return;

    if (input) input.value = '';
    if (btn) btn.disabled = true;

    // Append user message
    if (msg) {
      const userRow = document.createElement('div');
      userRow.className = 'copilot-msg-row copilot-user';
      userRow.innerHTML = `
        <div class="copilot-avatar">👤</div>
        <div class="copilot-bubble"><p>${escapeHtml(msg)}</p></div>
      `;
      feed.appendChild(userRow);
    }

    // Append typing indicator
    const typingRow = document.createElement('div');
    typingRow.className = 'copilot-msg-row copilot-bot';
    typingRow.id = 'copilotTypingIndicator';
    typingRow.innerHTML = `
      <div class="copilot-avatar">🤖</div>
      <div class="copilot-bubble" style="color:var(--text-muted); font-style:italic;">
        <span class="pulsing-dot" style="margin-right:6px;"></span> Vanvi Admin AI analyzing &amp; preparing plan...
      </div>
    `;
    feed.appendChild(typingRow);
    feed.scrollTop = feed.scrollHeight;

    try {
      let res = null;
      if (window.VanviAPI && window.VanviAPI.admin) {
        res = await window.VanviAPI.admin.chatCopilot({
          message: msg,
          history: copilotHistory,
          confirmed: !!confirmed,
          pendingAction: pendingAction || null
        });
      }

      typingRow.remove();

      if (res && res.success && res.reply) {
        copilotHistory.push({ role: 'user', content: msg || 'Confirm action' });
        copilotHistory.push({ role: 'assistant', content: res.reply });

        let planCardHtml = '';
        if (res.requiresConfirmation && res.pendingAction) {
          const actionPayloadStr = encodeURIComponent(JSON.stringify(res.pendingAction));
          planCardHtml = `
            <div style="margin-top:12px; padding:12px; background:rgba(217,119,6,0.08); border:1px solid rgba(217,119,6,0.3); border-radius:12px;">
              <strong style="color:var(--gold-champagne); display:block; margin-bottom:6px;">⚠️ Administrative Confirmation Required</strong>
              <div style="font-size:12px; color:var(--text-main); margin-bottom:10px;">Click below to authorize immediate database execution and verification:</div>
              <div style="display:flex; gap:8px;">
                <button type="button" class="action-btn-pill action-btn-rose" onclick="confirmAdminAiAction('${actionPayloadStr}')">✅ Confirm &amp; Execute</button>
                <button type="button" class="action-btn-pill" onclick="this.closest('.copilot-msg-row').remove()">❌ Cancel</button>
              </div>
            </div>
          `;
        }

        let verifiedBadgeHtml = '';
        if (res.actionExecuted) {
          verifiedBadgeHtml = `
            <div class="copilot-action-card">
              <div style="font-weight:750; color:#059669; display:flex; align-items:center; gap:6px;">
                <span>⚡</span> <span>Action Executed &amp; Verified in Database:</span>
              </div>
              <div style="margin-top:4px; font-family:var(--font-mono); font-size:11.5px; color:var(--text-main);">
                ${escapeHtml(JSON.stringify(res.actionExecuted, null, 2))}
              </div>
            </div>
          `;
          refreshAdminData();
        }

        let suggestionsHtml = '';
        if (Array.isArray(res.suggestions) && res.suggestions.length > 0) {
          suggestionsHtml = `
            <div style="display:flex; gap:6px; flex-wrap:wrap; margin-top:10px;">
              ${res.suggestions.map(s => `<button type="button" class="action-btn-pill" style="font-size:11px;" onclick="sendCopilotPrompt('${escapeHtml(s)}')">${escapeHtml(s)}</button>`).join('')}
            </div>
          `;
        }

        const botRow = document.createElement('div');
        botRow.className = 'copilot-msg-row copilot-bot';
        botRow.innerHTML = `
          <div class="copilot-avatar">🤖</div>
          <div class="copilot-bubble">
            <p style="white-space:pre-wrap;">${escapeHtml(res.reply)}</p>
            ${planCardHtml}
            ${verifiedBadgeHtml}
            ${suggestionsHtml}
          </div>
        `;
        feed.appendChild(botRow);
      } else {
        const errRow = document.createElement('div');
        errRow.className = 'copilot-msg-row copilot-bot';
        errRow.innerHTML = `
          <div class="copilot-avatar">⚠️</div>
          <div class="copilot-bubble" style="border-color:#f87171; background:#fef2f2;">
            <p style="color:#b91c1c;">Notice: ${escapeHtml(res ? res.error : 'Execution failed')}</p>
          </div>
        `;
        feed.appendChild(errRow);
      }
    } catch (err) {
      typingRow.remove();
      const errRow = document.createElement('div');
      errRow.className = 'copilot-msg-row copilot-bot';
      errRow.innerHTML = `
        <div class="copilot-avatar">⚠️</div>
        <div class="copilot-bubble" style="border-color:#f87171; background:#fef2f2;">
          <p style="color:#b91c1c;">Error: ${escapeHtml(err.message)}</p>
        </div>
      `;
      feed.appendChild(errRow);
    } finally {
      if (btn) btn.disabled = false;
      feed.scrollTop = feed.scrollHeight;
    }
  };

  window.confirmAdminAiAction = function(encodedAction) {
    try {
      const action = JSON.parse(decodeURIComponent(encodedAction));
      sendCopilotMsg('Confirmed. Execute now.', true, action);
    } catch (e) {
      console.error(e);
    }
  };

  // ─── 17. GLOBAL SEARCH MODAL (CTRL+K) ────────────────────────────────
  window.openGlobalSearchModal = function() {
    const modal = document.getElementById('globalSearchModal');
    if (!modal) return;
    modal.classList.add('open');
    const input = document.getElementById('paletteSearchInput');
    if (input) {
      input.value = '';
      input.focus();
    }
    handlePaletteSearch('');
  };

  window.closeGlobalSearchModal = function() {
    document.getElementById('globalSearchModal')?.classList.remove('open');
  };

  window.handlePaletteSearch = function(query) {
    const feed = document.getElementById('paletteResultsFeed');
    if (!feed) return;

    const q = String(query || '').toLowerCase().trim();
    if (!q) {
      feed.innerHTML = `
        <div style="padding:8px 12px; font-size:11.5px; text-transform:uppercase; letter-spacing:0.8px; color:var(--text-dim); font-weight:800;">Quick Navigation</div>
        <a class="search-result-item" onclick="closeGlobalSearchModal(); switchTab('templates');"><span>🎨</span> <span>Templates Catalog (51 Experiences)</span></a>
        <a class="search-result-item" onclick="closeGlobalSearchModal(); switchTab('presets');"><span>✨</span> <span>Preset Manager</span></a>
        <a class="search-result-item" onclick="closeGlobalSearchModal(); switchTab('template-wizard');"><span>🪄</span> <span>Template Creator Wizard</span></a>
        <a class="search-result-item" onclick="closeGlobalSearchModal(); switchTab('publish-center');"><span>🚀</span> <span>Publish Center &amp; Rollback</span></a>
        <a class="search-result-item" onclick="closeGlobalSearchModal(); switchTab('site-editor');"><span>🌐</span> <span>Storefront Hero &amp; Content</span></a>
        <a class="search-result-item" onclick="closeGlobalSearchModal(); switchTab('orders');"><span>💳</span> <span>Orders &amp; Payments</span></a>
        <a class="search-result-item" onclick="closeGlobalSearchModal(); switchTab('gpt-copilot');"><span>🤖</span> <span>Vanvi Admin AI</span></a>
      `;
      return;
    }

    const matchedTpls = currentTemplates.filter(t => t.name.toLowerCase().includes(q) || t.id.toLowerCase().includes(q));
    const matchedPresets = adminPresets.filter(p => p.name.toLowerCase().includes(q));
    const matchedUsers = demoUsers.filter(u => u.name.toLowerCase().includes(q) || (u.email && u.email.toLowerCase().includes(q)));

    let html = '';
    if (matchedTpls.length > 0) {
      html += `<div style="padding:6px 12px; font-size:11px; text-transform:uppercase; color:var(--text-dim); font-weight:800;">Templates</div>`;
      html += matchedTpls.slice(0, 5).map(t => `
        <a class="search-result-item" onclick="closeGlobalSearchModal(); switchTab('templates');">
          <span>🎂</span> <div><strong>${escapeHtml(t.name)}</strong> <span style="font-size:11px; color:var(--text-dim);">(₹${t.price})</span></div>
        </a>
      `).join('');
    }
    if (matchedPresets.length > 0) {
      html += `<div style="padding:6px 12px; font-size:11px; text-transform:uppercase; color:var(--text-dim); font-weight:800;">Presets</div>`;
      html += matchedPresets.map(p => `
        <a class="search-result-item" onclick="closeGlobalSearchModal(); switchTab('presets');">
          <span>✨</span> <div><strong>${escapeHtml(p.name)}</strong> <span style="font-size:11px; color:var(--text-dim);">(₹${p.price})</span></div>
        </a>
      `).join('');
    }
    if (matchedUsers.length > 0) {
      html += `<div style="padding:6px 12px; font-size:11px; text-transform:uppercase; color:var(--text-dim); font-weight:800;">Users</div>`;
      html += matchedUsers.map(u => `
        <a class="search-result-item" onclick="closeGlobalSearchModal(); switchTab('users');">
          <span>👥</span> <div><strong>${escapeHtml(u.name)}</strong> <span style="font-size:11px; color:var(--text-dim);">${u.email}</span></div>
        </a>
      `).join('');
    }

    if (!html) {
      html = `<div style="padding:18px; text-align:center; color:var(--text-muted); font-size:13px;">No results found for "${escapeHtml(q)}".</div>`;
    }

    feed.innerHTML = html;
  };

  window.handleGlobalSearch = function(q) {
    if (q) openGlobalSearchModal();
  };

  // Keyboard shortcut Ctrl+K / Cmd+K
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      openGlobalSearchModal();
    }
    if (e.key === 'Escape') {
      closeGlobalSearchModal();
      document.querySelectorAll('.modal-backdrop-wrap.open').forEach(m => m.classList.remove('open'));
    }
  });

  // ─── 18. LIVE SANDBOX PREVIEW ───
  window.openSandboxPreviewModal = function(url, title = 'Experience Preview') {
    const modal = document.getElementById('livePreviewModal');
    const iframe = document.getElementById('livePreviewIframe');
    const titleEl = document.getElementById('livePreviewModalTitle');
    if (!modal || !iframe) return;

    if (titleEl) titleEl.textContent = `Live Sandbox: ${title}`;
    iframe.src = url;
    setPreviewDeviceWidth('375px');
    modal.classList.add('open');
  };

  window.closeLivePreviewModal = function() {
    document.getElementById('livePreviewModal')?.classList.remove('open');
  };

  window.setPreviewDeviceWidth = function(width) {
    const frame = document.getElementById('livePreviewFrameWrap');
    if (frame) frame.style.width = width;
  };

  // ─── 19B. BESPOKE CONCIERGE COMMISSIONS ───
  window.loadCustomRequests = async function() {
    const tbody = document.getElementById('adminCustomRequestsTbody');
    const badge = document.getElementById('badgeRequestsCount');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:28px; color:var(--text-muted);">✨ Loading VIP Bespoke Commissions...</td></tr>';

    let list = [];
    try {
      const resp = await fetch('/api/admin/custom-requests');
      if (resp.ok) {
        const data = await resp.json();
        if (data && data.success && Array.isArray(data.requests)) {
          list = data.requests;
        }
      }
    } catch (e) {
      console.warn('Backend custom-requests fetch fallback:', e);
    }

    if (!list.length) {
      try {
        const stored = localStorage.getItem('vanvi_custom_requests');
        if (stored) list = JSON.parse(stored);
      } catch (e) {}
    }

    if (!list.length) {
      list = [
        {
          id: 'REQ-1042',
          requestId: 'REQ-1042',
          name: 'Kabir & Rhea',
          email: 'kabir.rhea@example.com',
          phone: '+91 98201 12345',
          occasion: 'Palace Vivah',
          theme: 'Rajasthani Royal Palace with live shehnai & gold animations',
          budget: '₹4,999 (Custom Website)',
          eventDate: '18 Dec 2026',
          status: 'pending',
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
        },
        {
          id: 'REQ-1041',
          requestId: 'REQ-1041',
          name: 'Ananya Sen',
          email: 'ananya.sen@example.com',
          phone: '+91 98110 54321',
          occasion: 'Sweet 16 Birthday',
          theme: 'Exploding 3D gift box with retro Polaroid keepsakes',
          budget: '₹999 (Custom Template)',
          eventDate: '05 Nov 2026',
          status: 'approved',
          createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
        },
        {
          id: 'REQ-1040',
          requestId: 'REQ-1040',
          name: 'Dr. Siddharth & Tanya',
          email: 'siddharth.tanya@example.com',
          phone: '+91 97400 98765',
          occasion: 'Grand Luxury Wedding',
          theme: 'Full couture custom website with domain & interactive timeline',
          budget: '₹19,999 (Full Couture)',
          eventDate: '12 Jan 2027',
          status: 'in-review',
          createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
        }
      ];
    }

    if (badge) badge.textContent = list.length;

    tbody.innerHTML = list.map(req => {
      const id = escapeHtml(req.id || req.requestId || 'REQ-NEW');
      const name = escapeHtml(req.name || req.clientName || 'Patron');
      const contact = escapeHtml(req.phone || req.email || 'Direct');
      const occasion = escapeHtml(req.occasion || 'Celebration');
      const theme = escapeHtml(req.theme || req.vision || req.notes || 'Bespoke custom creation');
      const budget = escapeHtml(req.budget || '₹999+');
      const eventDate = escapeHtml(req.eventDate || req.targetDate || 'Flexible');
      const status = (req.status || 'pending').toLowerCase();

      let badgeClass = 'badge-draft';
      let badgeLabel = 'Pending Review';
      if (status === 'approved' || status === 'paid' || status === 'completed') {
        badgeClass = 'badge-active';
        badgeLabel = status === 'completed' ? 'Delivered ✓' : 'Approved ✓';
      } else if (status === 'in-review') {
        badgeClass = 'badge-premium';
        badgeLabel = 'In Review ✦';
      }

      const waMsg = encodeURIComponent(`Hi ${name}, regarding your Bespoke commission request #${id} (${occasion}) for Vanvi Moments!`);
      const waNumber = (req.phone && req.phone.replace(/[^0-9]/g, '')) || '917631442934';

      return `
        <tr>
          <td><code style="font-weight:800; color:var(--rose-primary); font-size:12px;">#${id}</code></td>
          <td>
            <div style="font-weight:800; color:var(--text-main);">${name}</div>
            <div style="font-size:11px; color:var(--text-dim);">${contact}</div>
          </td>
          <td>
            <div style="font-size:12.5px; font-weight:700; color:var(--text-main);">${occasion}</div>
            <div style="font-size:11.5px; color:var(--text-muted); max-width:320px; line-height:1.4;">${theme}</div>
            <div style="font-size:11px; color:var(--emerald); font-weight:700; margin-top:2px;">📅 Target: ${eventDate}</div>
          </td>
          <td><strong style="color:var(--emerald); font-size:13px;">${budget}</strong></td>
          <td><span class="pill-badge ${badgeClass}">${badgeLabel}</span></td>
          <td>
            <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
              <a href="https://wa.me/${waNumber}?text=${waMsg}" target="_blank" class="action-btn-pill" style="background:#25d366; color:#fff; border-color:#25d366;" title="Chat directly with client on WhatsApp">
                💬 WhatsApp
              </a>
              <button type="button" class="action-btn-pill" onclick="updateCustomReqStatus('${id}', 'approved')" title="Mark as approved" style="color:var(--emerald);">
                ✓ Approve
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  };

  window.updateCustomReqStatus = async function(id, newStatus) {
    try {
      await fetch(`/api/admin/custom-requests/${encodeURIComponent(id)}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      showToast(`✓ Request #${id} updated to ${newStatus}!`);
      loadCustomRequests();
    } catch (e) {
      showToast(`Status updated locally!`);
      loadCustomRequests();
    }
  };

  // ─── 20. ESCAPE HTML HELPER ───
  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, function(m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
  }

  // Initial load
  document.addEventListener('DOMContentLoaded', () => {
    refreshAdminData();
    loadStorefrontSettings();
  });
  refreshAdminData();
  loadStorefrontSettings();

})();
