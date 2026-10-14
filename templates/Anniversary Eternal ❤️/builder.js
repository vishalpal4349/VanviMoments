/**
 * =====================================================================
 * VANVI MOMENTS — ETERNAL LOVE BUILDER CONTROLLER
 * Real-time PostMessage Sync, 6 Palette Switchers, File Upload & 100% Free Publish
 * =====================================================================
 */

(function () {
  'use strict';

  const config = {
    brand: "Vanvi Moments",
    to: "Anvi",
    from: "Anubhav",
    date: "2016-12-08",
    theme: "ivory",
    isPublished: false,
    headline: "To My *Favourite* Person",
    opening: "A little celebration of us.",
    firstCaption: "Where it all began ✦",
    heroPhoto: "./assets/images/where_it_began.jpg",
    letterGreeting: "My love,",
    letterBody: "If I could relive all the little moments that brought us here, I'd choose them again.\n\nThe laughs, the random conversations, the days that didn't go as planned, and all the moments when just having you around made everything better.\n\nThank you for being part of my life.\n\nThank you for the memories we've made, the things we've learned, and the little ways we've grown together.\n\n*You are still one of my favourite parts of every day.*\n\nHappy Anniversary, my love.\n\nHere's to everything we've been, everything we are, and all the beautiful little moments still waiting for us.",
    letterClosing: "With all my love, always",
    statement: "You. Me. Our little *forever.*",
    finaleMessage: "If I could make one wish for us, it would be for a thousand more ordinary days together.\n\nMore laughter.\nMore late-night conversations.\nMore little adventures.\nMore memories we haven't made yet.\n\nI'd love to keep writing this story with you.",
    finalLine: "Somehow, in this huge world, I found you.",
    finalMessage: "And I'd still choose you.",
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
    ]
  };

  const previewFrame = document.getElementById("previewFrame");
  const deviceBezel = document.getElementById("deviceBezel");

  function syncToPreview() {
    if (!previewFrame) return;
    const cw = previewFrame.contentWindow;
    if (cw && cw.postMessage) {
      cw.postMessage({
        type: "VANVI_CONFIG_UPDATE",
        config: config
      }, "*");
    }
  }

  function initForm() {
    // Basic text bindings
    const mapping = {
      inp_to: 'to',
      inp_from: 'from',
      inp_date: 'date',
      inp_headline: 'headline',
      inp_opening: 'opening',
      inp_firstCaption: 'firstCaption',
      inp_heroPhoto: 'heroPhoto',
      inp_letterGreeting: 'letterGreeting',
      inp_letterBody: 'letterBody',
      inp_letterClosing: 'letterClosing',
      inp_statement: 'statement',
      inp_finaleMessage: 'finaleMessage',
      inp_finalLine: 'finalLine',
      inp_finalMessage: 'finalMessage'
    };

    Object.entries(mapping).forEach(([elId, key]) => {
      const el = document.getElementById(elId);
      if (el) {
        el.value = config[key];
        el.addEventListener("input", e => {
          config[key] = e.target.value;
          syncToPreview();
        });
      }
    });

    // Milestones
    for (let i = 0; i < 3; i++) {
      const tEl = document.getElementById(`inp_ms${i}_title`);
      const xEl = document.getElementById(`inp_ms${i}_text`);
      if (tEl && xEl && config.milestones[i]) {
        tEl.value = config.milestones[i].title;
        xEl.value = config.milestones[i].text;
        tEl.addEventListener("input", e => {
          config.milestones[i].title = e.target.value;
          syncToPreview();
        });
        xEl.addEventListener("input", e => {
          config.milestones[i].text = e.target.value;
          syncToPreview();
        });
      }
    }

    // Polaroids
    for (let i = 0; i < 4; i++) {
      const uEl = document.getElementById(`inp_p${i}_url`);
      const tEl = document.getElementById(`inp_p${i}_title`);
      const cEl = document.getElementById(`inp_p${i}_caption`);
      if (config.photos[i]) {
        if (uEl) {
          uEl.value = config.photos[i].url;
          uEl.addEventListener("input", e => {
            config.photos[i].url = e.target.value;
            syncToPreview();
          });
        }
        if (tEl) {
          tEl.value = config.photos[i].title;
          tEl.addEventListener("input", e => {
            config.photos[i].title = e.target.value;
            syncToPreview();
          });
        }
        if (cEl) {
          cEl.value = config.photos[i].caption;
          cEl.addEventListener("input", e => {
            config.photos[i].caption = e.target.value;
            syncToPreview();
          });
        }
      }
    }

    // Reasons (one per line)
    const rEl = document.getElementById("inp_reasons");
    if (rEl) {
      rEl.value = config.reasons.join("\n");
      rEl.addEventListener("input", e => {
        config.reasons = e.target.value.split("\n").map(l => l.trim()).filter(Boolean);
        syncToPreview();
      });
    }

    if (previewFrame) {
      previewFrame.addEventListener("load", syncToPreview);
    }
  }

  // 6 Themes Switcher
  function initPaletteSwitcher() {
    const swatches = document.querySelectorAll(".theme-swatch-card");
    swatches.forEach(btn => {
      btn.addEventListener("click", () => {
        swatches.forEach(s => s.classList.remove("active"));
        btn.classList.add("active");
        config.theme = btn.getAttribute("data-theme");
        syncToPreview();
      });
    });
  }

  // File Upload Handlers (FileReader to Base64)
  function initImageUploaders() {
    const fileInputs = document.querySelectorAll(".hidden-file-input");
    fileInputs.forEach(fileInput => {
      fileInput.addEventListener("change", e => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        const targetId = fileInput.getAttribute("data-target");
        const thumbId = fileInput.getAttribute("data-thumb");
        const targetInput = document.getElementById(targetId);
        const thumbImg = document.getElementById(thumbId);

        const reader = new FileReader();
        reader.onload = function (evt) {
          const b64 = evt.target.result;
          if (thumbImg) thumbImg.src = b64;
          if (targetInput) targetInput.value = b64;

          if (targetId === "inp_heroPhoto") {
            config.heroPhoto = b64;
          } else if (targetId.startsWith("inp_p")) {
            const idx = parseInt(targetId.replace("inp_p", "").replace("_url", ""), 10);
            if (config.photos[idx]) config.photos[idx].url = b64;
          }
          syncToPreview();
        };
        reader.readAsDataURL(file);
      });
    });
  }

  // Section quick nav
  function initSectionNav() {
    document.querySelectorAll(".pill-nav-item").forEach(pill => {
      pill.addEventListener("click", () => {
        document.querySelectorAll(".pill-nav-item").forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        const sec = document.getElementById(pill.getAttribute("data-section"));
        if (sec) sec.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  // Mobile View Switcher
  function initMobileSwitcher() {
    const btnEditor = document.getElementById("tabBtnEditor");
    const btnPreview = document.getElementById("tabBtnPreview");
    if (btnEditor && btnPreview) {
      btnEditor.addEventListener("click", () => {
        btnEditor.classList.add("active");
        btnPreview.classList.remove("active");
        document.body.classList.remove("show-preview-mode");
      });
      btnPreview.addEventListener("click", () => {
        btnPreview.classList.add("active");
        btnEditor.classList.remove("active");
        document.body.classList.add("show-preview-mode");
        syncToPreview();
      });
    }
  }

  // Desktop Simulator Switcher
  function initDeviceSwitcher() {
    document.querySelectorAll(".device-pill").forEach(pill => {
      pill.addEventListener("click", e => {
        document.querySelectorAll(".device-pill").forEach(p => p.classList.remove("active"));
        e.currentTarget.classList.add("active");
        const dev = e.currentTarget.getAttribute("data-device");
        if (deviceBezel) {
          deviceBezel.className = "device-bezel";
          if (dev === "mobile") deviceBezel.classList.add("mobile-view");
          else if (dev === "tablet") deviceBezel.classList.add("tablet-view");
          else deviceBezel.classList.add("desktop-view");
        }
      });
    });
  }

  // Free Publish Modal Flow
  function initPublishFlow() {
    const modal = document.getElementById("publishModal");
    const btnClose = document.getElementById("modalCloseBtn");
    const stepCheckout = document.getElementById("modalStepCheckout");
    const stepSuccess = document.getElementById("modalStepSuccess");
    const btnPayNow = document.getElementById("btnPayNow");
    const publishedLinkInput = document.getElementById("publishedLinkInput");
    const copyUrlBtn = document.getElementById("copyUrlBtn");
    const modalWhatsappBtn = document.getElementById("modalWhatsappBtn");
    const modalOpenLiveBtn = document.getElementById("modalOpenLiveBtn");
    const successRecipientName = document.getElementById("successRecipientName");

    const triggers = [
      document.getElementById("headerPublishBtn"),
      document.getElementById("sidebarPublishBtn"),
      document.getElementById("mobileDockPublishBtn")
    ];

    function openModal() {
      if (modal) {
        stepCheckout.classList.remove("hidden");
        stepSuccess.classList.add("hidden");
        modal.classList.add("active");
      }
    }
    function closeModal() {
      if (modal) modal.classList.remove("active");
    }

    triggers.forEach(t => { if (t) t.addEventListener("click", openModal); });
    if (btnClose) btnClose.addEventListener("click", closeModal);
    if (modal) modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });

    if (btnPayNow) {
      btnPayNow.addEventListener("click", () => {
        btnPayNow.disabled = true;
        btnPayNow.innerHTML = `<span>Generating Your Free Link...</span>`;

        setTimeout(() => {
          config.isPublished = true;
          localStorage.setItem("vanvi_eternal_love_published", "true");
          syncToPreview();

          const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(config))));
          const publishedUrl = `${window.location.origin}${window.location.pathname.replace("builder.html", "index.html")}?published=true&data=${encoded}`;

          if (publishedLinkInput) publishedLinkInput.value = publishedUrl;
          if (successRecipientName) successRecipientName.textContent = config.to || "your love";
          if (modalOpenLiveBtn) modalOpenLiveBtn.href = publishedUrl;

          if (modalWhatsappBtn) {
            modalWhatsappBtn.onclick = () => {
              const msg = encodeURIComponent(`Happy Anniversary ${config.to}! I made this eternal love story website just for you: ${publishedUrl} 🥂✨`);
              window.open(`https://api.whatsapp.com/send?text=${msg}`, "_blank");
            };
          }

          stepCheckout.classList.add("hidden");
          stepSuccess.classList.remove("hidden");
          btnPayNow.disabled = false;
          btnPayNow.innerHTML = `<span>Publish for Free & Get Link</span>`;
        }, 500);
      });
    }

    if (copyUrlBtn && publishedLinkInput) {
      copyUrlBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(publishedLinkInput.value).then(() => {
          copyUrlBtn.textContent = "Copied! ✨";
          setTimeout(() => { copyUrlBtn.textContent = "Copy"; }, 2000);
        });
      });
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    initForm();
    initPaletteSwitcher();
    initImageUploaders();
    initSectionNav();
    initMobileSwitcher();
    initDeviceSwitcher();
    initPublishFlow();
  });

})();
