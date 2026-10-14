/**
 * Vanvi Moments — Bestie Friendship Live Builder Controller
 * 1. Cloudinary CDN Unsigned Image Upload Engine
 * 2. Razorpay ₹99 Payment Gateway Integration & Microsite Persistence
 * 3. Mobile Viewport (360px–414px) Responsive Toggle & Real-time postMessage Sync
 */

(function () {
  "use strict";

  // Cloudinary Configuration
  const CLOUDINARY_CLOUD_NAME = "ztholwuh";
  const CLOUDINARY_UPLOAD_PRESET = "vanvi_moments";
  const CLOUDINARY_FOLDER = "vanvi-moments/friendship";

  const iframe = document.getElementById("previewIframe");
  const previewBezel = document.getElementById("previewBezel");
  const toastHub = document.getElementById("toastHub");
  const workspace = document.querySelector(".builder-workspace");

  // =========================================================================
  // 1. TABS & BOTTOM STEP NAVIGATION (PREV / NEXT)
  // =========================================================================
  const tabButtons = Array.from(document.querySelectorAll(".tab-btn"));
  const tabPanels = Array.from(document.querySelectorAll(".tab-panel"));
  const btnPrev = document.getElementById("btnPrevStep");
  const btnNext = document.getElementById("btnNextStep");
  const stepNum = document.getElementById("stepIndicatorNumber");
  const stepTitle = document.getElementById("stepIndicatorTitle");

  let currentStepIndex = 0;

  function switchStep(index) {
    if (index < 0 || index >= tabButtons.length) return;
    currentStepIndex = index;

    tabButtons.forEach((b, i) => {
      b.classList.toggle("active", i === index);
    });
    tabPanels.forEach((p, i) => {
      p.classList.toggle("active", i === index);
    });

    // Update bottom footer
    if (btnPrev) btnPrev.disabled = index === 0;
    if (btnNext) {
      if (index === tabButtons.length - 1) {
        btnNext.innerText = "Finish & Pay ₹39 ✨";
        btnNext.classList.add("btn-step-finish");
      } else {
        btnNext.innerText = "Next Step →";
        btnNext.classList.remove("btn-step-finish");
      }
    }

    if (stepNum) stepNum.innerText = `Step ${index + 1} of ${tabButtons.length}`;
    if (stepTitle) stepTitle.innerText = tabButtons[index].innerText.replace(/[^a-zA-Z0-9\s]/g, "").trim();

    // Scroll active tab into view
    tabButtons[index].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }

  tabButtons.forEach((btn, idx) => {
    btn.addEventListener("click", () => switchStep(idx));
  });

  if (btnPrev) {
    btnPrev.addEventListener("click", () => {
      if (currentStepIndex > 0) switchStep(currentStepIndex - 1);
    });
  }

  if (btnNext) {
    btnNext.addEventListener("click", () => {
      if (currentStepIndex < tabButtons.length - 1) {
        switchStep(currentStepIndex + 1);
      } else {
        initiateRazorpayPayment();
      }
    });
  }

  // Sidebar Checkout Pay Button
  const btnSidebarPay = document.getElementById("btnSidebarPay");
  if (btnSidebarPay) {
    btnSidebarPay.addEventListener("click", initiateRazorpayPayment);
  }

  // =========================================================================
  // 2. DEVICE PREVIEW SWITCHER & MOBILE TOGGLE (360px–414px)
  // =========================================================================
  const devButtons = document.querySelectorAll(".dev-btn");
  devButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const view = btn.dataset.view;
      if (!view) return;
      devButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      if (previewBezel) {
        previewBezel.className = `preview-bezel ${view}-view`;
      }
    });
  });

  // Mobile View Toggles (Editor vs Live Preview)
  const mobBtnEditor = document.getElementById("mobBtnEditor");
  const mobBtnPreview = document.getElementById("mobBtnPreview");

  if (mobBtnEditor && mobBtnPreview && workspace) {
    mobBtnEditor.addEventListener("click", () => {
      mobBtnEditor.classList.add("active");
      mobBtnPreview.classList.remove("active");
      workspace.classList.remove("show-preview");
    });
    mobBtnPreview.addEventListener("click", () => {
      mobBtnPreview.classList.add("active");
      mobBtnEditor.classList.remove("active");
      workspace.classList.add("show-preview");
      syncToPreview();
    });
  }

  // =========================================================================
  // 3. CLOUDINARY DIRECT UNSIGNED IMAGE UPLOADS
  // =========================================================================
  const fileInputs = document.querySelectorAll(".image-file-input");
  fileInputs.forEach((input) => {
    input.addEventListener("change", async (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      const targetInputId = input.dataset.target;
      const thumbId = input.dataset.thumb;
      const textInp = document.getElementById(targetInputId);
      const thumbImg = document.getElementById(thumbId);
      const labelEl = input.closest(".image-picker-btn");
      const originalLabel = labelEl ? labelEl.innerHTML : "";

      // 1. Immediate Instant Local Preview (Zero Latency)
      const reader = new FileReader();
      reader.onload = function (event) {
        const localPreviewUrl = event.target.result;
        if (thumbImg) thumbImg.src = localPreviewUrl;
        if (textInp) textInp.value = localPreviewUrl;
        syncToPreview();
      };
      reader.readAsDataURL(file);

      // Indicate Upload in Progress
      if (labelEl) {
        labelEl.innerHTML = `☁️ Uploading to CDN... <input type="file" class="image-file-input" style="display:none">`;
      }
      showToast("☁️ Uploading photo to Cloudinary CDN...");

      // 2. Direct Unsigned Upload to Cloudinary API
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
        formData.append("folder", CLOUDINARY_FOLDER);

        const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
        
        let cdnUrl = "";
        try {
          const response = await fetch(uploadUrl, {
            method: "POST",
            body: formData
          });

          if (response.ok) {
            const data = await response.json();
            if (data && data.secure_url) {
              cdnUrl = data.secure_url;
            }
          }
        } catch (fetchErr) {
          console.warn("[Cloudinary Direct Warning] Falling back to backend relay:", fetchErr);
        }

        // Fallback: If direct endpoint was blocked, relay via backend /api/upload
        if (!cdnUrl) {
          const base64Data = await fileToBase64(file);
          const relayRes = await fetch("/api/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              file: base64Data,
              originalName: file.name,
              mimeType: file.type,
              templateId: "bestie-friendship"
            })
          });
          if (relayRes.ok) {
            const relayData = await relayRes.json();
            cdnUrl = relayData.url || "";
          }
        }

        // 3. Replace Base64 URL with Permanent Cloudinary HTTPS CDN URL
        if (cdnUrl) {
          if (textInp) textInp.value = cdnUrl;
          if (thumbImg) thumbImg.src = cdnUrl;
          syncToPreview();
          showToast("✨ Photo successfully hosted on Cloudinary CDN!");
        } else {
          showToast("⚠️ CDN upload failed; local preview retained.");
        }
      } catch (err) {
        console.error("Cloudinary upload error:", err);
        showToast("⚠️ Could not upload image to CDN.");
      } finally {
        if (labelEl) {
          labelEl.innerHTML = originalLabel;
          // Re-bind current input if replaced
          const newInp = labelEl.querySelector(".image-file-input");
          if (newInp) {
            newInp.dataset.target = targetInputId;
            newInp.dataset.thumb = thumbId;
          }
        }
      }
    });
  });

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = reject;
      r.readAsDataURL(file);
    });
  }

  // =========================================================================
  // 4. READ FORM DATA & REALTIME SYNC (WITHOUT PAGE RELOAD)
  // =========================================================================
  function getFormData() {
    const safeVal = (id, fallback = "") => {
      const el = document.getElementById(id);
      return el && typeof el.value === "string" ? el.value.trim() : fallback;
    };

    return {
      theme: safeVal("inpThemeSelect", "sunshine"),
      transitionStyle: safeVal("inpTransitionSelect", "fade-slide"),
      friendName: safeVal("inpFriendName", "my best friend"),
      introForLabel: safeVal("inpStickyLabel", "For My Person :)"),
      introTitle: safeVal("inpIntroTitle", "Hey You!"),
      introSubtitle: safeVal("inpIntroSubtitle", "I made a little something\njust for you..."),
      introBalloonTitle: safeVal("inpBalloonTitle", "Happy Friendship Day"),
      heroEyebrow: safeVal("inpHeroEyebrow", "happy friendship day"),
      heroHeadline: safeVal("inpHeroHeadline", "To My Favourite Person"),
      heroMessage: safeVal("inpHeroMessage", "Every year this day comes around and I think the same thing: I got so lucky with you."),
      heroPortraitUrl: safeVal("inpHeroPortrait", "https://cdn.cutiepage.in/template-seeds/girlfriends-day/gallery1.jpeg"),
      statCalls: safeVal("inpStatCalls", "3,420+"),
      statMemes: safeVal("inpStatMemes", "12.5k"),
      statSnacks: safeVal("inpStatSnacks", "∞"),
      statLoyalty: safeVal("inpStatLoyalty", "100%"),
      songTitle: safeVal("inpSongTitle", "Our Song"),
      songArtist: safeVal("inpSongArtist", "the one that's ours"),
      songUrl: safeVal("inpSongUrl", "https://cdn.cutiepage.in/template-seeds/girlfriends-day/music.mp3"),
      galleryPhoto1Url: safeVal("inpPhoto1Url", "https://cdn.cutiepage.in/template-seeds/girlfriends-day/gallery1.jpeg"),
      galleryPhoto1Caption: safeVal("inpPhoto1Caption", "day one energy. we had no idea what was coming."),
      galleryPhoto2Url: safeVal("inpPhoto2Url", "https://cdn.cutiepage.in/template-seeds/girlfriends-day/gallery2.gif"),
      galleryPhoto2Caption: safeVal("inpPhoto2Caption", "still one of the funniest nights of my life."),
      galleryPhoto3Url: safeVal("inpPhoto3Url", "https://cdn.cutiepage.in/template-seeds/girlfriends-day/gallery3.jpeg"),
      galleryPhoto3Caption: safeVal("inpPhoto3Caption", "nothing happened this day. that was the best part."),
      scratchCard1Label: safeVal("inpScratch1Label", "you show up"),
      scratchCard1Body: safeVal("inpScratch1Body", "you notice something's off before I've said a word. that's the whole thing."),
      scratchCard2Label: safeVal("inpScratch2Label", "you're funny"),
      scratchCard2Body: safeVal("inpScratch2Body", "half my best memories are us doing nothing and laughing until it hurt."),
      scratchCard3Label: safeVal("inpScratch3Label", "you're stuck"),
      scratchCard3Body: safeVal("inpScratch3Body", "years in and you still pick up on the first ring. no exit option, sorry."),
      letterGreeting: safeVal("inpLetterSalutation", "Hey you,"),
      letterBody: safeVal("inpLetterBody", "I'm not great at saying this stuff out loud, so I made you a page instead."),
      letterSignature: safeVal("inpLetterSignature", "your friend")
    };
  }

  function syncToPreview() {
    const config = getFormData();
    try {
      localStorage.setItem("vanvi_friendship_config", JSON.stringify(config));
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({ type: "UPDATE_CONFIG", config }, "*");
      }
    } catch (e) {
      console.warn("Sync error:", e);
    }
  }

  const inputs = document.querySelectorAll(".form-input, .form-textarea, .form-select");
  inputs.forEach((inp) => {
    inp.addEventListener("input", syncToPreview);
    inp.addEventListener("change", syncToPreview);
  });

  // Action Buttons
  const btnCopyLink = document.getElementById("btnCopyLink");
  if (btnCopyLink) {
    btnCopyLink.addEventListener("click", () => {
      const liveUrl = window.location.href.replace("builder.html", "index.html");
      navigator.clipboard.writeText(liveUrl).then(() => {
        showToast("✨ Bestie Friendship link copied to clipboard!");
      }).catch(() => {
        showToast("Link: " + liveUrl);
      });
    });
  }

  const btnReset = document.getElementById("btnReset");
  if (btnReset) {
    btnReset.addEventListener("click", () => {
      if (confirm("Reset all customizations to standard template defaults?")) {
        localStorage.removeItem("vanvi_friendship_config");
        window.location.reload();
      }
    });
  }

  // =========================================================================
  // 5. RAZORPAY ₹99 PAYMENT GATEWAY & SHORT-LINK GENERATION
  // =========================================================================
  async function initiateRazorpayPayment() {
    const config = getFormData();
    showToast("Connecting to Razorpay Secure Gateway (₹39)... 🔒");

    let orderData = null;
    try {
      // 1. Create Order on Backend (amount: 3900 paise = ₹39 INR)
      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 3900,
          currency: "INR",
          receipt: "rcpt_friendship_" + Date.now(),
          notes: {
            template: "Best Friend 01",
            friendName: config.friendName
          }
        })
      });

      if (orderRes.ok) {
        orderData = await orderRes.json();
      }
    } catch (err) {
      console.warn("Backend order creation warning:", err);
    }

    // Default key fallback
    const keyId = (orderData && orderData.key_id) || "rzp_test_TlVNL5jlAkOovF";
    const orderId = (orderData && orderData.order_id) || "order_sim_" + Date.now();

    // 2. If Razorpay SDK is available, open checkout modal
    if (typeof Razorpay !== "undefined") {
      const options = {
        key: keyId,
        amount: 3900,
        currency: "INR",
        name: "Vanvi Moments",
        description: `Bestfriend Day Page for ${config.friendName} (₹39 Unlock)`,
        image: "https://cdn.cutiepage.in/template-seeds/girlfriends-day/gallery1.jpeg",
        order_id: orderData ? orderData.order_id : undefined,
        prefill: {
          name: config.friendName || "Best Friend",
          email: "friend@vanvimoments.com",
          contact: "9999999999"
        },
        theme: {
          color: "#14907f"
        },
        handler: async function (response) {
          await handlePaymentSuccess(response.razorpay_payment_id || ("pay_" + Date.now()), orderId);
        },
        modal: {
          ondismiss: function () {
            showToast("Payment canceled. Customization is saved in your browser.");
          }
        }
      };

      try {
        const rzp = new Razorpay(options);
        rzp.on("payment.failed", function (resp) {
          alert("Payment failed: " + (resp.error ? resp.error.description : "Unknown error"));
        });
        rzp.open();
        return;
      } catch (e) {
        console.warn("Razorpay instance init error, falling back to simulated completion:", e);
      }
    }

    // Simulation / offline fallback when gateway modal not supported in environment
    const proceedSim = confirm("⚡ Razorpay Gateway Ready (₹39 INR).\n\nDo you want to confirm the payment of ₹39 and generate the permanent shortlink?");
    if (proceedSim) {
      await handlePaymentSuccess("pay_sim_" + Date.now(), orderId);
    }
  }

  async function handlePaymentSuccess(paymentId, orderId) {
    const config = getFormData();
    showToast("💾 Saving microsite to Supabase database...");

    try {
      const saveRes = await fetch("/api/friendship/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payment_id: paymentId,
          order_id: orderId,
          config: config,
          friendName: config.friendName
        })
      });

      const resData = await saveRes.json();
      if (resData && resData.success) {
        const shortUrl = resData.shortUrl || `https://vanvimoments.com/f/${resData.slug}`;
        const localUrl = resData.localUrl || `./index.html?f=${resData.slug}`;
        
        displayCelebrationModal({
          shortUrl,
          localUrl,
          slug: resData.slug,
          friendName: config.friendName,
          paymentId
        });
        showToast("🎉 Microsite published! Short-link: " + shortUrl);
      } else {
        throw new Error(resData.error || "Save returned unsuccessful");
      }
    } catch (err) {
      console.error("Save error:", err);
      // Fallback local slug
      const fallbackSlug = (config.friendName ? config.friendName.toLowerCase().replace(/[^a-z0-9]/g, "-") : "bestie") + "-" + Math.random().toString(36).substr(2, 5);
      const fallbackUrl = `https://vanvimoments.com/f/${fallbackSlug}`;
      displayCelebrationModal({
        shortUrl: fallbackUrl,
        localUrl: `./index.html?f=${fallbackSlug}`,
        slug: fallbackSlug,
        friendName: config.friendName,
        paymentId
      });
    }
  }

  function displayCelebrationModal({ shortUrl, localUrl, slug, friendName, paymentId }) {
    const modal = document.getElementById("celebrationModal");
    const input = document.getElementById("celebrationShortlinkInput");
    const liveBtn = document.getElementById("celebrationLiveBtn");
    const waBtn = document.getElementById("celebrationWaBtn");

    if (input) input.value = shortUrl;
    if (liveBtn) liveBtn.href = localUrl;
    if (waBtn) {
      const msg = encodeURIComponent(`🎈 Hey ${friendName || "Bestie"}! I made a personalized Friendship keepsake page just for you on Vanvi Moments! Look here: ${shortUrl}`);
      waBtn.href = `https://api.whatsapp.com/send?text=${msg}`;
    }

    if (modal) {
      modal.style.display = "flex";
    }
  }

  // Celebration modal close & copy actions
  const btnCloseCelebration = document.getElementById("btnCloseCelebration");
  if (btnCloseCelebration) {
    btnCloseCelebration.addEventListener("click", () => {
      const modal = document.getElementById("celebrationModal");
      if (modal) modal.style.display = "none";
    });
  }

  const btnCopyShortlink = document.getElementById("btnCopyShortlink");
  if (btnCopyShortlink) {
    btnCopyShortlink.addEventListener("click", () => {
      const input = document.getElementById("celebrationShortlinkInput");
      if (input) {
        input.select();
        navigator.clipboard.writeText(input.value).then(() => {
          showToast("📋 Short-link copied to clipboard!");
        });
      }
    });
  }

  // Toast Pill Helper
  function showToast(msg) {
    if (!toastHub) return;
    const toast = document.createElement("div");
    toast.className = "toast-pill";
    toast.innerText = msg;
    toastHub.appendChild(toast);
    setTimeout(() => {
      toast.style.transition = "opacity 0.3s ease";
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  window.addEventListener("load", () => {
    switchStep(0);
    setTimeout(syncToPreview, 500);
  });

})();
