/**
 * GOLDEN LAKE COLLECTION — WATERFRONT ROYAL SCRIPT ENGINE (VNV-LAKE-01)
 * Features: 3D Lake Palace Sunset Parallax, Curtains Love Story Reveal,
 * Interactive Festive Dhol Celebrations, VIP Guest Personalized Invite,
 * Waterfront Ashirwad WhatsApp Delivery, Cloudinary Media CDN Image Sync.
 */

(function () {
  'use strict';

  // 1. CONFIGURATION & URL PARAMS
  const params = new URLSearchParams(window.location.search);
  const config = {
    bride: params.get('bride') || 'Divya',
    groom: params.get('groom') || 'Kishan',
    date: params.get('date') || '2026-12-14',
    venue: params.get('venue') || 'Udaipur Lake Palace & Jagmandir Island, Lake Pichola',
    whatsapp: params.get('whatsapp') || '917631442934',
    guest: params.get('guest') || '',
    hashtag: params.get('hashtag') || '#KishanDivyaLakePalace',
    photos: []
  };

  function injectConfig() {
    document.querySelectorAll('.bind-groom').forEach(el => el.textContent = config.groom);
    document.querySelectorAll('.bind-bride').forEach(el => el.textContent = config.bride);
    document.querySelectorAll('.bind-venue').forEach(el => el.textContent = config.venue);

    document.title = `${config.groom} & ${config.bride} — Golden Lake Collection | Vanvi Moments`;

    // VIP Guest Pill
    const guestPill = document.getElementById('vipLakeGuestPill');
    if (guestPill) {
      if (config.guest) {
        guestPill.innerHTML = `🦢 Royal Invitation For: <strong>${decodeURIComponent(config.guest)}</strong>`;
        guestPill.style.display = 'inline-flex';
      } else {
        guestPill.style.display = 'none';
      }
    }
  }

  // 2. CURTAINS REVEAL
  window.openLakeCurtains = function () {
    const wrap = document.getElementById('goldenLakeCurtains');
    if (wrap) {
      wrap.classList.add('opened');
      triggerDholCelebration();
      showToast('🌅 Welcome to Kishan & Divya’s Lake Palace Vivah!');
      autoStartMusic();
    }
  };

  // 3. BACKGROUND AUDIO
  const audio = document.getElementById('lakeAudio');
  const audioBtn = document.getElementById('btnLakeAudio');
  let isPlaying = false;

  window.toggleLakeAudio = function () {
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
      if (audioBtn) audioBtn.classList.remove('playing');
      showToast('Music paused');
    } else {
      audio.play().then(() => {
        isPlaying = true;
        if (audioBtn) audioBtn.classList.add('playing');
        showToast('🎵 Imperial Sitar & Lake Symphony playing');
      }).catch(() => {
        showToast('Tap to enable sound');
      });
    }
  };

  function autoStartMusic() {
    if (audio && !isPlaying) {
      audio.play().then(() => {
        isPlaying = true;
        if (audioBtn) audioBtn.classList.add('playing');
      }).catch(() => {});
    }
  }

  // 4. INTERACTIVE DHOL CELEBRATION BURST
  window.triggerDholCelebration = function () {
    launchSparks();
    showToast('🥁 Dhol Beats! Mubarak Ho Kishan & Divya!');

    // Audio effect synthesis using Web Audio API for celebratory Dhol beats
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(120, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.8, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {}
  };

  // 5. SPARKS FIREWORKS PHYSICS
  function launchSparks() {
    const canvas = document.getElementById('sparksCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#f59e0b', '#ffd700', '#f43f5e', '#ffffff', '#fbbf24'];

    for (let i = 0; i < 90; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 7;
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: 2 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1,
        decay: 0.015 + Math.random() * 0.02
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      for (let p of particles) {
        if (p.life > 0) {
          alive = true;
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.08; // gravity
          p.life -= p.decay;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.life);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
      if (alive) {
        requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    animate();
  }

  // 6. SUNSET COUNTDOWN TIMER
  function startSunsetCountdown() {
    const target = new Date(`${config.date}T17:30:00`).getTime();
    const dEl = document.getElementById('cdDays');
    const hEl = document.getElementById('cdHours');
    const mEl = document.getElementById('cdMins');
    const sEl = document.getElementById('cdSecs');

    function update() {
      const diff = target - Date.now();
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

  // 7. WATERFRONT ASHIRWAD WHATSAPP DELIVERY
  window.sendWaterfrontAshirwadWhatsApp = function () {
    const nameInp = document.getElementById('lakeAshirwadName');
    const msgInp = document.getElementById('lakeAshirwadMsg');
    const sender = nameInp ? nameInp.value.trim() : '';
    const message = msgInp ? msgInp.value.trim() : '';

    if (!sender || !message) {
      showToast('⚠️ Please enter your name and blessing!');
      return;
    }

    launchSparks();

    const formatted = `🌅 *Golden Lake Blessings for ${config.groom} & ${config.bride}* 🌅\n\n🕊️ *From:* ${sender}\n💌 *Ashirwad:* ${message}\n\n✨ Wishing you a lifetime of golden sunsets, eternal love and royal happiness at Udaipur Lake Palace!`;
    const cleanPhone = config.whatsapp.replace(/\D/g, '') || '917631442934';
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(formatted)}`;

    showToast('💌 Delivering your blessing via WhatsApp...');
    setTimeout(() => {
      window.open(waUrl, '_blank');
      if (nameInp) nameInp.value = '';
      if (msgInp) msgInp.value = '';
    }, 600);
  };

  // 8. TOAST HELPER
  function showToast(text) {
    const toast = document.getElementById('lakeToast');
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add('visible');
    setTimeout(() => {
      toast.classList.remove('visible');
    }, 3200);
  }

  // 9. LISTEN FOR REAL-TIME CLOUDINARY IMAGES FROM BUILDER IFRAME
  window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'VANVI_UPDATE_PHOTOS') {
      const photos = event.data.photos;
      if (Array.isArray(photos)) {
        photos.forEach((url, idx) => {
          const imgEl = document.getElementById(`mosaicPhoto${idx}`);
          if (imgEl && url) imgEl.src = url;
        });
      }
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    injectConfig();
    startSunsetCountdown();
  });

})();
