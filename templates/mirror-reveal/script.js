/**
 * Vanvi Moments — Mirror Reveal Interactive Engine
 * High-performance canvas wipe, condensation mist, petal physics, and countdown
 */

(function () {
  "use strict";

  // Safe configuration lookup
  const config = window.__STD_CONFIG__ || {
    coupleName: "Vannu & Ananya",
    brideName: "Ananya",
    groomName: "Vannu",
    date: "2026-12-12",
    displayDate: "12 December 2026",
    venue: "The Grand Palace, Lake Pichola",
    city: "Udaipur, Rajasthan",
    hashtag: "#VannuWedsAnanya",
    whatsapp: "919999999999",
    calendarUrl: "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Vannu+%26+Ananya+%E2%80%94+Save+the+Date&dates=20261212/20261213&details=Formal+invitation+to+follow.&location=The+Grand+Palace%2C+Lake+Pichola%2C+Udaipur",
    ctaText: "Save to Google Calendar",
    footerNote: "Formal invitation to follow"
  };

  // State
  let hasRevealed = false;
  let isWiping = false;
  let wipePercent = 0;
  const WIPE_GRID_SIZE = 32;
  let wipeGrid = new Uint8Array(WIPE_GRID_SIZE * WIPE_GRID_SIZE);

  // DOM Elements
  const introScreen = document.getElementById("introScreen");
  const fogCanvas = document.getElementById("fogCanvas");
  const sheenCanvas = document.getElementById("sheenCanvas");
  const dropletCanvas = document.getElementById("dropletCanvas");
  const petalsCanvas = document.getElementById("petalsCanvas");
  const wipePromptHint = document.getElementById("wipePromptHint");
  const mirrorDateReveal = document.getElementById("mirrorDateReveal");
  const mirrorGlowLayer = document.getElementById("mirrorGlowLayer");
  const actionsContainer = document.getElementById("actionsContainer");
  const countdownStrip = document.getElementById("countdownStrip");
  const sacredVowCard = document.getElementById("sacredVowCard");
  const itinerarySection = document.getElementById("itinerarySection");
  const blessingsSection = document.getElementById("blessingsSection");

  // Assets (Local First for 0ms latency and zero CORS errors)
  const scratchImgUrl = "./assets/scratch.webp";
  const petal1Url = "./assets/petal_1.webp";
  const petal2Url = "./assets/petal_2.webp";

  // =========================================================================
  // 1. INTRO TRANSITION CONTROLLER
  // =========================================================================
  function initIntro() {
    if (!introScreen) return;
    const triggerIntro = () => {
      introScreen.classList.add("fade-out");
      setTimeout(() => {
        introScreen.style.display = "none";
      }, 1000);
      tryPlayMusic();
    };

    introScreen.addEventListener("click", triggerIntro);
    introScreen.addEventListener("touchstart", triggerIntro, { passive: true });
    introScreen.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") triggerIntro();
    });
  }

  // =========================================================================
  // 2. FOG CANVASES & SCRATCH PHYSICS
  // =========================================================================
  let fogCtx, sheenCtx, dropletCtx;
  let scratchImg = new Image();
  let droplets = [];
  let animFrameId = null;

  function initFogCanvas() {
    if (!fogCanvas || !sheenCanvas || !dropletCanvas) return;
    fogCtx = fogCanvas.getContext("2d");
    sheenCtx = sheenCanvas.getContext("2d");
    dropletCtx = dropletCanvas.getContext("2d");

    scratchImg.crossOrigin = "anonymous";
    scratchImg.src = scratchImgUrl;
    scratchImg.onload = drawFogLayer;
    scratchImg.onerror = () => {
      drawFogFallback();
    };

    function resizeCanvases() {
      const rect = fogCanvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      [fogCanvas, sheenCanvas, dropletCanvas].forEach(c => {
        c.width = Math.round(rect.width * dpr);
        c.height = Math.round(rect.height * dpr);
        c.getContext("2d").setTransform(dpr, 0, 0, dpr, 0, 0);
      });

      if (scratchImg.complete && scratchImg.naturalWidth > 0) {
        drawFogLayer();
      } else {
        drawFogFallback();
      }
    }

    const ro = new ResizeObserver(resizeCanvases);
    ro.observe(fogCanvas);

    setupPointerEvents();
  }

  function drawFogLayer() {
    if (!fogCanvas || !fogCtx) return;
    const rect = fogCanvas.getBoundingClientRect();
    fogCtx.clearRect(0, 0, rect.width, rect.height);
    fogCtx.globalCompositeOperation = "source-over";
    fogCtx.globalAlpha = 1;

    if (scratchImg.complete && scratchImg.naturalWidth > 0) {
      const w = rect.width * 1.05;
      const h = rect.height * 1.05;
      fogCtx.drawImage(scratchImg, (rect.width - w) / 2, (rect.height - h) / 2, w, h);
    } else {
      drawFogFallback();
    }
  }

  function drawFogFallback() {
    if (!fogCtx) return;
    const rect = fogCanvas.getBoundingClientRect();
    fogCtx.fillStyle = "rgba(224, 218, 208, 0.96)";
    fogCtx.beginPath();
    fogCtx.ellipse(rect.width / 2, rect.height / 2, rect.width / 2, rect.height / 2, 0, 0, Math.PI * 2);
    fogCtx.fill();
  }

  function setupPointerEvents() {
    let lastPoint = null;

    function getCoords(e) {
      const rect = fogCanvas.getBoundingClientRect();
      const clientX = e.clientX ?? (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
      const clientY = e.clientY ?? (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
      return { x: clientX - rect.left, y: clientY - rect.top };
    }

    function onStart(e) {
      if (hasRevealed) return;
      isWiping = true;
      document.body.classList.add("wiping");
      if (wipePromptHint) wipePromptHint.classList.add("hidden");

      const pt = getCoords(e);
      lastPoint = pt;
      eraseAt(pt.x, pt.y);
      spawnWaterDroplets(pt.x, pt.y, 6);
    }

    function onMove(e) {
      if (!isWiping || hasRevealed) return;
      e.preventDefault();
      const pt = getCoords(e);
      if (lastPoint) {
        interpolateErase(lastPoint, pt);
      }
      lastPoint = pt;
      checkWipeProgress();
    }

    function onEnd() {
      isWiping = false;
      lastPoint = null;
      document.body.classList.remove("wiping");
      checkWipeProgress();
    }

    fogCanvas.addEventListener("pointerdown", onStart);
    fogCanvas.addEventListener("pointermove", onMove);
    fogCanvas.addEventListener("pointerup", onEnd);
    fogCanvas.addEventListener("pointercancel", onEnd);

    // Touch fallbacks
    fogCanvas.addEventListener("touchstart", onStart, { passive: false });
    fogCanvas.addEventListener("touchmove", onMove, { passive: false });
    fogCanvas.addEventListener("touchend", onEnd);
  }

  function eraseAt(x, y) {
    if (!fogCtx) return;
    const rect = fogCanvas.getBoundingClientRect();
    const radius = Math.max(20, Math.min(32, rect.width * 0.1));

    recordGrid(x, y, radius, rect);

    fogCtx.globalCompositeOperation = "destination-out";
    const radGrad = fogCtx.createRadialGradient(x, y, 0, x, y, radius);
    radGrad.addColorStop(0, "rgba(0,0,0,1)");
    radGrad.addColorStop(0.65, "rgba(0,0,0,0.85)");
    radGrad.addColorStop(1, "rgba(0,0,0,0)");
    fogCtx.fillStyle = radGrad;
    fogCtx.beginPath();
    fogCtx.arc(x, y, radius, 0, Math.PI * 2);
    fogCtx.fill();
  }

  function interpolateErase(p1, p2) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dist = Math.hypot(dx, dy);
    const step = 8;
    const count = Math.max(1, Math.floor(dist / step));

    for (let i = 0; i <= count; i++) {
      const t = i / count;
      eraseAt(p1.x + dx * t, p1.y + dy * t);
    }

    spawnWaterDroplets(p2.x, p2.y, Math.min(10, Math.max(3, Math.round(dist / 4))));
  }

  function recordGrid(x, y, radius, rect) {
    const gx = (x / rect.width) * WIPE_GRID_SIZE;
    const gy = (y / rect.height) * WIPE_GRID_SIZE;
    const gr = Math.max(0.6, (radius / rect.width) * WIPE_GRID_SIZE);

    const minX = Math.max(0, Math.floor(gx - gr));
    const maxX = Math.min(WIPE_GRID_SIZE - 1, Math.ceil(gx + gr));
    const minY = Math.max(0, Math.floor(gy - gr));
    const maxY = Math.min(WIPE_GRID_SIZE - 1, Math.ceil(gy + gr));

    for (let r = minY; r <= maxY; r++) {
      for (let c = minX; c <= maxX; c++) {
        const d = Math.hypot(c + 0.5 - gx, r + 0.5 - gy);
        if (d <= gr) {
          wipeGrid[r * WIPE_GRID_SIZE + c] = 1;
        }
      }
    }
  }

  function checkWipeProgress() {
    if (hasRevealed) return;
    let filled = 0;
    let total = 0;
    const center = WIPE_GRID_SIZE / 2;

    for (let r = 0; r < WIPE_GRID_SIZE; r++) {
      for (let c = 0; c < WIPE_GRID_SIZE; c++) {
        const distFromCenter = Math.hypot((c + 0.5 - center) / center, (r + 0.5 - center) / center);
        if (distFromCenter <= 1) {
          total++;
          if (wipeGrid[r * WIPE_GRID_SIZE + c]) filled++;
        }
      }
    }

    wipePercent = total ? filled / total : 0;
    if (wipePercent >= 0.45) {
      triggerMirrorReveal();
    }
  }

  function spawnWaterDroplets(x, y, count) {
    for (let i = 0; i < count; i++) {
      droplets.push({
        x: x + (Math.random() - 0.5) * 12,
        y: y + (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * 15,
        vy: 12 + Math.random() * 25,
        size: 0.8 + Math.random() * 1.5,
        alpha: 0.6 + Math.random() * 0.3,
        life: 0.6 + Math.random() * 0.8,
        maxLife: 1.2
      });
    }

    if (!animFrameId) {
      animFrameId = requestAnimationFrame(animateDroplets);
    }
  }

  function animateDroplets() {
    if (!dropletCanvas || !dropletCtx) return;
    const rect = dropletCanvas.getBoundingClientRect();
    dropletCtx.clearRect(0, 0, rect.width, rect.height);

    const dt = 0.016;
    const alive = [];

    for (let i = 0; i < droplets.length; i++) {
      const d = droplets[i];
      d.vy += 80 * dt;
      d.x += d.vx * dt;
      d.y += d.vy * dt;
      d.life -= dt;

      if (d.life > 0 && d.y < rect.height) {
        const ratio = d.life / d.maxLife;
        dropletCtx.globalAlpha = d.alpha * ratio;
        dropletCtx.fillStyle = "rgba(225, 242, 255, 0.9)";
        dropletCtx.beginPath();
        dropletCtx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        dropletCtx.fill();
        alive.push(d);
      }
    }

    droplets = alive;
    if (droplets.length > 0) {
      animFrameId = requestAnimationFrame(animateDroplets);
    } else {
      animFrameId = null;
      dropletCtx.clearRect(0, 0, rect.width, rect.height);
    }
  }

  // =========================================================================
  // 3. WOW MOMENT: MIRROR REVEAL ACTIVATION
  // =========================================================================
  function triggerMirrorReveal() {
    if (hasRevealed) return;
    hasRevealed = true;

    // Fade out fog and droplet canvases
    if (fogCanvas) fogCanvas.classList.add("canvas-cleared");
    if (sheenCanvas) sheenCanvas.classList.add("canvas-cleared");
    if (dropletCanvas) dropletCanvas.classList.add("canvas-cleared");
    if (wipePromptHint) wipePromptHint.classList.add("hidden");

    // Reveal date typography with cinematic focus pull
    if (mirrorDateReveal) mirrorDateReveal.classList.add("revealed");
    if (mirrorGlowLayer) mirrorGlowLayer.classList.add("active");

    // Reveal additional sections with staggered timing
    setTimeout(() => {
      if (actionsContainer) actionsContainer.classList.add("revealed");
    }, 400);

    setTimeout(() => {
      if (countdownStrip) countdownStrip.classList.add("revealed");
    }, 800);

    setTimeout(() => {
      if (sacredVowCard) sacredVowCard.classList.add("revealed");
      if (itinerarySection) itinerarySection.classList.add("revealed");
      if (blessingsSection) blessingsSection.classList.add("revealed");
    }, 1100);

    // Launch celebratory falling flower petals
    startPetalShower();
  }

  // =========================================================================
  // 4. CELEBRATORY FALLING PETALS SIMULATION
  // =========================================================================
  let petalImages = [new Image(), new Image()];
  let activePetals = [];
  let petalShowerRunning = false;

  function startPetalShower() {
    if (petalShowerRunning || !petalsCanvas) return;
    petalShowerRunning = true;

    petalImages[0].src = petal1Url;
    petalImages[1].src = petal2Url;

    const ctx = petalsCanvas.getContext("2d");

    function resizePetals() {
      petalsCanvas.width = window.innerWidth;
      petalsCanvas.height = window.innerHeight;
    }
    resizePetals();
    window.addEventListener("resize", resizePetals);

    const endTime = performance.now() + 8000;
    let lastSpawn = 0;

    function spawnPetal() {
      const type = Math.random() < 0.5 ? 0 : 1;
      activePetals.push({
        img: petalImages[type],
        x: Math.random() * petalsCanvas.width,
        y: -30,
        vy: 40 + Math.random() * 50,
        vx: (Math.random() - 0.5) * 20,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 3,
        flip: Math.random() * Math.PI * 2,
        flipSpeed: (Math.random() - 0.5) * 4,
        size: 20 + Math.random() * 18,
        alpha: 0.6 + Math.random() * 0.4
      });
    }

    function renderPetals(now) {
      ctx.clearRect(0, 0, petalsCanvas.width, petalsCanvas.height);

      if (now < endTime && now - lastSpawn > 160) {
        lastSpawn = now;
        spawnPetal();
        if (Math.random() < 0.4) spawnPetal();
      }

      const surviving = [];
      const dt = 0.016;

      for (let i = 0; i < activePetals.length; i++) {
        const p = activePetals[i];
        p.y += p.vy * dt;
        p.x += p.vx * dt;
        p.rot += p.rotSpeed * dt;
        p.flip += p.flipSpeed * dt;

        if (p.y < petalsCanvas.height + 40) {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.scale(Math.cos(p.flip), 1);
          if (p.img.complete && p.img.naturalWidth > 0) {
            ctx.drawImage(p.img, -p.size / 2, -p.size / 2, p.size, p.size);
          }
          ctx.restore();
          surviving.push(p);
        }
      }

      activePetals = surviving;
      if (activePetals.length > 0 || now < endTime) {
        requestAnimationFrame(renderPetals);
      } else {
        ctx.clearRect(0, 0, petalsCanvas.width, petalsCanvas.height);
        petalShowerRunning = false;
      }
    }

    requestAnimationFrame(renderPetals);
  }

  // =========================================================================
  // 5. LIVE COUNTDOWN TIMER
  // =========================================================================
  function initCountdown() {
    const cdDays = document.getElementById("cdDays");
    const cdHours = document.getElementById("cdHours");
    const cdMins = document.getElementById("cdMins");
    const cdSecs = document.getElementById("cdSecs");

    if (!cdDays || !cdHours || !cdMins || !cdSecs) return;

    const targetDate = new Date(`${config.date}T10:00:00+05:30`).getTime();

    function update() {
      const now = Date.now();
      const diff = Math.max(0, targetDate - now);

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);

      cdDays.textContent = String(d).padStart(2, "0");
      cdHours.textContent = String(h).padStart(2, "0");
      cdMins.textContent = String(m).padStart(2, "0");
      cdSecs.textContent = String(s).padStart(2, "0");
    }

    update();
    setInterval(update, 1000);
  }

  // =========================================================================
  // 6. GUEST BLESSINGS INTERACTIVE WALL
  // =========================================================================
  function initBlessingsWall() {
    const list = document.getElementById("blessingMessagesList");
    const input = document.getElementById("blessingInputBox");
    const sendBtn = document.getElementById("blessingSendBtn");
    const chips = document.querySelectorAll(".blessing-chip-btn");

    if (!list) return;

    function addBlessing(msg) {
      if (!msg) return;
      const item = document.createElement("div");
      item.className = "blessing-item";
      item.textContent = `“${msg}” — With love ❤️`;
      list.prepend(item);

      // Trigger flower shower on blessing
      startPetalShower();
    }

    chips.forEach(chip => {
      chip.addEventListener("click", () => {
        addBlessing(chip.textContent.trim());
      });
    });

    if (sendBtn && input) {
      sendBtn.addEventListener("click", () => {
        const val = input.value.trim();
        if (val) {
          addBlessing(val);
          input.value = "";
        }
      });

      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          const val = input.value.trim();
          if (val) {
            addBlessing(val);
            input.value = "";
          }
        }
      });
    }
  }

  // =========================================================================
  // 7. AMBIENT MUSIC ENGINE
  // =========================================================================
  let audio = document.getElementById("stdBgAudio");
  let musicBtn = document.getElementById("stdMusicBtn");

  function tryPlayMusic() {
    if (!audio || !musicBtn) return;
    audio.volume = 0.55;
    const promise = audio.play();
    if (promise && typeof promise.then === "function") {
      promise.then(() => {
        musicBtn.classList.remove("is-paused");
      }).catch(() => {
        musicBtn.classList.add("is-paused");
      });
    }
  }

  function initMusicControls() {
    if (!audio || !musicBtn) return;

    musicBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (audio.paused) {
        tryPlayMusic();
      } else {
        audio.pause();
        musicBtn.classList.add("is-paused");
      }
    });

    // Auto pause on background
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        if (!audio.paused) audio.pause();
      }
    });
  }

  // =========================================================================
  // 8. VANVI MOMENTS POST-PURCHASE ENTITLEMENT ARCHITECTURE
  // =========================================================================
  window.VanviEntitlement = {
    isPurchased: function () {
      return localStorage.getItem("vanvi_mirror_reveal_purchased") === "true";
    },
    verifyPurchase: function () {
      localStorage.setItem("vanvi_mirror_reveal_purchased", "true");
      applyPurchaseEntitlement();
    },
    revokePurchase: function () {
      localStorage.removeItem("vanvi_mirror_reveal_purchased");
      applyPurchaseEntitlement();
    }
  };

  function applyPurchaseEntitlement() {
    const badge = document.getElementById("demoWatermarkBadge");
    if (!badge) return;

    if (window.VanviEntitlement.isPurchased()) {
      badge.style.display = "none";
      badge.hidden = true;
      if (badge.parentNode) badge.parentNode.removeChild(badge);
    } else {
      badge.style.display = "flex";
      badge.hidden = false;
    }
  }

  // Check URL params for purchase state (?purchased=true)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("purchased") === "true") {
    window.VanviEntitlement.verifyPurchase();
  }

  // Real-time synchronization from Vanvi Builder Studio
  window.addEventListener("message", (event) => {
    if (!event.data || event.data.type !== "UPDATE_CONFIG") return;
    const newCfg = event.data.config;
    if (!newCfg) return;

    // Dynamically update text fields
    const bride = newCfg.couple?.bride || newCfg.brideName || "Ananya";
    const groom = newCfg.couple?.groom || newCfg.groomName || "Vannu";
    const coupleName = `${groom} & ${bride}`;

    const heroNames = document.getElementById("coupleHeroNames");
    if (heroNames) heroNames.innerHTML = `<span>${groom}</span><span class="amp"> & </span><span>${bride}</span>`;

    const introCouple = document.getElementById("introCoupleNames");
    if (introCouple) introCouple.textContent = coupleName;

    const venue = newCfg.couple?.venue || newCfg.venue;
    const dateVenue = document.getElementById("dateVenueText");
    if (dateVenue && venue) dateVenue.textContent = venue;
  });

  // =========================================================================
  // BOOTSTRAP INITIALIZATION
  // =========================================================================
  document.addEventListener("DOMContentLoaded", () => {
    initIntro();
    initFogCanvas();
    initCountdown();
    initBlessingsWall();
    initMusicControls();
    applyPurchaseEntitlement();
  });

})();
