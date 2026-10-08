/**
 * VANVI ROYAL VOWS — THE WEDDING EXPERIENCE (FLAGSHIP JAVASCRIPT ENGINE)
 * Interactive features: Curtain Unbox, Screen Bloom, Petal Physics, Audio Soundscape,
 * Live Countdown, Lightbox, Wax Seal, Voice Note, RSVP, Wishes Wall, Calendar Sync.
 */

// 1. DYNAMIC CONFIGURATION & PERSISTENCE
const urlParams = new URLSearchParams(window.location.search);
let localConfig = {};
try {
  localConfig = JSON.parse(localStorage.getItem('vanvi_royal_wedding_data') || '{}');
} catch (e) {}

const royalConfig = {
  bride: urlParams.get('bride') || localConfig.bride || 'Tanya',
  brideFull: urlParams.get('brideFull') || localConfig.brideFull || 'Tanya Sharma',
  groom: urlParams.get('groom') || localConfig.groom || 'Rohan',
  groomFull: urlParams.get('groomFull') || localConfig.groomFull || 'Rohan Kapoor',
  date: urlParams.get('date') || localConfig.date || '12th December 2026',
  targetTimestamp: new Date(urlParams.get('target') || localConfig.target || '2026-12-12T18:18:00').getTime(),
  venue: urlParams.get('venue') || localConfig.venue || 'The Oberoi Udaivilas, Lake Pichola, Udaipur',
  whatsapp: urlParams.get('whatsapp') || localConfig.whatsapp || '917631442934'
};

document.addEventListener('DOMContentLoaded', () => {
  // Populate dynamic names
  const brideEls = [document.getElementById('heroBride'), document.querySelector('.intro-couple-names')];
  const groomEls = [document.getElementById('heroGroom')];

  if (document.getElementById('heroBride')) document.getElementById('heroBride').textContent = royalConfig.bride;
  if (document.getElementById('heroGroom')) document.getElementById('heroGroom').textContent = royalConfig.groom;
  if (document.getElementById('heroFullDate')) document.getElementById('heroFullDate').textContent = royalConfig.date;
  if (document.getElementById('heroVenue')) document.getElementById('heroVenue').textContent = royalConfig.venue;
  if (document.getElementById('brideFullName')) document.getElementById('brideFullName').textContent = royalConfig.brideFull;
  if (document.getElementById('groomFullName')) document.getElementById('groomFullName').textContent = royalConfig.groomFull;

  // Initialize Countdown
  initCountdownTimer();

  // Initialize Petal Physics Canvas
  initPetalPhysics();
});

// 2. TAP TO ENTER & GOLDEN SCREEN BLOOM
let celebrationStarted = false;
function enterCelebration() {
  if (celebrationStarted) return;
  celebrationStarted = true;

  const curtain = document.getElementById('introCurtain');
  const bloom = document.getElementById('screenBloom');
  const body = document.body;

  // Golden candle bloom flash
  if (bloom) {
    bloom.classList.add('active');
    setTimeout(() => {
      bloom.classList.remove('active');
    }, 550);
  }

  // Open the curtain
  if (curtain) {
    curtain.classList.add('opened');
  }
  body.classList.remove('intro-active');

  // Start music
  playRoyalAudio();
}

// 3. ROYAL AUDIO SOUNDSCAPE
let isMusicPlaying = false;
const audioEl = document.getElementById('royalAudio');
const musicIcon = document.getElementById('musicIcon');
const musicText = document.getElementById('musicText');

function playRoyalAudio() {
  if (!audioEl) return;
  audioEl.volume = 0.6;
  audioEl.play().then(() => {
    isMusicPlaying = true;
    updateMusicUI();
  }).catch(() => {
    isMusicPlaying = false;
    updateMusicUI();
  });
}

function toggleRoyalMusic() {
  if (!audioEl) return;
  if (isMusicPlaying) {
    audioEl.pause();
    isMusicPlaying = false;
  } else {
    audioEl.play().then(() => {
      isMusicPlaying = true;
    }).catch(() => {});
  }
  updateMusicUI();
}

function updateMusicUI() {
  if (musicIcon && musicText) {
    musicIcon.textContent = isMusicPlaying ? '🎵' : '🔇';
    musicText.textContent = isMusicPlaying ? 'Music On' : 'Muted';
  }
}

// 4. FALLING ROSE PETALS PHYSICS
function initPetalPhysics() {
  const canvas = document.getElementById('petalCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.parentElement.clientWidth || 480;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const totalPetals = 26;
  const petals = [];

  for (let i = 0; i < totalPetals; i++) {
    petals.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 6 + Math.random() * 7,
      d: Math.random() * totalPetals,
      tilt: Math.random() * 10 - 10,
      tiltSpeed: 0.02 + Math.random() * 0.05,
      tiltAngle: 0,
      opacity: 0.35 + Math.random() * 0.55
    });
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < totalPetals; i++) {
      const p = petals[i];
      ctx.beginPath();
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.tiltAngle);

      ctx.fillStyle = `rgba(168, 22, 50, ${p.opacity})`;
      ctx.ellipse(0, 0, p.r, p.r * 1.5, Math.PI / 4, 0, 2 * Math.PI);
      ctx.fill();
      ctx.restore();

      p.tiltAngle += p.tiltSpeed;
      p.y += (Math.cos(p.d) + 1.2 + p.r / 7);
      p.x += Math.sin(p.d) * 0.85;

      if (p.y > canvas.height + 20) {
        p.x = Math.random() * canvas.width;
        p.y = -20;
      }
      if (p.x > canvas.width + 20) p.x = -20;
      if (p.x < -20) p.x = canvas.width + 20;
    }

    requestAnimationFrame(render);
  }

  render();
}

// 5. LIVE COUNTDOWN CLOCK
function initCountdownTimer() {
  function tick() {
    const now = new Date().getTime();
    const distance = royalConfig.targetTimestamp - now;

    if (distance <= 0) {
      document.getElementById('cdDays').textContent = '00';
      document.getElementById('cdHours').textContent = '00';
      document.getElementById('cdMins').textContent = '00';
      document.getElementById('cdSecs').textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((distance % (1000 * 60)) / 1000);

    const pad = n => (n < 10 ? '0' + n : n);

    if (document.getElementById('cdDays')) document.getElementById('cdDays').textContent = pad(days);
    if (document.getElementById('cdHours')) document.getElementById('cdHours').textContent = pad(hours);
    if (document.getElementById('cdMins')) document.getElementById('cdMins').textContent = pad(mins);
    if (document.getElementById('cdSecs')) document.getElementById('cdSecs').textContent = pad(secs);
  }

  tick();
  setInterval(tick, 1000);
}

// 6. PHOTO GALLERY LIGHTBOX
const galleryImages = [
  'https://assets.shaadipath.com/templates/template13/assets/gallery/demo_1.webp',
  'https://assets.shaadipath.com/templates/template13/assets/gallery/demo_2.webp',
  'https://assets.shaadipath.com/templates/template13/assets/gallery/demo_3.webp',
  'https://assets.shaadipath.com/templates/template13/assets/gallery/demo_4.webp'
];

function openLightbox(index) {
  const modal = document.getElementById('lightboxModal');
  const img = document.getElementById('lightboxImg');
  if (modal && img) {
    img.src = galleryImages[index] || galleryImages[0];
    modal.classList.add('active');
  }
}

function closeLightbox() {
  const modal = document.getElementById('lightboxModal');
  if (modal) modal.classList.remove('active');
}

// 7. INTERACTIVE WAX SEAL UNBOXING
let isWaxBroken = false;
function breakWaxSeal() {
  if (isWaxBroken) return;
  isWaxBroken = true;

  const seal = document.getElementById('waxSeal');
  const paper = document.getElementById('letterPaper');
  const hint = document.getElementById('unsealHint');

  if (seal) seal.classList.add('broken');
  if (paper) paper.classList.add('open');
  if (hint) hint.textContent = '✨ Letter Unsealed';
}

// 8. VOICE MESSAGE SOUNDWAVE SIMULATOR
let isVoicePlaying = false;
function toggleVoiceNote() {
  const btn = document.getElementById('btnVoicePlay');
  const wave = document.getElementById('voiceWave');
  const dur = document.getElementById('voiceDuration');

  isVoicePlaying = !isVoicePlaying;

  if (isVoicePlaying) {
    btn.textContent = '⏸';
    wave.classList.add('playing');
    dur.textContent = '0:28';
  } else {
    btn.textContent = '▶';
    wave.classList.remove('playing');
    dur.textContent = '0:45';
  }
}

// 9. RSVP ONLINE SUBMISSION
function handleRSVPSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('rsvpName').value.trim();
  const phone = document.getElementById('rsvpPhone').value.trim();
  const status = document.getElementById('rsvpAttending').value;
  const count = document.getElementById('rsvpGuests').value;
  const message = document.getElementById('rsvpMessage').value.trim();

  const feedback = document.getElementById('rsvpFeedback');
  const submitBtn = document.getElementById('btnSubmitRSVP');

  submitBtn.disabled = true;
  submitBtn.textContent = 'Saving RSVP...';

  // Save to localStorage
  try {
    const existing = JSON.parse(localStorage.getItem('vanvi_royal_wedding_rsvps') || '[]');
    existing.unshift({
      name, phone, status, count, message,
      submittedAt: new Date().toISOString()
    });
    localStorage.setItem('vanvi_royal_wedding_rsvps', JSON.stringify(existing));
  } catch (err) {}

  setTimeout(() => {
    feedback.innerHTML = `🎉 <strong>Thank You, ${name}!</strong><br>Your RSVP (${status} • ${count}) has been recorded for the Royal Celebration.`;
    feedback.className = 'rsvp-feedback-msg show-success';
    submitBtn.disabled = false;
    submitBtn.textContent = 'Confirm RSVP Online →';
    document.getElementById('rsvpForm').reset();
  }, 600);
}

// 10. 1-CLICK WHATSAPP RSVP
function sendWhatsAppDirectRSVP() {
  const name = document.getElementById('rsvpName')?.value.trim() || 'A Warm Guest';
  const count = document.getElementById('rsvpGuests')?.value || '2';
  const attending = document.getElementById('rsvpAttending')?.value || 'Yes, With Joy!';

  const text = `Namaste ${royalConfig.bride} & ${royalConfig.groom}! 🪷\n\nI/We are thrilled to RSVP for your Royal Wedding celebrations at ${royalConfig.venue}.\n\n• Guest: ${name}\n• Attendance: ${attending}\n• Total Guests: ${count}\n\nLooking forward to dancing and blessing you both! ✨`;

  const waUrl = `https://wa.me/${royalConfig.whatsapp}?text=${encodeURIComponent(text)}`;
  window.open(waUrl, '_blank');
}

// 11. GUEST BLESSINGS WALL (POST WISH)
function postGuestWish() {
  const authorInput = document.getElementById('newWishAuthor');
  const textInput = document.getElementById('newWishText');
  const grid = document.getElementById('wishesGrid');

  const author = authorInput.value.trim();
  const text = textInput.value.trim();

  if (!author || !text) {
    alert('Please enter your name and heartfelt blessing message.');
    return;
  }

  const bubble = document.createElement('div');
  bubble.className = 'wish-bubble';
  bubble.innerHTML = `
    <p class="wish-text">"${text}"</p>
    <span class="wish-author">— ${author}</span>
  `;

  grid.prepend(bubble);
  authorInput.value = '';
  textInput.value = '';
}

// 12. ADD TO GOOGLE CALENDAR & DOWNLOAD ICS
function saveEventToCal(title, startUtc, endUtc, location) {
  const fullTitle = encodeURIComponent(`${royalConfig.bride} & ${royalConfig.groom}'s Wedding — ${title}`);
  const details = encodeURIComponent(`You are cordially invited to celebrate ${royalConfig.bride} & ${royalConfig.groom}'s holy wedding vows.`);
  const loc = encodeURIComponent(location || royalConfig.venue);

  const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${fullTitle}&dates=${startUtc}/${endUtc}&details=${details}&location=${loc}`;
  window.open(gcalUrl, '_blank');
}

function downloadIcsFile() {
  const icsData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Vanvi Moments//Royal Vows//EN
BEGIN:VEVENT
SUMMARY:${royalConfig.bride} & ${royalConfig.groom}'s Royal Wedding Celebration
DESCRIPTION:Sacred union and celebrations of ${royalConfig.bride} & ${royalConfig.groom}.
LOCATION:${royalConfig.venue}
DTSTART:20261211T043000Z
DTEND:20261212T200000Z
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `${royalConfig.bride}-${royalConfig.groom}-Wedding.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// 13. COPY INVITATION LINK
function copyInviteLink() {
  const url = window.location.href;
  navigator.clipboard.writeText(url).then(() => {
    const textEl = document.getElementById('copyLinkText');
    if (textEl) {
      textEl.textContent = '✅ Link Copied to Clipboard!';
      setTimeout(() => {
        textEl.textContent = '🔗 Copy Invitation Link';
      }, 2500);
    }
  }).catch(() => {
    prompt('Copy your invitation link:', url);
  });
}
