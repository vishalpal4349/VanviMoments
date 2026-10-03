/**
 * VANVI MOMENTS — GLOBAL NAVIGATION ENGINE (MATCHING HOME SCREEN EXACTLY)
 * Exact replica of index.html bottom navigation bar + unified back navigation across all internal pages.
 */

(function(window) {
  'use strict';

  // Global Vanvi Atelier Theme & Font Sync across all pages
  try {
    const savedTheme = localStorage.getItem('vanvi_aesthetic_theme') || 'clay';
    const savedFont = localStorage.getItem('vanvi_font_pref') || 'royal';
    document.documentElement.setAttribute('data-vanvi-theme', savedTheme);
    document.documentElement.setAttribute('data-vanvi-font', savedFont);
  } catch(e) {}

  window.setVanviTheme = function(theme) {
    const finalTheme = (theme === 'dark' || theme === 'night' || theme === 'emerald') ? 'emerald' : 'clay';
    document.documentElement.setAttribute('data-vanvi-theme', finalTheme);
    try { localStorage.setItem('vanvi_aesthetic_theme', finalTheme); } catch(e) {}
    if (typeof syncStudioControls === 'function') syncStudioControls();
  };

  window.setVanviFont = function(fontKey) {
    document.documentElement.setAttribute('data-vanvi-font', fontKey);
    try { localStorage.setItem('vanvi_font_pref', fontKey); } catch(e) {}
    if (typeof syncStudioControls === 'function') syncStudioControls();
  };

  window.toggleVanviTheme = function() {
    const current = document.documentElement.getAttribute('data-vanvi-theme') || 'clay';
    const next = (current === 'emerald' || current === 'dark' || current === 'night') ? 'clay' : 'emerald';
    window.setVanviTheme(next);
  };

  // Global Reset Aesthetics to Default (Callable by User and AI Assistant)
  window.vanviResetAesthetics = function() {
    window.setVanviTheme('clay');
    window.setVanviFont('royal');
    try {
      localStorage.setItem('vanvi_aesthetic_theme', 'clay');
      localStorage.setItem('vanvi_font_pref', 'royal');
    } catch(e) {}
    syncStudioControls();

    const toast = document.createElement('div');
    toast.style.cssText = 'position:fixed; bottom:85px; left:50%; transform:translateX(-50%); background:#0F3D32; color:#F1F7F4; border:1px solid #D6B878; border-radius:99px; padding:10px 20px; font-size:12.5px; font-weight:800; z-index:999999; box-shadow:0 12px 30px rgba(0,0,0,0.5); display:flex; align-items:center; gap:8px; animation:modalPop 0.25s ease;';
    toast.innerHTML = '<span>✨</span> Settings restored to Signature Rose & Royal Atelier font!';
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 350);
    }, 2200);

    return { success: true, theme: 'clay', font: 'royal' };
  };

  function syncStudioControls() {
    const currentTheme = document.documentElement.getAttribute('data-vanvi-theme') || 'clay';
    const currentFont = document.documentElement.getAttribute('data-vanvi-font') || 'royal';

    const label = document.getElementById('themeToggleLabel');
    const mobileLabel = document.getElementById('themeToggleMobileLabel');
    if (label) {
      if (currentTheme === 'emerald' || currentTheme === 'dark' || currentTheme === 'night') {
        label.textContent = '🌲 Emerald Night';
      } else {
        label.textContent = '🌸 Day Bloom';
      }
    }
    if (mobileLabel) {
      if (currentTheme === 'emerald' || currentTheme === 'dark' || currentTheme === 'night') {
        mobileLabel.textContent = '🌲';
      } else {
        mobileLabel.textContent = '🌸';
      }
    }

    document.querySelectorAll('.studio-opt-btn').forEach(btn => {
      const t = btn.getAttribute('data-theme');
      const isMatched = (t === currentTheme) || (t === 'emerald' && (currentTheme === 'dark' || currentTheme === 'night'));
      if (isMatched) {
        btn.style.borderColor = t === 'emerald' ? '#D6B878' : '#ff2a7a';
        btn.style.boxShadow = t === 'emerald' ? '0 0 0 2px rgba(214,184,120,0.5)' : '0 0 0 2px rgba(255,42,122,0.25)';
        btn.style.transform = 'translateY(-1px)';
      } else {
        btn.style.borderColor = 'rgba(214,184,120,0.25)';
        btn.style.boxShadow = 'none';
        btn.style.transform = 'none';
      }
    });

    document.querySelectorAll('.studio-font-btn').forEach(btn => {
      const f = btn.getAttribute('data-font');
      const check = btn.querySelector('.font-check-mark');
      if (f === currentFont) {
        btn.style.borderColor = '#18A878';
        btn.style.boxShadow = '0 0 0 2px rgba(24,168,120,0.35)';
        if (check) check.style.display = 'inline';
      } else {
        btn.style.borderColor = 'rgba(214,184,120,0.25)';
        btn.style.boxShadow = 'none';
        if (check) check.style.display = 'none';
      }
    });
  }

  function ensureStudioModalExists() {
    if (document.getElementById('studioAestheticsModal')) return;

    const modal = document.createElement('div');
    modal.id = 'studioAestheticsModal';
    modal.style.cssText = 'display:none; position:fixed; inset:0; z-index:99999; background:rgba(11,13,12,0.75); backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px); align-items:center; justify-content:center; padding:16px;';
    modal.innerHTML = `
      <div class="glass" style="max-width:440px; width:100%; border-radius:24px; padding:24px 22px; position:relative; box-shadow:0 24px 60px rgba(0,0,0,0.45); border:1.5px solid rgba(214,184,120,0.35); background:rgba(255,255,255,0.97); animation:modalSlideUp 0.25s cubic-bezier(0.2,0.8,0.2,1);" id="studioModalContainer">
        <!-- Header -->
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; padding-bottom:10px; border-bottom:1px solid rgba(214,184,120,0.25);">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:22px;">🎨</span>
            <div>
              <h4 style="margin:0; font-size:18px; font-weight:850; color:#0B0D0C; line-height:1.2;">Studio Aesthetics</h4>
              <span style="font-size:10.5px; color:#52605b;">Dual Atmosphere &amp; Universal Typography</span>
            </div>
          </div>
          <button type="button" onclick="closeStudioSettingsModal()" style="background:none; border:none; font-size:20px; color:#52605b; cursor:pointer; padding:4px 8px; line-height:1;">✕</button>
        </div>

        <!-- 1. Strict 2-Theme Selection (Day Bloom vs Emerald Night) -->
        <div style="margin-bottom:18px;">
          <label style="display:block; font-size:11px; font-weight:850; text-transform:uppercase; letter-spacing:0.8px; color:#0F3D32; margin-bottom:8px;">
            ✦ Appearance Mode (2 Curated Themes)
          </label>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;" id="themeModeOptions">
            <!-- Day Bloom -->
            <button type="button" class="studio-opt-btn" data-theme="clay" onclick="setVanviTheme('clay')" style="padding:12px 10px; border-radius:16px; border:1.5px solid rgba(255,120,175,0.35); background:#fff5f9; text-align:center; cursor:pointer; transition:all 0.2s;">
              <span style="font-size:22px; display:block; margin-bottom:4px;">🌸</span>
              <b style="font-size:12px; display:block; color:#2c1224;">Day Bloom</b>
              <span style="font-size:9.5px; color:#806c80;">Signature Rose Blush</span>
            </button>

            <!-- Emerald Night -->
            <button type="button" class="studio-opt-btn" data-theme="emerald" onclick="setVanviTheme('emerald')" style="padding:12px 10px; border-radius:16px; border:1.5px solid rgba(214,184,120,0.35); background:#0B0D0C; text-align:center; cursor:pointer; transition:all 0.2s;">
              <span style="font-size:22px; display:block; margin-bottom:4px;">🌲</span>
              <b style="font-size:12px; display:block; color:#F1F7F4;">Emerald Night</b>
              <span style="font-size:9.5px; color:#D6B878;">Obsidian &amp; Gold Luxury</span>
            </button>
          </div>
        </div>

        <!-- 2. Typography Font Pairings -->
        <div style="margin-bottom:18px;">
          <label style="display:block; font-size:11px; font-weight:850; text-transform:uppercase; letter-spacing:0.8px; color:#b45309; margin-bottom:8px;">
            ✦ Typography &amp; Font Vibe
          </label>
          <div style="display:flex; flex-direction:column; gap:8px;" id="fontPairingOptions">
            <!-- Royal Atelier (Recommended) -->
            <button type="button" class="studio-font-btn" data-font="royal" onclick="setVanviFont('royal')" style="display:flex; align-items:center; justify-content:space-between; padding:10px 14px; border-radius:14px; border:1.5px solid rgba(24,168,120,0.3); background:rgba(241,247,244,0.85); text-align:left; cursor:pointer; transition:all 0.2s;">
              <div>
                <div style="display:flex; align-items:center; gap:6px;">
                  <b style="font-family:'Cormorant Garamond', Georgia, serif; font-size:16px; color:#0B0D0C;">Royal Atelier</b>
                  <span style="font-size:9px; background:linear-gradient(135deg, #f59e0b, #d97706); color:#0B0D0C; font-weight:900; padding:1.5px 6px; border-radius:99px;">Recommended</span>
                </div>
                <span style="font-size:10px; color:#52605b;">Cormorant Garamond + Plus Jakarta Sans · Romantic &amp; Poetic</span>
              </div>
              <span class="font-check-mark" style="font-size:16px; color:#18A878;">✓</span>
            </button>

            <!-- Imperial Majestic (Cinzel) -->
            <button type="button" class="studio-font-btn" data-font="cinzel" onclick="setVanviFont('cinzel')" style="display:flex; align-items:center; justify-content:space-between; padding:10px 14px; border-radius:14px; border:1.5px solid rgba(214,184,120,0.25); background:rgba(255,255,255,0.85); text-align:left; cursor:pointer; transition:all 0.2s;">
              <div>
                <b style="font-family:'Cinzel', Georgia, serif; font-size:15px; color:#0B0D0C; display:block; letter-spacing:0.4px;">Imperial Majestic</b>
                <span style="font-size:10px; color:#52605b;">Cinzel + Plus Jakarta Sans · Royal Heritage Luxury</span>
              </div>
              <span class="font-check-mark" style="font-size:16px; color:#18A878; display:none;">✓</span>
            </button>

            <!-- Editorial Vogue -->
            <button type="button" class="studio-font-btn" data-font="editorial" onclick="setVanviFont('editorial')" style="display:flex; align-items:center; justify-content:space-between; padding:10px 14px; border-radius:14px; border:1.5px solid rgba(214,184,120,0.25); background:rgba(255,255,255,0.85); text-align:left; cursor:pointer; transition:all 0.2s;">
              <div>
                <b style="font-family:'Playfair Display', Georgia, serif; font-size:15px; color:#0B0D0C; display:block;">Editorial Vogue</b>
                <span style="font-size:10px; color:#52605b;">Playfair Display + Inter · Haute Couture Luxury</span>
              </div>
              <span class="font-check-mark" style="font-size:16px; color:#18A878; display:none;">✓</span>
            </button>

            <!-- Modern Minimal -->
            <button type="button" class="studio-font-btn" data-font="modern" onclick="setVanviFont('modern')" style="display:flex; align-items:center; justify-content:space-between; padding:10px 14px; border-radius:14px; border:1.5px solid rgba(214,184,120,0.25); background:rgba(255,255,255,0.85); text-align:left; cursor:pointer; transition:all 0.2s;">
              <div>
                <b style="font-family:'Outfit', sans-serif; font-size:15px; color:#0B0D0C; display:block;">Modern Minimal</b>
                <span style="font-size:10px; color:#52605b;">Outfit + Plus Jakarta Sans · Sleek Geometric Luxury</span>
              </div>
              <span class="font-check-mark" style="font-size:16px; color:#18A878; display:none;">✓</span>
            </button>
          </div>
        </div>

        <!-- Footer Actions with Reset Option -->
        <div style="display:flex; align-items:center; justify-content:space-between; padding-top:12px; border-top:1px solid rgba(214,184,120,0.25);">
          <button type="button" onclick="vanviResetAesthetics()" style="background:rgba(214,184,120,0.15); border:1px solid rgba(214,184,120,0.4); color:#92400e; font-size:11.5px; font-weight:800; border-radius:99px; padding:6px 12px; cursor:pointer; transition:all 0.2s;">↺ Reset Settings</button>
          <button type="button" onclick="closeStudioSettingsModal()" style="padding:9px 22px; border-radius:99px; font-size:12px; font-weight:850; background:linear-gradient(135deg, #18A878, #0F3D32); color:#F1F7F4; border:1px solid rgba(214,184,120,0.5); cursor:pointer;">Done</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  window.openStudioSettingsModal = function() {
    ensureStudioModalExists();
    const m = document.getElementById('studioAestheticsModal');
    if (m) {
      m.style.display = 'flex';
      syncStudioControls();
    }
  };

  window.closeStudioSettingsModal = function() {
    const m = document.getElementById('studioAestheticsModal');
    if (m) m.style.display = 'none';
  };

  // Global Safe Back Navigation Helpers
  window.vanviGoBack = function(fallback) {
    if (window.history && window.history.length > 1) {
      window.history.back();
      return false;
    }
    window.location.href = fallback || 'index.html';
    return false;
  };

  window.safeGoBack = function(fallback) {
    if (window.history && window.history.length > 1) {
      window.history.back();
      return false;
    }
    window.location.href = fallback || 'index.html';
    return false;
  };

  const pathname = window.location.pathname || '';
  const currentFile = (pathname.substring(pathname.lastIndexOf('/') + 1) || 'index.html').toLowerCase();

  // Pages where bottom navigation must NEVER appear (Auth, Builder canvas, recipient moment view, payment checkout, admin)
  const EXCLUDED_FILES = [
    'login.html',
    'signup.html',
    'forgot-password.html',
    'checkout.html',
    'order-success.html',
    'builder.html',
    'custom-experience.html',
    'moment.html',
    'admin.html'
  ];

  // Determine root path prefix according to folder depth
  const pathParts = pathname.split('/').filter(Boolean);
  let rootPrefix = '';
  if (pathname.includes('/templates/') && currentFile !== 'templates.html') {
    const subCount = pathParts.length - 1;
    rootPrefix = '../'.repeat(Math.max(0, subCount));
  }

  // 1. Resolve Active Nav Tab
  function resolveActiveTab() {
    const explicit = document.body && document.body.getAttribute('data-vanvi-active');
    if (explicit) return explicit.toLowerCase();

    // Rewards Hub & Mini-Games
    if (
      currentFile === 'rewards.html' ||
      currentFile === 'refer.html' ||
      currentFile === 'games.html' ||
      currentFile === 'risk-run.html' ||
      currentFile === 'heart-sort.html' ||
      currentFile === 'block-blast.html' ||
      currentFile === 'heart-rain.html' ||
      currentFile === 'unlock-gift.html' ||
      currentFile === 'gem-catch.html' ||
      currentFile === 'love-puzzle.html' ||
      currentFile === 'memory-rush.html' ||
      currentFile === 'quick-tap.html' ||
      currentFile === 'gem-merge.html' ||
      currentFile === 'brain-test.html' ||
      currentFile === 'hidden-hearts.html' ||
      currentFile === 'cross-math.html' ||
      currentFile === 'periodic-quiz.html' ||
      currentFile === 'word-whisper.html'
    ) {
      return 'rewards';
    }

    // AI Hub
    if (
      currentFile === 'ai.html' ||
      currentFile === 'ai-matcher.html' ||
      currentFile === 'vanvi-assistant.html'
    ) {
      return 'ai';
    }

    // Explore / Discover / Categories / Products
    if (
      currentFile === 'templates.html' ||
      currentFile === 'template-detail.html' ||
      currentFile.startsWith('category-') ||
      currentFile === 'products.html'
    ) {
      return 'discover';
    }

    // Profile / User Hubs / Plans
    if (
      currentFile === 'profile.html' ||
      currentFile === 'dashboard.html' ||
      currentFile === 'plans.html'
    ) {
      return 'me';
    }

    return 'home';
  }

  // 2. Resolve Fallback URL for Back Button
  function resolveFallbackUrl() {
    if (currentFile === 'template-detail.html' || currentFile === 'products.html' || currentFile === 'games.html' || currentFile === 'plans.html' || currentFile === 'coming-soon.html') {
      return rootPrefix + 'templates.html';
    }
    if (currentFile.startsWith('category-')) {
      return rootPrefix + 'templates.html';
    }

    if (currentFile === 'checkout.html') {
      return rootPrefix + 'templates.html';
    }

    if (currentFile === 'custom-experience.html') {
      return rootPrefix + 'category-premium.html';
    }

    if (currentFile === 'ai-matcher.html' || currentFile === 'vanvi-assistant.html') {
      return rootPrefix + 'ai.html';
    }

    if (currentFile === 'rewards.html' || currentFile === 'refer.html') {
      return rootPrefix + 'index.html';
    }
    if (currentFile === 'order-success.html' || currentFile === 'share.html') {
      return rootPrefix + 'dashboard.html';
    }

    return rootPrefix + 'index.html';
  }

  // 3. Global Premium Back Handler
  window.vanviGoBack = function(customFallback) {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      const target = customFallback || resolveFallbackUrl();
      window.location.href = target;
    }
  };

  // 4. Render/Mount the Bottom Navigation Bar
  function mountGlobalNav() {
    bindBackButtons();

    // If page is in the exclusion list, do not render bottom dock and remove any existing dock
    if (EXCLUDED_FILES.includes(currentFile) || (document.body && document.body.hasAttribute('data-vanvi-no-dock'))) {
      document.querySelectorAll('.bottom, .vanvi-bottom-dock').forEach(el => el.remove());
      if (document.body) {
        document.body.classList.remove('has-vanvi-dock');
      }
      return;
    }

    const activeTab = resolveActiveTab();

    if (document.body) {
      document.body.classList.add('has-vanvi-dock');
    }

    const navHtml = `
      <a href="${rootPrefix}index.html" class="nav-btn ${activeTab === 'home' ? 'active' : ''}" id="bottomNavHome" title="Home">
        <span class="dock-icon">
          <svg class="dock-svg" viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 10.5L12 3l9 7.5V20a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 20v-9.5z"/>
            <path d="M9 21V12h6v9"/>
          </svg>
        </span>
        <span class="dock-label">Home</span>
      </a>
      <a href="${rootPrefix}templates.html" class="nav-btn ${activeTab === 'discover' ? 'active' : ''}" id="bottomNavExplore" title="Explore">
        <span class="dock-icon">
          <svg class="dock-svg" viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"/>
          </svg>
        </span>
        <span class="dock-label">Explore</span>
      </a>
      <a href="${rootPrefix}templates.html" class="create nav-btn" id="bottomNavCreate" title="Templates">
        <span class="dock-icon create-plus">
          <svg class="dock-svg-plus" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </span>
        <span class="dock-label">Templates</span>
      </a>
      <a href="${rootPrefix}rewards.html" class="nav-btn ${activeTab === 'rewards' ? 'active' : ''}" id="bottomNavRewards" title="Rewards">
        <span class="dock-icon">
          <svg class="dock-svg" viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="8" width="18" height="13" rx="2.5"/>
            <line x1="12" y1="8" x2="12" y2="21"/>
            <path d="M12 8H7.5a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8z"/>
            <path d="M12 8h4.5a2.5 2.5 0 0 0 0-5C13 3 12 8 12 8z"/>
          </svg>
        </span>
        <span class="dock-label">Rewards</span>
      </a>
      <a href="${rootPrefix}profile.html" class="nav-btn ${activeTab === 'me' ? 'active' : ''}" id="bottomNavMe" title="Profile">
        <span class="dock-icon">
          <svg class="dock-svg" viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </span>
        <span class="dock-label">Profile</span>
      </a>
    `;

    let existingDock = document.querySelector('.bottom, .vanvi-bottom-dock');
    if (existingDock) {
      existingDock.className = 'bottom vanvi-bottom-dock';
      existingDock.setAttribute('aria-label', 'Vanvi Main Navigation');
      existingDock.innerHTML = navHtml;
    } else {
      const nav = document.createElement('nav');
      nav.className = 'bottom vanvi-bottom-dock';
      nav.setAttribute('aria-label', 'Vanvi Main Navigation');
      nav.innerHTML = navHtml;
      document.body.appendChild(nav);
    }
  }

  // 5. Connect Back Buttons across the page
  function bindBackButtons() {
    const backSelectors = [
      '.vanvi-btn-back',
      '.btn-nav-back',
      '#btnBackNav',
      '.btn-back',
      '.nav-back',
      '.btn-back-nav',
      '.auth-back',
      '.back-link',
      '#btnBackToBuilder'
    ];
    backSelectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(btn => {
        if (btn.dataset.vanviBound) return;
        btn.dataset.vanviBound = 'true';
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          const customTarget = this.getAttribute('data-fallback') || this.getAttribute('href');
          const cleanTarget = (customTarget && !customTarget.startsWith('javascript:') && !customTarget.startsWith('#')) ? customTarget : null;
          window.vanviGoBack(cleanTarget);
        });
      });
    });
  }

  // 6. Global Brand Logo Navigation: Logo tap smoothly returns to Home (or scrolls to top on Home)
  document.addEventListener('click', function(e) {
    const brandEl = e.target && e.target.closest && e.target.closest('.brand, .brand-link, .header-brand, .brand-title, .brand-group, .ai-brand-logo, .auth-brand, .site-logo');
    if (brandEl) {
      // If already on Home page, smoothly scroll to top
      if (currentFile === 'index.html' || pathname === '/' || pathname.endsWith('/index.html')) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      // If brand element is an <a> tag with explicit valid href, allow standard navigation
      if (brandEl.tagName === 'A' && brandEl.getAttribute('href') && !brandEl.getAttribute('href').startsWith('javascript:')) {
        return;
      }
      // For any inner page logo container or div, navigate smoothly to home
      e.preventDefault();
      window.location.href = rootPrefix + 'index.html';
    }
  });

  // 7. Luxury Cookie Consent Banner (GDPR / DPDP Act 2023)
  function initCookieConsent() {
    try {
      if (localStorage.getItem('vanvi_cookie_consent')) return;
      if (document.querySelector('.vanvi-cookie-banner')) return;

      const banner = document.createElement('aside');
      banner.className = 'vanvi-cookie-banner';
      banner.setAttribute('role', 'dialog');
      banner.setAttribute('aria-label', 'Privacy and Cookie Preferences');
      banner.innerHTML = `
        <div class="vanvi-cookie-content">
          <span class="vanvi-cookie-icon" aria-hidden="true">✨</span>
          <div class="vanvi-cookie-text">
            <strong>Cherishing your privacy:</strong> We use essential and performance cookies to secure your surprises, remember your bag, and elevate your moments. Read our <a href="${rootPrefix}privacy.html" class="vanvi-cookie-link">Privacy Policy</a>.
          </div>
        </div>
        <div class="vanvi-cookie-actions">
          <button type="button" class="vanvi-cookie-btn vanvi-cookie-btn-essential" id="vanviCookieEssential">Essential Only</button>
          <button type="button" class="vanvi-cookie-btn vanvi-cookie-btn-accept" id="vanviCookieAccept">Accept All ✨</button>
        </div>
      `;

      document.body.appendChild(banner);

      const dismiss = (consentType) => {
        try {
          localStorage.setItem('vanvi_cookie_consent', consentType);
        } catch(e) {}
        banner.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
        banner.style.opacity = '0';
        banner.style.transform = 'translateY(16px)';
        setTimeout(() => banner.remove(), 260);
      };

      document.getElementById('vanviCookieEssential')?.addEventListener('click', () => dismiss('essential'));
      document.getElementById('vanviCookieAccept')?.addEventListener('click', () => dismiss('all'));
    } catch(err) {
      console.warn('Cookie banner init error:', err);
    }
  }

  // 8. Privacy-Preserving Observability & Analytics Helper
  window.vanviAnalytics = {
    track: function(eventName, properties) {
      try {
        const consent = localStorage.getItem('vanvi_cookie_consent');
        if (consent === 'essential') return; // User opted out of analytics

        const payload = JSON.stringify({
          eventName: eventName || 'pageview',
          properties: Object.assign({
            page: window.location.pathname,
            title: document.title,
            referrer: document.referrer || '',
            timestamp: Date.now()
          }, properties || {})
        });

        if (navigator.sendBeacon) {
          const blob = new Blob([payload], { type: 'application/json' });
          navigator.sendBeacon('/api/analytics/event', blob);
        } else {
          fetch('/api/analytics/event', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload,
            keepalive: true
          }).catch(() => {});
        }
      } catch(e) {}
    }
  };

  // Initialize on DOM ready
  function initAll() {
    mountGlobalNav();
    initCookieConsent();
    setTimeout(() => {
      if (window.vanviAnalytics && typeof window.vanviAnalytics.track === 'function') {
        window.vanviAnalytics.track('pageview', { path: currentFile });
      }
    }, 1200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

})(typeof window !== 'undefined' ? window : this);

