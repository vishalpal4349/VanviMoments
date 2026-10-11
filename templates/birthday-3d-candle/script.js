/**
 * VANVI MOMENTS — MIDNIGHT 3D CANDLE & MEMORY TRAIL SCRIPT (V2.0 PRO)
 * Interactive Multi-Candles • Mic Blowout • 3D Gift Unboxing • Cake Cutting • Wax Seal • Lightbox • 60FPS Confetti
 */

(function() {
  'use strict';

  // 1. Dynamic Query Params (Personalization & Builder Sync)
  const urlParams = new URLSearchParams(window.location.search);
  let recipient = urlParams.get('recipient') || urlParams.get('name') || 'My Favorite Person';
  let sender = urlParams.get('sender') || 'With all my love';
  let message = urlParams.get('text') || urlParams.get('message');
  let date = urlParams.get('date');
  let age = urlParams.get('age') || '21';
  let candleCount = parseInt(urlParams.get('candles') || '3', 10);
  let flameColor = urlParams.get('flame') || 'golden';
  let giftMsg = urlParams.get('giftMsg') || '';

  // Apply Flame Glow Theme to Body
  if (flameColor && flameColor !== 'golden') {
    document.body.setAttribute('data-flame', flameColor);
  }

  // DOM Elements
  const nameEl = document.getElementById('recipientName');
  if (nameEl && recipient) nameEl.textContent = recipient;

  const senderEl = document.getElementById('senderName');
  if (senderEl && sender) senderEl.textContent = sender;

  const msgEl = document.getElementById('letterBodyText');
  if (msgEl && message) msgEl.textContent = message;

  const dateEl = document.getElementById('letterDate');
  if (dateEl && date) dateEl.textContent = date;

  const ageEl = document.getElementById('ageTopperNum');
  if (ageEl && age) ageEl.textContent = age;

  const giftMsgEl = document.getElementById('giftCardMsg');
  if (giftMsgEl && giftMsg) giftMsgEl.textContent = giftMsg;

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

  function playCelebrationFanfare() {
    try {
      initAudio();
      if (!audioCtx) return;
      // Arpeggiated cheerful chords (C, E, G, C6, G5, C6)
      const notes = [523.25, 659.25, 783.99, 1046.50, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.12);

        gain.gain.setValueAtTime(0, audioCtx.currentTime + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.18, audioCtx.currentTime + idx * 0.12 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.12 + 0.9);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(audioCtx.currentTime + idx * 0.12);
        osc.stop(audioCtx.currentTime + idx * 0.12 + 1.0);
      });
    } catch (e) {}
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
        gain.gain.linearRampToValueAtTime(0.14, audioCtx.currentTime + idx * 0.1 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.1 + 1.1);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(audioCtx.currentTime + idx * 0.1);
        osc.stop(audioCtx.currentTime + idx * 0.1 + 1.2);
      });
    } catch (e) {}
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
          gain.gain.linearRampToValueAtTime(0.035, audioCtx.currentTime + 0.3);
          gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 3.0);

          osc.connect(gain);
          gain.connect(audioCtx.destination);

          osc.start();
          osc.stop(audioCtx.currentTime + 3.2);
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

  // 3. Multi-Candle Builder & Extinguish Engine
  const candlesRow = document.getElementById('candlesRow');
  const revealBox = document.getElementById('wishRevealBox');
  const hint = document.getElementById('candleHint');
  let activeCandlePods = [];
  let extinguishedCount = 0;

  function renderCandles(count) {
    if (!candlesRow) return;
    candlesRow.innerHTML = '';
    activeCandlePods = [];
    extinguishedCount = 0;

    const total = Math.min(Math.max(count || 3, 1), 5);

    for (let i = 0; i < total; i++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'candle-pod';
      btn.id = 'candlePod_' + i;
      btn.setAttribute('aria-label', `Candle ${i + 1}`);

      btn.innerHTML = `
        <div class="flame-halo" id="flameHalo_${i}"></div>
        <div class="flame" id="candleFlame_${i}"></div>
        <div class="wick"></div>
        <div class="candle-stick"><div class="candle-stripe"></div></div>
      `;

      btn.addEventListener('click', () => extinguishSingleCandle(btn));
      candlesRow.appendChild(btn);
      activeCandlePods.push(btn);
    }
  }

  function extinguishSingleCandle(pod) {
    const flame = pod.querySelector('.flame');
    const halo = pod.querySelector('.flame-halo');
    if (!flame || flame.classList.contains('extinguished')) return;

    flame.classList.add('extinguished');
    if (halo) halo.classList.add('extinguished');
    extinguishedCount++;

    // Spawn Smoke Puffs
    for (let i = 0; i < 4; i++) {
      const puff = document.createElement('div');
      puff.className = 'smoke-puff';
      puff.style.left = (Math.random() * 8 - 4) + 'px';
      puff.style.animationDelay = (i * 0.15) + 's';
      pod.appendChild(puff);
      setTimeout(() => puff.remove(), 1800);
    }

    playSoftChime();

    // If all extinguished
    if (extinguishedCount >= activeCandlePods.length) {
      handleAllExtinguished();
    }
  }

  function blowAllCandles() {
    activeCandlePods.forEach(pod => {
      extinguishSingleCandle(pod);
    });
  }

  function handleAllExtinguished() {
    if (hint) hint.style.display = 'none';
    playCelebrationFanfare();
    fireConfetti();

    setTimeout(() => {
      if (revealBox) {
        revealBox.hidden = false;
        revealBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 600);
  }

  document.getElementById('btnBlowAll')?.addEventListener('click', blowAllCandles);

  // Initialize candles
  renderCandles(candleCount);

  // 4. Microphone Blow Detection (Web Audio API)
  const micBtn = document.getElementById('micBlowBtn');
  const micLabel = document.getElementById('micBlowLabel');
  let micStream = null;
  let micAudioCtx = null;
  let micAnalyser = null;
  let micInterval = null;

  async function toggleMicBlow() {
    if (micStream) {
      // Turn off
      if (micStream) micStream.getTracks().forEach(t => t.stop());
      if (micInterval) clearInterval(micInterval);
      micStream = null;
      if (micBtn) micBtn.classList.remove('active');
      if (micLabel) micLabel.textContent = 'Tap to Blow into Mic';
      return;
    }

    try {
      micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      micAudioCtx = new AudioCtx();
      const source = micAudioCtx.createMediaStreamSource(micStream);
      micAnalyser = micAudioCtx.createAnalyser();
      micAnalyser.fftSize = 256;
      source.connect(micAnalyser);

      if (micBtn) micBtn.classList.add('active');
      if (micLabel) micLabel.textContent = '🌬️ Blow on your screen now!';

      const dataArray = new Uint8Array(micAnalyser.frequencyBinCount);

      micInterval = setInterval(() => {
        if (!micAnalyser) return;
        micAnalyser.getByteFrequencyData(dataArray);

        // Low-frequency threshold detection (blowing air creates intense low-end rumble)
        let lowFreqSum = 0;
        for (let i = 0; i < 15; i++) {
          lowFreqSum += dataArray[i];
        }
        const avg = lowFreqSum / 15;

        if (avg > 75) { // Detected strong blow!
          blowAllCandles();
          toggleMicBlow(); // turn off mic
        }
      }, 100);

    } catch (err) {
      alert('Microphone access denied or not supported. You can tap the candles directly to blow them out! ✨');
    }
  }

  micBtn?.addEventListener('click', toggleMicBlow);

  // 5. Virtual Cake Cutting Ceremony
  const btnCutCake = document.getElementById('btnCutCake');
  const cakeCutLine = document.getElementById('cakeCutLine');

  btnCutCake?.addEventListener('click', () => {
    initAudio();
    if (cakeCutLine) cakeCutLine.classList.add('cut');
    btnCutCake.innerHTML = '<span>🎉 Cake Sliced with Love!</span>';
    btnCutCake.disabled = true;
    playCelebrationFanfare();
    fireConfetti();
  });

  // 6. 3D Surprise Gift Box Unboxing
  const giftBox3d = document.getElementById('giftBox3d');
  const giftRevealCard = document.getElementById('giftRevealCard');
  const giftTapPrompt = document.getElementById('giftTapPrompt');

  function openGiftBox() {
    if (giftBox3d.classList.contains('opened')) return;
    initAudio();
    giftBox3d.classList.add('opened');
    if (giftTapPrompt) giftTapPrompt.style.display = 'none';

    playCelebrationFanfare();
    fireConfetti();

    setTimeout(() => {
      if (giftRevealCard) {
        giftRevealCard.hidden = false;
        giftRevealCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 400);
  }

  giftBox3d?.addEventListener('click', openGiftBox);

  // 7. Wax Seal Unfolding Logic
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

  // 8. Photo Lightbox Modal
  window.openLightbox = function(index) {
    const cards = document.querySelectorAll('.polaroid-card img');
    const captions = document.querySelectorAll('.polaroid-caption');
    const modal = document.getElementById('polaroidLightbox');
    const img = document.getElementById('lightboxImg');
    const cap = document.getElementById('lightboxCaption');

    if (cards[index] && img && cap && modal) {
      img.src = cards[index].src;
      cap.textContent = captions[index] ? captions[index].textContent : 'Special Moment ✨';
      modal.classList.add('active');
    }
  };

  window.closeLightbox = function() {
    const modal = document.getElementById('polaroidLightbox');
    if (modal) modal.classList.remove('active');
  };

  // 9. 60FPS Particle Confetti Engine
  function fireConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#ff2a7a', '#ffd700', '#fbbf24', '#f472b6', '#a855f7', '#38bdf8', '#ffffff'];

    for (let i = 0; i < 110; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() * 80 - 40),
        y: canvas.height * 0.42,
        w: Math.random() * 8 + 4,
        h: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() * -14) - 4,
        rotation: Math.random() * 360,
        vr: (Math.random() - 0.5) * 12,
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
        p.opacity -= 0.008;

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

  window.addEventListener('resize', () => {
    const canvas = document.getElementById('confettiCanvas');
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  });

  // 10. Live PostMessage Sync with Builder Studio
  window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'VANVI_LIVE_PREVIEW_SYNC') {
      const d = event.data;
      if (d.recipient && nameEl) nameEl.textContent = d.recipient;
      if (d.sender && senderEl) senderEl.textContent = d.sender;
      if (d.message && msgEl) msgEl.textContent = d.message;
      if (d.date && dateEl) dateEl.textContent = d.date;

      const custom = d.customData || {};
      if (custom.age && ageEl) ageEl.textContent = custom.age;
      if (custom.candles) renderCandles(parseInt(custom.candles, 10));
      if (custom.flame) document.body.setAttribute('data-flame', custom.flame);
      if (custom.giftMsg && giftMsgEl) giftMsgEl.textContent = custom.giftMsg;

      // Update polaroid gallery if photos supplied
      if (Array.isArray(d.photos) && d.photos.length > 0) {
        const row = document.getElementById('polaroidGalleryRow');
        if (row) {
          row.innerHTML = '';
          d.photos.forEach((src, idx) => {
            if (!src) return;
            const rotClass = idx % 3 === 0 ? 'rotate-left' : (idx % 3 === 1 ? 'rotate-right' : 'rotate-straight');
            row.innerHTML += `
              <figure class="polaroid-card ${rotClass}" onclick="openLightbox(${idx})">
                <div class="polaroid-pin">📍</div>
                <img src="${src}" alt="Memory ${idx + 1}" class="polaroid-img" loading="lazy">
                <figcaption class="polaroid-caption">Memory ${idx + 1} ✨</figcaption>
              </figure>
            `;
          });
        }
      }
    }
  });

})();
