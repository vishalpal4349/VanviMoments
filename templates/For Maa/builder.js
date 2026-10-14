/**
 * =====================================================================
 * VANVI MOMENTS — FOR MAA STUDIO CONTROLLER
 * Real-time PostMessage Sync, 10 Emotional Palettes, Photo Upload & 100% Free Publish
 * =====================================================================
 */

(function () {
  'use strict';

  // Config State
  const config = {
    brand: "Vanvi Moments",
    to: "Maa",
    from: "Your child",
    theme: "haldi",
    never: "Thank you. Out loud, properly, once.",
    note: "You never once asked me to notice. I noticed anyway.",
    said: [
      "Have you eaten?",
      "Take a jacket, it gets cold.",
      "Do you need money?",
      "I'm fine, don't worry about me.",
      "Call when you reach."
    ],
    meant: [
      "She was never asking about food. She was asking if I was okay.",
      "She had already checked the weather for a city she doesn't live in.",
      "She'd worked out my rent was due before I had.",
      "This was never true. Not once.",
      "She stayed awake until I did. Every single time."
    ],
    photo: null,
    isPublished: false
  };

  const previewFrame = document.getElementById("previewFrame");
  const deviceBezel = document.getElementById("deviceBezel");

  // Sync to Live Iframe
  function syncToPreview() {
    if (!previewFrame || !previewFrame.contentWindow) return;
    previewFrame.contentWindow.postMessage({
      type: "vault-live",
      payload: { ...config }
    }, "*");
    previewFrame.contentWindow.postMessage({
      type: "VANVI_CONFIG_UPDATE",
      config: { ...config }
    }, "*");
  }

  // Initialize Input Form Listeners
  function initForm() {
    const inpTo = document.getElementById("inp_to");
    const inpFrom = document.getElementById("inp_from");
    const inpNever = document.getElementById("inp_never");
    const inpNote = document.getElementById("inp_note");

    if (inpTo) {
      inpTo.addEventListener("input", e => {
        config.to = e.target.value.trim() || "Maa";
        syncToPreview();
      });
    }

    if (inpFrom) {
      inpFrom.addEventListener("input", e => {
        config.from = e.target.value.trim() || "Your child";
        syncToPreview();
      });
    }

    if (inpNever) {
      inpNever.addEventListener("input", e => {
        config.never = e.target.value.trim();
        syncToPreview();
      });
    }

    if (inpNote) {
      inpNote.addEventListener("input", e => {
        config.note = e.target.value.trim();
        syncToPreview();
      });
    }

    // 5 Phrases
    for (let i = 0; i < 5; i++) {
      const sInp = document.getElementById(`inp_said_${i}`);
      const mInp = document.getElementById(`inp_meant_${i}`);

      if (sInp) {
        sInp.addEventListener("input", e => {
          config.said[i] = e.target.value.trim();
          syncToPreview();
        });
      }
      if (mInp) {
        mInp.addEventListener("input", e => {
          config.meant[i] = e.target.value.trim();
          syncToPreview();
        });
      }
    }

    if (previewFrame) {
      previewFrame.addEventListener("load", syncToPreview);
    }
  }

  // 10 Theme Switcher
  function initThemeSwitcher() {
    const swatches = document.querySelectorAll(".theme-swatch-card");
    const dockBadge = document.getElementById("dockThemeBadge");

    swatches.forEach(btn => {
      btn.addEventListener("click", () => {
        swatches.forEach(s => s.classList.remove("active"));
        btn.classList.add("active");
        const theme = btn.getAttribute("data-theme");
        config.theme = theme;
        document.body.setAttribute("data-theme", theme);
        if (dockBadge) {
          dockBadge.textContent = theme.charAt(0).toUpperCase() + theme.slice(1);
        }
        syncToPreview();
      });
    });
  }

  // Photo Upload Handler
  function initPhotoUploader() {
    const fileInput = document.getElementById("inp_photo_file");
    const avatarThumb = document.getElementById("avatarThumb");
    const avatarPlaceholder = document.getElementById("avatarPlaceholder");
    const btnRemove = document.getElementById("btnRemovePhoto");

    if (!fileInput) return;

    fileInput.addEventListener("change", e => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function (evt) {
        const b64 = evt.target.result;
        config.photo = b64;
        if (avatarThumb) {
          avatarThumb.src = b64;
          avatarThumb.style.display = "block";
        }
        if (avatarPlaceholder) avatarPlaceholder.style.display = "none";
        if (btnRemove) btnRemove.style.display = "inline-block";
        const btnTxt = document.getElementById("uploadBtnText");
        if (btnTxt) btnTxt.textContent = "Change Photo";
        syncToPreview();
      };
      reader.readAsDataURL(file);
    });

    if (btnRemove) {
      btnRemove.addEventListener("click", () => {
        config.photo = null;
        fileInput.value = "";
        if (avatarThumb) {
          avatarThumb.src = "";
          avatarThumb.style.display = "none";
        }
        if (avatarPlaceholder) avatarPlaceholder.style.display = "block";
        btnRemove.style.display = "none";
        const btnTxt = document.getElementById("uploadBtnText");
        if (btnTxt) btnTxt.textContent = "Upload Photo";
        syncToPreview();
      });
    }
  }

  // Section Quick Navigation
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

  // Mobile View Switcher (<= 920px)
  function initMobileSwitcher() {
    const btnEditor = document.getElementById("tabBtnEditor");
    const btnPreview = document.getElementById("tabBtnPreview");
    const dockPreviewBtn = document.getElementById("dockPreviewBtn");

    if (btnEditor && btnPreview) {
      btnEditor.addEventListener("click", () => {
        btnEditor.classList.add("active");
        btnPreview.classList.remove("active");
        document.body.classList.remove("show-preview-mode");
        if (dockPreviewBtn) {
          dockPreviewBtn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            <span>Preview</span>`;
        }
      });
      btnPreview.addEventListener("click", () => {
        btnPreview.classList.add("active");
        btnEditor.classList.remove("active");
        document.body.classList.add("show-preview-mode");
        if (dockPreviewBtn) {
          dockPreviewBtn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            <span>Edit</span>`;
        }
        syncToPreview();
      });
    }

    if (dockPreviewBtn && btnEditor && btnPreview) {
      dockPreviewBtn.addEventListener("click", () => {
        const isPreview = document.body.classList.contains("show-preview-mode");
        if (isPreview) {
          btnEditor.click();
        } else {
          btnPreview.click();
        }
      });
    }

    // Handle postMessage from preview iframe to return to edit tab
    window.addEventListener("message", e => {
      if (e && e.data && e.data.type === "VANVI_SWITCH_TO_EDIT") {
        if (btnEditor) btnEditor.click();
        const editorPane = document.querySelector(".studio-sidebar, .builder-sidebar, .editor-column");
        if (editorPane && typeof editorPane.scrollTo === "function") {
          editorPane.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    });
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
        btnPayNow.innerHTML = `<span>Generating Free Link...</span>`;

        setTimeout(() => {
          config.isPublished = true;
          localStorage.setItem("vanvi_for_maa_published", "true");
          syncToPreview();

          const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(config))));
          const publishedUrl = `${window.location.origin}${window.location.pathname.replace("builder.html", "index.html")}?published=true&data=${encoded}`;

          if (publishedLinkInput) publishedLinkInput.value = publishedUrl;
          if (successRecipientName) successRecipientName.textContent = config.to || "Maa";
          if (modalOpenLiveBtn) modalOpenLiveBtn.href = publishedUrl;

          if (modalWhatsappBtn) {
            modalWhatsappBtn.onclick = () => {
              const msg = encodeURIComponent(`Dearest ${config.to}, I made something special just for you. Open this on your phone: ${publishedUrl} ❤️`);
              window.open(`https://api.whatsapp.com/send?text=${msg}`, "_blank");
            };
          }

          stepCheckout.classList.add("hidden");
          stepSuccess.classList.remove("hidden");
          btnPayNow.disabled = false;
          btnPayNow.innerHTML = `
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span>Publish for Free & Get Link</span>`;
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
    initThemeSwitcher();
    initPhotoUploader();
    initSectionNav();
    initMobileSwitcher();
    initDeviceSwitcher();
    initPublishFlow();
  });

})();
