/* ==========================================================================
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
        bubble.style.transform = `translate(${dx}px, ${dy}px) scale(0.4)`;
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
