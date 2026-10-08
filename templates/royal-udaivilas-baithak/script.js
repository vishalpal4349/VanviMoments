/**
 * THE ROYAL UDAIVILAS BAITHAK — INTERACTIVE SCRIPT
 * Features: Tap-to-Bloom Entrance, Audio System, Petal Physics, Dynamic Config, Google Calendar, 1-Click WhatsApp RSVP
 */

// 1. Dynamic Config & URL Query Parameter Support
const urlParams = new URLSearchParams(window.location.search);
const weddingConfig = {
  bride: urlParams.get('bride') || 'Tanya',
  groom: urlParams.get('groom') || 'Rohan',
  date: urlParams.get('date') || '12 December 2026',
  targetTimestamp: new Date(urlParams.get('target') || '2026-12-12T18:00:00').getTime(),
  venue: urlParams.get('venue') || 'The Oberoi Udaivilas, Lake Pichola, Udaipur',
  whatsapp: urlParams.get('whatsapp') || '917631442934'
};

// Populate Dynamic Names if customized
document.addEventListener('DOMContentLoaded', () => {
  const brideEls = [document.getElementById('heroBride'), document.querySelector('.pl-n1')];
  const groomEls = [document.getElementById('heroGroom'), document.querySelector('.pl-n2')];
  
  brideEls.forEach(el => { if (el) el.textContent = weddingConfig.bride; });
  groomEls.forEach(el => { if (el) el.textContent = weddingConfig.groom; });

  const venueEl = document.getElementById('heroVenue');
  if (venueEl) venueEl.textContent = weddingConfig.venue;

  // Preloader hide
  setTimeout(() => {
    const pl = document.getElementById('preloader');
    if (pl) pl.classList.add('away');
  }, 900);

  // Initialize Countdown
  initCountdown();

  // Initialize Petal Canvas
  initPetalCanvas();
});

// 2. Tap to Begin & Screen Bloom
let isExperienceStarted = false;
function beginExperience() {
  if (isExperienceStarted) return;
  isExperienceStarted = true;

  const intro = document.getElementById('intro');
  const bloom = document.getElementById('screenBloom');
  const body = document.body;

  // Trigger golden candle bloom flash
  if (bloom) {
    bloom.classList.add('active');
    setTimeout(() => {
      bloom.classList.remove('active');
    }, 600);
  }

  // Open the royal baithak
  if (intro) {
    intro.classList.add('opened');
  }
  body.classList.remove('intro-active');

  // Attempt audio autoplay on user interaction
  playAudio();
}

// 3. Audio Controller
let isAudioPlaying = false;
const bgMusic = document.getElementById('bgMusic');
const musicIcon = document.getElementById('musicIcon');
const musicLabel = document.getElementById('musicLabel');

function playAudio() {
  if (!bgMusic) return;
  bgMusic.volume = 0.65;
  bgMusic.play().then(() => {
    isAudioPlaying = true;
    updateAudioUI();
  }).catch(() => {
    isAudioPlaying = false;
    updateAudioUI();
  });
}

function toggleAudio() {
  if (!bgMusic) return;
  if (isAudioPlaying) {
    bgMusic.pause();
    isAudioPlaying = false;
  } else {
    bgMusic.play().then(() => {
      isAudioPlaying = true;
    }).catch(() => {});
  }
  updateAudioUI();
}

function updateAudioUI() {
  if (musicIcon && musicLabel) {
    musicIcon.textContent = isAudioPlaying ? '🎵' : '🔇';
    musicLabel.textContent = isAudioPlaying ? 'Playing' : 'Muted';
  }
}

// 4. Falling Rose Petals Canvas Physics
function initPetalCanvas() {
  const canvas = document.getElementById('petalCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.parentElement.clientWidth || 460;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const petalCount = 28;
  const petals = [];

  for (let i = 0; i < petalCount; i++) {
    petals.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 6 + Math.random() * 8,
      d: Math.random() * petalCount,
      tilt: Math.random() * 10 - 10,
      tiltAngleIncremental: (Math.random() * 0.07) + 0.02,
      tiltAngle: 0,
      opacity: 0.35 + Math.random() * 0.55
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < petalCount; i++) {
      const p = petals[i];
      ctx.beginPath();
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.tiltAngle);
      
      // Draw organic rose petal shape
      ctx.fillStyle = `rgba(180, 24, 52, ${p.opacity})`;
      ctx.ellipse(0, 0, p.r, p.r * 1.5, Math.PI / 4, 0, 2 * Math.PI);
      ctx.fill();
      ctx.restore();

      // Update positions
      p.tiltAngle += p.tiltAngleIncremental;
      p.y += (Math.cos(p.d) + 1.2 + p.r / 8);
      p.x += Math.sin(p.d) * 0.9;

      // Wrap around screen
      if (p.y > canvas.height + 20) {
        p.x = Math.random() * canvas.width;
        p.y = -20;
      }
      if (p.x > canvas.width + 20) p.x = -20;
      if (p.x < -20) p.x = canvas.width + 20;
    }

    requestAnimationFrame(draw);
  }

  draw();
}

// 5. Countdown Engine
function initCountdown() {
  function update() {
    const now = new Date().getTime();
    const diff = weddingConfig.targetTimestamp - now;

    if (diff <= 0) {
      document.getElementById('cdDays').textContent = '00';
      document.getElementById('cdHours').textContent = '00';
      document.getElementById('cdMins').textContent = '00';
      document.getElementById('cdSecs').textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    const pad = n => (n < 10 ? '0' + n : n);

    const dEl = document.getElementById('cdDays');
    const hEl = document.getElementById('cdHours');
    const mEl = document.getElementById('cdMins');
    const sEl = document.getElementById('cdSecs');

    if (dEl) dEl.textContent = pad(days);
    if (hEl) hEl.textContent = pad(hours);
    if (mEl) mEl.textContent = pad(mins);
    if (sEl) sEl.textContent = pad(secs);
  }

  update();
  setInterval(update, 1000);
}

// 6. Add to Google Calendar
function addToGoogleCalendar(title, startUtc, endUtc, location) {
  const fullTitle = encodeURIComponent(`${weddingConfig.bride} & ${weddingConfig.groom}'s Wedding — ${title}`);
  const details = encodeURIComponent(`We would be honored by your gracious presence at our wedding celebrations.`);
  const loc = encodeURIComponent(location || weddingConfig.venue);
  
  const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${fullTitle}&dates=${startUtc}/${endUtc}&details=${details}&location=${loc}`;
  window.open(gcalUrl, '_blank');
}

// 7. 1-Click WhatsApp RSVP Engine
function submitWhatsAppRSVP() {
  const guestName = (document.getElementById('guestName')?.value || '').trim() || 'A Guest';
  const count = document.getElementById('guestCount')?.value || '1';

  const message = `Namaste ${weddingConfig.bride} & ${weddingConfig.groom}! 🪷\n\nI/We are delighted to confirm our RSVP for your Royal Wedding celebration at ${weddingConfig.venue}.\n\n• Guest Name: ${guestName}\n• Total Attendees: ${count} Person(s)\n\nLooking forward to celebrating with you! ✨`;

  const waUrl = `https://wa.me/${weddingConfig.whatsapp}?text=${encodeURIComponent(message)}`;
  window.open(waUrl, '_blank');
}
