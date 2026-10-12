/**
 * SACRED TEMPLE EDITION — TRADITIONAL WEDDING SUITE (VNV-TMPL-02)
 * Features: Kerala Kasavu Curtains Reveal, 3D Backwaters Parallax,
 * Scroll-Triggered Nilavilakku Lamp Lighting Ceremony, Floating Fireflies,
 * VIP Personalized Guest Invite (?guest=Name), Interactive Sacred Ashirwad WhatsApp Delivery.
 */

(function () {
  'use strict';

  // 1. DYNAMIC CONFIGURATION & URL PARAMETERS
  const params = new URLSearchParams(window.location.search);
  const config = {
    bride: params.get('bride') || 'Divya',
    groom: params.get('groom') || 'Kishan',
    date: params.get('date') || '2027-07-13',
    muhurtham: params.get('muhurtham') || '9:15 AM – 10:45 AM',
    venue: params.get('venue') || 'Guruvayur Temple & Backwaters Pavilion, Kerala',
    whatsapp: params.get('whatsapp') || '917631442934',
    guest: params.get('guest') || '',
    hashtag: params.get('hashtag') || '#KishanWedsDivya'
  };

  function injectConfig() {
    // Inject names
    const brideEls = document.querySelectorAll('.bind-bride');
    const groomEls = document.querySelectorAll('.bind-groom');
    brideEls.forEach(el => el.textContent = config.bride);
    groomEls.forEach(el => el.textContent = config.groom);

    document.title = `${config.groom} & ${config.bride} — Sacred Temple Edition | Vanvi Moments`;

    const venueEls = document.querySelectorAll('.bind-venue');
    venueEls.forEach(el => el.textContent = config.venue);

    const muhurthamEls = document.querySelectorAll('.bind-muhurtham');
    muhurthamEls.forEach(el => el.textContent = config.muhurtham);

    // VIP Guest Personalization
    const guestPill = document.getElementById('vipGuestPill');
    if (guestPill) {
      if (config.guest) {
        guestPill.innerHTML = `🪷 Sacred Invitation For: <strong>${decodeURIComponent(config.guest)}</strong>`;
        guestPill.style.display = 'inline-flex';
      } else {
        guestPill.style.display = 'none';
      }
    }
  }

  // 2. KERALA KASAVU CURTAINS STORY REVEAL
  window.openKasavuCurtains = function () {
    const overlay = document.getElementById('kasavuCurtainOverlay');
    if (overlay) {
      overlay.classList.add('opened');
      launchSacredPetals();
      showToast('🛕 Welcome to the Sacred Temple Wedding!');
      autoStartAudio();
    }
  };

  // 3. BACKGROUND SACRED AUDIO
  const audio = document.getElementById('templeAudio');
  const audioBtn = document.getElementById('btnTempleAudio');
  let isAudioPlaying = false;

  window.toggleTempleAudio = function () {
    if (!audio) return;
    if (isAudioPlaying) {
      audio.pause();
      isAudioPlaying = false;
      if (audioBtn) audioBtn.classList.remove('playing');
      showToast('Temple audio paused');
    } else {
      audio.play().then(() => {
        isAudioPlaying = true;
        if (audioBtn) audioBtn.classList.add('playing');
        showToast('🎵 Sacred Nadaswaram & Bells playing');
      }).catch(() => {
        showToast('Tap to enable sound');
      });
    }
  };

  function autoStartAudio() {
    if (audio && !isAudioPlaying) {
      audio.play().then(() => {
        isAudioPlaying = true;
        if (audioBtn) audioBtn.classList.add('playing');
      }).catch(() => {});
    }
  }

  // 4. SCROLL-TRIGGERED NILAVILAKKU LAMP LIGHTING CEREMONY
  function setupNilavilakkuObserver() {
    const lampSection = document.getElementById('nilavilakkuCeremonyStage');
    if (!lampSection) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          lampSection.classList.add('lit');
          showToast('✨ The Sacred Nilavilakku Lamp has been illuminated!');
        }
      });
    }, { threshold: 0.35 });

    observer.observe(lampSection);
  }

  // 5. ASTRONOMICAL MUHURTHAM COUNTDOWN TIMER
  function startMuhurthamCountdown() {
    const targetDate = new Date(`${config.date}T09:15:00`).getTime();
    const dEl = document.getElementById('cdDays');
    const hEl = document.getElementById('cdHours');
    const mEl = document.getElementById('cdMins');
    const sEl = document.getElementById('cdSecs');

    function tick() {
      const diff = targetDate - Date.now();
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

    tick();
    setInterval(tick, 1000);
  }

  // 6. FLOATING FIREFLIES CANVAS PHYSICS
  function initFireflies() {
    const canvas = document.getElementById('firefliesCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const fireflies = [];
    const count = window.innerWidth < 768 ? 25 : 45;

    for (let i = 0; i < count; i++) {
      fireflies.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 1.2 + Math.random() * 2.2,
        alpha: Math.random(),
        speedAlpha: 0.01 + Math.random() * 0.02,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let f of fireflies) {
        f.x += f.vx;
        f.y += f.vy;
        f.alpha += f.speedAlpha;

        if (f.alpha > 1 || f.alpha < 0.1) f.speedAlpha *= -1;
        if (f.x < 0) f.x = canvas.width;
        if (f.x > canvas.width) f.x = 0;
        if (f.y < 0) f.y = canvas.height;
        if (f.y > canvas.height) f.y = 0;

        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(243, 229, 171, ${Math.abs(f.alpha)})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#d4af37';
        ctx.fill();
      }

      requestAnimationFrame(animate);
    }
    animate();
  }

  // 7. SACRED ASHIRWAD & BLESSINGS (WHATSAPP DELIVERY)
  window.sendSacredAshirwadWhatsApp = function () {
    const nameInp = document.getElementById('ashirwadName');
    const msgInp = document.getElementById('ashirwadMsg');
    const sender = nameInp ? nameInp.value.trim() : '';
    const message = msgInp ? msgInp.value.trim() : '';

    if (!sender || !message) {
      showToast('⚠️ Please enter your name and heartfelt blessing!');
      return;
    }

    launchSacredPetals();

    const formatted = `🛕 *Sacred Vedic Ashirwad for ${config.groom} & ${config.bride}* 🛕\n\n🕊️ *From:* ${sender}\n💌 *Blessing:* ${message}\n\n✨ May Lord Venkateshwara and Guruvayurappan bless your auspicious union with eternal joy and prosperity!`;
    const cleanPhone = config.whatsapp.replace(/\D/g, '') || '917631442934';
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(formatted)}`;

    showToast('💌 Delivering your sacred blessing via WhatsApp...');
    setTimeout(() => {
      window.open(waUrl, '_blank');
      if (nameInp) nameInp.value = '';
      if (msgInp) msgInp.value = '';
    }, 600);
  };

  // 8. PETAL BLESSINGS PHYSICS
  function launchSacredPetals() {
    const canvas = document.getElementById('blessingPetalsCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const petals = [];
    const colors = ['#d4af37', '#f3e5ab', '#ff9933', '#ffffff', '#490c17'];

    for (let i = 0; i < 70; i++) {
      petals.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 200,
        r: 5 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 3,
        vy: 2.2 + Math.random() * 3.8,
        rot: Math.random() * Math.PI,
        vRot: (Math.random() - 0.5) * 0.1
      });
    }

    let frames = 0;
    function renderPetals() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frames++;

      for (let p of petals) {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vRot;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.r, p.r * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      if (frames < 240) {
        requestAnimationFrame(renderPetals);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    renderPetals();
  }

  // 9. TOAST HELPER
  function showToast(text) {
    const toast = document.getElementById('vanviToast');
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add('visible');
    setTimeout(() => {
      toast.classList.remove('visible');
    }, 3200);
  }

  // DOMContentLoaded Initializer
  document.addEventListener('DOMContentLoaded', () => {
    injectConfig();
    startMuhurthamCountdown();
    setupNilavilakkuObserver();
    initFireflies();
  });

})();
