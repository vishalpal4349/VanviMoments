/**
 * VANVI MOMENTS — GLOBAL NAVIGATION ENGINE (MATCHING HOME SCREEN EXACTLY)
 * Exact replica of index.html bottom navigation bar + unified back navigation across all internal pages.
 */

(function(window) {
  'use strict';

  // Global Vanvi Atelier Theme & Font Sync across all pages
  try {
    const savedTheme = localStorage.getItem('vanvi_aesthetic_theme') || 'bloom';
    const savedFont = localStorage.getItem('vanvi_font_pref') || 'royal';
    document.documentElement.setAttribute('data-vanvi-theme', savedTheme);
    document.documentElement.setAttribute('data-vanvi-font', savedFont);
  } catch(e) {}

  window.setVanviTheme = function(theme) {
    let finalTheme = 'bloom';
    if (theme === 'glass' || theme === 'frost' || theme === 'spatial') {
      finalTheme = 'glass';
    } else if (theme === 'dark' || theme === 'night' || theme === 'emerald') {
      finalTheme = 'emerald';
    } else if (theme === 'clay' || theme === 'bloom') {
      finalTheme = 'bloom';
    }
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
    const current = document.documentElement.getAttribute('data-vanvi-theme') || 'bloom';
    let next = 'emerald';
    if (current === 'emerald' || current === 'dark' || current === 'night') {
      next = 'glass';
    } else if (current === 'glass') {
      next = 'bloom';
    } else {
      next = 'emerald';
    }
    window.setVanviTheme(next);
  };

  // Cross-tab & Cross-frame live synchronization
  window.addEventListener('storage', function(e) {
    if (e.key === 'vanvi_aesthetic_theme' && e.newValue) {
      document.documentElement.setAttribute('data-vanvi-theme', e.newValue);
      if (typeof syncStudioControls === 'function') syncStudioControls();
    }
    if (e.key === 'vanvi_font_pref' && e.newValue) {
      document.documentElement.setAttribute('data-vanvi-font', e.newValue);
      if (typeof syncStudioControls === 'function') syncStudioControls();
    }
  });

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
      if (currentTheme === 'glass') {
        label.textContent = '🫧 Spatial Glass';
      } else if (currentTheme === 'emerald' || currentTheme === 'dark' || currentTheme === 'night') {
        label.textContent = '🌲 Emerald Night';
      } else {
        label.textContent = '🌸 Day Bloom';
      }
    }
    if (mobileLabel) {
      if (currentTheme === 'glass') {
        mobileLabel.textContent = '🫧';
      } else if (currentTheme === 'emerald' || currentTheme === 'dark' || currentTheme === 'night') {
        mobileLabel.textContent = '🌲';
      } else {
        mobileLabel.textContent = '🌸';
      }
    }

    document.querySelectorAll('.studio-opt-btn').forEach(btn => {
      const t = btn.getAttribute('data-theme');
      const isMatched = (t === currentTheme) || 
                        (t === 'emerald' && (currentTheme === 'dark' || currentTheme === 'night')) ||
                        (t === 'glass' && currentTheme === 'glass');
      if (isMatched) {
        btn.style.borderColor = t === 'emerald' ? '#D6B878' : (t === 'glass' ? '#3b82f6' : '#ff2a7a');
        btn.style.boxShadow = t === 'emerald' ? '0 0 0 2px rgba(214,184,120,0.5)' : (t === 'glass' ? '0 0 0 2px rgba(59,130,246,0.45)' : '0 0 0 2px rgba(255,42,122,0.25)');
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
              <span style="font-size:10.5px; color:#52605b;">3 Curated Atmospheres &amp; Universal Typography</span>
            </div>
          </div>
          <button type="button" onclick="closeStudioSettingsModal()" style="background:none; border:none; font-size:20px; color:#52605b; cursor:pointer; padding:4px 8px; line-height:1;">✕</button>
        </div>

        <!-- 1. Strict 3-Theme Selection (Day Bloom vs Emerald Night vs Spatial Glass) -->
        <div style="margin-bottom:18px;">
          <label style="display:block; font-size:11px; font-weight:850; text-transform:uppercase; letter-spacing:0.8px; color:#0F3D32; margin-bottom:8px;">
            ✦ Appearance Mode (3 Curated Themes)
          </label>
          <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px;" id="themeModeOptions">
            <!-- Day Bloom -->
            <button type="button" class="studio-opt-btn" data-theme="clay" onclick="setVanviTheme('clay')" style="padding:10px 6px; border-radius:16px; border:1.5px solid rgba(255,120,175,0.35); background:#fff5f9; text-align:center; cursor:pointer; transition:all 0.2s;">
              <span style="font-size:20px; display:block; margin-bottom:3px;">🌸</span>
              <b style="font-size:11px; display:block; color:#2c1224;">Day Bloom</b>
              <span style="font-size:8.5px; color:#806c80;">Rose Blush</span>
            </button>

            <!-- Emerald Night -->
            <button type="button" class="studio-opt-btn" data-theme="emerald" onclick="setVanviTheme('emerald')" style="padding:10px 6px; border-radius:16px; border:1.5px solid rgba(214,184,120,0.35); background:#0B0D0C; text-align:center; cursor:pointer; transition:all 0.2s;">
              <span style="font-size:20px; display:block; margin-bottom:3px;">🌲</span>
              <b style="font-size:11px; display:block; color:#F1F7F4;">Night</b>
              <span style="font-size:8.5px; color:#D6B878;">Emerald Gold</span>
            </button>

            <!-- Spatial Glass -->
            <button type="button" class="studio-opt-btn" data-theme="glass" onclick="setVanviTheme('glass')" style="padding:10px 6px; border-radius:16px; border:1.5px solid rgba(59,130,246,0.35); background:rgba(240,245,255,0.85); text-align:center; cursor:pointer; transition:all 0.2s;">
              <span style="font-size:20px; display:block; margin-bottom:3px;">🫧</span>
              <b style="font-size:11px; display:block; color:#0f172a;">Spatial Glass</b>
              <span style="font-size:8.5px; color:#3b82f6;">Liquid Frost</span>
            </button>
          </div>
        </div>

        <!-- 2. Typography Font Pairings -->
        <div style="margin-bottom:18px;">
          <label style="display:block; font-size:11px; font-weight:850; text-transform:uppercase; letter-spacing:0.8px; color:#b45309; margin-bottom:8px;">
            ✦ Typography &amp; Font Vibe
          </label>
          <div style="display:flex; flex-direction:column; gap:8px;" id="fontPairingOptions">
            <!-- Spatial Vision (Recommended for Glass) -->
            <button type="button" class="studio-font-btn" data-font="spatial" onclick="setVanviFont('spatial')" style="display:flex; align-items:center; justify-content:space-between; padding:10px 14px; border-radius:14px; border:1.5px solid rgba(59,130,246,0.25); background:rgba(255,255,255,0.85); text-align:left; cursor:pointer; transition:all 0.2s;">
              <div>
                <div style="display:flex; align-items:center; gap:6px;">
                  <b style="font-family:'Plus Jakarta Sans', sans-serif; font-size:15px; color:#0B0D0C; letter-spacing:-0.2px;">Spatial Vision</b>
                  <span style="font-size:9px; background:linear-gradient(135deg, #38bdf8, #3b82f6); color:#fff; font-weight:800; padding:1.5px 6px; border-radius:99px;">VisionOS</span>
                </div>
                <span style="font-size:10px; color:#52605b;">Plus Jakarta Sans + Outfit · Ultra-Smooth Modern</span>
              </div>
              <span class="font-check-mark" style="font-size:16px; color:#18A878; display:none;">✓</span>
            </button>

            <!-- Royal Atelier -->
            <button type="button" class="studio-font-btn" data-font="royal" onclick="setVanviFont('royal')" style="display:flex; align-items:center; justify-content:space-between; padding:10px 14px; border-radius:14px; border:1.5px solid rgba(24,168,120,0.3); background:rgba(241,247,244,0.85); text-align:left; cursor:pointer; transition:all 0.2s;">
              <div>
                <div style="display:flex; align-items:center; gap:6px;">
                  <b style="font-family:'Cormorant Garamond', Georgia, serif; font-size:16px; color:#0B0D0C;">Royal Atelier</b>
                  <span style="font-size:9px; background:linear-gradient(135deg, #f59e0b, #d97706); color:#0B0D0C; font-weight:900; padding:1.5px 6px; border-radius:99px;">Classic</span>
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
    'admin.html',
    'preview.html',
    'vanvi-assistant.html'
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
      currentFile === 'secret-clue.html' ||
      currentFile === 'word-whisper.html'
    ) {
      return 'rewards';
    }

    // AI Hub
    if (
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
      return rootPrefix + 'templates.html';
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
        const onclickAttr = btn.getAttribute('onclick') || '';
        if (onclickAttr && !onclickAttr.includes('GoBack') && !onclickAttr.includes('history.back') && !onclickAttr.includes('location.href') && !onclickAttr.includes('index.html')) {
          return;
        }
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
      // Do not obstruct focused auth pages (login, signup, forgot-password)
      const curPath = window.location.pathname.toLowerCase();
      if (curPath.includes('login') || curPath.includes('signup') || curPath.includes('forgot-password')) return;
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

  // 9. Global Floating Vanvi AI Hub Modal (Assistant vs Matcher)
  function ensureVanviAiHubModalExists() {
    let hubModal = document.getElementById('vanviAiHubModal');
    if (hubModal) return hubModal;

    hubModal = document.createElement('div');
    hubModal.id = 'vanviAiHubModal';
    hubModal.setAttribute('role', 'dialog');
    hubModal.setAttribute('aria-modal', 'true');
    hubModal.setAttribute('aria-label', 'Vanvi Intelligent Atelier Options');
    hubModal.setAttribute('aria-hidden', 'true');

    hubModal.innerHTML = `
      <div class="vanvi-ai-hub-sheet" role="document">
        <div class="vanvi-ai-drag-handle" aria-hidden="true"></div>
        <div class="vanvi-ai-hub-header">
          <div class="vanvi-ai-hub-title-pod">
            <div class="vanvi-ai-spark-orb">✨</div>
            <div>
              <h2 class="vanvi-ai-hub-title">Vanvi AI Atelier</h2>
            </div>
          </div>
          <button type="button" class="vanvi-ai-close-btn" id="closeVanviAiHubBtn" aria-label="Close AI Menu">&times;</button>
        </div>
        <p class="vanvi-ai-hub-subtitle">Choose your personal AI experience — romance, poetry, and moments.</p>

        <div class="vanvi-ai-options-grid">
          <!-- Option 1: Vanvi AI Romantic Assistant -->
          <a href="${rootPrefix}vanvi-assistant.html" class="vanvi-ai-option-item" id="vanviAiOptionAssistant">
            <div class="vanvi-ai-item-left">
              <div class="vanvi-ai-option-icon vanvi-ai-icon-assistant">🐼</div>
              <div class="vanvi-ai-item-text">
                <div class="vanvi-ai-badge-row">
                  <span class="vanvi-ai-pill vanvi-ai-pill-rose">24/7 Companion</span>
                </div>
                <h3 class="vanvi-ai-item-heading">Vanvi Romantic Assistant</h3>
                <p class="vanvi-ai-item-desc">Personal chat for love letters, poetry, apologies, wishes & thoughtful advice.</p>
              </div>
            </div>
            <div class="vanvi-ai-action-arrow" aria-hidden="true">&rarr;</div>
          </a>

          <!-- Option 2: Vanvi AI Template Matcher -->
          <a href="${rootPrefix}ai-matcher.html" class="vanvi-ai-option-item" id="vanviAiOptionMatcher">
            <div class="vanvi-ai-item-left">
              <div class="vanvi-ai-option-icon vanvi-ai-icon-matcher">🪄</div>
              <div class="vanvi-ai-item-text">
                <div class="vanvi-ai-badge-row">
                  <span class="vanvi-ai-pill vanvi-ai-pill-purple">Smart Quiz</span>
                </div>
                <h3 class="vanvi-ai-item-heading">AI Template Matcher</h3>
                <p class="vanvi-ai-item-desc">Answer 3 quick questions to discover your ideal 3D interactive moment.</p>
              </div>
            </div>
            <div class="vanvi-ai-action-arrow" aria-hidden="true">&rarr;</div>
          </a>
        </div>
      </div>
    `;

    document.body.appendChild(hubModal);

    // Event listeners
    const closeBtn = hubModal.querySelector('#closeVanviAiHubBtn');
    if (closeBtn) closeBtn.addEventListener('click', closeVanviAiHub);

    // Dismiss on click outside sheet
    hubModal.addEventListener('click', function(e) {
      if (e.target === hubModal) {
        closeVanviAiHub();
      }
    });

    // Close on ESC key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && hubModal.classList.contains('is-open')) {
        closeVanviAiHub();
      }
    });

    return hubModal;
  }

  function openVanviAiHub() {
    const hub = ensureVanviAiHubModalExists();
    if (!hub) return;
    hub.classList.add('is-open');
    hub.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeVanviAiHub() {
    const hub = document.getElementById('vanviAiHubModal');
    if (!hub) return;
    hub.classList.remove('is-open');
    hub.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  window.openVanviAiHub = openVanviAiHub;
  window.closeVanviAiHub = closeVanviAiHub;

  // AI Navigation Handling:
  // 1. FLOATING AI button: Opens Panda AI Assistant DIRECTLY (vanvi-assistant.html) without any modal popup.
  // 2. TOP NAVBAR / HOME BAR / HEADER AI button: Opens the choose/select modal (openVanviAiHub).
  document.addEventListener('click', function(e) {
    const target = e.target;
    if (!target) return;

    // 1. FLOATING AI ASSISTANT BUTTON -> DIRECT TO PANDA AI ASSISTANT!
    const floatingAi = target.closest('#aiFloatBtn, .panda-ai-float, .ai-float, #vanviAssistantFloatPill, .vanvi-assistant-float-pill, .panda-float-pill');
    if (floatingAi) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      window.location.href = rootPrefix + 'vanvi-assistant.html';
      return;
    }

    // 2. TOP NAVBAR / HOME BAR / HEADER AI BUTTON -> OPEN CHOOSE MODAL!
    const topNavAi = target.closest('[data-open-ai-hub], .nav-ai-btn, .desktop-nav a[href*="ai"], .drawer-link[href*="ai"], .btn-header-link[href*="ai"], #topNavAiBtn, .header-ai-btn');
    if (topNavAi) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      openVanviAiHub();
      return;
    }
  }, true);

  // Auto-heal current page if opened with mangled Windows path
  try {
    const rawPath = window.location.pathname;
    const decPath = decodeURIComponent(rawPath);
    if (/^\/?[a-zA-Z]:[\\\/]/i.test(decPath) || decPath.toLowerCase().includes('c:') || decPath.toLowerCase().includes('c%3a') || decPath.toLowerCase().includes('users') || decPath.toLowerCase().includes('vanvimoments')) {
      let targetClean = '';
      const vmM = decPath.match(/(?:vanvimoments)[\/\\](.*)/i);
      if (vmM && vmM[1]) {
        targetClean = '/' + vmM[1].replace(/\\/g, '/');
      } else {
        const tplM = decPath.match(/((?:templates|assets|css|js|uploads)[\/\\].*)/i);
        if (tplM && tplM[1]) {
          targetClean = '/' + tplM[1].replace(/\\/g, '/');
        } else {
          const hM = decPath.match(/([a-zA-Z0-9_\-]+\.html)/i);
          if (hM && hM[1]) targetClean = '/' + hM[1];
        }
      }
      targetClean = targetClean.replace(/\/+/g, '/');
      if (targetClean && targetClean !== rawPath) {
        window.location.replace(window.location.origin + targetClean + window.location.search + window.location.hash);
      }
    }
  } catch(e) {}

  // Global Link Click Interceptor: Fixes accidental full computer paths and route aliases
  document.addEventListener('click', function(e) {
    const a = e.target.closest('a');
    if (a && a.href) {
      try {
        const hrefUrl = new URL(a.href, window.location.origin);
        const dec = decodeURIComponent(hrefUrl.pathname);
        const aliasMap = {
          'account': 'profile.html',
          'my-account': 'profile.html',
          'settings': 'profile.html',
          'orders': 'dashboard.html',
          'order': 'dashboard.html',
          'my-orders': 'dashboard.html',
          'moments': 'dashboard.html',
          'wallet': 'plans.html',
          'explore': 'templates.html',
          'shop': 'products.html',
          'store': 'products.html'
        };

        if (/^\/?[a-zA-Z]:[\\\/]/i.test(dec) || dec.toLowerCase().includes('c:') || dec.toLowerCase().includes('c%3a') || dec.toLowerCase().includes('users') || dec.toLowerCase().includes('vanvimoments')) {
          let cleanL = '';
          const vmM = dec.match(/(?:vanvimoments)[\/\\](.*)/i);
          if (vmM && vmM[1]) {
            cleanL = '/' + vmM[1].replace(/\\/g, '/');
          } else {
            const tplM = dec.match(/((?:templates|assets|css|js|uploads)[\/\\].*)/i);
            if (tplM && tplM[1]) {
              cleanL = '/' + tplM[1].replace(/\\/g, '/');
            } else {
              const hM = dec.match(/([a-zA-Z0-9_\-]+\.html)/i);
              if (hM && hM[1]) cleanL = '/' + hM[1];
            }
          }
          cleanL = cleanL.replace(/\/+/g, '/');
          const cleanSlug = (cleanL.split('/').filter(Boolean).pop() || '').replace(/\.html$/i, '').toLowerCase();
          if (aliasMap[cleanSlug]) cleanL = '/' + aliasMap[cleanSlug];
          if (cleanL) {
            e.preventDefault();
            window.location.href = cleanL + hrefUrl.search + hrefUrl.hash;
            return;
          }
        } else {
          const rawSlug = (dec.split('/').filter(Boolean).pop() || '').replace(/\.html$/i, '').toLowerCase();
          if (aliasMap[rawSlug] && !dec.includes(aliasMap[rawSlug])) {
            e.preventDefault();
            window.location.href = rootPrefix + aliasMap[rawSlug] + hrefUrl.search + hrefUrl.hash;
            return;
          }
        }
      } catch(err) {}
    }
  }, true);

  // ─── BUTTERY SMOOTH PAGE TRANSITIONS & PREFETCH ENGINE ("MAKHAN" MODE) ───
  const prefetchedUrls = new Set();

  function prefetchUrl(url) {
    if (!url || prefetchedUrls.has(url)) return;
    try {
      const u = new URL(url, window.location.href);
      if (u.origin !== window.location.origin) return;
      if (!u.pathname.endsWith('.html') && u.pathname !== '/' && !u.pathname.endsWith('/')) return;
      prefetchedUrls.add(url);
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = u.href;
      link.as = 'document';
      document.head.appendChild(link);
    } catch(e) {}
  }

  function ensureProgressBar() {
    let bar = document.getElementById('vanvi-global-page-progress');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'vanvi-global-page-progress';
      document.body.appendChild(bar);
    }
    return bar;
  }

  function startPageTransition(targetUrl) {
    const bar = ensureProgressBar();
    bar.classList.add('active');
    bar.style.width = '25%';
    setTimeout(() => { if (bar) bar.style.width = '78%'; }, 40);
    if (document.body) document.body.classList.add('vanvi-page-exit');
    setTimeout(() => {
      if (bar) bar.style.width = '100%';
      window.location.href = targetUrl;
    }, 130);
  }

  // Pre-fetch on hover / touchstart for instant instant loading
  document.addEventListener('pointerover', function(e) {
    const a = e.target && e.target.closest('a[href]');
    if (a && a.href && !a.target && !a.href.startsWith('javascript:')) {
      prefetchUrl(a.href);
    }
  }, { passive: true });

  document.addEventListener('touchstart', function(e) {
    const a = e.target && e.target.closest('a[href]');
    if (a && a.href && !a.target && !a.href.startsWith('javascript:')) {
      prefetchUrl(a.href);
    }
  }, { passive: true });

  // Smooth page switch on click
  document.addEventListener('click', function(e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target && e.target.closest('a[href]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('tel:') || href.startsWith('mailto:')) return;
    if (a.target === '_blank' || a.hasAttribute('download')) return;

    try {
      const targetUrl = new URL(a.href, window.location.href);
      if (targetUrl.origin !== window.location.origin) return;
      if (targetUrl.pathname === window.location.pathname && targetUrl.search === window.location.search) return;

      e.preventDefault();
      startPageTransition(a.href);
    } catch(err) {}
  }, true);

  // Initialize on DOM ready
  function initAll() {
    if (document.body) {
      document.body.classList.add('vanvi-page-enter');
    }
    ensureProgressBar();
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

