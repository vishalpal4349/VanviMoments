/**
 * Vanvi Moments — Bestie Friendship Interactive Engine
 * Hot-Air Balloon Curtain, Audio Player, 3D Polaroid Flip, HTML5 Canvas Scratch Reveal,
 * Pinky Promises lock, Confetti, Transition animations, and Builder sync
 */

(function () {
  "use strict";

  // Default initial configuration
  const defaultConfig = {
    theme: "sunshine",
    transitionStyle: "fade-slide",
    friendName: "my best friend",
    introForLabel: "For My Person :)",
    introTitle: "Hey You!",
    introSubtitle: "I made a little something\njust for you...",
    introNoteLine: "happy friendship day ✿",
    introBalloonTitle: "Happy Friendship Day",
    introDeliveryLabel: "a delivery for you…",
    introStampLabel: "happy friendship day",
    introMascotUrl: "https://cdn.cutiepage.in/template-seeds/brothers-day/cat.gif",
    introHint: "TAP ANYWHERE TO BEGIN",
    heroEyebrow: "happy friendship day",
    heroHeadline: "To My Favourite Person",
    heroMessage: "Every year this day comes around and I think the same thing: I got so lucky with you. So instead of a text this time, I built you a tiny corner of the internet. Stay a while, there's a bit to see.",
    heroPortraitUrl: "https://cdn.cutiepage.in/template-seeds/girlfriends-day/gallery1.jpeg",
    heroBannerLabel: "to the best one ✿",
    heroButton: "see our wrapped →",
    statCalls: "3,420+",
    statMemes: "12.5k",
    statSnacks: "∞",
    statLoyalty: "100%",
    greetingPhoto1Url: "https://cdn.cutiepage.in/template-seeds/girlfriends-day/greeting1.gif",
    greetingPhoto2Url: "https://cdn.cutiepage.in/template-seeds/girlfriends-day/greeting2.gif",
    greetingPhoto3Url: "https://cdn.cutiepage.in/template-seeds/girlfriends-day/greeting3.jpeg",
    songTitle: "Our Song",
    songArtist: "the one that's ours",
    songCaption: "press play — this one is permanently attached to memories of you.",
    songCoverUrl: "https://cdn.cutiepage.in/template-seeds/girlfriends-day/gallery2.gif",
    songUrl: "https://cdn.cutiepage.in/template-seeds/girlfriends-day/music.mp3",
    galleryEyebrow: "the memory wall",
    galleryTitle: "flip one over",
    gallerySubtitle: "every photo has something written on the back ✿",
    galleryButton: "lock our pinky promises →",
    galleryPhoto1Url: "https://cdn.cutiepage.in/template-seeds/girlfriends-day/gallery1.jpeg",
    galleryPhoto1Caption: "day one energy. we had no idea what was coming.",
    galleryPhoto2Url: "https://cdn.cutiepage.in/template-seeds/girlfriends-day/gallery2.gif",
    galleryPhoto2Caption: "still one of the funniest nights of my life.",
    galleryPhoto3Url: "https://cdn.cutiepage.in/template-seeds/girlfriends-day/gallery3.jpeg",
    galleryPhoto3Caption: "nothing happened this day. that was the best part.",
    galleryPhoto4Url: "https://cdn.cutiepage.in/template-seeds/girlfriends-day/letter1.jpeg",
    galleryPhoto4Caption: "the trip we planned badly and loved anyway.",
    galleryPhoto5Url: "https://cdn.cutiepage.in/template-seeds/girlfriends-day/letter2.jpeg",
    galleryPhoto5Caption: "3am, terrible snacks, best conversation.",
    galleryPhoto6Url: "https://cdn.cutiepage.in/template-seeds/girlfriends-day/letter3.jpeg",
    galleryPhoto6Caption: "proof we clean up alright when we try.",
    scratchEyebrow: "six little truths",
    scratchTitle: "scratch these open",
    scratchSubtitle: "rub each one — there's something under it ✿",
    scratchButton: "view our certificate →",
    scratchCard1Label: "you show up",
    scratchCard1Body: "you notice something's off before I've said a word. that's the whole thing.",
    scratchCard2Label: "you're funny",
    scratchCard2Body: "half my best memories are us doing nothing and laughing until it hurt.",
    scratchCard3Label: "you're stuck",
    scratchCard3Body: "years in and you still pick up on the first ring. no exit option, sorry.",
    scratchCard4Label: "you're honest",
    scratchCard4Body: "you tell me the thing I don't want to hear, kindly. I always need it.",
    scratchCard5Label: "you remember",
    scratchCard5Body: "the small stuff — the worry from a Tuesday, the name I mentioned once.",
    scratchCard6Label: "you're home",
    scratchCard6Body: "no catching up needed. we just pick it back up exactly where we left it.",
    letterEyebrow: "✿ one last thing ✿",
    letterTitle: "A Note For You",
    letterMascotUrl: "https://cdn.cutiepage.in/template-seeds/brothers-day/cat.gif",
    letterPhoto1Url: "https://cdn.cutiepage.in/template-seeds/girlfriends-day/letter1.jpeg",
    letterPhoto2Url: "https://cdn.cutiepage.in/template-seeds/girlfriends-day/letter2.jpeg",
    letterPhoto3Url: "https://cdn.cutiepage.in/template-seeds/girlfriends-day/letter3.jpeg",
    letterGreeting: "Hey you,",
    letterBody: "I'm not great at saying this stuff out loud, so I made you a page instead — a song, our photos, and a few things I actually mean.\n\nthank you for the years of picking up the phone, for the advice I didn't ask for and definitely needed, and for never once making me explain myself twice. you've seen every version of me and stayed for all of them.\n\nI hope today is a good one. and I hope you know that whatever happens next, you've got a person in your corner permanently. that's me. I'm the person.",
    letterClosing: "always in your corner,",
    letterSignature: "your friend",
    letterFromPrefix: "made with love by",
    fromName: "me",
    letterRestartButton: "↻ play it again"
  };

  let activeConfig = Object.assign({}, defaultConfig);

  // Load from localStorage if present
  try {
    const saved = localStorage.getItem("vanvi_friendship_config");
    if (saved) {
      activeConfig = Object.assign({}, defaultConfig, JSON.parse(saved));
    }
  } catch (e) {
    console.warn("Storage access limited:", e);
  }

  // Audio Object
  let bgAudio = null;
  let isPlaying = false;

  // =========================================================================
  // 1. APPLY CONFIG TO DOM
  // =========================================================================
  function applyConfig(cfg) {
    activeConfig = Object.assign({}, activeConfig, cfg);

    // Apply Theme & Transitions
    const rootEl = document.documentElement;
    if (cfg.theme) {
      rootEl.setAttribute("data-theme", cfg.theme);
    }
    if (cfg.transitionStyle) {
      document.body.setAttribute("data-transition", cfg.transitionStyle);
    }

    // Intro Curtain
    safeSetText("introFriendName", cfg.friendName);
    safeSetText("introStickyLabel", cfg.introForLabel);
    safeSetText("introBigTitle", cfg.introTitle);
    safeSetText("introCardMsg", cfg.introSubtitle);
    safeSetText("introNotePill", cfg.introNoteLine);
    safeSetText("balloonBadgeText", cfg.introBalloonTitle);
    safeSetText("envelopeSubline", cfg.introDeliveryLabel);
    safeSetText("envelopeStampText", cfg.introStampLabel);
    safeSetText("introTapBtnText", cfg.introHint);

    // Hero Section
    safeSetText("heroEyebrow", cfg.heroEyebrow);
    safeSetText("heroTitle", cfg.heroHeadline);
    safeSetText("heroBody", cfg.heroMessage);
    safeSetSrc("heroPortrait", cfg.heroPortraitUrl);
    safeSetText("heroBannerTag", cfg.heroBannerLabel);
    safeSetText("heroCtaBtn", cfg.heroButton);

    safeSetSrc("greetingPhoto1", cfg.greetingPhoto1Url);
    safeSetSrc("greetingPhoto2", cfg.greetingPhoto2Url);
    safeSetSrc("greetingPhoto3", cfg.greetingPhoto3Url);

    // Wrapped Stats
    safeSetText("statCalls", cfg.statCalls);
    safeSetText("statMemes", cfg.statMemes);
    safeSetText("statSnacks", cfg.statSnacks);
    safeSetText("statLoyalty", cfg.statLoyalty);

    // Song Player
    safeSetText("audioTitle", cfg.songTitle);
    safeSetText("audioSubtitle", cfg.songArtist);

    if (cfg.songUrl && (!bgAudio || bgAudio.src !== cfg.songUrl)) {
      if (bgAudio) {
        bgAudio.pause();
      }
      bgAudio = new Audio(cfg.songUrl);
      bgAudio.loop = true;
    }

    // Memory Wall
    safeSetText("galleryEyebrow", cfg.galleryEyebrow);
    safeSetText("galleryTitle", cfg.galleryTitle);
    safeSetText("gallerySubtitle", cfg.gallerySubtitle);
    safeSetText("galleryButtonText", cfg.galleryButton);

    for (let i = 1; i <= 6; i++) {
      safeSetSrc(`galleryPhoto${i}`, cfg[`galleryPhoto${i}Url`]);
      safeSetText(`galleryCaption${i}`, cfg[`galleryPhoto${i}Caption`]);
    }

    // Scratch Cards
    safeSetText("scratchEyebrow", cfg.scratchEyebrow);
    safeSetText("scratchTitle", cfg.scratchTitle);
    safeSetText("scratchSubtitle", cfg.scratchSubtitle);
    safeSetText("scratchButtonText", cfg.scratchButton);

    for (let i = 1; i <= 6; i++) {
      safeSetText(`scratchLabel${i}`, cfg[`scratchCard${i}Label`]);
      safeSetText(`scratchBody${i}`, cfg[`scratchCard${i}Body`]);
    }

    // Certificate
    safeSetText("certRecipient", cfg.friendName);

    // Letter
    safeSetText("letterEyebrow", cfg.letterEyebrow);
    safeSetText("letterTitle", cfg.letterTitle);
    safeSetSrc("letterMascot", cfg.letterMascotUrl);
    safeSetSrc("letterPhoto1", cfg.letterPhoto1Url);
    safeSetSrc("letterPhoto2", cfg.letterPhoto2Url);
    safeSetSrc("letterPhoto3", cfg.letterPhoto3Url);
    safeSetText("letterSalutation", cfg.letterGreeting);
    safeSetText("letterBody", cfg.letterBody);
    safeSetText("letterClosing", cfg.letterClosing);
    safeSetText("letterSignature", cfg.letterSignature);
    safeSetText("letterRestartBtn", cfg.letterRestartButton);
    safeSetText("footerSignoff", `${cfg.letterFromPrefix} ${cfg.fromName}`);

    // Update WhatsApp Share Link
    updateShareLinks();
  }

  function safeSetText(id, val) {
    const el = document.getElementById(id);
    if (el && val !== undefined) el.innerText = val;
  }

  function safeSetSrc(id, val) {
    const el = document.getElementById(id);
    if (el && val) el.src = val;
  }

  // =========================================================================
  // 2. CURTAIN & BALLOON REVEAL
  // =========================================================================
  const curtain = document.getElementById("introCurtain");
  if (curtain) {
    curtain.addEventListener("click", () => {
      curtain.classList.add("revealed");
      startAudio();
      triggerConfetti();
    });
  }

  const replayBtn = document.getElementById("letterRestartBtn");
  if (replayBtn) {
    replayBtn.addEventListener("click", () => {
      if (curtain) {
        curtain.classList.remove("revealed");
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // =========================================================================
  // 3. AUDIO CONTROLLER
  // =========================================================================
  const audioDock = document.getElementById("audioDock");
  function toggleAudio() {
    if (!bgAudio) {
      bgAudio = new Audio(activeConfig.songUrl);
      bgAudio.loop = true;
    }
    if (isPlaying) {
      bgAudio.pause();
      isPlaying = false;
      if (audioDock) audioDock.classList.remove("playing");
    } else {
      bgAudio.play().then(() => {
        isPlaying = true;
        if (audioDock) audioDock.classList.add("playing");
      }).catch(err => {
        console.warn("Autoplay blocked:", err);
      });
    }
  }

  function startAudio() {
    if (!isPlaying && bgAudio) {
      bgAudio.play().then(() => {
        isPlaying = true;
        if (audioDock) audioDock.classList.add("playing");
      }).catch(e => console.log("Audio play gesture required"));
    }
  }

  if (audioDock) {
    audioDock.addEventListener("click", toggleAudio);
  }

  // =========================================================================
  // 4. MEMORY WALL POLAROID FLIP
  // =========================================================================
  const polaroids = document.querySelectorAll(".polaroid-card");
  polaroids.forEach((card) => {
    card.addEventListener("click", () => {
      card.classList.toggle("flipped");
    });
  });

  // =========================================================================
  // 5. PINKY PROMISES INTERACTION
  // =========================================================================
  const promiseCards = document.querySelectorAll(".promise-card");
  promiseCards.forEach((card) => {
    card.addEventListener("click", () => {
      card.classList.toggle("locked-in");
      triggerConfetti(card.getBoundingClientRect());
    });
  });

  // 39 INR Payment Button
  const payBtn = document.getElementById("btnUnlockPayment");
  if (payBtn) {
    payBtn.addEventListener("click", () => {
      triggerConfetti(payBtn.getBoundingClientRect());
      alert("Redirecting to Razorpay / Cashfree Secure Checkout for ₹39... ✨");
    });
  }

  // =========================================================================
  // 6. REALTIME CANVAS SCRATCH ENGINE
  // =========================================================================
  function initScratchCards() {
    const scratchCards = document.querySelectorAll(".scratch-card");
    scratchCards.forEach((card) => {
      const canvas = card.querySelector(".scratch-canvas");
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      let isDrawing = false;
      let scratchedPixels = 0;
      let isRevealed = false;

      function resize() {
        const rect = card.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        drawCover();
      }

      function drawCover() {
        const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        const theme = document.documentElement.getAttribute("data-theme") || "sunshine";

        if (theme === "twilight") {
          grad.addColorStop(0, "#2a3b4c");
          grad.addColorStop(0.5, "#3b4f63");
          grad.addColorStop(1, "#20303f");
        } else if (theme === "meadow") {
          grad.addColorStop(0, "#d8c4b2");
          grad.addColorStop(0.5, "#e8dcd2");
          grad.addColorStop(1, "#cbb49f");
        } else if (theme === "lilac") {
          grad.addColorStop(0, "#cfbde8");
          grad.addColorStop(0.5, "#ded2f2");
          grad.addColorStop(1, "#c0a8e0");
        } else {
          grad.addColorStop(0, "#c4ded9");
          grad.addColorStop(0.5, "#dff2ee");
          grad.addColorStop(1, "#b5d4ce");
        }

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
        for (let x = 10; x < canvas.width; x += 16) {
          for (let y = 10; y < canvas.height; y += 16) {
            ctx.beginPath();
            ctx.arc(x, y, 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        ctx.font = "bold 14px 'Plus Jakarta Sans', sans-serif";
        ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("✦ SCRATCH HERE ✦", canvas.width / 2, canvas.height / 2);
      }

      function scratch(e) {
        if (!isDrawing || isRevealed) return;
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const x = clientX - rect.x;
        const y = clientY - rect.y;

        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(x, y, 24, 0, Math.PI * 2);
        ctx.fill();

        checkPercentage();
      }

      function checkPercentage() {
        if (isRevealed) return;
        scratchedPixels++;
        if (scratchedPixels > 24) {
          try {
            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            let transparentCount = 0;
            const total = imgData.data.length / 4;
            for (let i = 3; i < imgData.data.length; i += 16) {
              if (imgData.data[i] === 0) transparentCount++;
            }
            const ratio = transparentCount / (total / 4);
            if (ratio > 0.4) {
              isRevealed = true;
              canvas.style.transition = "opacity 0.6s ease";
              canvas.style.opacity = "0";
              setTimeout(() => {
                canvas.style.display = "none";
              }, 600);
              triggerConfetti(canvas.getBoundingClientRect());
            }
          } catch (err) {}
          scratchedPixels = 0;
        }
      }

      canvas.addEventListener("mousedown", (e) => { isDrawing = true; scratch(e); });
      window.addEventListener("mouseup", () => { isDrawing = false; });
      canvas.addEventListener("mousemove", scratch);

      canvas.addEventListener("touchstart", (e) => { isDrawing = true; scratch(e); }, { passive: true });
      window.addEventListener("touchend", () => { isDrawing = false; });
      canvas.addEventListener("touchmove", scratch, { passive: true });

      resize();
      window.addEventListener("resize", resize);
    });
  }

  // =========================================================================
  // 7. CONFETTI EFFECT
  // =========================================================================
  function triggerConfetti(bounds) {
    const count = 35;
    const colors = ["#14907f", "#ef7a5a", "#ffd166", "#8b6ad0", "#ff4d6d"];
    const originX = bounds ? (bounds.left + bounds.width / 2) : window.innerWidth / 2;
    const originY = bounds ? (bounds.top + bounds.height / 2) : window.innerHeight / 2;

    for (let i = 0; i < count; i++) {
      const p = document.createElement("div");
      p.className = "confetti-particle";
      p.style.cssText = `
        position: fixed;
        width: ${Math.random() * 8 + 6}px;
        height: ${Math.random() * 8 + 6}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        left: ${originX}px;
        top: ${originY}px;
        border-radius: ${Math.random() > 0.5 ? "50%" : "2px"};
        pointer-events: none;
        z-index: 10000;
        transform: translate3d(0, 0, 0);
      `;
      document.body.appendChild(p);

      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 220 + 80;
      const dx = Math.cos(angle) * velocity;
      const dy = Math.sin(angle) * velocity - 100;

      p.animate([
        { transform: "translate(0, 0) scale(1) rotate(0deg)", opacity: 1 },
        { transform: `translate(${dx}px, ${dy + 350}px) scale(0.6) rotate(${Math.random() * 720}deg)`, opacity: 0 }
      ], {
        duration: 1200 + Math.random() * 600,
        easing: "cubic-bezier(0.25, 1, 0.5, 1)"
      }).onfinish = () => p.remove();
    }
  }

  // =========================================================================
  // 8. SHARE & WHATSAPP
  // =========================================================================
  function updateShareLinks() {
    const waBtn = document.getElementById("whatsappShareBtn");
    if (waBtn) {
      const currentUrl = window.location.href;
      const msg = encodeURIComponent(`🎈 Hey ${activeConfig.friendName}! I made a special Bestie Friendship page just for you on Vanvi Moments! Look here: ${currentUrl}`);
      waBtn.href = `https://api.whatsapp.com/send?text=${msg}`;
    }
  }

  // Theme switch button
  const themeSwitchBtn = document.getElementById("themeSwitchBtn");
  if (themeSwitchBtn) {
    const themes = ["sunshine", "meadow", "lilac", "twilight"];
    themeSwitchBtn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || "sunshine";
      const nextIdx = (themes.indexOf(current) + 1) % themes.length;
      const nextTheme = themes[nextIdx];
      document.documentElement.setAttribute("data-theme", nextTheme);
      activeConfig.theme = nextTheme;
      themeSwitchBtn.querySelector(".theme-name").innerText = nextTheme.charAt(0).toUpperCase() + nextTheme.slice(1);
    });
  }

  // =========================================================================
  // 9. RAZORPAY ₹99 PAYMENT GATEWAY & SHORTLINK INTEGRATION
  // =========================================================================
  const btnUnlockPayment = document.getElementById("btnUnlockPayment");
  if (btnUnlockPayment) {
    btnUnlockPayment.addEventListener("click", initiateRazorpayPayment);
  }

  async function initiateRazorpayPayment() {
    showToast("Connecting to Razorpay Secure Gateway (₹99)... 🔒");

    let orderData = null;
    try {
      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 9900,
          currency: "INR",
          receipt: "rcpt_unlock_" + Date.now(),
          notes: {
            template: "Bestie Friendship",
            friendName: activeConfig.friendName
          }
        })
      });

      if (orderRes.ok) {
        orderData = await orderRes.json();
      }
    } catch (err) {
      console.warn("Backend order creation notice:", err);
    }

    const keyId = (orderData && orderData.key_id) || "rzp_live_TnxqOG4GfR4ZXi";
    const orderId = (orderData && orderData.order_id) || "order_sim_" + Date.now();

    if (typeof Razorpay !== "undefined") {
      const options = {
        key: keyId,
        amount: 9900,
        currency: "INR",
        name: "Vanvi Moments",
        description: `Unlock Bestie Friendship Page for ${activeConfig.friendName} (₹99)`,
        image: "https://cdn.cutiepage.in/template-seeds/girlfriends-day/gallery1.jpeg",
        order_id: orderData ? orderData.order_id : undefined,
        prefill: {
          name: activeConfig.friendName || "Best Friend",
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
            showToast("Payment canceled.");
          }
        }
      };

      try {
        const rzp = new Razorpay(options);
        rzp.open();
        return;
      } catch (e) {
        console.warn("Razorpay opening error:", e);
      }
    }

    // Simulation / test prompt
    const proceedSim = confirm("⚡ Razorpay Gateway Ready (₹99 INR).\n\nDo you want to confirm the payment of ₹99 and generate the permanent shortlink?");
    if (proceedSim) {
      await handlePaymentSuccess("pay_sim_" + Date.now(), orderId);
    }
  }

  async function handlePaymentSuccess(paymentId, orderId) {
    showToast("💾 Saving microsite to Supabase database...");

    try {
      const saveRes = await fetch("/api/friendship/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payment_id: paymentId,
          order_id: orderId,
          config: activeConfig,
          friendName: activeConfig.friendName
        })
      });

      const resData = await saveRes.json();
      if (resData && resData.success) {
        const shortUrl = resData.shortUrl || `https://vanvimoments.com/f/${resData.slug}`;
        displayCelebrationModal(shortUrl, activeConfig.friendName);
        showToast("🎉 Verified! Permanent shortlink: " + shortUrl);
      }
    } catch (err) {
      console.error("Save error:", err);
      const fallbackSlug = (activeConfig.friendName ? activeConfig.friendName.toLowerCase().replace(/[^a-z0-9]/g, "-") : "bestie") + "-" + Math.random().toString(36).substr(2, 5);
      displayCelebrationModal(`https://vanvimoments.com/f/${fallbackSlug}`, activeConfig.friendName);
    }
  }

  function displayCelebrationModal(shortUrl, friendName) {
    const modal = document.getElementById("celebrationModal");
    const input = document.getElementById("celebrationShortlinkInput");
    const waBtn = document.getElementById("celebrationWaBtn");

    if (input) input.value = shortUrl;
    if (waBtn) {
      const msg = encodeURIComponent(`🎈 Hey ${friendName || "Bestie"}! I made a personalized Friendship keepsake page just for you on Vanvi Moments! Look here: ${shortUrl}`);
      waBtn.href = `https://api.whatsapp.com/send?text=${msg}`;
    }
    if (modal) {
      modal.style.display = "flex";
    }
  }

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

  function showToast(msg) {
    const hub = document.getElementById("toastHub");
    if (!hub) return;
    const toast = document.createElement("div");
    toast.className = "toast-pill";
    toast.innerText = msg;
    hub.appendChild(toast);
    setTimeout(() => {
      toast.style.transition = "opacity 0.3s ease";
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // Live Builder postMessage communication
  window.addEventListener("message", (event) => {
    if (event.data && event.data.type === "UPDATE_CONFIG") {
      applyConfig(event.data.config);
    }
  });

  // Initialization & Remote Shortlink Loader
  document.addEventListener("DOMContentLoaded", () => {
    // 1. Check if shortlink slug is provided via URL (?f=:slug or ?slug=:slug)
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get("f") || urlParams.get("slug") || urlParams.get("id");

    if (slug) {
      fetch(`/api/friendship/${encodeURIComponent(slug)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success && data.data && data.data.config) {
            applyConfig(data.data.config);
          } else {
            applyConfig(activeConfig);
          }
        })
        .catch(() => applyConfig(activeConfig));
    } else {
      applyConfig(activeConfig);
    }

    setTimeout(initScratchCards, 300);
  });

})();
