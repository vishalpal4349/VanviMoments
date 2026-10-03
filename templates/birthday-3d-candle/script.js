/**
 * VANVI MOMENTS — MIDNIGHT 3D CANDLE & MEMORY TRAIL SCRIPT
 * Interactive Candle Blowout • Wax Seal Melt • Web Audio Chime • Confetti Cannon
 */

(function() {
  'use strict';

  // 1. Dynamic Query Params (Personalization)
  const urlParams = new URLSearchParams(window.location.search);
  const recipient = urlParams.get('recipient') || urlParams.get('name') || 'My Favorite Person';
  const sender = urlParams.get('sender') || 'With all my love';
  const message = urlParams.get('text') || urlParams.get('message');
  const date = urlParams.get('date');

  const nameEl = document.getElementById('recipientName');
  if (nameEl && recipient) nameEl.textContent = recipient;

  const senderEl = document.getElementById('senderName');
  if (senderEl && sender) senderEl.textContent = sender;

  const msgEl = document.getElementById('letterBodyText');
  if (msgEl && message) msgEl.textContent = message;

  const dateEl = document.getElementById('letterDate');
  if (dateEl && date) dateEl.textContent = date;

  // 2. Audio Chime & Ambient Music Synthesizer
  let audioCtx = null;
  let isPlaying = false;
  let synthInterval = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playSoftChime() {
    try {
      initAudio();
      if (!audioCtx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.1);

        gain.gain.setValueAtTime(0, audioCtx.currentTime + idx * 0.1);
        gain.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime + idx * 0.1 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.1 + 1.2);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(audioCtx.currentTime + idx * 0.1);
        osc.stop(audioCtx.currentTime + idx * 0.1 + 1.3);
      });
    } catch (e) {
      console.warn('Audio chime skipped:', e);
    }
  }

  function startGentleMelody() {
    if (isPlaying) return;
    isPlaying = true;
    const label = document.getElementById('audioLabel');
    if (label) label.textContent = 'Mute Music';

    const chords = [
      [261.63, 329.63, 392.00], // C
      [220.00, 261.63, 329.63], // Am
      [174.61, 220.00, 261.63], // F
      [196.00, 246.94, 293.66]  // G
    ];
    let chordIdx = 0;

    synthInterval = setInterval(() => {
      try {
        if (!audioCtx || !isPlaying) return;
        const currentChord = chords[chordIdx % chords.length];
        chordIdx++;

        currentChord.forEach(freq => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

          gain.gain.setValueAtTime(0, audioCtx.currentTime);
          gain.gain.linearRampToValueAtTime(0.04, audioCtx.currentTime + 0.3);
          gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 3.2);

          osc.connect(gain);
          gain.connect(audioCtx.destination);

          osc.start();
          osc.stop(audioCtx.currentTime + 3.4);
        });
      } catch (err) {}
    }, 2800);
  }

  function stopGentleMelody() {
    isPlaying = false;
    if (synthInterval) clearInterval(synthInterval);
    const label = document.getElementById('audioLabel');
    if (label) label.textContent = 'Play Music';
  }

  document.getElementById('audioToggleBtn')?.addEventListener('click', () => {
    initAudio();
    if (isPlaying) {
      stopGentleMelody();
    } else {
      startGentleMelody();
    }
  });

  // 3. Candle Extinguish Logic
  const candlePod = document.getElementById('candlePod');
  const flame = document.getElementById('candleFlame');
  const halo = document.getElementById('flameHalo');
  const hint = document.getElementById('candleHint');
  const revealBox = document.getElementById('wishRevealBox');

  let candleExtinguished = false;

  function blowOutCandle() {
    if (candleExtinguished) return;
    candleExtinguished = true;

    // Extinguish Flame
    flame.classList.add('extinguished');
    halo.classList.add('extinguished');
    if (hint) hint.style.display = 'none';

    // Spawn Smoke Puffs
    for (let i = 0; i < 4; i++) {
      const puff = document.createElement('div');
      puff.className = 'smoke-puff';
      puff.style.left = (Math.random() * 8 - 4) + 'px';
      puff.style.animationDelay = (i * 0.2) + 's';
      candlePod.appendChild(puff);
      setTimeout(() => puff.remove(), 2000);
    }

    // Play Chime & Sound
    playSoftChime();

    // Trigger Confetti
    fireConfetti();

    // Reveal Wish Message
    setTimeout(() => {
      if (revealBox) {
        revealBox.hidden = false;
        revealBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 600);
  }

  candlePod?.addEventListener('click', blowOutCandle);

  // 4. Wax Seal Unfolding Logic
  const waxSealBtn = document.getElementById('waxSealBtn');
  const letterSheet = document.getElementById('letterSheet');
  let letterOpened = false;

  function unsealEnvelope() {
    if (letterOpened) return;
    letterOpened = true;

    playSoftChime();
    waxSealBtn.classList.add('unsealed');

    setTimeout(() => {
      waxSealBtn.style.display = 'none';
      if (letterSheet) {
        letterSheet.style.display = 'block';
        letterSheet.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 350);
  }

  waxSealBtn?.addEventListener('click', unsealEnvelope);

  // 5. Confetti Engine
  function fireConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#ff2a7a', '#d97706', '#fbbf24', '#f472b6', '#cbd5e1', '#ffffff'];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() * 60 - 30),
        y: canvas.height * 0.45,
        w: Math.random() * 8 + 4,
        h: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() * -12) - 4,
        rotation: Math.random() * 360,
        vr: (Math.random() - 0.5) * 10,
        opacity: 1
      });
    }

    let animationFrame;
    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // gravity
        p.rotation += p.vr;
        p.opacity -= 0.009;

        if (p.opacity > 0) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        }
      });

      if (alive) {
        animationFrame = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(animationFrame);
      }
    }

    render();
  }

  // Auto-resize canvas
  window.addEventListener('resize', () => {
    const canvas = document.getElementById('confettiCanvas');
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  });

})();
