/**
 * Royal Vows — Indian Wedding Ultra-Premium Interactive Engine
 * Designed for Vanvi Moments
 */

(function () {
  "use strict";

  // State
  let weddingDate = new Date("2026-12-12T11:00:00");
  let isAudioPlaying = false;
  let audioCtx = null;
  let audioTimer = null;
  let rsvpPhone = "919876543210";

  // Auto-initialize from URL Parameters (for shared moments & direct links)
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const pBride = urlParams.get("bride");
    const pGroom = urlParams.get("groom");
    const pDate = urlParams.get("date");
    const pPhone = urlParams.get("phone") || urlParams.get("whatsapp");
    const pBrideImg = urlParams.get("bridePhoto") || urlParams.get("brideImg");
    const pGroomImg = urlParams.get("groomPhoto") || urlParams.get("groomImg");

    if (pBride) {
      ["opening-bride", "hero-bride", "card-bride-name", "patrika-bride"].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.textContent = pBride;
      });
    }
    if (pGroom) {
      ["opening-groom", "hero-groom", "card-groom-name", "patrika-groom"].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.textContent = pGroom;
      });
    }
    if (pDate) {
      weddingDate = new Date(`${pDate}T11:00:00`);
    }
    if (pPhone) {
      rsvpPhone = pPhone.replace(/[^0-9]/g, "");
    }
    if (pBrideImg) {
      const img = document.getElementById("img-bride");
      if (img) img.src = pBrideImg;
    }
    if (pGroomImg) {
      const img = document.getElementById("img-groom");
      if (img) img.src = pGroomImg;
    }
  } catch (e) {}

  // DOM Elements
  const gatesOverlay = document.getElementById("palace-gates-overlay");
  const btnOpenGates = document.getElementById("btn-open-gates");
  const btnEnterExperience = document.getElementById("btn-enter-experience");
  const musicDock = document.getElementById("music-dock");
  const btnShowerBlessings = document.getElementById("btn-shower-blessings");
  const rsvpForm = document.getElementById("rsvp-form");
  const canvas = document.getElementById("petals-canvas");

  // =========================================================================
  // 1. PALACE GATES OPENING
  // =========================================================================
  function enterPalace() {
    if (!gatesOverlay) return;
    gatesOverlay.style.opacity = "0";
    gatesOverlay.style.transform = "scale(1.08) translateY(-30px)";
    gatesOverlay.style.transition = "opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)";
    setTimeout(() => {
      gatesOverlay.style.display = "none";
    }, 900);

    // Start auspicious soundscape upon first user action
    startAuspiciousMusic();
  }

  if (btnOpenGates) btnOpenGates.addEventListener("click", enterPalace);
  if (btnEnterExperience) btnEnterExperience.addEventListener("click", enterPalace);

  // =========================================================================
  // 2. AUSPICIOUS SHEHNAI & SANTOOR WEB AUDIO SYNTHESIZER
  // =========================================================================
  // Creates authentic meditative Indian classical tanpura / santoor chimes without relying on external MP3 files
  const ragaFrequencies = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25]; // Raag Yaman / Bilawal notes

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
  }

  function playSantoorChime(freq, delay = 0, duration = 2.4) {
    if (!audioCtx) return;
    setTimeout(() => {
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        // Bell/Santoor warm harmonic texture
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        // Gentle overtone
        const overtone = audioCtx.createOscillator();
        const overGain = audioCtx.createGain();
        overtone.type = "triangle";
        overtone.frequency.setValueAtTime(freq * 2, audioCtx.currentTime);

        const now = audioCtx.currentTime;
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.06, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        overGain.gain.setValueAtTime(0, now);
        overGain.gain.linearRampToValueAtTime(0.02, now + 0.03);
        overGain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.7);

        osc.connect(gain);
        overtone.connect(overGain);
        gain.connect(audioCtx.destination);
        overGain.connect(audioCtx.destination);

        osc.start(now);
        overtone.start(now);
        osc.stop(now + duration);
        overtone.stop(now + duration);
      } catch (e) {
        console.warn("Audio note err:", e);
      }
    }, delay);
  }

  function playRagaSequence() {
    if (!isAudioPlaying) return;
    // Play an elegant Santoor strum pattern
    const pattern = [0, 2, 4, 3, 5, 4, 7];
    pattern.forEach((noteIdx, idx) => {
      playSantoorChime(ragaFrequencies[noteIdx % ragaFrequencies.length], idx * 450, 2.8);
    });

    audioTimer = setTimeout(playRagaSequence, pattern.length * 450 + 2000);
  }

  function startAuspiciousMusic() {
    initAudioContext();
    if (!audioCtx) return;
    isAudioPlaying = true;
    if (musicDock) {
      musicDock.classList.add("playing");
      const dockSongTitle = document.getElementById("dock-song-title");
      if (dockSongTitle) dockSongTitle.textContent = "Royal Santoor Playing ♪";
    }
    clearTimeout(audioTimer);
    playRagaSequence();
  }

  function stopAuspiciousMusic() {
    isAudioPlaying = false;
    clearTimeout(audioTimer);
    if (musicDock) {
      musicDock.classList.remove("playing");
      const dockSongTitle = document.getElementById("dock-song-title");
      if (dockSongTitle) dockSongTitle.textContent = "Royal Shehnai & Santoor";
    }
  }

  if (musicDock) {
    musicDock.addEventListener("click", () => {
      if (isAudioPlaying) {
        stopAuspiciousMusic();
      } else {
        startAuspiciousMusic();
      }
    });
  }

  // =========================================================================
  // 3. LIVE AUSPICIOUS COUNTDOWN
  // =========================================================================
  const elDays = document.getElementById("cd-days");
  const elHours = document.getElementById("cd-hours");
  const elMins = document.getElementById("cd-mins");
  const elSecs = document.getElementById("cd-secs");

  function updateCountdown() {
    const now = new Date();
    const diff = weddingDate.getTime() - now.getTime();

    if (diff <= 0) {
      if (elDays) elDays.textContent = "00";
      if (elHours) elHours.textContent = "00";
      if (elMins) elMins.textContent = "00";
      if (elSecs) elSecs.textContent = "00";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / 1000 / 60) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    if (elDays) elDays.textContent = String(days).padStart(2, "0");
    if (elHours) elHours.textContent = String(hours).padStart(2, "0");
    if (elMins) elMins.textContent = String(mins).padStart(2, "0");
    if (elSecs) elSecs.textContent = String(secs).padStart(2, "0");
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  // =========================================================================
  // 4. FALLING ROSE & MARIGOLD PETALS CANVAS ANIMATION
  // =========================================================================
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const petalColors = [
      "rgba(217, 83, 79, 0.75)",   // Rose red
      "rgba(244, 164, 96, 0.8)",   // Marigold orange
      "rgba(255, 193, 7, 0.8)",    // Turmeric gold
      "rgba(233, 30, 99, 0.7)",    // Crimson petal
      "rgba(255, 235, 180, 0.7)"   // Jasmine white / ivory
    ];

    const particles = [];
    const PARTICLE_COUNT = 45;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 6 + 4,
        d: Math.random() * PARTICLE_COUNT,
        color: petalColors[Math.floor(Math.random() * petalColors.length)],
        tilt: Math.random() * 10 - 10,
        tiltAngleIncremental: Math.random() * 0.05 + 0.02,
        tiltAngle: 0,
        swaySpeed: Math.random() * 0.02 + 0.01,
        swayRange: Math.random() * 2 + 1
      });
    }

    let burstParticles = [];

    function renderCanvas() {
      ctx.clearRect(0, 0, width, height);

      // Background floating petals
      particles.forEach((p) => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += (Math.cos(p.d) + 1 + p.r / 3) * 0.45;
        p.x += Math.sin(p.tiltAngle) * p.swayRange;

        if (p.y > height + 20) {
          p.x = Math.random() * width;
          p.y = -20;
          p.tiltAngle = 0;
        }

        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.tiltAngle);
        // Draw an organic petal oval
        ctx.ellipse(0, 0, p.r * 1.4, p.r * 0.8, Math.PI / 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
      });

      // Interactive blessing burst particles
      for (let i = burstParticles.length - 1; i >= 0; i--) {
        const bp = burstParticles[i];
        bp.x += bp.vx;
        bp.y += bp.vy;
        bp.vy += 0.12; // gravity
        bp.vx *= 0.98;
        bp.alpha -= 0.012;
        bp.rotation += bp.rotSpeed;

        if (bp.alpha <= 0) {
          burstParticles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = bp.alpha;
        ctx.fillStyle = bp.color;
        ctx.translate(bp.x, bp.y);
        ctx.rotate(bp.rotation);
        ctx.beginPath();
        ctx.ellipse(0, 0, bp.size * 1.5, bp.size * 0.9, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
      }

      requestAnimationFrame(renderCanvas);
    }

    renderCanvas();

    // Blessing Shower trigger
    function triggerBlessings() {
      initAudioContext();
      // Chime chord
      [523.25, 659.25, 783.99, 1046.5].forEach((f, idx) => playSantoorChime(f, idx * 80, 2.2));

      const cx = width / 2;
      const cy = height * 0.4;
      for (let i = 0; i < 90; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 3;
        burstParticles.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 3,
          size: Math.random() * 7 + 4,
          color: petalColors[Math.floor(Math.random() * petalColors.length)],
          alpha: 1,
          rotation: Math.random() * Math.PI,
          rotSpeed: (Math.random() - 0.5) * 0.15
        });
      }
    }

    if (btnShowerBlessings) {
      btnShowerBlessings.addEventListener("click", triggerBlessings);
    }
  }

  // =========================================================================
  // 5. RSVP VIA WHATSAPP
  // =========================================================================
  if (rsvpForm) {
    rsvpForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const guestName = document.getElementById("rsvp-guest-name")?.value.trim() || "Guest";
      const status = document.getElementById("rsvp-status")?.value || "attending";
      const guestsCount = document.getElementById("rsvp-guests-count")?.value || "2";

      const bride = document.getElementById("hero-bride")?.textContent || "Tanya";
      const groom = document.getElementById("hero-groom")?.textContent || "Rohan";

      const statusText = status === "attending" ? "joyfully attending" : "regretfully unable to attend";
      const text = `Namaste! 🙏\n\nI am ${guestName}. I will be ${statusText} the Royal Wedding of ${bride} & ${groom}.\n\nTotal Guests: ${guestsCount}\n\nSending our warmest congratulations and blessings! ✨`;

      const whatsappUrl = `https://api.whatsapp.com/send?phone=${rsvpPhone}&text=${encodeURIComponent(text)}`;
      window.open(whatsappUrl, "_blank");
    });
  }

  // Apple / iCal Download Generator
  const btnIcalSync = document.getElementById("btn-ical-sync");
  if (btnIcalSync) {
    btnIcalSync.addEventListener("click", (e) => {
      e.preventDefault();
      const bride = document.getElementById("hero-bride")?.textContent || "Tanya";
      const groom = document.getElementById("hero-groom")?.textContent || "Rohan";
      const icsData = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Vanvi Moments//Royal Vows Wedding//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "BEGIN:VEVENT",
        "SUMMARY:" + bride + " & " + groom + " — Royal Vivah Celebration",
        "DESCRIPTION:Sacred union and wedding celebrations of " + bride + " and " + groom + " under the skies of Jodhpur.",
        "LOCATION:Umaid Bhawan Palace, Jodhpur, Rajasthan",
        "DTSTART:20261212T053000Z",
        "DTEND:20261212T183000Z",
        "STATUS:CONFIRMED",
        "END:VEVENT",
        "END:VCALENDAR"
      ].join("\r\n");

      const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute("download", `${bride}_and_${groom}_Royal_Wedding.ics`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // =========================================================================
  // 6. BUILDER & ECOSYSTEM INTEGRATION (POSTMESSAGE & API SYNC)
  // =========================================================================
  function applyConfig(cfg) {
    if (!cfg || typeof cfg !== "object") return;

    // Bride Name
    const bride = cfg.bride || cfg.brideName;
    if (bride) {
      const bElements = ["opening-bride", "hero-bride", "card-bride-name", "patrika-bride", "footer-bride"];
      bElements.forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.textContent = bride;
      });
    }

    // Groom Name
    const groom = cfg.groom || cfg.groomName;
    if (groom) {
      const gElements = ["opening-groom", "hero-groom", "card-groom-name", "patrika-groom", "footer-groom"];
      gElements.forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.textContent = groom;
      });
    }

    // Wedding Date
    if (cfg.date || cfg.weddingDate) {
      const d = cfg.date || cfg.weddingDate;
      weddingDate = new Date(`${d}T11:00:00`);
      if (typeof updateCountdown === "function") updateCountdown();
    }

    // Quote / Invitation Text
    if (cfg.quote || cfg.message || cfg.invitationText) {
      const qEl = document.getElementById("hero-quote");
      if (qEl) qEl.textContent = cfg.quote || cfg.message || cfg.invitationText;
    }

    // Couple Colors
    if (cfg.coupleColor || cfg.primaryColor) {
      document.documentElement.style.setProperty("--ruby-velvet", cfg.coupleColor || cfg.primaryColor);
    }

    // Date Color
    if (cfg.dateColor || cfg.goldColor) {
      document.documentElement.style.setProperty("--gold-primary", cfg.dateColor || cfg.goldColor);
    }

    // Bride and Groom Photos (URL or base64 dataURI)
    if (cfg.bridePhoto || cfg.brideImg) {
      const imgBride = document.getElementById("img-bride");
      if (imgBride) imgBride.src = cfg.bridePhoto || cfg.brideImg;
    }
    if (cfg.groomPhoto || cfg.groomImg) {
      const imgGroom = document.getElementById("img-groom");
      if (imgGroom) imgGroom.src = cfg.groomPhoto || cfg.groomImg;
    }

    // Font customization
    if (cfg.font) {
      const fontFamilies = {
        "playfair": "'Playfair Display', serif",
        "cormorant": "'Cormorant Garamond', serif",
        "eb-garamond": "'EB Garamond', serif",
        "cinzel": "'Cinzel', serif",
        "marcellus": "'Marcellus', serif",
        "great-vibes": "'Great Vibes', cursive"
      };
      if (fontFamilies[cfg.font]) {
        document.documentElement.style.setProperty("--font-serif", fontFamilies[cfg.font]);
      }
    }

    // Dynamic RSVP Phone
    if (cfg.phone || cfg.whatsapp) {
      const ph = cfg.phone || cfg.whatsapp;
      rsvpPhone = ph.replace(/[^0-9]/g, "");
    }

    // Watermark Removal Check
    if (cfg.paid || cfg.purchased || cfg.status === "published" || window.vanviPurchased) {
      const wm = document.getElementById("vanviWatermark");
      if (wm) wm.style.display = "none";
    }
  }

  // Handle postMessage from Studio Builder & Previewers
  window.addEventListener("message", (event) => {
    if (!event.data) return;
    const d = event.data;
    if (d.type === "UPDATE_CONFIG" && d.config) {
      applyConfig(d.config);
    } else if ((d.type === "VANVI_LIVE_PREVIEW_SYNC" || d.type === "VANVI_UPDATE_CUSTOM_DATA") && (d.customData || d.config)) {
      applyConfig(d.customData || d.config);
    } else if (d.config) {
      applyConfig(d.config);
    } else if (d.customData) {
      applyConfig(d.customData);
    }
  });

  // Handle Vanvi Moment API Dynamic Loader
  window.addEventListener("vanvi:momentLoaded", (e) => {
    if (e.detail) {
      const moment = e.detail;
      const custom = moment.custom_data || {};
      applyConfig({
        bride: custom.bride || (moment.title ? moment.title.split("&")[0].trim() : "Tanya"),
        groom: custom.groom || (moment.title ? moment.title.split("&")[1]?.replace("Royal Vivah", "").trim() : "Rohan"),
        date: custom.date || moment.date,
        quote: moment.message,
        bridePhoto: custom.bridePhoto,
        groomPhoto: custom.groomPhoto,
        phone: custom.phone,
        paid: moment.paid || moment.isPurchased || moment.status === "published",
        status: moment.status
      });
    }
  });

})();
