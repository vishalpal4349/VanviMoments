const fs = require('fs');
const path = require('path');

const authFiles = ['login.html', 'signup.html', 'forgot-password.html'];

authFiles.forEach(fileName => {
  const filePath = path.join(__dirname, '..', fileName);
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${fileName}`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');

  // Add theme toggle script if not present
  if (!content.includes('data-vanvi-theme') || !content.includes('initAuthTheme')) {
    const themeInitScript = `
<script>
  (function initAuthTheme() {
    try {
      const savedTheme = localStorage.getItem('vanvi_theme_preference') || localStorage.getItem('vanvi_night_theme') || 'light';
      if (savedTheme === 'emerald' || savedTheme === 'dark' || savedTheme === 'night') {
        document.documentElement.setAttribute('data-vanvi-theme', savedTheme);
      } else {
        document.documentElement.setAttribute('data-vanvi-theme', 'light');
      }
    } catch(e) {}
  })();
</script>
`;
    content = content.replace('<head>', `<head>${themeInitScript}`);
  }

  // Dual theme CSS definition
  const dualThemeCss = `
  <style>
    /* ==========================================================================
       VANVI AUTH LUXURY DUAL THEME (LIGHT BLUSH & OBSIDIAN EMERALD)
       ========================================================================== */
    :root {
      --bg-pearl: #fffdfb;
      --bg-blush: #fff1f6;
      --bg-card: rgba(255, 255, 255, 0.96);
      --rose-main: #ff2a7a;
      --rose-gradient: linear-gradient(135deg, #ff2a7a 0%, #ff529a 50%, #d97706 100%);
      --gold-champagne: #d4af37;
      --text-dark: #2c1224;
      --text-muted: #78536d;
      --border-pink: rgba(255, 120, 175, 0.32);
      --font-sans: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      --font-serif: 'Playfair Display', 'Cormorant Garamond', Georgia, serif;
    }

    body {
      min-height: 100vh;
      background:
        radial-gradient(ellipse 90% 65% at 50% 12%, rgba(255, 225, 240, 0.85) 0%, rgba(255, 245, 250, 0.95) 75%),
        linear-gradient(180deg, #fff7fb 0%, #fff0f6 50%, #fbf5fc 100%);
      background-color: #fff7fb;
      font-family: var(--font-sans);
      color: var(--text-dark);
      overflow-x: hidden !important;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 14px 16px 28px;
      position: relative;
      transition: background 0.3s ease, color 0.3s ease;
    }

    /* Auth Card default: Luxury Pearl White with Rose & Gold Glow */
    .auth-card {
      background: rgba(255, 255, 255, 0.96) !important;
      border: 1.5px solid rgba(255, 120, 175, 0.35) !important;
      color: #2c1224 !important;
      box-shadow: 0 24px 70px rgba(255, 42, 122, 0.12), 0 4px 18px rgba(0, 0, 0, 0.04) !important;
    }
    .auth-card h1, .auth-card h2, .auth-card .auth-title {
      color: #2c1224 !important;
    }
    .auth-card p, .auth-card .auth-sub {
      color: #78536d !important;
    }
    .auth-card input {
      background: #ffffff !important;
      border-color: rgba(255, 120, 175, 0.32) !important;
      color: #2c1224 !important;
    }
    .auth-card input:focus {
      border-color: #ff2a7a !important;
      box-shadow: 0 0 0 3px rgba(255, 42, 122, 0.15) !important;
    }

    /* ==========================================================================
       EMERALD OBSIDIAN NIGHT MODE (Activated when data-vanvi-theme="dark" / "emerald")
       ========================================================================== */
    html[data-vanvi-theme="dark"] body,
    html[data-vanvi-theme="emerald"] body,
    html[data-vanvi-theme="night"] body {
      background:
        radial-gradient(ellipse 90% 65% at 50% 12%, rgba(13, 38, 30, 0.94) 0%, rgba(6, 19, 15, 0.98) 75%),
        url('assets/user-ref.jpg') center bottom / cover no-repeat fixed !important;
      background-color: #061510 !important;
      color: #f8fafc !important;
    }

    html[data-vanvi-theme="dark"] .auth-card,
    html[data-vanvi-theme="emerald"] .auth-card,
    html[data-vanvi-theme="night"] .auth-card {
      background: linear-gradient(165deg, rgba(11, 30, 24, 0.92) 0%, rgba(7, 21, 16, 0.96) 100%) !important;
      border: 1.5px solid rgba(212, 175, 55, 0.42) !important;
      color: #f8fafc !important;
      box-shadow: 0 30px 80px -10px rgba(0, 0, 0, 0.8), 0 0 40px rgba(16, 185, 129, 0.16) !important;
    }

    html[data-vanvi-theme="dark"] .auth-card h1,
    html[data-vanvi-theme="dark"] .auth-card h2,
    html[data-vanvi-theme="dark"] .auth-card .auth-title,
    html[data-vanvi-theme="emerald"] .auth-card h1,
    html[data-vanvi-theme="emerald"] .auth-card h2,
    html[data-vanvi-theme="emerald"] .auth-card .auth-title {
      color: #f8fafc !important;
    }

    html[data-vanvi-theme="dark"] .auth-card p,
    html[data-vanvi-theme="dark"] .auth-card .auth-sub,
    html[data-vanvi-theme="emerald"] .auth-card p,
    html[data-vanvi-theme="emerald"] .auth-card .auth-sub {
      color: #94a3b8 !important;
    }

    html[data-vanvi-theme="dark"] .auth-card input,
    html[data-vanvi-theme="emerald"] .auth-card input {
      background: rgba(6, 19, 15, 0.85) !important;
      border-color: rgba(212, 175, 55, 0.35) !important;
      color: #f8fafc !important;
    }

    html[data-vanvi-theme="dark"] .auth-card input:focus,
    html[data-vanvi-theme="emerald"] .auth-card input:focus {
      border-color: #10b981 !important;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.22) !important;
    }
  </style>
`;

  // Inject dualThemeCss right before </head>
  content = content.replace('</head>', `${dualThemeCss}\n</head>`);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✓ Upgraded ${fileName} with luxury dual theme (light pearl by default, emerald obsidian in dark mode)`);
});
