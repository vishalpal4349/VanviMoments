const fs = require('fs');
const path = require('path');

function log(msg) {
  console.log('[3D-CLAY-POLISH]', msg);
}

// -------------------------------------------------------------
// 1. UPDATE css/vanvi-global-experience.css (Universal 3D Clay System)
// -------------------------------------------------------------
const cssPath = path.resolve('css/vanvi-global-experience.css');
let css = fs.readFileSync(cssPath, 'utf8');

const claySystemCss = `
/* ─── 12. UNIVERSAL 3D CLAY TACTILE SYSTEM (MASTER v1.8.1) ─── */
.vanvi-clay-card,
.clay-card {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 246, 251, 0.96) 100%) !important;
  border: 1.5px solid rgba(255, 120, 175, 0.32) !important;
  border-radius: 26px !important;
  box-shadow: 
    0 16px 40px -8px rgba(255, 42, 122, 0.12),
    0 4px 12px rgba(44, 18, 36, 0.03),
    inset 0 2.5px 3px #ffffff,
    inset 0 -2.5px 3px rgba(0, 0, 0, 0.02) !important;
  transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.28s ease !important;
}

.vanvi-clay-card:hover,
.clay-card:hover {
  transform: translateY(-2.5px) !important;
  box-shadow: 
    0 22px 52px -10px rgba(255, 42, 122, 0.18),
    0 6px 16px rgba(44, 18, 36, 0.05),
    inset 0 2.5px 3px #ffffff !important;
}

.vanvi-clay-btn,
.clay-btn {
  background: linear-gradient(135deg, #ff2a7a 0%, #ff529a 50%, #9333ea 100%) !important;
  color: #ffffff !important;
  border: 1.5px solid rgba(255, 255, 255, 0.75) !important;
  border-radius: 99px !important;
  padding: 10px 22px !important;
  font-weight: 850 !important;
  box-shadow: 
    0 6px 18px rgba(255, 42, 122, 0.32),
    inset 0 2px 2px rgba(255, 255, 255, 0.75),
    inset 0 -2px 3px rgba(0, 0, 0, 0.15) !important;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.2s ease, box-shadow 0.2s ease !important;
}

.vanvi-clay-btn:hover,
.clay-btn:hover {
  transform: translateY(-1.5px) !important;
  filter: brightness(1.06) !important;
  box-shadow: 
    0 10px 24px rgba(255, 42, 122, 0.42),
    inset 0 2px 2px rgba(255, 255, 255, 0.85) !important;
}

.vanvi-clay-btn:active,
.clay-btn:active {
  transform: scale(0.97) translateY(0) !important;
  box-shadow: 
    0 2px 8px rgba(255, 42, 122, 0.25),
    inset 0 2px 4px rgba(0, 0, 0, 0.2) !important;
}

.vanvi-clay-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #ffffff;
  border: 1px solid rgba(255, 120, 175, 0.35);
  border-radius: 99px;
  padding: 5px 14px;
  font-size: 12px;
  font-weight: 800;
  color: #2c1224;
  box-shadow: 0 3px 10px rgba(44, 18, 36, 0.04), inset 0 1px 1px #fff;
  transition: all 0.2s ease;
}

.vanvi-clay-pill:hover {
  border-color: #ff2a7a;
  transform: translateY(-1px);
  box-shadow: 0 5px 14px rgba(255, 42, 122, 0.15);
}
`;

if (!css.includes('UNIVERSAL 3D CLAY TACTILE SYSTEM')) {
  css += '\n' + claySystemCss;
  fs.writeFileSync(cssPath, css, 'utf8');
  log('Universal 3D Clay System appended to css/vanvi-global-experience.css');
}

// -------------------------------------------------------------
// 2. UPDATE rewards.html (Ultra 3D Clay Wheel & Tactile Hub)
// -------------------------------------------------------------
const rewPath = path.resolve('rewards.html');
let rew = fs.readFileSync(rewPath, 'utf8');

const oldWheelCssRegex = /\.wheel-stage\s*\{[\s\S]*?\.wheel-status-bar\s*\{/;
const newWheelCss = `.wheel-stage {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 18px 0 24px;
      position: relative;
      perspective: 1000px;
    }
    .wheel-outer-ring {
      position: relative;
      width: 270px;
      height: 270px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: radial-gradient(circle at 35% 35%, #fffdf5 0%, #fef3c7 35%, #f59e0b 70%, #92400e 100%);
      padding: 10px;
      box-shadow: 
        0 24px 60px -12px rgba(217, 119, 6, 0.45),
        0 12px 28px rgba(255, 42, 122, 0.22),
        inset 0 3px 6px #ffffff,
        inset 0 -5px 10px rgba(120, 53, 15, 0.45),
        0 0 0 3px #ffffff;
      transition: transform 0.3s ease;
    }
    .wheel-outer-ring:hover {
      transform: translateY(-2px);
    }
    .wheel-pointer {
      position: absolute;
      top: -14px;
      z-index: 35;
      filter: drop-shadow(0 6px 10px rgba(0,0,0,0.35));
      pointer-events: none;
      animation: pointerWobble 2s ease-in-out infinite alternate;
    }
    @keyframes pointerWobble {
      0% { transform: translateY(0); }
      100% { transform: translateY(1.5px); }
    }
    .wheel-pointer svg {
      width: 26px;
      height: 32px;
      display: block;
    }
    .wheel-disc-frame {
      width: 244px;
      height: 244px;
      border-radius: 50%;
      padding: 8px;
      box-sizing: border-box;
      background: radial-gradient(circle at 30% 30%, #ffffff 0%, #fef3c7 40%, #d97706 90%, #78350f 100%);
      border: 2.5px solid rgba(255, 255, 255, 0.95);
      box-shadow: 
        inset 0 4px 8px rgba(0, 0, 0, 0.4),
        inset 0 -2px 4px #ffffff,
        0 8px 18px rgba(0, 0, 0, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    .wheel-disc {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      position: relative;
      overflow: hidden;
      background: conic-gradient(
        #ff1493 0deg 25.7deg,
        #f59e0b 25.7deg 51.4deg,
        #06b6d4 51.4deg 77.1deg,
        #8b5cf6 77.1deg 102.8deg,
        #ec4899 102.8deg 128.5deg,
        #10b981 128.5deg 154.2deg,
        #f97316 154.2deg 180.0deg,
        #3b82f6 180.0deg 205.7deg,
        #a855f7 205.7deg 231.4deg,
        #fb7185 231.4deg 257.1deg,
        #6366f1 257.1deg 282.8deg,
        #eab308 282.8deg 308.5deg,
        #14b8a6 308.5deg 334.2deg,
        #e11d48 334.2deg 360.0deg
      );
      box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.45);
      transition: transform 4.5s cubic-bezier(0.12, 0.9, 0.28, 1);
      will-change: transform;
    }
    .wheel-slice {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      pointer-events: none;
    }
    .slice-label {
      margin-top: 10px;
      font-size: 10.5px;
      font-weight: 900;
      color: #ffffff;
      text-shadow: 0 1px 4px rgba(0,0,0,0.85);
      letter-spacing: 0.3px;
    }
    .wheel-center-hub {
      position: absolute;
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: radial-gradient(circle at 35% 30%, #ffffff 0%, #fef08a 30%, #f59e0b 65%, #b45309 100%);
      border: 4px solid #ffffff;
      box-shadow: 
        0 6px 20px rgba(0,0,0,0.35),
        0 0 22px rgba(245, 158, 11, 0.7),
        inset 0 3px 4px #ffffff,
        inset 0 -3px 5px rgba(120, 53, 15, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 25;
      user-select: none;
      transition: transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.18s ease;
      animation: hubPulse 2.4s ease-in-out infinite;
    }
    @keyframes hubPulse {
      0%, 100% { box-shadow: 0 6px 20px rgba(0,0,0,0.35), 0 0 22px rgba(245, 158, 11, 0.5); }
      50% { box-shadow: 0 8px 26px rgba(0,0,0,0.4), 0 0 30px rgba(245, 158, 11, 0.9); }
    }
    .wheel-center-hub:hover:not(.disabled) { 
      transform: scale(1.1);
      box-shadow: 0 10px 30px rgba(245, 158, 11, 0.9), inset 0 3px 5px #ffffff;
    }
    .wheel-center-hub:active:not(.disabled) {
      transform: scale(0.94);
      box-shadow: 0 2px 8px rgba(0,0,0,0.4), inset 0 3px 6px rgba(0,0,0,0.35);
    }
    .wheel-center-hub.disabled { opacity: 0.7; cursor: not-allowed; animation: none; }
    .hub-txt { font-size: 13px; font-weight: 900; color: #78350f; text-shadow: 0 1px 1px #fff; }

    .wheel-status-bar {`;

if (oldWheelCssRegex.test(rew)) {
  rew = rew.replace(oldWheelCssRegex, newWheelCss);
  log('Updated wheel styling in rewards.html with 3D tactile bevels');
}

// 3D polish for coin hero card & quick hub pills in rewards.html
const oldCoinHeroCssRegex = /\.coin-hero-card\s*\{[\s\S]*?padding:\s*24px\s*20px;/;
const newCoinHeroCss = `.coin-hero-card {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 245, 250, 0.98) 100%);
      border: 1.5px solid rgba(255, 120, 175, 0.35);
      border-radius: 28px;
      padding: 26px 20px;
      box-shadow: 
        0 20px 48px -10px rgba(255, 42, 122, 0.14),
        0 6px 16px rgba(44, 18, 36, 0.04),
        inset 0 2.5px 3px #ffffff,
        inset 0 -2.5px 3px rgba(0, 0, 0, 0.02);`;

if (oldCoinHeroCssRegex.test(rew)) {
  rew = rew.replace(oldCoinHeroCssRegex, newCoinHeroCss);
  log('Enriched coin-hero-card with 3D clay depth');
}

fs.writeFileSync(rewPath, rew, 'utf8');
log('rewards.html saved successfully');

// -------------------------------------------------------------
// 3. UPDATE profile.html (Clean Top Header & 3D Clay Hero Card)
// -------------------------------------------------------------
const profPath = path.resolve('profile.html');
let prof = fs.readFileSync(profPath, 'utf8');

// Replace cluttered app-header & breadcrumbs with single sleek luxury bar
const oldProfHeaderAndBreadcrumbRegex = /<header class="app-header">[\s\S]*?<\/nav>/;
const newProfHeader = `<header class="app-header" style="max-width:820px; margin:0 auto; padding:12px 18px; display:flex; align-items:center; justify-content:space-between; gap:12px; background:rgba(255,255,255,0.94); backdrop-filter:blur(20px); border-radius:99px; border:1px solid var(--border-pink); box-shadow:0 4px 20px rgba(44,18,36,0.06); position:sticky; top:12px; z-index:100;">
    <a class="vanvi-btn-back" href="javascript:void(0)" onclick="if (history.length > 1) { history.back(); } else { location.href='index.html'; }" style="display:inline-flex; align-items:center; gap:5px; text-decoration:none; font-size:12px; font-weight:800; color:var(--text-dark); background:#ffffff; padding:6px 14px; border-radius:99px; border:1px solid var(--border-pink); box-shadow:0 2px 6px rgba(0,0,0,0.04); transition:all 0.2s;">
      <span style="color:var(--rose-main); font-size:15px; font-weight:900;">‹</span> <span>Back</span>
    </a>

    <a href="index.html" class="header-brand" title="Vanvi Moments" style="display:inline-flex; align-items:center; gap:8px; text-decoration:none;">
      <svg class="brand-spark" fill="none" viewBox="0 0 26 26" style="width:24px; height:24px; flex-shrink:0;">
        <defs>
          <linearGradient id="profSpark" x1="0%" x2="100%" y1="0%" x2="100%">
            <stop offset="0%" stop-color="#ff2a7a"/>
            <stop offset="50%" stop-color="#ff7ea5"/>
            <stop offset="100%" stop-color="#d97706"/>
          </linearGradient>
        </defs>
        <path d="M13 2 C13 7.8 15.2 10 21 13 C15.2 16 13 18.2 13 24 C13 18.2 10.8 16 5 13 C10.8 10 13 7.8 13 2 Z" fill="url(#profSpark)"/>
        <circle cx="13" cy="13" fill="#ffffff" r="2.8"/>
        <circle cx="13" cy="13" fill="#ff2a7a" r="1.5"/>
      </svg>
      <span style="font-family:'Cormorant Garamond', Georgia, serif; font-size:18px; font-weight:800; background:linear-gradient(135deg, #2c1224 0%, #ff2a7a 60%, #9333ea 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">Vanvi Moments</span>
    </a>

    <div class="header-actions">
      <button type="button" class="header-btn" onclick="openEditModal()" style="display:inline-flex; align-items:center; gap:6px; background:linear-gradient(135deg, #ff2a7a, #9333ea); color:#ffffff; font-size:12px; font-weight:850; padding:7px 16px; border-radius:99px; border:none; box-shadow:0 4px 14px rgba(255,42,122,0.3), inset 0 1px 1px rgba(255,255,255,0.6); cursor:pointer;">
        <span>✏️</span> Edit Profile
      </button>
    </div>
  </header>`;

if (oldProfHeaderAndBreadcrumbRegex.test(prof)) {
  prof = prof.replace(oldProfHeaderAndBreadcrumbRegex, newProfHeader);
  log('Streamlined profile.html header & removed redundant breadcrumb clutter');
}

// 3D Clay polish for .profile-hero-card in profile.html
const oldProfHeroCssRegex = /\.profile-hero-card\s*\{[\s\S]*?padding:\s*24px\s*20px\s*20px;/;
const newProfHeroCss = `.profile-hero-card {
      background: linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 246, 250, 0.98) 100%);
      border: 1.5px solid rgba(255, 120, 175, 0.35);
      border-radius: 32px;
      padding: 28px 22px 24px;
      text-align: center;
      box-shadow: 
        0 20px 50px -10px rgba(255, 42, 122, 0.12),
        0 4px 16px rgba(0, 0, 0, 0.03),
        inset 0 2.5px 3px #ffffff,
        inset 0 -2.5px 4px rgba(0, 0, 0, 0.02);`;

if (oldProfHeroCssRegex.test(prof)) {
  prof = prof.replace(oldProfHeroCssRegex, newProfHeroCss);
  log('Upgraded profile-hero-card to 3D clay aesthetic');
}

// 3D Avatar circle in profile.html
const oldAvatarCssRegex = /\.avatar-circle\s*\{[\s\S]*?overflow:\s*hidden;\s*\}/;
const newAvatarCss = `.avatar-circle {
      width: 100%;
      height: 100%;
      border-radius: 30px;
      display: grid;
      place-items: center;
      background: linear-gradient(135deg, #ff2a7a 0%, #ff529a 45%, #9333ea 100%);
      color: #fff;
      font-size: 34px;
      font-weight: 850;
      border: 4px solid #ffffff;
      box-shadow: 
        0 14px 30px rgba(255, 42, 122, 0.35),
        inset 0 3px 3px rgba(255, 255, 255, 0.7),
        inset 0 -3px 4px rgba(0, 0, 0, 0.15);
      user-select: none;
      transition: transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
      overflow: hidden;
    }`;

if (oldAvatarCssRegex.test(prof)) {
  prof = prof.replace(oldAvatarCssRegex, newAvatarCss);
  log('Upgraded avatar-circle to 3D clay aesthetic in profile.html');
}

fs.writeFileSync(profPath, prof, 'utf8');
log('profile.html saved successfully');

// -------------------------------------------------------------
// 4. UPDATE refer.html (3D Clay Referral Cards & Calculator)
// -------------------------------------------------------------
const refPath = path.resolve('refer.html');
let ref = fs.readFileSync(refPath, 'utf8');

const oldReferHeroCssRegex = /\.refer-hero\s*\{[\s\S]*?padding:\s*34px\s*24px;/;
const newReferHeroCss = `.refer-hero {
      background: linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 246, 250, 0.98) 100%);
      border: 1.5px solid rgba(255, 120, 175, 0.32);
      border-radius: 32px;
      box-shadow: 
        0 20px 50px -10px rgba(255, 42, 122, 0.12),
        0 4px 16px rgba(44, 18, 36, 0.03),
        inset 0 2.5px 3px #ffffff;
      padding: 34px 24px;`;

if (oldReferHeroCssRegex.test(ref)) {
  ref = ref.replace(oldReferHeroCssRegex, newReferHeroCss);
  log('Enriched refer-hero with 3D clay depth');
}

const oldCalcCardCssRegex = /\.calc-card\s*\{[\s\S]*?padding:\s*24px;/;
const newCalcCardCss = `.calc-card {
      background: linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 248, 252, 0.96) 100%);
      border: 1.5px solid rgba(255, 120, 175, 0.3);
      border-radius: 28px;
      box-shadow: 
        0 18px 44px -8px rgba(255, 42, 122, 0.1),
        inset 0 2px 3px #ffffff;
      padding: 24px;`;

if (oldCalcCardCssRegex.test(ref)) {
  ref = ref.replace(oldCalcCardCssRegex, newCalcCardCss);
  log('Enriched calc-card with 3D clay depth in refer.html');
}

fs.writeFileSync(refPath, ref, 'utf8');
log('refer.html saved successfully');

// -------------------------------------------------------------
// 5. UPDATE plans.html (3D Clay Pricing Tiers)
// -------------------------------------------------------------
const plansPath = path.resolve('plans.html');
let plans = fs.readFileSync(plansPath, 'utf8');

const oldCompactCardCssRegex = /\.compact-slider-card\s*\{[\s\S]*?border-radius:\s*22px;[\s\S]*?box-shadow:\s*0\s*8px\s*26px\s*rgba\(255,\s*56,\s*128,\s*0\.06\);/;
const newCompactCardCss = `.compact-slider-card {
  flex: 0 0 calc(33.333% - 11px);
  min-width: 285px;
  max-width: 360px;
  scroll-snap-align: start;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.98), rgba(255, 248, 252, 0.98));
  border: 1.5px solid rgba(255, 120, 175, 0.3);
  border-radius: 26px;
  padding: 22px 20px;
  box-shadow: 
    0 16px 40px -8px rgba(255, 56, 128, 0.08),
    0 4px 12px rgba(44, 18, 36, 0.03),
    inset 0 2px 2px #ffffff;`;

if (oldCompactCardCssRegex.test(plans)) {
  plans = plans.replace(oldCompactCardCssRegex, newCompactCardCss);
  log('Enriched compact-slider-card with 3D clay in plans.html');
}

fs.writeFileSync(plansPath, plans, 'utf8');
log('plans.html saved successfully');

// -------------------------------------------------------------
// 6. UPDATE games.html (3D Clay Arcade Cards)
// -------------------------------------------------------------
const gamesPath = path.resolve('games.html');
let games = fs.readFileSync(gamesPath, 'utf8');

const oldGameCardCssRegex = /\.game-card\s*\{[\s\S]*?border-radius:\s*24px;[\s\S]*?box-shadow:\s*var\(--shadow-card\);/;
const newGameCardCss = `.game-card {
      background: linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 246, 250, 0.96) 100%);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-radius: 28px;
      padding: 22px;
      border: 1.5px solid rgba(255, 120, 175, 0.32);
      box-shadow: 
        0 16px 38px -8px rgba(255, 42, 122, 0.1),
        0 4px 12px rgba(44, 18, 36, 0.03),
        inset 0 2px 3px #ffffff;`;

if (oldGameCardCssRegex.test(games)) {
  games = games.replace(oldGameCardCssRegex, newGameCardCss);
  log('Enriched game-card with 3D clay depth in games.html');
}

fs.writeFileSync(gamesPath, games, 'utf8');
log('games.html saved successfully');

// -------------------------------------------------------------
// 7. UPDATE index.html (Slide 3 Daily Lucky Wheel 3D Clay Card)
// -------------------------------------------------------------
const indexPath = path.resolve('index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');

const oldSlide3Btn = `<a href="rewards.html" class="btn-showcase-cta cta-rose-gold">
            <span>Spin Wheel</span> <span>🎡 →</span>
          </a>`;

const newSlide3Btn = `<a href="rewards.html" class="btn-showcase-cta cta-rose-gold vanvi-clay-btn" style="box-shadow:0 8px 24px rgba(245,158,11,0.35), inset 0 2px 2px #ffffff; background:linear-gradient(135deg, #d97706, #f59e0b 50%, #ff2a7a 100%) !important;">
            <span>Spin Wheel</span> <span>🎡 →</span>
          </a>`;

if (indexHtml.includes(oldSlide3Btn)) {
  indexHtml = indexHtml.replace(oldSlide3Btn, newSlide3Btn);
  fs.writeFileSync(indexPath, indexHtml, 'utf8');
  log('Upgraded Slide 3 Daily Lucky Wheel CTA in index.html to 3D clay');
}

log('ALL 3D CLAY POLISH APPLIED CLEANLY ACROSS ECOSYSTEM!');
