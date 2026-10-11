/**
 * THE ROYAL UDAIVILAS BAITHAK — INTERACTIVE ATELIER ENGINE (VNV-LUX-05)
 * Features: 3D Tilt, Elephant Cannons, Canvas Confetti & Petals,
 * Velvet Curtain Pull, Shagun Wax Seal, Real-time Guestbook, Audio Dock & Mood Switcher.
 */

(function () {
  'use strict';

  // 1. DYNAMIC CONFIGURATION & URL PARAMETERS
  const params = new URLSearchParams(window.location.search);
  const config = {
    bride: params.get('bride') || 'Tanya',
    groom: params.get('groom') || 'Rohan',
    date: params.get('date') || '2026-12-12',
    venue: params.get('venue') || 'The Oberoi Udaivilas, Lake Pichola, Udaipur',
    whatsapp: params.get('whatsapp') || '919999999999',
    guest: params.get('guest') || '',
    hashtag: params.get('hashtag') || '#TanyaWedsRohan',
    mood: params.get('mood') || 'pearl',
    upi: params.get('upi') || 'vanvi.udaivilas@upi'
  };

  // Populate dynamic text fields
  function injectData() {
    // Names
    const heroBride = document.getElementById('heroBride');
    const heroGroom = document.getElementById('heroGroom');
    const plBride = document.getElementById('plBride');
    const plGroom = document.getElementById('plGroom');
    if (heroBride) heroBride.textContent = config.bride;
    if (heroGroom) heroGroom.textContent = config.groom;
    if (plBride) plBride.textContent = config.bride;
    if (plGroom) plGroom.textContent = config.groom;

    // Document Title
    document.title = `${config.bride} & ${config.groom} — The Royal Udaivilas Baithak | Vanvi Moments`;

    // Date & Venue
    const heroDate = document.getElementById('heroDateText');
    const heroVenue = document.getElementById('heroVenueText');
    if (heroDate) heroDate.textContent = formatDate(config.date);
    if (heroVenue) heroVenue.textContent = config.venue;

    // Guest personalized field
    const rsvpGuest = document.getElementById('rsvpGuestName');
    if (rsvpGuest && config.guest) {
      rsvpGuest.value = decodeURIComponent(config.guest);
    }

    // Hashtag
    const hashtagLabel = document.getElementById('hashtagLabel');
    if (hashtagLabel) hashtagLabel.textContent = config.hashtag;

    // UPI
    const shagunUpi = document.getElementById('shagunUpiText');
    if (shagunUpi) shagunUpi.textContent = config.upi;

    // Set initial mood
    setHeritageMood(config.mood, false);
  }

  function formatDate(isoStr) {
    try {
      const d = new Date(isoStr);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      }
    } catch (e) {}
    return 'Saturday, 12th December 2026';
  }

  // 2. DISMISS PRELOADER
  window.addEventListener('load', () => {
    setTimeout(() => {
      const pl = document.getElementById('preloader');
      if (pl) pl.classList.add('away');
    }, 1100);
  });

  // 3. ASTRONOMICAL LIVE COUNTDOWN
  function startCountdown() {
    const target = new Date(`${config.date}T18:00:00`).getTime();
    const dEl = document.getElementById('cdDays');
    const hEl = document.getElementById('cdHours');
    const mEl = document.getElementById('cdMins');
    const sEl = document.getElementById('cdSecs');

    function update() {
      const now = Date.now();
      const diff = target - now;
      if (diff <= 0) {
        if (dEl) dEl.textContent = '00';
        if (hEl) hEl.textContent = '00';
        if (mEl) mEl.textContent = '00';
        if (sEl) sEl.textContent = '00';
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);

      if (dEl) dEl.textContent = String(days).padStart(2, '0');
      if (hEl) hEl.textContent = String(hours).padStart(2, '0');
      if (mEl) mEl.textContent = String(mins).padStart(2, '0');
      if (sEl) sEl.textContent = String(secs).padStart(2, '0');
    }
    update();
    setInterval(update, 1000);
  }

  // 4. 3D PERSPECTIVE MOUSE TILT ON HERO BOX
  const heroStage = document.getElementById('heroStage');
  const heroBox = document.getElementById('heroContentBox');
  if (heroStage && heroBox) {
    heroStage.addEventListener('mousemove', (e) => {
      const rect = heroStage.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotX = (y / rect.height) * -12;
      const rotY = (x / rect.width) * 12;
      heroBox.style.transform = `perspective(1400px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    heroStage.addEventListener('mouseleave', () => {
      heroBox.style.transform = 'perspective(1400px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }

  // 5. CANVAS CONFETTI & FLOWER SHOWER PARTICLES
  const canvas = document.getElementById('celebrationCanvas');
  const ctx = canvas ? canvas.getContext('2d') : null;
  let particles = [];
  let animId = null;

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class Particle {
    constructor(x, y, type) {
      this.x = x;
      this.y = y;
      this.type = type; // 'petal' or 'gold'
      this.size = type === 'petal' ? Math.random() * 12 + 10 : Math.random() * 8 + 6;
      this.speedX = (Math.random() - 0.5) * 16;
      this.speedY = -(Math.random() * 14 + 10);
      this.gravity = 0.35;
      this.rotation = Math.random() * 360;
      this.rotSpeed = (Math.random() - 0.5) * 8;
      this.opacity = 1;
      this.color = type === 'petal' 
        ? ['#e11d48', '#be123c', '#fda4af', '#f43f5e'][Math.floor(Math.random() * 4)]
        : ['#c4985a', '#dfba82', '#f6e3ba', '#ffd700'][Math.floor(Math.random() * 4)];
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.speedY += this.gravity;
      this.rotation += this.rotSpeed;
      this.opacity -= 0.008;
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, this.opacity);
      ctx.fillStyle = this.color;
      if (this.type === 'petal') {
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.7);
      }
      ctx.restore();
    }
  }

  function launchBlast(originX, originY, type) {
    if (!ctx) return;
    for (let i = 0; i < 70; i++) {
      particles.push(new Particle(originX, originY, type));
    }
    if (!animId) loopParticles();
  }

  function loopParticles() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw();
      if (p.opacity <= 0 || p.y > canvas.height + 50) {
        particles.splice(i, 1);
      }
    }
    if (particles.length > 0) {
      animId = requestAnimationFrame(loopParticles);
    } else {
      animId = null;
    }
  }

  // Elephant Cannon Trigger
  window.triggerElephantBlast = function (side) {
    const x = side === 'left' ? window.innerWidth * 0.2 : window.innerWidth * 0.8;
    const y = window.innerHeight * 0.6;
    const type = side === 'left' ? 'petal' : 'gold';
    launchBlast(x, y, type);
    showToast(side === 'left' ? '🌸 Pushpa Vrishti Shower Activated!' : '✨ Imperial Gold Confetti Fired!');
  };

  // 6. THEATRICAL CURTAIN PULL (s-story)
  window.partTheCurtains = function () {
    const box = document.getElementById('curtainBox');
    if (box) {
      box.classList.add('curtain-open');
      launchBlast(window.innerWidth / 2, window.innerHeight * 0.5, 'petal');
      showToast('✦ Royal Sanctuary Revealed ✦');
    }
  };

  // 7. FULLSCREEN LIGHTBOX
  window.openLightbox = function (imgUrl, caption) {
    const modal = document.getElementById('lightboxModal');
    const img = document.getElementById('lightboxImg');
    const cap = document.getElementById('lightboxCaption');
    if (modal && img) {
      img.src = imgUrl;
      if (cap) cap.textContent = caption || '';
      modal.classList.add('active');
    }
  };
  window.closeLightbox = function () {
    const modal = document.getElementById('lightboxModal');
    if (modal) modal.classList.remove('active');
  };

  // 8. SHAGUN WAX SEAL BREAK
  window.crackWaxSeal = function () {
    const seal = document.getElementById('waxSealBtn');
    const tray = document.getElementById('shagunTray');
    if (seal) seal.style.transform = 'scale(1.2) rotate(15deg)';
    setTimeout(() => {
      if (tray) tray.classList.add('active');
      launchBlast(window.innerWidth / 2, window.innerHeight * 0.6, 'gold');
      showToast('💌 Royal Shagun Envelope Opened with Love!');
    }, 250);
  };

  window.copyUpiId = function () {
    const upi = config.upi;
    navigator.clipboard.writeText(upi).then(() => {
      showToast(`✓ Copied UPI ID: ${upi}`);
    }).catch(() => {
      showToast(`UPI ID: ${upi}`);
    });
  };

  // 9. HASHTAG COPY
  window.copyHashtag = function (ht) {
    const tag = ht || config.hashtag;
    navigator.clipboard.writeText(tag).then(() => {
      showToast(`✓ Copied: ${tag}`);
    }).catch(() => {
      showToast(tag);
    });
  };

  // 10. REAL-TIME GUESTBOOK (LocalStorage)
  const LOCAL_STORAGE_KEY = `vanvi_udaivilas_blessings_${config.bride}_${config.groom}`;

  function loadSavedBlessings() {
    const list = document.getElementById('blessingsList');
    if (!list) return;
    try {
      const saved = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
      saved.forEach((b) => {
        const item = document.createElement('div');
        item.className = 'blessing-entry';
        item.innerHTML = `
          <div class="blessing-author">${escapeHtml(b.author)}</div>
          <div class="blessing-msg">${escapeHtml(b.message)}</div>
        `;
        list.prepend(item);
      });
    } catch (e) {}
  }

  window.submitBlessing = function (e) {
    e.preventDefault();
    const authorInput = document.getElementById('blessingAuthor');
    const msgInput = document.getElementById('blessingMessage');
    const list = document.getElementById('blessingsList');
    if (!authorInput || !msgInput || !list) return;

    const author = authorInput.value.trim();
    const message = msgInput.value.trim();
    if (!author || !message) return;

    const entry = document.createElement('div');
    entry.className = 'blessing-entry';
    entry.innerHTML = `
      <div class="blessing-author">${escapeHtml(author)}</div>
      <div class="blessing-msg">${escapeHtml(message)}</div>
    `;
    list.prepend(entry);

    // Save to local storage
    try {
      const saved = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
      saved.unshift({ author, message, date: new Date().toISOString() });
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(saved.slice(0, 30)));
    } catch (err) {}

    authorInput.value = '';
    msgInput.value = '';
    launchBlast(window.innerWidth / 2, window.innerHeight * 0.7, 'petal');
    showToast('🕊️ Your blessing has been etched in the royal guestbook!');
  };

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }

  // 11. 1-CLICK WHATSAPP RSVP
  window.submitWhatsAppRSVP = function () {
    const nameInput = document.getElementById('rsvpGuestName');
    const countInput = document.getElementById('rsvpCount');
    const name = nameInput ? nameInput.value.trim() || 'Honoured Guest' : 'Honoured Guest';
    const count = countInput ? countInput.value : '2';

    launchBlast(window.innerWidth / 2, window.innerHeight * 0.8, 'petal');
    launchBlast(window.innerWidth / 2, window.innerHeight * 0.8, 'gold');

    const msg = `Namaste ${config.bride} & ${config.groom}! 🌸\n\nI/We are thrilled to RSVP for your sacred wedding at The Oberoi Udaivilas!\n\n👑 Guest: ${name}\n👥 Total Attendees: ${count}\n✨ Looking forward to celebrating your Shubh Vivah!`;
    const cleanPhone = config.whatsapp.replace(/\D/g, '') || '919999999999';
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;

    showToast('💌 Preparing WhatsApp Confirmation...');
    setTimeout(() => {
      window.open(url, '_blank');
    }, 600);
  };

  // Google Calendar Link Generator
  window.addToGoogleCalendar = function (title, startIso, endIso, loc) {
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title + ' — ' + config.bride + ' & ' + config.groom)}&dates=${startIso}/${endIso}&location=${encodeURIComponent(loc)}&details=${encodeURIComponent('The Royal Udaivilas Wedding Celebration')}`;
    window.open(url, '_blank');
  };

  // 12. FLOATING ROYAL AUDIO DOCK
  const audio = document.getElementById('bgMusic');
  const audioBtn = document.getElementById('audioToggleBtn');
  const audioIcon = document.getElementById('audioIcon');
  const audioStatus = document.getElementById('audioStatusText');
  let isPlaying = false;

  window.toggleAudio = function () {
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
      if (audioBtn) audioBtn.classList.remove('audio-playing');
      if (audioIcon) audioIcon.textContent = '🔔';
      if (audioStatus) audioStatus.textContent = 'Music Paused';
    } else {
      audio.play().then(() => {
        isPlaying = true;
        if (audioBtn) audioBtn.classList.add('audio-playing');
        if (audioIcon) audioIcon.textContent = '🪕';
        if (audioStatus) audioStatus.textContent = 'Shehnai Playing';
      }).catch(() => {
        showToast('Tap anywhere to enable royal shehnai audio 🔔');
      });
    }
  };

  // Background Tab Pause
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && isPlaying && audio) {
      audio.pause();
    } else if (!document.hidden && isPlaying && audio) {
      audio.play().catch(() => {});
    }
  });

  // Autoplay on first user interaction
  document.addEventListener('click', function autoPlayOnce() {
    if (!isPlaying && audio) {
      audio.play().then(() => {
        isPlaying = true;
        if (audioBtn) audioBtn.classList.add('audio-playing');
        if (audioIcon) audioIcon.textContent = '🪕';
        if (audioStatus) audioStatus.textContent = 'Shehnai Playing';
      }).catch(() => {});
    }
    document.removeEventListener('click', autoPlayOnce);
  }, { once: true });

  // 13. HERITAGE MOOD SWITCHER
  window.toggleMoodPicker = function () {
    const menu = document.getElementById('moodMenu');
    if (menu) menu.classList.toggle('active');
  };

  window.setHeritageMood = function (moodName, showNotif = true) {
    document.body.setAttribute('data-mood', moodName);
    const label = document.getElementById('currentMoodLabel');
    const menu = document.getElementById('moodMenu');
    if (menu) menu.classList.remove('active');

    const names = {
      mewar: 'Royal Mewar',
      pearl: 'Udaipur Pearl',
      sunset: 'Jaipur Sunset'
    };
    if (label) label.textContent = names[moodName] || 'Royal Mewar';
    if (showNotif) {
      showToast(`Palette applied: ${names[moodName] || moodName} ✨`);
    }
  };

  // 14. TOAST NOTIFICATION UTILITY
  function showToast(msg) {
    const t = document.getElementById('toastNotice');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(() => {
      t.classList.remove('show');
    }, 2800);
  }

  // Initialize
  injectData();
  startCountdown();
  loadSavedBlessings();
})();
