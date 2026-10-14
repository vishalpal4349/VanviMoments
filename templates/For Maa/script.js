/**
 * =====================================================================
 * VANVI MOMENTS — FOR MAA RUNTIME SCRIPT
 * Bilingual Audio-Synthesized Emotional Interactive Keepsake
 * =====================================================================
 */

(function () {
  'use strict';

  var RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return [].slice.call((c || document).querySelectorAll(s)); };

  /* ═════════ BILINGUAL STRINGS ═════════ */
  var STR = {
    en: {
      edit: "EDIT",
      setupH: "She's been saying<br>the same things for years.",
      setupP: "Write down what you actually understood. That's the whole gift.",
      calling: "is calling",
      pickup: "TAP GREEN TO PICK UP",
      pLbl: "THINGS YOU ALWAYS SAY",
      pH: "I knew what<br>each one meant.",
      pHint: "Tap each one to turn it over.",
      pDone: "That's all of them.",
      pLeft: "# more",
      goOn: "Go on",
      nLbl: "AND ONE THING I NEVER SAID OUT LOUD",
      rLbl: "NOW YOU SAY SOMETHING",
      rH: "Send it straight<br>back to them.",
      sendIt: "Send on WhatsApp",
      copy: "Copy the link",
      again: "Read it again",
      closeK: "THEY'LL GET THIS",
      copied: "Link copied to clipboard! ✨",
      whatSaid: "SHE SAYS",
      whatMeant: "WHAT I HEARD"
    },
    hi: {
      edit: "बदलें",
      setupH: "वो सालों से<br>यही बातें कहती आ रही हैं।",
      setupP: "लिखिए कि आपने असल में क्या समझा। यही पूरा तोहफ़ा है।",
      calling: "कॉल कर रहे हैं",
      pickup: "उठाने के लिए हरा दबाएँ",
      pLbl: "जो आप हमेशा कहती हैं",
      pH: "मुझे हर एक का<br>मतलब पता था।",
      pHint: "हर एक को पलटने के लिए दबाएँ।",
      pDone: "बस, इतना ही था।",
      pLeft: "# और",
      goOn: "आगे बढ़ें",
      nLbl: "और एक बात जो मैंने कभी नहीं कही",
      rLbl: "अब आप कुछ कहिए",
      rH: "सीधा उन्हें<br>वापस भेजिए।",
      sendIt: "WhatsApp पर भेजें",
      copy: "लिंक कॉपी करें",
      again: "फिर से पढ़ें",
      closeK: "उन्हें ये मिलेगा",
      copied: "लिंक कॉपी हो गया! ✨",
      whatSaid: "वो कहती हैं",
      whatMeant: "मैंने जो सुना"
    }
  };

  var DEF = {
    en: [
      ["Have you eaten?", "She was never asking about food. She was asking if I was okay."],
      ["Take a jacket, it gets cold.", "She had already checked the weather for a city she doesn't live in."],
      ["Do you need money?", "She'd worked out my rent was due before I had."],
      ["I'm fine, don't worry about me.", "This was never true. Not once."],
      ["Call when you reach.", "She stayed awake until I did. Every single time."]
    ],
    hi: [
      ["खाना खाया?", "वो कभी खाने के बारे में नहीं पूछ रही थीं। वो पूछ रही थीं कि मैं ठीक हूँ या नहीं।"],
      ["जैकेट ले जाना, ठंड लगेगी।", "उन्होंने उस शहर का मौसम देख लिया था जहाँ वो रहती भी नहीं।"],
      ["पैसे चाहिए क्या?", "उन्हें मुझसे पहले याद रहता था कि किराया कब देना है।"],
      ["मैं ठीक हूँ, मेरी चिंता मत करो।", "ये कभी सच नहीं था। एक बार भी नहीं।"],
      ["पहुँच के फ़ोन करना।", "जब तक मैं नहीं करता, वो जागती रहती थीं। हर बार।"]
    ]
  };

  var REPLY = {
    en: [
      ["know", "I know, beta.", "She knew all the way through. She just never said it either.", "I read your message. I knew, beta. — always did."],
      ["call", "Now call me properly.", "A page is a page. She wants the voice.", "I saw the page you made. Now call me properly."],
      ["come", "Just come home.", "No further discussion. That's the whole answer.", "I saw it. Now just come home soon."]
    ],
    hi: [
      ["know", "पता है, बेटा।", "उन्हें हमेशा पता था। बस उन्होंने भी कभी कहा नहीं।", "मैंने तुम्हारा तोहफ़ा पढ़ लिया। मुझे पता था, बेटा — हमेशा से।"],
      ["call", "अब ठीक से फ़ोन करो।", "पन्ना पन्ना है। उन्हें आवाज़ चाहिए।", "देख लिया मैंने। अब आवाज़ सुनने के लिए फ़ोन करो।"],
      ["come", "बस घर आ जाओ।", "इससे आगे कोई बात नहीं। यही पूरा जवाब है।", "सब देख लिया। अब जल्दी घर आ जाओ।"]
    ]
  };

  var META_THEMES = {
    haldi: "#FFF8EC", tulsi: "#F1F6EC", chandan: "#F7EFE3", rose: "#FFF1F3",
    sepia: "#EFE6D5", mint: "#EAF7F0", marigold: "#3B0A1E", ember: "#1A0F0A",
    indigo: "#141046", paper: "#F5F0E4"
  };

  var D = {
    to: "Maa",
    from: "Your child",
    never: "Thank you. Out loud, properly, once.",
    note: "You never once asked me to notice. I noticed anyway.",
    theme: "haldi",
    said: [],
    meant: [],
    photo: null,
    isPublished: false
  };

  for (var i = 0; i < 5; i++) {
    D.said[i] = DEF.en[i][0];
    D.meant[i] = DEF.en[i][1];
  }

  var LANG = "en";
  var chosen = 0;
  var flipped = {};
  var cur = 1;
  var TOTAL = 6;
  var clean = null;
  var noteDone = false;
  var phrasesBuilt = false;

  function T(k) {
    return (STR[LANG] && STR[LANG][k]) || STR.en[k] || "";
  }

  function defPair(idx) {
    return (DEF[LANG] || DEF.en)[idx];
  }

  function getSaid(idx) {
    return D.said[idx] || defPair(idx)[0];
  }

  function getMeant(idx) {
    return D.meant[idx] || defPair(idx)[1];
  }

  function setTheme(t) {
    if (!t) t = "haldi";
    t = t.toLowerCase();
    if (!META_THEMES[t]) t = "haldi";
    D.theme = t;
    document.documentElement.dataset.theme = t;
    var metaTag = $('meta[name="theme-color"]');
    if (metaTag) metaTag.setAttribute("content", META_THEMES[t]);
  }

  function applyLang() {
    document.documentElement.dataset.lang = LANG;
    document.documentElement.lang = (LANG === "hi") ? "hi" : "en";
    $$("[data-t]").forEach(function (el) {
      var v = T(el.dataset.t);
      if (v) el.innerHTML = v;
    });
    var langBtn = $("#langBtn");
    if (langBtn) langBtn.textContent = (LANG === "hi") ? "English" : "हिंदी";
    renderPhrases(true);
    buildReplies();
    paint();
  }

  function paint() {
    var to = D.to || "Maa";
    var from = D.from || (LANG === "hi" ? "आपका बच्चा" : "Your child");

    var callName = $("#callName");
    if (callName) callName.textContent = from;

    var avImg = $("#avImg");
    var avFallback = $("#avFallback");
    if (D.photo) {
      if (avImg) { avImg.src = D.photo; avImg.style.display = "block"; }
      if (avFallback) avFallback.style.display = "none";
    } else {
      if (avImg) avImg.style.display = "none";
      if (avFallback) avFallback.style.display = "block";
    }

    var neverTxt = $("#neverTxt");
    if (neverTxt) {
      neverTxt.textContent = D.never || (LANG === "hi"
        ? "शुक्रिया। ज़ुबान से, ठीक से, एक बार।"
        : "Thank you. Out loud, properly, once.");
    }

    var noteHi = $("#noteHi");
    if (noteHi) noteHi.textContent = to + ",";

    var noteBody = $("#noteBody");
    if (noteBody) {
      noteBody.textContent = D.note || (LANG === "hi"
        ? "आपने कभी नहीं कहा कि ध्यान दो। मैंने फिर भी दिया।"
        : "You never once asked me to notice. I noticed anyway.");
    }

    var noteSign = $("#noteSign");
    if (noteSign) noteSign.textContent = "— " + from;

    var endCredit = $("#endCredit");
    if (endCredit) {
      endCredit.textContent = (LANG === "hi"
        ? (from + " की तरफ़ से, " + to + " के लिए • VANVI MOMENTS")
        : ("Made by " + from + ", for " + to + " • VANVI MOMENTS")).toUpperCase();
    }

    // Watermark check
    var urlParams = new URLSearchParams(window.location.search);
    var isPub = urlParams.get("published") === "true" ||
                localStorage.getItem("vanvi_for_maa_published") === "true" ||
                D.isPublished;
    if (isPub) {
      document.body.classList.add("is-published");
    } else {
      document.body.classList.remove("is-published");
    }
  }

  function renderPhrases(rebuild) {
    var box = $("#phrases");
    if (!box) return;
    if (!rebuild && phrasesBuilt) return;
    box.innerHTML = "";
    phrasesBuilt = true;
    var frag = document.createDocumentFragment();

    for (var i = 0; i < 5; i++) {
      (function (idx) {
        var c = document.createElement("button");
        c.className = "pcard" + (flipped[idx] ? " flip" : "");
        c.type = "button";
        c.dataset.i = idx;
        c.innerHTML = '<span class="side front">' +
            '<span class="said"></span><span class="tag">' + T("whatSaid") + '</span></span>' +
          '<span class="side back">' +
            '<span class="k">' + T("whatMeant") + '</span><span class="meant"></span></span>';
        c.querySelector(".said").textContent = getSaid(idx);
        c.querySelector(".meant").textContent = getMeant(idx);
        frag.appendChild(c);
      })(i);
    }
    box.appendChild(frag);
    updatePhint();
  }

  function updatePhint() {
    var n = Object.keys(flipped).length;
    var phint = $("#phint");
    var pNext = $("#pNext");
    if (n >= 5) {
      if (phint) phint.textContent = T("pDone");
      if (pNext) pNext.style.display = "flex";
    } else if (n === 0) {
      if (phint) phint.textContent = T("pHint");
    } else {
      if (phint) phint.textContent = T("pLeft").replace("#", 5 - n);
    }
  }

  function runNote() {
    if (noteDone) return;
    noteDone = true;
    var ps = $$("p", $("#note"));
    ps.forEach(function (pp, idx) {
      setTimeout(function () {
        pp.classList.add("in");
        if (idx === ps.length - 1) {
          var btn = $("#noteNext");
          if (btn) btn.style.display = "inline-flex";
        }
      }, RM ? 0 : 550 * (idx + 1));
    });
  }

  function buildReplies() {
    var box = $("#replies");
    if (!box) return;
    box.innerHTML = "";
    var list = REPLY[LANG] || REPLY.en;
    var frag = document.createDocumentFragment();
    list.forEach(function (r, idx) {
      var b = document.createElement("button");
      b.className = "reply";
      b.type = "button";
      b.dataset.i = idx;
      b.innerHTML = "<b></b><span></span>";
      b.querySelector("b").textContent = r[1];
      b.querySelector("span").textContent = r[2];
      frag.appendChild(b);
    });
    box.appendChild(frag);
  }

  var screens = $$(".screen");
  var ENTER = {
    2: function () { renderPhrases(false); },
    4: runNote,
    5: buildReplies
  };

  function go(n) {
    if (n === cur) return;
    var target = $('.screen[data-s="' + n + '"]');
    var current = $('.screen[data-s="' + cur + '"]');
    if (!target || !current) return;

    if (clean) clearTimeout(clean);
    current.classList.remove("on");
    current.classList.add("out");
    clean = setTimeout(function () {
      current.classList.remove("out");
      clean = null;
    }, 280);

    target.classList.add("on");
    target.scrollTop = 0;
    cur = n;

    if (ENTER[n]) ENTER[n]();
  }

  /* Web Audio Synthesized Chimes */
  var AC = null;
  function tone(f, dur) {
    if (RM) return;
    try {
      if (!AC) {
        var C = window.AudioContext || window.webkitAudioContext;
        if (!C) return;
        AC = new C();
      }
      if (AC.state === 'suspended') {
        AC.resume();
      }
      var o = AC.createOscillator();
      var g2 = AC.createGain();
      var t = AC.currentTime;
      o.type = "sine";
      o.frequency.value = f;
      g2.gain.setValueAtTime(0, t);
      g2.gain.linearRampToValueAtTime(0.08, t + 0.02);
      g2.gain.exponentialRampToValueAtTime(0.0001, t + (dur || 0.45));
      o.connect(g2);
      g2.connect(AC.destination);
      o.start(t);
      o.stop(t + (dur || 0.45) + 0.05);
    } catch (e) {}
  }

  function burst() {
    if (RM) return;
    var cs = getComputedStyle(document.documentElement);
    var cols = ["--accent", "--warm", "--leaf", "--soft"].map(function (v) {
      return cs.getPropertyValue(v).trim();
    });
    var frag = document.createDocumentFragment();
    var made = [];
    for (var i = 0; i < 28; i++) {
      var b = document.createElement("i");
      var w = 4 + Math.random() * 5;
      b.className = "bit";
      b.style.cssText = "left:" + (Math.random() * 100) + "vw; width:" + w + "px; height:" +
        (w * (2.2 + Math.random() * 2.5)) + "px; background:" + cols[i & 3] + "; opacity:" + (0.6 + Math.random() * 0.4);
      frag.appendChild(b);
      made.push(b);
    }
    document.body.appendChild(frag);
    made.forEach(function (b) {
      b.animate([
        { transform: "translateY(0) rotate(0)" },
        { transform: "translateY(" + (window.innerHeight + 80) + "px) rotate(" + (Math.random() * 640 - 320) + "deg)" }
      ], {
        duration: 2400 + Math.random() * 1800,
        easing: "cubic-bezier(.3,.1,.6,1)"
      }).onfinish = function () { b.remove(); };
    });
  }

  var tT;
  var tEl = $("#toast");
  function toast(m) {
    if (!tEl) return;
    tEl.textContent = m;
    tEl.classList.add("on");
    clearTimeout(tT);
    tT = setTimeout(function () { tEl.classList.remove("on"); }, 2200);
  }

  function bindEvents() {
    var answerBtn = $("#answerBtn");
    if (answerBtn) {
      answerBtn.addEventListener("click", function () {
        tone(523, 0.5);
        go(2);
      });
    }

    var phrasesBox = $("#phrases");
    if (phrasesBox) {
      phrasesBox.addEventListener("click", function (e) {
        var c = e.target.closest(".pcard");
        if (!c) return;
        var idx = +c.dataset.i;
        if (flipped[idx]) return;
        flipped[idx] = true;
        c.classList.add("flip");
        tone(392 + Object.keys(flipped).length * 40, 0.4);
        updatePhint();
      });
    }

    var repliesBox = $("#replies");
    if (repliesBox) {
      repliesBox.addEventListener("click", function (e) {
        var b = e.target.closest(".reply");
        if (!b) return;
        chosen = +b.dataset.i;
        var r = (REPLY[LANG] || REPLY.en)[chosen];
        var closeK = $("#closeK");
        var closeR = $("#closeR");
        var closeS = $("#closeS");
        if (closeK) closeK.textContent = T("closeK");
        if (closeR) closeR.textContent = r[1];
        if (closeS) closeS.textContent = r[2];
        tone(523, 0.9);
        burst();
        go(6);
      });
    }

    $$("[data-go]").forEach(function (b) {
      b.addEventListener("click", function () {
        go(+b.dataset.go);
      });
    });

    var langBtn = $("#langBtn");
    if (langBtn) {
      langBtn.addEventListener("click", function () {
        LANG = (LANG === "hi") ? "en" : "hi";
        applyLang();
      });
    }

    var copyBtn = $("#copyBtn");
    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        navigator.clipboard.writeText(window.location.href).then(function () {
          toast(T("copied"));
        }).catch(function () {
          prompt("Copy link:", window.location.href);
        });
      });
    }

    var replyBtn = $("#replyBtn");
    if (replyBtn) {
      replyBtn.addEventListener("click", function () {
        var msg = (REPLY[LANG] || REPLY.en)[chosen][3];
        var fullText = encodeURIComponent(msg + "\n\n" + window.location.href);
        window.open("https://api.whatsapp.com/send?text=" + fullText, "_blank");
      });
    }

    var againBtn = $("#againBtn");
    if (againBtn) {
      againBtn.addEventListener("click", function () {
        flipped = {};
        phrasesBuilt = false;
        noteDone = false;
        $$(".pcard").forEach(function (c) { c.classList.remove("flip"); });
        $$(".note p").forEach(function (p) { p.classList.remove("in"); });
        var pNext = $("#pNext");
        if (pNext) pNext.style.display = "none";
        var noteNext = $("#noteNext");
        if (noteNext) noteNext.style.display = "none";
        go(1);
      });
    }
  }

  /* Live sync from Builder */
  function applyLive(payload) {
    if (!payload || typeof payload !== "object") return;
    if (payload.to != null) D.to = String(payload.to).trim().slice(0, 20);
    if (payload.from != null) D.from = String(payload.from).trim().slice(0, 22);
    if (payload.never != null) D.never = String(payload.never).trim().slice(0, 200);
    if (payload.note != null) D.note = String(payload.note).trim().slice(0, 360);
    if (payload.theme) setTheme(String(payload.theme));
    if (payload.photo !== undefined) D.photo = payload.photo;
    if (payload.isPublished !== undefined) D.isPublished = payload.isPublished;

    if (Array.isArray(payload.said)) {
      for (var i = 0; i < 5; i++) {
        if (payload.said[i] != null) D.said[i] = String(payload.said[i]).trim().slice(0, 70);
      }
    }
    if (Array.isArray(payload.meant)) {
      for (var j = 0; j < 5; j++) {
        if (payload.meant[j] != null) D.meant[j] = String(payload.meant[j]).trim().slice(0, 110);
      }
    }

    renderPhrases(true);
    paint();
  }

  window.addEventListener("message", function (ev) {
    var data = ev.data || {};
    if (data.type === "vault-live" || data.type === "VANVI_CONFIG_UPDATE") {
      applyLive(data.payload || data.config || {});
    }
  });

  document.addEventListener("DOMContentLoaded", function () {
    var urlParams = new URLSearchParams(window.location.search);
    var dataParam = urlParams.get("data");
    if (dataParam) {
      try {
        var decoded = JSON.parse(decodeURIComponent(escape(atob(dataParam))));
        Object.assign(D, decoded);
      } catch (err) {}
    } else {
      if (urlParams.get("to")) D.to = urlParams.get("to");
      if (urlParams.get("from")) D.from = urlParams.get("from");
      if (urlParams.get("theme")) D.theme = urlParams.get("theme");
      if (urlParams.get("never")) D.never = urlParams.get("never");
      if (urlParams.get("note")) D.note = urlParams.get("note");
    }

    setTheme(D.theme);
    applyLang();
    bindEvents();
  });

})();
