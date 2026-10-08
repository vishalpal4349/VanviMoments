/* ==========================================================================
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
        ctx.fillStyle = `rgba(226, 232, 240, ${opacity * 0.8})`;
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
