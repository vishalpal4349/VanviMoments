/**
 * ============================================================
 * VANVI MOMENTS — FLOATING LOTUS 3D WEDDING INVITATION
 * Interactive Engine: 60fps Water/Lotus Canvas, Web Audio Synth,
 * Gold Scratch Card, 3D Gyro Tilt, Live Countdown & Action Suite
 * ============================================================
 */

(function () {
  'use strict';

  // ─── 1. DYNAMIC CONFIGURATION & MOMENT_DATA RESOLVER ───
  const urlParams = new URLSearchParams(window.location.search);
  const guestParam = urlParams.get('guest');

  let localDraft = {};
  try {
    const raw = localStorage.getItem('vanvi_floating_lotus_config');
    if (raw) localDraft = JSON.parse(raw);
  } catch (e) {}

  const globalData = window.MOMENT_DATA || {};

  const config = {
    brideName: urlParams.get('bride') || globalData.brideName || localDraft.brideName || 'Priya',
    groomName: urlParams.get('groom') || globalData.groomName || localDraft.groomName || 'Vikram',
    monogram: urlParams.get('monogram') || globalData.monogram || localDraft.monogram || '#PriVik',
    dateStr: urlParams.get('date') || globalData.dateStr || localDraft.dateStr || 'Sunday, 15 November 2026',
    muhurat: globalData.muhurat || localDraft.muhurat || 'Shubh Muhurat: 06:15 PM onwards',
    targetIsoDate: globalData.targetIsoDate || localDraft.targetIsoDate || '2026-11-15T18:15:00',
    venueName: urlParams.get('venue') || globalData.venueName || localDraft.venueName || 'The Oberoi Udaivilas',
    venueCity: globalData.venueCity || localDraft.venueCity || 'Udaipur, Rajasthan',
    whatsappLink: globalData.whatsappLink || localDraft.whatsappLink || 'https://chat.whatsapp.com/invite',
    guestGreeting: guestParam
      ? `Honored Guest · ${decodeURIComponent(guestParam)}`
      : (localDraft.defaultGuest ? `Honored Guest · ${localDraft.defaultGuest}` : 'Honored Guest · Family & Friends'),
    photos: globalData.photos || localDraft.photos || [
      {
        url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&auto=format&fit=crop&q=80',
        era: 'Chapter I · 2019',
        title: 'The First Spark',
        note: 'A quiet glance across the lake that bloomed into countless whispered conversations.'
      },
      {
        url: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&auto=format&fit=crop&q=80',
        era: 'Chapter II · 2023',
        title: 'The Starlit Promise',
        note: 'Beneath the desert stars, two paths intertwined with a gentle promise for life.'
      },
      {
        url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80',
        era: 'Chapter III · Forever',
        title: 'She Said Yes ✦',
        note: 'With lotus petals in the wind and blessings of our elders, our forever begins.'
      }
    ],
    events: globalData.events || localDraft.events || [
      {
        icon: '🌿',
        time: '10:30 AM',
        title: 'Mehendi Ki Raat',
        attire: 'Vibrant Pastel Greens',
        desc: 'Traditional henna adornment, folk music, fresh coconut water, and festive dholak beats.',
        venue: 'Courtyard of Fragrance'
      },
      {
        icon: '🌼',
        time: '03:00 PM',
        title: 'Haldi & Phoolon Ki Holi',
        attire: 'Sunny Yellow & White',
        desc: 'Sacred turmeric blessings followed by marigold petal showers and playful joyful moments.',
        venue: 'Rose Garden Terrace'
      },
      {
        icon: '✨',
        time: '07:30 PM',
        title: 'Sangeet & Musical Night',
        attire: 'Glitz & Shimmering Gold',
        desc: 'An evening of Bollywood dances, family musical battles, and acoustic performances by the lake.',
        venue: 'Grand Crystal Ballroom'
      },
      {
        icon: '🌸',
        time: '06:00 PM',
        title: 'Sacred Pheras & Vows',
        attire: 'Traditional Imperial Regalia',
        desc: 'Exchange of garlands, sacred Vedic vows around the Agni Kund, and eternal blessings.',
        venue: 'Lotus Lake Mandap'
      },
      {
        icon: '🥂',
        time: '08:30 PM',
        title: 'Imperial Reception & Dinner',
        attire: 'Royal Evening Black Tie',
        desc: 'Grand royal banquet, live santoor and sitar ensemble, celebratory champagne toast, and desserts.',
        venue: 'Royal Palace Lawns'
      }
    ]
  };

  // Populate dynamic DOM fields
  function applyConfigToDom() {
    const guestEl = document.getElementById('guestNameText');
    if (guestEl) guestEl.textContent = config.guestGreeting;

    const brideEls = document.querySelectorAll('.dyn-bride');
    brideEls.forEach(el => { el.textContent = config.brideName; });

    const groomEls = document.querySelectorAll('.dyn-groom');
    groomEls.forEach(el => { el.textContent = config.groomName; });

    const monoEls = document.querySelectorAll('.dyn-monogram');
    monoEls.forEach(el => { el.textContent = config.monogram; });

    const dateEls = document.querySelectorAll('.dyn-date');
    dateEls.forEach(el => { el.textContent = config.dateStr; });

    const muhuratEl = document.getElementById('revealedMuhuratTime');
    if (muhuratEl) muhuratEl.textContent = config.muhurat;

    const venueEls = document.querySelectorAll('.dyn-venue');
    venueEls.forEach(el => { el.textContent = `${config.venueName}, ${config.venueCity}`; });

    const waLink = document.getElementById('btnWhatsApp');
    if (waLink && config.whatsappLink) waLink.href = config.whatsappLink;

    // Populate Storyboard Polaroids
    const polaroidContainer = document.getElementById('polaroidCardsDeck');
    if (polaroidContainer && config.photos && config.photos.length > 0) {
      polaroidContainer.innerHTML = config.photos.map(p => `
        <div class="polaroid-card" data-tilt>
          <div class="polaroid-photo-frame">
            <div class="polaroid-tape-mark"></div>
            <img src="${escapeHtml(p.url)}" alt="${escapeHtml(p.title)}" loading="lazy">
          </div>
          <div class="polaroid-content">
            <span class="polaroid-era">${escapeHtml(p.era || '')}</span>
            <h3 class="polaroid-title">${escapeHtml(p.title || '')}</h3>
            <p class="polaroid-note">${escapeHtml(p.note || '')}</p>
          </div>
        </div>
      `).join('');
      setup3DTilt();
    }

    // Populate Itinerary Carousel
    const carouselTrack = document.getElementById('eventsCarouselTrack');
    if (carouselTrack && config.events && config.events.length > 0) {
      carouselTrack.innerHTML = config.events.map(ev => `
        <div class="event-slide-card">
          <div class="event-card-top">
            <span class="event-time-chip">${escapeHtml(ev.time)}</span>
            <span class="event-ceremony-icon">${ev.icon || '🌸'}</span>
          </div>
          <div>
            <h3 class="event-card-title">${escapeHtml(ev.title)}</h3>
            <span class="event-attire-badge">Attire: ${escapeHtml(ev.attire)}</span>
            <p class="event-card-desc">${escapeHtml(ev.desc)}</p>
          </div>
          <div class="event-card-venue">
            <span>📍</span>
            <span>${escapeHtml(ev.venue)}</span>
          </div>
        </div>
      `).join('');
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>'"]/g, t => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[t] || t));
  }

  // ─── 2. 60FPS BACKGROUND CANVAS (WATER RIPPLES, FLOATING LOTUS & PETALS) ───
  const canvas = document.getElementById('lotusCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Sacred floating lotus models
    const lotusFlowers = [
      { xRatio: 0.15, yRatio: 0.28, size: 48, phase: 0, swayAmp: 6, rot: 0.05 },
      { xRatio: 0.82, yRatio: 0.45, size: 56, phase: 2.1, swayAmp: 8, rot: -0.08 },
      { xRatio: 0.22, yRatio: 0.78, size: 52, phase: 4.3, swayAmp: 7, rot: 0.04 },
      { xRatio: 0.88, yRatio: 0.88, size: 44, phase: 1.2, swayAmp: 5, rot: -0.06 }
    ];

    // Ambient floating petals
    const petals = [];
    const petalCount = 28;
    for (let i = 0; i < petalCount; i++) {
      petals.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: 0.4 + Math.random() * 0.8,
        vy: 0.6 + Math.random() * 1.2,
        rot: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.03,
        scale: 0.6 + Math.random() * 0.8,
        swayPhase: Math.random() * Math.PI * 2,
        alpha: 0.5 + Math.random() * 0.45
      });
    }

    // Glowing warm diyas / particle orbs
    const diyas = [];
    const diyaCount = 18;
    for (let i = 0; i < diyaCount; i++) {
      diyas.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: 1.5 + Math.random() * 2.5,
        alpha: 0.2 + Math.random() * 0.6,
        vAlpha: (Math.random() * 0.02 + 0.008) * (Math.random() > 0.5 ? 1 : -1),
        vy: -0.3 - Math.random() * 0.5,
        swayPhase: Math.random() * Math.PI * 2
      });
    }

    // Concentric ripple caustics
    let ripplePhase = 0;

    function renderCanvas() {
      ctx.clearRect(0, 0, width, height);

      // 1. Water subtle caustic gradient
      ripplePhase += 0.015;
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, 'rgba(253, 246, 238, 0.95)');
      grad.addColorStop(0.5, 'rgba(251, 238, 232, 0.92)');
      grad.addColorStop(1, 'rgba(247, 226, 218, 0.95)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Water ripple bands
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 1.5;
      for (let r = 0; r < 4; r++) {
        const cx = width * (0.2 + r * 0.25);
        const cy = height * (0.3 + r * 0.2);
        const rad = ((ripplePhase * 40 + r * 80) % 300) + 20;
        const alpha = Math.max(0, 1 - rad / 300) * 0.25;
        ctx.beginPath();
        ctx.arc(cx, cy, rad, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(244, 170, 184, ${alpha})`;
        ctx.stroke();
      }
      ctx.restore();

      // 2. Render Floating Lotus Blossoms
      lotusFlowers.forEach(l => {
        const lx = l.xRatio * width + Math.sin(ripplePhase + l.phase) * l.swayAmp;
        const ly = l.yRatio * height + Math.cos(ripplePhase * 0.8 + l.phase) * (l.swayAmp * 0.6);
        drawSacredLotus(ctx, lx, ly, l.size, l.rot + Math.sin(ripplePhase + l.phase) * 0.04);
      });

      // 3. Render Drifting Lotus Petals
      petals.forEach(p => {
        p.x += p.vx + Math.sin(p.swayPhase + ripplePhase) * 0.5;
        p.y += p.vy;
        p.rot += p.vRot;

        if (p.x > width + 40) p.x = -40;
        if (p.y > height + 40) p.y = -40;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.scale(p.scale, p.scale);
        ctx.globalAlpha = p.alpha;

        // Draw soft blush petal
        ctx.beginPath();
        ctx.moveTo(0, -18);
        ctx.bezierCurveTo(12, -10, 14, 10, 0, 18);
        ctx.bezierCurveTo(-14, 10, -12, -10, 0, -18);
        const petalGrad = ctx.createLinearGradient(0, -18, 0, 18);
        petalGrad.addColorStop(0, '#fde6eb');
        petalGrad.addColorStop(0.6, '#f4aab8');
        petalGrad.addColorStop(1, '#db6983');
        ctx.fillStyle = petalGrad;
        ctx.fill();

        // Delicate gold vein
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(0, -14);
        ctx.lineTo(0, 14);
        ctx.stroke();

        ctx.restore();
      });

      // 4. Render Glowing Warm Diyas / Light Orbs
      diyas.forEach(d => {
        d.y += d.vy;
        d.x += Math.sin(d.swayPhase + ripplePhase) * 0.4;
        d.alpha += d.vAlpha;

        if (d.alpha >= 0.85 || d.alpha <= 0.15) d.vAlpha *= -1;
        if (d.y < -20) { d.y = height + 20; d.x = Math.random() * width; }

        ctx.save();
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 215, 120, ${d.alpha})`;
        ctx.shadowColor = '#d4af37';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.restore();
      });

      requestAnimationFrame(renderCanvas);
    }

    function drawSacredLotus(c, x, y, size, angle) {
      c.save();
      c.translate(x, y);
      c.rotate(angle);

      // Water shadow
      c.beginPath();
      c.ellipse(0, size * 0.2, size * 0.75, size * 0.35, 0, 0, Math.PI * 2);
      c.fillStyle = 'rgba(77, 14, 30, 0.08)';
      c.fill();

      // Lily pad base
      c.beginPath();
      c.ellipse(0, size * 0.1, size * 0.85, size * 0.45, 0, 0, Math.PI * 1.85);
      c.fillStyle = '#b7c9ab';
      c.fill();
      c.strokeStyle = '#8fa382';
      c.lineWidth = 1;
      c.stroke();

      // Outer petals
      const outerCount = 8;
      for (let i = 0; i < outerCount; i++) {
        const theta = (i / outerCount) * Math.PI * 2;
        c.save();
        c.rotate(theta);
        c.beginPath();
        c.moveTo(0, 0);
        c.quadraticCurveTo(size * 0.28, -size * 0.5, 0, -size * 0.7);
        c.quadraticCurveTo(-size * 0.28, -size * 0.5, 0, 0);
        c.fillStyle = 'rgba(244, 170, 184, 0.85)';
        c.fill();
        c.restore();
      }

      // Inner petals
      const innerCount = 6;
      for (let i = 0; i < innerCount; i++) {
        const theta = (i / innerCount) * Math.PI * 2 + 0.3;
        c.save();
        c.rotate(theta);
        c.beginPath();
        c.moveTo(0, 0);
        c.quadraticCurveTo(size * 0.2, -size * 0.35, 0, -size * 0.5);
        c.quadraticCurveTo(-size * 0.2, -size * 0.35, 0, 0);
        c.fillStyle = '#fde6eb';
        c.fill();
        c.restore();
      }

      // Golden center core
      c.beginPath();
      c.arc(0, 0, size * 0.16, 0, Math.PI * 2);
      c.fillStyle = '#ffd778';
      c.fill();
      c.strokeStyle = '#aa771c';
      c.lineWidth = 1;
      c.stroke();

      c.restore();
    }

    renderCanvas();
  }

  // ─── 3. CINEMATIC UNBOXING & AUDIO PLAYER (WEB AUDIO SYNTH) ───
  let audioCtx = null;
  let isPlayingMusic = false;
  let synthLoop = null;

  function initWebAudioSynth() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    isPlayingMusic = true;
    updateAudioDockUI();

    // Sacred Yaman Raag Chord progression (warm sitar & bansuri harmonic notes)
    const yamanNotes = [293.66, 369.99, 440.0, 554.37, 587.33, 739.99]; // D, F#, A, C#, D, F#

    function triggerArpeggio() {
      if (!isPlayingMusic || !audioCtx) return;
      yamanNotes.forEach((freq, idx) => {
        setTimeout(() => {
          if (!isPlayingMusic) return;
          try {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

            gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 0.18);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 2.2);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start();
            osc.stop(audioCtx.currentTime + 2.2);
          } catch (e) {}
        }, idx * 280);
      });
    }

    triggerArpeggio();
    clearInterval(synthLoop);
    synthLoop = setInterval(triggerArpeggio, 4200);
  }

  function stopMusic() {
    isPlayingMusic = false;
    clearInterval(synthLoop);
    updateAudioDockUI();
  }

  function updateAudioDockUI() {
    const dock = document.getElementById('musicDock');
    const label = document.getElementById('dockMusicStatus');
    if (!dock) return;

    if (isPlayingMusic) {
      dock.classList.add('playing');
      if (label) label.textContent = 'Raag Yaman ✦';
    } else {
      dock.classList.remove('playing');
      if (label) label.textContent = 'Play Soundtrack 🎵';
    }
  }

  // Medallion unboxing button
  const sealBtn = document.getElementById('introSealBtn');
  const introVeil = document.getElementById('cinematicIntro');
  if (sealBtn && introVeil) {
    sealBtn.addEventListener('click', () => {
      // 1. Play Sacred Music
      initWebAudioSynth();

      // 2. Hide Intro Veil
      introVeil.classList.add('unsealed');

      // 3. Golden Confetti Cannon Explosion
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 75,
          spread: 80,
          origin: { y: 0.55 },
          colors: ['#ffd778', '#d4af37', '#f4aab8', '#ffffff']
        });
      }
    });
  }

  // Floating music dock toggle
  const musicDock = document.getElementById('musicDock');
  if (musicDock) {
    musicDock.addEventListener('click', () => {
      if (isPlayingMusic) stopMusic();
      else initWebAudioSynth();
    });
  }

  // ─── 4. LIVE COUNTDOWN TIMER ───
  function initCountdown() {
    const dEl = document.getElementById('cdDays');
    const hEl = document.getElementById('cdHours');
    const mEl = document.getElementById('cdMinutes');
    const sEl = document.getElementById('cdSeconds');
    if (!dEl || !hEl || !mEl || !sEl) return;

    const targetDate = new Date(config.targetIsoDate).getTime();

    function updateTimer() {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff <= 0) {
        dEl.textContent = '00';
        hEl.textContent = '00';
        mEl.textContent = '00';
        sEl.textContent = '00';
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      dEl.textContent = String(days).padStart(2, '0');
      hEl.textContent = String(hours).padStart(2, '0');
      mEl.textContent = String(mins).padStart(2, '0');
      sEl.textContent = String(secs).padStart(2, '0');
    }

    updateTimer();
    setInterval(updateTimer, 1000);
  }

  // ─── 5. STORYBOARD 3D POLAROID TILT ───
  function setup3DTilt() {
    document.querySelectorAll('.polaroid-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(800px) rotateX(${(-y * 14).toFixed(1)}deg) rotateY(${(x * 16).toFixed(1)}deg) scale(1.03)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // ─── 6. REAL GOLD-FOIL SCRATCH CANVAS ───
  function initScratchCard() {
    const scratchCanvas = document.getElementById('scratchCanvas');
    if (!scratchCanvas) return;
    const ctx = scratchCanvas.getContext('2d');
    let isScratching = false;
    let isFullyRevealed = false;

    function resetScratchCoat() {
      const rect = scratchCanvas.getBoundingClientRect();
      scratchCanvas.width = rect.width;
      scratchCanvas.height = rect.height;

      // Realistic 24K Gold Foil Metallic Gradient
      const grad = ctx.createLinearGradient(0, 0, scratchCanvas.width, scratchCanvas.height);
      grad.addColorStop(0, '#e5c068');
      grad.addColorStop(0.25, '#fff0bd');
      grad.addColorStop(0.5, '#d4af37');
      grad.addColorStop(0.75, '#aa771c');
      grad.addColorStop(1, '#f7e09e');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height);

      // Watermark Text
      ctx.font = 'bold 15px Cinzel, serif';
      ctx.fillStyle = '#4d0e1e';
      ctx.textAlign = 'center';
      ctx.fillText('✦ SCRATCH TO REVEAL DATE ✦', scratchCanvas.width / 2, scratchCanvas.height / 2 + 5);
    }

    setTimeout(resetScratchCoat, 150);
    window.addEventListener('resize', () => {
      if (!isFullyRevealed) resetScratchCoat();
    });

    function scratchAt(x, y) {
      if (isFullyRevealed) return;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 28, 0, Math.PI * 2);
      ctx.fill();

      checkScratchedRatio();
    }

    function checkScratchedRatio() {
      if (isFullyRevealed) return;
      try {
        const imgData = ctx.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height);
        let cleared = 0;
        const total = imgData.data.length / 4;
        // Sample every 16th pixel for silky 60fps performance
        for (let i = 3; i < imgData.data.length; i += 64) {
          if (imgData.data[i] === 0) cleared++;
        }
        const ratio = cleared / (total / 16);
        if (ratio > 0.4) {
          isFullyRevealed = true;
          scratchCanvas.style.transition = 'opacity 0.6s ease';
          scratchCanvas.style.opacity = '0';
          setTimeout(() => { scratchCanvas.style.display = 'none'; }, 600);

          // Golden Confetti Cannon Explosion
          if (typeof confetti === 'function') {
            confetti({
              particleCount: 90,
              spread: 100,
              origin: { y: 0.65 },
              colors: ['#ffd778', '#d4af37', '#f4aab8', '#ffffff', '#db6983']
            });
          }
        }
      } catch (e) {}
    }

    function getCanvasCoords(e) {
      const rect = scratchCanvas.getBoundingClientRect();
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      const cy = e.touches ? e.touches[0].clientY : e.clientY;
      return { x: cx - rect.left, y: cy - rect.top };
    }

    scratchCanvas.addEventListener('mousedown', e => { isScratching = true; const p = getCanvasCoords(e); scratchAt(p.x, p.y); });
    scratchCanvas.addEventListener('mousemove', e => { if (isScratching) { const p = getCanvasCoords(e); scratchAt(p.x, p.y); } });
    window.addEventListener('mouseup', () => { isScratching = false; });

    scratchCanvas.addEventListener('touchstart', e => { isScratching = true; const p = getCanvasCoords(e); scratchAt(p.x, p.y); }, { passive: true });
    scratchCanvas.addEventListener('touchmove', e => { if (isScratching) { const p = getCanvasCoords(e); scratchAt(p.x, p.y); } }, { passive: true });
    window.addEventListener('touchend', () => { isScratching = false; });
  }

  // ─── 7. MULTI-EVENT ITINERARY CAROUSEL BUTTONS ───
  function initCarouselNav() {
    const track = document.getElementById('eventsCarouselTrack');
    const prevBtn = document.getElementById('carouselPrevBtn');
    const nextBtn = document.getElementById('carouselNextBtn');
    if (!track || !prevBtn || !nextBtn) return;

    prevBtn.addEventListener('click', () => {
      track.scrollBy({ left: -280, behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', () => {
      track.scrollBy({ left: 280, behavior: 'smooth' });
    });
  }

  // ─── 8. INTERACTIVE ACTION SUITE HANDLERS ───
  function initActionSuite() {
    // 1. Save to Calendar (Live Google Cal + Downloadable .ics)
    const calBtn = document.getElementById('btnSaveCalendar');
    if (calBtn) {
      calBtn.addEventListener('click', () => {
        const title = encodeURIComponent(`${config.brideName} & ${config.groomName}'s Royal Wedding`);
        const location = encodeURIComponent(`${config.venueName}, ${config.venueCity}`);
        const details = encodeURIComponent(`You are cordially invited to celebrate the auspicious wedding of ${config.brideName} & ${config.groomName}.`);

        // Google Calendar URL
        const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20261115T123000Z/20261115T183000Z&details=${details}&location=${location}`;

        // Downloadable .ics file
        const icsContent = [
          'BEGIN:VCALENDAR',
          'VERSION:2.0',
          'PRODID:-//Vanvi Moments//Floating Lotus Wedding//EN',
          'BEGIN:VEVENT',
          `SUMMARY:${decodeURIComponent(title)}`,
          `DESCRIPTION:${decodeURIComponent(details)}`,
          `LOCATION:${decodeURIComponent(location)}`,
          'DTSTART:20261115T123000Z',
          'DTEND:20261115T183000Z',
          'STATUS:CONFIRMED',
          'END:VEVENT',
          'END:VCALENDAR'
        ].join('\r\n');

        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `${config.monogram.replace('#','')}-Wedding.ics`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Open Google Calendar tab
        window.open(gCalUrl, '_blank');
      });
    }

    // 2. Venue Modal
    const venueBtn = document.getElementById('btnOpenVenueModal');
    const venueModal = document.getElementById('venueModalLayer');
    const closeBtn = document.getElementById('modalCloseBtn');
    if (venueBtn && venueModal) {
      venueBtn.addEventListener('click', () => venueModal.classList.add('open'));
    }
    if (closeBtn && venueModal) {
      closeBtn.addEventListener('click', () => venueModal.classList.remove('open'));
    }
    if (venueModal) {
      venueModal.addEventListener('click', e => {
        if (e.target === venueModal) venueModal.classList.remove('open');
      });
    }

    // 3. Scroll to Wishes
    const wishBtn = document.getElementById('btnScrollToWish');
    if (wishBtn) {
      wishBtn.addEventListener('click', () => {
        document.getElementById('wishesSection')?.scrollIntoView({ behavior: 'smooth' });
        document.getElementById('wishAuthor')?.focus();
      });
    }

    // 4. Send Blessing Form
    const wishForm = document.getElementById('blessingForm');
    const feed = document.getElementById('blessingsFeed');
    if (wishForm && feed) {
      wishForm.addEventListener('submit', e => {
        e.preventDefault();
        const author = document.getElementById('wishAuthor')?.value.trim();
        const text = document.getElementById('wishText')?.value.trim();
        if (!author || !text) return;

        const item = document.createElement('div');
        item.className = 'blessing-bubble-item';
        item.innerHTML = `
          <div class="blessing-bubble-top">
            <span class="blessing-author-label">${escapeHtml(author)}</span>
            <span class="blessing-time-ago">Just now</span>
          </div>
          <p class="blessing-text-body">${escapeHtml(text)}</p>
        `;
        feed.prepend(item);
        wishForm.reset();

        if (typeof confetti === 'function') {
          confetti({
            particleCount: 40,
            spread: 60,
            origin: { y: 0.8 },
            colors: ['#ffd778', '#d4af37', '#f4aab8']
          });
        }
      });
    }
  }

  // ─── INITIALIZATION ON DOM READY ───
  window.addEventListener('DOMContentLoaded', () => {
    applyConfigToDom();
    initCountdown();
    setup3DTilt();
    initScratchCard();
    initCarouselNav();
    initActionSuite();
  });

})();
