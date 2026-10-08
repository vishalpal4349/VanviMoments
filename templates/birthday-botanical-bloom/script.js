/* ==========================================================================
   VANVI MOMENTS — BIRTHDAY BOTANICAL BLOOM SCRIPT
   Interaction: Interactive Tap-to-Bloom Flower + Petal Canvas + Chimes + Live Sync
   ========================================================================== */

(function() {
  'use strict';

  // 1. Garden Gate Entry
  const gateOverlay = document.getElementById('gate-overlay');
  const btnOpenGarden = document.getElementById('btn-open-garden');
  if (btnOpenGarden && gateOverlay) {
    btnOpenGarden.addEventListener('click', () => {
      gateOverlay.classList.add('opened');
      playGentleChime();
    });
  }

  // 2. Synthesized Ethereal Chime (Web Audio API)
  function playGentleChime() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (Harmonic Arpeggio)
      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
        gain.gain.setValueAtTime(0.3, ctx.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.1);
        osc.stop(ctx.currentTime + idx * 0.1 + 0.85);
      });
    } catch(e) {}
  }

  // 3. Signature Flower Bloom Interaction
  const flowerContainer = document.getElementById('flower-container');
  const btnBloom = document.getElementById('btn-bloom');
  const bloomWish = document.getElementById('bloom-wish');

  function triggerBloom() {
    if (!flowerContainer) return;
    const isBloomed = flowerContainer.classList.toggle('bloomed');
    playGentleChime();
    burstPetalParticles();

    if (btnBloom) {
      btnBloom.innerHTML = isBloomed ? '🌸 Flower in Full Bloom!' : '🌸 Tap to Blossom Flower';
    }
    if (bloomWish) {
      bloomWish.style.display = isBloomed ? 'block' : 'none';
    }
  }

  if (flowerContainer) flowerContainer.addEventListener('click', triggerBloom);
  if (btnBloom) btnBloom.addEventListener('click', triggerBloom);

  // 4. Petal Burst Particles on Bloom
  function burstPetalParticles() {
    const colors = ['#fcedec', '#f4c2c2', '#e07a86', '#a3c9a8', '#ffd166'];
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.style.position = 'fixed';
      p.style.left = '50%';
      p.style.top = '50%';
      p.style.width = Math.random() * 14 + 8 + 'px';
      p.style.height = Math.random() * 10 + 6 + 'px';
      p.style.borderRadius = '50% 0 50% 50%';
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      p.style.zIndex = '99999';
      p.style.pointerEvents = 'none';
      p.style.transition = 'transform 1.6s cubic-bezier(0.2, 0.8, 0.4, 1), opacity 1.6s ease';
      document.body.appendChild(p);

      const dx = (Math.random() - 0.5) * 400;
      const dy = -(Math.random() * 300 + 40);
      const rot = Math.random() * 360;

      setTimeout(() => {
        p.style.transform = `translate(${dx}px, ${dy}px) rotate(${rot}deg) scale(0.5)`;
        p.style.opacity = '0';
      }, 20);

      setTimeout(() => p.remove(), 1700);
    }
  }

  // 5. Ambient Falling Petals Canvas
  const canvas = document.getElementById('petal-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const petals = Array.from({ length: 28 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 8 + 6,
      speedX: Math.random() * 1.5 - 0.5,
      speedY: Math.random() * 1.2 + 0.8,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 2,
      color: ['rgba(244, 194, 194, 0.45)', 'rgba(224, 122, 134, 0.35)', 'rgba(163, 201, 168, 0.3)'][Math.floor(Math.random() * 3)]
    }));

    function animatePetals() {
      ctx.clearRect(0, 0, width, height);
      petals.forEach(p => {
        p.y += p.speedY;
        p.x += Math.sin(p.y * 0.01) + p.speedX;
        p.rotation += p.rotSpeed;

        if (p.y > height) {
          p.y = -20;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      requestAnimationFrame(animatePetals);
    }
    animatePetals();
  }

  // 6. Live Solar Return Countdown
  function updateCountdown() {
    const target = new Date(window.BLOOM_TARGET || '2026-11-18T00:00:00').getTime();
    const diff = target - new Date().getTime();
    if (diff > 0) {
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      const ed = document.getElementById('bloom-days');
      const eh = document.getElementById('bloom-hours');
      const em = document.getElementById('bloom-mins');
      const es = document.getElementById('bloom-secs');
      if (ed) ed.innerText = d;
      if (eh) eh.innerText = h;
      if (em) em.innerText = m;
      if (es) es.innerText = s;
    }
  }
  setInterval(updateCountdown, 1000);
  updateCountdown();

  // 7. Parse URL Parameters
  function parseUrlData() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('name')) document.querySelectorAll('.val-name').forEach(el => el.innerText = params.get('name'));
    if (params.get('age')) document.querySelectorAll('.val-age').forEach(el => el.innerText = params.get('age'));
    if (params.get('date')) document.querySelectorAll('.val-date').forEach(el => el.innerText = params.get('date'));
    if (params.get('message')) {
      const msg = document.querySelector('.val-botanical-msg');
      if (msg) msg.innerText = params.get('message');
    }
    if (params.get('sender')) document.querySelectorAll('.val-sender').forEach(el => el.innerText = params.get('sender'));
  }
  parseUrlData();

  // 8. Builder Live Sync via postMessage
  window.addEventListener('message', (event) => {
    if (!event.data || typeof event.data !== 'object') return;
    const { type, payload } = event.data;
    if (type === 'VANVI_UPDATE_DATA' && payload) {
      if (payload.name) document.querySelectorAll('.val-name').forEach(el => el.innerText = payload.name);
      if (payload.age) document.querySelectorAll('.val-age').forEach(el => el.innerText = payload.age);
      if (payload.birthDate) document.querySelectorAll('.val-date').forEach(el => el.innerText = payload.birthDate);
      if (payload.mainMessage) {
        const msg = document.querySelector('.val-botanical-msg');
        if (msg) msg.innerText = payload.mainMessage;
      }
      if (payload.milestone1) {
        const m1 = document.querySelector('.val-milestone-1');
        if (m1) m1.innerText = payload.milestone1;
      }
      if (payload.milestone2) {
        const m2 = document.querySelector('.val-milestone-2');
        if (m2) m2.innerText = payload.milestone2;
      }
      if (payload.milestone3) {
        const m3 = document.querySelector('.val-milestone-3');
        if (m3) m3.innerText = payload.milestone3;
      }
      if (payload.sender) document.querySelectorAll('.val-sender').forEach(el => el.innerText = payload.sender);
    }
  });

})();
