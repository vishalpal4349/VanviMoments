/**
 * =====================================================================
 * VANVI MOMENTS — ETERNAL LOVE RUNTIME SCRIPT
 * Multi-chapter transitions, Audio Engine, Confetti & Live Sync
 * =====================================================================
 */

(function () {
  'use strict';

  // Default Eternal Configuration
  const DEFAULT_CONFIG = {
    brand: "Vanvi Moments",
    to: "Anvi",
    from: "Anubhav",
    date: "2016-12-08",
    theme: "ivory",
    isPublished: false,
    headline: "To My *Favourite* Person",
    opening: "A little celebration of us.",
    firstCaption: "Where it all began ✦",
    letterGreeting: "My love,",
    letterBody: "If I could relive all the little moments that brought us here, I'd choose them again.\n\nThe laughs, the random conversations, the days that didn't go as planned, and all the moments when just having you around made everything better.\n\nThank you for being part of my life.\n\nThank you for the memories we've made, the things we've learned, and the little ways we've grown together.\n\n*You are still one of my favourite parts of every day.*\n\nHappy Anniversary, my love.\n\nHere's to everything we've been, everything we are, and all the beautiful little moments still waiting for us.",
    letterClosing: "With all my love, always",
    statement: "You. Me. Our little *forever.*",
    finaleMessage: "If I could make one wish for us, it would be for a thousand more ordinary days together.\n\nMore laughter.\nMore late-night conversations.\nMore little adventures.\nMore memories we haven't made yet.\n\nI'd love to keep writing this story with you.",
    finalLine: "Somehow, in this huge world, I found you.",
    finalMessage: "And I'd still choose you.",
    heroPhoto: "./assets/images/where_it_began.jpg",
    photos: [
      { url: "./assets/images/polaroid1.jpg", title: "Our First Picture", caption: "A little moment that became a forever favourite." },
      { url: "./assets/images/polaroid2.jpg", title: "Our Happiest Days", caption: "The kind of happiness I wish I could pause." },
      { url: "./assets/images/polaroid3.jpg", title: "Our Silly Moments", caption: "Proof that we don't need a reason to laugh." },
      { url: "./assets/images/polaroid4.jpg", title: "My Favourite Memory", caption: "One I'll always keep close to my heart." }
    ],
    milestones: [
      { title: "The First Hello", text: "The beginning of something I didn't know would mean so much." },
      { title: "The Moment It Changed", text: "Somewhere along the way, you became my favourite person." },
      { title: "The Day We Became Us", text: "And suddenly, ordinary days had a little more magic." }
    ],
    reasons: [
      "The way you make ordinary days feel special.",
      "Your smile, especially when you don't realize it.",
      "The way you listen to my random stories.",
      "How being around you feels like home.",
      "Our inside jokes that nobody else understands.",
      "The comfort of knowing you're there.",
      "The way we keep learning about each other.",
      "Simply because you're you."
    ],
    audioUrl: "./assets/audio/slow_bloom.mp3",
    audioTitle: "Slow Bloom"
  };

  const state = {
    config: { ...DEFAULT_CONFIG },
    currentStep: 0,
    isPlaying: false,
    audio: null
  };

  function parseStarsToGold(text) {
    if (!text) return "";
    return text.replace(/\*(.*?)\*/g, '<em style="color:var(--theme-gold); font-style:italic;">$1</em>');
  }

  function calculateDays(startDateStr) {
    if (!startDateStr) return "Countless Days";
    const start = new Date(startDateStr);
    const now = new Date();
    const diffTime = Math.abs(now - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays.toLocaleString()} Days of Choosing You`;
  }

  function applyConfig() {
    const c = state.config;

    // Palette
    document.body.setAttribute("data-palette", c.theme || "ivory");

    // Watermark
    const urlParams = new URLSearchParams(window.location.search);
    const isPub = urlParams.get("published") === "true" || localStorage.getItem("vanvi_eternal_love_published") === "true" || c.isPublished;
    if (isPub) {
      document.body.classList.add("is-published");
    } else {
      document.body.classList.remove("is-published");
    }

    // Days counter
    const daysEl = document.getElementById("dispDaysCount");
    if (daysEl) daysEl.textContent = calculateDays(c.date);

    // Headline & Opening
    const hlEl = document.getElementById("dispHeadline");
    if (hlEl) hlEl.innerHTML = parseStarsToGold(c.headline || DEFAULT_CONFIG.headline);

    const opEl = document.getElementById("dispOpening");
    if (opEl) opEl.textContent = c.opening || DEFAULT_CONFIG.opening;

    // Hero Photo
    const heroImg = document.getElementById("dispHeroPhoto");
    if (heroImg && c.heroPhoto) heroImg.src = c.heroPhoto;

    const firstCap = document.getElementById("dispFirstCaption");
    if (firstCap) firstCap.textContent = c.firstCaption || DEFAULT_CONFIG.firstCaption;

    // Milestones
    const milesContainer = document.getElementById("milestonesList");
    if (milesContainer && Array.isArray(c.milestones)) {
      milesContainer.innerHTML = c.milestones.map((m, idx) => `
        <div class="milestone-item">
          <div class="milestone-marker">${idx + 1}</div>
          <div class="milestone-content">
            <h4>${m.title}</h4>
            <p>${m.text}</p>
          </div>
        </div>
      `).join("");
    }

    // Polaroids
    const polaroidContainer = document.getElementById("polaroidStack");
    if (polaroidContainer && Array.isArray(c.photos)) {
      polaroidContainer.innerHTML = c.photos.map(p => `
        <div class="polaroid-frame">
          <img src="${p.url}" alt="${p.title}" class="polaroid-img" />
          <div class="polaroid-caption-box">
            <h4>${p.title}</h4>
            <p>${p.caption}</p>
          </div>
        </div>
      `).join("");
    }

    // Reasons
    const reasonsContainer = document.getElementById("reasonsContainer");
    if (reasonsContainer && Array.isArray(c.reasons)) {
      reasonsContainer.innerHTML = c.reasons.map((r, idx) => `
        <div class="reason-card-pill">
          <span class="reason-number">#${idx + 1}</span>
          <span class="reason-text">${r}</span>
        </div>
      `).join("");
    }

    // Letter
    const lgEl = document.getElementById("dispLetterGreeting");
    if (lgEl) lgEl.textContent = c.letterGreeting || `To ${c.to || "My Love"},`;

    const lbEl = document.getElementById("dispLetterBody");
    if (lbEl) lbEl.innerHTML = parseStarsToGold(c.letterBody || DEFAULT_CONFIG.letterBody);

    const lcEl = document.getElementById("dispLetterClosing");
    if (lcEl) lcEl.textContent = c.letterClosing || `Yours always, ${c.from || "Me"}`;

    // Finale
    const stEl = document.getElementById("dispStatement");
    if (stEl) stEl.innerHTML = parseStarsToGold(c.statement || DEFAULT_CONFIG.statement);

    const fmEl = document.getElementById("dispFinaleMessage");
    if (fmEl) fmEl.textContent = c.finaleMessage || DEFAULT_CONFIG.finaleMessage;

    const flEl = document.getElementById("dispFinalLine");
    if (flEl) flEl.textContent = c.finalLine || DEFAULT_CONFIG.finalLine;

    const fnmEl = document.getElementById("dispFinalMessage");
    if (fnmEl) fnmEl.textContent = c.finalMessage || DEFAULT_CONFIG.finalMessage;
  }

  function goToStep(stepIndex) {
    state.currentStep = stepIndex;
    document.querySelectorAll(".chapter-screen").forEach((sc, idx) => {
      sc.classList.toggle("active", idx === stepIndex);
    });

    document.querySelectorAll(".step-dot").forEach((dot, idx) => {
      dot.classList.toggle("active", idx === stepIndex);
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function setupAudio() {
    state.audio = new Audio(state.config.audioUrl);
    state.audio.loop = true;

    const toggleBtn = document.getElementById("btnAudioToggle");
    const bars = document.getElementById("audioBars");

    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        if (state.isPlaying) {
          state.audio.pause();
          state.isPlaying = false;
          toggleBtn.classList.remove("audio-playing");
        } else {
          state.audio.play().then(() => {
            state.isPlaying = true;
            toggleBtn.classList.add("audio-playing");
          }).catch(e => console.log("Audio play blocked:", e));
        }
      });
    }
  }

  function bindEvents() {
    // Break Seal button on Chapter 0
    const btnOpen = document.getElementById("btnOpenInvitation");
    if (btnOpen) {
      btnOpen.addEventListener("click", () => {
        if (!state.isPlaying && state.audio) {
          state.audio.play().then(() => {
            state.isPlaying = true;
            const toggleBtn = document.getElementById("btnAudioToggle");
            if (toggleBtn) toggleBtn.classList.add("audio-playing");
          }).catch(() => {});
        }
        goToStep(1);
      });
    }

    // Step dots
    document.querySelectorAll(".step-dot").forEach(dot => {
      dot.addEventListener("click", e => {
        const step = parseInt(e.target.getAttribute("data-step"), 10);
        goToStep(step);
      });
    });

    // Next chapter buttons
    document.querySelectorAll(".chapter-nav-btn").forEach(btn => {
      btn.addEventListener("click", e => {
        const next = parseInt(e.currentTarget.getAttribute("data-next"), 10);
        goToStep(next);
      });
    });

    // Celebrate button
    const btnCel = document.getElementById("btnCelebrate");
    if (btnCel) {
      btnCel.addEventListener("click", () => {
        if (window.confetti) {
          window.confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#c59b27', '#e8c987', '#d84b5a', '#ffffff']
          });
        }
        const rev = document.getElementById("celebrateRevealed");
        if (rev) rev.classList.add("revealed");
        btnCel.innerHTML = `<span>🥂 Forever & Always</span>`;
      });
    }
  }

  // Receive Live updates from Builder
  window.addEventListener("message", e => {
    if (e.data && e.data.type === "VANVI_CONFIG_UPDATE") {
      state.config = { ...state.config, ...e.data.config };
      applyConfig();
    }
  });

  // Init
  document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const dataParam = urlParams.get("data");
    if (dataParam) {
      try {
        const decoded = JSON.parse(decodeURIComponent(escape(atob(dataParam))));
        state.config = { ...DEFAULT_CONFIG, ...decoded };
      } catch (err) {}
    }

    applyConfig();
    setupAudio();
    bindEvents();
  });

})();
