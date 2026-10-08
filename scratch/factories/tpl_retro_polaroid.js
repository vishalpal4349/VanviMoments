/**
 * Template 2: birthday-retro-polaroid
 * Interactive Vinyl Player + Draggable Polaroids + Scrapbook Memories
 */

const fs = require('fs');
const path = require('path');

module.exports = function buildRetroPolaroid(baseDir) {
  const tplDir = path.join(baseDir, 'birthday-retro-polaroid');
  if (!fs.existsSync(tplDir)) fs.mkdirSync(tplDir, { recursive: true });
  const assetsDir = path.join(tplDir, 'assets');
  if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

  // 1. template.json
  const templateJson = {
    "id": "birthday-retro-polaroid",
    "name": "Retro Polaroid — The Nostalgic Scrapbook",
    "slug": "birthday-retro-polaroid",
    "category": "Birthday",
    "categorySlug": "birthday",
    "price": 299,
    "originalPrice": 799,
    "isFree": false,
    "badge": "🎞️ Retro Bestseller",
    "tier": "Signature",
    "isLuxury": true,
    "type": "Nostalgic 18-Section Digital Scrapbook & Vinyl Experience",
    "icon": "🎞️",
    "soundtrack": "Warm Lo-Fi Acoustic Vinyl Melody with Vinyl Crackle",
    "tags": ["birthday", "retro", "polaroid", "vinyl-player", "draggable", "scrapbook", "nostalgia", "lofi"],
    "description": "Vanvi Moments Vintage Edition: 18-section retro scrapbook birthday celebration featuring an interactive spinning vinyl turntable with tonearm, touch-draggable polaroid memory cards, washi tape paper clippings, and heartfelt typewriter notes.",
    "builder": {
      "type": "custom",
      "photoLimit": 10,
      "hasDate": true,
      "hasSoundtrack": true,
      "builderPath": "templates/birthday-retro-polaroid/builder.html",
      "previewPath": "templates/birthday-retro-polaroid/preview.html"
    },
    "sections": [
      "camera-aperture-entry",
      "retro-handwritten-hero",
      "birth-calendar-stamp",
      "polaroid-age-badge",
      "scrapbook-welcome",
      "typewriter-main-message",
      "interactive-vinyl-turntable",
      "draggable-polaroid-stack",
      "scrapbook-memory-timeline",
      "favorite-cassettes-grid",
      "polaroid-reel-gallery",
      "sticky-notes-wishes",
      "nostalgia-quote-banner",
      "scratch-postage-stamp",
      "mixtape-tracklist",
      "retro-flip-countdown",
      "keepsake-badge-share",
      "artisan-scrapbook-footer"
    ],
    "schema": {
      "fields": [
        { "key": "name", "label": "Birthday Person Name", "type": "text", "required": true, "default": "Kavya Sharma" },
        { "key": "nickname", "label": "Nickname / Retro Pet Name", "type": "text", "required": false, "default": "Kavu" },
        { "key": "age", "label": "Milestone Age", "type": "number", "required": true, "default": 23 },
        { "key": "birthYear", "label": "Birth Year", "type": "number", "required": true, "default": 2003 },
        { "key": "birthDate", "label": "Birthday Date", "type": "text", "required": true, "default": "July 14" },
        { "key": "mainMessage", "label": "Typewriter Birthday Letter", "type": "textarea", "required": true, "default": "To the girl whose laugh sounds like summer road trips and favorite old songs. May this 23rd year bring you warm coffee, endless vinyl records, and moments you never want to forget." },
        { "key": "sender", "label": "Sender Name(s)", "type": "text", "required": true, "default": "Rhea, Tara & The Gang" }
      ]
    }
  };
  fs.writeFileSync(path.join(tplDir, 'template.json'), JSON.stringify(templateJson, null, 2), 'utf8');

  // 2. style.css
  const styleCss = `/* ==========================================================================
   VANVI MOMENTS — BIRTHDAY RETRO POLAROID
   Art Direction: 70s/80s Nostalgia • Kodachrome Amber • Washi Tape • Vinyl Groove
   ========================================================================== */

:root {
  --bg-paper: #f7f3ea;
  --bg-card: #ffffff;
  --bg-dark-slate: #1f1d1b;
  --amber-primary: #d97736;
  --mustard-gold: #dca535;
  --sienna-deep: #78351b;
  --washi-teal: #6ba292;
  --washi-pink: #d98282;
  --text-dark: #2c2523;
  --text-muted: #756a64;
  --border-paper: rgba(44, 37, 35, 0.12);
  --shadow-polaroid: 0 10px 25px rgba(44, 37, 35, 0.15), 0 2px 6px rgba(44, 37, 35, 0.08);
  --font-serif: 'DM Serif Display', Georgia, serif;
  --font-hand: 'Caveat', cursive;
  --font-mono: 'Space Grotesk', -apple-system, sans-serif;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  background-color: var(--bg-paper);
  color: var(--text-dark);
  font-family: var(--font-mono);
  overflow-x: hidden;
  line-height: 1.6;
}

/* Subtle Film Grain Overlay */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: radial-gradient(rgba(0,0,0,0.03) 1px, transparent 0);
  background-size: 8px 8px;
  pointer-events: none;
  z-index: 1;
}

.page-wrapper {
  position: relative;
  z-index: 2;
  max-width: 660px;
  margin: 0 auto;
  padding: 0 18px 90px;
}

/* 1. Camera Aperture Cover */
.aperture-overlay {
  position: fixed;
  inset: 0;
  background: #171514;
  color: #fff;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 24px;
  transition: opacity 0.7s ease, visibility 0.7s;
}

.aperture-overlay.opened {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

.camera-lens-graphic {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 8px solid #332f2c;
  background: radial-gradient(circle at 40% 40%, #443e39 0%, #171514 80%);
  box-shadow: 0 0 40px rgba(217, 119, 54, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  margin-bottom: 24px;
  cursor: pointer;
}

.btn-open-scrapbook {
  background: var(--amber-primary);
  color: #fff;
  font-family: var(--font-mono);
  font-weight: 700;
  padding: 14px 32px;
  border-radius: 99px;
  border: 0;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(217, 119, 54, 0.4);
  font-size: 14px;
}

/* 2. Hero Section */
.retro-hero {
  padding-top: 50px;
  padding-bottom: 30px;
  text-align: center;
  position: relative;
}

.washi-tape-strip {
  width: 110px;
  height: 24px;
  background: rgba(107, 162, 146, 0.75);
  margin: 0 auto 16px;
  transform: rotate(-3deg);
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  border-left: 2px dashed rgba(255,255,255,0.4);
  border-right: 2px dashed rgba(255,255,255,0.4);
}

.retro-hero-title {
  font-family: var(--font-serif);
  font-size: 38px;
  color: var(--sienna-deep);
  line-height: 1.15;
  margin-bottom: 8px;
}

.retro-handwritten {
  font-family: var(--font-hand);
  font-size: 26px;
  color: var(--amber-primary);
  margin-bottom: 16px;
}

/* 3 & 4. Badges */
.stamp-row {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 16px;
}

.vintage-stamp {
  border: 2px dashed var(--amber-primary);
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 700;
  color: var(--sienna-deep);
  background: rgba(217, 119, 54, 0.08);
  border-radius: 4px;
  transform: rotate(2deg);
}

/* Scrapbook Card Container */
.scrapbook-card {
  background: var(--bg-card);
  border-radius: 12px;
  padding: 28px 22px;
  margin-top: 28px;
  box-shadow: var(--shadow-polaroid);
  position: relative;
  border: 1px solid var(--border-paper);
}

.washi-corner {
  position: absolute;
  top: -10px;
  right: 24px;
  width: 70px;
  height: 20px;
  background: rgba(217, 130, 130, 0.7);
  transform: rotate(4deg);
  border-left: 1px dashed rgba(255,255,255,0.5);
  border-right: 1px dashed rgba(255,255,255,0.5);
}

/* 7. Interactive Vinyl Turntable */
.turntable-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  text-align: center;
}

.turntable-deck {
  width: 260px;
  height: 260px;
  background: #2b2825;
  border-radius: 16px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 16px 36px rgba(0,0,0,0.3), inset 0 2px 6px rgba(255,255,255,0.1);
  margin-bottom: 20px;
}

.vinyl-disc {
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: radial-gradient(circle, #1a1816 0%, #0d0c0a 100%);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 16px rgba(0,0,0,0.8);
  transition: transform 0.3s;
  animation: spinVinyl 6s linear infinite paused;
}

.vinyl-disc.spinning {
  animation-play-state: running;
}

@keyframes spinVinyl {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.vinyl-center-label {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--mustard-gold) 0%, var(--amber-primary) 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-size: 9px;
  font-weight: 800;
  color: #fff;
  text-align: center;
  box-shadow: 0 0 6px rgba(0,0,0,0.5);
}

.tonearm {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 20px;
  height: 90px;
  border-right: 4px solid #c2b8ad;
  border-bottom: 4px solid #c2b8ad;
  border-radius: 0 0 8px 0;
  transform-origin: top right;
  transform: rotate(-15deg);
  transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
  pointer-events: none;
}

.turntable-deck.playing .tonearm {
  transform: rotate(22deg);
}

.btn-vinyl-play {
  background: var(--amber-primary);
  color: #fff;
  border: 0;
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 700;
  padding: 12px 28px;
  border-radius: 99px;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(217, 119, 54, 0.3);
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

/* 8. Draggable Polaroid Stack */
.polaroid-stage {
  position: relative;
  min-height: 380px;
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.polaroid-card {
  position: absolute;
  width: 230px;
  background: #fff;
  padding: 12px 12px 28px;
  box-shadow: var(--shadow-polaroid);
  border-radius: 2px;
  cursor: grab;
  user-select: none;
  transition: transform 0.2s, box-shadow 0.2s;
  touch-action: none;
}

.polaroid-card:active {
  cursor: grabbing;
  box-shadow: 0 20px 40px rgba(0,0,0,0.25);
}

.polaroid-img-box {
  width: 100%;
  aspect-ratio: 1/1;
  background: #eee;
  overflow: hidden;
  margin-bottom: 12px;
}

.polaroid-img-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}

.polaroid-caption {
  font-family: var(--font-hand);
  font-size: 20px;
  color: #332f2c;
  text-align: center;
}

/* 10. Cassette Grid */
.cassette-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 14px;
}

.cassette-item {
  background: #231f1d;
  color: #f7f3ea;
  border-radius: 8px;
  padding: 12px;
  font-size: 11px;
}

.cassette-title {
  color: var(--mustard-gold);
  font-weight: 700;
  margin-bottom: 4px;
}

/* 12. Sticky Notes Wishes */
.sticky-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  margin-top: 14px;
}

.sticky-note {
  background: #fff9d6;
  padding: 16px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
  font-family: var(--font-hand);
  font-size: 18px;
  color: #383127;
  transform: rotate(-2deg);
}

.sticky-note:nth-child(2) {
  background: #e2f0d9;
  transform: rotate(2deg);
}

/* 16. Retro Flip Countdown */
.flip-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-top: 14px;
}

.flip-box {
  background: #231f1d;
  color: #fff;
  padding: 12px 6px;
  border-radius: 6px;
  text-align: center;
}

.flip-val {
  font-family: var(--font-mono);
  font-size: 22px;
  font-weight: 700;
  color: var(--mustard-gold);
}

.flip-lbl {
  font-size: 9px;
  color: #999;
  text-transform: uppercase;
}

/* Responsive */
@media (max-width: 480px) {
  .retro-hero-title { font-size: 30px; }
  .polaroid-card { width: 200px; }
  .turntable-deck { width: 220px; height: 220px; }
  .vinyl-disc { width: 190px; height: 190px; }
}
`;
  fs.writeFileSync(path.join(tplDir, 'style.css'), styleCss, 'utf8');

  // 3. script.js
  const scriptJs = `/* ==========================================================================
   VANVI MOMENTS — BIRTHDAY RETRO POLAROID
   Interaction: Vinyl Turntable Player + Draggable Polaroid Cards + Web Audio
   ========================================================================== */

(function() {
  'use strict';

  // 1. Aperture Shutter Open
  const aperture = document.getElementById('aperture-overlay');
  const btnOpen = document.getElementById('btn-open-scrapbook');
  if (btnOpen && aperture) {
    btnOpen.addEventListener('click', () => {
      aperture.classList.add('opened');
      playVintageCrackle();
    });
  }

  // 2. Interactive Vinyl Player
  const deck = document.getElementById('turntable-deck');
  const disc = document.getElementById('vinyl-disc');
  const btnVinyl = document.getElementById('btn-vinyl-toggle');
  let isPlaying = false;

  if (btnVinyl && deck && disc) {
    btnVinyl.addEventListener('click', () => {
      isPlaying = !isPlaying;
      if (isPlaying) {
        deck.classList.add('playing');
        disc.classList.add('spinning');
        btnVinyl.innerHTML = '⏸ Pause Vinyl';
        playLoFiMelody();
      } else {
        deck.classList.remove('playing');
        disc.classList.remove('spinning');
        btnVinyl.innerHTML = '▶ Play Vinyl Record';
        stopLoFiMelody();
      }
    });
  }

  // 3. Synthesized Lo-Fi Vinyl Audio
  let audioCtx = null;
  let melodyTimer = null;

  function playVintageCrackle() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch(e) {}
  }

  function playLoFiMelody() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      audioCtx = new AudioCtx();
      const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
      let noteIdx = 0;

      melodyTimer = setInterval(() => {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.value = notes[noteIdx % notes.length];
        noteIdx++;
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.5);
      }, 600);
    } catch(e) {}
  }

  function stopLoFiMelody() {
    if (melodyTimer) clearInterval(melodyTimer);
    if (audioCtx) { audioCtx.close(); audioCtx = null; }
  }

  // 4. Draggable Polaroids Engine
  const cards = document.querySelectorAll('.polaroid-card');
  cards.forEach((card, index) => {
    let isDragging = false;
    let startX = 0, startY = 0;
    let curX = 0, curY = 0;
    const initialRot = (index % 2 === 0 ? -1 : 1) * (index * 4);
    card.style.transform = \`translate3d(0, 0, 0) rotate(\${initialRot}deg)\`;

    function onPointerDown(e) {
      isDragging = true;
      startX = e.clientX || (e.touches && e.touches[0].clientX);
      startY = e.clientY || (e.touches && e.touches[0].clientY);
      card.style.zIndex = 100;
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
    }

    function onPointerMove(e) {
      if (!isDragging) return;
      const x = e.clientX || (e.touches && e.touches[0].clientX);
      const y = e.clientY || (e.touches && e.touches[0].clientY);
      const dx = x - startX;
      const dy = y - startY;
      card.style.transform = \`translate3d(\${curX + dx}px, \${curY + dy}px, 0) rotate(\${initialRot + dx * 0.05}deg)\`;
    }

    function onPointerUp(e) {
      if (!isDragging) return;
      isDragging = false;
      const x = e.clientX || (e.changedTouches && e.changedTouches[0].clientX);
      const y = e.clientY || (e.changedTouches && e.changedTouches[0].clientY);
      curX += (x - startX);
      curY += (y - startY);
      card.style.zIndex = 10 + index;
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    }

    card.addEventListener('pointerdown', onPointerDown);
  });

  // 5. Live Countdown
  function updateCountdown() {
    const target = new Date(window.RETRO_TARGET || '2026-07-14T00:00:00').getTime();
    const diff = target - new Date().getTime();
    if (diff > 0) {
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      const elD = document.getElementById('retro-days');
      const elH = document.getElementById('retro-hours');
      const elM = document.getElementById('retro-mins');
      const elS = document.getElementById('retro-secs');
      if (elD) elD.innerText = d;
      if (elH) elH.innerText = h;
      if (elM) elM.innerText = m;
      if (elS) elS.innerText = s;
    }
  }
  setInterval(updateCountdown, 1000);
  updateCountdown();

  // 6. Builder Live postMessage Sync
  window.addEventListener('message', (event) => {
    if (!event.data || typeof event.data !== 'object') return;
    const { type, payload } = event.data;
    if (type === 'VANVI_UPDATE_DATA' && payload) {
      if (payload.name) {
        document.querySelectorAll('.val-name').forEach(el => el.innerText = payload.name);
      }
      if (payload.age) {
        document.querySelectorAll('.val-age').forEach(el => el.innerText = payload.age);
      }
      if (payload.birthYear) {
        document.querySelectorAll('.val-year').forEach(el => el.innerText = payload.birthYear);
      }
      if (payload.mainMessage) {
        const msg = document.querySelector('.val-typewriter');
        if (msg) msg.innerText = payload.mainMessage;
      }
      if (payload.sender) {
        document.querySelectorAll('.val-sender').forEach(el => el.innerText = payload.sender);
      }
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
  <title>Retro Polaroid — The Nostalgic Scrapbook | Vanvi Moments</title>
  <link rel="icon" type="image/svg+xml" href="../../assets/favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=DM+Serif+Display&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <!-- 1. Camera Aperture Intro -->
  <div class="aperture-overlay" id="aperture-overlay">
    <div class="camera-lens-graphic">📷</div>
    <h2 style="font-family: var(--font-serif); font-size: 26px; color: var(--mustard-gold); margin-bottom: 8px;">A ROLL OF MEMORIES</h2>
    <p style="color: #a8a09b; font-size: 13px; margin-bottom: 24px;">Captured with infinite love for <span class="val-name">Kavya Sharma</span></p>
    <button class="btn-open-scrapbook" id="btn-open-scrapbook">CLICK SHUTTER TO OPEN 🎞️</button>
  </div>

  <div class="page-wrapper">
    <!-- 2. Retro Hero -->
    <header class="retro-hero">
      <div class="washi-tape-strip"></div>
      <h1 class="retro-hero-title val-name">Kavya Sharma</h1>
      <div class="retro-handwritten">is celebrating another golden chapter! 🎈</div>

      <!-- 3 & 4. Stamps -->
      <div class="stamp-row">
        <div class="vintage-stamp">Est. <span class="val-year">2003</span></div>
        <div class="vintage-stamp">Chapter <span class="val-age">23</span></div>
        <div class="vintage-stamp">Kodachrome 400</div>
      </div>
    </header>

    <!-- 5 & 6. Typewriter Message -->
    <section class="scrapbook-card">
      <div class="washi-corner"></div>
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: var(--amber-primary); font-weight: 700; margin-bottom: 6px;">PAGE 01 • THE TRIBUTE</div>
      <h2 style="font-family: var(--font-serif); font-size: 24px; color: var(--sienna-deep); margin-bottom: 14px;">A Letter Typed Just For You</h2>
      <p class="val-typewriter" style="font-size: 14px; line-height: 1.8; color: #4a403b;">
        To the girl whose laugh sounds like summer road trips and favorite old songs. May this 23rd year bring you warm coffee, endless vinyl records, and moments you never want to forget.
      </p>
      <div style="margin-top: 14px; font-family: var(--font-hand); font-size: 20px; color: var(--amber-primary); text-align: right;">
        — With love, <span class="val-sender">Rhea, Tara & The Gang</span>
      </div>
    </section>

    <!-- 7. Interactive Vinyl Turntable Player -->
    <section class="scrapbook-card">
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: var(--amber-primary); font-weight: 700; margin-bottom: 6px;">PAGE 02 • THE SOUNDTRACK</div>
      <h2 style="font-family: var(--font-serif); font-size: 24px; color: var(--sienna-deep); margin-bottom: 8px;">The Birthday Turntable</h2>
      <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 16px;">
        Tap play to drop the needle and spin a warm lo-fi birthday melody.
      </p>

      <div class="turntable-container">
        <div class="turntable-deck" id="turntable-deck">
          <div class="vinyl-disc" id="vinyl-disc">
            <div class="vinyl-center-label">
              <span>SIDE A</span>
              <strong class="val-name" style="font-size: 8px;">Kavya</strong>
              <span>33 RPM</span>
            </div>
          </div>
          <div class="tonearm"></div>
        </div>

        <button class="btn-vinyl-play" id="btn-vinyl-toggle">▶ Play Vinyl Record</button>
      </div>
    </section>

    <!-- 8. Draggable Polaroid Stack -->
    <section class="scrapbook-card">
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: var(--amber-primary); font-weight: 700; margin-bottom: 6px;">PAGE 03 • POLAROIDS</div>
      <h2 style="font-family: var(--font-serif); font-size: 24px; color: var(--sienna-deep); margin-bottom: 4px;">Memory Snapshot Stack</h2>
      <p style="font-size: 12px; color: var(--text-muted);">
        Touch & drag these photo cards around the scrapbook canvas!
      </p>

      <div class="polaroid-stage">
        <div class="polaroid-card" style="top: 20px; left: 15%;">
          <div class="polaroid-img-box">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80" alt="Memory 1">
          </div>
          <div class="polaroid-caption">Summer Vibes '23 ☀️</div>
        </div>

        <div class="polaroid-card" style="top: 40px; right: 15%;">
          <div class="polaroid-img-box">
            <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80" alt="Memory 2">
          </div>
          <div class="polaroid-caption">Late Night Laughs 🌙</div>
        </div>

        <div class="polaroid-card" style="top: 70px; left: 30%;">
          <div class="polaroid-img-box">
            <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=80" alt="Memory 3">
          </div>
          <div class="polaroid-caption">Forever Bestie 🌸</div>
        </div>
      </div>
    </section>

    <!-- 9. Memory Scrapbook Timeline -->
    <section class="scrapbook-card">
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: var(--amber-primary); font-weight: 700; margin-bottom: 6px;">PAGE 04 • TIMELINE</div>
      <h2 style="font-family: var(--font-serif); font-size: 24px; color: var(--sienna-deep); margin-bottom: 12px;">Memories Clipped on Paper</h2>
      <div style="display: flex; flex-direction: column; gap: 14px; font-size: 13px;">
        <div style="padding-left: 12px; border-left: 3px solid var(--amber-primary);">
          <strong>The First Day We Met:</strong> A sudden burst of rain and sharing an umbrella at the cafe.
        </div>
        <div style="padding-left: 12px; border-left: 3px solid var(--mustard-gold);">
          <strong>The Crazy Road Trip:</strong> Singing 90s songs with windows down until sunrise.
        </div>
        <div style="padding-left: 12px; border-left: 3px solid var(--washi-teal);">
          <strong>Today & Always:</strong> Celebrating your radiant, joyful, genuine heart!
        </div>
      </div>
    </section>

    <!-- 10. Cassette Tape Grid -->
    <section class="scrapbook-card">
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: var(--amber-primary); font-weight: 700; margin-bottom: 6px;">PAGE 05 • MIXTAPE</div>
      <h2 style="font-family: var(--font-serif); font-size: 24px; color: var(--sienna-deep); margin-bottom: 6px;">Favorite Things Mixtape</h2>
      <div class="cassette-grid">
        <div class="cassette-item">
          <div class="cassette-title">📼 Track 01</div>
          <div>Warm Masala Chai & Old Books</div>
        </div>
        <div class="cassette-item">
          <div class="cassette-title">📼 Track 02</div>
          <div>Golden Hour Sunset Walks</div>
        </div>
        <div class="cassette-item">
          <div class="cassette-title">📼 Track 03</div>
          <div>Spontaneous 2 AM Dance Parties</div>
        </div>
        <div class="cassette-item">
          <div class="cassette-title">📼 Track 04</div>
          <div>Endless Conversations with Chai</div>
        </div>
      </div>
    </section>

    <!-- 12. Sticky Notes Wishes -->
    <section class="scrapbook-card">
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: var(--amber-primary); font-weight: 700; margin-bottom: 6px;">PAGE 06 • WISHES</div>
      <h2 style="font-family: var(--font-serif); font-size: 24px; color: var(--sienna-deep); margin-bottom: 6px;">Wishes on Sticky Notes</h2>
      <div class="sticky-grid">
        <div class="sticky-note">
          "Happy Birthday to my favorite partner-in-crime! Let's conquer this year! - Tara"
        </div>
        <div class="sticky-note">
          "Never change your golden energy and wild smile. Love you tons! - Rhea"
        </div>
      </div>
    </section>

    <!-- 16. Retro Flip Countdown -->
    <section class="scrapbook-card">
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: var(--amber-primary); font-weight: 700; margin-bottom: 6px;">PAGE 07 • COUNTDOWN</div>
      <h2 style="font-family: var(--font-serif); font-size: 24px; color: var(--sienna-deep); margin-bottom: 12px;">Flip-Clock to Next Birthday</h2>
      <div class="flip-grid">
        <div class="flip-box">
          <div class="flip-val" id="retro-days">0</div>
          <div class="flip-lbl">Days</div>
        </div>
        <div class="flip-box">
          <div class="flip-val" id="retro-hours">0</div>
          <div class="flip-lbl">Hours</div>
        </div>
        <div class="flip-box">
          <div class="flip-val" id="retro-mins">0</div>
          <div class="flip-lbl">Mins</div>
        </div>
        <div class="flip-box">
          <div class="flip-val" id="retro-secs">0</div>
          <div class="flip-lbl">Secs</div>
        </div>
      </div>
    </section>

    <!-- 17 & 18. Share & Footer -->
    <footer style="text-align: center; margin-top: 40px; font-size: 12px; color: var(--text-muted);">
      <p>Hand-pasted with love on <a href="../../index.html" style="color: var(--amber-primary); text-decoration: none; font-weight: 700;">Vanvi Moments</a></p>
      <p style="margin-top: 4px;">Vanvi Vintage Studio • Analog Soul in a Digital Era</p>
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
  <title>Retro Polaroid Studio | Vanvi Moments</title>
  <link rel="icon" type="image/svg+xml" href="../../assets/favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #1c1a19; color: #fff; font-family: 'Space Grotesk', sans-serif; display: flex; flex-direction: column; min-height: 100vh; }
    .top-bar { background: #262321; border-bottom: 1px solid rgba(255,255,255,0.1); padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; }
    .studio-grid { display: grid; grid-template-columns: 460px 1fr; flex: 1; height: calc(100vh - 60px); }
    @media (max-width: 900px) { .studio-grid { grid-template-columns: 1fr; } .preview-pane { display: none; } }
    .editor-pane { background: #211e1c; padding: 24px; overflow-y: auto; display: flex; flex-direction: column; gap: 18px; }
    .step-box { background: #2b2825; border-radius: 8px; padding: 16px; border: 1px solid rgba(255,255,255,0.06); }
    .form-group { margin-bottom: 12px; }
    .form-group label { display: block; font-size: 11px; color: #bbb; margin-bottom: 4px; }
    .form-group input, .form-group textarea { width: 100%; background: #171514; border: 1px solid #443e39; color: #fff; padding: 10px; border-radius: 6px; font-family: inherit; font-size: 13px; }
    .preview-pane { background: #141211; display: flex; align-items: center; justify-content: center; padding: 20px; }
    .preview-frame { width: 375px; height: 90vh; border: 8px solid #2b2825; border-radius: 36px; overflow: hidden; }
    .preview-frame iframe { width: 100%; height: 100%; border: 0; }
    .btn-save { background: #d97736; color: #fff; border: 0; padding: 12px; font-weight: 700; border-radius: 6px; cursor: pointer; }
  </style>
</head>
<body>
  <div class="top-bar">
    <div style="font-family: 'DM Serif Display', serif; color: #dca535; font-size: 18px;">🎞️ Retro Polaroid Studio</div>
    <div style="font-size: 12px; color: #bbb;">Live Sync Active</div>
  </div>
  <div class="studio-grid">
    <div class="editor-pane">
      <div class="step-box">
        <h3 style="color: #dca535; font-size: 14px; margin-bottom: 10px;">1. Birthday Person Info</h3>
        <div class="form-group">
          <label>Birthday person ka naam</label>
          <input type="text" id="inp-name" value="Kavya Sharma" oninput="syncData()">
        </div>
        <div class="form-group">
          <label>Milestone Age</label>
          <input type="number" id="inp-age" value="23" oninput="syncData()">
        </div>
        <div class="form-group">
          <label>Birth Year</label>
          <input type="number" id="inp-year" value="2003" oninput="syncData()">
        </div>
      </div>

      <div class="step-box">
        <h3 style="color: #dca535; font-size: 14px; margin-bottom: 10px;">2. Typewriter Message</h3>
        <div class="form-group">
          <label>Apni heartfelt memory likhein</label>
          <textarea id="inp-msg" rows="3" oninput="syncData()">To the girl whose laugh sounds like summer road trips and favorite old songs. May this 23rd year bring you warm coffee, endless vinyl records, and moments you never want to forget.</textarea>
        </div>
        <div class="form-group">
          <label>Sender Name</label>
          <input type="text" id="inp-sender" value="Rhea, Tara & The Gang" oninput="syncData()">
        </div>
      </div>

      <button class="btn-save" onclick="window.open('index.html', '_blank')">Save & Preview Fullscreen ↗</button>
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
        birthYear: document.getElementById('inp-year').value,
        mainMessage: document.getElementById('inp-msg').value,
        sender: document.getElementById('inp-sender').value
      };
      const iframe = document.getElementById('preview-iframe');
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({ type: 'VANVI_UPDATE_DATA', payload: data }, '*');
      }
      localStorage.setItem('vanvi_retro_polaroid_draft', JSON.stringify(data));
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
  <title>Preview: Retro Polaroid | Vanvi Moments</title>
  <link rel="icon" type="image/svg+xml" href="../../assets/favicon.svg">
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { background: #1c1a19; font-family: system-ui, sans-serif; height: 100vh; display: flex; flex-direction: column; overflow: hidden; }
    .demo-bar {
      background: #262321;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      padding: 10px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #dca535;
      font-size: 13px;
    }
    .btn-cta { background: #d97736; color: #fff; text-decoration: none; font-weight: 700; padding: 8px 18px; border-radius: 99px; font-size: 12px; }
    iframe { flex: 1; border: 0; width: 100%; height: 100%; }
  </style>
</head>
<body>
  <div class="demo-bar">
    <div>🎞️ <strong>Vanvi Moments</strong> • Retro Polaroid Showcase</div>
    <a href="builder.html" class="btn-cta">Personalize This Experience (₹299) ☕</a>
  </div>
  <iframe src="index.html"></iframe>
</body>
</html>
`;
  fs.writeFileSync(path.join(tplDir, 'preview.html'), previewHtml, 'utf8');

  console.log('  ✅ birthday-retro-polaroid files built successfully.');
};
