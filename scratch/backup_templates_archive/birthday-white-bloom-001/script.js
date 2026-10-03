/**
 * Birthday White Bloom (birthday-white-bloom-001)
 * VanviMoments — Standalone Production Template Engine
 */

(function() {
  'use strict';

  const marketplaceMetadata = {
    id: "birthday-white-bloom-001",
    name: "Birthday White Bloom",
    occasion: "Birthday",
    tier: "Free",
    price: "₹0",
    tags: ["Cute", "Birthday", "Light Luxury", "Emotional", "Free"],
    features: [
      "8 Photo Memory Gallery",
      "Animated Letter Reveal",
      "Live Birthday Countdown",
      "Interactive 5-Candle Cake",
      "Memory Story Timeline",
      "Secret Surprise Reveal",
      "Ambient Music Soundtrack",
      "Real QR Code & WhatsApp Share"
    ]
  };

  let templateData = {
    recipientName: "Aarav",
    senderName: "Sneha",
    message: "Wishing you another 365 days of laughter, golden sunsets, and big dreams. May your year be as bright and beautiful as your smile. Happy Birthday! 🎂✨",
    birthdayDate: "2027-09-19T00:00:00",
    photos: [
      { src: "https://images.pexels.com/photos/1116302/pexels-photo-1116302.jpeg?auto=compress&cs=tinysrgb&w=800", alt: "Circle of friends forming star shape", caption: "The kind of joy that stays." },
      { src: "https://images.pexels.com/photos/1729797/pexels-photo-1729797.jpeg?auto=compress&cs=tinysrgb&w=800", alt: "Birthday cake with sparklers", caption: "A little extra sparkle." },
      { src: "https://images.pexels.com/photos/1024960/pexels-photo-1024960.jpeg?auto=compress&cs=tinysrgb&w=800", alt: "Couple walking on beach", caption: "Sunset stories." },
      { src: "https://images.pexels.com/photos/4609676/pexels-photo-4609676.jpeg?auto=compress&cs=tinysrgb&w=800", alt: "People enjoying beach sunset", caption: "Golden hour forever." },
      { src: "https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?auto=compress&cs=tinysrgb&w=800", alt: "Pink flowers bouquet", caption: "Flowers, just because." },
      { src: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800", alt: "Latte art in coffee cup", caption: "Slow, sweet mornings." },
      { src: "https://images.pexels.com/photos/1567069/pexels-photo-1567069.jpeg?auto=compress&cs=tinysrgb&w=800", alt: "Stargazing under night sky", caption: "Under the same stars." },
      { src: "https://images.pexels.com/photos/29978494/pexels-photo-29978494.jpeg?auto=compress&cs=tinysrgb&w=800", alt: "Sparkler in the dark", caption: "Always worth celebrating." }
    ],
    memories: [
      { date: "The beginning", title: "A bright little spark", text: "The first chapter of a story that keeps becoming more beautiful.", photo: "https://images.pexels.com/photos/1104014/pexels-photo-1104014.jpeg?auto=compress&cs=tinysrgb&w=400", alt: "Cheerful child jumping" },
      { date: "A proud moment", title: "You made it happen", text: "A memory of courage, growth, and everyone cheering you on.", photo: "https://images.pexels.com/photos/1205651/pexels-photo-1205651.jpeg?auto=compress&cs=tinysrgb&w=400", alt: "Graduation celebration" },
      { date: "More to come", title: "Adventure is calling", text: "For every horizon still waiting for your wonderful energy.", photo: "https://images.pexels.com/photos/691034/pexels-photo-691034.jpeg?auto=compress&cs=tinysrgb&w=400", alt: "Mountain horizon" }
    ],
    music: { enabled: true, src: "", title: "Birthday Melody" },
    theme: { pearl: "#fffdf9", blush: "#f9e4e8", rose: "#b95a73", lavender: "#e9e3f5", champagne: "#d8b477" }
  };

  const $ = id => document.getElementById(id);
  const safeUrl = value => /^(https?:\/\/|assets\/|data:image\/)/i.test(String(value || "")) ? String(value) : "";
  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[c]));
  const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let activePhoto = 0;
  let actualPhotos = [];
  let countdownTimer = null;
  let timelineObserver = null;
  let lastFocus = null;
  let audio = null;

  // Load customizations from URL params or localStorage
  function loadInitialCustomization() {
    try {
      const params = new URLSearchParams(window.location.search);
      const momentId = params.get('id');

      // Check if data is passed via sessionStorage or localStorage
      if (momentId) {
        const rawSaved = localStorage.getItem('vanvi_user_moments');
        if (rawSaved) {
          const list = JSON.parse(rawSaved);
          const found = list.find(m => m.id === momentId || m.slug === momentId);
          if (found) {
            if (found.recipient) templateData.recipientName = found.recipient;
            if (found.sender) templateData.senderName = found.sender;
            if (found.message) templateData.message = found.message;
            if (found.date || found.birthdayDate) templateData.birthdayDate = found.date || found.birthdayDate;
            if (found.photos && found.photos.length) templateData.photos = found.photos;
            if (found.memories && found.memories.length) templateData.memories = found.memories;
            if (found.musicTrack) templateData.music.title = found.musicTrack;
          }
        }
      }

      // URL parameters override
      if (params.get('recipient')) templateData.recipientName = params.get('recipient');
      if (params.get('sender')) templateData.senderName = params.get('sender');
      if (params.get('text') || params.get('message')) templateData.message = params.get('text') || params.get('message');
      if (params.get('date')) templateData.birthdayDate = params.get('date');
    } catch(e) {
      console.warn('Customization load note:', e);
    }
  }

  function toast(message) {
    const node = $("toast");
    if (!node) return;
    node.textContent = message;
    node.classList.add("show");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => node.classList.remove("show"), 2400);
  }

  function renderHero() {
    if (templateData.theme) {
      ["pearl", "blush", "rose", "lavender", "champagne"].forEach(key => {
        if (templateData.theme[key]) {
          document.documentElement.style.setProperty(`--${key}`, templateData.theme[key]);
        }
      });
    }

    if ($("introTitle")) $("introTitle").textContent = "A little birthday magic is waiting…";
    if ($("heroEyebrow")) $("heroEyebrow").textContent = "A birthday memory garden";
    if ($("heroTitle")) $("heroTitle").textContent = `Happy Birthday, ${templateData.recipientName}`;
    if ($("heroCopy")) $("heroCopy").textContent = "Today is a little more special because you exist.";
    if ($("openMoment")) $("openMoment").textContent = "Open Your Birthday Moment ✨";
    if ($("revealBanner")) $("revealBanner").textContent = "Made especially for you.";
    if ($("musicStatus")) $("musicStatus").textContent = "Sound is ready when you are.";
    if ($("surpriseMessage")) $("surpriseMessage").textContent = `May this year bring you more beautiful moments than you can count, ${templateData.recipientName}. 💗`;
  }

  function renderGallery() {
    const gallery = $("gallery");
    if (!gallery) return;
    gallery.replaceChildren();

    actualPhotos = (Array.isArray(templateData.photos) ? templateData.photos : [])
      .filter(photo => safeUrl(photo?.src))
      .slice(0, 8);

    gallery.dataset.count = String(actualPhotos.length);

    if (!actualPhotos.length) {
      const empty = document.createElement("article");
      empty.className = "gallery-empty";
      empty.innerHTML = "<div><strong>Your memories will bloom here ✨</strong><p style='margin:.7rem 0 0;color:var(--muted)'>Add photos whenever the story is ready to be told.</p></div>";
      gallery.append(empty);
      return;
    }

    actualPhotos.forEach((photo, index) => {
      const card = document.createElement("button");
      const image = document.createElement("img");
      const caption = document.createElement("span");

      card.className = "memory-card";
      card.type = "button";
      card.setAttribute("aria-label", `Open photo: ${photo.caption || `Memory ${index + 1}`}`);

      image.loading = "lazy";
      image.src = safeUrl(photo.src);
      image.alt = photo.alt || `Birthday memory ${index + 1}`;
      caption.textContent = photo.caption || "A beautiful memory.";

      card.append(image, caption);
      card.addEventListener("click", () => {
        showPhoto(index);
        openModal("lightbox");
      });
      gallery.append(card);
    });
  }

  function renderLetter() {
    const letter = $("letterContent");
    if (!letter) return;
    letter.textContent = `Dear ${templateData.recipientName},\n\n${templateData.message}\n\nWith all my love,\n${templateData.senderName}`;
  }

  function renderTimeline() {
    const timeline = $("timeline");
    if (!timeline) return;
    timeline.replaceChildren();
    if (timelineObserver) timelineObserver.disconnect();

    const memoryList = Array.isArray(templateData.memories) ? templateData.memories : [];
    memoryList.forEach(memory => {
      const item = document.createElement("li");
      const photo = safeUrl(memory.photo);
      const article = document.createElement("article");
      const copy = document.createElement("div");

      item.className = "timeline-item";
      article.className = `timeline-card glass ${photo ? "" : "text-only"}`;

      if (photo) {
        const image = document.createElement("img");
        image.loading = "lazy";
        image.src = photo;
        image.alt = memory.alt || memory.title || "";
        article.append(image);
      }

      copy.innerHTML = `<span class="timeline-date">${escapeHtml(memory.date)}</span><h3>${escapeHtml(memory.title)}</h3><p>${escapeHtml(memory.text)}</p>`;
      article.append(copy);
      item.append(article);
      timeline.append(item);
    });

    if (!("IntersectionObserver" in window) || reducedMotion()) {
      timeline.querySelectorAll(".timeline-item").forEach(item => item.classList.add("visible"));
      return;
    }

    timelineObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          timelineObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    timeline.querySelectorAll(".timeline-item").forEach(item => timelineObserver.observe(item));
  }

  function updateCountdown() {
    const date = new Date(templateData.birthdayDate);
    const ids = ["days", "hours", "minutes", "seconds"];
    const message = $("countdownMessage");

    if (!templateData.birthdayDate || Number.isNaN(date.getTime())) {
      ids.forEach(id => { if ($(id)) $(id).textContent = "—"; });
      if (message) message.textContent = "Your special day is waiting to be set ✨";
      return;
    }

    const now = new Date();
    const difference = date - now;

    if (difference <= 0 || date.toDateString() === now.toDateString()) {
      ids.forEach(id => { if ($(id)) $(id).textContent = "00"; });
      if (message) {
        message.textContent = difference < 0 ? "This birthday bloom is a treasured celebration ✨" : "Today is your day! Happy Birthday! ✨";
      }
      return;
    }

    const total = Math.floor(difference / 1000);
    const values = [
      Math.floor(total / 86400),
      Math.floor((total % 86400) / 3600),
      Math.floor((total % 3600) / 60),
      total % 60
    ];

    ids.forEach((id, index) => {
      if ($(id)) $(id).textContent = String(values[index]).padStart(2, "0");
    });
    if (message) message.textContent = "";
  }

  function showPhoto(index) {
    if (!actualPhotos.length) return;
    activePhoto = (index + actualPhotos.length) % actualPhotos.length;
    const photo = actualPhotos[activePhoto];
    if ($("lightboxImage")) {
      $("lightboxImage").src = safeUrl(photo.src);
      $("lightboxImage").alt = photo.alt || "";
    }
    if ($("lightboxCaption")) {
      $("lightboxCaption").textContent = photo.caption || "";
    }
    if ($("previousPhoto")) $("previousPhoto").disabled = actualPhotos.length < 2;
    if ($("nextPhoto")) $("nextPhoto").disabled = actualPhotos.length < 2;
  }

  function openModal(id) {
    const el = $(id);
    if (!el) return;
    lastFocus = document.activeElement;
    el.classList.add("open");
    const btn = el.querySelector("button");
    if (btn) btn.focus();
  }

  function closeModal(id) {
    const el = $(id);
    if (!el) return;
    el.classList.remove("open");
    if (lastFocus) lastFocus.focus();
  }

  function setStage(stage, { updateHash = true, focus = false } = {}) {
    const opening = stage !== "experience";
    if ($("openingStage")) $("openingStage").hidden = !opening;
    if ($("experienceStage")) $("experienceStage").hidden = opening;

    if (updateHash && location.hash !== `#${opening ? "opening" : "experience"}`) {
      try {
        history.pushState({ stage }, "", `#${opening ? "opening" : "experience"}`);
      } catch(e) {}
    }

    if (!opening) {
      window.scrollTo({ top: 0, behavior: reducedMotion() ? "auto" : "smooth" });
      if (focus && $("experienceStart")) {
        setTimeout(() => $("experienceStart").focus(), reducedMotion() ? 0 : 220);
      }
    }
  }

  async function copyText(text) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch(e) {}

    const area = document.createElement("textarea");
    area.value = text;
    area.style.position = "fixed";
    area.style.left = "-9999px";
    document.body.append(area);
    area.select();
    const copied = document.execCommand("copy");
    area.remove();
    return copied;
  }

  // Render Real Dynamic QR Code using VanviQR
  function renderDynamicQR(url) {
    const qrCanvas = $("qrCanvas");
    if (!qrCanvas) return;

    if (window.VanviQR && typeof window.VanviQR.render === 'function') {
      window.VanviQR.render(qrCanvas, url, { size: 180, dark: '#402e35', light: '#ffffff' });
    }
  }

  function bindInteractions() {
    const dismissIntro = () => {
      if ($("intro")) $("intro").classList.add("is-hidden");
    };

    if ($("skipIntro")) $("skipIntro").addEventListener("click", dismissIntro);
    setTimeout(dismissIntro, 3500);

    if ($("openMoment")) {
      $("openMoment").addEventListener("click", () => {
        if ($("revealBanner")) $("revealBanner").classList.add("show");
        setTimeout(() => {
          if ($("revealBanner")) $("revealBanner").classList.remove("show");
          setStage("experience", { focus: true });
        }, reducedMotion() ? 0 : 750);
      });
    }

    if ($("replayOpening")) {
      $("replayOpening").addEventListener("click", () => setStage("opening", { focus: true }));
    }

    if ($("letterToggle")) {
      $("letterToggle").addEventListener("click", event => {
        const paper = $("letterPaper");
        if (!paper) return;
        const open = paper.classList.toggle("open");
        event.currentTarget.setAttribute("aria-expanded", String(open));
      });
    }

    // Interactive Cake Candles
    const candles = [...document.querySelectorAll(".candle")];
    candles.forEach(candle => {
      candle.addEventListener("click", () => {
        candle.classList.add("off");
        candle.disabled = true;
        if (candles.every(item => item.classList.contains("off"))) {
          if ($("wishMessage")) $("wishMessage").textContent = "Make a wish! May all your dreams bloom ✨";
        }
      });
    });

    if ($("resetCake")) {
      $("resetCake").addEventListener("click", () => {
        candles.forEach(candle => {
          candle.classList.remove("off");
          candle.disabled = false;
        });
        if ($("wishMessage")) $("wishMessage").textContent = "";
      });
    }

    if ($("surpriseToggle")) {
      $("surpriseToggle").addEventListener("click", event => {
        const box = $("surpriseMessage");
        if (!box) return;
        const open = box.classList.toggle("open");
        event.currentTarget.setAttribute("aria-expanded", String(open));
      });
    }

    // Audio Playback
    if ($("musicToggle")) {
      $("musicToggle").addEventListener("click", async () => {
        const music = templateData.music;
        if (!music || !music.enabled) {
          if ($("musicStatus")) $("musicStatus").textContent = "Music is turned off for this moment.";
          return;
        }

        const src = safeUrl(music.src);
        if (!src) {
          if ($("musicStatus")) $("musicStatus").textContent = "Soundtrack ready: " + (music.title || "Birthday Bloom");
          return;
        }

        try {
          if (!audio) {
            audio = new Audio(src);
            audio.addEventListener("error", () => {
              if ($("musicStatus")) $("musicStatus").textContent = "Soundtrack preview available.";
            });
          }
          if (audio.paused) {
            await audio.play();
            if ($("musicStatus")) $("musicStatus").textContent = `Playing: ${music.title || "Birthday Melody"}`;
          } else {
            audio.pause();
            if ($("musicStatus")) $("musicStatus").textContent = "Music paused.";
          }
        } catch(e) {
          if ($("musicStatus")) $("musicStatus").textContent = "Soundtrack ready to play.";
        }
      });
    }

    // Lightbox Controls
    if ($("lightboxClose")) $("lightboxClose").addEventListener("click", () => closeModal("lightbox"));
    if ($("previousPhoto")) $("previousPhoto").addEventListener("click", () => showPhoto(activePhoto - 1));
    if ($("nextPhoto")) $("nextPhoto").addEventListener("click", () => showPhoto(activePhoto + 1));

    // Share Handlers
    const shareText = () => `A special Birthday White Bloom moment for ${templateData.recipientName} ✨`;

    if ($("whatsappShare")) {
      $("whatsappShare").addEventListener("click", () => {
        const shareUrl = window.location.href;
        window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText()}\n${shareUrl}`)}`, "_blank", "noopener,noreferrer");
      });
    }

    if ($("copyShare")) {
      $("copyShare").addEventListener("click", async () => {
        const ok = await copyText(window.location.href);
        toast(ok ? "Moment link copied to clipboard ✨" : "Could not copy link.");
      });
    }

    if ($("qrShare")) {
      $("qrShare").addEventListener("click", () => {
        const shareUrl = window.location.href;
        if ($("qrUrl")) $("qrUrl").textContent = shareUrl;
        renderDynamicQR(shareUrl);
        openModal("qrModal");
      });
    }

    if ($("qrClose")) $("qrClose").addEventListener("click", () => closeModal("qrModal"));

    // Dismiss modals on backdrop click
    document.querySelectorAll(".modal").forEach(modal => {
      modal.addEventListener("click", event => {
        if (event.target === modal) closeModal(modal.id);
      });
    });

    window.addEventListener("popstate", () => {
      setStage(location.hash === "#experience" ? "experience" : "opening", { updateHash: false });
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        dismissIntro();
        document.querySelectorAll(".modal.open").forEach(modal => closeModal(modal.id));
      }
      if ($("lightbox") && $("lightbox").classList.contains("open") && actualPhotos.length > 1) {
        if (event.key === "ArrowLeft") showPhoto(activePhoto - 1);
        if (event.key === "ArrowRight") showPhoto(activePhoto + 1);
      }
    });
  }

  function renderTemplate() {
    renderHero();
    renderGallery();
    renderLetter();
    renderTimeline();
    updateCountdown();
    clearInterval(countdownTimer);
    countdownTimer = setInterval(updateCountdown, 1000);
  }

  // Public VanviMoments API for live updates from customizer / iframe
  window.VanviMomentsTemplate = {
    metadata: marketplaceMetadata,
    data: templateData,
    update: function(nextData = {}) {
      templateData = {
        ...templateData,
        ...nextData,
        theme: { ...templateData.theme, ...(nextData.theme || {}) },
        music: { ...templateData.music, ...(nextData.music || {}) }
      };
      this.data = templateData;
      renderTemplate();
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    loadInitialCustomization();
    renderTemplate();
    bindInteractions();
    setStage(location.hash === "#experience" ? "experience" : "opening", { updateHash: false });
  });

})();

