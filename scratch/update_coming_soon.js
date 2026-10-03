const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'coming-soon.html');

const newComingSoonHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes"/>
  <title>Coming Soon ✦ Interactive Cards &amp; E-Magazines | Vanvi Moments</title>
  <meta name="description" content="Thank you for your love! Interactive 3D Greeting Cards &amp; Digital Keepsake Magazines are being handcrafted in our artisan workshop."/>
  <meta name="theme-color" content="#fff5f8"/>

  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="assets/favicon.svg"/>

  <!-- Google Fonts: Plus Jakarta Sans & Cormorant Garamond -->
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/>

  <link rel="stylesheet" href="vanvi-inner-light.css"/>
  <link rel="stylesheet" href="vanvi-navigation.css"/>

  <style>
    :root {
      --bg-pearl: #fffdfb;
      --bg-blush: #fff1f6;
      --bg-card: rgba(255, 255, 255, 0.96);
      --rose-main: #ff2a7a;
      --rose-soft: #ff529a;
      --rose-gradient: linear-gradient(135deg, #ff2a7a 0%, #ff529a 50%, #d97706 100%);
      --gold-main: #d97706;
      --gold-light: #fef3c7;
      --text-dark: #2c1224;
      --text-muted: #7b5971;
      --border-pink: rgba(255, 120, 175, 0.28);
      --shadow-luxury: 0 10px 30px rgba(255, 56, 128, 0.08), 0 2px 6px rgba(0, 0, 0, 0.02);
      --shadow-card: 0 16px 45px rgba(74, 22, 58, 0.09), 0 2px 10px rgba(255, 42, 122, 0.04);
      --font-sans: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      --font-serif: 'Cormorant Garamond', Georgia, serif;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-tap-highlight-color: transparent;
    }

    html, body {
      max-width: 100%;
      overflow-x: hidden !important;
    }

    body {
      background-color: #fff9fb;
      background-image: 
        radial-gradient(ellipse 90% 45% at 50% -5%, rgba(255, 182, 217, 0.38) 0%, transparent 65%),
        radial-gradient(circle 480px at 15% 35%, rgba(245, 208, 254, 0.25) 0%, transparent 70%),
        radial-gradient(circle 460px at 85% 65%, rgba(224, 242, 254, 0.3) 0%, transparent 70%),
        radial-gradient(circle 350px at 50% 85%, rgba(254, 243, 199, 0.3) 0%, transparent 70%),
        linear-gradient(180deg, #fff5f8 0%, #fffbfd 40%, #fff8fa 100%);
      background-attachment: fixed;
      font-family: var(--font-sans);
      color: var(--text-dark);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      padding-bottom: 110px !important;
    }

    /* Ambient animated stardust glow */
    .ambient-orb {
      position: fixed;
      border-radius: 50%;
      filter: blur(80px);
      pointer-events: none;
      z-index: 0;
      opacity: 0.28;
      animation: floatPulse 14s infinite alternate ease-in-out;
    }
    .orb-1 { width: 280px; height: 280px; background: #ff78a8; top: -40px; left: -40px; }
    .orb-2 { width: 300px; height: 300px; background: #c084fc; bottom: -60px; right: -60px; animation-duration: 18s; }

    @keyframes floatPulse {
      0% { transform: translateY(0) scale(1); }
      100% { transform: translateY(22px) scale(1.08); }
    }

    /* Top Sticky Header */
    .app-header {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(255, 255, 255, 0.94);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--border-pink);
      padding: 0 18px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
    }
    .header-brand {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
      color: var(--text-dark);
    }
    .brand-spark-icon {
      font-size: 18px;
      color: var(--rose-main);
    }
    .brand-title {
      font-family: var(--font-sans);
      font-weight: 900;
      font-size: 15px;
      letter-spacing: -0.2px;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .brand-title span { color: var(--rose-main); }
    .brand-tag {
      font-size: 9.5px;
      font-weight: 850;
      background: linear-gradient(135deg, rgba(255, 42, 122, 0.12), rgba(217, 119, 6, 0.12));
      border: 1px solid rgba(255, 42, 122, 0.28);
      color: var(--rose-main);
      padding: 2px 8px;
      border-radius: 99px;
      letter-spacing: 0.5px;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .header-btn {
      font-size: 12px;
      font-weight: 800;
      color: var(--text-dark);
      text-decoration: none;
      background: #ffffff;
      border: 1px solid var(--border-pink);
      padding: 6px 14px;
      border-radius: 99px;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      transition: all 0.2s;
    }
    .header-btn:hover {
      border-color: var(--rose-main);
      color: var(--rose-main);
      transform: translateY(-1px);
    }

    /* Small Floating Back Button Bar */
    .nav-breadcrumbs {
      max-width: 760px;
      width: 100%;
      margin: 12px auto 0;
      padding: 0 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .btn-nav-back {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 99px;
      background: rgba(255, 255, 255, 0.92);
      border: 1px solid var(--border-pink);
      color: var(--text-dark);
      font-size: 12px;
      font-weight: 800;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
      transition: all 0.2s;
    }
    .btn-nav-back:hover {
      background: #fff0f6;
      border-color: var(--rose-main);
      color: var(--rose-main);
      transform: translateY(-1px);
    }
    .luxury-trail-chip {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid var(--border-pink);
      padding: 4px 12px;
      border-radius: 99px;
      font-size: 11px;
      font-weight: 750;
      color: var(--text-muted);
    }

    /* Main Stage */
    .teaser-main {
      max-width: 740px;
      width: 100%;
      margin: 14px auto 30px;
      padding: 0 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      position: relative;
      z-index: 10;
      flex: 1;
    }

    /* Teaser Switcher Tabs */
    .teaser-tabs-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-bottom: 6px;
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(12px);
      padding: 5px;
      border-radius: 99px;
      border: 1px solid var(--border-pink);
    }
    .teaser-tab-btn {
      padding: 7px 18px;
      border-radius: 99px;
      border: none;
      background: transparent;
      font-size: 12px;
      font-weight: 800;
      color: var(--text-muted);
      cursor: pointer;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .teaser-tab-btn.active {
      background: linear-gradient(135deg, var(--rose-main), #d97706);
      color: #ffffff;
      box-shadow: 0 4px 14px rgba(255, 42, 122, 0.28);
    }

    /* Teaser Glass Card */
    .teaser-card {
      width: 100%;
      background: #ffffff;
      border: 1.5px solid var(--border-pink);
      border-radius: 26px;
      padding: 34px 26px 30px;
      text-align: center;
      box-shadow: var(--shadow-card);
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .teaser-card::before {
      content: "";
      position: absolute;
      top: 0; left: 0; right: 0; height: 3.5px;
      background: var(--rose-gradient);
    }

    /* Floating Capsule Icon */
    .floating-capsule {
      width: 86px;
      height: 86px;
      border-radius: 26px;
      background: linear-gradient(135deg, #fff0f5 0%, #fdf4ff 100%);
      border: 1.5px solid rgba(255, 120, 175, 0.38);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 38px;
      margin-bottom: 16px;
      box-shadow: 0 10px 25px rgba(255, 42, 122, 0.15);
      animation: floatCapsule 4.5s ease-in-out infinite alternate;
    }
    @keyframes floatCapsule {
      0% { transform: translateY(0); }
      100% { transform: translateY(-6px); }
    }

    .teaser-kicker {
      font-size: 11px;
      font-weight: 850;
      color: var(--rose-main);
      background: #fff0f5;
      border: 1px solid rgba(255, 42, 122, 0.25);
      padding: 4px 14px;
      border-radius: 99px;
      letter-spacing: 0.8px;
      margin-bottom: 12px;
      text-transform: uppercase;
      display: inline-flex;
      align-items: center;
      gap: 5px;
    }

    .teaser-title {
      font-family: var(--font-serif);
      font-size: clamp(26px, 5.2vw, 40px);
      line-height: 1.18;
      font-weight: 700;
      color: var(--text-dark);
      margin-bottom: 10px;
    }
    .teaser-title span {
      background: var(--rose-gradient);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .teaser-heartfelt-msg {
      background: linear-gradient(135deg, #fff5fa, #fffaf4);
      border: 1px solid rgba(255, 120, 175, 0.3);
      border-radius: 18px;
      padding: 16px 20px;
      max-width: 580px;
      margin: 0 auto 22px;
      text-align: center;
    }
    .teaser-heartfelt-msg p {
      font-size: 13.5px;
      color: #633f5b;
      line-height: 1.6;
      font-weight: 500;
      margin: 0;
    }
    .teaser-heartfelt-msg strong {
      color: #b45309;
      font-weight: 800;
    }

    /* VIP Notify Me Form */
    .notify-form-box {
      width: 100%;
      max-width: 460px;
      background: #fffafc;
      border: 1px solid rgba(255, 120, 175, 0.28);
      border-radius: 18px;
      padding: 18px;
      margin-bottom: 24px;
    }
    .notify-title {
      font-size: 13px;
      font-weight: 850;
      color: var(--text-dark);
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }
    .notify-sub {
      font-size: 11.5px;
      color: var(--text-muted);
      margin-bottom: 12px;
    }
    .notify-input-group {
      display: flex;
      gap: 6px;
    }
    .notify-input {
      flex: 1;
      padding: 10px 14px;
      border-radius: 12px;
      border: 1px solid var(--border-pink);
      background: #ffffff;
      font-size: 13px;
      font-family: var(--font-sans);
      color: var(--text-dark);
      outline: none;
      transition: all 0.2s;
    }
    .notify-input:focus {
      border-color: var(--rose-main);
      box-shadow: 0 0 0 3px rgba(255, 42, 122, 0.12);
    }
    .btn-notify-submit {
      background: var(--rose-gradient);
      color: #fff;
      border: none;
      border-radius: 12px;
      padding: 10px 18px;
      font-size: 12.5px;
      font-weight: 850;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(255, 42, 122, 0.32);
      transition: all 0.2s;
      white-space: nowrap;
    }
    .btn-notify-submit:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 18px rgba(255, 42, 122, 0.45);
    }
    .notify-feedback {
      font-size: 12px;
      color: #059669;
      font-weight: 800;
      margin-top: 10px;
      display: none;
    }

    /* Sneak Peek Feature Chips */
    .teaser-chips-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      width: 100%;
      margin-bottom: 24px;
    }
    @media (max-width: 600px) {
      .teaser-chips-grid {
        grid-template-columns: 1fr;
      }
    }
    .teaser-chip {
      background: #ffffff;
      border: 1px solid rgba(255, 120, 175, 0.22);
      border-radius: 15px;
      padding: 14px 10px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
    }
    .teaser-chip-icon { font-size: 22px; }
    .teaser-chip-title {
      font-size: 12px;
      font-weight: 850;
      color: var(--text-dark);
    }
    .teaser-chip-sub {
      font-size: 10.5px;
      color: var(--text-muted);
    }

    /* Action Buttons Row */
    .teaser-actions-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      width: 100%;
      max-width: 440px;
      flex-wrap: wrap;
    }
    .btn-teaser-primary {
      flex: 1.2;
      background: var(--rose-gradient);
      color: #fff;
      text-decoration: none;
      padding: 12px 20px;
      border-radius: 99px;
      font-size: 13px;
      font-weight: 850;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      box-shadow: 0 6px 20px rgba(255, 42, 122, 0.32);
      transition: all 0.2s;
      min-height: 44px;
      white-space: nowrap;
    }
    .btn-teaser-primary:hover {
      transform: translateY(-1.5px);
      box-shadow: 0 8px 24px rgba(255, 42, 122, 0.45);
    }
    .btn-teaser-secondary {
      flex: 1;
      background: #ffffff;
      border: 1.5px solid var(--border-pink);
      color: var(--text-dark);
      text-decoration: none;
      padding: 12px 18px;
      border-radius: 99px;
      font-size: 13px;
      font-weight: 800;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: all 0.2s;
      min-height: 44px;
      white-space: nowrap;
    }
    .btn-teaser-secondary:hover {
      border-color: var(--rose-main);
      color: var(--rose-main);
      transform: translateY(-1.5px);
    }
  </style>
</head>

<body>
  <div class="ambient-orb orb-1"></div>
  <div class="ambient-orb orb-2"></div>

  <!-- Top Header -->
  <header class="app-header">
    <a href="index.html" class="header-brand" title="Vanvi Moments">
      <span class="brand-spark-icon">✨</span>
      <div class="brand-title">VANVI <span>♡</span> MOMENTS</div>
      <span class="brand-tag">WORKSHOP</span>
    </a>

    <div class="header-actions">
      <a href="templates.html" class="header-btn" title="Explore Active Templates">
        <span>🎨</span> Templates
      </a>
    </div>
  </header>

  <!-- Navigation Breadcrumb -->
  <nav class="nav-breadcrumbs" aria-label="Breadcrumb Navigation">
    <button type="button" class="btn-nav-back" onclick="safeGoBack()">
      <span style="color:var(--rose-main); font-size:14px; font-weight:900;">‹</span> <span>Back</span>
    </button>
    <div class="luxury-trail-chip">
      <span>🏠 Home</span>
      <span style="color:rgba(255,42,122,0.4); font-size:9px;">✦</span>
      <span id="breadcrumbCurrent" style="color:var(--rose-main); font-weight:800;">Artisan Workshop</span>
    </div>
  </nav>

  <!-- Main Showcase Stage -->
  <main class="teaser-main">

    <!-- Tab Switcher -->
    <div class="teaser-tabs-row">
      <button type="button" class="teaser-tab-btn active" id="tabCards" onclick="switchTeaserTab('cards')">
        <span>💌</span> Interactive Cards
      </button>
      <button type="button" class="teaser-tab-btn" id="tabMagazine" onclick="switchTeaserTab('magazine')">
        <span>📖</span> Digital E-Magazine
      </button>
    </div>

    <div class="teaser-card">
      
      <!-- Floating Glass Capsule -->
      <div class="floating-capsule" id="capsuleIcon" aria-hidden="true">
        <span>💌</span>
      </div>

      <div class="teaser-kicker" id="teaserBadge">
        <span>✦</span> Handcrafted with Love ✦
      </div>

      <h1 class="teaser-title" id="teaserTitle">
        Interactive Greeting Cards <span>Coming Soon.</span>
      </h1>

      <div class="teaser-heartfelt-msg">
        <p id="teaserMessage">
          <strong>Thank you so much for your excitement &amp; love! 💖</strong><br/>
          Our creative artisans and emotion architects are pouring their hearts into crafting 3D pop-up greeting cards with realistic wax seal unboxing, handwritten typography, custom voice notes, and emotional music tracks. We can't wait for your loved ones to experience it!
        </p>
      </div>

      <!-- VIP Notify Box -->
      <div class="notify-form-box">
        <div class="notify-title">
          <span>👑</span> Get First-Access VIP Invite
        </div>
        <div class="notify-sub">Be the first to create this keepsake + get 50 bonus celebration coins.</div>

        <form id="notifyForm" onsubmit="handleNotifySubmit(event)">
          <div class="notify-input-group">
            <input type="text" class="notify-input" id="notifyInput" placeholder="Enter your WhatsApp number or email" required/>
            <button type="submit" class="btn-notify-submit">Notify Me ✨</button>
          </div>
          <div class="notify-feedback" id="notifyFeedback">
            ✓ Thank you! You're on our priority VIP list. We'll send you an early access invite the moment it goes live!
          </div>
        </form>
      </div>

      <!-- Sneak Peek Features -->
      <div class="teaser-chips-grid" id="teaserChips">
        <div class="teaser-chip">
          <span class="teaser-chip-icon">💌</span>
          <div>
            <div class="teaser-chip-title">3D Pop-Out Envelopes</div>
            <div class="teaser-chip-sub">Wax seals &amp; folding keepsakes</div>
          </div>
        </div>

        <div class="teaser-chip">
          <span class="teaser-chip-icon">🎵</span>
          <div>
            <div class="teaser-chip-title">Custom Voice &amp; Soundtrack</div>
            <div class="teaser-chip-sub">Record personal audio messages</div>
          </div>
        </div>

        <div class="teaser-chip">
          <span class="teaser-chip-icon">✨</span>
          <div>
            <div class="teaser-chip-title">Interactive Rituals</div>
            <div class="teaser-chip-sub">Blow digital candles &amp; tap stars</div>
          </div>
        </div>
      </div>

      <!-- Action Buttons Row -->
      <div class="teaser-actions-row">
        <a href="templates.html" class="btn-teaser-primary">
          <span>✨ Explore Live Templates</span> <span>→</span>
        </a>
        <a href="products.html" class="btn-teaser-secondary">
          <span>🎁 Physical Gifts</span>
        </a>
      </div>

    </div>
  </main>

  <!-- Global Bottom Navigation Dock -->
  <nav class="bottom vanvi-bottom-dock" aria-label="Vanvi Main Navigation">
    <a href="index.html" class="nav-btn" id="bottomNavHome">⌂<br/>Home</a>
    <a href="templates.html" class="nav-btn" id="bottomNavExplore">◌<br/>Explore</a>
    <a href="builder.html" class="create nav-btn" id="bottomNavCreate">＋<br/>Create</a>
    <a href="ai.html" class="nav-btn" id="bottomNavAi">✦<br/>AI</a>
    <a href="profile.html" class="nav-btn" id="bottomNavMe">👤<br/>Profile</a>
  </nav>

  <script src="js/vanvi-navigation.js"></script>

  <script>
    const teaserData = {
      cards: {
        icon: '💌',
        badge: '✦ Artisan Greeting Cards ✦',
        title: 'Interactive Greeting Cards <span>Coming Soon.</span>',
        message: '<strong>Thank you so much for your excitement & love! 💖</strong><br/>Our creative artisans are handcrafting 3D pop-up celebration cards with realistic wax seal opening, personal voice memos, handwriting fonts, and sentimental music. Every card will feel like holding a heartfelt physical letter in your hands!',
        chips: [
          { icon: '💌', title: '3D Pop-Out Envelopes', sub: 'Wax seals & realistic folding' },
          { icon: '🎵', title: 'Custom Voice & Sound', sub: 'Record heartfelt voice notes' },
          { icon: '✨', title: 'Candle & Star Touch', sub: 'Blow candles & reveal hidden wishes' }
        ]
      },
      magazine: {
        icon: '📖',
        badge: '✦ Keepsake Editorial ✦',
        title: 'Digital Anniversary E-Magazine <span>Coming Soon.</span>',
        message: '<strong>Thank you for your love and interest! 💖</strong><br/>We are building luxury digital celebration magazines inspired by haute couture fashion editions. Feature your couple milestones, high-resolution photo galleries, romantic timelines, and love quotes in a digital flipbook designed to be cherished for a lifetime.',
        chips: [
          { icon: '📖', title: 'Interactive Flipbook Pages', sub: 'Realistic 3D paper turning' },
          { icon: '📸', title: 'Editorial Photo Spreads', sub: 'Magazine-quality milestone layouts' },
          { icon: '👑', title: 'Private Keepsake Link', sub: 'Password protected VIP edition' }
        ]
      }
    };

    function switchTeaserTab(type) {
      const data = teaserData[type] || teaserData.cards;
      document.getElementById('capsuleIcon').innerHTML = `<span>\${data.icon}</span>`;
      document.getElementById('teaserBadge').innerHTML = `<span>✦</span> \${data.badge}`;
      document.getElementById('teaserTitle').innerHTML = data.title;
      document.getElementById('teaserMessage').innerHTML = data.message;
      document.getElementById('breadcrumbCurrent').textContent = type === 'magazine' ? 'E-Magazine' : 'Greeting Cards';

      const chipsContainer = document.getElementById('teaserChips');
      chipsContainer.innerHTML = data.chips.map(c => \`
        <div class="teaser-chip">
          <span class="teaser-chip-icon">\${c.icon}</span>
          <div>
            <div class="teaser-chip-title">\${c.title}</div>
            <div class="teaser-chip-sub">\${c.sub}</div>
          </div>
        </div>
      \`).join('');

      document.getElementById('tabCards').classList.toggle('active', type === 'cards');
      document.getElementById('tabMagazine').classList.toggle('active', type === 'magazine');
    }

    // Auto-detect URL parameter ?type=magazine or ?type=cards
    window.addEventListener('DOMContentLoaded', () => {
      const params = new URLSearchParams(window.location.search);
      const type = params.get('type') || 'cards';
      switchTeaserTab(type);
    });

    function handleNotifySubmit(e) {
      e.preventDefault();
      const val = document.getElementById('notifyInput').value.trim();
      if (!val) return;

      try {
        const stored = JSON.parse(localStorage.getItem('vanvi_vip_notify_list') || '[]');
        stored.push({ contact: val, date: new Date().toISOString() });
        localStorage.setItem('vanvi_vip_notify_list', JSON.stringify(stored));
      } catch(err) {}

      document.getElementById('notifyInput').value = '';
      const feedback = document.getElementById('notifyFeedback');
      feedback.style.display = 'block';
    }

    function safeGoBack() {
      try {
        if (window.history && window.history.length > 1 && document.referrer && document.referrer.indexOf(window.location.host) !== -1) {
          window.history.back();
        } else if (typeof window.vanviGoBack === 'function') {
          window.vanviGoBack('index.html');
        } else {
          window.location.href = 'index.html';
        }
      } catch(e) {
        window.location.href = 'index.html';
      }
    }
  </script>
</body>
</html>
`;

fs.writeFileSync(filePath, newComingSoonHtml, 'utf8');
console.log('✓ Successfully created upgraded coming-soon.html with Cards + Magazine support!');
