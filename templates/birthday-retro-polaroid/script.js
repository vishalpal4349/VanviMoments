/* ==========================================================================
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
    card.style.transform = `translate3d(0, 0, 0) rotate(${initialRot}deg)`;

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
      card.style.transform = `translate3d(${curX + dx}px, ${curY + dy}px, 0) rotate(${initialRot + dx * 0.05}deg)`;
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
