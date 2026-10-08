/**
 * Template 3: birthday-celestial-stars
 * Interactive Constellation + Shooting Star Wish + Nebula Atmosphere
 */

const fs = require('fs');
const path = require('path');

module.exports = function buildCelestialStars(baseDir) {
  const tplDir = path.join(baseDir, 'birthday-celestial-stars');
  if (!fs.existsSync(tplDir)) fs.mkdirSync(tplDir, { recursive: true });
  const assetsDir = path.join(tplDir, 'assets');
  if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

  // 1. template.json
  const templateJson = {
    "id": "birthday-celestial-stars",
    "name": "Celestial Stars — The Cosmic Solar Return",
    "slug": "birthday-celestial-stars",
    "category": "Birthday",
    "categorySlug": "birthday",
    "price": 399,
    "originalPrice": 999,
    "isFree": false,
    "badge": "✨ Cosmic Masterpiece",
    "tier": "Signature",
    "isLuxury": true,
    "type": "Astral 18-Section Digital Starlight & Constellation Experience",
    "icon": "✨",
    "soundtrack": "Ambient Ethereal Space Synth & Harp Harmonics",
    "tags": ["birthday", "celestial", "constellation", "shooting-star", "astronomy", "zodiac", "space", "nebula"],
    "description": "Vanvi Moments Celestial Edition: 18-section astronomical birthday experience featuring an interactive canvas star map to connect your birthday constellation, shooting star make-a-wish wishing well, planetary memory orbits, and cosmic stardust audio.",
    "builder": {
      "type": "custom",
      "photoLimit": 8,
      "hasDate": true,
      "hasSoundtrack": true,
      "builderPath": "templates/birthday-celestial-stars/builder.html",
      "previewPath": "templates/birthday-celestial-stars/preview.html"
    },
    "sections": [
      "nebula-void-portal",
      "star-formed-name",
      "cosmic-coordinates",
      "solar-orbits-age",
      "celestial-welcome",
      "starlight-main-message",
      "interactive-constellation-map",
      "shooting-star-wishing-well",
      "universe-birth-lore",
      "star-cluster-gallery",
      "planetary-timeline",
      "ethereal-ambient-soundtrack",
      "floating-orbs-wishes",
      "zodiac-fortune-card",
      "supernova-gift-box",
      "solar-countdown",
      "starlight-qr-share",
      "astral-infinity-footer"
    ],
    "schema": {
      "fields": [
        { "key": "name", "label": "Birthday Person Name", "type": "text", "required": true, "default": "Mira Kapoor" },
        { "key": "age", "label": "Solar Orbits (Age)", "type": "number", "required": true, "default": 24 },
        { "key": "zodiac", "label": "Zodiac Sign", "type": "text", "required": true, "default": "Scorpio / Orion Alignment" },
        { "key": "birthDate", "label": "Date of Solar Return", "type": "text", "required": true, "default": "November 08" },
        { "key": "mainMessage", "label": "Cosmic Birthday Ode", "type": "textarea", "required": true, "default": "In a cosmos of 200 billion galaxies and trillions of stars, your existence is the most extraordinary miracle. Happy 24th Solar Return to a soul made entirely of starlight." },
        { "key": "sender", "label": "Sender Name(s)", "type": "text", "required": true, "default": "Dev & The Cosmos Collective" }
      ]
    }
  };
  fs.writeFileSync(path.join(tplDir, 'template.json'), JSON.stringify(templateJson, null, 2), 'utf8');

  // 2. style.css
  const styleCss = `/* ==========================================================================
   VANVI MOMENTS — BIRTHDAY CELESTIAL STARS
   Art Direction: Deep Void Obsidian • Nebula Violet • Starlight Silver • Stardust
   ========================================================================== */

:root {
  --bg-cosmos: #050512;
  --bg-card: rgba(15, 17, 38, 0.7);
  --nebula-purple: #7c3aed;
  --nebula-blue: #4338ca;
  --starlight-cyan: #38bdf8;
  --starlight-silver: #e2e8f0;
  --supernova-gold: #facc15;
  --text-primary: #f8fafc;
  --text-muted: #94a3b8;
  --border-cosmic: rgba(124, 58, 237, 0.35);
  --border-glass: rgba(255, 255, 255, 0.1);
  --font-serif: 'Cormorant Garamond', Georgia, serif;
  --font-display: 'Syne', sans-serif;
  --font-sans: 'Plus Jakarta Sans', system-ui, sans-serif;
}

* { margin: 0; padding: 0; box-sizing: border-box; }
html, body {
  background: var(--bg-cosmos);
  color: var(--text-primary);
  font-family: var(--font-sans);
  overflow-x: hidden;
  line-height: 1.6;
}

#star-canvas {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.page-wrapper {
  position: relative;
  z-index: 2;
  max-width: 680px;
  margin: 0 auto;
  padding: 0 20px 100px;
}

/* 1. Nebula Portal Overlay */
.portal-overlay {
  position: fixed;
  inset: 0;
  background: radial-gradient(circle at center, #1e1035 0%, #050512 80%);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 24px;
  transition: opacity 0.8s ease, visibility 0.8s;
}

.portal-overlay.opened {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

.portal-orb {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #e0e7ff 0%, #7c3aed 50%, #1e1b4b 100%);
  box-shadow: 0 0 50px rgba(124, 58, 237, 0.8);
  margin-bottom: 24px;
  animation: floatOrb 4s infinite ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 38px;
}

@keyframes floatOrb {
  0%, 100% { transform: translateY(0) scale(1); filter: drop-shadow(0 0 30px rgba(56, 189, 248, 0.5)); }
  50% { transform: translateY(-10px) scale(1.06); filter: drop-shadow(0 0 50px rgba(124, 58, 237, 0.8)); }
}

.btn-open-portal {
  background: linear-gradient(135deg, var(--starlight-cyan), var(--nebula-purple));
  color: #fff;
  border: 0;
  font-weight: 700;
  padding: 16px 36px;
  border-radius: 99px;
  cursor: pointer;
  box-shadow: 0 8px 30px rgba(124, 58, 237, 0.5);
  font-size: 14px;
}

/* 2. Hero Section */
.celestial-hero {
  padding-top: 60px;
  padding-bottom: 30px;
  text-align: center;
}

.hero-pill {
  display: inline-block;
  background: rgba(124, 58, 237, 0.15);
  border: 1px solid var(--border-cosmic);
  color: var(--starlight-cyan);
  padding: 6px 18px;
  border-radius: 99px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 20px;
}

.cosmic-name {
  font-family: var(--font-serif);
  font-size: 52px;
  font-weight: 700;
  background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 50%, var(--starlight-cyan) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.1;
  margin-bottom: 12px;
}

.cosmic-coords {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 18px;
}

.coord-tag {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-glass);
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 12px;
  color: var(--text-muted);
}

.coord-tag strong { color: var(--starlight-silver); }

/* Cosmic Card */
.cosmic-card {
  background: var(--bg-card);
  backdrop-filter: blur(12px);
  border: 1px solid var(--border-glass);
  border-radius: 20px;
  padding: 30px 24px;
  margin-top: 30px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);
  position: relative;
}

.cosmic-tag {
  font-family: var(--font-display);
  font-size: 10px;
  letter-spacing: 2px;
  color: var(--starlight-cyan);
  text-transform: uppercase;
  margin-bottom: 6px;
  display: block;
}

.cosmic-head {
  font-family: var(--font-serif);
  font-size: 26px;
  color: #fff;
  margin-bottom: 14px;
}

/* 7. Interactive Constellation Canvas */
.constellation-wrapper {
  background: radial-gradient(circle at center, #110e2e 0%, #050512 100%);
  border-radius: 16px;
  border: 1px solid var(--border-cosmic);
  padding: 16px;
  text-align: center;
  margin-top: 14px;
}

#constellation-canvas {
  width: 100%;
  height: 240px;
  border-radius: 12px;
  display: block;
  cursor: crosshair;
}

/* 8. Shooting Star Wishing Well */
.wishing-well-box {
  text-align: center;
  padding: 24px 16px;
  background: rgba(124, 58, 237, 0.08);
  border: 1px dashed var(--border-cosmic);
  border-radius: 16px;
  margin-top: 16px;
}

.btn-catch-star {
  background: linear-gradient(135deg, var(--supernova-gold), #eab308);
  color: #050512;
  font-weight: 800;
  padding: 14px 30px;
  border-radius: 99px;
  border: 0;
  cursor: pointer;
  font-size: 14px;
  box-shadow: 0 6px 20px rgba(250, 204, 21, 0.4);
}

/* 10. Star Cluster Gallery */
.star-gallery {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  margin-top: 14px;
}

.star-gallery-card {
  position: relative;
  aspect-ratio: 1/1;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid var(--border-glass);
}

.star-gallery-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s;
}

.star-gallery-card:hover img {
  transform: scale(1.08);
}

/* 16. Countdown Clock */
.cosmic-clock-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-top: 14px;
}

.clock-cell {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-glass);
  padding: 12px 6px;
  border-radius: 8px;
  text-align: center;
}

.clock-val {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 700;
  color: var(--starlight-cyan);
}

.clock-lbl {
  font-size: 9px;
  color: var(--text-muted);
  text-transform: uppercase;
}

/* Responsive */
@media (max-width: 480px) {
  .cosmic-name { font-size: 40px; }
  .cosmic-head { font-size: 22px; }
}
`;
  fs.writeFileSync(path.join(tplDir, 'style.css'), styleCss, 'utf8');

  // 3. script.js
  const scriptJs = `/* ==========================================================================
   VANVI MOMENTS — BIRTHDAY CELESTIAL STARS
   Interaction: Constellation Canvas + Shooting Star Particle Burst
   ========================================================================== */

(function() {
  'use strict';

  // 1. Portal Overlay
  const portal = document.getElementById('portal-overlay');
  const btnPortal = document.getElementById('btn-open-portal');
  if (btnPortal && portal) {
    btnPortal.addEventListener('click', () => {
      portal.classList.add('opened');
      playCelestialHarmonics();
    });
  }

  // 2. Synthesized Celestial Harp Sound
  function playCelestialHarmonics() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      [440, 554.37, 659.25, 880].forEach((freq, i) => {
        setTimeout(() => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          gain.gain.setValueAtTime(0.12, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 1.2);
        }, i * 160);
      });
    } catch(e) {}
  }

  // 3. Ambient Twinkling Canvas
  const bgCanvas = document.getElementById('star-canvas');
  if (bgCanvas) {
    const ctx = bgCanvas.getContext('2d');
    let w = bgCanvas.width = window.innerWidth;
    let h = bgCanvas.height = window.innerHeight;
    window.addEventListener('resize', () => {
      w = bgCanvas.width = window.innerWidth;
      h = bgCanvas.height = window.innerHeight;
    });

    const stars = Array.from({ length: 60 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.5,
      alpha: Math.random(),
      speed: Math.random() * 0.02 + 0.005
    }));

    function renderStars() {
      ctx.clearRect(0, 0, w, h);
      stars.forEach(s => {
        s.alpha += s.speed;
        const opacity = (Math.sin(s.alpha) + 1) / 2;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = \`rgba(226, 232, 240, \${opacity * 0.8})\`;
        ctx.fill();
      });
      requestAnimationFrame(renderStars);
    }
    renderStars();
  }

  // 4. Interactive Constellation Canvas
  const cCanvas = document.getElementById('constellation-canvas');
  if (cCanvas) {
    const ctx = cCanvas.getContext('2d');
    let cw = cCanvas.width = cCanvas.clientWidth || 300;
    let ch = cCanvas.height = 240;

    const points = [
      { x: cw * 0.2, y: ch * 0.3 },
      { x: cw * 0.4, y: ch * 0.15 },
      { x: cw * 0.65, y: ch * 0.4 },
      { x: cw * 0.8, y: ch * 0.25 },
      { x: cw * 0.5, y: ch * 0.75 }
    ];

    let connected = false;

    function drawConstellation() {
      ctx.clearRect(0, 0, cw, ch);

      // Lines
      if (connected) {
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();
      }

      // Star Points
      points.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, connected ? 6 : 4, 0, Math.PI * 2);
        ctx.fillStyle = connected ? '#facc15' : '#e2e8f0';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = connected ? 15 : 5;
        ctx.fill();
      });
    }

    drawConstellation();

    cCanvas.addEventListener('click', () => {
      connected = !connected;
      drawConstellation();
      playCelestialHarmonics();
      const status = document.getElementById('constellation-status');
      if (status) {
        status.innerText = connected ? '✨ Constellation Aligned: The Star of Mira is Glowing!' : 'Tap the stars to connect the constellation!';
      }
    });
  }

  // 5. Shooting Star Wish Interaction
  const btnCatch = document.getElementById('btn-catch-star');
  const wishBanner = document.getElementById('wish-banner');
  if (btnCatch) {
    btnCatch.addEventListener('click', () => {
      btnCatch.innerHTML = '🌟 Cosmic Wish Inscribed!';
      btnCatch.disabled = true;
      if (wishBanner) wishBanner.style.display = 'block';
      playCelestialHarmonics();
    });
  }

  // 6. Live Solar Countdown
  function updateCosmicCountdown() {
    const target = new Date(window.CELESTIAL_TARGET || '2026-11-08T00:00:00').getTime();
    const diff = target - new Date().getTime();
    if (diff > 0) {
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      const ed = document.getElementById('cel-days');
      const eh = document.getElementById('cel-hours');
      const em = document.getElementById('cel-mins');
      const es = document.getElementById('cel-secs');
      if (ed) ed.innerText = d;
      if (eh) eh.innerText = h;
      if (em) em.innerText = m;
      if (es) es.innerText = s;
    }
  }
  setInterval(updateCosmicCountdown, 1000);
  updateCosmicCountdown();

  // 7. Builder Live Sync
  window.addEventListener('message', (event) => {
    if (!event.data || typeof event.data !== 'object') return;
    const { type, payload } = event.data;
    if (type === 'VANVI_UPDATE_DATA' && payload) {
      if (payload.name) document.querySelectorAll('.val-name').forEach(el => el.innerText = payload.name);
      if (payload.age) document.querySelectorAll('.val-age').forEach(el => el.innerText = payload.age);
      if (payload.zodiac) document.querySelectorAll('.val-zodiac').forEach(el => el.innerText = payload.zodiac);
      if (payload.mainMessage) {
        const msg = document.querySelector('.val-cosmic-msg');
        if (msg) msg.innerText = payload.mainMessage;
      }
      if (payload.sender) document.querySelectorAll('.val-sender').forEach(el => el.innerText = payload.sender);
    }
  });

})();
`;
  fs.writeFileSync(path.join(tplDir, 'script.js'), scriptJs, 'utf8');

  // 4. index.html
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
  <title>Celestial Stars — The Cosmic Solar Return | Vanvi Moments</title>
  <link rel="icon" type="image/svg+xml" href="../../assets/favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,700;1,500&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <canvas id="star-canvas"></canvas>

  <!-- 1. Nebula Portal Overlay -->
  <div class="portal-overlay" id="portal-overlay">
    <div class="portal-orb">✨</div>
    <h2 style="font-family: var(--font-serif); font-size: 28px; color: var(--starlight-silver); margin-bottom: 8px;">THE CELESTIAL VAULT</h2>
    <p style="color: var(--text-muted); font-size: 13px; margin-bottom: 24px;">An astrological solar celebration for <span class="val-name">Mira Kapoor</span></p>
    <button class="btn-open-portal" id="btn-open-portal">ENTER THE COSMOS 🌌</button>
  </div>

  <div class="page-wrapper">
    <!-- 2. Cosmic Hero -->
    <header class="celestial-hero">
      <div class="hero-pill">✨ Solar Return Celebration</div>
      <h1 class="cosmic-name val-name">Mira Kapoor</h1>
      <p style="font-family: var(--font-serif); font-style: italic; color: var(--starlight-cyan); font-size: 18px;">
        "Stardust formed into human form, walking this earth with beauty"
      </p>

      <!-- 3 & 4. Coordinates & Orbits -->
      <div class="cosmic-coords">
        <div class="coord-tag">Solar Orbits: <strong class="val-age">24</strong></div>
        <div class="coord-tag">Zodiac: <strong class="val-zodiac">Scorpio / Orion</strong></div>
        <div class="coord-tag">Constellation: <strong>Cygnus Bright</strong></div>
      </div>
    </header>

    <!-- 5 & 6. Main Starlight Message -->
    <section class="cosmic-card">
      <span class="cosmic-tag">Astral Decree</span>
      <h2 class="cosmic-head">The Cosmos on Your Day</h2>
      <p class="val-cosmic-msg" style="font-size: 15px; color: var(--starlight-silver); line-height: 1.8;">
        In a cosmos of 200 billion galaxies and trillions of stars, your existence is the most extraordinary miracle. Happy 24th Solar Return to a soul made entirely of starlight.
      </p>
      <div style="margin-top: 16px; font-weight: 700; color: var(--starlight-cyan); text-align: right;">
        — <span class="val-sender">Dev & The Cosmos Collective</span>
      </div>
    </section>

    <!-- 7. Interactive Constellation Canvas -->
    <section class="cosmic-card">
      <span class="cosmic-tag">Interactive Starmap</span>
      <h2 class="cosmic-head">Your Birthday Constellation</h2>
      <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 12px;" id="constellation-status">
        Tap the stars below to trace your birthday constellation!
      </p>
      <div class="constellation-wrapper">
        <canvas id="constellation-canvas"></canvas>
      </div>
    </section>

    <!-- 8. Shooting Star Wishing Well -->
    <section class="cosmic-card">
      <span class="cosmic-tag">Cosmic Wishing Well</span>
      <h2 class="cosmic-head">Catch a Meteor & Make a Wish</h2>
      <div class="wishing-well-box">
        <p style="font-size: 13px; color: var(--starlight-silver); margin-bottom: 16px;">
          When a meteor streaks through the atmosphere, hold your deepest hope in mind and release it into the heavens.
        </p>
        <button class="btn-catch-star" id="btn-catch-star">🌠 Catch Shooting Star & Wish</button>
        <div id="wish-banner" style="display: none; margin-top: 14px; color: var(--supernova-gold); font-size: 13px; font-style: italic;">
          ✨ Your wish is orbiting through eternity. May the universe conspire to bring it to life!
        </div>
      </div>
    </section>

    <!-- 10. Star Cluster Gallery -->
    <section class="cosmic-card">
      <span class="cosmic-tag">Galactic Moments</span>
      <h2 class="cosmic-head">Portraits in Starlight</h2>
      <div class="star-gallery">
        <div class="star-gallery-card">
          <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80" alt="Nebula 1">
        </div>
        <div class="star-gallery-card">
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80" alt="Nebula 2">
        </div>
      </div>
    </section>

    <!-- 16. Countdown Clock -->
    <section class="cosmic-card">
      <span class="cosmic-tag">Solar Transit</span>
      <h2 class="cosmic-head">Next Solar Orbit Return</h2>
      <div class="cosmic-clock-grid">
        <div class="clock-cell">
          <div class="clock-val" id="cel-days">0</div>
          <div class="clock-lbl">Days</div>
        </div>
        <div class="clock-cell">
          <div class="clock-val" id="cel-hours">0</div>
          <div class="clock-lbl">Hours</div>
        </div>
        <div class="clock-cell">
          <div class="clock-val" id="cel-mins">0</div>
          <div class="clock-lbl">Mins</div>
        </div>
        <div class="clock-cell">
          <div class="clock-val" id="cel-secs">0</div>
          <div class="clock-lbl">Secs</div>
        </div>
      </div>
    </section>

    <!-- 18. Footer -->
    <footer style="text-align: center; margin-top: 40px; font-size: 12px; color: var(--text-muted);">
      <p>Inscribed upon the cosmos via <a href="../../index.html" style="color: var(--starlight-cyan); text-decoration: none;">Vanvi Moments</a></p>
      <p style="margin-top: 4px;">Vanvi Celestial Studio • Infinite Digital Keepsakes</p>
    </footer>
  </div>

  <script src="script.js"></script>
</body>
</html>
`;
  fs.writeFileSync(path.join(tplDir, 'index.html'), indexHtml, 'utf8');

  // 5. builder.html
  const builderHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Celestial Stars Studio | Vanvi Moments</title>
  <link rel="icon" type="image/svg+xml" href="../../assets/favicon.svg">
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=Plus+Jakarta+Sans:wght@500;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #050512; color: #fff; font-family: 'Plus Jakarta Sans', sans-serif; display: flex; flex-direction: column; min-height: 100vh; }
    .top-bar { background: #0d0d26; border-bottom: 1px solid rgba(124, 58, 237, 0.3); padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; }
    .studio-grid { display: grid; grid-template-columns: 460px 1fr; flex: 1; height: calc(100vh - 60px); }
    @media (max-width: 900px) { .studio-grid { grid-template-columns: 1fr; } .preview-pane { display: none; } }
    .editor-pane { background: #09091f; padding: 24px; overflow-y: auto; display: flex; flex-direction: column; gap: 18px; }
    .step-box { background: #111136; border-radius: 10px; padding: 16px; border: 1px solid rgba(124, 58, 237, 0.2); }
    .form-group { margin-bottom: 12px; }
    .form-group label { display: block; font-size: 11px; color: #94a3b8; margin-bottom: 4px; }
    .form-group input, .form-group textarea { width: 100%; background: #050512; border: 1px solid rgba(124, 58, 237, 0.4); color: #fff; padding: 10px; border-radius: 6px; font-family: inherit; font-size: 13px; }
    .preview-pane { background: #02020a; display: flex; align-items: center; justify-content: center; padding: 20px; }
    .preview-frame { width: 375px; height: 90vh; border: 8px solid #1c1a36; border-radius: 36px; overflow: hidden; }
    .preview-frame iframe { width: 100%; height: 100%; border: 0; }
    .btn-save { background: linear-gradient(135deg, #38bdf8, #7c3aed); color: #fff; border: 0; padding: 12px; font-weight: 700; border-radius: 6px; cursor: pointer; }
  </style>
</head>
<body>
  <div class="top-bar">
    <div style="font-family: 'Cormorant Garamond', serif; color: #38bdf8; font-size: 20px;">✨ Celestial Stars Studio</div>
    <div style="font-size: 12px; color: #94a3b8;">Real-Time Sync Active</div>
  </div>
  <div class="studio-grid">
    <div class="editor-pane">
      <div class="step-box">
        <h3 style="color: #38bdf8; font-size: 14px; margin-bottom: 10px;">1. Cosmic Star Identity</h3>
        <div class="form-group">
          <label>Birthday person ka naam</label>
          <input type="text" id="inp-name" value="Mira Kapoor" oninput="syncData()">
        </div>
        <div class="form-group">
          <label>Solar Orbits (Milestone Age)</label>
          <input type="number" id="inp-age" value="24" oninput="syncData()">
        </div>
        <div class="form-group">
          <label>Zodiac / Star Sign</label>
          <input type="text" id="inp-zodiac" value="Scorpio / Orion" oninput="syncData()">
        </div>
      </div>

      <div class="step-box">
        <h3 style="color: #38bdf8; font-size: 14px; margin-bottom: 10px;">2. Cosmic Ode Message</h3>
        <div class="form-group">
          <label>Starlight message</label>
          <textarea id="inp-msg" rows="3" oninput="syncData()">In a cosmos of 200 billion galaxies and trillions of stars, your existence is the most extraordinary miracle. Happy 24th Solar Return to a soul made entirely of starlight.</textarea>
        </div>
        <div class="form-group">
          <label>Sender Name</label>
          <input type="text" id="inp-sender" value="Dev & The Cosmos Collective" oninput="syncData()">
        </div>
      </div>

      <button class="btn-save" onclick="window.open('index.html', '_blank')">Save & Launch Universe ↗</button>
    </div>

    <div class="preview-pane">
      <div class="preview-frame">
        <iframe src="index.html" id="preview-iframe"></iframe>
      </div>
    </div>
  </div>

  <script>
    function syncData() {
      const data = {
        name: document.getElementById('inp-name').value,
        age: document.getElementById('inp-age').value,
        zodiac: document.getElementById('inp-zodiac').value,
        mainMessage: document.getElementById('inp-msg').value,
        sender: document.getElementById('inp-sender').value
      };
      const iframe = document.getElementById('preview-iframe');
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({ type: 'VANVI_UPDATE_DATA', payload: data }, '*');
      }
      localStorage.setItem('vanvi_celestial_draft', JSON.stringify(data));
    }
  </script>
</body>
</html>
`;
  fs.writeFileSync(path.join(tplDir, 'builder.html'), builderHtml, 'utf8');

  // 6. preview.html
  const previewHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview: Celestial Stars | Vanvi Moments</title>
  <link rel="icon" type="image/svg+xml" href="../../assets/favicon.svg">
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { background: #050512; font-family: system-ui, sans-serif; height: 100vh; display: flex; flex-direction: column; overflow: hidden; }
    .demo-bar {
      background: #0d0d26;
      border-bottom: 1px solid rgba(124, 58, 237, 0.3);
      padding: 10px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #38bdf8;
      font-size: 13px;
    }
    .btn-cta { background: linear-gradient(135deg, #38bdf8, #7c3aed); color: #fff; text-decoration: none; font-weight: 700; padding: 8px 18px; border-radius: 99px; font-size: 12px; }
    iframe { flex: 1; border: 0; width: 100%; height: 100%; }
  </style>
</head>
<body>
  <div class="demo-bar">
    <div>✨ <strong>Vanvi Moments</strong> • Celestial Stars Showcase</div>
    <a href="builder.html" class="btn-cta">Personalize This Experience (₹399) 🌌</a>
  </div>
  <iframe src="index.html"></iframe>
</body>
</html>
`;
  fs.writeFileSync(path.join(tplDir, 'preview.html'), previewHtml, 'utf8');

  console.log('  ✅ birthday-celestial-stars files built successfully.');
};
