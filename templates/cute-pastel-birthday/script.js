/**
 * CUTE PASTEL BIRTHDAY — INTERACTIVE ENGINE
 * Vanvi Moments Luxury Digital Gifting Engine
 * Multi-device, 60fps, 15-Chapter Cinematic Experience
 */

(function() {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. DEFAULT DATA & STATE
  // --------------------------------------------------------------------------
  const DEFAULT_DATA = {
    recipientName: 'Aaradhya',
    senderName: 'From Riya',
    birthdayDate: getNextBirthdayDate(),
    heroSubtitle: 'Someone very special deserves a day as magical, sweet, and lovely as their heart ✨',
    letterMessage: `Dearest Aaradhya,\n\nWishing you the happiest, most magical birthday in the entire world! You bring so much light, comfort, and spontaneous joy into everyone's life.\n\nThank you for every late-night conversation, every shared dessert, and every gentle memory we have collected. May this upcoming year be packed with dream accomplishments, peaceful mornings, and endless reasons to smile.\n\nKeep shining as radiantly as you always do. Here's to celebrating you today and always! 🌸💖`,
    surpriseTitle: 'One Last Sweet Surprise ✈️🌸',
    surpriseMessage: 'Pack your favorite pastel dress! You are officially treated to a weekend spa retreat & cozy high-tea celebration with your favorite people.',
    finalMessage: 'May every step you take this year be sprinkled with sunshine, deep peace, laughter, and beautiful blessings.',
    theme: 'rose',
    photos: [
      { url: 'assets/hero-cover.jpg', caption: 'The Sweetest Birthday Girl ✨' },
      { url: 'assets/gallery-1.jpg', caption: 'Morning Peonies & Petals 🌸' },
      { url: 'assets/gallery-2.jpg', caption: 'Sweet Celebration Desserts 🧁' },
      { url: 'assets/gallery-3.jpg', caption: 'Joyful Moments & Balloons 🎈' },
      { url: 'assets/gallery-4.jpg', caption: 'Laughter, Sparklers & Friends ✨' }
    ],
    timeline: [
      { date: 'Chapter 1 • The Beginning', title: 'A Cherished Connection', desc: 'When our paths first crossed and brought warmth and effortless comfort.' },
      { date: 'Chapter 2 • Golden Sunsets', title: 'Laughter & Little Secrets', desc: 'Endless car rides, shared playlists, and inside jokes that never get old.' },
      { date: 'Chapter 3 • Today', title: 'Celebrating You', desc: 'A whole milestone year older, wiser, and more beautiful than ever.' },
      { date: 'Chapter 4 • The Future', title: 'Boundless Horizons', desc: 'Everything you have ever wished for is gently finding its way to you.' }
    ],
    specialMemories: [
      { title: 'The Sweetest Smile', desc: 'Your genuine laughter can effortlessly light up any room.', img: 'assets/gallery-3.jpg' },
      { title: 'Cozy Afternoons', desc: 'Warm tea, quiet chats, and the calmest moments shared.', img: 'assets/gallery-2.jpg' },
      { title: 'A Lifetime of Wishes', desc: 'May each candle on your cake grant your deepest dreams.', img: 'assets/gallery-1.jpg' }
    ]
  };

  let momentData = { ...DEFAULT_DATA };
  let isAudioPlaying = false;
  let audioContext = null;
  let audioSynthTimer = null;
  let activeLightboxIndex = 0;

  function getNextBirthdayDate() {
    const now = new Date();
    const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5, 0, 0, 0);
    return next.toISOString().split('T')[0];
  }

  // --------------------------------------------------------------------------
  // 2. DATA HYDRATION (URL Params, LocalStorage & PostMessage)
  // --------------------------------------------------------------------------
  function hydrateData() {
    try {
      const params = new URLSearchParams(window.location.search);
      
      if (params.get('recipient')) momentData.recipientName = params.get('recipient');
      if (params.get('sender')) momentData.senderName = params.get('sender');
      if (params.get('date')) momentData.birthdayDate = params.get('date');
      if (params.get('subtitle')) momentData.heroSubtitle = params.get('subtitle');
      if (params.get('letter')) momentData.letterMessage = params.get('letter');
      if (params.get('surprise')) momentData.surpriseMessage = params.get('surprise');
      if (params.get('final')) momentData.finalMessage = params.get('final');
      if (params.get('theme')) momentData.theme = params.get('theme');

      // Check for packed JSON payload (from Builder or storage)
      const dataParam = params.get('data');
      if (dataParam) {
        try {
          const parsed = JSON.parse(decodeURIComponent(escape(atob(dataParam))));
          Object.assign(momentData, parsed);
        } catch (e) {
          console.warn('Could not parse encoded data payload:', e);
        }
      }

      // Check localStorage for draft / saved instance if previewing
      const storedKey = params.get('instance') || 'vanvi_cute_pastel_draft';
      const stored = localStorage.getItem(storedKey);
      if (stored) {
        try {
          const parsedStored = JSON.parse(stored);
          Object.assign(momentData, parsedStored);
        } catch (e) {}
      }
    } catch (err) {
      console.warn('Hydration error:', err);
    }

    applyTheme(momentData.theme);
    renderPersonalization();
  }

  function applyTheme(themeName) {
    const validThemes = ['rose', 'lavender', 'peach', 'blue', 'cotton-candy', 'cream'];
    const chosen = validThemes.includes(themeName) ? themeName : 'rose';
    document.documentElement.setAttribute('data-theme', chosen);
    document.body.setAttribute('data-theme', chosen);
  }

  function renderPersonalization() {
    // Hero
    const heroName = document.getElementById('heroRecipientName');
    if (heroName) heroName.textContent = momentData.recipientName;
    const heroSub = document.getElementById('heroSubtitle');
    if (heroSub) heroSub.textContent = momentData.heroSubtitle;

    // Final Chapter
    const finalName = document.getElementById('finalRecipientName');
    if (finalName) finalName.textContent = momentData.recipientName;
    const finalMsg = document.getElementById('finalMessageText');
    if (finalMsg) finalMsg.textContent = momentData.finalMessage;

    // Letter
    const letterBody = document.getElementById('letterBody');
    if (letterBody) letterBody.textContent = momentData.letterMessage;
    const letterSig = document.getElementById('letterSignature');
    if (letterSig) letterSig.textContent = momentData.senderName;

    // Surprise
    const surpriseHeading = document.getElementById('surpriseTitle');
    if (surpriseHeading && momentData.surpriseTitle) surpriseHeading.textContent = momentData.surpriseTitle;
    const surpriseTxt = document.getElementById('surpriseText');
    if (surpriseTxt) surpriseTxt.textContent = momentData.surpriseMessage;

    // Gallery Render
    renderGallery();

    // Timeline Render
    renderTimeline();

    // Special Memories Render
    renderSpecialMemories();

    // Gift Tag
    const giftTag = document.getElementById('giftTagRecipient');
    if (giftTag) giftTag.textContent = `For ${momentData.recipientName} ✨`;

    // Document Title
    document.title = `Happy Birthday ${momentData.recipientName} ✨ | Vanvi Moments`;
  }

  function renderGallery() {
    const heroWrap = document.getElementById('galleryHeroWrapper');
    const heroImg = document.getElementById('galleryHeroImg');
    const heroCap = document.getElementById('galleryHeroCaption');
    const polaroidGrid = document.getElementById('polaroidGrid');

    if (!momentData.photos || momentData.photos.length === 0) return;

    if (heroImg && heroWrap) {
      heroImg.src = momentData.photos[0].url;
      heroImg.alt = momentData.photos[0].caption || 'Hero photo';
      if (heroCap) heroCap.textContent = momentData.photos[0].caption || 'Cherished Memory';
      heroWrap.onclick = () => openLightbox(0);
    }

    if (polaroidGrid) {
      polaroidGrid.innerHTML = '';
      momentData.photos.forEach((item, idx) => {
        if (idx === 0) return; // Hero is index 0
        const card = document.createElement('div');
        card.className = 'polaroid-card';
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `View photo ${idx + 1}`);
        card.innerHTML = `
          <img src="${item.url}" alt="${item.caption || 'Memory'}" class="polaroid-thumb" loading="lazy">
          <div class="polaroid-caption">${item.caption || `Memory #${idx + 1}`}</div>
        `;
        card.onclick = () => openLightbox(idx);
        card.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(idx); } };
        polaroidGrid.appendChild(card);
      });
    }
  }

  function renderTimeline() {
    const track = document.getElementById('timelineTrack');
    if (!track || !momentData.timeline) return;

    track.innerHTML = '';
    momentData.timeline.forEach((item) => {
      const el = document.createElement('div');
      el.className = 'timeline-item';
      el.innerHTML = `
        <div class="timeline-dot"></div>
        <div class="timeline-box">
          <div class="timeline-date-tag">${escapeHtml(item.date)}</div>
          <h3 class="timeline-item-title">${escapeHtml(item.title)}</h3>
          <p class="timeline-item-desc">${escapeHtml(item.desc)}</p>
        </div>
      `;
      track.appendChild(el);
    });
  }

  function renderSpecialMemories() {
    const grid = document.getElementById('memoriesGrid');
    if (!grid || !momentData.specialMemories) return;

    grid.innerHTML = '';
    momentData.specialMemories.forEach((mem) => {
      const el = document.createElement('div');
      el.className = 'memory-clay-card';
      el.innerHTML = `
        <img src="${mem.img || 'assets/hero-cover.jpg'}" alt="${escapeHtml(mem.title)}" class="memory-card-img" loading="lazy">
        <h3 class="memory-card-title">${escapeHtml(mem.title)}</h3>
        <p class="memory-card-desc">${escapeHtml(mem.desc)}</p>
      `;
      grid.appendChild(el);
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // --------------------------------------------------------------------------
  // 3. INTRO SCREEN LOADER
  // --------------------------------------------------------------------------
  function setupIntroLoader() {
    const loader = document.getElementById('introLoader');
    if (!loader) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = prefersReducedMotion ? 400 : 1200;

    setTimeout(() => {
      loader.classList.add('fade-out');
      setTimeout(() => {
        loader.style.display = 'none';
      }, 600);
    }, duration);
  }

  // --------------------------------------------------------------------------
  // 4. SECTION 2 — 3D GIFT REVEAL
  // --------------------------------------------------------------------------
  function setupGiftReveal() {
    const giftWrap = document.getElementById('giftBoxWrap');
    const btnOpen = document.getElementById('btnOpenGift');
    const btnRewrap = document.getElementById('btnRewrapGift');
    const content = document.getElementById('giftRevealed');

    function triggerOpen() {
      if (!giftWrap || giftWrap.classList.contains('opened')) return;
      giftWrap.classList.add('opened');
      
      // Fire celebration confetti & chime sound
      fireConfetti(window.innerWidth / 2, window.innerHeight * 0.45);
      playChimeSound();
      
      if (content) {
        content.style.display = 'block';
      }
      if (btnOpen) {
        btnOpen.style.display = 'none';
      }
      if (btnRewrap) {
        btnRewrap.style.display = 'inline-flex';
      }
      showToast('Surprise unlocked! ✨');
    }

    function triggerRewrap() {
      if (!giftWrap) return;
      giftWrap.classList.remove('opened');
      if (content) {
        content.style.display = 'none';
      }
      if (btnOpen) {
        btnOpen.style.display = 'inline-flex';
      }
      if (btnRewrap) {
        btnRewrap.style.display = 'none';
      }
      showToast('Gift re-wrapped 🎀');
    }

    if (giftWrap) giftWrap.addEventListener('click', triggerOpen);
    if (btnOpen) btnOpen.addEventListener('click', triggerOpen);
    if (btnRewrap) btnRewrap.addEventListener('click', triggerRewrap);
  }

  // --------------------------------------------------------------------------
  // 5. SECTION 3 — BIRTHDAY COUNTDOWN
  // --------------------------------------------------------------------------
  function setupCountdown() {
    const elDays = document.getElementById('cdDays');
    const elHours = document.getElementById('cdHours');
    const elMins = document.getElementById('cdMins');
    const elSecs = document.getElementById('cdSecs');
    const title = document.getElementById('countdownSectionTitle');

    function updateTimer() {
      if (!momentData.birthdayDate) return;
      
      const target = new Date(momentData.birthdayDate + 'T00:00:00');
      const now = new Date();
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        if (elDays) elDays.textContent = '00';
        if (elHours) elHours.textContent = '00';
        if (elMins) elMins.textContent = '00';
        if (elSecs) elSecs.textContent = '00';
        if (title) title.textContent = "It's Celebration Day! 🎉";
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      if (elDays) elDays.textContent = String(days).padStart(2, '0');
      if (elHours) elHours.textContent = String(hours).padStart(2, '0');
      if (elMins) elMins.textContent = String(mins).padStart(2, '0');
      if (elSecs) elSecs.textContent = String(secs).padStart(2, '0');
    }

    updateTimer();
    setInterval(updateTimer, 1000);
  }

  // --------------------------------------------------------------------------
  // 6. SECTION 4 — CAKE CELEBRATION (Make a Wish)
  // --------------------------------------------------------------------------
  function setupCakeCelebration() {
    const btnWish = document.getElementById('btnMakeWish');
    const btnRelight = document.getElementById('btnRelightCake');
    const cakeStage = document.getElementById('cakeStage');
    const dimOverlay = document.getElementById('wishScreenDim');
    const wishStatus = document.getElementById('wishStatusText');

    if (!btnWish) return;

    btnWish.addEventListener('click', () => {
      // 1. Dim screen for intimate magical ambiance
      if (dimOverlay) dimOverlay.classList.add('active');
      btnWish.disabled = true;
      btnWish.innerHTML = '<span>Making a Wish... 💫</span>';

      // 2. Extinguish flames with puff of smoke
      setTimeout(() => {
        if (cakeStage) cakeStage.classList.add('blown');
        if (dimOverlay) dimOverlay.classList.remove('active');

        // 3. Return with celebratory star confetti & sound
        fireConfetti(window.innerWidth / 2, window.innerHeight * 0.4);
        playChimeSound();

        btnWish.innerHTML = '<span>Wish Sent to the Stars! ✨</span>';
        if (wishStatus) {
          wishStatus.textContent = 'Your wish has been sealed in the stars. May it all come true! 🎂🌟';
          wishStatus.style.color = 'var(--theme-primary)';
          wishStatus.style.fontWeight = '800';
        }
        if (btnRelight) {
          btnRelight.style.display = 'inline-flex';
        }
        showToast('Candles blown! Wish made ✨');
      }, 1600);
    });

    if (btnRelight) {
      btnRelight.addEventListener('click', () => {
        if (cakeStage) cakeStage.classList.remove('blown');
        btnWish.disabled = false;
        btnWish.innerHTML = '<span>Make A Wish ✨</span>';
        btnRelight.style.display = 'none';
        if (wishStatus) {
          wishStatus.textContent = '🕯️ Tap the button to extinguish the candles and make your wish!';
          wishStatus.style.color = '';
          wishStatus.style.fontWeight = '';
        }
        playChimeSound();
        showToast('Candles re-lit! Make another wish 🕯️');
      });
    }
  }

  // --------------------------------------------------------------------------
  // 7. SECTION 6 — FULLSCREEN LIGHTBOX & GESTURES
  // --------------------------------------------------------------------------
  function setupLightbox() {
    const modal = document.getElementById('lightboxModal');
    const img = document.getElementById('lightboxImg');
    const caption = document.getElementById('lightboxCaption');
    const btnClose = document.getElementById('lightboxClose');

    if (!modal) return;

    window.openLightbox = function(index) {
      if (!momentData.photos || !momentData.photos[index]) return;
      activeLightboxIndex = index;
      if (img) img.src = momentData.photos[index].url;
      if (caption) caption.textContent = momentData.photos[index].caption || '';
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    function closeLightbox() {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (btnClose) btnClose.addEventListener('click', closeLightbox);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') navigateLightbox(1);
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
    });

    // Touch Swipe handling on mobile
    let touchStartX = 0;
    modal.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    modal.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 45) {
        if (diff < 0) navigateLightbox(1); // Swipe left -> Next
        else navigateLightbox(-1); // Swipe right -> Prev
      }
    }, { passive: true });
  }

  function navigateLightbox(dir) {
    if (!momentData.photos || momentData.photos.length === 0) return;
    activeLightboxIndex = (activeLightboxIndex + dir + momentData.photos.length) % momentData.photos.length;
    const img = document.getElementById('lightboxImg');
    const caption = document.getElementById('lightboxCaption');
    if (img) img.src = momentData.photos[activeLightboxIndex].url;
    if (caption) caption.textContent = momentData.photos[activeLightboxIndex].caption || '';
  }

  // --------------------------------------------------------------------------
  // 8. SECTION 8 — BIRTHDAY LETTER (Royal Envelope)
  // --------------------------------------------------------------------------
  function setupLetter() {
    const envelope = document.getElementById('envelopeBox');
    const btnRead = document.getElementById('btnReadLetter');
    const paper = document.getElementById('letterPaper');

    function openEnvelope() {
      if (!paper) return;
      paper.style.display = 'block';
      if (btnRead) btnRead.style.display = 'none';
      if (envelope) {
        envelope.style.opacity = '0.9';
        envelope.style.transform = 'scale(0.98)';
      }
      showToast('Letter opened 💌');
      paper.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    if (btnRead) btnRead.addEventListener('click', openEnvelope);
    if (envelope) envelope.addEventListener('click', openEnvelope);
  }

  // --------------------------------------------------------------------------
  // 9. SECTION 10 — SURPRISE REVEAL
  // --------------------------------------------------------------------------
  function setupSurpriseReveal() {
    const btnReveal = document.getElementById('btnRevealSurprise');
    const content = document.getElementById('surpriseHidden');

    if (!btnReveal) return;

    btnReveal.addEventListener('click', () => {
      if (content) content.style.display = 'block';
      btnReveal.style.display = 'none';
      fireConfetti(window.innerWidth / 2, window.innerHeight * 0.5);
      showToast('Surprise revealed! 🎁');
    });
  }

  // --------------------------------------------------------------------------
  // 10. SECTION 11 — FLOATING CUTE VINYL MUSIC PLAYER
  // --------------------------------------------------------------------------
  function setupMusicPlayer() {
    const widget = document.getElementById('floatingMusicWidget');
    const disc = document.getElementById('miniVinylDisc');
    const status = document.getElementById('musicWidgetStatus');

    if (!widget) return;

    widget.addEventListener('click', () => {
      toggleMusic();
    });

    function toggleMusic() {
      isAudioPlaying = !isAudioPlaying;

      if (isAudioPlaying) {
        startSynthesizerMelody();
        if (disc) disc.classList.add('playing');
        if (status) status.textContent = 'Playing 🎵';
        showToast('Birthday melody playing 🎵');
      } else {
        stopSynthesizerMelody();
        if (disc) disc.classList.remove('playing');
        if (status) status.textContent = 'Paused ⏸️';
        showToast('Music paused');
      }
    }
  }

  // Web Audio Harmonic Chord Synthesizer (Zero-dependency foolproof melody)
  function startSynthesizerMelody() {
    try {
      if (!audioContext) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        audioContext = new AudioCtx();
      }
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      // Happy Birthday Melody Frequencies
      const notes = [
        { f: 261.63, d: 0.35 }, // C4
        { f: 261.63, d: 0.35 }, // C4
        { f: 293.66, d: 0.7 },  // D4
        { f: 261.63, d: 0.7 },  // C4
        { f: 349.23, d: 0.7 },  // F4
        { f: 329.63, d: 1.2 },  // E4
        { f: 261.63, d: 0.35 }, // C4
        { f: 261.63, d: 0.35 }, // C4
        { f: 293.66, d: 0.7 },  // D4
        { f: 261.63, d: 0.7 },  // C4
        { f: 392.00, d: 0.7 },  // G4
        { f: 349.23, d: 1.2 },  // F4
        { f: 261.63, d: 0.35 }, // C4
        { f: 261.63, d: 0.35 }, // C4
        { f: 523.25, d: 0.7 },  // C5
        { f: 440.00, d: 0.7 },  // A4
        { f: 349.23, d: 0.7 },  // F4
        { f: 329.63, d: 0.7 },  // E4
        { f: 293.66, d: 1.2 },  // D4
        { f: 466.16, d: 0.35 }, // Bb4
        { f: 466.16, d: 0.35 }, // Bb4
        { f: 440.00, d: 0.7 },  // A4
        { f: 349.23, d: 0.7 },  // F4
        { f: 392.00, d: 0.7 },  // G4
        { f: 349.23, d: 1.4 }   // F4
      ];

      let noteIdx = 0;
      function playNext() {
        if (!isAudioPlaying || !audioContext) return;
        const current = notes[noteIdx];
        playHarmonicBell(current.f, current.d * 0.85);
        noteIdx = (noteIdx + 1) % notes.length;
        audioSynthTimer = setTimeout(playNext, current.d * 1000);
      }

      playNext();
    } catch (e) {
      console.warn('Audio synth not supported:', e);
    }
  }

  function playHarmonicBell(freq, duration) {
    if (!audioContext) return;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.type = 'triangle'; // Warm music-box tone
    osc.frequency.setValueAtTime(freq, audioContext.currentTime);

    gain.gain.setValueAtTime(0.001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.22, audioContext.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioContext.destination);

    osc.start();
    osc.stop(audioContext.currentTime + duration);
  }

  function playChimeSound() {
    try {
      if (!audioContext) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        audioContext = new AudioCtx();
      }
      playHarmonicBell(523.25, 0.4);
      setTimeout(() => playHarmonicBell(659.25, 0.4), 120);
      setTimeout(() => playHarmonicBell(783.99, 0.8), 240);
    } catch (e) {}
  }

  function stopSynthesizerMelody() {
    if (audioSynthTimer) {
      clearTimeout(audioSynthTimer);
      audioSynthTimer = null;
    }
  }

  // --------------------------------------------------------------------------
  // 11. SECTION 12 — AMBIENT FLOATING PETALS & SPARKLES CANVAS
  // --------------------------------------------------------------------------
  function setupAmbientCanvas() {
    const canvas = document.getElementById('ambientCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }, { passive: true });

    // 24 lightweight particles (petals, tiny stars, gentle hearts)
    const particles = [];
    const count = window.innerWidth < 600 ? 16 : 28;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 8 + 5,
        speedY: Math.random() * 0.8 + 0.4,
        speedX: Math.sin(Math.random() * Math.PI) * 0.6,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 1.5,
        opacity: Math.random() * 0.45 + 0.25,
        type: i % 3 === 0 ? 'heart' : i % 3 === 1 ? 'petal' : 'star'
      });
    }

    let isVisible = true;
    document.addEventListener('visibilitychange', () => {
      isVisible = !document.hidden;
    });

    function draw() {
      if (!isVisible) {
        requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += Math.sin(p.y * 0.01) * 0.5;
        p.rotation += p.rotSpeed;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;

        if (p.type === 'heart') {
          ctx.fillStyle = '#ff6da8';
          drawHeart(ctx, 0, 0, p.size * 0.6);
        } else if (p.type === 'petal') {
          ctx.fillStyle = '#fbcfe8';
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 0.7, p.size * 0.35, Math.PI / 4, 0, 2 * Math.PI);
          ctx.fill();
        } else {
          ctx.fillStyle = '#fde68a';
          drawStar(ctx, 0, 0, p.size * 0.5);
        }

        ctx.restore();
      });

      requestAnimationFrame(draw);
    }

    function drawHeart(c, cx, cy, s) {
      c.beginPath();
      c.moveTo(cx, cy + s * 0.3);
      c.bezierCurveTo(cx - s, cy - s * 0.5, cx - s * 1.2, cy + s * 0.3, cx, cy + s);
      c.bezierCurveTo(cx + s * 1.2, cy + s * 0.3, cx + s, cy - s * 0.5, cx, cy + s * 0.3);
      c.fill();
    }

    function drawStar(c, cx, cy, s) {
      c.beginPath();
      for (let i = 0; i < 5; i++) {
        c.lineTo(Math.cos((18 + i * 72) * 0.01745) * s + cx, -Math.sin((18 + i * 72) * 0.01745) * s + cy);
        c.lineTo(Math.cos((54 + i * 72) * 0.01745) * (s * 0.5) + cx, -Math.sin((54 + i * 72) * 0.01745) * (s * 0.5) + cy);
      }
      c.closePath();
      c.fill();
    }

    requestAnimationFrame(draw);
  }

  // --------------------------------------------------------------------------
  // 12. SECTION 14 — FINAL CELEBRATION & CONFETTI CANNON
  // --------------------------------------------------------------------------
  function setupConfettiEngine() {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }, { passive: true });

    let confettiPieces = [];

    window.fireConfetti = function(originX = width / 2, originY = height / 2) {
      const colors = ['#ff6da8', '#c084fc', '#60a5fa', '#fb923c', '#f59e0b', '#f472b6', '#ffffff'];
      const count = window.innerWidth < 600 ? 55 : 85;

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 9 + 4;
        confettiPieces.push({
          x: originX,
          y: originY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 3.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 8 + 4,
          tilt: Math.random() * 360,
          tiltSpeed: (Math.random() - 0.5) * 12,
          gravity: 0.22,
          alpha: 1
        });
      }
    };

    function renderConfetti() {
      if (confettiPieces.length === 0) {
        requestAnimationFrame(renderConfetti);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      for (let i = confettiPieces.length - 1; i >= 0; i--) {
        const p = confettiPieces[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.tilt += p.tiltSpeed;
        p.alpha -= 0.012;

        if (p.alpha <= 0 || p.y > height + 20) {
          confettiPieces.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.tilt * Math.PI) / 180);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.4);
        ctx.restore();
      }

      requestAnimationFrame(renderConfetti);
    }

    requestAnimationFrame(renderConfetti);

    const btnCelebrate = document.getElementById('btnCelebrateAgain');
    if (btnCelebrate) {
      btnCelebrate.addEventListener('click', () => {
        window.fireConfetti(window.innerWidth / 2, window.innerHeight * 0.5);
        playChimeSound();
        showToast('Happy Birthday once more! 🎉✨');
      });
    }
  }

  // --------------------------------------------------------------------------
  // 13. SECTION 15 — SHARE & HIGH-RES QR
  // --------------------------------------------------------------------------
  function setupShareSystem() {
    const btnCopy = document.getElementById('btnCopyLink');
    const btnWhatsapp = document.getElementById('btnShareWhatsapp');
    const btnShare = document.getElementById('btnWebShare');
    const qrCanvas = document.getElementById('shareQrCanvas');
    const currentUrl = window.location.href;

    // QR Generation
    if (qrCanvas && typeof QRCode !== 'undefined') {
      try {
        qrCanvas.innerHTML = '';
        new QRCode(qrCanvas, {
          text: currentUrl,
          width: 140,
          height: 140,
          colorDark: '#3b182e',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.M
        });
      } catch (e) {
        console.warn('QR render error:', e);
      }
    }

    // Copy Link
    if (btnCopy) {
      btnCopy.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(currentUrl);
          showToast('Link copied to clipboard! ✨');
        } catch (e) {
          fallbackCopyText(currentUrl);
        }
      });
    }

    // WhatsApp Share
    if (btnWhatsapp) {
      btnWhatsapp.addEventListener('click', () => {
        const text = encodeURIComponent(`✨ Happy Birthday ${momentData.recipientName}! I made this special keepsake moment for you: ${currentUrl}`);
        window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
      });
    }

    // Native Web Share API
    if (btnShare) {
      btnShare.addEventListener('click', async () => {
        if (navigator.share) {
          try {
            await navigator.share({
              title: `Happy Birthday ${momentData.recipientName}! ✨`,
              text: `A personalized birthday moment crafted with love.`,
              url: currentUrl
            });
          } catch (e) {}
        } else {
          // Fallback to clipboard
          try {
            await navigator.clipboard.writeText(currentUrl);
            showToast('Link copied to clipboard! ✨');
          } catch (e) {
            fallbackCopyText(currentUrl);
          }
        }
      });
    }

    // Customize Again
    const btnCustomize = document.getElementById('btnCustomizeAgain');
    if (btnCustomize) {
      btnCustomize.addEventListener('click', () => {
        window.location.href = `builder.html?template=cute-pastel-birthday${window.location.search ? '&' + window.location.search.substring(1) : ''}`;
      });
    }
  }

  function fallbackCopyText(text) {
    const input = document.createElement('textarea');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    try {
      document.execCommand('copy');
      showToast('Link copied to clipboard! ✨');
    } catch (e) {
      showToast('Unable to copy. Please copy URL directly.');
    }
    document.body.removeChild(input);
  }

  // --------------------------------------------------------------------------
  // 14. GLOBAL TOAST UTILITY
  // --------------------------------------------------------------------------
  let toastTimer = null;
  function showToast(msg) {
    let toast = document.getElementById('vanviToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'vanviToast';
      toast.className = 'vanvi-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2400);
  }

  // --------------------------------------------------------------------------
  // 15. LIVE BUILDER 2-WAY POSTMESSAGE SYNC
  // --------------------------------------------------------------------------
  window.addEventListener('message', (event) => {
    if (!event.data || typeof event.data !== 'object') return;
    if (event.data.type === 'VANVI_LIVE_UPDATE') {
      const payload = event.data.payload;
      if (payload) {
        Object.assign(momentData, payload);
        if (payload.theme) applyTheme(payload.theme);
        renderPersonalization();
      }
    }
  });

  // --------------------------------------------------------------------------
  // INITIALIZATION ON DOM READY
  // --------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    hydrateData();
    setupIntroLoader();
    setupGiftReveal();
    setupCountdown();
    setupCakeCelebration();
    setupLightbox();
    setupLetter();
    setupSurpriseReveal();
    setupMusicPlayer();
    setupAmbientCanvas();
    setupConfettiEngine();
    setupShareSystem();
  });

})();
