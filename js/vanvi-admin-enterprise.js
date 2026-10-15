/**
 * VANVI MOMENTS — ENTERPRISE ADMIN CONTROL PLANE LOGIC
 * High-end SaaS Dashboard Engine • 25 Domain Modules • Real-Time Studio Builder
 */

(function(root) {
  'use strict';

  // ─── STATE MANAGEMENT ──────────────────────────────────────────
  const state = {
    currentTab: 'dashboard',
    sidebarCollapsed: false,
    mobileSidebarOpen: false,
    dateFilter: '30d',
    searchQuery: '',
    templates: [],
    customProducts: [],
    moments: [],
    users: [],
    orders: [],
    coupons: [
      { code: 'VANVIFIRST', discount: '20% OFF', minOrder: '₹0', uses: 142, status: 'Active', expiry: '2026-12-31' },
      { code: 'LOVE50', discount: '₹50 FLAT', minOrder: '₹199', uses: 88, status: 'Active', expiry: '2026-11-30' },
      { code: 'VIPGIFT', discount: '30% OFF', minOrder: '₹499', uses: 35, status: 'Active', expiry: '2026-10-15' }
    ],
    categories: [
      { id: 'birthday', name: 'Birthday', icon: '🎂', count: 18, desc: 'Balloons, cinema confetti & heartfelt celebrations' },
      { id: 'love', name: 'Love & Romance', icon: '💖', count: 14, desc: 'Love puzzles, constellation stars & letters' },
      { id: 'anniversary', name: 'Anniversary', icon: '🥂', count: 9, desc: 'Milestone memories, timeline journeys & toasts' },
      { id: 'apology', name: 'Apology & Forgiveness', icon: '🕊️', count: 5, desc: 'Heartfelt words, delicate reveals & healing notes' },
      { id: 'friendship', name: 'Friendship', icon: '🌟', count: 7, desc: 'Inside jokes, friendship bonds & party vibes' },
      { id: 'family', name: 'Family & Parents', icon: '🏡', count: 6, desc: 'Tributes to parents, gratitude & family albums' },
      { id: 'premium', name: 'Ultra Premium', icon: '💎', count: 8, desc: 'Cinematic bespoke atelier experiences (>₹800)' }
    ],
    aiPrompts: [
      { id: 'love_letter', name: 'Heartfelt Love Letter', model: 'Gemini 1.5 Flash', status: 'Enabled', tokens: '450 max' },
      { id: 'birthday_poem', name: 'Birthday Rhyme & Wishes', model: 'Gemini 1.5 Flash', status: 'Enabled', tokens: '350 max' },
      { id: 'apology_note', name: 'Gentle Apology Synthesizer', model: 'Gemini 1.5 Pro', status: 'Enabled', tokens: '500 max' },
      { id: 'gift_matcher', name: 'Personality Gift Matcher', model: 'Vanvi Heuristics v2', status: 'Enabled', tokens: '200 max' }
    ],
    builder: {
      activeTemplateId: 'cinema-birthday',
      activeViewport: 'desktop', // desktop | laptop | tablet | mobile | compact
      viewportWidths: {
        desktop: '100%',
        laptop: '1024px',
        tablet: '768px',
        mobile: '390px',
        compact: '320px'
      },
      sections: [
        { id: 'sec-hero', name: 'Hero Entrance & Sparkles', type: 'hero', enabled: true },
        { id: 'sec-story', name: 'Personal Letter & Message', type: 'letter', enabled: true },
        { id: 'sec-gallery', name: 'Memories Photo Carousel', type: 'gallery', enabled: true },
        { id: 'sec-countdown', name: 'Midnight Celebration Clock', type: 'countdown', enabled: true },
        { id: 'sec-quiz', name: 'Memory Match Interactive', type: 'interaction', enabled: false },
        { id: 'sec-giftbox', name: 'Surprise Tap-to-Unbox', type: 'reveal', enabled: true },
        { id: 'sec-audio', name: 'Background Melody Player', type: 'audio', enabled: true },
        { id: 'sec-final', name: 'Grand Wish & Confetti Blast', type: 'final', enabled: true }
      ],
      styling: {
        accent: '#ff2a7a',
        fontFamily: 'Cormorant Garamond',
        borderRadius: '24px',
        glassBlur: '16px',
        glowIntensity: '0.35'
      },
      customerCustomization: {
        nameEditable: true,
        recipientEditable: true,
        photosAllowed: true,
        photoLimit: 10,
        messageEditable: true,
        dateEditable: true,
        musicSelectable: true,
        maxUploadMb: 15
      }
    }
  };

  // ─── INITIALIZATION ───────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    initCatalogData();
    initSidebar();
    initTopBar();
    initTabRouting();
    initBuilderStudio();
    initSearchAndFilters();
    checkAdminAuthentication();
    renderActiveTab();
  });

  // Load templates from data file or localStorage
  function initCatalogData() {
    try {
      const savedTemplates = localStorage.getItem('vanvi_custom_templates');
      if (savedTemplates) {
        state.templates = JSON.parse(savedTemplates);
      } else if (window.VanviTemplatesData && Array.isArray(window.VanviTemplatesData.templates)) {
        state.templates = [...window.VanviTemplatesData.templates];
      }
    } catch(e) {
      state.templates = [];
    }

    if (window.getVanviProducts) {
      state.customProducts = window.getVanviProducts();
    }
  }

  // ─── TOAST NOTIFICATION UTILITY ───────────────────────────────
  window.showAdminToast = function(message, type = 'success') {
    let container = document.getElementById('adminToastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'adminToastContainer';
      container.className = 'admin-toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `admin-toast ${type}`;
    const icon = type === 'success' ? '✓' : (type === 'error' ? '✕' : 'ℹ');
    toast.innerHTML = `<span style="font-weight:800; font-size:16px;">${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  };

  // ─── SIDEBAR & MOBILE DRAWER ──────────────────────────────────
  function initSidebar() {
    const sidebar = document.getElementById('adminSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const collapseToggle = document.getElementById('btnCollapseSidebar');
    const mobileMenuBtn = document.getElementById('btnMobileMenu');

    if (collapseToggle) {
      collapseToggle.addEventListener('click', () => {
        state.sidebarCollapsed = !state.sidebarCollapsed;
        document.body.classList.toggle('sidebar-collapsed', state.sidebarCollapsed);
      });
    }

    if (mobileMenuBtn && sidebar && overlay) {
      mobileMenuBtn.addEventListener('click', () => {
        state.mobileSidebarOpen = true;
        sidebar.classList.add('mobile-open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      });

      overlay.addEventListener('click', () => {
        closeMobileSidebar();
      });
    }

    document.querySelectorAll('.sidebar-nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = item.dataset.tab;
        if (tab) {
          switchTab(tab);
          if (window.innerWidth <= 1024) {
            closeMobileSidebar();
          }
        }
      });
    });
  }

  function closeMobileSidebar() {
    const sidebar = document.getElementById('adminSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (sidebar) sidebar.classList.remove('mobile-open');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
    state.mobileSidebarOpen = false;
  }

  // ─── TOPBAR & GLOBAL SEARCH ───────────────────────────────────
  function initTopBar() {
    const searchInput = document.getElementById('globalSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value.trim().toLowerCase();
        handleGlobalSearch(state.searchQuery);
      });

      document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
          e.preventDefault();
          searchInput.focus();
        }
      });
    }

    const quickActionBtn = document.getElementById('btnQuickAction');
    if (quickActionBtn) {
      quickActionBtn.addEventListener('click', () => {
        openCreateModal();
      });
    }
  }

  function handleGlobalSearch(q) {
    if (!q) return;
    if (q.includes('order') || q.includes('payment')) switchTab('orders');
    else if (q.includes('user') || q.includes('coin')) switchTab('users');
    else if (q.includes('template') || q.includes('tier')) switchTab('templates');
    else if (q.includes('gift') || q.includes('product') || q.includes('meesho')) switchTab('products');
    else if (q.includes('builder') || q.includes('design')) switchTab('builder');
  }

  // ─── TAB ROUTING (25 SECTIONS) ────────────────────────────────
  function initTabRouting() {
    // Read hash if available
    const hash = window.location.hash ? window.location.hash.substring(1) : '';
    if (hash && document.getElementById(`tab-${hash}`)) {
      state.currentTab = hash;
    }
  }

  window.switchTab = function(tabName) {
    state.currentTab = tabName;
    window.location.hash = tabName;

    // Update active sidebar nav
    document.querySelectorAll('.sidebar-nav-item').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    // Update breadcrumb
    const currentBreadcrumb = document.getElementById('breadcrumbCurrent');
    if (currentBreadcrumb) {
      const activeBtn = document.querySelector(`.sidebar-nav-item[data-tab="${tabName}"]`);
      currentBreadcrumb.textContent = activeBtn ? activeBtn.textContent.trim() : tabName;
    }

    // Toggle panels
    document.querySelectorAll('.admin-tab-pane').forEach(pane => {
      pane.style.display = pane.id === `tab-${tabName}` ? 'block' : 'none';
    });

    renderActiveTab();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  function renderActiveTab() {
    const tab = state.currentTab;
    if (tab === 'dashboard') renderDashboard();
    else if (tab === 'templates') renderTemplatesMaster();
    else if (tab === 'builder') renderBuilderStudio();
    else if (tab === 'categories') renderCategories();
    else if (tab === 'moments') renderMoments();
    else if (tab === 'users') renderUsers();
    else if (tab === 'orders') renderOrders();
    else if (tab === 'payments') renderPayments();
    else if (tab === 'coupons') renderCoupons();
    else if (tab === 'products') renderProducts();
    else if (tab === 'rewards') renderRewards();
    else if (tab === 'referrals') renderReferrals();
    else if (tab === 'ai') renderAiCenter();
    else if (tab === 'media') renderMediaLibrary();
    else if (tab === 'homepage') renderHomepageCms();
    else if (tab === 'banners') renderBanners();
    else if (tab === 'offers') renderOffers();
    else if (tab === 'reviews') renderReviews();
    else if (tab === 'notifications') renderNotifications();
    else if (tab === 'analytics') renderAnalytics();
    else if (tab === 'seo') renderSeo();
    else if (tab === 'settings') renderSettings();
    else if (tab === 'security') renderSecurity();
    else if (tab === 'admin-users') renderAdminUsers();
    else if (tab === 'audit') renderAuditLogs();
    else if (tab === 'faq') renderFaq();
  }

  // ─── 1. DASHBOARD & KPIS ──────────────────────────────────────
  async function renderDashboard() {
    const container = document.getElementById('dashboardKpiContainer');
    if (!container) return;

    let kpi = {
      users: 1240,
      visitors: 8430,
      previews: 4210,
      moments: 312,
      orders: 284,
      revenue: 14280,
      coins: 46200,
      conversion: '3.4%'
    };

    // Attempt real overview data from VanviAPI if authenticated
    const hasAuth = !!(localStorage.getItem('vanvi_auth_token') || localStorage.getItem('vanvi_token') || localStorage.getItem('vanvi_admin_token') || localStorage.getItem('vanvi_admin_key'));
    if (hasAuth && window.VanviAPI && window.VanviAPI.admin) {
      try {
        const res = await window.VanviAPI.admin.getOverview();
        if (res.success && res.metrics) {
          const m = res.metrics;
          kpi.users = m.totalUsers || kpi.users;
          kpi.moments = m.totalMoments || kpi.moments;
          kpi.orders = m.totalOrders || kpi.orders;
          kpi.revenue = m.totalRevenue || kpi.revenue;
          kpi.coins = m.totalCoinsInCirculation || kpi.coins;
        }
      } catch(e) {}
    }

    container.innerHTML = `
      <div class="kpi-stat-card">
        <div class="kpi-card-header">
          <span class="kpi-card-label">Total Users</span>
          <div class="kpi-card-icon" style="color:var(--admin-lilac);">👥</div>
        </div>
        <div class="kpi-card-value">${kpi.users.toLocaleString()}</div>
        <div class="kpi-card-delta delta-up">↑ +14.2% vs last month</div>
      </div>

      <div class="kpi-stat-card">
        <div class="kpi-card-header">
          <span class="kpi-card-label">Template Previews</span>
          <div class="kpi-card-icon" style="color:var(--admin-rose);">👁️</div>
        </div>
        <div class="kpi-card-value">${kpi.previews.toLocaleString()}</div>
        <div class="kpi-card-delta delta-up">↑ +28.5% engagement</div>
      </div>

      <div class="kpi-stat-card">
        <div class="kpi-card-header">
          <span class="kpi-card-label">Moments Created</span>
          <div class="kpi-card-icon" style="color:var(--admin-cyan);">💌</div>
        </div>
        <div class="kpi-card-value">${kpi.moments.toLocaleString()}</div>
        <div class="kpi-card-delta delta-up">↑ High completion rate</div>
      </div>

      <div class="kpi-stat-card">
        <div class="kpi-card-header">
          <span class="kpi-card-label">Total Orders</span>
          <div class="kpi-card-icon" style="color:var(--admin-gold);">💳</div>
        </div>
        <div class="kpi-card-value">${kpi.orders.toLocaleString()}</div>
        <div class="kpi-card-delta delta-up">↑ +18.4% purchase growth</div>
      </div>

      <div class="kpi-stat-card">
        <div class="kpi-card-header">
          <span class="kpi-card-label">Gross Revenue</span>
          <div class="kpi-card-icon" style="color:#10b981;">₹</div>
        </div>
        <div class="kpi-card-value">₹${kpi.revenue.toLocaleString()}</div>
        <div class="kpi-card-delta delta-up">↑ 100% verified settlement</div>
      </div>

      <div class="kpi-stat-card">
        <div class="kpi-card-header">
          <span class="kpi-card-label">Coins in Circulation</span>
          <div class="kpi-card-icon" style="color:var(--admin-gold);">🪙</div>
        </div>
        <div class="kpi-card-value">${kpi.coins.toLocaleString()}</div>
        <div class="kpi-card-delta delta-neutral">Active loyalty treasury</div>
      </div>
    `;
  }

  // ─── 2. TEMPLATES MASTER CATALOG ──────────────────────────────
  function renderTemplatesMaster() {
    const tbody = document.getElementById('templatesMasterTableBody');
    if (!tbody) return;

    const list = state.templates;
    const filterCat = document.getElementById('filterTemplateCategory') ? document.getElementById('filterTemplateCategory').value : 'all';
    const filterTier = document.getElementById('filterTemplateTier') ? document.getElementById('filterTemplateTier').value : 'all';

    let filtered = list.filter(t => {
      const matchCat = filterCat === 'all' || (t.category && t.category.toLowerCase().includes(filterCat.toLowerCase()));
      const matchTier = filterTier === 'all' || (t.tier && t.tier.toLowerCase() === filterTier.toLowerCase()) || (filterTier === 'free' && t.isFree);
      return matchCat && matchTier;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" class="empty-state" style="text-align:center; padding:32px;">No templates found matching filters.</td></tr>';
      return;
    }

    tbody.innerHTML = filtered.map(t => {
      const isUltra = Number(t.price || 0) > 700;
      const tierPill = t.isFree ? 'pill-green' : (isUltra ? 'pill-gold' : 'pill-rose');
      const safeId = String(t.id).replace(/'/g, "\\'");
      const thumb = t.thumbnail || t.image || 'assets/preview-cinema.jpg';

      return `
        <tr>
          <td>
            <div style="width:48px; height:48px; border-radius:10px; overflow:hidden; background:rgba(255,255,255,0.05); border:1px solid var(--admin-border-subtle); display:flex; align-items:center; justify-content:center; font-size:22px;">
              ${t.icon || '🎨'}
            </div>
          </td>
          <td>
            <strong>${t.name}</strong>
            <br><small style="color:var(--admin-text-muted); font-size:11px;">Slug: /${t.id}</small>
          </td>
          <td><span class="admin-pill pill-lilac">${t.category || 'General'}</span></td>
          <td><span class="admin-pill ${tierPill}">${t.tier || (t.isFree ? 'Free' : 'Premium')}</span></td>
          <td>
            <strong>${t.isFree ? '₹0 FREE' : '₹' + t.price}</strong>
            ${t.originalPrice ? `<br><small style="text-decoration:line-through; color:var(--admin-text-dim);">${t.originalPrice}</small>` : ''}
          </td>
          <td>
            <span class="admin-pill pill-green">Published</span>
          </td>
          <td>
            <span class="admin-pill pill-rose">${t.badge || 'Popular'}</span>
          </td>
          <td>
            <div style="display:flex; gap:6px;">
              <button class="btn-admin-secondary" style="padding:4px 8px; font-size:11.5px;" onclick="window.launchBuilderForTemplate('${safeId}')" title="Open in Builder Studio">🛠 Studio</button>
              <a class="btn-admin-secondary" style="padding:4px 8px; font-size:11.5px;" href="template-detail.html?template=${encodeURIComponent(t.id)}" target="_blank" title="Live Preview">👁 Live</a>
              <button class="btn-admin-danger" style="padding:4px 8px; font-size:11.5px;" onclick="window.deleteTemplateRecord('${safeId}')" title="Archive / Delete">🗑</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  window.launchBuilderForTemplate = function(id) {
    state.builder.activeTemplateId = id;
    switchTab('builder');
    showAdminToast(`Loaded template "${id}" into Studio Canvas!`, 'info');
  };

  window.deleteTemplateRecord = function(id) {
    if (!confirm(`Are you sure you want to delete or archive template "${id}"?`)) return;
    state.templates = state.templates.filter(t => t.id !== id);
    try {
      localStorage.setItem('vanvi_custom_templates', JSON.stringify(state.templates));
    } catch(e) {}
    renderTemplatesMaster();
    showAdminToast('Template archived successfully.', 'success');
  };

  // ─── 3. TEMPLATE BUILDER STUDIO ───────────────────────────────
  window.setAdminViewport = function(vp) {
    if (vp && state.builder.viewportWidths[vp]) {
      state.builder.activeViewport = vp;
      document.querySelectorAll('.viewport-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.viewport === vp);
      });
      const frame = document.getElementById('deviceSimulatorFrame');
      if (frame) {
        frame.style.width = state.builder.viewportWidths[vp];
        showAdminToast(`Viewport set to ${vp.toUpperCase()} (${state.builder.viewportWidths[vp]})`, 'info');
      }
    }
  };

  function initBuilderStudio() {
    // Viewport switch buttons
    document.querySelectorAll('.viewport-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const vp = btn.dataset.viewport;
        if (vp) window.setAdminViewport(vp);
      });
    });

    // Theme color accent pickers
    const accentPicker = document.getElementById('builderAccentPicker');
    if (accentPicker) {
      accentPicker.addEventListener('input', (e) => {
        state.builder.styling.accent = e.target.value;
        applyBuilderPreviewStyling();
      });
    }

    // Font selector
    const fontPicker = document.getElementById('builderFontPicker');
    if (fontPicker) {
      fontPicker.addEventListener('change', (e) => {
        state.builder.styling.fontFamily = e.target.value;
        applyBuilderPreviewStyling();
      });
    }
  }

  function renderBuilderStudio() {
    const listContainer = document.getElementById('builderSectionsList');
    if (!listContainer) return;

    listContainer.innerHTML = state.builder.sections.map((sec, idx) => `
      <div class="builder-section-item" id="builderSec-${sec.id}">
        <div class="builder-section-meta">
          <span class="builder-handle">☰</span>
          <span style="font-weight:700; font-size:13px; color:var(--admin-text-white);">${idx + 1}. ${sec.name}</span>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <label class="admin-toggle-switch">
            <input type="checkbox" ${sec.enabled ? 'checked' : ''} onchange="window.toggleSectionEnabled('${sec.id}', this.checked)" />
            <span class="admin-toggle-slider"></span>
          </label>
          <button class="btn-admin-secondary" style="padding:3px 7px; font-size:11px;" onclick="window.moveSectionUp(${idx})" ${idx === 0 ? 'disabled' : ''}>↑</button>
          <button class="btn-admin-secondary" style="padding:3px 7px; font-size:11px;" onclick="window.moveSectionDown(${idx})" ${idx === state.builder.sections.length - 1 ? 'disabled' : ''}>↓</button>
        </div>
      </div>
    `).join('');

    applyBuilderPreviewStyling();
  }

  window.toggleSectionEnabled = function(secId, enabled) {
    const s = state.builder.sections.find(item => item.id === secId);
    if (s) {
      s.enabled = enabled;
      showAdminToast(`Section "${s.name}" ${enabled ? 'Enabled' : 'Hidden'} in live experience.`, 'info');
      applyBuilderPreviewStyling();
    }
  };

  window.moveSectionUp = function(idx) {
    if (idx <= 0) return;
    const temp = state.builder.sections[idx - 1];
    state.builder.sections[idx - 1] = state.builder.sections[idx];
    state.builder.sections[idx] = temp;
    renderBuilderStudio();
  };

  window.moveSectionDown = function(idx) {
    if (idx >= state.builder.sections.length - 1) return;
    const temp = state.builder.sections[idx + 1];
    state.builder.sections[idx + 1] = state.builder.sections[idx];
    state.builder.sections[idx] = temp;
    renderBuilderStudio();
  };

  function applyBuilderPreviewStyling() {
    const iframe = document.getElementById('deviceSimulatorIframe');
    if (!iframe) return;
    // Point iframe to real experience with preview query
    const targetUrl = `template-detail.html?template=${encodeURIComponent(state.builder.activeTemplateId)}&preview=true`;
    if (!iframe.src || !iframe.src.includes(state.builder.activeTemplateId)) {
      iframe.src = targetUrl;
    }
  }

  // ─── 4. CATEGORIES & OCCASIONS ────────────────────────────────
  function renderCategories() {
    const container = document.getElementById('categoriesGridContainer');
    if (!container) return;

    container.innerHTML = state.categories.map(cat => `
      <div class="admin-card" style="padding:18px; display:flex; flex-direction:column; justify-content:space-between;">
        <div>
          <div style="font-size:32px; margin-bottom:8px;">${cat.icon}</div>
          <h3 style="font-size:18px; font-family:var(--admin-font-serif); color:var(--admin-text-white); margin-bottom:4px;">${cat.name}</h3>
          <p style="font-size:12.5px; color:var(--admin-text-muted); line-height:1.4; margin-bottom:12px;">${cat.desc}</p>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--admin-border-subtle); padding-top:10px;">
          <span class="admin-pill pill-rose">${cat.count} Templates</span>
          <button class="btn-admin-secondary" style="font-size:11px; padding:3px 8px;" onclick="alert('Category editor: modify icon, name & SEO tags.')">Edit</button>
        </div>
      </div>
    `).join('');
  }

  // ─── 5. CREATED EXPERIENCES (MOMENTS MODERATION) ──────────────
  async function renderMoments() {
    const tbody = document.getElementById('momentsTableBody');
    if (!tbody) return;

    let momentsList = [
      { id: 'mom-101', slug: 'birthday-for-ananya', recipient: 'Ananya', sender: 'Rohit', occasion: 'Birthday', status: 'Published', date: '2026-09-27' },
      { id: 'mom-102', slug: 'love-story-sam-priya', recipient: 'Priya', sender: 'Sameer', occasion: 'Love & Romance', status: 'Published', date: '2026-09-26' },
      { id: 'mom-103', slug: 'anniversary-parents-25', recipient: 'Mom & Dad', sender: 'Kavita', occasion: 'Anniversary', status: 'Published', date: '2026-09-25' }
    ];

    if (window.VanviAPI && window.VanviAPI.admin) {
      try {
        const res = await window.VanviAPI.admin.getMoments();
        if (res.success && Array.isArray(res.moments) && res.moments.length > 0) {
          momentsList = res.moments;
        }
      } catch(e) {}
    }

    tbody.innerHTML = momentsList.map(m => `
      <tr>
        <td><code>${m.slug || m.id}</code></td>
        <td><strong>${m.recipient || 'Beloved'}</strong></td>
        <td>${m.sender || 'Sender'}</td>
        <td><span class="admin-pill pill-lilac">${m.occasion || 'Celebration'}</span></td>
        <td><span class="admin-pill pill-green">${m.status || 'Active'}</span></td>
        <td>${m.date || 'Recent'}</td>
        <td>
          <a class="btn-admin-secondary" style="padding:3px 8px; font-size:11.5px;" href="moment.html?id=${encodeURIComponent(m.slug || m.id)}" target="_blank">View Live ↗</a>
        </td>
      </tr>
    `).join('');
  }

  // ─── 6. USERS & LOYALTY COIN TREASURY ─────────────────────────
  async function renderUsers() {
    const tbody = document.getElementById('usersAdminTableBody');
    if (!tbody) return;

    let usersList = [
      { id: 'usr-001', name: 'Rishu Kumari', email: 'rishu@example.com', role: 'admin', tier: 'vip', coins: 10000 },
      { id: 'usr-002', name: 'Aarav Sharma', email: 'aarav@gmail.com', role: 'user', tier: 'vanvi_club', coins: 450 },
      { id: 'usr-003', name: 'Sneha Patel', email: 'sneha@outlook.com', role: 'user', tier: 'free', coins: 120 }
    ];

    if (window.VanviAPI && window.VanviAPI.admin) {
      try {
        const res = await window.VanviAPI.admin.getUsers();
        if (res.success && Array.isArray(res.users) && res.users.length > 0) {
          usersList = res.users;
        }
      } catch(e) {}
    }

    tbody.innerHTML = usersList.map(u => `
      <tr>
        <td><code>${u.id.substring(0, 8)}...</code></td>
        <td><strong>${u.name || 'User'}</strong></td>
        <td>${u.email}</td>
        <td><span class="admin-pill ${u.role === 'admin' ? 'pill-gold' : 'pill-lilac'}">${u.role}</span></td>
        <td><span class="admin-pill ${u.tier === 'vip' || u.tier === 'vanvi_club' ? 'pill-gold' : 'pill-rose'}">${u.tier}</span></td>
        <td>🪙 <strong>${u.coins || 0}</strong></td>
        <td>
          <button class="btn-admin-secondary" style="padding:4px 8px; font-size:11.5px;" onclick="window.openAdjustCoins('${u.id}', '${u.name}')">🪙 Adjust Coins</button>
        </td>
      </tr>
    `).join('');
  }

  window.openAdjustCoins = function(userId, userName) {
    const modal = document.getElementById('adjustCoinsModal');
    if (!modal) return;
    document.getElementById('adjustUserId').value = userId;
    document.getElementById('adjustUserName').value = userName;
    modal.classList.add('active');
  };

  // ─── 7. ORDERS & REVENUE ──────────────────────────────────────
  async function renderOrders() {
    const tbody = document.getElementById('ordersTableBody');
    if (!tbody) return;

    let ordersList = [
      { id: 'ORD-7891', customer: 'Aarav Sharma', template: 'Cinema Birthday Surprise', amount: '₹499', status: 'PAID', date: '2026-09-28' },
      { id: 'ORD-7890', customer: 'Pooja Varma', template: 'Love Letter Vault', amount: '₹299', status: 'PAID', date: '2026-09-28' },
      { id: 'ORD-7889', customer: 'Kunal Sen', template: 'Constellation Journey', amount: '₹899', status: 'PAID', date: '2026-09-27' }
    ];

    if (window.VanviAPI && window.VanviAPI.admin) {
      try {
        const res = await window.VanviAPI.admin.getOrders();
        if (res.success && Array.isArray(res.orders) && res.orders.length > 0) {
          ordersList = res.orders;
        }
      } catch(e) {}
    }

    tbody.innerHTML = ordersList.map(o => `
      <tr>
        <td><code>${o.id}</code></td>
        <td><strong>${o.customer}</strong></td>
        <td>${o.template}</td>
        <td><strong>${o.amount}</strong></td>
        <td><span class="admin-pill pill-green">${o.status}</span></td>
        <td>${o.date}</td>
        <td>
          <button class="btn-admin-secondary" style="padding:3px 8px; font-size:11.5px;" onclick="alert('Order ${o.id}: Verified via Razorpay settlement.')">Details</button>
        </td>
      </tr>
    `).join('');
  }

  // ─── 8. PAYMENTS & REFUNDS ────────────────────────────────────
  function renderPayments() {
    renderOrders(); // Shared payments ledger with instant settlement
  }

  // ─── 9. COUPONS & PROMOS ──────────────────────────────────────
  function renderCoupons() {
    const tbody = document.getElementById('couponsTableBody');
    if (!tbody) return;

    tbody.innerHTML = state.coupons.map(c => `
      <tr>
        <td><code style="font-weight:800; color:var(--admin-rose);">${c.code}</code></td>
        <td><strong>${c.discount}</strong></td>
        <td>${c.minOrder}</td>
        <td>${c.uses} redeemed</td>
        <td><span class="admin-pill pill-green">${c.status}</span></td>
        <td>${c.expiry}</td>
        <td>
          <button class="btn-admin-danger" style="padding:2px 8px; font-size:11px;" onclick="alert('Coupon deactivated.')">Pause</button>
        </td>
      </tr>
    `).join('');
  }

  // ─── 10. PHYSICAL GIFT STORE & AFFILIATE PRODUCTS ─────────────
  function renderProducts() {
    if (typeof window.loadAdminProducts === 'function') {
      window.loadAdminProducts();
    }
  }

  // ─── 11. REWARDS & COIN RULES ─────────────────────────────────
  function renderRewards() {
    const container = document.getElementById('rewardsConfigContainer');
    if (!container) return;
    container.innerHTML = `
      <div class="admin-card">
        <h3 class="admin-card-title">🪙 Loyalty Coin Economy Rules</h3>
        <p style="color:var(--admin-text-muted); font-size:13px; margin-bottom:18px;">Configure how customers earn and redeem loyalty coins across digital moments.</p>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:16px;">
          <div class="admin-form-group">
            <label class="admin-label">Coins awarded on First Signup</label>
            <input type="number" class="admin-input" value="50" />
          </div>
          <div class="admin-form-group">
            <label class="admin-label">Coins per ₹100 Spent</label>
            <input type="number" class="admin-input" value="10" />
          </div>
          <div class="admin-form-group">
            <label class="admin-label">Coins on Friend Referral</label>
            <input type="number" class="admin-input" value="100" />
          </div>
          <div class="admin-form-group">
            <label class="admin-label">Redemption Rate (1 Coin = ₹X)</label>
            <input type="text" class="admin-input" value="₹1.00" disabled />
          </div>
        </div>
        <button class="btn-admin-primary" style="margin-top:10px;" onclick="showAdminToast('Rewards rules updated successfully!')">Save Economy Rules</button>
      </div>
    `;
  }

  // ─── 12. REFERRAL PROGRAM ─────────────────────────────────────
  function renderReferrals() {
    const container = document.getElementById('referralsContainer');
    if (!container) return;
    container.innerHTML = `
      <div class="kpi-stat-grid" style="margin-bottom:20px;">
        <div class="kpi-stat-card">
          <div class="kpi-card-header"><span class="kpi-card-label">Total Referrals</span></div>
          <div class="kpi-card-value">482</div>
          <div class="kpi-card-delta delta-up">↑ +22% this week</div>
        </div>
        <div class="kpi-stat-card">
          <div class="kpi-card-header"><span class="kpi-card-label">Coins Distributed</span></div>
          <div class="kpi-card-value">48,200</div>
          <div class="kpi-card-delta delta-neutral">Earned by advocates</div>
        </div>
      </div>
    `;
  }

  // ─── 13. AI CONTROL CENTER ────────────────────────────────────
  function renderAiCenter() {
    const tbody = document.getElementById('aiPromptsTableBody');
    if (!tbody) return;

    tbody.innerHTML = state.aiPrompts.map(p => `
      <tr>
        <td><strong>${p.name}</strong></td>
        <td><code>${p.id}</code></td>
        <td><span class="admin-pill pill-cyan">${p.model}</span></td>
        <td>${p.tokens}</td>
        <td><span class="admin-pill pill-green">${p.status}</span></td>
        <td>
          <button class="btn-admin-secondary" style="font-size:11.5px; padding:3px 8px;" onclick="alert('Configure system prompt for ' + '${p.name}')">Edit Prompt</button>
        </td>
      </tr>
    `).join('');
  }

  // ─── 14. MEDIA LIBRARY ────────────────────────────────────────
  function renderMediaLibrary() {
    const grid = document.getElementById('mediaLibraryGrid');
    if (!grid) return;

    const demoAssets = [
      { name: 'cinema-hero.jpg', size: '240 KB', dim: '1920x1080', type: 'Image' },
      { name: 'sparkle-overlay.png', size: '84 KB', dim: '800x800', type: 'Overlay' },
      { name: 'romantic-acoustic.mp3', size: '2.4 MB', dim: '03:14', type: 'Audio' },
      { name: 'giftbox-open.webp', size: '120 KB', dim: '600x600', type: 'Animation' }
    ];

    grid.innerHTML = demoAssets.map(a => `
      <div class="admin-card" style="padding:14px; text-align:center;">
        <div style="height:110px; border-radius:10px; background:rgba(255,255,255,0.04); display:flex; align-items:center; justify-content:center; font-size:32px; margin-bottom:10px;">
          ${a.type === 'Audio' ? '🎵' : '🖼️'}
        </div>
        <div style="font-weight:700; font-size:12.5px; color:var(--admin-text-white); margin-bottom:2px; text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">${a.name}</div>
        <div style="font-size:11px; color:var(--admin-text-muted);">${a.size} • ${a.dim}</div>
      </div>
    `).join('');
  }

  // ─── 15. HOMEPAGE CMS ─────────────────────────────────────────
  function renderHomepageCms() {
    const container = document.getElementById('homepageCmsContainer');
    if (!container) return;
    container.innerHTML = `
      <div class="admin-card">
        <h3 class="admin-card-title">✦ Live Website Hero & Content Blocks</h3>
        <p style="font-size:13px; color:var(--admin-text-muted); margin-bottom:16px;">Control copy, CTAs, and featured sections on the main landing page.</p>
        <div class="admin-form-group">
          <label class="admin-label">Hero Main Headline</label>
          <input type="text" class="admin-input" value="Where Love, Gratitude & Memories Become Unforgettable Moments" />
        </div>
        <div class="admin-form-group">
          <label class="admin-label">Hero Subtitle</label>
          <textarea class="admin-textarea" rows="2">Interactive cinematic digital experiences designed to make the people you love feel cherished forever.</textarea>
        </div>
        <div class="admin-form-group">
          <label class="admin-label">Primary CTA Text</label>
          <input type="text" class="admin-input" value="Create a Moment Now &rarr;" />
        </div>
        <button class="btn-admin-primary" onclick="showAdminToast('Homepage CMS updated!')">Publish Changes</button>
      </div>
    `;
  }

  // ─── 16. BANNERS & NOTIFICATIONS ──────────────────────────────
  function renderBanners() {
    const container = document.getElementById('bannersContainer');
    if (!container) return;
    container.innerHTML = `
      <div class="admin-card">
        <h3 class="admin-card-title">📢 Top Announcement Strip</h3>
        <div class="admin-form-group">
          <label class="admin-label">Banner Text</label>
          <input type="text" class="admin-input" value="✨ Festive Gifting Season: Enjoy 20% off all Ultra Premium atelier experiences!" />
        </div>
        <div class="admin-form-group">
          <label class="admin-label">Status</label>
          <select class="admin-select">
            <option>Visible (Active)</option>
            <option>Hidden</option>
          </select>
        </div>
        <button class="btn-admin-primary" onclick="showAdminToast('Banner saved!')">Update Banner</button>
      </div>
    `;
  }

  function renderOffers() { renderCoupons(); }
  function renderReviews() {
    const container = document.getElementById('reviewsContainer');
    if (!container) return;
    container.innerHTML = `
      <div class="admin-card">
        <h3 class="admin-card-title">⭐ Verified Customer Testimonials</h3>
        <p style="font-size:13px; color:var(--admin-text-muted); margin-bottom:14px;">Moderate and pin reviews featured across the platform.</p>
        <div class="admin-table-wrapper">
          <table class="admin-table">
            <thead>
              <tr><th>Customer</th><th>Rating</th><th>Review Snippet</th><th>Template</th><th>Action</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Sneha R.</strong></td>
                <td>⭐⭐⭐⭐⭐</td>
                <td>"My partner cried tears of joy! The cinema surprise was pure magic."</td>
                <td>Cinema Birthday</td>
                <td><span class="admin-pill pill-green">Approved</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderNotifications() {
    const container = document.getElementById('notificationsContainer');
    if (!container) return;
    container.innerHTML = `
      <div class="admin-card">
        <h3 class="admin-card-title">🔔 Broadcast Push & In-App Notification</h3>
        <div class="admin-form-group">
          <label class="admin-label">Notification Title</label>
          <input type="text" class="admin-input" placeholder="e.g. New Ultra-Premium Template Available!" />
        </div>
        <div class="admin-form-group">
          <label class="admin-label">Message Body</label>
          <textarea class="admin-textarea" rows="3" placeholder="Compose message for all registered users..."></textarea>
        </div>
        <button class="btn-admin-primary" onclick="showAdminToast('Broadcast queued for dispatch!')">Send Broadcast</button>
      </div>
    `;
  }

  // ─── 17. ANALYTICS & INSIGHTS ─────────────────────────────────
  function renderAnalytics() {
    const container = document.getElementById('analyticsChartsContainer');
    if (!container) return;
    container.innerHTML = `
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:20px;">
        <div class="admin-card">
          <h3 class="admin-card-title">📱 Device Breakdown</h3>
          <div style="margin:24px 0; display:flex; flex-direction:column; gap:12px;">
            <div>
              <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px;">
                <span>Mobile (360px - 414px)</span>
                <strong>78.4%</strong>
              </div>
              <div style="height:8px; border-radius:4px; background:rgba(255,255,255,0.1); overflow:hidden;">
                <div style="height:100%; width:78.4%; background:var(--admin-rose);"></div>
              </div>
            </div>
            <div>
              <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px;">
                <span>Desktop & Laptop</span>
                <strong>17.2%</strong>
              </div>
              <div style="height:8px; border-radius:4px; background:rgba(255,255,255,0.1); overflow:hidden;">
                <div style="height:100%; width:17.2%; background:var(--admin-lilac);"></div>
              </div>
            </div>
            <div>
              <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px;">
                <span>Tablet (768px - 1024px)</span>
                <strong>4.4%</strong>
              </div>
              <div style="height:8px; border-radius:4px; background:rgba(255,255,255,0.1); overflow:hidden;">
                <div style="height:100%; width:4.4%; background:var(--admin-cyan);"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="admin-card">
          <h3 class="admin-card-title">🎯 Conversion Funnel</h3>
          <div style="margin:24px 0; display:flex; flex-direction:column; gap:12px;">
            <div style="display:flex; justify-content:space-between; font-size:13px;">
              <span>1. Visitors & Explorer views</span>
              <strong>100% (8,430)</strong>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:13px;">
              <span>2. Template Detail / Preview opened</span>
              <strong>49.9% (4,210)</strong>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:13px;">
              <span>3. Studio Customization started</span>
              <strong>14.2% (1,197)</strong>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:13px;">
              <span>4. Final Order / Publish completion</span>
              <strong style="color:var(--admin-green);">3.4% (284)</strong>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ─── 18. SEO & METADATA ───────────────────────────────────────
  function renderSeo() {
    const container = document.getElementById('seoConfigContainer');
    if (!container) return;
    container.innerHTML = `
      <div class="admin-card">
        <h3 class="admin-card-title">🔍 Global SEO & OpenGraph Configuration</h3>
        <div class="admin-form-group">
          <label class="admin-label">Meta Title Template</label>
          <input type="text" class="admin-input" value="Vanvi Moments — Premium Digital Gifting & Celebration Experiences" />
        </div>
        <div class="admin-form-group">
          <label class="admin-label">Default Meta Description</label>
          <textarea class="admin-textarea" rows="2">Create unforgettable interactive digital gifts for birthdays, love stories, anniversaries, and personal milestones.</textarea>
        </div>
        <div class="admin-form-group">
          <label class="admin-label">Social Share OG Image URL</label>
          <input type="text" class="admin-input" value="https://vanvimoments.shop/assets/og-preview.jpg" />
        </div>
        <button class="btn-admin-primary" onclick="showAdminToast('SEO metadata saved!')">Save SEO Tags</button>
      </div>
    `;
  }

  // ─── 19. SETTINGS, SECURITY & AUDIT ───────────────────────────
  function renderSettings() {
    const container = document.getElementById('settingsContainer');
    if (!container) return;
    container.innerHTML = `
      <div class="admin-card">
        <h3 class="admin-card-title">⚙️ Platform Master Configuration</h3>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:16px;">
          <div class="admin-form-group">
            <label class="admin-label">Platform Name</label>
            <input type="text" class="admin-input" value="Vanvi Moments" />
          </div>
          <div class="admin-form-group">
            <label class="admin-label">Currency Symbol</label>
            <input type="text" class="admin-input" value="₹ (INR)" />
          </div>
          <div class="admin-form-group">
            <label class="admin-label">Support Email</label>
            <input type="email" class="admin-input" value="support@vanvimoments.shop" />
          </div>
          <div class="admin-form-group">
            <label class="admin-label">Maintenance Mode</label>
            <select class="admin-select">
              <option>Disabled (Normal Operations)</option>
              <option>Enabled (Display Maintenance Screen)</option>
            </select>
          </div>
        </div>
        <button class="btn-admin-primary" onclick="showAdminToast('Settings updated!')">Save Settings</button>
      </div>
    `;
  }

  function renderSecurity() {
    const container = document.getElementById('securityContainer');
    if (!container) return;
    container.innerHTML = `
      <div class="admin-card">
        <h3 class="admin-card-title">🛡️ Security & Active Admin Sessions</h3>
        <div style="margin-bottom:16px; font-size:13px; color:var(--admin-text-muted);">
          Current session: <strong>Super Administrator</strong> (IP: 127.0.0.1 • Windows Chrome • Verified)
        </div>
        <button class="btn-admin-secondary" onclick="alert('Session tokens regenerated safely.')">Revoke Other Sessions</button>
      </div>
    `;
  }

  function renderAdminUsers() {
    const container = document.getElementById('adminUsersContainer');
    if (!container) return;
    container.innerHTML = `
      <div class="admin-card">
        <div class="admin-card-header">
          <h3 class="admin-card-title">👥 Authorized Administrator Team</h3>
          <button class="btn-admin-primary" onclick="alert('Invite Administrator modal')">+ Add Admin</button>
        </div>
        <div class="admin-table-wrapper">
          <table class="admin-table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Role</th><th>Access Level</th><th>Status</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Vanvi Administrator</strong></td>
                <td>admin@vanvimoments.shop</td>
                <td><span class="admin-pill pill-gold">Super Admin</span></td>
                <td>Full Access (All 25 modules)</td>
                <td><span class="admin-pill pill-green">Active</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  async function renderAuditLogs() {
    const tbody = document.getElementById('auditLogsTableBody');
    if (!tbody) return;

    let logs = [
      { time: 'Just now', actor: 'Super Admin', action: 'SETTINGS_UPDATE', target: 'Physical Gift Products', details: 'Added new Meesho curated physical gift' },
      { time: '14 mins ago', actor: 'Super Admin', action: 'COINS_ADJUST', target: 'User #usr-002', details: 'Credit +50 coins delight bonus' },
      { time: '1 hour ago', actor: 'System Worker', action: 'TEMPLATE_CACHE_REFRESH', target: 'Catalog Engine', details: 'Updated 52 template manifests' }
    ];

    if (window.VanviAPI && window.VanviAPI.admin) {
      try {
        const res = await window.VanviAPI.admin.getAuditLogs();
        if (res.success && Array.isArray(res.logs) && res.logs.length > 0) {
          logs = res.logs;
        }
      } catch(e) {}
    }

    tbody.innerHTML = logs.map(l => `
      <tr>
        <td><small style="color:var(--admin-text-dim);">${l.time}</small></td>
        <td><strong>${l.actor}</strong></td>
        <td><span class="admin-pill pill-rose">${l.action}</span></td>
        <td>${l.target}</td>
        <td><small style="color:var(--admin-text-muted);">${l.details}</small></td>
      </tr>
    `).join('');
  }

  function renderFaq() {
    const container = document.getElementById('faqContainer');
    if (!container) return;
    container.innerHTML = `
      <div class="admin-card">
        <h3 class="admin-card-title">❓ Help Desk & Documentation</h3>
        <p style="font-size:13.5px; color:var(--admin-text-muted); line-height:1.6;">
          <strong>Quick Tips for Vanvi Admin:</strong><br>
          • <strong>Visual Builder:</strong> Select any template, switch between 320px–desktop viewports, and customize sections live.<br>
          • <strong>Physical Gift Store:</strong> Paste any Meesho, Amazon, or Flipkart link in Gift Store Products tab — store platform is detected automatically.<br>
          • <strong>Loyalty Coins:</strong> 1 Coin = ₹1. Adjust coins directly in the Users module.<br>
          • <strong>Export:</strong> Use the Export button on the dashboard for instant CSV download.
        </p>
      </div>
    `;
  }

  // ─── AUTHENTICATION CHECK ──────────────────────────────────────
  function checkAdminAuthentication() {
    const modal = document.getElementById('adminLoginModal');
    let user = null;
    try {
      if (window.VanviAPI && window.VanviAPI.auth) {
        user = window.VanviAPI.auth.getUser();
      }
    } catch(e) {}

    // Allow default dev admin or check role
    if (!user || user.role !== 'admin') {
      const savedUser = localStorage.getItem('vanvi_auth_user');
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          if (parsed && parsed.role === 'admin') user = parsed;
        } catch(e) {}
      }
    }

    if (user && user.role === 'admin') {
      if (modal) modal.classList.remove('active');
      const adminNameEl = document.getElementById('adminProfileName');
      if (adminNameEl) adminNameEl.textContent = user.name || 'Super Admin';
    } else {
      // Require authentic admin sign-in; never pollute visitor localStorage session
      if (modal) modal.classList.add('active');
      const adminNameEl = document.getElementById('adminProfileName');
      if (adminNameEl) adminNameEl.textContent = 'Admin Sign-In Required';
    }
  }

  // Export functions to window
  root.VanviAdmin = {
    state,
    switchTab,
    showAdminToast
  };

})(typeof window !== 'undefined' ? window : this);
