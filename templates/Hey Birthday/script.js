/**
 * Vanvi Moments — Hey Birthday Interactive Surprise Experience
 * Exact 100% faithful engine reproducing amadowish.tech/demo/birthday
 */

(function () {
  'use strict';

  // 1. DEFAULT DATA
  const defaultData = {
    recipientName: "Emma",
    senderName: "Rahul",
    notes: [
      "Some people slowly become important without you even noticing when it happened. You're definitely one of those people. ❤️",
      "I hope this year gives you plenty of moments that make you genuinely happy — even the little ones you never planned for. ✨",
      "You have a genuinely good heart, and I hope life keeps giving you people and moments that deserve that side of you. 🌷",
      "Here's to more good conversations, silly memories, unexpected laughs, and many more stories worth remembering. 😂❤️"
    ],
    letter: [
      "As it's a special day, I didn't want to write this in some overly formal way. 😌",
      "So, first of all…",
      "Happiest Birthday to one of the genuinely good people in my life! ❤️🎂",
      "I have this little habit of writing something for the people who matter to me on their birthdays, and sending it in a slightly extra way. Of course, you had to be one of those people.",
      "I hope this year brings you plenty of good days, a few well-earned surprises, and people around you who see just how amazing you are.",
      "You have this quiet way of making things a little better just by being around — even on the most ordinary days. Not everyone can do that.",
      "So today, take a moment to actually feel appreciated, because you really are.",
      "And please…",
      "Laugh a little more. Smile a little more. Not every moment of life needs to be taken so seriously.",
      "Be happy, live freely, make beautiful memories, and enjoy your day as much as you possibly can. ❤️",
      "Happy Birthday, once again. 🎂❤️"
    ],
    photos: [
      "assets/photo1.jpg",
      "assets/photo2.jpg",
      "assets/photo3.jpg",
      "assets/photo4.jpg",
      "assets/photo5.jpg"
    ]
  };

  // State
  let currentData = { ...defaultData };
  let currentScreen = 'verification';
  let poppedBalloons = [false, false, false, false, false];
  let laughStep = 0;
  let activeSpotlight = -1;
  let isCakeBlown = false;
  let musicState = 'hidden'; // 'hidden' | 'playing' | 'paused' | 'blocked'
  let toastTimer = null;
  let musicTimer = null;

  // Sound effects
  const soundUrls = {
    pop: 'assets/pop.mp3',
    flip: 'assets/flip.mp3',
    chime: 'assets/chime.mp3'
  };
  const sounds = {};
  Object.entries(soundUrls).forEach(([k, url]) => {
    const a = new Audio(url);
    a.preload = 'auto';
    sounds[k] = a;
  });

  function playSound(key, { volume = 0.5, rate = 1.0 } = {}) {
    const s = sounds[key];
    if (!s) return;
    try {
      const clone = s.cloneNode(true);
      clone.volume = volume;
      clone.playbackRate = rate;
      clone.play().catch(() => {});
    } catch (e) {}
  }

  // Load custom data from URL query params or localStorage
  function loadData() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('recipient')) currentData.recipientName = urlParams.get('recipient');
      if (urlParams.get('sender')) currentData.senderName = urlParams.get('sender');
      
      for (let i = 0; i < 4; i++) {
        const n = urlParams.get('note' + (i + 1));
        if (n) currentData.notes[i] = n;
      }
      
      const letterParam = urlParams.get('letter');
      if (letterParam) {
        currentData.letter = letterParam.split('\n').map(s => s.trim()).filter(Boolean);
      }

      // Check localStorage for saved builder data
      const stored = localStorage.getItem('vanvi_birthday_data');
      if (stored) {
        const parsed = JSON.parse(stored);
        currentData = { ...currentData, ...parsed };
      }
    } catch (e) {
      console.warn('Error loading custom birthday data:', e);
    }
    applyDataToDOM();
  }

  function applyDataToDOM() {
    // Recipient Name
    document.querySelectorAll('.recipient-name').forEach(el => {
      el.textContent = currentData.recipientName;
    });
    // Sender Name
    document.querySelectorAll('.sender-name').forEach(el => {
      el.textContent = currentData.senderName;
    });

    // Notes
    for (let i = 0; i < 4; i++) {
      const el = document.getElementById('note-text-' + i);
      if (el && currentData.notes[i]) {
        el.textContent = currentData.notes[i];
      }
    }

    // Letter Lines
    const letterLinesEl = document.getElementById('letter-lines');
    if (letterLinesEl) {
      letterLinesEl.innerHTML = '';
      currentData.letter.forEach(line => {
        const p = document.createElement('p');
        p.textContent = line;
        letterLinesEl.appendChild(p);
      });
    }

    // Signature
    const sigEl = document.getElementById('letter-signature');
    if (sigEl) {
      sigEl.textContent = `— ${currentData.senderName} 🙂`;
    }

    // Photos
    if (currentData.photos && currentData.photos.length) {
      const cards = document.querySelectorAll('#album-grid .album-card');
      cards.forEach((card, idx) => {
        if (currentData.photos[idx]) {
          const img = card.querySelector('img');
          if (img) img.src = currentData.photos[idx];
        }
      });
    }
  }

  // 2. TOAST SYSTEM
  const toastEl = document.getElementById('toast');
  function showToast(text) {
    if (!toastEl) return;
    toastEl.textContent = text;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 2300);
  }

  // 3. CONFETTI CANVAS ENGINE
  const canvas = document.getElementById('confetti-canvas');
  let ctx = canvas ? canvas.getContext('2d') : null;
  let particles = [];
  let animId = null;
  let confettiClearTimer = null;
  const palette = ['#ff8fbd', '#ffd166', '#cbb6ff', '#9fe4c1', '#f7b4d1', '#ffffff'];

  function resizeCanvas() {
    if (!canvas || !ctx) return;
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function drawHeart(c, x, y, size, color, angle) {
    c.save();
    c.translate(x, y);
    c.rotate((angle * Math.PI) / 180);
    c.scale(size / 18, size / 18);
    c.beginPath();
    c.moveTo(0, 5);
    c.bezierCurveTo(-10, -3, -9, -11, -2, -11);
    c.bezierCurveTo(2, -11, 4, -8, 5, -6);
    c.bezierCurveTo(7, -10, 11, -12, 15, -10);
    c.bezierCurveTo(23, -5, 17, 4, 5, 13);
    c.closePath();
    c.fillStyle = color;
    c.fill();
    c.restore();
  }

  function renderConfetti() {
    if (!ctx) return;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    particles.forEach(p => {
      p.y += p.speed;
      p.x += p.drift;
      p.rotation += p.rotationSpeed;
      if (p.shape === 'heart') {
        drawHeart(ctx, p.x, p.y, p.size, p.color, p.rotation);
      } else {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.75);
        ctx.restore();
      }
    });

    particles = particles.filter(p => p.y < window.innerHeight + 45);
    if (particles.length > 0) {
      animId = requestAnimationFrame(renderConfetti);
    }
  }

  function fireConfetti(mode = 'hearts') {
    const count = mode === 'mini' ? 80 : 155;
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * -window.innerHeight,
      size: Math.random() * 7 + 5,
      speed: Math.random() * 3 + 2.1,
      drift: Math.random() * 2.4 - 1.2,
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 7 - 3.5,
      color: palette[Math.floor(Math.random() * palette.length)],
      shape: Math.random() > 0.72 ? 'heart' : 'rect'
    }));

    cancelAnimationFrame(animId);
    renderConfetti();

    clearTimeout(confettiClearTimer);
    confettiClearTimer = setTimeout(() => {
      particles = [];
      if (ctx) ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }, 5200);
  }

  // 4. SCREEN NAVIGATION
  function goToScreen(screenId) {
    currentScreen = screenId;
    document.querySelectorAll('.screen').forEach(sec => {
      sec.classList.remove('active');
    });
    const target = document.querySelector(`.screen[data-screen="${screenId}"]`);
    if (target) {
      target.classList.add('active');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function scrollToBottomBtn() {
    setTimeout(() => {
      const activeScreen = document.querySelector('section.screen.active');
      if (!activeScreen) return;
      const btn = activeScreen.querySelector('.primary-btn');
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      if (rect.top < 0 || rect.bottom > window.innerHeight) {
        btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 450);
  }

  // 5. SCREEN 1: VERIFICATION
  const btnVerifyYes = document.getElementById('btn-verify-yes');
  const btnVerifyNo = document.getElementById('btn-verify-no');
  const btnTryAgain = document.getElementById('btn-try-again');

  if (btnVerifyYes) {
    btnVerifyYes.addEventListener('click', () => {
      goToScreen('intro');
      showToast('Identity verified ✨');
    });
  }
  if (btnVerifyNo) {
    btnVerifyNo.addEventListener('click', () => {
      goToScreen('no');
    });
  }
  if (btnTryAgain) {
    btnTryAgain.addEventListener('click', () => {
      goToScreen('verification');
    });
  }

  // 6. SCREEN 2: INTRO
  const btnIntroEnter = document.getElementById('btn-intro-enter');
  if (btnIntroEnter) {
    btnIntroEnter.addEventListener('click', () => {
      goToScreen('birthday');
      fireConfetti('hearts');
    });
  }

  // 7. SCREEN 3: BIRTHDAY
  const btnBirthdayContinue = document.getElementById('btn-birthday-continue');
  if (btnBirthdayContinue) {
    btnBirthdayContinue.addEventListener('click', () => {
      goToScreen('notes');
    });
  }

  // 8. SCREEN 4: NOTES FLIP CARDS
  document.querySelectorAll('.flip-card').forEach((card) => {
    card.addEventListener('click', () => {
      playSound('flip', { volume: 0.45 });
      card.classList.toggle('flipped');
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        playSound('flip', { volume: 0.45 });
        card.classList.toggle('flipped');
      }
    });
  });

  const btnNotesContinue = document.getElementById('btn-notes-continue');
  if (btnNotesContinue) {
    btnNotesContinue.addEventListener('click', () => {
      goToScreen('balloons');
    });
  }

  // 9. SCREEN 5: BALLOONS POPPING GAME
  const balloonButtons = document.querySelectorAll('.balloon');
  const balloonStatusEl = document.getElementById('balloon-status');
  const balloonPopCommentEl = document.getElementById('balloon-pop-comment');
  const btnBalloonsContinue = document.getElementById('btn-balloons-continue');

  const balloonComments = [
    'nice shot ✨',
    'dramatic. excellent. 😂',
    'three down! 🌷',
    'almost there 👀',
    'birthday chaos contained 🎉'
  ];

  balloonButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      if (poppedBalloons[index]) return;
      poppedBalloons[index] = true;
      btn.classList.add('popped');
      playSound('pop', { volume: 0.6, rate: 0.94 + Math.random() * 0.16 });

      const remaining = poppedBalloons.filter(b => !b).length;
      const poppedCount = 5 - remaining;

      if (balloonStatusEl) {
        balloonStatusEl.textContent = remaining === 0
          ? 'All balloons successfully defeated 🎉'
          : `Balloons remaining: ${remaining}`;
      }

      if (balloonPopCommentEl) {
        balloonPopCommentEl.textContent = remaining === 5
          ? 'tap the balloons ✨'
          : balloonComments[poppedCount - 1] || 'dramatic. excellent. 😂';
      }

      if (remaining === 0) {
        fireConfetti('mini');
        if (btnBalloonsContinue) btnBalloonsContinue.style.display = 'inline-block';
        scrollToBottomBtn();
      }
    });
  });

  if (btnBalloonsContinue) {
    btnBalloonsContinue.addEventListener('click', () => {
      goToScreen('laugh');
    });
  }

  // 10. SCREEN 6: LAUGH METER
  const laughSteps = [
    { value: 22, face: '🙂', status: 'Okay... a tiny smile has been detected. The machine remains unconvinced. 😌', print: 'micro-smile detected' },
    { value: 47, face: '😄', status: 'Better! We are officially above “Monday morning” levels now. 😂', print: 'mood improving nicely' },
    { value: 73, face: '🤣', status: 'Strong reading! Nearby serious expressions are now in danger. 👀', print: 'giggle levels unstable' },
    { value: 100, face: '😂', status: '100%! Birthday laugh certification successfully approved. 🎉', print: 'CERTIFIED: properly amused' }
  ];

  const btnLaughAction = document.getElementById('btn-laugh-action');
  const laughScoreVal = document.getElementById('laugh-score-val');
  const laughTrackFill = document.getElementById('laugh-track-fill');
  const laughStatusText = document.getElementById('laugh-status-text');
  const machineFace = document.getElementById('machine-face');
  const machinePrintout = document.getElementById('machine-printout');

  if (btnLaughAction) {
    btnLaughAction.addEventListener('click', () => {
      if (laughStep >= laughSteps.length) {
        goToScreen('album');
        return;
      }

      playSound('chime', { volume: 0.55, rate: 0.85 + laughStep * 0.22 });
      const current = laughSteps[laughStep];
      laughStep++;

      if (laughScoreVal) laughScoreVal.textContent = current.value + '%';
      if (laughTrackFill) laughTrackFill.style.width = current.value + '%';
      if (laughStatusText) laughStatusText.textContent = current.status;

      if (machineFace) {
        machineFace.textContent = current.face;
        machineFace.classList.remove('bounce');
        void machineFace.offsetWidth;
        machineFace.classList.add('bounce');
      }

      if (machinePrintout) {
        machinePrintout.textContent = current.print;
      }

      if (laughStep === laughSteps.length) {
        fireConfetti('mini');
        showToast('Laugh certificate approved 😂');
        btnLaughAction.textContent = 'Continue →';
        scrollToBottomBtn();
      }
    });
  }

  // 11. SCREEN 7: PHOTO ALBUM
  document.querySelectorAll('#album-grid .album-card').forEach((card, index) => {
    card.addEventListener('click', () => {
      if (activeSpotlight === index) {
        card.classList.remove('spotlight');
        activeSpotlight = -1;
      } else {
        document.querySelectorAll('#album-grid .album-card').forEach(c => c.classList.remove('spotlight'));
        card.classList.add('spotlight');
        activeSpotlight = index;
        showToast('Museum spotlight activated ✨');
      }
    });
  });

  const btnAlbumContinue = document.getElementById('btn-album-continue');
  if (btnAlbumContinue) {
    btnAlbumContinue.addEventListener('click', () => {
      goToScreen('cake');
    });
  }

  // 12. SCREEN 8: CAKE & CANDLES
  const bgMusic = document.getElementById('bg-music');
  const musicBtn = document.getElementById('music-btn');
  const btnCakeBlow = document.getElementById('btn-cake-blow');
  const btnCakeContinue = document.getElementById('btn-cake-continue');
  const wishCake = document.getElementById('wish-cake');

  function updateMusicBtn() {
    if (!musicBtn) return;
    if (musicState === 'hidden') {
      musicBtn.style.display = 'none';
    } else {
      musicBtn.style.display = 'inline-flex';
      musicBtn.textContent = musicState === 'playing' ? '🔊 Music' : musicState === 'blocked' ? '▶ Play Music' : '🔇 Music';
    }
  }

  if (musicBtn) {
    musicBtn.addEventListener('click', () => {
      if (!bgMusic) return;
      if (bgMusic.paused) {
        bgMusic.play().then(() => {
          musicState = 'playing';
          updateMusicBtn();
        }).catch(() => {
          showToast('Music could not start 🎵');
        });
      } else {
        bgMusic.pause();
        musicState = 'paused';
        updateMusicBtn();
      }
    });
  }

  function blowCandles() {
    isCakeBlown = true;
    if (wishCake) wishCake.classList.add('all-out');
    fireConfetti('hearts');
    scrollToBottomBtn();
    showToast('Wish safely sent to the universe ✨');

    if (btnCakeBlow) btnCakeBlow.style.display = 'none';
    if (btnCakeContinue) btnCakeContinue.style.display = 'inline-block';

    if (bgMusic) {
      bgMusic.volume = 0.55;
      bgMusic.currentTime = 0;
      bgMusic.play().then(() => {
        musicState = 'playing';
        updateMusicBtn();
      }).catch(() => {
        musicState = 'blocked';
        updateMusicBtn();
        showToast('Tap the music button to start the song 🎵');
      });
    }

    clearTimeout(musicTimer);
    musicTimer = setTimeout(() => {
      if (bgMusic) {
        bgMusic.pause();
        bgMusic.currentTime = 0;
      }
      musicState = 'hidden';
      updateMusicBtn();
    }, 16000);
  }

  if (btnCakeBlow) {
    btnCakeBlow.addEventListener('click', blowCandles);
  }

  if (btnCakeContinue) {
    btnCakeContinue.addEventListener('click', () => {
      clearTimeout(musicTimer);
      goToScreen('message');
      fireConfetti('hearts');
    });
  }

  // 13. SCREEN 9: MESSAGE & REACTIONS
  const reactChips = document.querySelectorAll('.react-chip');
  const reactThanks = document.getElementById('react-thanks');
  let chosenReaction = null;

  reactChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const reactionKey = chip.getAttribute('data-reaction');
      chosenReaction = reactionKey;
      reactChips.forEach(c => c.classList.remove('is-chosen'));
      chip.classList.add('is-chosen');
      playSound('chime', { volume: 0.55 });
      fireConfetti('mini');

      if (reactThanks) {
        reactThanks.style.display = 'block';
        reactThanks.textContent = `Aww — ${currentData.senderName} will see that 💗`;
      }
    });
  });

  const btnSeeAgain = document.getElementById('btn-see-again');
  if (btnSeeAgain) {
    btnSeeAgain.addEventListener('click', () => {
      // Reset state
      poppedBalloons = [false, false, false, false, false];
      balloonButtons.forEach(b => b.classList.remove('popped'));
      if (balloonStatusEl) balloonStatusEl.textContent = 'Balloons remaining: 5';
      if (balloonPopCommentEl) balloonPopCommentEl.textContent = 'tap the balloons ✨';
      if (btnBalloonsContinue) btnBalloonsContinue.style.display = 'none';

      laughStep = 0;
      if (laughScoreVal) laughScoreVal.textContent = '0%';
      if (laughTrackFill) laughTrackFill.style.width = '0%';
      if (laughStatusText) laughStatusText.textContent = 'Current diagnosis: suspiciously serious. 👀';
      if (machineFace) machineFace.textContent = '😐';
      if (machinePrintout) machinePrintout.textContent = 'waiting for a smile...';
      if (btnLaughAction) btnLaughAction.textContent = 'Press for Better Mood 😂';

      document.querySelectorAll('.flip-card').forEach(c => c.classList.remove('flipped'));
      document.querySelectorAll('#album-grid .album-card').forEach(c => c.classList.remove('spotlight'));
      activeSpotlight = -1;

      isCakeBlown = false;
      if (wishCake) wishCake.classList.remove('all-out');
      if (btnCakeBlow) btnCakeBlow.style.display = 'inline-block';
      if (btnCakeContinue) btnCakeContinue.style.display = 'none';

      if (bgMusic) {
        bgMusic.pause();
        bgMusic.currentTime = 0;
      }
      musicState = 'hidden';
      updateMusicBtn();

      reactChips.forEach(c => c.classList.remove('is-chosen'));
      if (reactThanks) reactThanks.style.display = 'none';

      goToScreen('verification');
    });
  }

  // 14. LIVE LISTENER FOR BUILDER POSTMESSAGE
  window.addEventListener('message', (event) => {
    if (!event.data) return;
    if (event.data.type === 'VANVI_UPDATE_DATA') {
      currentData = { ...currentData, ...event.data.payload };
      applyDataToDOM();
    } else if (event.data.type === 'VANVI_NAVIGATE') {
      goToScreen(event.data.screen);
    }
  });

  // Initialize
  loadData();

})();
