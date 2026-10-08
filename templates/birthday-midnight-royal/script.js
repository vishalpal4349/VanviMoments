/* ==========================================================================
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
        ctx.fillStyle = `rgba(212, 175, 55, ${e.alpha})`;
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
        drop.style.transform = `translate(${destX}px, ${destY}px) rotate(${Math.random() * 360}deg)`;
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
        bubble.innerHTML = `<div class="wish-author"><span>${nameInput.value.trim()}</span><small>Just now</small></div><p>${msgInput.value.trim()}</p>`;
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
