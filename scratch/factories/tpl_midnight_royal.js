/**
 * Template 1: birthday-midnight-royal
 * 3D Candle Blow + Golden Wax Seal + Cinematic Royal Night
 */

const fs = require('fs');
const path = require('path');

module.exports = function buildMidnightRoyal(baseDir) {
  const tplDir = path.join(baseDir, 'birthday-midnight-royal');
  if (!fs.existsSync(tplDir)) fs.mkdirSync(tplDir, { recursive: true });
  const assetsDir = path.join(tplDir, 'assets');
  if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

  // 1. template.json
  const templateJson = {
    "id": "birthday-midnight-royal",
    "name": "Midnight Royal — The Imperial Celebration",
    "slug": "birthday-midnight-royal",
    "category": "Birthday",
    "categorySlug": "birthday",
    "price": 499,
    "originalPrice": 1499,
    "isFree": false,
    "badge": "👑 Imperial Flagship",
    "tier": "Signature",
    "isLuxury": true,
    "type": "Ultra-Luxury 18-Section Digital Birthday Experience",
    "icon": "👑",
    "soundtrack": "Imperial Midnight Cello & Orchestral String Symphony",
    "tags": ["birthday", "royal", "candle-blow", "wax-seal", "midnight", "luxury", "particles", "voice-note"],
    "description": "Vanvi Moments Imperial Flagship: 18-section royal midnight birthday experience with 3D interactive candle blow ceremony, cracked golden wax seal keepsake letter, royal milestone timeline, crystal champagne toast, floating golden ember particles, and custom voice dedication.",
    "builder": {
      "type": "custom",
      "photoLimit": 8,
      "hasDate": true,
      "hasSoundtrack": true,
      "builderPath": "templates/birthday-midnight-royal/builder.html",
      "previewPath": "templates/birthday-midnight-royal/preview.html"
    },
    "sections": [
      "gala-curtain-entry",
      "gilded-monogram-name",
      "birth-date-astrology",
      "milestone-crown-badge",
      "imperial-welcome",
      "main-emotional-message",
      "interactive-3d-candle",
      "wax-seal-letter",
      "royal-photo-gallery",
      "milestone-timeline",
      "orchestral-soundtrack",
      "aristocratic-wishes-wall",
      "vip-crystal-toast",
      "five-regal-reasons",
      "midnight-surprise-box",
      "countdown-timer",
      "keepsake-qr-share",
      "atelier-signature-footer"
    ],
    "schema": {
      "fields": [
        { "key": "name", "label": "Birthday Person Name", "type": "text", "required": true, "default": "Aarav Sharma" },
        { "key": "nickname", "label": "Royal Title or Pet Name", "type": "text", "required": false, "default": "Prince Aarav" },
        { "key": "age", "label": "Milestone Age", "type": "number", "required": true, "default": 25 },
        { "key": "birthDate", "label": "Birth Date", "type": "text", "required": true, "default": "18th October" },
        { "key": "targetDate", "label": "Countdown Timestamp", "type": "datetime-local", "required": true, "default": "2026-10-18T00:00" },
        { "key": "mainMessage", "label": "Main Birthday Ode", "type": "textarea", "required": true, "default": "May your 25th milestone shine with unyielding grandeur, wisdom, and eternal joy. You walk with a rare grace that elevates every soul around you." },
        { "key": "letterText", "label": "Wax Seal Keepsake Letter", "type": "textarea", "required": true, "default": "To our dearest Aarav, through every high and quiet turn, your steadfast loyalty and radiant heart have been our greatest treasure. Here is to your most golden year yet." },
        { "key": "sender", "label": "Sender Name(s)", "type": "text", "required": true, "default": "Ananya, Kabir & The Clan" }
      ]
    }
  };
  fs.writeFileSync(path.join(tplDir, 'template.json'), JSON.stringify(templateJson, null, 2), 'utf8');

  // 2. style.css
  const styleCss = `/* ==========================================================================
   VANVI MOMENTS — BIRTHDAY MIDNIGHT ROYAL
   Art Direction: Imperial Midnight Gala • 24K Gold • Royal Crimson • Candlelight
   ========================================================================== */

:root {
  --bg-deep: #060814;
  --bg-card: #0d1226;
  --bg-velvet: #2a0815;
  --gold-primary: #d4af37;
  --gold-light: #f7e590;
  --gold-dark: #967a24;
  --crimson-royal: #801229;
  --text-primary: #ffffff;
  --text-secondary: #c2c7de;
  --text-muted: #838aab;
  --border-gold: rgba(212, 175, 55, 0.35);
  --border-subtle: rgba(255, 255, 255, 0.08);
  --candle-glow: rgba(255, 179, 71, 0.45);
  --font-display: 'Cinzel Decorative', 'Cinzel', serif;
  --font-serif: 'Playfair Display', Georgia, serif;
  --font-sans: 'Outfit', -apple-system, sans-serif;
  --radius-sm: 8px;
  --radius-md: 16px;
  --radius-lg: 24px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  background-color: var(--bg-deep);
  color: var(--text-primary);
  font-family: var(--font-sans);
  overflow-x: hidden;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

/* Background Canvas for Star/Ember Particles */
#ember-canvas {
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

/* 1. Gala Curtain Opening Cover */
.curtain-overlay {
  position: fixed;
  inset: 0;
  background: radial-gradient(circle at center, #1b0711 0%, #060814 100%);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: opacity 0.8s ease, visibility 0.8s;
  padding: 24px;
  text-align: center;
}

.curtain-overlay.opened {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

.curtain-crest {
  font-size: 56px;
  margin-bottom: 20px;
  filter: drop-shadow(0 0 20px var(--gold-primary));
  animation: pulseCrest 3s infinite ease-in-out;
}

@keyframes pulseCrest {
  0%, 100% { transform: scale(1); filter: drop-shadow(0 0 16px var(--gold-primary)); }
  50% { transform: scale(1.06); filter: drop-shadow(0 0 28px var(--gold-light)); }
}

.curtain-title {
  font-family: var(--font-display);
  color: var(--gold-light);
  font-size: 26px;
  letter-spacing: 2px;
  margin-bottom: 8px;
}

.curtain-sub {
  color: var(--text-secondary);
  font-size: 14px;
  margin-bottom: 32px;
  max-width: 320px;
}

.btn-enter-gala {
  background: linear-gradient(135deg, var(--gold-light) 0%, var(--gold-primary) 50%, var(--gold-dark) 100%);
  color: #05060d;
  font-family: var(--font-sans);
  font-weight: 800;
  font-size: 15px;
  letter-spacing: 1px;
  padding: 16px 36px;
  border-radius: 99px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 10px 30px rgba(212, 175, 55, 0.35);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-enter-gala:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 40px rgba(212, 175, 55, 0.5);
}

/* 2. Hero Section */
.hero-section {
  padding-top: 60px;
  padding-bottom: 40px;
  text-align: center;
}

.royal-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(212, 175, 55, 0.12);
  border: 1px solid var(--border-gold);
  color: var(--gold-light);
  padding: 6px 18px;
  border-radius: 99px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 24px;
}

.royal-monogram {
  font-family: var(--font-display);
  font-size: 72px;
  font-weight: 700;
  background: linear-gradient(135deg, #fff 0%, var(--gold-light) 50%, var(--gold-primary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 12px;
  line-height: 1.1;
}

.hero-subtitle {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 18px;
  color: var(--gold-light);
  margin-bottom: 16px;
}

.meta-capsule-row {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 20px;
}

.meta-capsule {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  padding: 8px 16px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  color: var(--text-secondary);
}

.meta-capsule strong {
  color: var(--gold-light);
}

/* Section Shared Card */
.royal-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 32px 24px;
  margin-top: 32px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
}

.royal-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 20%;
  right: 20%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--gold-primary), transparent);
}

.section-tag {
  font-family: var(--font-display);
  font-size: 11px;
  letter-spacing: 2px;
  color: var(--gold-primary);
  text-transform: uppercase;
  margin-bottom: 8px;
  display: block;
}

.section-head {
  font-family: var(--font-serif);
  font-size: 24px;
  color: var(--text-primary);
  margin-bottom: 16px;
}

/* 7. Signature 3D Candle Blow Section */
.candle-stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 36px 16px;
  text-align: center;
}

.cake-stand {
  position: relative;
  width: 140px;
  height: 140px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 24px;
}

.candle-pillar {
  width: 22px;
  height: 70px;
  background: linear-gradient(90deg, #e5c490, #c4985a, #856328);
  border-radius: 4px;
  position: relative;
  box-shadow: 0 4px 14px rgba(0,0,0,0.6);
}

.candle-wick {
  width: 3px;
  height: 12px;
  background: #333;
  margin: 0 auto;
}

.candle-flame {
  width: 20px;
  height: 36px;
  background: radial-gradient(ellipse at bottom, #fff 0%, #ffdf00 40%, #ff5e00 80%, transparent 100%);
  border-radius: 50% 50% 35% 35%;
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  filter: drop-shadow(0 0 18px #ffb347);
  animation: flicker 1.8s infinite alternate ease-in-out;
  transition: opacity 0.5s, transform 0.5s;
}

@keyframes flicker {
  0% { transform: translateX(-50%) rotate(-1deg) scale(1); filter: drop-shadow(0 0 14px #ffb347); }
  50% { transform: translateX(-48%) rotate(2deg) scale(1.08, 0.95); filter: drop-shadow(0 0 22px #ffa020); }
  100% { transform: translateX(-52%) rotate(-2deg) scale(0.96, 1.05); filter: drop-shadow(0 0 16px #ff7b00); }
}

.candle-smoke {
  width: 8px;
  height: 30px;
  background: radial-gradient(circle, rgba(200,200,200,0.6) 0%, transparent 70%);
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  pointer-events: none;
}

.candle-stage.blown .candle-flame {
  opacity: 0;
  transform: translateX(-50%) scale(0.2);
}

.candle-stage.blown .candle-smoke {
  animation: riseSmoke 2s forwards ease-out;
}

@keyframes riseSmoke {
  0% { opacity: 0.8; transform: translate(-50%, 0) scale(1); }
  100% { opacity: 0; transform: translate(-40%, -40px) scale(2.5); }
}

.blow-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.btn-blow {
  background: linear-gradient(135deg, var(--crimson-royal), #4a0b18);
  border: 1px solid var(--border-gold);
  color: var(--gold-light);
  font-weight: 700;
  font-size: 14px;
  padding: 12px 28px;
  border-radius: 99px;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(128, 18, 41, 0.5);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.2s, background 0.3s;
}

.btn-blow:hover {
  transform: scale(1.04);
}

.wish-unlocked-card {
  display: none;
  background: rgba(212, 175, 55, 0.1);
  border: 1px dashed var(--gold-primary);
  border-radius: var(--radius-md);
  padding: 16px 20px;
  margin-top: 20px;
  color: var(--gold-light);
  font-size: 13px;
  font-style: italic;
  animation: fadeIn 0.8s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 8. Wax Seal Keepsake Letter */
.wax-letter-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.wax-seal-btn {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #e5c490 0%, #c4985a 45%, #7a5a1f 100%);
  border: 3px solid #f7e590;
  box-shadow: 0 8px 24px rgba(0,0,0,0.8), inset 0 2px 6px rgba(255,255,255,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  margin-bottom: 20px;
}

.wax-seal-btn:hover {
  transform: scale(1.08) rotate(5deg);
}

.wax-letter-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.8s ease, opacity 0.8s ease;
  opacity: 0;
  width: 100%;
}

.wax-letter-content.unfolded {
  max-height: 800px;
  opacity: 1;
}

.parchment-body {
  background: #fdfaf2;
  color: #2b1f1d;
  font-family: var(--font-serif);
  padding: 32px 24px;
  border-radius: var(--radius-sm);
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  border-left: 4px solid var(--gold-primary);
  text-align: left;
  line-height: 1.8;
  font-size: 15px;
  margin-top: 10px;
}

/* 9. Royal Photo Gallery */
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 16px;
}

.gallery-card {
  position: relative;
  aspect-ratio: 4/5;
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--border-gold);
  cursor: pointer;
}

.gallery-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.gallery-card:hover img {
  transform: scale(1.06);
}

.gallery-overlay-tag {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 10px 6px;
  background: linear-gradient(transparent, rgba(6, 8, 20, 0.85));
  font-size: 11px;
  color: var(--gold-light);
  font-weight: 600;
  text-align: center;
}

/* 10. Milestone Timeline */
.timeline-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 16px;
  position: relative;
  padding-left: 24px;
  border-left: 2px solid rgba(212, 175, 55, 0.3);
}

.timeline-item {
  position: relative;
}

.timeline-dot {
  position: absolute;
  left: -31px;
  top: 4px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--gold-primary);
  box-shadow: 0 0 10px var(--gold-primary);
}

.timeline-year {
  font-family: var(--font-display);
  font-size: 13px;
  color: var(--gold-light);
}

.timeline-desc {
  font-size: 13px;
  color: var(--text-secondary);
}

/* 11. Soundtrack & Voice Player */
.audio-player-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 16px 20px;
  margin-top: 16px;
}

.audio-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.disc-icon {
  font-size: 28px;
  animation: spinDisc 8s linear infinite paused;
}

.audio-player-card.playing .disc-icon {
  animation-play-state: running;
}

@keyframes spinDisc {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.btn-play-toggle {
  background: var(--gold-primary);
  color: #060814;
  border: 0;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
}

/* 12. Wishes Wall */
.wishes-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

.wish-bubble {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 16px;
  font-size: 13px;
}

.wish-author {
  font-weight: 700;
  color: var(--gold-light);
  margin-bottom: 4px;
  display: flex;
  justify-content: space-between;
}

.wish-input-group {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.wish-input-group input,
.wish-input-group textarea {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  color: #fff;
  padding: 10px 14px;
  font-family: inherit;
  font-size: 13px;
}

.wish-input-group button {
  background: var(--gold-primary);
  color: #060814;
  border: 0;
  padding: 12px;
  font-weight: 700;
  border-radius: var(--radius-sm);
  cursor: pointer;
}

/* 16. Countdown Clock */
.countdown-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-top: 16px;
}

.countdown-box {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-gold);
  border-radius: var(--radius-sm);
  padding: 14px 8px;
  text-align: center;
}

.countdown-num {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 700;
  color: var(--gold-light);
  display: block;
}

.countdown-label {
  font-size: 10px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* 17. Share Sheet */
.share-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.btn-share-wa {
  flex: 1;
  background: #25d366;
  color: #fff;
  border: 0;
  padding: 14px;
  border-radius: 99px;
  font-weight: 700;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  font-size: 13px;
}

.btn-copy-link {
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid var(--border-subtle);
  padding: 14px;
  border-radius: 99px;
  font-weight: 700;
  cursor: pointer;
  font-size: 13px;
}

/* 18. Footer */
.royal-footer {
  text-align: center;
  padding-top: 40px;
  color: var(--text-muted);
  font-size: 12px;
}

.royal-footer a {
  color: var(--gold-light);
  text-decoration: none;
}

/* Responsive Overrides */
@media (max-width: 480px) {
  .page-wrapper { padding: 0 14px 80px; }
  .royal-monogram { font-size: 56px; }
  .section-head { font-size: 20px; }
}
`;
  fs.writeFileSync(path.join(tplDir, 'style.css'), styleCss, 'utf8');

  // 3. script.js
  const scriptJs = `/* ==========================================================================
   VANVI MOMENTS — BIRTHDAY MIDNIGHT ROYAL
   Interaction Logic: 3D Candle Blow, Wax Seal Reveal, Particles, Countdown
   ========================================================================== */

(function() {
  'use strict';

  // 1. Enter Gala Curtain
  const curtain = document.getElementById('curtain-overlay');
  const btnEnter = document.getElementById('btn-enter-gala');
  if (btnEnter && curtain) {
    btnEnter.addEventListener('click', () => {
      curtain.classList.add('opened');
      playChimeSound();
    });
  }

  // 2. Interactive 3D Candle Blow
  const candleStage = document.getElementById('candle-stage');
  const btnBlow = document.getElementById('btn-blow-candle');
  const wishUnlocked = document.getElementById('wish-unlocked');

  if (btnBlow && candleStage) {
    btnBlow.addEventListener('click', blowCandle);
  }

  function blowCandle() {
    if (!candleStage.classList.contains('blown')) {
      candleStage.classList.add('blown');
      btnBlow.innerHTML = '✨ Wish Sent to the Heavens';
      btnBlow.disabled = true;
      btnBlow.style.opacity = '0.7';
      if (wishUnlocked) wishUnlocked.style.display = 'block';
      playChimeSound(660);
      burstGoldenConfetti();
    }
  }

  // 3. Golden Wax Seal Reveal
  const waxBtn = document.getElementById('wax-seal-btn');
  const waxContent = document.getElementById('wax-letter-content');
  if (waxBtn && waxContent) {
    waxBtn.addEventListener('click', () => {
      waxContent.classList.toggle('unfolded');
      playChimeSound(440);
    });
  }

  // 4. Web Audio Chime Synthesizer
  function playChimeSound(freq = 520) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch(e) {}
  }

  // 5. Canvas Golden Ember Particles
  const canvas = document.getElementById('ember-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const embers = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2 + 0.8,
      speedY: Math.random() * 0.6 + 0.2,
      speedX: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.7 + 0.2
    }));

    function animateEmbers() {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(212, 175, 55, ';
      embers.forEach(e => {
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fillStyle = \`rgba(212, 175, 55, \${e.alpha})\`;
        ctx.fill();
        e.y -= e.speedY;
        e.x += e.speedX;
        if (e.y < 0) { e.y = height + 10; e.x = Math.random() * width; }
      });
      requestAnimationFrame(animateEmbers);
    }
    animateEmbers();
  }

  // 6. Confetti Burst on Candle Blow
  function burstGoldenConfetti() {
    const count = 30;
    for (let i = 0; i < count; i++) {
      const drop = document.createElement('div');
      drop.style.position = 'fixed';
      drop.style.left = '50%';
      drop.style.top = '40%';
      drop.style.width = Math.random() * 8 + 4 + 'px';
      drop.style.height = Math.random() * 8 + 4 + 'px';
      drop.style.background = ['#d4af37', '#f7e590', '#fff', '#801229'][Math.floor(Math.random() * 4)];
      drop.style.borderRadius = '50%';
      drop.style.zIndex = '99999';
      drop.style.pointerEvents = 'none';
      drop.style.transition = 'transform 1.2s cubic-bezier(0.25, 1, 0.5, 1), opacity 1.2s ease';
      document.body.appendChild(drop);

      const destX = (Math.random() - 0.5) * 400;
      const destY = (Math.random() - 0.8) * 350;
      setTimeout(() => {
        drop.style.transform = \`translate(\${destX}px, \${destY}px) rotate(\${Math.random() * 360}deg)\`;
        drop.style.opacity = '0';
      }, 20);

      setTimeout(() => drop.remove(), 1300);
    }
  }

  // 7. Live Countdown
  function updateCountdown() {
    const target = new Date(window.BIRTHDAY_TARGET || '2026-10-18T00:00:00').getTime();
    const now = new Date().getTime();
    const diff = target - now;
    if (diff > 0) {
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);
      const dEl = document.getElementById('count-days');
      const hEl = document.getElementById('count-hours');
      const mEl = document.getElementById('count-mins');
      const sEl = document.getElementById('count-secs');
      if (dEl) dEl.innerText = days;
      if (hEl) hEl.innerText = hours;
      if (mEl) mEl.innerText = mins;
      if (sEl) sEl.innerText = secs;
    }
  }
  setInterval(updateCountdown, 1000);
  updateCountdown();

  // 8. Wishes Form Submission
  const wishForm = document.getElementById('wish-form');
  const wishesContainer = document.getElementById('wishes-list');
  if (wishForm && wishesContainer) {
    wishForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('wish-name');
      const msgInput = document.getElementById('wish-msg');
      if (nameInput && msgInput && nameInput.value.trim() && msgInput.value.trim()) {
        const bubble = document.createElement('div');
        bubble.className = 'wish-bubble';
        bubble.innerHTML = \`<div class="wish-author"><span>\${nameInput.value.trim()}</span><small>Just now</small></div><p>\${msgInput.value.trim()}</p>\`;
        wishesContainer.prepend(bubble);
        nameInput.value = '';
        msgInput.value = '';
        playChimeSound(580);
      }
    });
  }

  // 9. Builder Live postMessage Sync
  window.addEventListener('message', (event) => {
    if (!event.data || typeof event.data !== 'object') return;
    const { type, payload } = event.data;
    if (type === 'VANVI_UPDATE_DATA' && payload) {
      if (payload.name) {
        document.querySelectorAll('.val-name').forEach(el => el.innerText = payload.name);
        document.querySelectorAll('.val-initial').forEach(el => el.innerText = payload.name.charAt(0));
      }
      if (payload.age) {
        document.querySelectorAll('.val-age').forEach(el => el.innerText = payload.age);
      }
      if (payload.birthDate) {
        document.querySelectorAll('.val-date').forEach(el => el.innerText = payload.birthDate);
      }
      if (payload.mainMessage) {
        const msgEl = document.querySelector('.val-main-msg');
        if (msgEl) msgEl.innerText = payload.mainMessage;
      }
      if (payload.letterText) {
        const letEl = document.querySelector('.val-letter-text');
        if (letEl) letEl.innerText = payload.letterText;
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
  <title>Midnight Royal — The Imperial Celebration | Vanvi Moments</title>
  <link rel="icon" type="image/svg+xml" href="../../assets/favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&family=Cinzel:wght@600;700&family=Outfit:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,500;0,700;1,500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <canvas id="ember-canvas"></canvas>

  <!-- 1. Gala Curtain Entry -->
  <div class="curtain-overlay" id="curtain-overlay">
    <div class="curtain-crest">👑</div>
    <div class="curtain-title">THE IMPERIAL BIRTHDAY GALA</div>
    <p class="curtain-sub">An aristocratic digital keepsake prepared for <span class="val-name">Aarav Sharma</span></p>
    <button class="btn-enter-gala" id="btn-enter-gala">TAP TO ENTER THE GALA ✨</button>
  </div>

  <div class="page-wrapper">
    <!-- 2. Hero Section -->
    <header class="hero-section">
      <div class="royal-badge">👑 Imperial Edition • Milestone Celebration</div>
      <div class="royal-monogram val-initial">A</div>
      <h1 class="hero-title val-name" style="font-family: var(--font-display); font-size: 32px; color: var(--gold-light);">Aarav Sharma</h1>
      <p class="hero-subtitle">"A soul of timeless nobility, kindness, and eternal light"</p>
      
      <!-- 3. Birth Date & 4. Milestone Age -->
      <div class="meta-capsule-row">
        <div class="meta-capsule">Date: <strong class="val-date">October 18</strong></div>
        <div class="meta-capsule">Chapter: <strong class="val-age">25th</strong> Year</div>
        <div class="meta-capsule">Sign: <strong>Libra / Royal Ascendant</strong></div>
      </div>
    </header>

    <!-- 5. Imperial Proclamation & 6. Main Message -->
    <section class="royal-card">
      <span class="section-tag">Proclamation</span>
      <h2 class="section-head">A Royal Birthday Tribute</h2>
      <p class="val-main-msg" style="font-size: 15px; color: var(--text-secondary); line-height: 1.8;">
        May your 25th milestone shine with unyielding grandeur, wisdom, and eternal joy. You walk with a rare grace that elevates every soul around you. Today, we celebrate the remarkable legacy you are creating with every passing year.
      </p>
    </section>

    <!-- 7. Signature 3D Candle Blow Ceremony -->
    <section class="royal-card">
      <span class="section-tag">Signature Ritual</span>
      <h2 class="section-head">The Royal Candle Ceremony</h2>
      <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 20px;">
        Make your silent wish for the year ahead and extinguish the midnight flame.
      </p>

      <div class="candle-stage" id="candle-stage">
        <div class="cake-stand">
          <div class="candle-flame"></div>
          <div class="candle-smoke"></div>
          <div class="candle-wick"></div>
          <div class="candle-pillar"></div>
        </div>

        <div class="blow-controls">
          <button class="btn-blow" id="btn-blow-candle">
            <span>💨</span> Make a Wish & Blow Candle
          </button>
        </div>

        <div class="wish-unlocked-card" id="wish-unlocked">
          👑 "Your heartfelt wish has been consecrated to the stars. May abundance and golden joy accompany your footsteps."
        </div>
      </div>
    </section>

    <!-- 8. Golden Wax Seal Keepsake Letter -->
    <section class="royal-card wax-letter-container">
      <span class="section-tag">Confidential</span>
      <h2 class="section-head">The Sealed Keepsake Letter</h2>
      <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 20px;">
        Tap the 24K gold seal to break the imperial wax and unveil the private dedication.
      </p>
      
      <div class="wax-seal-btn" id="wax-seal-btn">👑</div>

      <div class="wax-letter-content" id="wax-letter-content">
        <div class="parchment-body">
          <p class="val-letter-text">
            To our dearest Aarav, through every high and quiet turn, your steadfast loyalty and radiant heart have been our greatest treasure. Here is to your most golden year yet.
          </p>
          <div style="margin-top: 16px; font-weight: 700; color: #856328; text-align: right;">
            — <span class="val-sender">Ananya, Kabir & The Clan</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 9. Royal Photo Gallery -->
    <section class="royal-card">
      <span class="section-tag">Imperial Archives</span>
      <h2 class="section-head">Portraits of Grandeur</h2>
      <div class="gallery-grid">
        <div class="gallery-card">
          <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80" alt="Memory Portrait">
          <div class="gallery-overlay-tag">The Visionary</div>
        </div>
        <div class="gallery-card">
          <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80" alt="Celebration Portrait">
          <div class="gallery-overlay-tag">Golden Radiance</div>
        </div>
        <div class="gallery-card">
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80" alt="Joyful Moments">
          <div class="gallery-overlay-tag">Warm Laughter</div>
        </div>
        <div class="gallery-card">
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80" alt="Royal Milestones">
          <div class="gallery-overlay-tag">Timeless Grace</div>
        </div>
      </div>
    </section>

    <!-- 10. Milestone Timeline -->
    <section class="royal-card">
      <span class="section-tag">Chronicle</span>
      <h2 class="section-head">The Journey Thus Far</h2>
      <div class="timeline-list">
        <div class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="timeline-year">Year 0 • The Auspicious Arrival</div>
          <div class="timeline-desc">A shining light enters the world, bringing boundlessly bright smiles.</div>
        </div>
        <div class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="timeline-year">Year 18 • Coming of Age</div>
          <div class="timeline-desc">Taking on the world with bold courage, unwavering integrity, and grace.</div>
        </div>
        <div class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="timeline-year">Year 25 • The Crown Milestone</div>
          <div class="timeline-desc">Surrounded by family, lifelong friendships, and golden achievements.</div>
        </div>
      </div>
    </section>

    <!-- 11. Orchestral Soundtrack & Voice Player -->
    <section class="royal-card">
      <span class="section-tag">Audio Atmosphere</span>
      <h2 class="section-head">Imperial Chamber Melody</h2>
      <div class="audio-player-card" id="audio-player-card">
        <div class="audio-info">
          <div class="disc-icon">🎻</div>
          <div>
            <div style="font-weight: 700; font-size: 14px; color: var(--gold-light);">Imperial Cello & Strings</div>
            <div style="font-size: 11px; color: var(--text-muted);">Royal Court Ambient Composition</div>
          </div>
        </div>
        <button class="btn-play-toggle" id="btn-audio-toggle" onclick="this.innerText = this.innerText === '▶' ? '⏸' : '▶'; document.getElementById('audio-player-card').classList.toggle('playing');">▶</button>
      </div>
    </section>

    <!-- 12. Aristocratic Wishes Wall -->
    <section class="royal-card">
      <span class="section-tag">Guest Register</span>
      <h2 class="section-head">Noble Blessings & Wishes</h2>
      <div class="wishes-list" id="wishes-list">
        <div class="wish-bubble">
          <div class="wish-author"><span>Kabir Mehta</span><small>Family</small></div>
          <p>"To the most loyal brother anyone could ask for. Keep ruling your realm with kindness and honor!"</p>
        </div>
        <div class="wish-bubble">
          <div class="wish-author"><span>Ananya Verma</span><small>Best Friend</small></div>
          <p>"Happy 25th birthday Aarav! Proud of everything you've accomplished and the incredible human you are."</p>
        </div>
      </div>

      <form class="wish-input-group" id="wish-form">
        <input type="text" id="wish-name" placeholder="Your Name or Title" required>
        <textarea id="wish-msg" rows="2" placeholder="Leave your heartfelt royal birthday blessing..." required></textarea>
        <button type="submit">Post Imperial Blessing ✍️</button>
      </form>
    </section>

    <!-- 13. VIP Crystal Toast -->
    <section class="royal-card" style="text-align: center;">
      <span class="section-tag">The Royal Toast</span>
      <div style="font-size: 40px; margin: 12px 0;">🥂</div>
      <h2 class="section-head">A Toast to Unwritten Chapters</h2>
      <p style="font-size: 14px; color: var(--text-secondary); max-width: 480px; margin: 0 auto;">
        "May your cups always overflow with laughter, your home with peace, and your soul with divine purpose."
      </p>
    </section>

    <!-- 14. Five Regal Reasons -->
    <section class="royal-card">
      <span class="section-tag">Virtues</span>
      <h2 class="section-head">5 Regal Reasons You Inspire Us</h2>
      <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 14px;">
        <div style="background: rgba(255,255,255,0.03); padding: 12px 16px; border-radius: 8px; font-size: 13px; border-left: 3px solid var(--gold-primary);">
          <strong>1. Unwavering Integrity:</strong> You keep your word, no matter the circumstance.
        </div>
        <div style="background: rgba(255,255,255,0.03); padding: 12px 16px; border-radius: 8px; font-size: 13px; border-left: 3px solid var(--gold-primary);">
          <strong>2. Generous Heart:</strong> You celebrate everyone around you before yourself.
        </div>
        <div style="background: rgba(255,255,255,0.03); padding: 12px 16px; border-radius: 8px; font-size: 13px; border-left: 3px solid var(--gold-primary);">
          <strong>3. Quiet Strength:</strong> In stormy days, you are the anchor that keeps everyone grounded.
        </div>
        <div style="background: rgba(255,255,255,0.03); padding: 12px 16px; border-radius: 8px; font-size: 13px; border-left: 3px solid var(--gold-primary);">
          <strong>4. Infectious Laughter:</strong> A presence that instantly lights up any room.
        </div>
        <div style="background: rgba(255,255,255,0.03); padding: 12px 16px; border-radius: 8px; font-size: 13px; border-left: 3px solid var(--gold-primary);">
          <strong>5. Visionary Ambition:</strong> Always building towards a future filled with wonder.
        </div>
      </div>
    </section>

    <!-- 15. Midnight Surprise Box -->
    <section class="royal-card" style="text-align: center;">
      <span class="section-tag">Surprise Gift</span>
      <h2 class="section-head">The Royal Vault</h2>
      <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 16px;">
        Tap the golden casket to reveal your birthday surprise package.
      </p>
      <div id="casket-box" style="font-size: 54px; cursor: pointer; transition: transform 0.3s;" onclick="this.innerHTML = '🎁'; document.getElementById('casket-reveal').style.display = 'block';">
        🔒
      </div>
      <div id="casket-reveal" style="display: none; margin-top: 16px; color: var(--gold-light); font-size: 14px; font-style: italic;">
        ✨ "A private celebration dinner & weekend retreat awaits you! Check your personal itinerary."
      </div>
    </section>

    <!-- 16. Countdown Clock -->
    <section class="royal-card">
      <span class="section-tag">Astrological Transit</span>
      <h2 class="section-head">Midnight Hour Countdown</h2>
      <div class="countdown-grid">
        <div class="countdown-box">
          <span class="countdown-num" id="count-days">0</span>
          <span class="countdown-label">Days</span>
        </div>
        <div class="countdown-box">
          <span class="countdown-num" id="count-hours">0</span>
          <span class="countdown-label">Hours</span>
        </div>
        <div class="countdown-box">
          <span class="countdown-num" id="count-mins">0</span>
          <span class="countdown-label">Mins</span>
        </div>
        <div class="countdown-box">
          <span class="countdown-num" id="count-secs">0</span>
          <span class="countdown-label">Secs</span>
        </div>
      </div>
    </section>

    <!-- 17. Keepsake QR & Share -->
    <section class="royal-card">
      <span class="section-tag">Share The Joy</span>
      <h2 class="section-head">Preserve & Share This Moment</h2>
      <p style="font-size: 13px; color: var(--text-secondary);">
        Send this interactive imperial celebration to friends, family, and loved ones.
      </p>
      <div class="share-actions">
        <a class="btn-share-wa" href="https://api.whatsapp.com/send?text=Check%20out%20this%20Royal%20Birthday%20Celebration%20on%20Vanvi%20Moments!" target="_blank">Share via WhatsApp 💬</a>
        <button class="btn-copy-link" onclick="navigator.clipboard.writeText(window.location.href); alert('Link copied to clipboard!');">Copy Link 🔗</button>
      </div>
    </section>

    <!-- 18. Atelier Footer -->
    <footer class="royal-footer">
      <p>Handcrafted with imperial distinction on <a href="../../index.html">Vanvi Moments</a></p>
      <p style="margin-top: 4px; font-size: 11px;">Vanvi Atelier • Ultra-Luxury Digital Keepsakes</p>
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
  <title>Midnight Royal — Creator Studio | Vanvi Moments</title>
  <link rel="icon" type="image/svg+xml" href="../../assets/favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #070914;
      color: #fff;
      font-family: 'Outfit', sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .top-bar {
      background: #0d1226;
      border-bottom: 1px solid rgba(212, 175, 55, 0.3);
      padding: 12px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .brand {
      font-family: 'Cinzel', serif;
      color: #f7e590;
      font-size: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .view-actions {
      display: flex;
      gap: 8px;
    }
    .btn-device {
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.15);
      color: #ccc;
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 12px;
      cursor: pointer;
    }
    .btn-device.active {
      background: #d4af37;
      color: #070914;
      font-weight: 700;
    }
    .studio-grid {
      display: grid;
      grid-template-columns: 460px 1fr;
      flex: 1;
      height: calc(100vh - 60px);
    }
    @media (max-width: 900px) {
      .studio-grid { grid-template-columns: 1fr; height: auto; }
      .preview-pane { display: none; }
    }
    .editor-pane {
      background: #090d1c;
      border-right: 1px solid rgba(255,255,255,0.08);
      overflow-y: auto;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .step-box {
      background: #0d1226;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 12px;
      padding: 18px;
    }
    .step-title {
      font-size: 14px;
      font-weight: 700;
      color: #f7e590;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .form-group {
      margin-bottom: 12px;
    }
    .form-group label {
      display: block;
      font-size: 12px;
      color: #a0a6c2;
      margin-bottom: 4px;
    }
    .form-group input,
    .form-group textarea {
      width: 100%;
      background: #060814;
      border: 1px solid rgba(212, 175, 55, 0.25);
      border-radius: 6px;
      color: #fff;
      padding: 10px;
      font-family: inherit;
      font-size: 13px;
    }
    .preview-pane {
      background: #04050a;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .preview-frame {
      width: 375px;
      height: 90vh;
      border: 8px solid #1a1a24;
      border-radius: 36px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.8);
      overflow: hidden;
      transition: width 0.3s;
    }
    .preview-frame iframe {
      width: 100%;
      height: 100%;
      border: 0;
    }
    .btn-publish {
      background: linear-gradient(135deg, #f7e590, #d4af37);
      color: #070914;
      font-weight: 800;
      padding: 12px;
      border-radius: 8px;
      border: 0;
      cursor: pointer;
      font-size: 14px;
      margin-top: 10px;
    }
  </style>
</head>
<body>
  <div class="top-bar">
    <div class="brand">👑 Midnight Royal Studio</div>
    <div class="view-actions">
      <button class="btn-device active" onclick="setDevice(375, this)">Mobile</button>
      <button class="btn-device" onclick="setDevice(768, this)">Tablet</button>
      <button class="btn-device" onclick="setDevice('100%', this)">Desktop</button>
      <a href="index.html" target="_blank" class="btn-device" style="text-decoration:none;">Fullscreen ↗</a>
    </div>
  </div>

  <div class="studio-grid">
    <div class="editor-pane">
      <!-- Step 1: Person Info -->
      <div class="step-box">
        <div class="step-title">1. Birthday Person Details</div>
        <div class="form-group">
          <label>Birthday Person ka Naam</label>
          <input type="text" id="inp-name" value="Aarav Sharma" oninput="syncData()">
        </div>
        <div class="form-group">
          <label>Milestone Age</label>
          <input type="number" id="inp-age" value="25" oninput="syncData()">
        </div>
        <div class="form-group">
          <label>Birthday Date (e.g. October 18)</label>
          <input type="text" id="inp-date" value="October 18" oninput="syncData()">
        </div>
      </div>

      <!-- Step 2: Main Message -->
      <div class="step-box">
        <div class="step-title">2. Main Birthday Ode / Message</div>
        <div class="form-group">
          <label>Main message (Royal tribute)</label>
          <textarea id="inp-main-msg" rows="3" oninput="syncData()">May your 25th milestone shine with unyielding grandeur, wisdom, and eternal joy. You walk with a rare grace that elevates every soul around you.</textarea>
        </div>
      </div>

      <!-- Step 3: Wax Seal Letter -->
      <div class="step-box">
        <div class="step-title">3. Wax Seal Private Keepsake Letter</div>
        <div class="form-group">
          <label>Letter text (unfolds when seal is clicked)</label>
          <textarea id="inp-letter" rows="3" oninput="syncData()">To our dearest Aarav, through every high and quiet turn, your steadfast loyalty and radiant heart have been our greatest treasure. Here is to your most golden year yet.</textarea>
        </div>
        <div class="form-group">
          <label>Sender Name(s)</label>
          <input type="text" id="inp-sender" value="Ananya, Kabir & The Clan" oninput="syncData()">
        </div>
      </div>

      <button class="btn-publish" onclick="saveAndPublish()">Save & Preview Experience ✨</button>
    </div>

    <div class="preview-pane">
      <div class="preview-frame" id="preview-frame">
        <iframe src="index.html" id="preview-iframe"></iframe>
      </div>
    </div>
  </div>

  <script>
    function setDevice(w, btn) {
      document.querySelectorAll('.btn-device').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const frame = document.getElementById('preview-frame');
      frame.style.width = typeof w === 'number' ? w + 'px' : w;
    }

    function syncData() {
      const data = {
        name: document.getElementById('inp-name').value,
        age: document.getElementById('inp-age').value,
        birthDate: document.getElementById('inp-date').value,
        mainMessage: document.getElementById('inp-main-msg').value,
        letterText: document.getElementById('inp-letter').value,
        sender: document.getElementById('inp-sender').value
      };
      const iframe = document.getElementById('preview-iframe');
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({ type: 'VANVI_UPDATE_DATA', payload: data }, '*');
      }
      localStorage.setItem('vanvi_midnight_royal_draft', JSON.stringify(data));
    }

    function saveAndPublish() {
      syncData();
      alert('Your personalized Midnight Royal experience is ready! Opening in full view.');
      window.open('index.html', '_blank');
    }

    window.addEventListener('load', () => {
      const saved = localStorage.getItem('vanvi_midnight_royal_draft');
      if (saved) {
        try {
          const d = JSON.parse(saved);
          if (d.name) document.getElementById('inp-name').value = d.name;
          if (d.age) document.getElementById('inp-age').value = d.age;
          if (d.birthDate) document.getElementById('inp-date').value = d.birthDate;
          if (d.mainMessage) document.getElementById('inp-main-msg').value = d.mainMessage;
          if (d.letterText) document.getElementById('inp-letter').value = d.letterText;
          if (d.sender) document.getElementById('inp-sender').value = d.sender;
          setTimeout(syncData, 500);
        } catch(e) {}
      }
    });
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
  <title>Preview: Midnight Royal | Vanvi Moments</title>
  <link rel="icon" type="image/svg+xml" href="../../assets/favicon.svg">
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { background: #060814; font-family: system-ui, sans-serif; height: 100vh; display: flex; flex-direction: column; overflow: hidden; }
    .demo-bar {
      background: rgba(13, 18, 38, 0.95);
      border-bottom: 1px solid rgba(212, 175, 55, 0.3);
      padding: 10px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #f7e590;
      font-size: 13px;
      z-index: 10;
    }
    .btn-cta {
      background: linear-gradient(135deg, #f7e590, #d4af37);
      color: #060814;
      text-decoration: none;
      font-weight: 800;
      padding: 8px 18px;
      border-radius: 99px;
      font-size: 12px;
    }
    iframe { flex: 1; border: 0; width: 100%; height: 100%; }
  </style>
</head>
<body>
  <div class="demo-bar">
    <div>👑 <strong>Vanvi Moments</strong> • Live Experience Showcase</div>
    <a href="builder.html" class="btn-cta">Personalize This Template (₹499) ✨</a>
  </div>
  <iframe src="index.html"></iframe>
</body>
</html>
`;
  fs.writeFileSync(path.join(tplDir, 'preview.html'), previewHtml, 'utf8');

  console.log('  ✅ birthday-midnight-royal files built successfully.');
};
