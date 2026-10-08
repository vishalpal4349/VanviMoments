/**
 * Template 4: birthday-champagne-scratch
 * Interactive Champagne Bottle Pop + 3 Gold Foil Scratch Cards + VIP Black & Gold
 */

const fs = require('fs');
const path = require('path');

module.exports = function buildChampagneScratch(baseDir) {
  const tplDir = path.join(baseDir, 'birthday-champagne-scratch');
  if (!fs.existsSync(tplDir)) fs.mkdirSync(tplDir, { recursive: true });
  const assetsDir = path.join(tplDir, 'assets');
  if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

  // 1. template.json
  const templateJson = {
    "id": "birthday-champagne-scratch",
    "name": "Champagne & Gold — The VIP Soirée",
    "slug": "birthday-champagne-scratch",
    "category": "Birthday",
    "categorySlug": "birthday",
    "price": 499,
    "originalPrice": 1499,
    "isFree": false,
    "badge": "🍾 VIP Soirée Edition",
    "tier": "Signature",
    "isLuxury": true,
    "type": "High-Luxe 18-Section Champagne & Metallic Scratch Experience",
    "icon": "🍾",
    "soundtrack": "Upbeat Sophisticated Lounge Jazz & Crystal Toast",
    "tags": ["birthday", "champagne", "scratch-card", "gold-foil", "vip", "black-tie", "cork-pop", "luxury"],
    "description": "Vanvi Moments Ultra-Glamour VIP Edition: 18-section black-tie birthday celebration featuring an interactive popping champagne bottle with golden bubbles, 3 metallic gold scratch-off cards revealing secret wishes, and crystal toast countdowns.",
    "builder": {
      "type": "custom",
      "photoLimit": 8,
      "hasDate": true,
      "hasSoundtrack": true,
      "builderPath": "templates/birthday-champagne-scratch/builder.html",
      "previewPath": "templates/birthday-champagne-scratch/preview.html"
    },
    "sections": [
      "vip-envelope-entry",
      "embossed-gold-hero",
      "soiree-date-details",
      "vintage-aged-seal",
      "host-sparkling-toast",
      "high-luxe-main-message",
      "interactive-champagne-pop",
      "gold-foil-scratch-cards",
      "gilded-frame-gallery",
      "tasting-menu-timeline",
      "vip-playlist-player",
      "gold-trimmed-wishes",
      "pure-gold-reasons",
      "golden-vault-box",
      "champagne-toast-countdown",
      "vip-dresscode-concierge",
      "golden-ticket-share",
      "grand-finale-seal"
    ],
    "schema": {
      "fields": [
        { "key": "name", "label": "VIP Birthday Guest of Honor", "type": "text", "required": true, "default": "Rhea Singhania" },
        { "key": "age", "label": "Vintage Age", "type": "number", "required": true, "default": 28 },
        { "key": "birthDate", "label": "Celebration Evening", "type": "text", "required": true, "default": "December 22" },
        { "key": "mainMessage", "label": "Main VIP Tribute", "type": "textarea", "required": true, "default": "To the woman who commands every room with grace, style, and effortless brilliance. Vintage 1998, aged to absolute perfection. Tonight, we clink crystal and celebrate you!" },
        { "key": "scratchWish", "label": "Secret Scratch-Off Wish", "type": "text", "required": true, "default": "May your wildest dreams become your everyday reality!" },
        { "key": "scratchGift", "label": "Secret Scratch-Off Gift / Reveal", "type": "text", "required": true, "default": "VIP Spa Day & Luxury Dinner on us!" },
        { "key": "sender", "label": "Host / Sender Name(s)", "type": "text", "required": true, "default": "Aditya & The Inner Circle" }
      ]
    }
  };
  fs.writeFileSync(path.join(tplDir, 'template.json'), JSON.stringify(templateJson, null, 2), 'utf8');

  // 2. style.css
  const styleCss = `/* ==========================================================================
   VANVI MOMENTS — BIRTHDAY CHAMPAGNE SCRATCH
   Art Direction: Carbon Black • 24K Brushed Champagne Gold • Glamour Sparkle
   ========================================================================== */

:root {
  --bg-black: #0a0a0c;
  --bg-card: #131317;
  --gold-champagne: #dfba73;
  --gold-metallic: #c89b3f;
  --gold-glow: rgba(223, 186, 115, 0.4);
  --text-white: #ffffff;
  --text-muted: #a3a3a8;
  --border-gold: rgba(223, 186, 115, 0.3);
  --border-subtle: rgba(255, 255, 255, 0.08);
  --font-display: 'Italiana', serif;
  --font-serif: 'Cinzel Decorative', serif;
  --font-sans: 'Montserrat', -apple-system, sans-serif;
}

* { margin: 0; padding: 0; box-sizing: border-box; }
html, body {
  background: var(--bg-black);
  color: var(--text-white);
  font-family: var(--font-sans);
  overflow-x: hidden;
  line-height: 1.6;
}

.page-wrapper {
  position: relative;
  z-index: 2;
  max-width: 680px;
  margin: 0 auto;
  padding: 0 20px 100px;
}

/* 1. VIP Black & Gold Entry */
.vip-overlay {
  position: fixed;
  inset: 0;
  background: radial-gradient(circle at center, #1e1e24 0%, #0a0a0c 90%);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 24px;
  transition: opacity 0.8s ease, visibility 0.8s;
}

.vip-overlay.opened {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

.vip-badge {
  border: 1px solid var(--gold-champagne);
  padding: 6px 18px;
  border-radius: 99px;
  color: var(--gold-champagne);
  font-size: 11px;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 20px;
}

.vip-title {
  font-family: var(--font-display);
  font-size: 34px;
  color: var(--gold-champagne);
  margin-bottom: 10px;
}

.btn-vip-enter {
  background: linear-gradient(135deg, var(--gold-champagne), var(--gold-metallic));
  color: #0a0a0c;
  font-weight: 800;
  padding: 16px 36px;
  border-radius: 99px;
  border: 0;
  font-size: 14px;
  letter-spacing: 1px;
  cursor: pointer;
  box-shadow: 0 10px 30px var(--gold-glow);
}

/* 2. Hero */
.hero-soiree {
  padding-top: 60px;
  padding-bottom: 30px;
  text-align: center;
}

.guest-name {
  font-family: var(--font-display);
  font-size: 52px;
  background: linear-gradient(135deg, #ffffff 0%, var(--gold-champagne) 60%, var(--gold-metallic) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 8px;
}

.soiree-capsules {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 20px;
}

.capsule {
  background: var(--bg-card);
  border: 1px solid var(--border-gold);
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 12px;
  color: var(--gold-champagne);
}

/* Card */
.vip-card {
  background: var(--bg-card);
  border: 1px solid var(--border-gold);
  border-radius: 18px;
  padding: 30px 24px;
  margin-top: 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.7);
  position: relative;
}

.vip-tag {
  font-size: 10px;
  letter-spacing: 2px;
  color: var(--gold-champagne);
  text-transform: uppercase;
  margin-bottom: 6px;
  display: block;
}

.vip-head {
  font-family: var(--font-display);
  font-size: 26px;
  color: #fff;
  margin-bottom: 14px;
}

/* 7. Interactive Champagne Bottle Pop */
.champagne-stage {
  text-align: center;
  padding: 24px 0;
}

.bottle-icon {
  font-size: 64px;
  cursor: pointer;
  display: inline-block;
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.bottle-icon:hover {
  transform: scale(1.1) rotate(-8deg);
}

.btn-pop-cork {
  background: linear-gradient(135deg, var(--gold-champagne), var(--gold-metallic));
  color: #0a0a0c;
  font-weight: 800;
  padding: 12px 28px;
  border-radius: 99px;
  border: 0;
  cursor: pointer;
  font-size: 13px;
  margin-top: 16px;
  box-shadow: 0 6px 20px var(--gold-glow);
}

/* 8. Gold Foil Scratch Cards */
.scratch-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
}

.scratch-card-box {
  position: relative;
  height: 100px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border-gold);
  background: #1a1a22;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  text-align: center;
}

.scratch-secret-content {
  color: var(--gold-champagne);
  font-weight: 700;
  font-size: 14px;
}

.scratch-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  cursor: crosshair;
}

/* 9. Gilded Gallery */
.gilded-gallery {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  margin-top: 14px;
}

.gilded-card {
  aspect-ratio: 4/5;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid var(--gold-champagne);
}

.gilded-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 15. Toast Countdown */
.toast-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-top: 14px;
}

.toast-cell {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-gold);
  padding: 12px 6px;
  border-radius: 8px;
  text-align: center;
}

.toast-val {
  font-family: var(--font-display);
  font-size: 24px;
  color: var(--gold-champagne);
  font-weight: 700;
}

.toast-lbl {
  font-size: 9px;
  color: var(--text-muted);
  text-transform: uppercase;
}

/* Responsive */
@media (max-width: 480px) {
  .guest-name { font-size: 40px; }
  .vip-title { font-size: 26px; }
}
`;
  fs.writeFileSync(path.join(tplDir, 'style.css'), styleCss, 'utf8');

  // 3. script.js
  const scriptJs = `/* ==========================================================================
   VANVI MOMENTS — BIRTHDAY CHAMPAGNE SCRATCH
   Interaction: Champagne Bottle Cork Pop + Canvas Gold Foil Scratch Cards
   ========================================================================== */

(function() {
  'use strict';

  // 1. VIP Overlay Open
  const overlay = document.getElementById('vip-overlay');
  const btnEnter = document.getElementById('btn-vip-enter');
  if (btnEnter && overlay) {
    btnEnter.addEventListener('click', () => {
      overlay.classList.add('opened');
      playCorkPopSound();
    });
  }

  // 2. Synthesized Pop Sound
  function playCorkPopSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch(e) {}
  }

  // 3. Champagne Bottle Pop & Bubble Burst
  const btnPop = document.getElementById('btn-pop-cork');
  const bottle = document.getElementById('champagne-bottle');
  if (btnPop) {
    btnPop.addEventListener('click', () => {
      playCorkPopSound();
      burstChampagneBubbles();
      btnPop.innerHTML = '🥂 Cork Popped! Cheers!';
      btnPop.disabled = true;
      if (bottle) bottle.style.transform = 'scale(1.2) rotate(15deg)';
    });
  }

  function burstChampagneBubbles() {
    for (let i = 0; i < 40; i++) {
      const bubble = document.createElement('div');
      bubble.style.position = 'fixed';
      bubble.style.left = '50%';
      bubble.style.top = '45%';
      bubble.style.width = Math.random() * 12 + 6 + 'px';
      bubble.style.height = bubble.style.width;
      bubble.style.borderRadius = '50%';
      bubble.style.background = ['#dfba73', '#fff', '#f7e590', '#c89b3f'][Math.floor(Math.random() * 4)];
      bubble.style.zIndex = '99999';
      bubble.style.pointerEvents = 'none';
      bubble.style.transition = 'transform 1.4s cubic-bezier(0.2, 0.8, 0.4, 1), opacity 1.4s ease';
      document.body.appendChild(bubble);

      const dx = (Math.random() - 0.5) * 450;
      const dy = -(Math.random() * 380 + 50);
      setTimeout(() => {
        bubble.style.transform = \`translate(\${dx}px, \${dy}px) scale(0.4)\`;
        bubble.style.opacity = '0';
      }, 20);

      setTimeout(() => bubble.remove(), 1500);
    }
  }

  // 4. Gold Foil Scratch Cards Engine
  function initScratchCards() {
    const canvases = document.querySelectorAll('.scratch-canvas');
    canvases.forEach(canvas => {
      const ctx = canvas.getContext('2d');
      const w = canvas.width = canvas.parentElement.clientWidth || 300;
      const h = canvas.height = canvas.parentElement.clientHeight || 100;

      // Draw Gold Foil
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#c89b3f');
      grad.addColorStop(0.5, '#dfba73');
      grad.addColorStop(1, '#96742a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Gold text on foil
      ctx.fillStyle = '#111';
      ctx.font = 'bold 12px Montserrat, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✨ SCRATCH WITH FINGER OR MOUSE ✨', w / 2, h / 2 + 4);

      let isScratching = false;

      function scratch(e) {
        if (!isScratching) return;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
        const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 16, 0, Math.PI * 2);
        ctx.fill();
      }

      canvas.addEventListener('mousedown', () => isScratching = true);
      window.addEventListener('mouseup', () => isScratching = false);
      canvas.addEventListener('mousemove', scratch);

      canvas.addEventListener('touchstart', (e) => { isScratching = true; scratch(e); });
      window.addEventListener('touchend', () => isScratching = false);
      canvas.addEventListener('touchmove', scratch);
    });
  }

  window.addEventListener('load', initScratchCards);

  // 5. Live Toast Countdown
  function updateToastCountdown() {
    const target = new Date(window.CHAMPAGNE_TARGET || '2026-12-22T00:00:00').getTime();
    const diff = target - new Date().getTime();
    if (diff > 0) {
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      const ed = document.getElementById('toast-days');
      const eh = document.getElementById('toast-hours');
      const em = document.getElementById('toast-mins');
      const es = document.getElementById('toast-secs');
      if (ed) ed.innerText = d;
      if (eh) eh.innerText = h;
      if (em) em.innerText = m;
      if (es) es.innerText = s;
    }
  }
  setInterval(updateToastCountdown, 1000);
  updateToastCountdown();

  // 6. Builder Live Sync
  window.addEventListener('message', (event) => {
    if (!event.data || typeof event.data !== 'object') return;
    const { type, payload } = event.data;
    if (type === 'VANVI_UPDATE_DATA' && payload) {
      if (payload.name) document.querySelectorAll('.val-name').forEach(el => el.innerText = payload.name);
      if (payload.age) document.querySelectorAll('.val-age').forEach(el => el.innerText = payload.age);
      if (payload.mainMessage) {
        const msg = document.querySelector('.val-vip-msg');
        if (msg) msg.innerText = payload.mainMessage;
      }
      if (payload.scratchWish) {
        const sw = document.getElementById('scratch-wish-text');
        if (sw) sw.innerText = payload.scratchWish;
      }
      if (payload.scratchGift) {
        const sg = document.getElementById('scratch-gift-text');
        if (sg) sg.innerText = payload.scratchGift;
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
  <title>Champagne & Gold — The VIP Soirée | Vanvi Moments</title>
  <link rel="icon" type="image/svg+xml" href="../../assets/favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Italiana&family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <!-- 1. VIP Black & Gold Entry -->
  <div class="vip-overlay" id="vip-overlay">
    <div class="vip-badge">VIP INVITATION ONLY</div>
    <h2 class="vip-title">THE CHAMPAGNE SOIRÉE</h2>
    <p style="color: var(--text-muted); font-size: 13px; margin-bottom: 24px;">An exclusive black-tie digital toast for <span class="val-name">Rhea Singhania</span></p>
    <button class="btn-vip-enter" id="btn-vip-enter">UNVEIL THE SOIRÉE 🍾</button>
  </div>

  <div class="page-wrapper">
    <!-- 2. Hero -->
    <header class="hero-soiree">
      <div style="font-size: 11px; letter-spacing: 2px; color: var(--gold-champagne); font-weight: 700; margin-bottom: 12px;">BLACK TIE CELEBRATION</div>
      <h1 class="guest-name val-name">Rhea Singhania</h1>
      <p style="font-family: var(--font-display); font-size: 18px; color: var(--gold-champagne);">
        "Pure Radiance • Unapologetic Elegance • Golden Energy"
      </p>

      <!-- 3 & 4. Capsules -->
      <div class="soiree-capsules">
        <div class="capsule">Vintage: <strong class="val-age">28</strong> Years</div>
        <div class="capsule">Status: <strong>Aged to Perfection</strong></div>
        <div class="capsule">Date: <strong>December 22</strong></div>
      </div>
    </header>

    <!-- 5 & 6. Main VIP Message -->
    <section class="vip-card">
      <span class="vip-tag">The Toast</span>
      <h2 class="vip-head">To the Guest of Honor</h2>
      <p class="val-vip-msg" style="font-size: 15px; color: #ddd; line-height: 1.8;">
        To the woman who commands every room with grace, style, and effortless brilliance. Vintage 1998, aged to absolute perfection. Tonight, we clink crystal and celebrate you!
      </p>
      <div style="margin-top: 14px; font-weight: 700; color: var(--gold-champagne); text-align: right;">
        — <span class="val-sender">Aditya & The Inner Circle</span>
      </div>
    </section>

    <!-- 7. Interactive Champagne Bottle Pop -->
    <section class="vip-card champagne-stage">
      <span class="vip-tag">Interactive Celebration</span>
      <h2 class="vip-head">Pop the Golden Champagne</h2>
      <div class="bottle-icon" id="champagne-bottle">🍾</div>
      <div>
        <button class="btn-pop-cork" id="btn-pop-cork">Pop The Golden Cork! 🥂</button>
      </div>
    </section>

    <!-- 8. Gold Foil Scratch Cards -->
    <section class="vip-card">
      <span class="vip-tag">Interactive Scratch-Off</span>
      <h2 class="vip-head">Gold Foil Secret Revelations</h2>
      <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 14px;">
        Use your finger or mouse to scratch off the 24K gold foil and unlock secrets!
      </p>

      <div class="scratch-grid">
        <!-- Card 1 -->
        <div class="scratch-card-box">
          <div class="scratch-secret-content" id="scratch-wish-text">
            ✨ "May your wildest dreams become your everyday reality!"
          </div>
          <canvas class="scratch-canvas"></canvas>
        </div>

        <!-- Card 2 -->
        <div class="scratch-card-box">
          <div class="scratch-secret-content" id="scratch-gift-text">
            🎁 "VIP Spa Day & Luxury Dinner on us!"
          </div>
          <canvas class="scratch-canvas"></canvas>
        </div>
      </div>
    </section>

    <!-- 9. Gilded Gallery -->
    <section class="vip-card">
      <span class="vip-tag">VIP Portfolio</span>
      <h2 class="vip-head">Gilded Highlights</h2>
      <div class="gilded-gallery">
        <div class="gilded-card">
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80" alt="VIP 1">
        </div>
        <div class="gilded-card">
          <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80" alt="VIP 2">
        </div>
      </div>
    </section>

    <!-- 15. Toast Countdown -->
    <section class="vip-card">
      <span class="vip-tag">Midnight Toast</span>
      <h2 class="vip-head">Countdown to the Clinking Flutes</h2>
      <div class="toast-grid">
        <div class="toast-cell">
          <div class="toast-val" id="toast-days">0</div>
          <div class="toast-lbl">Days</div>
        </div>
        <div class="toast-cell">
          <div class="toast-val" id="toast-hours">0</div>
          <div class="toast-lbl">Hours</div>
        </div>
        <div class="toast-cell">
          <div class="toast-val" id="toast-mins">0</div>
          <div class="toast-lbl">Mins</div>
        </div>
        <div class="toast-cell">
          <div class="toast-val" id="toast-secs">0</div>
          <div class="toast-lbl">Secs</div>
        </div>
      </div>
    </section>

    <!-- 18. Footer -->
    <footer style="text-align: center; margin-top: 40px; font-size: 12px; color: var(--text-muted);">
      <p>Curated for VIP distinction on <a href="../../index.html" style="color: var(--gold-champagne); text-decoration: none;">Vanvi Moments</a></p>
      <p style="margin-top: 4px;">Vanvi Haute Joaillerie & Keepsakes</p>
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
  <title>Champagne & Gold Studio | Vanvi Moments</title>
  <link rel="icon" type="image/svg+xml" href="../../assets/favicon.svg">
  <link href="https://fonts.googleapis.com/css2?family=Italiana&family=Montserrat:wght@500;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0a0a0c; color: #fff; font-family: 'Montserrat', sans-serif; display: flex; flex-direction: column; min-height: 100vh; }
    .top-bar { background: #131317; border-bottom: 1px solid rgba(223, 186, 115, 0.3); padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; }
    .studio-grid { display: grid; grid-template-columns: 460px 1fr; flex: 1; height: calc(100vh - 60px); }
    @media (max-width: 900px) { .studio-grid { grid-template-columns: 1fr; } .preview-pane { display: none; } }
    .editor-pane { background: #0e0e12; padding: 24px; overflow-y: auto; display: flex; flex-direction: column; gap: 18px; }
    .step-box { background: #18181f; border-radius: 10px; padding: 16px; border: 1px solid rgba(223, 186, 115, 0.2); }
    .form-group { margin-bottom: 12px; }
    .form-group label { display: block; font-size: 11px; color: #a3a3a8; margin-bottom: 4px; }
    .form-group input, .form-group textarea { width: 100%; background: #0a0a0c; border: 1px solid rgba(223, 186, 115, 0.4); color: #fff; padding: 10px; border-radius: 6px; font-family: inherit; font-size: 13px; }
    .preview-pane { background: #050507; display: flex; align-items: center; justify-content: center; padding: 20px; }
    .preview-frame { width: 375px; height: 90vh; border: 8px solid #22222b; border-radius: 36px; overflow: hidden; }
    .preview-frame iframe { width: 100%; height: 100%; border: 0; }
    .btn-save { background: linear-gradient(135deg, #dfba73, #c89b3f); color: #0a0a0c; border: 0; padding: 12px; font-weight: 800; border-radius: 6px; cursor: pointer; }
  </style>
</head>
<body>
  <div class="top-bar">
    <div style="font-family: 'Italiana', serif; color: #dfba73; font-size: 20px;">🍾 Champagne & Gold Studio</div>
    <div style="font-size: 12px; color: #a3a3a8;">Live Sync Active</div>
  </div>
  <div class="studio-grid">
    <div class="editor-pane">
      <div class="step-box">
        <h3 style="color: #dfba73; font-size: 14px; margin-bottom: 10px;">1. VIP Guest Info</h3>
        <div class="form-group">
          <label>Birthday person ka naam</label>
          <input type="text" id="inp-name" value="Rhea Singhania" oninput="syncData()">
        </div>
        <div class="form-group">
          <label>Vintage Age</label>
          <input type="number" id="inp-age" value="28" oninput="syncData()">
        </div>
      </div>

      <div class="step-box">
        <h3 style="color: #dfba73; font-size: 14px; margin-bottom: 10px;">2. Main VIP Toast</h3>
        <div class="form-group">
          <label>Main toast tribute</label>
          <textarea id="inp-msg" rows="3" oninput="syncData()">To the woman who commands every room with grace, style, and effortless brilliance. Vintage 1998, aged to absolute perfection. Tonight, we clink crystal and celebrate you!</textarea>
        </div>
      </div>

      <div class="step-box">
        <h3 style="color: #dfba73; font-size: 14px; margin-bottom: 10px;">3. Scratch Card Surprises</h3>
        <div class="form-group">
          <label>Scratch Card 1: Secret Wish</label>
          <input type="text" id="inp-wish" value="May your wildest dreams become your everyday reality!" oninput="syncData()">
        </div>
        <div class="form-group">
          <label>Scratch Card 2: Surprise Gift</label>
          <input type="text" id="inp-gift" value="VIP Spa Day & Luxury Dinner on us!" oninput="syncData()">
        </div>
        <div class="form-group">
          <label>Sender / Host Name</label>
          <input type="text" id="inp-sender" value="Aditya & The Inner Circle" oninput="syncData()">
        </div>
      </div>

      <button class="btn-save" onclick="window.open('index.html', '_blank')">Save & Preview Soirée ↗</button>
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
        mainMessage: document.getElementById('inp-msg').value,
        scratchWish: document.getElementById('inp-wish').value,
        scratchGift: document.getElementById('inp-gift').value,
        sender: document.getElementById('inp-sender').value
      };
      const iframe = document.getElementById('preview-iframe');
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({ type: 'VANVI_UPDATE_DATA', payload: data }, '*');
      }
      localStorage.setItem('vanvi_champagne_draft', JSON.stringify(data));
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
  <title>Preview: Champagne & Gold | Vanvi Moments</title>
  <link rel="icon" type="image/svg+xml" href="../../assets/favicon.svg">
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { background: #0a0a0c; font-family: system-ui, sans-serif; height: 100vh; display: flex; flex-direction: column; overflow: hidden; }
    .demo-bar {
      background: #131317;
      border-bottom: 1px solid rgba(223, 186, 115, 0.3);
      padding: 10px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #dfba73;
      font-size: 13px;
    }
    .btn-cta { background: linear-gradient(135deg, #dfba73, #c89b3f); color: #0a0a0c; text-decoration: none; font-weight: 700; padding: 8px 18px; border-radius: 99px; font-size: 12px; }
    iframe { flex: 1; border: 0; width: 100%; height: 100%; }
  </style>
</head>
<body>
  <div class="demo-bar">
    <div>🍾 <strong>Vanvi Moments</strong> • Champagne VIP Showcase</div>
    <a href="builder.html" class="btn-cta">Personalize This Experience (₹499) 🥂</a>
  </div>
  <iframe src="index.html"></iframe>
</body>
</html>
`;
  fs.writeFileSync(path.join(tplDir, 'preview.html'), previewHtml, 'utf8');

  console.log('  ✅ birthday-champagne-scratch files built successfully.');
};
